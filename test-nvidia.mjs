import fs from 'fs';
import path from 'path';

function log(msg, ...rest) {
  console.log(`[${new Date().toISOString()}] ${msg}`, ...rest);
}

// Dynamically extract environment variables from .env.local
let NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || '';
let NVIDIA_MODEL = process.env.NVIDIA_MODEL || 'meta/llama-3.3-70b-instruct';

try {
  const envLocalPath = path.resolve('.env.local');
  if (fs.existsSync(envLocalPath)) {
    const content = fs.readFileSync(envLocalPath, 'utf8');
    const keyMatch = content.match(/NVIDIA_API_KEY\s*=\s*["']?([^"'\r\n]+)["']?/);
    const modelMatch = content.match(/NVIDIA_MODEL\s*=\s*["']?([^"'\r\n]+)["']?/);
    if (keyMatch && keyMatch[1]) {
      NVIDIA_API_KEY = keyMatch[1].trim();
    }
    if (modelMatch && modelMatch[1]) {
      NVIDIA_MODEL = modelMatch[1].trim();
    }
  }
} catch (e) {
  log('Could not read .env.local file:', e.message);
}

function parseJSONWithFallback(text) {
  try { return JSON.parse(text); }
  catch {
    log('Direct JSON parse failed, sanitizing...');
    let sanitized = text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
    try { return JSON.parse(sanitized); }
    catch {
      log('Standard sanitization failed, attempting backtracking truncation recovery...');
      try {
        let lastClosedQuestionIdx = sanitized.lastIndexOf('}');
        while (lastClosedQuestionIdx > 0) {
          const substring = sanitized.slice(0, lastClosedQuestionIdx + 1);
          
          // Test with questions key
          try {
            const candidate = substring.trim() + '\n  ]\n}';
            const parsed = JSON.parse(candidate);
            if (parsed && parsed.questions && parsed.questions.length > 0) {
              log(`🎉 Recuperado com sucesso via Truncation Recovery! ${parsed.questions.length} questões recuperadas.`);
              return parsed;
            }
          } catch (e) {}
          
          lastClosedQuestionIdx = sanitized.lastIndexOf('}', lastClosedQuestionIdx - 1);
        }
      } catch (truncationError) {
        log("Truncation recovery failed:", truncationError.message);
      }
      
      sanitized = sanitized.replace(/[\n\r\t]/g, ' ').replace(/,\s*([\]}])/g, '$1');
      return JSON.parse(sanitized);
    }
  }
}

const systemInstruction = `Você é um gerador avançado de provas de Matemática para os anos finais do Ensino Fundamental.
Seu objetivo é criar avaliações precisas, dinâmicas e rigorosamente alinhadas ao Currículo de Igarassu.

ESTRUTURA E PROPORÇÃO DA PROVA:
- 20% - Questões Diretas: Focadas em algoritmos e cálculos.
- 80% - Questões Contextualizadas: Problemas aplicados à realidade local de Igarassu/PE.
- TIPOS DE QUESTÃO: 20% objetivas (múltipla escolha com 4 opções A/B/C/D), 80% abertas/discursivas (sem opções).
- PROGRESSÃO DE DIFICULDADE: primeiro as Fáceis, depois as Médias, por fim as Difíceis.

FORMATO DE SAÍDA (CRÍTICO):
Retorne ESTRITAMENTE um objeto JSON com a seguinte estrutura:
{
  "questions": [
    {
      "id": 1,
      "type": "direta",
      "text": "Enunciado com LaTeX",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "answer": "A",
      "explanation": "Resolução passo a passo",
      "metadata": {
        "nivelComplexidade": "Fácil",
        "unidadeTematica": "Números",
        "objetoConhecimento": "Inteiros"
      }
    }
  ]
}
Questões abertas têm "options": [] e "answer" com a resposta completa.

RESPONDA ESTRITAMENTE EM JSON VÁLIDO. Não inclua texto fora do JSON.`;

const userPrompt = `Por favor, gere uma prova de matemática com os seguintes parâmetros:
- Escola: Escola Ecilda Ramos de Souza
- Atividade: Atividade 1 - I Bimestre
- Ano/Série: 7º
- Turma: A
- Data: 29/05/2026
- Professor(a): Prof. Maurílio
- Valor: 10,0
- Quantidade de questões: 50
- Base Curricular: Currículo de Igarassu
- Tópicos/Conteúdos: Números inteiros, frações, geometria plana, proporções e porcentagem
- Nível de dificuldade: Mesclado (Fácil, Médio e Difícil)
- Contexto temático: Cotidiano de Igarassu (use elementos locais: Forte Orange, Sítio Histórico, Praia do Capitão, Feira livre, Rio Igarassu)`;

async function testNvidia50Questions() {
  log('=== Testando NVIDIA NIM com 50 questões (configuração Pro) ===');
  log(`Modelo ativo: ${NVIDIA_MODEL}`);
  
  if (!NVIDIA_API_KEY) {
    log('❌ ERRO: NVIDIA_API_KEY não foi encontrada no arquivo .env.local!');
    log('Adicione a linha NVIDIA_API_KEY="sua_chave" em .env.local e tente novamente.');
    process.exit(1);
  }
  
  log(`API Key carregada com sucesso (começa com: ${NVIDIA_API_KEY.substring(0, 10)}...)`);
  
  const startTime = Date.now();
  
  const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${NVIDIA_API_KEY}` 
    },
    body: JSON.stringify({
      model: NVIDIA_MODEL,
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 8000,
    }),
  });

  const elapsed = Date.now() - startTime;
  log(`Resposta recebida em ${elapsed}ms, status: ${response.status}`);

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`NVIDIA API error ${response.status}: ${errBody}`);
  }

  const data = await response.json();
  const finishReason = data.choices?.[0]?.finish_reason;
  const usage = data.usage;
  
  log(`finish_reason: ${finishReason}`);
  log(`Tokens usados: prompt=${usage?.prompt_tokens}, completion=${usage?.completion_tokens}, total=${usage?.total_tokens}`);
  
  if (finishReason === 'length') {
    log('⚠️ AVISO: resposta truncada! Aumente max_tokens ou ative a concisão.');
  }

  const rawText = data.choices?.[0]?.message?.content || '';
  log(`Tamanho da resposta: ${rawText.length} chars`);
  log(`Início: ${rawText.slice(0, 200)}`);
  log(`Fim: ${rawText.slice(-200)}`);

  try {
    const parsed = parseJSONWithFallback(rawText);
    const questions = parsed?.questions || [];
    log(`✅ JSON parseado com sucesso!`);
    log(`📊 Questões geradas: ${questions.length} de 50 esperadas`);
    
    if (questions.length > 0) {
      log(`Amostra Q1: ${JSON.stringify(questions[0]).slice(0, 200)}`);
      log(`Amostra Q${questions.length}: ${JSON.stringify(questions[questions.length-1]).slice(0, 150)}`);
    }
    
    // Check question types
    const objetivas = questions.filter(q => q.options && q.options.length > 0);
    const abertas = questions.filter(q => !q.options || q.options.length === 0);
    log(`Objetivas: ${objetivas.length}, Abertas: ${abertas.length}`);
    
    if (questions.length >= 30) {
      log('🎉 SUCESSO! NVIDIA Pro gerou questões suficientes.');
    } else if (questions.length > 0) {
      log(`⚠️ Parcial: ${questions.length} questões geradas.`);
    } else {
      log('❌ FALHOU: 0 questões geradas.');
    }
    
    return questions.length;
  } catch(e) {
    log(`❌ Erro ao parsear JSON: ${e.message}`);
    log('Raw completo:', rawText);
    return 0;
  }
}

testNvidia50Questions()
  .then(count => {
    console.log(`\n=== RESULTADO FINAL: ${count}/50 questões ===`);
    process.exit(count >= 30 ? 0 : 1);
  })
  .catch(e => { 
    console.error('FATAL:', e); 
    process.exit(1); 
  });
