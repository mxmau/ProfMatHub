import { Unit } from './types.ts';

export const unit1: Unit = {
  id: 'u1-7',
  title: 'Unidade I: Múltiplos, Divisores e Racionais',
  dateRange: '10 Fev - 15 Abr',
  description: 'Revisão avançada de divisibilidade, MMC/MDC e Números Racionais no cotidiano.',
  color: 'bg-blue-100 border-blue-300 text-blue-800',
  bnccSkills: [
    'EF07MA01: Múltiplos e divisores.',
    'EF07MA08: Frações e seus significados.',
    'EF07MA09: Fração e números decimais.',
    'EF07MA10: Operações com frações.'
  ],
  items: [
    {
      id: 'l1-1', type: 'lesson', title: 'Aula 01 - Aprofundando Múltiplos', skill: 'EF07MA01', complexity: 'Baixa',
      content: {
        intro: 'A tabuada infinita volta com força.',
        development: ['Múltiplos no dia a dia (escalas, padrões).', 'Revisão de Múltiplos e MMC.'],
        examples: [{ question: 'Dois ônibus partem juntos. Um de 20 em 20 min, outro de 30 em 30. Quando se encontram?', answer: 'Em 60 min (MMC de 20 e 30).' }],
        conclusion: 'MMC serve para encontrar a repetição simultânea.'
      }
    },
    {
      id: 'l1-2', type: 'lesson', title: 'Aula 02 - Aprofundando Divisores', skill: 'EF07MA01', complexity: 'Média',
      content: {
        intro: 'Como cortar pedaços exatos.',
        development: ['Divisores e Máximo Divisor Comum (MDC).', 'Divisão em partes iguais.'],
        examples: [{ question: 'Quero dividir cordas de 12m e 18m em pedaços iguais do maior tamanho possível. Qual o tamanho?', answer: '6m (MDC de 12 e 18).' }],
        conclusion: 'MDC serve para dividir sem sobrar nada.'
      }
    },
    { id: 'p1-1', type: 'practical', title: 'Aula 03 - Prática: Cortando Cordas', skill: 'EF07MA01', complexity: 'Média', practicalDescription: 'Com pedaços de barbante de tamanhos diferentes, os alunos devem cortar no maior tamanho comum usando régua, provando o MDC na prática.' },
    {
      id: 'l1-4', type: 'lesson', title: 'Aula 04 - Frações: Parte, Quociente, Razão', skill: 'EF07MA08', complexity: 'Baixa',
      content: {
        intro: 'Fração não é só pizza.',
        development: ['Fração como parte do todo.', 'Fração como divisão (quociente).', 'Fração como razão (1 para 3).'],
        examples: [{ question: 'Se 2 de 5 alunos usam óculos, qual a razão?', answer: '$2/5$.' }],
        conclusion: 'A mesma representação para várias ideias.'
      }
    },
    {
      id: 'l1-5', type: 'lesson', title: 'Aula 05 - Transformando Fração e Decimal', skill: 'EF07MA09', complexity: 'Média',
      content: {
        intro: 'A ponte entre os dois mundos.',
        development: ['Como passar de decimal para fração e vice-versa.', 'A divisão do numerador pelo denominador.'],
        examples: [{ question: 'Escreva $3/4$ como decimal.', answer: '$3 \\div 4 = 0,75$.' }],
        conclusion: 'Toda fração é uma divisão esperando para acontecer.'
      }
    },
    { id: 'ex1-1', type: 'exercise', title: 'Exercícios 1 (Múltiplos e Racionais)', questions: [{ question: 'Transforme $0,8$ em fração.', answer: '$8/10$ que simplifica para $4/5$' }] },
    { 
      id: 'act1-1', type: 'activity', title: 'Avaliação Unidade I', skill: 'Geral', 
      questions: [
        { question: 'Calcule o MMC de $15$ e $20$.', answer: '$60$', spaceForWork: true },
        { question: 'Represente a fração $5/2$ em número decimal.', answer: '$2,5$', spaceForWork: true },
        { question: 'Em uma sala de $30$ alunos, $2/3$ são meninas. Quantas são?', answer: '$20$ meninas.', spaceForWork: true },
        { question: 'Calcule o MDC de $24$ e $36$.', answer: '$12$.', spaceForWork: true },
        { question: 'Transforme $0,625$ em fração irredutível.', answer: '$625/1000 = 5/8$.', spaceForWork: true },
        { question: 'Uma torneira enche um tanque em $12$ min e outra em $18$ min. De quanto em quanto tempo ambas coincidem?', answer: '$36$ min (MMC de $12$ e $18$).', spaceForWork: true },
        { question: 'Qual a razão entre $8$ e $20$ na forma simplificada?', answer: '$2/5$.', spaceForWork: true },
        { question: 'Calcule $3/4$ de $200$.', answer: '$150$.', spaceForWork: true },
        { question: 'Escreva $1/8$ como decimal.', answer: '$0,125$.', spaceForWork: true },
        { question: 'Uma corda de $45m$ deve ser cortada em pedaços iguais de maior tamanho possível, sabendo que outra corda de $30m$ também será cortada no mesmo tamanho. Qual o tamanho?', answer: '$15m$ (MDC de $45$ e $30$).', spaceForWork: true }
      ] 
    }
  ]
};

export const unit2: Unit = {
  id: 'u2-7',
  title: 'Unidade II: Números Inteiros e Racionais',
  dateRange: '16 Abr - 07 Jul',
  description: 'Introdução aos números negativos, reta numérica e operações.',
  color: 'bg-green-100 border-green-300 text-green-800',
  bnccSkills: [
    'EF07MA03: Números inteiros (Z) na reta numérica.',
    'EF07MA04: Operações com números inteiros.'
  ],
  items: [
    {
      id: 'l2-1', type: 'lesson', title: 'Aula 01 - O Mundo Negativo', skill: 'EF07MA03', complexity: 'Baixa',
      content: {
        intro: 'Dinheiro, temperatura e profundidade.',
        development: ['O zero como origem.', 'Números positivos (lucro, acima de zero) e negativos (dívida, abaixo de zero).', 'A Reta Numérica Inteira (Z).'],
        examples: [{ question: 'Escreva: "Dívida de R$ 50".', answer: '$-50$.' }],
        conclusion: 'Sinal negativo indica "falta" ou "abaixo".'
      }
    },
    {
      id: 'l2-2', type: 'lesson', title: 'Aula 02 - Opostos e Módulo', skill: 'EF07MA03', complexity: 'Média',
      content: {
        intro: 'A distância até o zero.',
        development: ['Módulo ou Valor Absoluto (sempre positivo). $|-5| = 5$.', 'Números opostos ou simétricos ($5$ e $-5$).'],
        examples: [{ question: 'Qual o oposto de $-12$?', answer: '$12$.' }],
        conclusion: 'Oposto é trocar o sinal.'
      }
    },
    {
      id: 'l2-3', type: 'lesson', title: 'Aula 03 - Adição de Inteiros', skill: 'EF07MA04', complexity: 'Alta',
      content: {
        intro: 'Somando dívidas e lucros.',
        development: ['Sinais iguais: Soma e repete o sinal.', 'Sinais diferentes: Subtrai e dá o sinal do maior módulo.'],
        examples: [{ question: '$-5 + (-3)$', answer: '$-8$ (somou dívidas).' }, { question: '$+10 + (-4)$', answer: '$+6$ (pagou a dívida e sobrou).' }],
        conclusion: 'Pense sempre em dinheiro.'
      }
    },
    { id: 'p2-1', type: 'practical', title: 'Aula 04 - Prática: O Jogo do Extrato Bancário', skill: 'EF07MA04', complexity: 'Média', practicalDescription: 'Alunos recebem um extrato bancário zerado e cartas de "Depósito" e "Saque". Eles devem calcular o saldo final (positivo ou negativo) após 10 rodadas.' },
    {
      id: 'l2-5', type: 'lesson', title: 'Aula 05 - Subtração de Inteiros', skill: 'EF07MA04', complexity: 'Alta',
      content: {
        intro: 'Tirar uma dívida é a mesma coisa que ganhar?',
        development: ['Subtrair é o mesmo que somar o oposto.', '$- (-)$ vira $+$.'],
        examples: [{ question: '$5 - (-3)$', answer: '$5 + 3 = 8$.' }],
        conclusion: 'O sinal de menos inverte o sinal do vizinho.'
      }
    },
    {
      id: 'l2-6', type: 'lesson', title: 'Aula 06 - Multiplicação e Divisão', skill: 'EF07MA04', complexity: 'Média',
      content: {
        intro: 'A regra dos sinais.',
        development: ['Sinais iguais (+$+$ ou $-$-): Resultado $+$.', 'Sinais diferentes (+$+$ e $-$-): Resultado $-$.'],
        examples: [{ question: '$(-4) \\times (-3)$', answer: '$+12$.' }, { question: '$(-20) \\div (+5)$', answer: '$-4$.' }],
        conclusion: 'Multiplica/Divide normal, depois aplica a regra do sinal.'
      }
    },
    { id: 'ex2-1', type: 'exercise', title: 'Exercícios 2 (Operações em Z)', questions: [{ question: '$-15 + 8$', answer: '$-7$' }, { question: '$(-6) \\times (+3)$', answer: '$-18$' }] },
    { 
      id: 'act2-1', type: 'activity', title: 'Avaliação Unidade II', skill: 'Geral', 
      questions: [
        { question: 'Qual é o módulo de $-45$?', answer: '$45$.', spaceForWork: false },
        { question: 'Calcule o saldo: Tinha R$ $100$, saquei R$ $150$.', answer: '$-50$.', spaceForWork: true },
        { question: 'Resolva: $(-7) \\times (-8)$.', answer: '$+56$.', spaceForWork: true },
        { question: 'Resolva a expressão: $-10 + 5 - (-3)$.', answer: '$-2$.', spaceForWork: true },
        { question: 'Qual o oposto de $-25$?', answer: '$25$.', spaceForWork: false },
        { question: 'Ordene do menor para o maior: $-3$, $0$, $-7$, $4$.', answer: '$-7$, $-3$, $0$, $4$.', spaceForWork: true },
        { question: 'Calcule: $(-20) \\div (+4)$.', answer: '$-5$.', spaceForWork: true },
        { question: 'A temperatura pela manhã era $-2^\\circ C$ e subiu $8^\\circ C$. Qual a temperatura atual?', answer: '$6^\\circ C$.', spaceForWork: true },
        { question: 'Resolva: $(-6) + (-4) + (+10)$.', answer: '$0$.', spaceForWork: true },
        { question: 'Um elevador está no andar $3$. Desce $5$ andares. Em qual andar está?', answer: 'Andar $-2$ (subsolo $2$).', spaceForWork: true }
      ] 
    }
  ]
};
