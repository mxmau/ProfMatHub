import { GoogleGenAI, Type, GenerateContentParameters } from '@google/genai';

// --- PROVIDER MANAGEMENT ---
type ProviderName = 'gemini' | 'groq' | 'gemini-flash';

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
const GROQ_API_KEY = (typeof process !== 'undefined' && process.env?.GROQ_API_KEY) || '';
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
        { role: 'system', content: systemPrompt + '\n\nRESPONDA ESTRITAMENTE EM JSON VÁLIDO.' },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 8192,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Groq API error ${response.status}: ${errBody}`);
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
// Tries primary (Gemini), then Groq, then Gemini Flash
async function withFallback<T>(
  geminiConfig: GenerateContentParameters,
  systemPrompt: string,
  userPrompt: string,
  parseResult: (text: string) => T,
  onRetry?: (attempt: number, maxRetries: number, reason: string) => void
): Promise<T> {
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
    const errStr = (primaryError?.message || '').toUpperCase();
    const isQuota = errStr.includes('429') || errStr.includes('RESOURCE_EXHAUSTED') || errStr.includes('QUOTA');
    
    if (!isQuota && !(primaryError instanceof RetryError)) throw primaryError;
    
    console.warn('Gemini primary failed, trying Groq fallback...');
    onRetry?.(1, 3, 'Alternando para Groq (Gemini sobrecarregado)');
  }

  // 2. Try Groq
  if (GROQ_API_KEY) {
    try {
      setCurrentProvider('groq');
      const result = await withRetry(async () => {
        const text = await callGroq(systemPrompt, userPrompt);
        return parseResult(text);
      }, 2, onRetry);
      return result;
    } catch (groqError: any) {
      console.warn('Groq fallback failed, trying Gemini Flash...');
      onRetry?.(2, 3, 'Alternando para Gemini Flash (Groq falhou)');
    }
  } else {
    console.warn('Groq API key not set, skipping to Gemini Flash...');
    onRetry?.(2, 3, 'Groq não configurado, tentando Gemini Flash');
  }

  // 3. Try Gemini Flash (different model, might have separate quota)
  try {
    setCurrentProvider('gemini-flash');
    const flashConfig = { ...geminiConfig, model: 'gemini-2.0-flash' };
    const result = await withRetry(async () => {
      const response = await getAI().models.generateContent(flashConfig);
      const text = response.text || '{}';
      return parseResult(text);
    }, 3, onRetry);
    return result;
  } catch (flashError: any) {
    setCurrentProvider('gemini');
    throw new RetryError(
      'Todos os provedores falharam (Gemini, Groq, Gemini Flash). Por favor, tente novamente em alguns minutos.',
      [`Gemini: esgotado`, `Groq: ${GROQ_API_KEY ? 'falhou' : 'não configurado'}`, `Gemini Flash: falhou`]
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
    try {
      // First, just try stripping markdown code blocks
      let sanitized = text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
      
      try {
        return JSON.parse(sanitized) as T;
      } catch (e2) {
        // If it still fails, try fixing unescaped newlines inside strings
        // A naive approach: replace literal newlines with \n, but only if they are inside strings.
        // Actually, replacing all literal newlines with spaces is safer for JSON, 
        // but we must NOT replace \\" with \" because it breaks LaTeX strings ending in \\
        sanitized = sanitized.replace(/[\n\r\t]/g, ' ');
        
        // Remove trailing commas before closing brackets/braces
        sanitized = sanitized.replace(/,\s*([\]}])/g, '$1');
        
        return JSON.parse(sanitized) as T;
      }
    } catch (fallbackError) {
      console.error("Failed to parse sanitized JSON:", fallbackError);
      throw error; // Throw original error
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
      model: 'gemini-3-flash-preview',
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

O relatório de QA deve ser formatado em Markdown e conter as seguintes seções:
- Validação Estrutural
- Validação de Conteúdo
- Validação Pedagógica
- Problemas Identificados
- Ações Corretivas Realizadas
- Status Final (APROVADO ou AJUSTES REALIZADOS)`;

  const prompt = `Prova Original (JSON):
${JSON.stringify(originalExam, null, 2)}

Por favor, analise a prova acima e retorne um objeto JSON contendo o relatório de QA (em Markdown) e a prova corrigida.`;

  try {
    const config: GenerateContentParameters = {
      model: 'gemini-3-flash-preview',
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
