import { GoogleGenAI, Type, GenerateContentParameters } from '@google/genai';

// --- PROVIDER MANAGEMENT ---
type ProviderName = 'gemini' | 'nvidia' | 'groq' | 'openrouter' | 'gemini-flash';

interface ProviderStatus {
  name: ProviderName;
  label: string;
  available: boolean;
  lastError?: string;
}

let currentProvider: ProviderName = 'gemini';
const providerListeners: Array<(provider: ProviderName) => void> = [];

export function onProviderChange(fn: (provider: ProviderName) => void) {
  providerListeners.push(fn);
  return () => { const idx = providerListeners.indexOf(fn); if (idx >= 0) providerListeners.splice(idx, 1); };
}

export function getCurrentProvider(): ProviderName { return currentProvider; }

function setCurrentProvider(p: ProviderName) {
  currentProvider = p;
  providerListeners.forEach(fn => fn(p));
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
    throw new Error(`Groq API error ${response.status}: ${errBody}`);
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
    throw new Error(`OpenRouter API error ${response.status}: ${errBody}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '{}';
}

// --- NVIDIA API (OpenAI-compatible premium NIM models) ---
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || '';
const NVIDIA_MODEL = process.env.NVIDIA_MODEL || 'meta/llama-3.3-70b-instruct';

async function callNvidia(systemPrompt: string, userPrompt: string): Promise<string> {
  if (!NVIDIA_API_KEY) throw new Error('NVIDIA_API_KEY não configurada');
  
  const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
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
    throw new Error(`NVIDIA API error ${response.status}: ${errBody}`);
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

async function withRetry<T>(fn: () => Promise<T>, maxRetries = 5, onRetry?: (attempt: number, maxRetries: number, reason: string) => void): Promise<T> {
  let lastError: any;
  const retryLog: string[] = [];
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      // 90 seconds timeout per attempt
      return await withTimeout(fn(), 90000);
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
        
      const isDailyQuotaError = isQuotaError && (errorString.includes('PERDAY') || errorString.includes('LIMIT: 0'));
        
      const isJsonError = error instanceof SyntaxError || errorString.includes('SYNTAXERROR') || errorString.includes('JSON');
      const isTimeoutError = errorString.includes('CANCELADA PELO SISTEMA') || errorString.includes('TIMEOUT');
      
      const reason = isQuotaError ? 'Servidores sobrecarregados' : isTimeoutError ? 'Tempo limite excedido' : isJsonError ? 'Erro de formatação' : 'Erro desconhecido';
      const logEntry = `Tentativa ${i + 1}/${maxRetries} falhou: ${reason}. Detalhe: ${error?.message || errorString}`;
      retryLog.push(logEntry);
      
      if ((isQuotaError || isJsonError || isTimeoutError) && i < maxRetries - 1) {
        if (isDailyQuotaError) {
          throw new RetryError('O limite diário de uso da API gratuita foi atingido. Por favor, tente novamente amanhã ou configure uma chave de API com faturamento.', retryLog);
        }
        
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
        throw new RetryError('Os servidores do Google estão sobrecarregados no momento. Por favor, tente novamente em alguns minutos.', retryLog);
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
    }, 3, onRetry);
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
      }, 2, onRetry);
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
        }, 2, onRetry);
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
        }, 2, onRetry);
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
    }, 3, onRetry);
    return result;
  } catch (flashError: any) {
    flashErrorMsg = flashError?.message || String(flashError);
    setCurrentProvider('gemini');
    throw new RetryError(
      'Todos os provedores falharam. Por favor, revise as chaves de API configuradas no painel do Netlify ou aguarde alguns minutos.',
      [
        `Gemini (2.5-Flash-Preview): ${geminiErrorMsg}`,
        `NVIDIA (${NVIDIA_MODEL}): ${NVIDIA_API_KEY ? `falhou (${nvidiaErrorMsg})` : 'não configurado'}`,
        `Groq (Llama-3.3-70B): ${GROQ_API_KEY ? `falhou (${groqErrorMsg})` : 'não configurado'}`,
        `OpenRouter (${OPENROUTER_MODEL}): ${OPENROUTER_API_KEY ? `falhou (${openrouterErrorMsg})` : 'não configurado'}`,
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

function parseJSONWithFallback<T>(text: string): T {
  try {
    return JSON.parse(text) as T;
  } catch (error) {
    console.warn("Failed to parse JSON directly, attempting to sanitize...");
    let sanitized = text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
    
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

export async function generateExam(params: ExamParams, onRetry?: (attempt: number, maxRetries: number, reason: string) => void): Promise<ExamData> {
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

  const systemInstruction = `Você é um gerador avançado de provas de Matemática para os anos finais do Ensino Fundamental (6º ao 9º ano). Seu objetivo é criar avaliações precisas, dinâmicas, altamente contextualizadas com a realidade local de Pernambuco (${localContext}) e rigorosamente alinhadas às diretrizes curriculares escolhidas pelo usuário.

REGRAS DA BASE CURRICULAR:
- Se "Currículo de Igarassu": Use as habilidades locais baseadas na BNCC (Ex: EF06MA01-IGPE).
- Se "Matriz da Luz": Use os Descritores da Matriz (Ex: D01, D14).
- Se "Ambos": Cada questão deve cruzar um Objeto de Conhecimento do Currículo de Igarassu com um Descritor compatível da Matriz da Luz.

ESTRUTURA E PROPORÇÃO DA PROVA:
- 20% - Questões Diretas: Focadas em algoritmos, cálculos puros e procedimentos matemáticos.
- 80% - Questões Contextualizadas: Problemas aplicados à realidade (Múltipla Escolha, Resposta Aberta, Completar Lacunas, Análise de Gráficos/Tabelas).
${bankOfContexts}
- TIPOS DE QUESTÃO: Exatamente 20% das questões DEVEM ser OBJETIVAS (múltipla escolha) e 80% DEVEM ser ABERTAS/DISCURSIVAS (sem opções de múltipla escolha).
- PROGRESSÃO DE DIFICULDADE: A prova DEVE ser rigorosamente ordenada por nível de dificuldade: primeiro as Fáceis, depois as Médias, e por fim as Difíceis.
- GABARITO RANDOMIZADO: As respostas corretas das questões de múltipla escolha DEVEM ser distribuídas aleatoriamente e de forma equilibrada entre as opções A, B, C e D. NUNCA coloque todas as respostas corretas na mesma letra (ex: evite que todas sejam "A").

FORMATO DE SAÍDA E SINTAXE LATEX (CRÍTICO):
Você deve retornar ESTRITAMENTE um objeto JSON válido contendo a lista de questões.
As fórmulas matemáticas devem usar a sintaxe LaTeX.

Você DEVE usar EXATAMENTE a estrutura de chaves e campos abaixo (em inglês):
{
  "questions": [
    {
      "id": 1,
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

REGRAS DE CONCISÃO CRÍTICAS (OBRIGATÓRIO PARA EVITAR LIMITE DE TOKENS EM PROVEDORES DE FALLBACK):
1. TEXTO DOS ENUNCIADOS: Seja direto. Evite rodeios ou histórias excessivamente longas. Máximo 2 sentenças.
2. EXPLICAÇÃO (explanation): Forneça apenas a resolução matemática passo a passo direta e ultra-curta (máximo de 15 palavras). Exemplo: "Área = 5m x 4m = 20m²" ou "Cálculo: 10% de 200 = 20".
3. METADATA: Use termos curtos (máximo 2 palavras) para "unidadeTematica" e "objetoConhecimento".

REGRAS OBRIGATÓRIAS DE LATEX PARA EVITAR ERROS DE COMPILAÇÃO:
1. SÍMBOLO DE PORCENTAGEM: Você NUNCA deve usar o símbolo "%" sozinho, pois ele atua como comentário no LaTeX e quebra a compilação. SEMPRE escape o símbolo de porcentagem usando DUAS barras invertidas no JSON: "\\\\%" (exemplo: "15\\\\% de desconto").
2. MODO MATEMÁTICO: TODO E QUALQUER comando matemático (como \\\\frac, \\\\sqrt, ^, _) DEVE estar dentro do modo matemático usando cifrões ($). Exemplo correto: "$\\\\frac{1}{2}$".
3. ACENTOS NO MODO MATEMÁTICO: NUNCA use palavras com acentos (como ç, á, é, ã) dentro do modo matemático ($...$). Se precisar escrever texto com acentos junto com matemática, coloque o texto FORA dos cifrões. Exemplo errado: "$preço = 50$". Exemplo correto: "preço = $50$".
4. ESPAÇAMENTO: NUNCA adicione comandos de espaçamento como \\\\vspace{} no texto das questões ou nas opções. O sistema já adiciona o espaço para respostas automaticamente.
5. SÍMBOLO DE MOEDA (R$): NUNCA use "R$" diretamente no texto, pois o cifrão ($) abre o modo matemático e quebra a formatação visual. SEMPRE escape o cifrão usando DUAS barras invertidas no JSON: "R\\\\$". Exemplo correto: "R\\\\$ 50,00".
6. OPÇÕES DE RESPOSTA: No array 'options', forneça APENAS o texto da opção, SEM o prefixo da letra (ex: "15" em vez de "A) 15" ou "a. 15"). O sistema já adiciona as letras automaticamente.
Se a questão for de múltipla escolha, forneça exatamente 4 opções no array 'options'. Se for aberta, omita o campo 'options' ou forneça um array vazio [].`;

  const prompt = `Por favor, gere uma prova de matemática com os seguintes parâmetros:
- Ano/Série: ${params.grade}
- Quantidade de questões: ${params.questionCount}
- Base Curricular: ${params.curriculum}
- Tópicos/Conteúdos: ${params.topics || 'Abranger a matriz geral do ano'}
- Nível de dificuldade: ${params.difficulty}
- Contexto temático: ${params.context || 'Variado (usar banco de contextos locais)'}`;

  try {
    const config: GenerateContentParameters = {
      model: 'gemini-2.5-flash-preview-05-20',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 8192,
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

    const result = await withFallback(
      config,
      systemInstruction,
      prompt,
      (text) => parseJSONWithFallback<ExamData>(text),
      onRetry
    );
    return result;
  } catch (error: any) {
    console.error("Erro em generateExam:", error);
    if (error instanceof RetryError) {
      throw error;
    }
    const errorString = (error?.message || JSON.stringify(error)).toUpperCase();
    if (errorString.includes('429') || errorString.includes('RESOURCE_EXHAUSTED') || errorString.includes('QUOTA')) {
      throw new Error("Limite de cota excedido. O sistema está tentando processar sua solicitação, mas os servidores do Google estão sobrecarregados. Por favor, aguarde 30 segundos e tente novamente.");
    }
    throw new Error(`Falha ao gerar a prova: ${error?.message || 'Erro desconhecido'}`);
  }
}

export interface QAResult {
  qaReport: string;
  correctedExam: ExamData;
}

export async function runQAAndCorrect(originalExam: ExamData, params: ExamParams, onRetry?: (attempt: number, maxRetries: number, reason: string) => void): Promise<QAResult> {
  let localContextName = '';
  if (params.curriculum === 'Matriz da Luz') {
    localContextName = 'São Lourenço da Mata/PE';
  } else if (params.curriculum === 'Currículo de Igarassu') {
    localContextName = 'Igarassu/PE';
  } else {
    localContextName = 'Igarassu/PE e São Lourenço da Mata/PE';
  }

  const systemInstruction = `Você é um VALIDADOR e CORRETOR ESPECIALIZADO em provas de Matemática para 6º-9º ano.
Sua missão: Receber uma prova em JSON, realizar uma análise de qualidade (QA) rigorosa e retornar a prova corrigida junto com o relatório de QA, tudo em um único objeto JSON.

REGRAS OBRIGATÓRIAS DE LATEX PARA EVITAR ERROS DE COMPILAÇÃO (CRÍTICO):
1. SÍMBOLO DE PORCENTAGEM: Você NUNCA deve usar o símbolo "%" sozinho. SEMPRE escape o símbolo de porcentagem usando DUAS barras invertidas no JSON: "\\\\%" (exemplo: "15\\\\% de desconto").
2. MODO MATEMÁTICO: TODO E QUALQUER comando matemático (como \\\\frac, \\\\sqrt, ^, _) DEVE estar dentro do modo matemático usando cifrões ($). Exemplo correto: "$\\\\frac{1}{2}$".
3. ACENTOS NO MODO MATEMÁTICO: NUNCA use palavras com acentos (como ç, á, é, ã) dentro do modo matemático ($...$). Exemplo correto: "preço = $50$".
4. ESPAÇAMENTO: NUNCA adicione comandos de espaçamento como \\\\vspace{} no texto das questões.
5. SÍMBOLO DE MOEDA (R$): NUNCA use "R$" diretamente no texto. SEMPRE escape o cifrão usando DUAS barras invertidas no JSON: "R\\\\$".
6. OPÇÕES DE RESPOSTA: No array 'options', forneça APENAS o texto da opção, SEM o prefixo da letra (ex: "15" em vez de "A) 15").

REGRAS DE CONTEÚDO E ESTRUTURA:
1. GABARITO RANDOMIZADO: Garanta que as respostas corretas das questões de múltipla escolha estejam distribuídas aleatoriamente.
2. PROGRESSÃO DE DIFICULDADE: As questões devem seguir a ordem: Fácil -> Médio -> Difícil.
3. CONTEXTUALIZAÇÃO: Verifique se os contextos de ${localContextName} são válidos e não repetitivos.
4. PROPORÇÃO DE TIPOS DE QUESTÃO: Ajuste a prova para que exatamente 20% das questões sejam OBJETIVAS (múltipla escolha) e 80% sejam ABERTAS/DISCURSIVAS (sem opções).

REGRAS DE CONCISÃO CRÍTICAS (OBRIGATÓRIO PARA EVITAR LIMITE DE TOKENS EM PROVEDORES DE FALLBACK):
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
  "qaReport": "Relatório em markdown",
  "correctedExam": {
    "questions": [
      {
        "id": 1,
        "type": "direta", // ou "contextualizada"
        "text": "Texto do enunciado com LaTeX",
        "options": ["Texto Opção A", "Texto Opção B", "Texto Opção C", "Texto Opção D"], // vazio [] se for aberta
        "answer": "Resposta correta",
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
}`;

  const prompt = `Prova Original (JSON):
${JSON.stringify(originalExam, null, 2)}

Por favor, analise a prova acima e retorne um objeto JSON contendo o relatório de QA (em Markdown) e a prova corrigida.`;

  try {
    const config: GenerateContentParameters = {
      model: 'gemini-2.5-flash-preview-05-20',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.2,
        maxOutputTokens: 8192,
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

    const result = await withFallback(
      config,
      systemInstruction,
      prompt,
      (text) => parseJSONWithFallback<QAResult>(text),
      onRetry
    );
    return result;
  } catch (error: any) {
    console.error("Erro em runQAAndCorrect:", error);
    if (error instanceof RetryError) {
      throw error;
    }
    const errorString = (error?.message || JSON.stringify(error)).toUpperCase();
    if (errorString.includes('429') || errorString.includes('RESOURCE_EXHAUSTED') || errorString.includes('QUOTA')) {
      throw new Error("Limite de cota excedido durante a análise de qualidade. Por favor, aguarde um momento.");
    }
    throw new Error(`Falha ao gerar o relatório de QA e corrigir a prova: ${error?.message || 'Erro desconhecido'}`);
  }
}
