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
const SMART_PROVIDER_TIMEOUT_MS = 18000;

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

function logProviderSuccess(provider: ProviderName, detail: string): void {
  console.info(`[ProfMatHub IA] ${provider} respondeu com sucesso: ${detail}`);
}

function getGenerationBatchSize(mode: GenerationMode = 'economico'): number {
  if (mode === 'completo') return 3;
  if (mode === 'rapido') return 4;
  return 3;
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
      const parsed = parseResult(response.text || '{}');
      logProviderSuccess('gemini', 'conteudo gerado');
      return parsed;
    }, 2, (attempt, max, reason) => onRetry?.(attempt, max, `Gemini: ${reason}`), SMART_PROVIDER_TIMEOUT_MS);
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
        logProviderSuccess('groq', `${anyResult?.questions?.length || 'conteudo'} item(ns)`);
        return parsed;
      }, 1, (attempt, max, reason) => onRetry?.(attempt, max, `Groq: ${reason}`), SMART_PROVIDER_TIMEOUT_MS);
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
        const parsed = parseResult(text);
        const anyResult = parsed as any;
        logProviderSuccess('openrouter', `${anyResult?.questions?.length || 'conteudo'} item(ns)`);
        return parsed;
      }, 1, (attempt, max, reason) => onRetry?.(attempt, max, `OpenRouter: ${reason}`), SMART_PROVIDER_TIMEOUT_MS);
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
        logProviderSuccess('nvidia', `${anyResult?.questions?.length || 'conteudo'} item(ns)`);
        return parsed;
      }, 1, (attempt, max, reason) => onRetry?.(attempt, max, `NVIDIA: ${reason}`), SMART_PROVIDER_TIMEOUT_MS);
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
      const parsed = parseResult(response.text || '{}');
      logProviderSuccess('gemini-flash', 'conteudo gerado');
      return parsed;
    }, 2, (attempt, max, reason) => onRetry?.(attempt, max, `Gemini Flash: ${reason}`), SMART_PROVIDER_TIMEOUT_MS);
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
    const topicParts = requestedTopic
      .split(/[,;|]/)
      .map(part => part.trim())
      .filter(Boolean);
    const selectedTopic = topicParts.length > 0 ? topicParts[index % topicParts.length] : requestedTopic;
    return {
      unidadeTematica: 'Matematica',
      objetoConhecimento: selectedTopic.slice(0, 40)
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
  const frames = [
    'um simulado contextualizado sobre',
    'uma reportagem escolar sobre',
    'um projeto interdisciplinar sobre',
    'uma prova no estilo ENEM envolvendo',
    'uma investigacao de estudantes sobre',
    'uma tabela de acompanhamento sobre',
    'uma campanha da escola sobre',
    'um desafio de raciocinio com dados de',
  ];

  if (params.context?.trim()) {
    const themes = params.context
      .split(/[,;|]/)
      .map(part => part.trim())
      .filter(Boolean);
    const theme = themes.length > 0 ? themes[index % themes.length] : params.context.trim();
    return `${frames[index % frames.length]} ${theme}`;
  }

  const contexts = [
    'uma feira livre de Igarassu com barracas organizadas por setor',
    'um levantamento sobre transporte escolar entre bairros de Igarassu',
    'uma excursao pedagogica ao Sitio Historico com controle de gastos',
    'um simulado no estilo IFPE com tabela de desempenho',
    'um projeto de horta escolar com canteiros retangulares e consumo de agua',
    'um clube de estudos com desafios inspirados em concursos de colegio militar',
    'uma pesquisa no patio da escola sobre atividades esportivas',
    'um grafico no estilo ENEM sobre economia de energia em salas de aula',
    'uma biblioteca escolar com emprestimos registrados durante quatro semanas',
    'uma mostra de matematica com compra de materiais por equipe',
    'uma seletiva escolar com pontuacoes em matematica e lingua portuguesa',
    'um edital de curso tecnico com vagas por campus e turnos',
    'uma feira de ciencias com medidas de recipientes usados em experimentos',
    'uma planilha de merenda com quantidades compradas e consumidas',
    'um mapa simples com distancias entre a escola, o mercado e o ponto de onibus',
    'uma campanha de arrecadacao com metas parciais em dias diferentes',
    'um treino para olimpadas de matematica com problemas por nivel',
    'uma pesquisa sobre uso de celular apresentada em tabela',
    'um planejamento de aula de campo com tempo de deslocamento e custo por estudante',
    'um laboratorio escolar com medidas decimais em uma receita experimental',
  ];

  return contexts[index % contexts.length];
}

function getAnswerLetter(options: number[], correctValue: number): string {
  const index = options.findIndex(value => value === correctValue);
  return ['A', 'B', 'C', 'D'][Math.max(0, index)];
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function formatMathNumber(value: number): string {
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(1).replace('.', '{,}');
}

function formatAnswerNumber(value: number): string {
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(1).replace('.', ',');
}

function shouldUseDecimals(params: ExamParams, seed: number): boolean {
  const hint = `${params.topics || ''} ${params.context || ''}`.toLowerCase();
  return (
    hint.includes('decimal') ||
    hint.includes('racion') ||
    hint.includes('fracao') ||
    hint.includes('fração') ||
    hint.includes('porcent') ||
    seed % 6 === 0
  );
}

function buildNumericOptions(correctValue: number, seed: number): number[] {
  const distractors = [
    correctValue,
    round1(correctValue + 2 + (seed % 5) / 2),
    round1(Math.max(0.5, correctValue - 1 - (seed % 4) / 2)),
    round1(correctValue + 6 + (seed % 7) / 2),
  ];
  const unique = Array.from(new Set(distractors));
  while (unique.length < 4) unique.push(correctValue + unique.length * 3 + seed);

  const shift = seed % 4;
  return unique.slice(0, 4).map((_, idx, arr) => arr[(idx + shift) % arr.length]);
}

function buildLocalQuestion(params: ExamParams, id: number, totalQuestions: number, objective: boolean, variant = 0): ExamQuestion {
  const gradeNumber = Number.parseInt(params.grade, 10) || 6;
  const seed = id + variant * 11;
  const level = getLocalDifficulty(params, seed - 1, totalQuestions);
  const topic = getLocalTopic(params, seed - 1);
  const context = getReferenceContext(params, seed - 1);
  const base = gradeNumber + seed;
  const factor = level === 'Dificil' ? 4 : level === 'Medio' ? 3 : 2;
  const useDecimals = shouldUseDecimals(params, seed);
  const n = (value: number) => useDecimals ? round1(value + ((seed % 7) + 1) / 10) : value;
  const m = (value: number) => formatMathNumber(value);
  const a = (value: number) => formatAnswerNumber(value);

  if (objective) {
    const objectiveTemplates = [
      () => {
        const groups = n(base);
        const perGroup = factor + 1;
        const extra = n(seed % 9);
        const correct = round1(groups * perGroup + extra);
        return {
          text: `Em ${context}, foram formados $${m(groups)}$ grupos com $${perGroup}$ participantes e chegaram mais $${m(extra)}$ participantes. Qual foi o total?`,
          correct,
          explanation: `${a(groups)} x ${perGroup} + ${a(extra)} = ${a(correct)}.`,
          object: 'Multiplicacao'
        };
      },
      () => {
        const initial = n(base * 6);
        const percent = 10 + (seed % 4) * 5;
        const correct = round1(initial * (100 - percent) / 100);
        return {
          text: `Em ${context}, um valor de $${m(initial)}$ teve reducao de $${percent}\\%$. Qual ficou sendo o novo valor?`,
          correct,
          explanation: `${a(initial)} - ${percent}\\% = ${a(correct)}.`,
          object: 'Porcentagem'
        };
      },
      () => {
        const first = n(base + 8);
        const second = n(base + factor);
        const correct = round1(first + second);
        return {
          text: `Em ${context}, uma tabela registrou $${m(first)}$ ocorrencias pela manha e $${m(second)}$ a tarde. Qual e o total do dia?`,
          correct,
          explanation: `${a(first)} + ${a(second)} = ${a(correct)}.`,
          object: 'Tabelas'
        };
      },
      () => {
        const length = n(base + 4);
        const width = n(factor + 3);
        const correct = round1(length * width);
        return {
          text: `Em ${context}, um espaco retangular mede $${m(length)}$ m por $${m(width)}$ m. Qual e a area desse espaco?`,
          correct,
          explanation: `${a(length)} x ${a(width)} = ${a(correct)}.`,
          object: 'Areas'
        };
      },
      () => {
        const total = n(base * 5);
        const parts = factor + 2;
        const correct = round1(total / parts);
        return {
          text: `Em ${context}, $${m(total)}$ kg de material foram distribuidos igualmente em $${parts}$ caixas. Quantos kg ficaram em cada caixa?`,
          correct,
          explanation: `${a(total)} / ${parts} = ${a(correct)}.`,
          object: 'Divisao'
        };
      },
      () => {
        const start = n(base * 2);
        const step = n(factor + 2);
        const correct = round1(start + 4 * step);
        return {
          text: `Em ${context}, uma sequencia comeca em $${m(start)}$ e aumenta $${m(step)}$ a cada etapa. Qual e o quinto termo?`,
          correct,
          explanation: `${a(start)} + 4 x ${a(step)} = ${a(correct)}.`,
          object: 'Sequencias'
        };
      },
      () => {
        const total = 40 + seed;
        const marked = n(8 + (seed % 12));
        const correct = round1(total - marked);
        return {
          text: `Em ${context}, de $${total}$ respostas coletadas, $${m(marked)}$ foram marcadas para revisao. Quantas ficaram aprovadas sem revisao?`,
          correct,
          explanation: `${total} - ${a(marked)} = ${a(correct)}.`,
          object: 'Subtracao'
        };
      },
      () => {
        const value = n(base * factor);
        const fee = n(seed % 7 + 3);
        const correct = round1(value + fee);
        return {
          text: `Em ${context}, o custo principal foi de R$ $${m(value)}$ e houve uma taxa de R$ $${m(fee)}$. Qual foi o custo total?`,
          correct,
          explanation: `${a(value)} + ${a(fee)} = ${a(correct)}.`,
          object: 'Sistema monetario'
        };
      },
      () => {
        const mapDistance = n(base + 2);
        const scale = factor + 1;
        const correct = round1(mapDistance * scale);
        return {
          text: `Em ${context}, cada centimetro no mapa representa $${scale}$ km. Se a distancia medida foi $${m(mapDistance)}$ cm, qual e a distancia real?`,
          correct,
          explanation: `${a(mapDistance)} x ${scale} = ${a(correct)}.`,
          object: 'Escala'
        };
      },
      () => {
        const recipe = n(base + factor);
        const multiplier = 2 + (seed % 3);
        const correct = round1(recipe * multiplier);
        return {
          text: `Em ${context}, uma receita usa $${m(recipe)}$ L de suco para um grupo. Para atender $${multiplier}$ grupos iguais, quantos litros serao necessarios?`,
          correct,
          explanation: `${a(recipe)} x ${multiplier} = ${a(correct)}.`,
          object: 'Proporcionalidade'
        };
      },
      () => {
        const monday = n(base * 2);
        const increase = n(factor + seed % 5);
        const correct = round1(monday + increase);
        return {
          text: `Em ${context}, o grafico indicou $${m(monday)}$ registros na segunda-feira e aumento de $${m(increase)}$ na terca-feira. Qual foi o valor de terca-feira?`,
          correct,
          explanation: `${a(monday)} + ${a(increase)} = ${a(correct)}.`,
          object: 'Graficos'
        };
      },
      () => {
        const total = n(base * 4);
        const percent = 50;
        const correct = round1(total * percent / 100);
        return {
          text: `Em ${context}, metade de $${m(total)}$ participantes escolheu a mesma alternativa. Quantos participantes foram esses?`,
          correct,
          explanation: `${percent}\\% de ${a(total)} = ${a(correct)}.`,
          object: 'Fracoes'
        };
      },
    ];

    const built = objectiveTemplates[seed % objectiveTemplates.length]();
    const options = buildNumericOptions(built.correct, seed);
    const answer = getAnswerLetter(options, built.correct);

    return {
      id,
      type: 'contextualizada',
      text: built.text,
      options: options.map(value => `${a(value)}`),
      answer,
      explanation: built.explanation,
      metadata: {
        habilidadeIgarassu: `EF0${Math.min(9, gradeNumber)}MA01-IGPE`,
        descritorMatrizLuz: 'D01',
        nivelComplexidade: level,
        unidadeTematica: topic.unidadeTematica,
        objetoConhecimento: topic.objetoConhecimento || built.object,
      }
    };
  }

  const openTemplates = [
      () => {
      const fixed = n(base * 3);
      const variable = n(factor + 2);
      const target = round1(fixed + variable * 5);
      return {
        text: `Em ${context}, o total de pontos de uma equipe foi modelado por $${m(fixed)} + ${m(variable)}x = ${m(target)}$. Determine o valor de $x$ e explique o procedimento.`,
        answer: '5',
        explanation: `${a(target)} - ${a(fixed)} = ${a(round1(variable * 5))}; x = 5.`,
        object: 'Equacoes'
      };
    },
    () => {
      const total = n(base * 8);
      const percent = 25;
      const answer = round1(total * percent / 100);
      return {
        text: `Em ${context}, $${percent}\\%$ de $${m(total)}$ registros pertencem a uma categoria. Calcule essa quantidade e interprete o resultado.`,
        answer: `${a(answer)}`,
        explanation: `${percent}\\% de ${a(total)} = ${a(answer)}.`,
        object: 'Porcentagem'
      };
    },
    () => {
      const length = n(base + 5);
      const width = n(factor + 4);
      const area = round1(length * width);
      return {
        text: `Em ${context}, um painel retangular tem $${m(length)}$ cm de comprimento e $${m(width)}$ cm de largura. Calcule a area e indique a unidade adequada.`,
        answer: `${a(area)} cm2`,
        explanation: `${a(length)} x ${a(width)} = ${a(area)}.`,
        object: 'Areas'
      };
    },
    () => {
      const values = [n(base), n(base + factor), n(base + factor * 2), n(base + factor * 3)];
      const mean = round1(values.reduce((sum, value) => sum + value, 0) / values.length);
      return {
        text: `Em ${context}, quatro valores registrados foram $${values.map(m).join('; ')}$. Calcule a media aritmetica desses valores.`,
        answer: `${a(mean)}`,
        explanation: `Soma ${a(round1(values.reduce((sum, value) => sum + value, 0)))} / 4 = ${a(mean)}.`,
        object: 'Media'
      };
    },
    () => {
      const start = n(base);
      const step = n(factor + 1);
      const term = round1(start + 6 * step);
      return {
        text: `Em ${context}, uma sequencia segue o padrao de comecar em $${m(start)}$ e aumentar $${m(step)}$ por etapa. Determine o setimo termo.`,
        answer: `${a(term)}`,
        explanation: `${a(start)} + 6 x ${a(step)} = ${a(term)}.`,
        object: 'Sequencias'
      };
    },
    () => {
      const total = n(base * 5);
      const used = n(base + factor);
      const remaining = round1(total - used);
      return {
        text: `Em ${context}, havia $${m(total)}$ unidades disponiveis e $${m(used)}$ foram utilizadas. Calcule quantas restaram e justifique.`,
        answer: `${a(remaining)}`,
        explanation: `${a(total)} - ${a(used)} = ${a(remaining)}.`,
        object: 'Subtracao'
      };
    },
    () => {
      const price = n(base * 4);
      const students = factor + 6;
      const total = round1(price * students);
      return {
        text: `Em ${context}, cada inscricao custou R$ $${m(price)}$ e $${students}$ estudantes participaram. Calcule o custo total.`,
        answer: `R$ ${a(total)}`,
        explanation: `${a(price)} x ${students} = ${a(total)}.`,
        object: 'Multiplicacao'
      };
    },
    () => {
      const total = n(base * 6);
      const boxes = factor + 3;
      const perBox = round1(total / boxes);
      return {
        text: `Em ${context}, $${m(total)}$ kg de materiais foram separados igualmente em $${boxes}$ caixas. Quantos kg ficam em cada caixa?`,
        answer: `${a(perBox)} kg por caixa`,
        explanation: `${a(total)} / ${boxes} = ${a(perBox)}.`,
        object: 'Divisao'
      };
    },
    () => {
      const distance = n(base + 12);
      const time = factor + 2;
      const speed = round1(distance / time);
      return {
        text: `Em ${context}, um deslocamento de $${m(distance)}$ km durou $${time}$ horas. Calcule a velocidade media.`,
        answer: `${a(speed)} km/h`,
        explanation: `${a(distance)} / ${time} = ${a(speed)}.`,
        object: 'Razao'
      };
    },
    () => {
      const goal = n(base * 7);
      const done = n(base * 3);
      const missing = round1(goal - done);
      return {
        text: `Em ${context}, a meta era $${m(goal)}$ unidades e ja foram registradas $${m(done)}$. Quanto falta para atingir a meta?`,
        answer: `${a(missing)}`,
        explanation: `${a(goal)} - ${a(done)} = ${a(missing)}.`,
        object: 'Comparacao'
      };
    },
    () => {
      const original = n(base * 5);
      const newValue = n(base * 5 + factor * 3);
      const increase = round1(newValue - original);
      return {
        text: `Em ${context}, um indicador passou de $${m(original)}$ para $${m(newValue)}$. Calcule o aumento absoluto.`,
        answer: `${a(increase)}`,
        explanation: `${a(newValue)} - ${a(original)} = ${a(increase)}.`,
        object: 'Graficos'
      };
    },
    () => {
      const value = n(base + 4);
      const third = round1(value / 3);
      return {
        text: `Em ${context}, uma quantidade de $${m(value)}$ foi dividida em tres partes iguais. Calcule uma dessas partes.`,
        answer: `${a(third)}`,
        explanation: `${a(value)} / 3 = ${a(third)}.`,
        object: 'Fracoes'
      };
    },
  ];

  const built = openTemplates[seed % openTemplates.length]();

  return {
    id,
    type: 'contextualizada',
    text: built.text,
    options: [],
    answer: built.answer,
    explanation: built.explanation,
    metadata: {
      habilidadeIgarassu: `EF0${Math.min(9, gradeNumber)}MA02-IGPE`,
      descritorMatrizLuz: 'D02',
      nivelComplexidade: level,
      unidadeTematica: topic.unidadeTematica,
      objetoConhecimento: topic.objetoConhecimento || built.object,
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

REGRAS DE QUALIDADE E DIVERSIDADE (OBRIGATORIO):
- Cada questao deve ser um problema com contexto realista, dados interpretaveis e pergunta clara. Evite trocar apenas nomes ou numeros.
- Nao repita o mesmo cenario, a mesma operacao central ou uma pergunta equivalente a outra ja gerada.
- Se o usuario pedir numeros racionais, fracoes, porcentagens ou decimais, inclua valores decimais em parte relevante do enunciado, das alternativas ou da resposta.
- Use estilos variados inspirados em IFPE, ENEM e Colegio Militar: tabelas, comparacoes, escalas, porcentagens, planejamento, leitura de grafico e situacoes de decisao.
- As questoes anteriores listadas abaixo sao proibidas como molde direto para novas questoes deste lote.

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

function normalizeReplacementQuestion(
  question: Partial<ExamQuestion>,
  original: ExamQuestion,
  params: ExamParams,
  index: number
): ExamQuestion | null {
  if (!question?.text || !question?.answer) return null;

  const originalIsObjective = Boolean(original.options && original.options.length > 0);
  const options = originalIsObjective
    ? (Array.isArray(question.options) ? question.options.slice(0, 4) : [])
    : [];

  if (originalIsObjective && options.length !== 4) return null;

  const localTopic = getLocalTopic(params, index);
  const metadata = {
    habilidadeIgarassu: question.metadata?.habilidadeIgarassu || original.metadata?.habilidadeIgarassu,
    descritorMatrizLuz: question.metadata?.descritorMatrizLuz || original.metadata?.descritorMatrizLuz,
    nivelComplexidade: question.metadata?.nivelComplexidade || original.metadata?.nivelComplexidade || getLocalDifficulty(params, index, params.questionCount),
    unidadeTematica: question.metadata?.unidadeTematica || original.metadata?.unidadeTematica || localTopic.unidadeTematica,
    objetoConhecimento: question.metadata?.objetoConhecimento || original.metadata?.objetoConhecimento || localTopic.objetoConhecimento,
  };

  return {
    id: original.id,
    type: question.type === 'direta' ? 'direta' : 'contextualizada',
    text: question.text,
    options,
    answer: question.answer,
    explanation: question.explanation || original.explanation || 'Resolucao direta pelo enunciado.',
    metadata,
  };
}

async function generateReplacementQuestionsWithProviders(
  originalExam: ExamData,
  params: ExamParams,
  selectedQuestions: ExamQuestion[],
  onRetry?: (attempt: number, maxRetries: number, reason: string) => void
): Promise<ExamQuestion[]> {
  const replacementCount = selectedQuestions.length;
  const objectiveCount = selectedQuestions.filter(q => q.options && q.options.length > 0).length;
  const openCount = replacementCount - objectiveCount;
  const selectedIds = selectedQuestions.map(q => q.id);
  const preservedSummary = originalExam.questions
    .filter(q => !selectedIds.includes(q.id))
    .slice(0, 24)
    .map(q => `- Questao ${q.id}: ${q.text.slice(0, 130)}...`)
    .join('\n');
  const replacementSpecs = selectedQuestions
    .map(q => `- Questao ${q.id}: substituir por uma questao ${q.options && q.options.length > 0 ? 'OBJETIVA com 4 opcoes' : 'ABERTA sem opcoes'}. Tema anterior: ${q.metadata?.objetoConhecimento || 'Matematica'}. Enunciado ruim/original: ${q.text.slice(0, 180)}...`)
    .join('\n');

  const systemInstruction = `Voce e um gerador de questoes de matematica para anos finais. Gere substituicoes novas para uma prova existente.

REGRAS CRITICAS:
- Gere EXATAMENTE ${replacementCount} questoes, somente para os IDs: ${selectedIds.join(', ')}.
- Nao altere os IDs. Cada questao retornada deve manter o mesmo id solicitado.
- Mantenha o tipo pedido: ${objectiveCount} objetivas com 4 opcoes e ${openCount} abertas sem opcoes.
- Crie problemas novos, contextualizados e nao equivalentes aos enunciados originais.
- Nao preserve os numeros antigos. Se o tema pedir racionais, fracoes, porcentagens ou decimais, use valores decimais quando fizer sentido.
- Evite repetir contexto, operacao central e pergunta das questoes preservadas.
- Responda estritamente em JSON valido, sem texto fora do JSON.
- Nao use quebras de linha dentro de strings JSON. Use frases curtas em uma linha.

FORMATO:
{
  "questions": [
    {
      "id": 1,
      "type": "contextualizada",
      "text": "Enunciado com LaTeX se necessario",
      "options": ["opcao A", "opcao B", "opcao C", "opcao D"],
      "answer": "A",
      "explanation": "Resolucao curta",
      "metadata": {
        "habilidadeIgarassu": "EF06MA01-IGPE",
        "descritorMatrizLuz": "D01",
        "nivelComplexidade": "Facil",
        "unidadeTematica": "Numeros",
        "objetoConhecimento": "Decimais"
      }
    }
  ]
}`;

  const prompt = `Substitua apenas as questoes marcadas abaixo.

Parametros da prova:
- Ano/serie: ${params.grade}
- Topicos: ${params.topics || 'matematica do ano'}
- Dificuldade: ${params.difficulty}
- Contexto tematico: ${params.context || 'variado'}
- Curriculo: ${params.curriculum}

Questoes que devem ser substituidas:
${replacementSpecs}

Questoes preservadas para evitar repeticao:
${preservedSummary || 'Nenhuma questao preservada informada.'}`;

  const config: GenerateContentParameters = {
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      systemInstruction,
      temperature: 0.85,
      maxOutputTokens: 4096,
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
                  }
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

  onRetry?.(1, 2, `Chamando APIs para substituir ${replacementCount} questoes`);
  const result = await withFallbackSmart(
    config,
    systemInstruction,
    prompt,
    (text) => parseJSONWithFallback<ExamData>(text),
    onRetry
  );

  const byId = new Map((result.questions || []).map(q => [q.id, q]));
  return selectedQuestions
    .map((original, index) => normalizeReplacementQuestion(byId.get(original.id) || {}, original, params, index))
    .filter((q): q is ExamQuestion => Boolean(q));
}

export async function replaceSelectedQuestions(
  originalExam: ExamData,
  params: ExamParams,
  questionIds: number[],
  onRetry?: (attempt: number, maxRetries: number, reason: string) => void
): Promise<ExamData> {
  const selectedIds = new Set(questionIds);
  const totalQuestions = originalExam.questions.length;
  const variantBase = Math.max(1, Math.floor(Date.now() / 1000) % 997);
  const selectedQuestions = originalExam.questions.filter((question, index) => selectedIds.has(question.id || index + 1));
  const apiReplacements = new Map<number, ExamQuestion>();
  let replacedCount = 0;

  if (selectedQuestions.length > 0 && hasRemoteProviderConfigured()) {
    try {
      const generatedByApi = await generateReplacementQuestionsWithProviders(originalExam, params, selectedQuestions, onRetry);
      generatedByApi.forEach(question => apiReplacements.set(question.id, question));
      console.info(`[ProfMatHub IA] Substituicao por API retornou ${apiReplacements.size}/${selectedQuestions.length} questoes.`);
      if (apiReplacements.size < selectedQuestions.length) {
        onRetry?.(2, 2, `APIs retornaram ${apiReplacements.size}/${selectedQuestions.length}; completando o restante localmente`);
      }
    } catch (error) {
      console.warn('Substituicao por APIs falhou; completando com gerador local.', error);
      onRetry?.(2, 2, 'APIs indisponiveis na substituicao; usando gerador local');
    }
  } else if (selectedQuestions.length > 0) {
    onRetry?.(1, 1, 'Nenhuma API configurada; substituindo com gerador local');
  }

  const questions = originalExam.questions.map((question, index) => {
    const questionId = question.id || index + 1;
    if (!selectedIds.has(questionId)) return question;

    const apiQuestion = apiReplacements.get(questionId);
    if (apiQuestion) return apiQuestion;

    replacedCount++;
    onRetry?.(replacedCount, selectedIds.size, `Substituindo questao ${questionId}`);
    setCurrentProvider('local');

    const keepObjectiveType = Boolean(question.options && question.options.length > 0);
    return buildLocalQuestion(params, questionId, totalQuestions, keepObjectiveType, variantBase + replacedCount + index);
  });

  return { questions };
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

