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
    { id: 'l1-1', type: 'lesson', title: 'Aula 01 - Aprofundando Múltiplos', skill: 'EF07MA01', complexity: 'Baixa', content: { intro: 'A tabuada infinita volta com força.', development: ['Revisão de Múltiplos e Padrões.', 'Sequências numéricas crescentes.'], examples: [{ question: 'Quais os 4 primeiros múltiplos de 7?', answer: '0, 7, 14, 21.' }], conclusion: 'O zero é múltiplo de todos.' } },
    { id: 'l1-2', type: 'lesson', title: 'Aula 02 - Aprofundando Divisores', skill: 'EF07MA01', complexity: 'Baixa', content: { intro: 'Como cortar pedaços exatos.', development: ['Revisão de Divisores.', 'O número 1 como divisor universal.'], examples: [{ question: 'Divisores de 18?', answer: '1, 2, 3, 6, 9, 18.' }], conclusion: 'Divisores formam um conjunto finito.' } },
    { id: 'l1-3', type: 'lesson', title: 'Aula 03 - Números Primos e Fatoração Avançada', skill: 'EF07MA01', complexity: 'Média', content: { intro: 'A base de tudo.', development: ['Decomposição em fatores primos com números grandes.', 'Uso de potências na fatoração.'], examples: [{ question: 'Fatore 120.', answer: '$2^3 \\times 3 \\times 5$.' }], conclusion: 'Primos são os blocos construtores.' } },
    { id: 'p1-1', type: 'practical', title: 'Aula 04 - Prática: O Crivo Gigante', skill: 'EF07MA01', complexity: 'Baixa', practicalDescription: 'Criar um Crivo de Eratóstenes até 100 em um cartaz gigante na sala de aula, eliminando os múltiplos com cores diferentes.' },
    { id: 'l1-5', type: 'lesson', title: 'Aula 05 - MMC: Problemas de Encontro', skill: 'EF07MA01', complexity: 'Alta', content: { intro: 'Quando as coisas vão se cruzar?', development: ['MMC por decomposição simultânea.', 'Problemas clássicos de tempo (ônibus, remédios, piscar de luzes).'], examples: [{ question: 'Eventos a cada 12h e 15h. Quando coincidem?', answer: 'Em 60h (MMC).' }], conclusion: 'MMC = Encontro futuro.' } },
    { id: 'l1-6', type: 'lesson', title: 'Aula 06 - MDC: Problemas de Repartição', skill: 'EF07MA01', complexity: 'Alta', content: { intro: 'O maior pedaço igual.', development: ['MDC por decomposição simultânea.', 'Problemas clássicos de corte de cordas e formação de equipes.'], examples: [{ question: 'Cordas de 12m e 18m. Maior corte igual?', answer: '6m (MDC).' }], conclusion: 'MDC = Divisão máxima sem sobrar.' } },
    { id: 'ex1-1', type: 'exercise', title: 'Aula 07 - Bloco de Exercícios 1: Múltiplos e Divisores', questions: [{ question: 'MMC e MDC de 20 e 30.', answer: 'MMC = 60, MDC = 10.' }, { question: 'O 15 é primo?', answer: 'Não, divide por 3 e 5.' }] },
    
    { id: 'l1-8', type: 'lesson', title: 'Aula 08 - Frações: Parte e Todo', skill: 'EF07MA08', complexity: 'Baixa', content: { intro: 'A base racional.', development: ['Revisão de numerador e denominador.', 'Leitura correta e representação gráfica.'], examples: [{ question: '3 fatias de uma pizza cortada em 8.', answer: '$3/8$.' }], conclusion: 'Fração é uma divisão do inteiro.' } },
    { id: 'l1-9', type: 'lesson', title: 'Aula 09 - Fração como Quociente e Razão', skill: 'EF07MA08', complexity: 'Média', content: { intro: 'Diferentes olhares.', development: ['Fração como divisão exata (quociente).', 'Fração como comparação de grandezas (razão).'], examples: [{ question: '2 meninos para cada 3 meninas.', answer: 'Razão de 2/3.' }], conclusion: 'A mesma representação serve para várias ideias.' } },
    { id: 'p1-2', type: 'practical', title: 'Aula 10 - Prática: A Receita Fracionada', skill: 'EF07MA08', complexity: 'Média', practicalDescription: 'Trabalhar com receitas, dobrando ou cortando pela metade as quantidades dos ingredientes representados em frações.' },
    { id: 'l1-11', type: 'lesson', title: 'Aula 11 - Frações Equivalentes e Simplificação', skill: 'EF07MA08', complexity: 'Média', content: { intro: 'Mesmo valor, caras diferentes.', development: ['Multiplicar/Dividir numerador e denominador pelo mesmo número.', 'Chegar à fração irredutível via MDC.'], examples: [{ question: 'Simplifique 24/36.', answer: '$2/3$.' }], conclusion: 'Reduza sempre que puder.' } },
    { id: 'l1-12', type: 'lesson', title: 'Aula 12 - Comparação de Frações', skill: 'EF07MA08', complexity: 'Alta', content: { intro: 'Quem é o maior pedaço?', development: ['Comparar frações com mesmo denominador.', 'Usar MMC para comparar frações com denominadores diferentes.'], examples: [{ question: 'Quem é maior: 2/3 ou 3/4?', answer: 'MMC é 12. Fica 8/12 e 9/12. Então 3/4 é maior.' }], conclusion: 'Iguais os denominadores primeiro.' } },
    { id: 'ex1-2', type: 'exercise', title: 'Aula 13 - Bloco de Exercícios 2: Frações', questions: [{ question: 'Simplifique 15/25.', answer: '3/5.' }, { question: 'Maior: 1/2 ou 3/5?', answer: '3/5 (5/10 vs 6/10).' }] },
    
    { id: 'l1-14', type: 'lesson', title: 'Aula 14 - Adição e Subtração de Frações', skill: 'EF07MA10', complexity: 'Alta', content: { intro: 'Misturando pedaços.', development: ['Com denominadores iguais.', 'Com denominadores diferentes (necessidade do MMC).'], examples: [{ question: '1/2 + 1/3.', answer: '3/6 + 2/6 = 5/6.' }], conclusion: 'O MMC resolve denominadores diferentes.' } },
    { id: 'l1-15', type: 'lesson', title: 'Aula 15 - Multiplicação de Frações', skill: 'EF07MA10', complexity: 'Média', content: { intro: 'Direto e reto.', development: ['Multiplica o de cima pelo de cima, o de baixo pelo de baixo.', 'A palavra "de" ($1/2$ de $1/4$).'], examples: [{ question: '$2/3 \\times 4/5$.', answer: '$8/15$.' }], conclusion: 'Cima com cima, baixo com baixo.' } },
    { id: 'l1-16', type: 'lesson', title: 'Aula 16 - Divisão de Frações', skill: 'EF07MA10', complexity: 'Alta', content: { intro: 'O inverso entra em ação.', development: ['Repete a primeira, multiplica pelo inverso da segunda.', 'Frações complexas (andar sobre andar).'], examples: [{ question: '$(1/2) \\div (1/4)$.', answer: '$1/2 \\times 4/1 = 4/2 = 2$.' }], conclusion: 'Vira de ponta cabeça e multiplica.' } },
    { id: 'p1-3', type: 'practical', title: 'Aula 17 - Prática: O Tangram Fracionário', skill: 'EF07MA10', complexity: 'Alta', practicalDescription: 'Montar um Tangram e descobrir que fração da área total representa cada peça (ex: o triângulo maior é 1/4 do todo). Somar peças para conferir o inteiro.' },
    { id: 'ex1-3', type: 'exercise', title: 'Aula 18 - Bloco de Exercícios 3: Operações com Frações', questions: [{ question: '$1/4 + 1/4$', answer: '$1/2$' }, { question: '$3/5 \\times 5/3$', answer: '$1$' }] },
    
    { id: 'l1-19', type: 'lesson', title: 'Aula 19 - Transformando Fração e Decimal', skill: 'EF07MA09', complexity: 'Média', content: { intro: 'A ponte entre os dois mundos.', development: ['Dividir numerador por denominador.', 'Transformar decimal exato em fração de base 10.'], examples: [{ question: 'Escreva 3/4 como decimal.', answer: '$3 \\div 4 = 0,75$.' }], conclusion: 'Toda fração é uma divisão.' } },
    { id: 'l1-20', type: 'lesson', title: 'Aula 20 - Dízimas Periódicas (Introdução)', skill: 'EF07MA09', complexity: 'Alta', content: { intro: 'O número que não acaba.', development: ['Divisões infinitas.', 'Período e barra de repetição ($0,333...$ = $0,\\overline{3}$).'], examples: [{ question: 'Qual a forma decimal de 1/3?', answer: '$0,333...$' }], conclusion: 'Dízima é infinita com padrão.' } },
    { id: 'l1-21', type: 'lesson', title: 'Aula 21 - Operações com Decimais', skill: 'EF07MA10', complexity: 'Média', content: { intro: 'Vírgula com vírgula.', development: ['Alinhamento para soma e subtração.', 'Contagem de casas na multiplicação.'], examples: [{ question: '$1,2 \\times 0,3$', answer: '$0,36$' }], conclusion: 'A vírgula dita a regra.' } },
    { id: 'l1-22', type: 'lesson', title: 'Aula 22 - Resolução de Problemas (Racionais)', skill: 'EF07MA10', complexity: 'Alta', content: { intro: 'Trazendo para a vida.', development: ['Problemas envolvendo dinheiro (decimais) e medidas (frações).'], examples: [{ question: 'Gastei 1/3 de R$ 90,00. Quanto sobrou?', answer: 'Gastei 30, sobrou 60.' }], conclusion: 'Interprete antes de calcular.' } },
    
    { id: 'l1-23', type: 'lesson', title: 'Aula 23 - Revisão Geral I', skill: 'EF07MA01', complexity: 'Média', content: { intro: 'Revisando MMC e MDC.', development: ['Resolução de questões de encontro e repartição.'], examples: [], conclusion: 'Dúvidas e ajustes.' } },
    { id: 'l1-24', type: 'lesson', title: 'Aula 24 - Revisão Geral II', skill: 'EF07MA10', complexity: 'Média', content: { intro: 'Revisando Racionais.', development: ['Soma de frações e operações com decimais.'], examples: [], conclusion: 'Prontos para a avaliação.' } },

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
  title: 'Unidade II: Números Inteiros (Z)',
  dateRange: '16 Abr - 07 Jul',
  description: 'Introdução aos números negativos, reta numérica e operações em Z.',
  color: 'bg-green-100 border-green-300 text-green-800',
  bnccSkills: [
    'EF07MA03: Números inteiros (Z) na reta numérica.',
    'EF07MA04: Operações com números inteiros.'
  ],
  items: [
    { id: 'l2-1', type: 'lesson', title: 'Aula 01 - O Mundo Negativo', skill: 'EF07MA03', complexity: 'Baixa', content: { intro: 'Temperaturas, contas e profundidades.', development: ['Situações do cotidiano: acima e abaixo de zero.', 'A ideia de dívida e crédito.'], examples: [{ question: 'Se estou a $5m$ abaixo do nível do mar, como represento?', answer: '$-5m$.' }], conclusion: 'O negativo representa uma falta ou rebaixamento.' } },
    { id: 'l2-2', type: 'lesson', title: 'Aula 02 - O Conjunto dos Inteiros (Z)', skill: 'EF07MA03', complexity: 'Baixa', content: { intro: 'Os Naturais não bastam mais.', development: ['O que forma o conjunto Z (Naturais + Zero + Negativos).', 'Representação por chaves $\\{\\dots, -2, -1, 0, 1, 2, \\dots\\}$'], examples: [{ question: 'O número $0$ é positivo ou negativo?', answer: 'Nem um nem outro, é neutro.' }], conclusion: 'Os Inteiros expandem nosso alcance.' } },
    { id: 'l2-3', type: 'lesson', title: 'Aula 03 - A Reta Numérica Inteira', skill: 'EF07MA03', complexity: 'Média', content: { intro: 'O mapa dos números.', development: ['Construção da reta, com 0 no meio.', 'Positivos à direita, Negativos à esquerda.'], examples: [{ question: 'Quem está mais à direita: $-3$ ou $-1$?', answer: 'O $-1$.' }], conclusion: 'O número à direita sempre é maior.' } },
    { id: 'p2-1', type: 'practical', title: 'Aula 04 - Prática: A Reta Humana', skill: 'EF07MA03', complexity: 'Baixa', practicalDescription: 'Com uma fita no chão da quadra representando a reta numérica, alunos recebem placas numeradas e devem se posicionar no lugar correto o mais rápido possível.' },
    { id: 'l2-5', type: 'lesson', title: 'Aula 05 - Comparação e Ordenação em Z', skill: 'EF07MA03', complexity: 'Média', content: { intro: 'Quem tem mais?', development: ['Uso dos sinais $>$ (maior) e $<$ (menor).', 'Uma dívida menor ($-1$) é "maior" (melhor) que uma dívida maior ($-10$).'], examples: [{ question: 'Compare: $-5$ ___ $-2$.', answer: '$-5 < -2$.' }], conclusion: 'Quanto mais à esquerda, menor.' } },
    { id: 'l2-6', type: 'lesson', title: 'Aula 06 - Opostos, Simétricos e Módulo', skill: 'EF07MA03', complexity: 'Alta', content: { intro: 'A distância até o espelho.', development: ['Módulo/Valor absoluto $|x|$ é a distância até zero.', 'Oposto é o mesmo número com sinal invertido.'], examples: [{ question: 'Qual o módulo de $|-15|$?', answer: '$15$.' }], conclusion: 'Distância (módulo) nunca é negativa.' } },
    { id: 'ex2-1', type: 'exercise', title: 'Aula 07 - Bloco de Exercícios 1: Reta e Módulo', questions: [{ question: '$|-8| + |3|$', answer: '$11$' }, { question: 'Oposto de $-40$', answer: '$40$' }] },
    
    { id: 'l2-8', type: 'lesson', title: 'Aula 08 - Adição de Inteiros (Sinais Iguais)', skill: 'EF07MA04', complexity: 'Baixa', content: { intro: 'Acumulando valores.', development: ['Soma de positivos com positivos.', 'Soma de dívidas com dívidas (negativo com negativo).'], examples: [{ question: '$(-3) + (-4)$', answer: '$-7$ (dívida aumenta).' }], conclusion: 'Sinais iguais: soma os números e repete o sinal.' } },
    { id: 'l2-9', type: 'lesson', title: 'Aula 09 - Adição de Inteiros (Sinais Diferentes)', skill: 'EF07MA04', complexity: 'Média', content: { intro: 'Pagando a conta.', development: ['Soma de lucro com dívida.', 'Regra: Subtrai os números e dá o sinal do "maior".'], examples: [{ question: '$+10 + (-4)$', answer: '$+6$ (pagou e sobrou).' }], conclusion: 'Sinais diferentes: briga de forças, vence o maior.' } },
    { id: 'p2-2', type: 'practical', title: 'Aula 10 - Prática: Jogo do Banco', skill: 'EF07MA04', complexity: 'Média', practicalDescription: 'Cada aluno tem um "saldo inicial" fictício e recebe cartas de transações (Crédito/Débito). Devem fazer as adições de inteiros para descobrir o saldo final.' },
    { id: 'l2-11', type: 'lesson', title: 'Aula 11 - Subtração de Inteiros', skill: 'EF07MA04', complexity: 'Alta', content: { intro: 'Tirar uma dívida é ganhar.', development: ['O sinal de menos inverte o sinal do vizinho da direita.', 'Transformar subtração em adição do oposto.'], examples: [{ question: '$5 - (-3)$', answer: '$5 + 3 = 8$.' }], conclusion: 'O menos fora do parênteses significa "o oposto de".' } },
    { id: 'l2-12', type: 'lesson', title: 'Aula 12 - Expressões Simples de Adição/Subtração', skill: 'EF07MA04', complexity: 'Alta', content: { intro: 'Juntando tudo.', development: ['Eliminação de parênteses seguidos.', 'Agrupamento (somar todos os $+$, somar todos os $-$, depois confrontar).'], examples: [{ question: '$-2 + 5 - 4 + 1$', answer: 'Positivos: $6$. Negativos: $-6$. Saldo: $0$.' }], conclusion: 'Organize as forças antes do combate final.' } },
    { id: 'ex2-2', type: 'exercise', title: 'Aula 13 - Bloco de Exercícios 2: Adição e Subtração', questions: [{ question: '$-15 + 8$', answer: '$-7$' }, { question: '$-4 - (-4)$', answer: '$0$' }] },
    
    { id: 'l2-14', type: 'lesson', title: 'Aula 14 - Multiplicação de Inteiros', skill: 'EF07MA04', complexity: 'Média', content: { intro: 'Repetindo dívidas e lucros.', development: ['Multiplicação de números naturais.', 'A regra de sinais (+$+$=+, $-$-=+, +$-$=$-$, $-$+=$-$).'], examples: [{ question: '$(-4) \\times (-3)$', answer: '$+12$.' }], conclusion: 'Sinais iguais = Positivo. Sinais diferentes = Negativo.' } },
    { id: 'l2-15', type: 'lesson', title: 'Aula 15 - Multiplicando Três ou Mais Fatores', skill: 'EF07MA04', complexity: 'Alta', content: { intro: 'Cadeia de multiplicações.', development: ['Aplicar a regra passo a passo, dois a dois.', 'Dica do número de fatores negativos (par = +, ímpar = -).'], examples: [{ question: '$(-1) \\times (-2) \\times (-3)$', answer: '$-6$ (3 negativos = negativo).' }], conclusion: 'Conte os sinais de menos.' } },
    { id: 'l2-16', type: 'lesson', title: 'Aula 16 - Divisão Exata de Inteiros', skill: 'EF07MA04', complexity: 'Média', content: { intro: 'Repartindo o valor.', development: ['A regra de sinais é exatamente a mesma da multiplicação.', 'A divisão por zero não existe.'], examples: [{ question: '$(-20) \\div (+5)$', answer: '$-4$.' }], conclusion: 'Divide normal e obedece a tabela de sinais.' } },
    { id: 'p2-3', type: 'practical', title: 'Aula 17 - Prática: Batalha de Sinais', skill: 'EF07MA04', complexity: 'Baixa', practicalDescription: 'Jogo de cartas rápido em duplas. Uma carta de número e outra de sinal para cada jogador. Devem multiplicar as cartas; quem falar o resultado correto e o sinal primeiro, pontua.' },
    { id: 'ex2-3', type: 'exercise', title: 'Aula 18 - Bloco de Exercícios 3: Mult e Divisão', questions: [{ question: '$(-6) \\times (+3)$', answer: '$-18$' }, { question: '$(-100) \\div (-10)$', answer: '$+10$' }] },
    
    { id: 'l2-19', type: 'lesson', title: 'Aula 19 - Expressões Numéricas em Z', skill: 'EF07MA04', complexity: 'Alta', content: { intro: 'Quem resolve primeiro?', development: ['Prioridades: 1º Mult/Div, 2º Soma/Sub.', 'Parênteses, Colchetes e Chaves.'], examples: [{ question: '$-2 + 3 \\times (-4)$', answer: '$-2 + (-12) = -14$.' }], conclusion: 'Ordem de trânsito estrita.' } },
    { id: 'l2-20', type: 'lesson', title: 'Aula 20 - Resolução de Problemas Complexos', skill: 'EF07MA04', complexity: 'Alta', content: { intro: 'Interpretação e tradução.', development: ['Problemas envolvendo saldo médio, variações amplas de temperatura, elevadores.'], examples: [{ question: 'Temperatura era $-5$ graus. Subiu $12$, depois caiu $4$. Quanto ficou?', answer: '$-5+12-4 = 3$ graus.' }], conclusion: 'Leia devagar e traduza para a linguagem matemática.' } },
    { id: 'p2-4', type: 'practical', title: 'Aula 21 - Prática: A Termômetro', skill: 'EF07MA04', complexity: 'Média', practicalDescription: 'Construir um termômetro de papelão com uma fita deslizante. Sortear cartões com "Caiu X graus" ou "Subiu Y graus" para o aluno movimentar a fita e achar a temperatura final.' },
    { id: 'ex2-4', type: 'exercise', title: 'Aula 22 - Bloco de Exercícios 4: Expressões', questions: [{ question: '$-10 \\div (-2) - 5$', answer: '$5 - 5 = 0$' }, { question: '$(-2) \\times (-2) \\times (-2)$', answer: '$-8$' }] },
    
    { id: 'l2-23', type: 'lesson', title: 'Aula 23 - Revisão Geral I', skill: 'EF07MA03', complexity: 'Média', content: { intro: 'Revisando Reta e Módulo.', development: ['Opostos e Distâncias.'], examples: [], conclusion: 'Dúvidas sanadas.' } },
    { id: 'l2-24', type: 'lesson', title: 'Aula 24 - Revisão Geral II', skill: 'EF07MA04', complexity: 'Alta', content: { intro: 'Revisando Operações.', development: ['As 4 operações e Expressões Numéricas.'], examples: [], conclusion: 'Prontos para avaliação.' } },

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
