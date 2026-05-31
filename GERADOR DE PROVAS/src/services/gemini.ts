import { GoogleGenAI, Type, GenerateContentParameters } from '@google/genai';

// --- PROVIDER MANAGEMENT ---
type ProviderName = 'gemini' | 'groq' | 'openrouter' | 'nvidia' | 'gemini-flash' | 'local';
export type GenerationMode = 'economico' | 'rapido' | 'completo';

export interface GenerationOptions {
  mode?: GenerationMode;
  resumeDraft?: boolean;
}

interface ProviderStatus {
  name: ProviderName;
  label: string;
  available: boolean;
  lastError?: string;
}

let currentProvider: ProviderName = 'gemini';
const providerListeners: Array<(provider: ProviderName) => void> = [];
const providerCooldownUntil: Partial<Record<ProviderName, number>> = {};

class ProviderApiError extends Error {
  public status?: number;
  public retryAfterMs?: number;
  public body?: string;

  constructor(message: string, status?: number, retryAfterMs?: number, body?: string) {
    super(message);
    this.name = 'ProviderApiError';
    this.status = status;
    this.retryAfterMs = retryAfterMs;
    this.body = body;
  }
}

export function onProviderChange(fn: (provider: ProviderName) => void) {
  providerListeners.push(fn);
  return () => { const idx = providerListeners.indexOf(fn); if (idx >= 0) providerListeners.splice(idx, 1); };
}

export function getCurrentProvider(): ProviderName { return currentProvider; }

function setCurrentProvider(p: ProviderName) {
  currentProvider = p;
  providerListeners.forEach(fn => fn(p));
}

function getRetryAfterMs(response: Response): number | undefined {
  const retryAfter = response.headers.get('retry-after');
  if (!retryAfter) return undefined;

  const seconds = Number(retryAfter);
  if (Number.isFinite(seconds)) return Math.max(1000, seconds * 1000);

  const retryDate = Date.parse(retryAfter);
  if (Number.isFinite(retryDate)) return Math.max(1000, retryDate - Date.now());

  return undefined;
}

function isQuotaLikeError(error: any): boolean {
  const errorString = `${error?.message || ''} ${error?.body || ''} ${JSON.stringify(error, Object.getOwnPropertyNames(error || {}))}`.toUpperCase();
  return (
    error?.status === 429 ||
    error?.code === 429 ||
    errorString.includes('429') ||
    errorString.includes('RESOURCE_EXHAUSTED') ||
    errorString.includes('QUOTA') ||
    errorString.includes('LIMITE DE COTA') ||
    errorString.includes('LIMITE DIARIO') ||
    errorString.includes('LIMITE DIÁRIO') ||
    errorString.includes('RATE LIMIT')
  );
}

function markProviderCooldown(provider: ProviderName, error: any): void {
  if (!isQuotaLikeError(error)) return;

  const retryAfterMs = error?.retryAfterMs;
  const fallbackMs = `${error?.message || ''} ${error?.body || ''}`.toUpperCase().includes('DAILY')
    ? 60 * 60 * 1000
    : 5 * 60 * 1000;

  providerCooldownUntil[provider] = Date.now() + (retryAfterMs || fallbackMs);
}

function markProviderFailure(provider: ProviderName, error: any): void {
  if (isQuotaLikeError(error)) {
    markProviderCooldown(provider, error);
    return;
  }

  providerCooldownUntil[provider] = Date.now() + 2 * 60 * 1000;
}

function isProviderCoolingDown(provider: ProviderName): boolean {
  return (providerCooldownUntil[provider] || 0) > Date.now();
}

function getGenerationBatchSize(mode: GenerationMode = 'economico'): number {
  if (mode === 'economico') return 4;
  return 5;
}

function getQABatchSize(mode: GenerationMode = 'economico'): number {
  return 5;
}

// --- GEMINI INSTANCES ---
let aiInstance: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("A chave da API do Gemini não está configurada. Por favor, adicione a variável GEMINI_API_KEY no painel do Netlify.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

// --- GROQ API (OpenAI-compatible) ---
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

async function callGroq(systemPrompt: string, userPrompt: string): Promise<string> {
  if (!GROQ_API_KEY) throw new Error('GROQ_API_KEY não configurada');
  
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: systemPrompt + '\n\nRESPONDA ESTRITAMENTE EM JSON VÁLIDO. Não inclua texto fora do JSON.' },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      // 8000 is safe for Groq's TPM limits while still providing ample space for concise 50+ questions.
      // Do NOT use response_format: json_object here — it causes silent truncation on large outputs
      max_tokens: 8000,
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new ProviderApiError(`Groq API error ${response.status}: ${errBody}`, response.status, getRetryAfterMs(response), errBody);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '{}';
  const finishReason = data.choices?.[0]?.finish_reason;
  if (finishReason === 'length') {
    console.warn('Groq: resposta truncada pelo limite de tokens (finish_reason=length)');
  }
  return content;
}

// --- OPENROUTER API (OpenAI-compatible free LLMs) ---
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct:free';

async function callOpenRouter(systemPrompt: string, userPrompt: string): Promise<string> {
  if (!OPENROUTER_API_KEY) throw new Error('OPENROUTER_API_KEY não configurada');
  
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'https://profmathub.netlify.app',
      'X-Title': 'ProfMatHub',
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [
        { role: 'system', content: systemPrompt + '\n\nRESPONDA ESTRITAMENTE EM JSON VÁLIDO. Não inclua texto fora do JSON.' },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 16384,
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new ProviderApiError(`OpenRouter API error ${response.status}: ${errBody}`, response.status, getRetryAfterMs(response), errBody);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '{}';
}

// --- NVIDIA API (OpenAI-compatible premium NIM models) ---
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || '';
const NVIDIA_MODEL = process.env.NVIDIA_MODEL || 'meta/llama-3.3-70b-instruct';

function hasRemoteProviderConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY || GROQ_API_KEY || OPENROUTER_API_KEY || NVIDIA_API_KEY);
}

async function callNvidia(systemPrompt: string, userPrompt: string): Promise<string> {
  if (!NVIDIA_API_KEY) throw new Error('NVIDIA_API_KEY não configurada');
  
  // Use relative proxy path in browser to bypass CORS restrictions
  const isBrowser = typeof window !== 'undefined';
  const apiEndpoint = isBrowser ? '/api/nvidia/chat/completions' : 'https://integrate.api.nvidia.com/v1/chat/completions';
  
  const response = await fetch(apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${NVIDIA_API_KEY}`,
    },
    body: JSON.stringify({
      model: NVIDIA_MODEL,
      messages: [
        { role: 'system', content: systemPrompt + '\n\nRESPONDA ESTRITAMENTE EM JSON VÁLIDO. Não inclua texto fora do JSON.' },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 8000,
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new ProviderApiError(`NVIDIA API error ${response.status}: ${errBody}`, response.status, getRetryAfterMs(response), errBody);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '{}';
}

// Helper function for exponential backoff retry with timeout
async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout>;
  const timeoutPromise = new Promise<T>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`A requisição demorou mais de ${ms / 1000} segundos e foi cancelada pelo sistema.`));
    }, ms);
  });
  
  return Promise.race([
    promise,
    timeoutPromise
  ]).finally(() => {
    clearTimeout(timeoutId);
  });
}

export class RetryError extends Error {
  public retryLog: string[];
  constructor(message: string, retryLog: string[]) {
    super(message);
    this.name = 'RetryError';
    this.retryLog = retryLog;
  }
}

async function withRetry<T>(fn: () => Promise<T>, maxRetries = 5, onRetry?: (attempt: number, maxRetries: number, reason: string) => void, timeoutMs = 90000): Promise<T> {
  let lastError: any;
  const retryLog: string[] = [];
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      // 90 seconds timeout per attempt
      return await withTimeout(fn(), timeoutMs);
    } catch (error: any) {
      lastError = error;
      
      // Robust detection of quota/rate limit errors
      let errorString = '';
      if (error instanceof Error) {
        errorString = error.message;
        // Try to append any extra details attached to the error object
        try {
          errorString += ' ' + JSON.stringify(error, Object.getOwnPropertyNames(error));
        } catch (e) {
          // Ignore
        }
      } else {
        try {
          errorString = JSON.stringify(error);
        } catch (e) {
          errorString = String(error);
        }
      }
      errorString = errorString.toUpperCase();
      
      const isQuotaError = 
        errorString.includes('429') || 
        errorString.includes('RESOURCE_EXHAUSTED') || 
        errorString.includes('QUOTA') ||
        error?.status === 429 ||
        error?.code === 429;
        
      const isDailyQuotaError = isQuotaError && (
        errorString.includes('PERDAY') ||
        errorString.includes('LIMIT: 0') ||
        errorString.includes('DAILY') ||
        errorString.includes('DIARIO') ||
        errorString.includes('DIÁRIO')
      );
        
      const isJsonError = error instanceof SyntaxError || errorString.includes('SYNTAXERROR') || errorString.includes('JSON');
      const isTimeoutError = errorString.includes('CANCELADA PELO SISTEMA') || errorString.includes('TIMEOUT');
      
      const reason = isQuotaError ? 'Servidores sobrecarregados' : isTimeoutError ? 'Tempo limite excedido' : isJsonError ? 'Erro de formatação' : 'Erro desconhecido';
      const logEntry = `Tentativa ${i + 1}/${maxRetries} falhou: ${reason}. Detalhe: ${error?.message || errorString}`;
      retryLog.push(logEntry);

      if (isDailyQuotaError) {
        throw new RetryError('O limite diario de uso da API gratuita foi atingido. A prova sera completada por outro provedor ou pelo gerador local.', retryLog);
      }

      if (isQuotaError) {
        throw new RetryError('O provedor atingiu limite de cota. A prova sera completada por outro provedor ou pelo gerador local.', retryLog);
      }
      
      // Retries on ANY error except daily quota exhausted, until maxRetries is reached
      if (!isDailyQuotaError && i < maxRetries - 1) {
        // Extract retryDelay from error details if available
        let delay = 4000; // Default 4 seconds
        
        if (isQuotaError) {
          // Try to parse the retryDelay from the error message (e.g., "Please retry in 51.405989841s.")
          const retryMatch = errorString.match(/PLEASE RETRY IN ([\d.]+)S/);
          if (retryMatch && retryMatch[1]) {
            const parsedDelay = parseFloat(retryMatch[1]);
            if (!isNaN(parsedDelay)) {
              // Convert seconds to ms, round up, and add a 2-second buffer
              delay = Math.ceil(parsedDelay * 1000) + 2000; 
            }
          } else {
             // If we can't parse it, but it's a quota error, wait longer (e.g., 60 seconds)
             // because the API is telling us we are hitting limits hard.
             delay = 60000; 
          }
        }

        console.warn(`${reason}. Tentativa ${i + 1}/${maxRetries}. Reentando em ${Math.round(delay)}ms...`);
        
        if (onRetry) {
          onRetry(i + 1, maxRetries, reason);
        }
        
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      if (isDailyQuotaError) {
        throw new RetryError('O limite diário de uso da API gratuita foi atingido. Por favor, tente novamente amanhã ou configure uma chave de API com faturamento.', retryLog);
      }
      
      if (isQuotaError) {
        throw new RetryError('Os servidores do provedor de IA estão sobrecarregados ou o limite de cota foi atingido. Por favor, tente novamente em alguns minutos.', retryLog);
      }
      
      throw new RetryError(error?.message || 'Erro ao gerar conteúdo', retryLog);
    }
  }
  
  throw new Error('Erro inesperado: o loop de tentativas terminou sem retornar ou lançar um erro.');
}

// --- FALLBACK WRAPPER ---
// Tries primary (Gemini), then Groq, then OpenRouter, then Gemini Flash
async function withFallback<T>(
  geminiConfig: GenerateContentParameters,
  systemPrompt: string,
  userPrompt: string,
  parseResult: (text: string) => T,
  onRetry?: (attempt: number, maxRetries: number, reason: string) => void
): Promise<T> {
  let geminiErrorMsg = '';
  let nvidiaErrorMsg = '';
  let groqErrorMsg = '';
  let openrouterErrorMsg = '';
  let flashErrorMsg = '';

  // 1. Try primary Gemini model
  try {
    setCurrentProvider('gemini');
    const result = await withRetry(async () => {
      const response = await getAI().models.generateContent(geminiConfig);
      const text = response.text || '{}';
      return parseResult(text);
    }, 3, (attempt, max, reason) => onRetry?.(attempt, max, `Gemini: ${reason}`));
    return result;
  } catch (primaryError: any) {
    geminiErrorMsg = primaryError?.message || String(primaryError);
    console.warn('Gemini primary failed, trying NVIDIA fallback...', geminiErrorMsg);
    onRetry?.(1, 5, 'Alternando para NVIDIA Pro (Gemini indisponível)');
  }

  // 2. Try NVIDIA
  let nvidiaFailed = false;
  if (NVIDIA_API_KEY) {
    try {
      setCurrentProvider('nvidia');
      const result = await withRetry(async () => {
        const text = await callNvidia(systemPrompt, userPrompt);
        const parsed = parseResult(text);
        const anyResult = parsed as any;
        if (anyResult?.questions !== undefined && anyResult.questions.length === 0) {
          throw new Error('NVIDIA retornou lista de questões vazia (possível truncamento)');
        }
        return parsed;
      }, 2, (attempt, max, reason) => onRetry?.(attempt, max, `NVIDIA: ${reason}`));
      return result;
    } catch (nvidiaError: any) {
      nvidiaErrorMsg = nvidiaError?.message || String(nvidiaError);
      console.warn('NVIDIA fallback failed, trying Groq...', nvidiaErrorMsg);
      onRetry?.(2, 5, 'Alternando para Groq (NVIDIA falhou)');
      nvidiaFailed = true;
    }
  } else {
    nvidiaErrorMsg = 'Chave NVIDIA_API_KEY não configurada no Netlify';
    console.warn('NVIDIA API key not set, skipping to Groq...');
    onRetry?.(2, 5, 'NVIDIA não configurada, tentando Groq');
    nvidiaFailed = true;
  }

  // 3. Try Groq
  let groqFailed = false;
  if (nvidiaFailed) {
    if (GROQ_API_KEY) {
      try {
        setCurrentProvider('groq');
        const result = await withRetry(async () => {
          const text = await callGroq(systemPrompt, userPrompt);
          const parsed = parseResult(text);
          const anyResult = parsed as any;
          if (anyResult?.questions !== undefined && anyResult.questions.length === 0) {
            throw new Error('Groq retornou lista de questões vazia (possível truncamento)');
          }
          return parsed;
        }, 2, (attempt, max, reason) => onRetry?.(attempt, max, `Groq: ${reason}`));
        return result;
      } catch (groqError: any) {
        groqErrorMsg = groqError?.message || String(groqError);
        console.warn('Groq fallback failed, trying OpenRouter...', groqErrorMsg);
        onRetry?.(3, 5, 'Alternando para OpenRouter (Groq falhou)');
        groqFailed = true;
      }
    } else {
      groqErrorMsg = 'Chave GROQ_API_KEY não configurada no Netlify';
      console.warn('Groq API key not set, skipping to OpenRouter...');
      onRetry?.(3, 5, 'Groq não configurado, tentando OpenRouter');
      groqFailed = true;
    }
  }

  // 4. Try OpenRouter
  let openrouterFailed = false;
  if (groqFailed) {
    if (OPENROUTER_API_KEY) {
      try {
        setCurrentProvider('openrouter');
        const result = await withRetry(async () => {
          const text = await callOpenRouter(systemPrompt, userPrompt);
          return parseResult(text);
        }, 2, (attempt, max, reason) => onRetry?.(attempt, max, `OpenRouter: ${reason}`));
        return result;
      } catch (openrouterError: any) {
        openrouterErrorMsg = openrouterError?.message || String(openrouterError);
        console.warn('OpenRouter fallback failed, trying Gemini Flash...', openrouterErrorMsg);
        onRetry?.(4, 5, 'Alternando para Gemini Flash (OpenRouter falhou)');
        openrouterFailed = true;
      }
    } else {
      openrouterErrorMsg = 'Chave OPENROUTER_API_KEY não configurada no Netlify';
      console.warn('OpenRouter API key not set, skipping to Gemini Flash...');
      onRetry?.(4, 5, 'OpenRouter não configurado, tentando Gemini Flash');
      openrouterFailed = true;
    }
  }

  // 5. Try Gemini Flash (older stable model with separate quota bucket)
  try {
    setCurrentProvider('gemini-flash');
    const flashConfig = { ...geminiConfig, model: 'gemini-1.5-flash' };
    const result = await withRetry(async () => {
      const response = await getAI().models.generateContent(flashConfig);
      const text = response.text || '{}';
      return parseResult(text);
    }, 3, (attempt, max, reason) => onRetry?.(attempt, max, `Gemini Flash: ${reason}`));
    return result;
  } catch (flashError: any) {
    flashErrorMsg = flashError?.message || String(flashError);
    setCurrentProvider('gemini');
    throw new RetryError(
      'Todos os provedores falharam. Por favor, revise as chaves de API configuradas no painel do Netlify ou aguarde alguns minutos.',
      [
        `Gemini (2.5-Flash): ${geminiErrorMsg}`,
        `NVIDIA (${NVIDIA_MODEL}): ${NVIDIA_API_KEY ? `falhou (${nvidiaErrorMsg})` : 'não configurado'}`,
        `Groq (Llama-3.3-70B): ${GROQ_API_KEY ? `falhou (${groqErrorMsg})` : 'não configurado'}`,
        `OpenRouter (${OPENROUTER_MODEL}): ${OPENROUTER_API_KEY ? `falhou (${openrouterErrorMsg})` : 'não configurado'}`,
        `Gemini (1.5-Flash): ${flashErrorMsg}`
      ]
    );
  }
}

async function withFallbackSmart<T>(
  geminiConfig: GenerateContentParameters,
  systemPrompt: string,
  userPrompt: string,
  parseResult: (text: string) => T,
  onRetry?: (attempt: number, maxRetries: number, reason: string) => void
): Promise<T> {
  let geminiErrorMsg = '';
  let groqErrorMsg = '';
  let openrouterErrorMsg = '';
  let nvidiaErrorMsg = '';
  let flashErrorMsg = '';

  try {
    if (!process.env.GEMINI_API_KEY) throw new Error('Chave GEMINI_API_KEY nao configurada.');
    if (isProviderCoolingDown('gemini')) throw new Error('Gemini em pausa temporaria por limite recente.');
    setCurrentProvider('gemini');
    return await withRetry(async () => {
      const response = await getAI().models.generateContent(geminiConfig);
      return parseResult(response.text || '{}');
    }, 1, (attempt, max, reason) => onRetry?.(attempt, max, `Gemini: ${reason}`), 12000);
  } catch (error: any) {
    markProviderFailure('gemini', error);
    geminiErrorMsg = error?.message || String(error);
    console.warn('Gemini primary failed, trying Groq fallback...', geminiErrorMsg);
    onRetry?.(1, 5, 'Alternando para Groq (Gemini indisponivel)');
  }

  if (GROQ_API_KEY && !isProviderCoolingDown('groq')) {
    try {
      setCurrentProvider('groq');
      return await withRetry(async () => {
        const text = await callGroq(systemPrompt, userPrompt);
        const parsed = parseResult(text);
        const anyResult = parsed as any;
        if (anyResult?.questions !== undefined && anyResult.questions.length === 0) {
          throw new Error('Groq retornou lista de questoes vazia');
        }
        return parsed;
      }, 1, (attempt, max, reason) => onRetry?.(attempt, max, `Groq: ${reason}`), 12000);
    } catch (error: any) {
      markProviderFailure('groq', error);
      groqErrorMsg = error?.message || String(error);
      console.warn('Groq fallback failed, trying OpenRouter...', groqErrorMsg);
      onRetry?.(2, 5, 'Alternando para OpenRouter (Groq falhou)');
    }
  } else {
    groqErrorMsg = GROQ_API_KEY ? 'Groq em pausa temporaria por limite recente' : 'Chave GROQ_API_KEY nao configurada no Netlify';
    onRetry?.(2, 5, 'Groq indisponivel, tentando OpenRouter');
  }

  if (OPENROUTER_API_KEY && !isProviderCoolingDown('openrouter')) {
    try {
      setCurrentProvider('openrouter');
      return await withRetry(async () => {
        const text = await callOpenRouter(systemPrompt, userPrompt);
        return parseResult(text);
      }, 1, (attempt, max, reason) => onRetry?.(attempt, max, `OpenRouter: ${reason}`), 12000);
    } catch (error: any) {
      markProviderFailure('openrouter', error);
      openrouterErrorMsg = error?.message || String(error);
      console.warn('OpenRouter fallback failed, trying NVIDIA...', openrouterErrorMsg);
      onRetry?.(3, 5, 'Alternando para NVIDIA (OpenRouter falhou)');
    }
  } else {
    openrouterErrorMsg = OPENROUTER_API_KEY ? 'OpenRouter em pausa temporaria por limite recente' : 'Chave OPENROUTER_API_KEY nao configurada no Netlify';
    onRetry?.(3, 5, 'OpenRouter indisponivel, tentando NVIDIA');
  }

  if (NVIDIA_API_KEY && !isProviderCoolingDown('nvidia')) {
    try {
      setCurrentProvider('nvidia');
      return await withRetry(async () => {
        const text = await callNvidia(systemPrompt, userPrompt);
        const parsed = parseResult(text);
        const anyResult = parsed as any;
        if (anyResult?.questions !== undefined && anyResult.questions.length === 0) {
          throw new Error('NVIDIA retornou lista de questoes vazia');
        }
        return parsed;
      }, 1, (attempt, max, reason) => onRetry?.(attempt, max, `NVIDIA: ${reason}`), 12000);
    } catch (error: any) {
      markProviderFailure('nvidia', error);
      nvidiaErrorMsg = error?.message || String(error);
      console.warn('NVIDIA fallback failed, trying Gemini Flash...', nvidiaErrorMsg);
      onRetry?.(4, 5, 'Alternando para Gemini Flash (NVIDIA falhou)');
    }
  } else {
    nvidiaErrorMsg = NVIDIA_API_KEY ? 'NVIDIA em pausa temporaria por limite recente' : 'Chave NVIDIA_API_KEY nao configurada no Netlify';
    onRetry?.(4, 5, 'NVIDIA indisponivel, tentando Gemini Flash');
  }

  try {
    if (!process.env.GEMINI_API_KEY) throw new Error('Chave GEMINI_API_KEY nao configurada.');
    if (isProviderCoolingDown('gemini-flash')) throw new Error('Gemini Flash em pausa temporaria por limite recente.');
    setCurrentProvider('gemini-flash');
    const flashConfig = { ...geminiConfig, model: 'gemini-1.5-flash' };
    return await withRetry(async () => {
      const response = await getAI().models.generateContent(flashConfig);
      return parseResult(response.text || '{}');
    }, 1, (attempt, max, reason) => onRetry?.(attempt, max, `Gemini Flash: ${reason}`), 12000);
  } catch (error: any) {
    markProviderFailure('gemini-flash', error);
    flashErrorMsg = error?.message || String(error);
    setCurrentProvider('gemini');
    throw new RetryError(
      'Todos os provedores falharam. Revise as chaves no Netlify ou aguarde alguns minutos antes de tentar novamente.',
      [
        `Gemini (2.5-Flash): ${geminiErrorMsg}`,
        `Groq (Llama-3.3-70B): ${GROQ_API_KEY ? `falhou (${groqErrorMsg})` : 'nao configurado'}`,
        `OpenRouter (${OPENROUTER_MODEL}): ${OPENROUTER_API_KEY ? `falhou (${openrouterErrorMsg})` : 'nao configurado'}`,
        `NVIDIA (${NVIDIA_MODEL}): ${NVIDIA_API_KEY ? `falhou (${nvidiaErrorMsg})` : 'nao configurado'}`,
        `Gemini (1.5-Flash): ${flashErrorMsg}`
      ]
    );
  }
}

export interface ExamParams {
  school: string;
  customSchool?: string;
  activityTitle: string;
  grade: string;
  classRoom: string;
  date: string;
  teacher: string;
  value: string;
  questionCount: number;
  curriculum: string;
  topics: string;
  difficulty: string;
  context: string;
  includeMap?: boolean;
  isIndividual?: boolean;
  isGraded?: boolean;
  logoBase64?: string;
  subject: string;
}

export interface ExamQuestion {
  id: number;
  type: 'direta' | 'contextualizada';
  text: string;
  options?: string[];
  answer: string;
  explanation: string;
  metadata: {
    habilidadeIgarassu?: string;
    descritorMatrizLuz?: string;
    nivelComplexidade: string;
    unidadeTematica: string;
    objetoConhecimento: string;
  };
}

export interface ExamData {
  questions: ExamQuestion[];
}

const GENERATION_DRAFT_KEY = 'ais_exam_generation_draft_v1';

function buildDraftSignature(params: ExamParams): string {
  return JSON.stringify({
    subject: params.subject,
    grade: params.grade,
    curriculum: params.curriculum,
    topics: params.topics,
    questionCount: params.questionCount,
    difficulty: params.difficulty,
    context: params.context,
  });
}

function loadGenerationDraft(params: ExamParams): ExamQuestion[] {
  if (typeof localStorage === 'undefined') return [];

  try {
    const raw = localStorage.getItem(GENERATION_DRAFT_KEY);
    if (!raw) return [];

    const draft = JSON.parse(raw) as { signature: string; questions: ExamQuestion[] };
    if (draft.signature !== buildDraftSignature(params)) return [];

    return (draft.questions || []).slice(0, params.questionCount);
  } catch (error) {
    console.warn('Nao foi possivel ler o rascunho local da prova:', error);
    return [];
  }
}

function saveGenerationDraft(params: ExamParams, questions: ExamQuestion[]): void {
  if (typeof localStorage === 'undefined') return;

  try {
    localStorage.setItem(GENERATION_DRAFT_KEY, JSON.stringify({
      signature: buildDraftSignature(params),
      timestamp: Date.now(),
      questions,
    }));
  } catch (error) {
    console.warn('Nao foi possivel salvar o rascunho local da prova:', error);
  }
}

function clearGenerationDraft(params: ExamParams): void {
  if (typeof localStorage === 'undefined') return;

  try {
    const raw = localStorage.getItem(GENERATION_DRAFT_KEY);
    if (!raw) return;

    const draft = JSON.parse(raw) as { signature: string };
    if (draft.signature === buildDraftSignature(params)) {
      localStorage.removeItem(GENERATION_DRAFT_KEY);
    }
  } catch (error) {
    console.warn('Nao foi possivel limpar o rascunho local da prova:', error);
  }
}

function parseJSONWithFallback<T>(text: string): T {
  try {
    return JSON.parse(text) as T;
  } catch (error) {
    console.warn("Failed to parse JSON directly, attempting to sanitize...");
    
    // Extremely robust extraction between first '{' and last '}'
    let sanitized = text.trim();
    const firstBrace = sanitized.indexOf('{');
    const lastBrace = sanitized.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      sanitized = sanitized.slice(firstBrace, lastBrace + 1);
    } else {
      sanitized = sanitized.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
    }
    
    try {
      return JSON.parse(sanitized) as T;
    } catch (e2) {
      console.warn("Standard sanitization failed, checking for truncation recovery...");
      try {
        let lastClosedQuestionIdx = sanitized.lastIndexOf('}');
        while (lastClosedQuestionIdx > 0) {
          const substring = sanitized.slice(0, lastClosedQuestionIdx + 1);
          
          // Test with questions key
          try {
            const candidate = substring.trim() + '\n  ]\n}';
            const parsed = JSON.parse(candidate) as T;
            if (parsed && (parsed as any).questions && (parsed as any).questions.length > 0) {
              console.log(`🎉 Recuperado com sucesso via Truncation Recovery! ${(parsed as any).questions.length} questões recuperadas.`);
              return parsed;
            }
          } catch (e) {}
          
          // Test with questoes key
          try {
            const candidate = substring.trim() + '\n  ]\n}';
            const parsed = JSON.parse(candidate) as any;
            if (parsed && parsed.questoes && parsed.questoes.length > 0) {
              parsed.questions = parsed.questoes;
              console.log(`🎉 Recuperado com sucesso via Truncation Recovery (questoes)! ${parsed.questions.length} questões recuperadas.`);
              return parsed as T;
            }
          } catch (e) {}
          
          // Test if we just need to close array of questions directly if there is no outer questions key
          try {
            const candidate = '{\n  "questions": ' + substring.trim() + '\n}';
            const parsed = JSON.parse(candidate) as T;
            if (parsed && (parsed as any).questions && (parsed as any).questions.length > 0) {
              console.log(`🎉 Recuperado com sucesso via Truncation Recovery (direct array)! ${(parsed as any).questions.length} questões recuperadas.`);
              return parsed;
            }
          } catch (e) {}
          
          lastClosedQuestionIdx = sanitized.lastIndexOf('}', lastClosedQuestionIdx - 1);
        }
      } catch (truncationError) {
        console.error("Truncation recovery failed:", truncationError);
      }
      
      sanitized = sanitized.replace(/[\n\r\t]/g, ' ');
      sanitized = sanitized.replace(/,\s*([\]}])/g, '$1');
      return JSON.parse(sanitized) as T;
    }
  }
}

function getLocalDifficulty(params: ExamParams, index: number, totalQuestions: number): string {
  if (params.difficulty && params.difficulty !== 'Mesclado') return params.difficulty;

  const ratio = index / Math.max(1, totalQuestions);
  if (ratio < 0.34) return 'Facil';
  if (ratio < 0.67) return 'Medio';
  return 'Dificil';
}

function getLocalTopic(params: ExamParams, index: number): { unidadeTematica: string; objetoConhecimento: string } {
  const requestedTopic = params.topics?.trim();
  if (requestedTopic) {
    return {
      unidadeTematica: 'Matematica',
      objetoConhecimento: requestedTopic.slice(0, 40)
    };
  }

  const topics = [
    { unidadeTematica: 'Numeros', objetoConhecimento: 'Operacoes' },
    { unidadeTematica: 'Algebra', objetoConhecimento: 'Sequencias' },
    { unidadeTematica: 'Geometria', objetoConhecimento: 'Areas' },
    { unidadeTematica: 'Grandezas', objetoConhecimento: 'Medidas' },
    { unidadeTematica: 'Probabilidade', objetoConhecimento: 'Tabelas' },
  ];

  return topics[index % topics.length];
}

function getReferenceContext(params: ExamParams, index: number): string {
  if (params.context?.trim()) return params.context.trim();

  const contexts = [
    'a feira livre de Igarassu organizou barracas por setor e registrou o fluxo de visitantes',
    'uma turma analisou dados de transporte escolar entre bairros de Igarassu',
    'estudantes compararam gastos de uma excursao pedagogica ao Sitio Historico',
    'uma equipe montou uma tabela de desempenho em um simulado no estilo IFPE',
    'um projeto de horta escolar mediu canteiros retangulares e consumo de agua',
    'um clube de estudos resolveu um desafio inspirado em concursos de colegio militar',
    'uma pesquisa no patio da escola registrou preferencias por atividades esportivas',
    'um grafico no estilo ENEM comparou economia de energia em salas de aula',
    'uma biblioteca escolar acompanhou emprestimos de livros durante quatro semanas',
    'um grupo calculou o custo de materiais para uma mostra de matematica',
  ];

  return contexts[index % contexts.length];
}

function buildLocalQuestion(params: ExamParams, id: number, totalQuestions: number, objective: boolean): ExamQuestion {
  const gradeNumber = Number.parseInt(params.grade, 10) || 6;
  const level = getLocalDifficulty(params, id - 1, totalQuestions);
  const topic = getLocalTopic(params, id - 1);
  const context = getReferenceContext(params, id - 1);
  const base = gradeNumber + id;
  const factor = level === 'Dificil' ? 4 : level === 'Medio' ? 3 : 2;

  if (objective) {
    const correctValue = base * factor + id;
    const options = [
      correctValue,
      correctValue + factor,
      Math.max(1, correctValue - factor),
      correctValue + factor + id,
    ];
    const correctIndex = (id + gradeNumber) % 4;
    const rotated = options.map((_, idx) => options[(idx - correctIndex + 4) % 4]);
    const answer = ['A', 'B', 'C', 'D'][correctIndex];

    return {
      id,
      type: 'contextualizada',
      text: `Em ${context}, foram registrados $${base}$ grupos com $${factor}$ itens cada e mais $${id}$ itens avulsos. Qual foi o total registrado?`,
      options: rotated.map(value => `${value} itens`),
      answer,
      explanation: `${base} x ${factor} + ${id} = ${correctValue}.`,
      metadata: {
        habilidadeIgarassu: `EF0${Math.min(9, gradeNumber)}MA01-IGPE`,
        descritorMatrizLuz: 'D01',
        nivelComplexidade: level,
        unidadeTematica: topic.unidadeTematica,
        objetoConhecimento: topic.objetoConhecimento,
      }
    };
  }

  const firstValue = base * factor;
  const secondValue = id + gradeNumber;
  const answerValue = firstValue - secondValue;

  return {
    id,
    type: id % 2 === 0 ? 'contextualizada' : 'direta',
    text: `Em ${context}, havia $${firstValue}$ registros e $${secondValue}$ foram revisados. Quantos registros ficaram pendentes?`,
    options: [],
    answer: `${answerValue}`,
    explanation: `${firstValue} - ${secondValue} = ${answerValue}.`,
    metadata: {
      habilidadeIgarassu: `EF0${Math.min(9, gradeNumber)}MA02-IGPE`,
      descritorMatrizLuz: 'D02',
      nivelComplexidade: level,
      unidadeTematica: topic.unidadeTematica,
      objetoConhecimento: topic.objetoConhecimento,
    }
  };
}

function buildLocalQuestionBatch(
  params: ExamParams,
  startId: number,
  count: number,
  objectiveCount: number,
  totalQuestions: number
): ExamQuestion[] {
  return Array.from({ length: count }, (_, idx) => {
    const id = startId + idx;
    return buildLocalQuestion(params, id, totalQuestions, idx < objectiveCount);
  });
}

export async function generateExam(params: ExamParams, onRetry?: (attempt: number, maxRetries: number, reason: string) => void, options: GenerationOptions = {}): Promise<ExamData> {
  let localContext = '';
  let bankOfContexts = '';

  if (params.curriculum === 'Matriz da Luz') {
    localContext = 'focando em São Lourenço da Mata e um contexto genérico de Pernambuco';
    bankOfContexts = '- Banco de Contextos Locais (São Lourenço da Mata/PE): Patrimônio Histórico (Igreja Matriz de São Lourenço, Engenhos), Geografia e Urbanismo (Centro, Rio Capibaribe, Arena de Pernambuco), Cotidiano (Feira livre, Mercado Público, transporte, comércio local).';
  } else if (params.curriculum === 'Currículo de Igarassu') {
    localContext = 'focando em Igarassu';
    bankOfContexts = '- Banco de Contextos Locais (Igarassu/PE): Patrimônio Histórico (Forte Orange, Sítio Histórico, Convento), Geografia e Urbanismo (Cruz de Rebouças, Centro, Rio Igarassu, Praia do Capitão), Cotidiano (Feira livre, Mercado Público, transporte).';
  } else {
    localContext = 'focando em Igarassu e São Lourenço da Mata, ou um contexto genérico de Pernambuco';
    bankOfContexts = '- Banco de Contextos Locais: Misture elementos de Igarassu (Forte Orange, Sítio Histórico) e São Lourenço da Mata (Arena de Pernambuco, Engenhos), além de contextos genéricos do cotidiano.';
  }

  const totalQuestions = params.questionCount;
  const targetObjective = Math.round(totalQuestions * 0.20);
  const targetOpen = totalQuestions - targetObjective;

  let generatedObjective = 0;
  let generatedOpen = 0;
  let allQuestions: ExamQuestion[] = options.resumeDraft === false ? [] : loadGenerationDraft(params);
  
  allQuestions.forEach(q => {
    if (q.options && q.options.length > 0) {
      generatedObjective++;
    } else {
      generatedOpen++;
    }
  });

  const batchSize = getGenerationBatchSize(options.mode);
  const totalBatches = Math.ceil(totalQuestions / batchSize);
  
  if (allQuestions.length > 0) {
    onRetry?.(1, totalBatches, `Retomando rascunho local com ${allQuestions.length} questoes prontas`);
  }

  for (let startId = allQuestions.length + 1; startId <= totalQuestions; startId += batchSize) {
    const currentBatchSize = Math.min(batchSize, totalQuestions - startId + 1);
    const currentBatchNum = Math.ceil(startId / batchSize);
    
    // Calculate how many objective and open questions to request in this batch
    let batchObjective = 0;
    let batchOpen = 0;
    
    for (let j = 0; j < currentBatchSize; j++) {
      if (generatedObjective + batchObjective < targetObjective) {
        batchObjective++;
      } else {
        batchOpen++;
      }
    }
    
    // Summarize previously generated questions to avoid repeats
    const previousQuestionsSummary = allQuestions.length > 0 
      ? allQuestions.map(q => `- Questão ${q.id} (Tema: ${q.metadata.objetoConhecimento}, Nível: ${q.metadata.nivelComplexidade}): ${q.text.slice(0, 100)}...`).join('\n')
      : 'Nenhuma questão gerada ainda.';

    const systemInstruction = `Você é um gerador avançado de provas de Matemática para os anos finais do Ensino Fundamental (6º ao 9º ano). Seu objetivo é criar avaliações precisas, dinâmicas, altamente contextualizadas com a realidade local de Pernambuco (${localContext}) e rigorosamente alinhadas às diretrizes curriculares escolhidas pelo usuário.

REGRA ABSOLUTA DE QUANTIDADE DE QUESTÕES (CRÍTICO):
Nesta chamada de lote, você DEVE gerar EXATAMENTE ${currentBatchSize} questões (IDs de ${startId} até ${startId + currentBatchSize - 1})! O array "questions" DEVE conter precisamente ${currentBatchSize} itens, nem mais, nem menos.

REGRAS DA BASE CURRICULAR:
- Se "Currículo de Igarassu": Use as habilidades locais baseadas na BNCC (Ex: EF06MA01-IGPE).
- Se "Matriz da Luz": Use os Descritores da Matriz (Ex: D01, D14).
- Se "Ambos": Cada questão deve cruzar um Objeto de Conhecimento do Currículo de Igarassu com um Descritor compatível da Matriz da Luz.

ESTRUTURA E PROPORÇÃO DO LOTE:
- Você deve gerar EXATAMENTE ${currentBatchSize} questões nesta chamada de lote.
- Dessas ${currentBatchSize} questões, EXATAMENTE ${batchObjective} DEVEM ser OBJETIVAS (múltipla escolha com 4 opções A/B/C/D) e EXATAMENTE ${batchOpen} DEVEM ser ABERTAS/DISCURSIVAS (sem opções).
- PROGRESSÃO DE DIFICULDADE: A prova DEVE ser rigorosamente ordenada por nível de dificuldade.
- GABARITO RANDOMIZADO: As respostas corretas das questões de múltipla escolha DEVEM ser distribuídas aleatoriamente.
${bankOfContexts}

FORMATO DE SAÍDA E SINTAXE LATEX (CRÍTICO):
Você deve retornar ESTRITAMENTE um objeto JSON válido contendo a lista de questões.
As fórmulas matemáticas devem usar a sintaxe LaTeX.

Você DEVE usar EXATAMENTE a estrutura de chaves e campos abaixo (em inglês):
{
  "questions": [
    {
      "id": ${startId},
      "type": "direta", // ou "contextualizada"
      "text": "Texto do enunciado com LaTeX",
      "options": ["Texto Opção A", "Texto Opção B", "Texto Opção C", "Texto Opção D"], // vazio [] se for aberta
      "answer": "Resposta correta (A, B, C, D ou texto completo se for aberta)",
      "explanation": "Explicação/resolução passo a passo",
      "metadata": {
        "habilidadeIgarassu": "EF07MA02-IGPE",
        "nivelComplexidade": "Fácil", // "Fácil", "Médio" ou "Difícil"
        "unidadeTematica": "Números",
        "objetoConhecimento": "Inteiros"
      }
    }
  ]
}

REGRAS DE CONCISÃO CRÍTICAS:
1. TEXTO DOS ENUNCIADOS: Seja direto. Evite rodeios. Máximo 2 sentenças.
2. EXPLICAÇÃO (explanation): Forneça apenas a resolução direta e ultra-curta (máximo de 15 palavras).
3. METADATA: Use termos curtos (máximo 2 palavras).

REGRAS OBRIGATÓRIAS DE LATEX:
1. SÍMBOLO DE PORCENTAGEM: SEMPRE escape o símbolo de porcentagem usando DUAS barras invertidas no JSON: "\\\\%".
2. MODO MATEMÁTICO: TODO comando matemático DEVE estar dentro de cifrões ($).
3. ACENTOS NO MODO MATEMÁTICO: NUNCA use palavras com acentos dentro do modo matemático ($...$).
4. ESPAÇAMENTO: NUNCA adicione comandos de espaçamento como \\\\vspace{} no texto das questões.
5. SÍMBOLO DE MOEDA (R$): SEMPRE escape o cifrão usando DUAS barras invertidas no JSON: "R\\\\$".
6. OPÇÕES DE RESPOSTA: No array 'options', forneça APENAS o texto da opção, SEM o prefixo da letra.`;

    const prompt = `Por favor, gere um lote de questões de matemática com os seguintes parâmetros:
- Lote atual: Questões do id ${startId} até ${startId + currentBatchSize - 1} (Total de ${currentBatchSize} questões de um total de ${totalQuestions})
- Tipo de questões neste lote: Gerar EXATAMENTE ${batchObjective} questões OBJETIVAS (múltipla escolha) e ${batchOpen} questões ABERTAS (discursivas).
- Ano/Série: ${params.grade}
- Tópicos/Conteúdos: ${params.topics || 'Abranger a matriz geral do ano'}
- Nível de dificuldade: ${params.difficulty}
- Contexto temático: ${params.context || 'Variado (usar banco de contextos locais)'}
- Questões já geradas nos lotes anteriores (Evite repetir os enunciados ou contextos abaixo para manter a diversidade pedagógica):
${previousQuestionsSummary}`;

    // Display progress to the user
    onRetry?.(currentBatchNum, totalBatches, `Gerando questões ${startId} a ${startId + currentBatchSize - 1}`);

    try {
      if (!hasRemoteProviderConfigured()) {
        onRetry?.(currentBatchNum, totalBatches, `Gerando localmente as questoes ${startId} a ${startId + currentBatchSize - 1}`);
        setCurrentProvider('local');

        const localQuestions = buildLocalQuestionBatch(params, startId, currentBatchSize, batchObjective, totalQuestions);
        allQuestions = allQuestions.concat(localQuestions);
        saveGenerationDraft(params, allQuestions);

        generatedObjective += localQuestions.filter(q => q.options && q.options.length > 0).length;
        generatedOpen += localQuestions.filter(q => !q.options || q.options.length === 0).length;
        continue;
      }

      const config: GenerateContentParameters = {
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
          maxOutputTokens: 4096, // Reduced since payload is smaller
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.INTEGER },
                    type: { type: Type.STRING, description: "direta ou contextualizada" },
                    text: { type: Type.STRING, description: "Enunciado da questão com formatação markdown e LaTeX para matemática" },
                    options: { 
                      type: Type.ARRAY, 
                      items: { type: Type.STRING },
                      description: "Array com 4 opções se for múltipla escolha, vazio se for aberta."
                    },
                    answer: { type: Type.STRING, description: "A resposta correta (ex: 'A' ou o valor exato)" },
                    explanation: { type: Type.STRING, description: "Resolução passo a passo" },
                    metadata: {
                      type: Type.OBJECT,
                      properties: {
                        habilidadeIgarassu: { type: Type.STRING },
                        descritorMatrizLuz: { type: Type.STRING },
                        nivelComplexidade: { type: Type.STRING },
                        unidadeTematica: { type: Type.STRING },
                        objetoConhecimento: { type: Type.STRING }
                      },
                      required: ["nivelComplexidade", "unidadeTematica", "objetoConhecimento"]
                    }
                  },
                  required: ["id", "type", "text", "answer", "explanation", "metadata"]
                }
              }
            },
            required: ["questions"]
          }
        },
      };

      const batchResult = await withFallbackSmart(
        config,
        systemInstruction,
        prompt,
        (text) => parseJSONWithFallback<ExamData>(text),
        onRetry
      );

      let batchQuestions = (batchResult.questions || []).slice(0, currentBatchSize);
      if (batchQuestions.length < currentBatchSize) {
        const missingCount = currentBatchSize - batchQuestions.length;
        const currentObjective = batchQuestions.filter(q => q.options && q.options.length > 0).length;
        const missingObjective = Math.max(0, batchObjective - currentObjective);
        console.warn(`Provedor retornou ${batchQuestions.length}/${currentBatchSize} questoes. Completando ${missingCount} questoes localmente.`);
        onRetry?.(currentBatchNum, totalBatches, `Completando ${missingCount} questoes do lote com gerador local`);
        setCurrentProvider('local');
        batchQuestions = batchQuestions.concat(buildLocalQuestionBatch(
          params,
          startId + batchQuestions.length,
          missingCount,
          missingObjective,
          totalQuestions
        ));
      }
      
      // Ensure IDs are corrected and match the expected startId sequence
      batchQuestions.forEach((q, idx) => {
        q.id = startId + idx;
      });

      allQuestions = allQuestions.concat(batchQuestions);
      saveGenerationDraft(params, allQuestions);
      
      // Update counters
      batchQuestions.forEach(q => {
        if (q.options && q.options.length > 0) {
          generatedObjective++;
        } else {
          generatedOpen++;
        }
      });

    } catch (batchError: any) {
      console.warn(`IA indisponivel no lote a partir do id ${startId}. Gerando lote localmente.`, batchError);
      onRetry?.(currentBatchNum, totalBatches, `IA indisponivel no lote; usando gerador local para as questoes ${startId} a ${startId + currentBatchSize - 1}`);
      setCurrentProvider('local');

      const localQuestions = buildLocalQuestionBatch(params, startId, currentBatchSize, batchObjective, totalQuestions);
      allQuestions = allQuestions.concat(localQuestions);
      saveGenerationDraft(params, allQuestions);

      generatedObjective += localQuestions.filter(q => q.options && q.options.length > 0).length;
      generatedOpen += localQuestions.filter(q => !q.options || q.options.length === 0).length;
    }
  }

  clearGenerationDraft(params);
  return { questions: allQuestions };
}

export interface QAResult {
  qaReport: string;
  correctedExam: ExamData;
}

export async function runQAAndCorrect(originalExam: ExamData, params: ExamParams, onRetry?: (attempt: number, maxRetries: number, reason: string) => void, options: GenerationOptions = {}): Promise<QAResult> {
  let localContextName = '';
  if (params.curriculum === 'Matriz da Luz') {
    localContextName = 'São Lourenço da Mata/PE';
  } else if (params.curriculum === 'Currículo de Igarassu') {
    localContextName = 'Igarassu/PE';
  } else {
    localContextName = 'Igarassu/PE e São Lourenço da Mata/PE';
  }

  const questions = originalExam.questions || [];
  const batchSize = getQABatchSize(options.mode);
  const totalBatches = Math.ceil(questions.length / batchSize);
  let allCorrectedQuestions: ExamQuestion[] = [];
  let allReports: string[] = [];

  for (let i = 0; i < questions.length; i += batchSize) {
    const batchQuestions = questions.slice(i, i + batchSize);
    const batchExam: ExamData = { questions: batchQuestions };
    const currentStart = i + 1;
    const currentEnd = Math.min(i + batchSize, questions.length);
    const currentBatchNum = Math.ceil(currentStart / batchSize);

    onRetry?.(currentBatchNum, totalBatches, `Validando questões ${currentStart} a ${currentEnd}`);

    const systemInstruction = `Você é um VALIDADOR e CORRETOR ESPECIALIZADO em provas de Matemática para 6º-9º ano.
Sua missão: Receber um lote de questões de uma prova em JSON, realizar uma análise de qualidade (QA) rigorosa sobre esse lote e retornar as questões corrigidas junto com o relatório de QA, tudo em um único objeto JSON.

REGRA ABSOLUTA DE QUANTIDADE DE QUESTÕES (CRÍTICO):
A prova corrigida retornada no campo "correctedExam" DEVE conter EXATAMENTE o mesmo número de questões do lote original que você recebeu (neste lote: ${batchQuestions.length} questões, com IDs de ${currentStart} a ${currentEnd})! Você NÃO pode remover nenhuma questão ou reduzir o lote.

REGRAS OBRIGATÓRIAS DE LATEX PARA EVITAR ERROS DE COMPILAÇÃO (CRÍTICO):
1. SÍMBOLO DE PORCENTAGEM: Você NUNCA deve usar o símbolo "%" sozinho. SEMPRE escape o símbolo de porcentagem usando DUAS barras invertidas no JSON: "\\\\%" (exemplo: "15\\\\% de desconto").
2. MODO MATEMÁTICO: TODO E QUALQUER comando matemático DEVE estar dentro de cifrões ($).
3. ACENTOS NO MODO MATEMÁTICO: NUNCA use palavras com acentos dentro de cifrões ($...$).
4. ESPAÇAMENTO: NUNCA adicione comandos de espaçamento como \\\\vspace{} no texto das questões.
5. SÍMBOLO DE MOEDA (R$): NUNCA use "R$" diretamente. SEMPRE escape o cifrão usando DUAS barras invertidas no JSON: "R\\\\$".
6. OPÇÕES DE RESPOSTA: No array 'options', forneça APENAS o texto da opção, SEM o prefixo da letra.

REGRAS DE CONTEÚDO E ESTRUTURA:
1. GABARITO RANDOMIZADO: Garanta que as respostas corretas das questões de múltipla escolha estejam distribuídas aleatoriamente.
2. PROGRESSÃO DE DIFICULDADE: As questões devem seguir a ordem: Fácil -> Médio -> Difícil.
3. CONTEXTUALIZAÇÃO: Verifique se os contextos de ${localContextName} são válidos e não repetitivos.
4. PROPORÇÃO DE TIPOS DE QUESTÃO: Mantenha os tipos de questão do lote (objetivas vs abertas) conforme recebido.

REGRAS DE CONCISÃO CRÍTICAS:
1. TEXTO DOS ENUNCIADOS (text): Mantenha-os diretos, com no máximo 2 sentenças.
2. EXPLICAÇÃO (explanation): Mantenha a resolução ultra-curta (máximo de 15 palavras).
3. METADATA: Use nomes de "unidadeTematica" e "objetoConhecimento" curtos.

O relatório de QA deve ser formatado em Markdown e conter as seguintes seções:
- Validação Estrutural
- Validação de Conteúdo
- Validação Pedagógica
- Problemas Identificados
- Ações Corretivas Realizadas
- Status Final (APROVADO ou AJUSTES REALIZADOS)

Seu retorno DEVE ser um objeto JSON estrito com esta estrutura:
{
  "qaReport": "Relatório em markdown para este lote",
  "correctedExam": {
    "questions": [
      {
        "id": ${currentStart},
        "type": "direta",
        "text": "Texto do enunciado com LaTeX",
        "options": ["Texto Opção A", "Texto Opção B", "Texto Opção C", "Texto Opção D"], // vazio [] se for aberta
        "answer": "Resposta correta",
        "explanation": "Explicação/resolução passo a passo",
        "metadata": {
          "habilidadeIgarassu": "EF07MA02-IGPE",
          "nivelComplexidade": "Fácil",
          "unidadeTematica": "Números",
          "objetoConhecimento": "Inteiros"
        }
      }
    ]
  }
}`;

    const prompt = `Lote de Questões Originais para QA (Questões ${currentStart} a ${currentEnd}):
${JSON.stringify(batchExam, null, 2)}

Por favor, analise as questões deste lote e retorne o objeto JSON contendo o relatório de QA (em Markdown) e as questões corrigidas.`;

    try {
      const config: GenerateContentParameters = {
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.2,
          maxOutputTokens: 4096,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              qaReport: { type: Type.STRING, description: "Relatório de QA em Markdown" },
              correctedExam: {
                type: Type.OBJECT,
                properties: {
                  questions: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.INTEGER },
                        type: { type: Type.STRING },
                        text: { type: Type.STRING },
                        options: { type: Type.ARRAY, items: { type: Type.STRING } },
                        answer: { type: Type.STRING },
                        explanation: { type: Type.STRING },
                        metadata: {
                          type: Type.OBJECT,
                          properties: {
                            habilidadeIgarassu: { type: Type.STRING },
                            descritorMatrizLuz: { type: Type.STRING },
                            nivelComplexidade: { type: Type.STRING },
                            unidadeTematica: { type: Type.STRING },
                            objetoConhecimento: { type: Type.STRING }
                          },
                          required: ["nivelComplexidade", "unidadeTematica", "objetoConhecimento"]
                        }
                      },
                      required: ["id", "type", "text", "answer", "explanation", "metadata"]
                    }
                  }
                },
                required: ["questions"]
              }
            },
            required: ["qaReport", "correctedExam"]
          }
        },
      };

      const batchResult = await withFallbackSmart(
        config,
        systemInstruction,
        prompt,
        (text) => parseJSONWithFallback<QAResult>(text),
        onRetry
      );

      const batchCorrected = batchResult.correctedExam?.questions || [];
      
      // Ensure IDs remain corrected sequence
      batchCorrected.forEach((q, idx) => {
        q.id = currentStart + idx;
      });

      allCorrectedQuestions = allCorrectedQuestions.concat(batchCorrected);
      
      const formattedReport = `### Relatório de QA - Lote ${currentBatchNum} (Questões ${currentStart} a ${currentEnd})\n\n${batchResult.qaReport || 'Sem relatório.'}`;
      allReports.push(formattedReport);

    } catch (batchError: any) {
      console.error(`Erro no QA do lote ${currentStart} a ${currentEnd}:`, batchError);
      // Fallback: keep original questions for this batch if QA fails
      allCorrectedQuestions = allCorrectedQuestions.concat(batchQuestions);
      allReports.push(`### Relatório de QA - Lote ${currentBatchNum} (Questões ${currentStart} a ${currentEnd})\n\n⚠️ O Controle de Qualidade para este lote falhou e as questões originais foram mantidas.\n\nDetalhe: ${batchError?.message || batchError}`);
    }
  }

  const finalReport = `## Relatório de QA Consolidado (${questions.length} Questões)\n\nEste relatório foi unificado a partir das análises em lotes para evitar limitações de timeout e cota.\n\n` + allReports.join('\n\n---\n\n');

  return {
    qaReport: finalReport,
    correctedExam: { questions: allCorrectedQuestions }
  };
}

