import { Unit } from './types.ts';

export const unit1: Unit = {
  id: 'u1',
  title: 'Unidade I: Números e Operações',
  dateRange: '10 Fev - 15 Abr',
  description: 'Sistemas de Numeração, Operações Naturais, Potências e Divisibilidade.',
  color: 'bg-blue-100 border-blue-300 text-blue-800',
  bnccSkills: [
    'EF06MA01: Ler, escrever e ordenar números naturais.',
    'EF06MA02: Reconhecer o sistema de numeração decimal.',
    'EF06MA03: Resolver problemas com adição, subtração, multiplicação e divisão.',
    'EF06MA04: Construir algoritmos e fluxogramas.',
    'EF06MA05/06: Divisibilidade, Múltiplos e Divisores (MMC/MDC).'
  ],
  items: [
    {
      id: 'l1-1', type: 'lesson', title: 'Aula 01 - História dos Números e Sistemas Antigos', skill: 'EF06MA02A', complexity: 'Baixa',
      content: {
        intro: 'Antes dos números atuais, usamos pedras e riscos. Como contamos hoje?',
        development: ['Necessidade de contar: rebanhos, colheitas.', 'Sistema Egípcio (Símbolos fixos)', 'Sistema Romano (Letras: I, V, X, L, C, D, M)'],
        examples: [{ question: 'Escreva 15 em romano.', answer: 'XV' }, { question: 'O que falta no sistema romano?', answer: 'O Zero.' }],
        conclusion: 'A evolução numérica facilitou os cálculos.'
      }
    },
    {
      id: 'l1-2', type: 'lesson', title: 'Aula 02 - O Sistema Decimal Posicional', skill: 'EF06MA02A', complexity: 'Média',
      content: {
        intro: '10 símbolos para tudo. A mágica é a posição.',
        development: ['Algarismos Indo-Arábicos: $0$ a $9$.', 'Valor Posicional: $2$ em "$20$" vs $2$ em "$200$".', 'Classes e Ordens: Unidades, Milhares, Milhões.'],
        examples: [{ question: 'Valor do $5$ em $5.430$?', answer: '$5.000$ (Unidade de Milhar)' }, { question: 'Escreva: Doze mil e cinco.', answer: '$12.005$' }],
        conclusion: 'Cada posição à esquerda vale $10$ vezes mais.'
      }
    },
    {
      id: 'l1-3', type: 'lesson', title: 'Aula 03 - Composição e Decomposição Numérica', skill: 'EF06MA02B', complexity: 'Média',
      content: {
        intro: 'Desmontando números como Lego.',
        development: ['Decomposição Aditiva: $123 = 100 + 20 + 3$.', 'Decomposição Polinomial: $1\\times100 + 2\\times10 + 3\\times1$.', 'Uso no cálculo mental.'],
        examples: [{ question: 'Decomponha $4.090$.', answer: '$4.000 + 90$' }, { question: 'Qual o número: $7\\times1000 + 8$?', answer: '$7.008$' }],
        conclusion: 'Entender a estrutura ajuda a operar.'
      }
    },
    { id: 'p1-1', type: 'practical', title: 'Aula 04 - Prática: O Jogo das Classes', skill: 'EF06MA02B', complexity: 'Baixa', practicalDescription: 'Dinâmica com cartões coloridos representando Unidade, Dezena, Centena e Milhar. Os alunos devem formar números ditados pelo professor correndo até o quadro e colando os cartões na ordem correta.' },
    
    {
      id: 'l1-5', type: 'lesson', title: 'Aula 05 - Adição de Naturais e Propriedades', skill: 'EF06MA03', complexity: 'Baixa',
      content: {
        intro: 'Juntar e Acabar. A organização é fundamental.',
        development: ['Alinhamento: Unidade com Unidade.', 'Reserva (sobe 1) na adição.', 'Propriedades: Comutativa, Associativa e Elemento Neutro.'],
        examples: [{ question: '$1.459 + 2.382$', answer: '$3.841$' }],
        conclusion: 'Ordem e alinhamento evitam erros.'
      }
    },
    {
      id: 'l1-6', type: 'lesson', title: 'Aula 06 - Subtração de Naturais', skill: 'EF06MA03', complexity: 'Média',
      content: {
        intro: 'Tirar, completar ou comparar.',
        development: ['Ideias da subtração.', 'Recurso (pede emprestado) na subtração.', 'Relação fundamental da subtração.'],
        examples: [{ question: '$5.000 - 1.248$', answer: '$3.752$' }],
        conclusion: 'Subtração é a operação inversa da adição.'
      }
    },
    {
      id: 'l1-7', type: 'lesson', title: 'Aula 07 - Resolução de Problemas com Adição e Subtração', skill: 'EF06MA03', complexity: 'Alta',
      content: {
        intro: 'Interpretando textos matemáticos.',
        development: ['Palavras-chave: diferença, total, a mais, a menos.', 'Estratégias de resolução.', 'Verificação (prova real).'],
        examples: [{ question: 'João tinha R$ 500, gastou R$ 120 e ganhou R$ 50. Quanto ficou?', answer: '$500 - 120 + 50 = 430$' }],
        conclusion: 'Sempre releia a pergunta do problema.'
      }
    },
    { id: 'ex1-1', type: 'exercise', title: 'Aula 08 - Bloco de Exercícios 1: Soma e Subtração', questions: [{ question: 'Resolva: $345 + 892 - 150$', answer: '$1.087$' }, { question: 'Decomponha e some: $45 + 32$', answer: '$(40+5) + (30+2) = 77$' }] },

    {
      id: 'l1-9', type: 'lesson', title: 'Aula 09 - Multiplicação de Naturais e Algoritmos', skill: 'EF06MA03', complexity: 'Média',
      content: {
        intro: 'Soma de parcelas iguais e disposição retangular.',
        development: ['Termos: Fatores e Produto.', 'Algoritmo com 1 algarismo e 2 algarismos.', 'Propriedade distributiva (o chuveirinho).'],
        examples: [{ question: '$123 \\times 4$', answer: '$492$' }, { question: '$25 \\times 12$', answer: '$300$' }],
        conclusion: 'A tabuada na ponta da língua agiliza tudo.'
      }
    },
    {
      id: 'l1-10', type: 'lesson', title: 'Aula 10 - Divisão de Naturais: Ideias e Algoritmos', skill: 'EF06MA03', complexity: 'Alta',
      content: {
        intro: 'Repartir igualmente ou medir quantas vezes cabe.',
        development: ['Termos: Dividendo, Divisor, Quociente, Resto.', 'Relação Fundamental: $D = d \\times q + r$.', 'O passo a passo da chave.'],
        examples: [{ question: '$125 \\div 5$', answer: '$25$' }, { question: '$31 \\div 3$', answer: '$10$ e sobra $1$' }],
        conclusion: 'O resto deve ser sempre menor que o divisor.'
      }
    },
    {
      id: 'l1-11', type: 'lesson', title: 'Aula 11 - Expressões Numéricas Simples', skill: 'EF06MA03', complexity: 'Alta',
      content: {
        intro: 'Quem resolve primeiro? A regra de trânsito da matemática.',
        development: ['Ordem das operações: Multiplicação/Divisão antes de Adição/Subtração.', 'Uso de parênteses $()$.'],
        examples: [{ question: '$5 + 3 \\times 2$', answer: 'Primeiro a multiplicação: $5 + 6 = 11$' }],
        conclusion: 'Siga a ordem estritamente para não bater o carro.'
      }
    },
    { id: 'ex1-2', type: 'exercise', title: 'Aula 12 - Bloco de Exercícios 2: Multiplicação e Divisão', questions: [{ question: 'Calcule $1.200 \\div 15$', answer: '$80$' }, { question: 'Resolva a expressão: $(10 + 2) \\times 3 - 5$', answer: '$12 \\times 3 - 5 = 36 - 5 = 31$' }] },

    {
      id: 'l1-13', type: 'lesson', title: 'Aula 13 - Lógica e Algoritmos do Dia a Dia', skill: 'EF06MA04', complexity: 'Média',
      content: {
        intro: 'Pensando como um computador. Passo a passo.',
        development: ['O que é algoritmo: Receita de bolo.', 'Sequência lógica finita.', 'Aplicação no dia a dia (trocar pneu, fazer café).'],
        examples: [{ question: 'Passos para somar $15+15$.', answer: 'Armar, somar unidades (sobe 1), somar dezenas.' }],
        conclusion: 'Todo problema complexo é feito de passos simples.'
      }
    },
    {
      id: 'l1-14', type: 'lesson', title: 'Aula 14 - Introdução aos Fluxogramas', skill: 'EF06MA34', complexity: 'Média',
      content: {
        intro: 'Desenhando as decisões.',
        development: ['Símbolos: Início (Oval), Ação (Retângulo), Decisão (Losango).', 'Setas indicam o caminho.', 'Loop (repetição).'],
        examples: [{ question: 'Fluxograma Par ou Ímpar.', answer: 'Entra Num -> Divide por 2 -> Resto 0? -> Sim(Par)/Não(Ímpar).' }],
        conclusion: 'Uma imagem vale por mil instruções.'
      }
    },
    {
      id: 'l1-15', type: 'lesson', title: 'Aula 15 - Potenciação: Base, Expoente e Cálculo', skill: 'EF06MA11', complexity: 'Média',
      content: {
        intro: 'Multiplicação de fatores iguais. Um atalho poderoso.',
        development: ['Base e Expoente.', '$3^2 = 3 \\times 3 = 9$ (Não é 6!).', 'Casos especiais: expoente 0 e expoente 1.'],
        examples: [{ question: 'Calcule $2^5$', answer: '$2\\times2\\times2\\times2\\times2 = 32$' }, { question: '$5^0$', answer: '$1$' }],
        conclusion: 'Potência faz o número crescer muito rápido.'
      }
    },
    {
      id: 'l1-16', type: 'lesson', title: 'Aula 16 - Potências de 10 e Estimativas', skill: 'EF06MA12', complexity: 'Média',
      content: {
        intro: 'O poder dos zeros e do arredondamento.',
        development: ['$10^3 = 1000$ (3 zeros).', 'Decomposição polinomial usando potências de 10.', 'Estimativa: Arredondar para operar mentalmente rápido.'],
        examples: [{ question: '$10^6$ é quanto?', answer: '$1.000.000$ (Um milhão).' }, { question: 'Estime $198 \\times 5$.', answer: '$200 \\times 5 = 1000$.' }],
        conclusion: 'Trabalhar com potências de 10 facilita a vida.'
      }
    },
    
    { id: 'p1-2', type: 'practical', title: 'Aula 17 - Prática: Supermercado das Estimativas', skill: 'EF06MA12', complexity: 'Baixa', practicalDescription: 'Trazer panfletos de mercado. Alunos têm um "orçamento" fictício e devem estimar se o dinheiro dá para comprar uma lista de itens arredondando os preços mentalmente.' },
    {
      id: 'l1-18', type: 'lesson', title: 'Aula 18 - Múltiplos de um Número Natural', skill: 'EF06MA05', complexity: 'Baixa',
      content: {
        intro: 'A tabuada infinita.',
        development: ['Definição: Resultado da multiplicação por naturais.', '$M(3) = \\{0, 3, 6, 9\\ldots\\}$.', 'Múltiplo comum.'],
        examples: [{ question: '5 primeiros múltiplos de $4$.', answer: '$0, 4, 8, 12, 16$.' }, { question: '$30$ é múltiplo de $6$?', answer: 'Sim ($6\\times5$).' }],
        conclusion: 'O zero é múltiplo de todos. O conjunto é infinito.'
      }
    },
    {
      id: 'l1-19', type: 'lesson', title: 'Aula 19 - Divisores de um Número Natural', skill: 'EF06MA05', complexity: 'Baixa',
      content: {
        intro: 'Quem divide exato.',
        development: ['Definição: Divisão com resto zero.', '$D(12) = \\{1, 2, 3, 4, 6, 12\\}$.', 'O 1 é divisor universal.'],
        examples: [{ question: 'Divisores de $15$.', answer: '$1, 3, 5, 15$.' }, { question: '$7$ é divisor de $20$?', answer: 'Não (sobra resto).' }],
        conclusion: 'Divisores formam um conjunto finito.'
      }
    },
    { id: 'ex1-3', type: 'exercise', title: 'Aula 20 - Bloco de Exercícios 3: Múltiplos e Divisores', questions: [{ question: 'Liste os divisores de $24$.', answer: '$1, 2, 3, 4, 6, 8, 12, 24$' }, { question: 'O número $45$ é múltiplo de $9$?', answer: 'Sim, pois $9 \\times 5 = 45$.' }] },

    {
      id: 'l1-21', type: 'lesson', title: 'Aula 21 - Critérios de Divisibilidade (2, 3, 5 e 10)', skill: 'EF06MA05', complexity: 'Média',
      content: {
        intro: 'Atalhos para não fazer a conta toda.',
        development: ['Por 2: Par.', 'Por 5: Final 0 ou 5.', 'Por 10: Final 0.', 'Por 3: Soma dos algarismos ser múltiplo de 3.'],
        examples: [{ question: '$111$ divide por $3$?', answer: 'Sim ($1+1+1=3$).' }, { question: '$235$ divide por $2$?', answer: 'Não (é ímpar).' }],
        conclusion: 'Critérios economizam tempo na divisão.'
      }
    },
    {
      id: 'l1-22', type: 'lesson', title: 'Aula 22 - Critérios de Divisibilidade (4, 6, 8 e 9)', skill: 'EF06MA05', complexity: 'Alta',
      content: {
        intro: 'Regras mais avançadas.',
        development: ['Por 6: Por 2 e 3 ao mesmo tempo.', 'Por 9: Soma múltiplos de 9.', 'Por 4: Últimos 2 dígitos.', 'Por 8: Últimos 3 dígitos.'],
        examples: [{ question: '$36$ divide por $6$?', answer: 'Sim (Par e soma 9, logo divide por 2 e 3).' }, { question: '$729$ divide por $9$?', answer: 'Sim (soma 18).' }],
        conclusion: 'Combinar regras ajuda a deduzir divisibilidade.'
      }
    },
    {
      id: 'l1-23', type: 'lesson', title: 'Aula 23 - Números Primos e Compostos', skill: 'EF06MA05', complexity: 'Média',
      content: {
        intro: 'Os átomos da matemática.',
        development: ['Definição: Apenas 2 divisores (1 e ele mesmo).', 'Identificação dos primeiros primos: $2, 3, 5, 7, 11, 13, 17\\ldots$', 'Crivo de Eratóstenes para achar primos.'],
        examples: [{ question: 'O único primo par?', answer: '$2$.' }, { question: '$1$ é primo?', answer: 'Não (só 1 divisor).' }],
        conclusion: 'Primos constroem todos os outros números naturais.'
      }
    },
    {
      id: 'l1-24', type: 'lesson', title: 'Aula 24 - Fatoração (Decomposição em Fatores Primos)', skill: 'EF06MA05', complexity: 'Alta',
      content: {
        intro: 'O DNA do número.',
        development: ['Todo número composto pode ser escrito como produto de primos.', 'Dispositivo prático (barra vertical).', 'Dividir sucessivamente pelos primos.'],
        examples: [{ question: 'Fatore $12$.', answer: '$2 \\times 2 \\times 3 = 2^2 \\times 3$.' }, { question: 'Fatore $20$.', answer: '$2^2 \\times 5$.' }],
        conclusion: 'A fatoração será a chave para os próximos assuntos (MMC/MDC).'
      }
    },
    { 
      id: 'act1', type: 'activity', title: 'Atividade Avaliativa I: Numeração e Operações', skill: 'Geral', 
      questions: [
        { question: 'Escreva o antecessor e o sucessor de $1999$.', answer: '$1998$ e $2000$.', spaceForWork: true },
        { question: 'Decomponha o número $3450$ na forma polinomial.', answer: '$3\\times1000 + 4\\times100 + 5\\times10$.', spaceForWork: true },
        { question: 'Resolva a expressão: $5 + 3 \\times 2$.', answer: '$5 + 6 = 11$.', spaceForWork: true },
        { question: 'Arme e efetue: $1245 - 896$.', answer: '$349$.', spaceForWork: true },
        { question: 'Uma caixa tem $24$ bombons. Queremos dividir em pacotes de $4$. Quantos pacotes teremos?', answer: '$6$ pacotes.', spaceForWork: true },
        { question: 'Calcule $2^4$.', answer: '$2\\times2\\times2\\times2 = 16$.', spaceForWork: true },
        { question: 'Usando critério de divisibilidade, verifique se $135$ é divisível por $5$.', answer: 'Sim, pois termina em $5$.', spaceForWork: true },
        { question: 'Escreva os $5$ primeiros múltiplos de $7$.', answer: '$0, 7, 14, 21, 28$.', spaceForWork: true },
        { question: 'Qual o valor posicional do algarismo $8$ em $28.350$?', answer: '$8.000$ (unidade de milhar).', spaceForWork: true },
        { question: 'Uma escola comprou $156$ livros e quer distribuir igualmente entre $12$ turmas. Quantos livros cada turma receberá?', answer: '$13$ livros.', spaceForWork: true }
      ] 
    },
    { 
      id: 'exam1', type: 'exam', title: 'Prova da Unidade I', skill: 'Geral', 
      questions: [
        { question: 'Transforme para numeração romana: $2026$.', answer: 'MMXXVI.', spaceForWork: false },
        { question: 'No número $5.432$, qual o valor posicional do algarismo $4$?', answer: '$400$ ($4$ centenas).', spaceForWork: false },
        { question: 'Resolva: $2^3 + 5^1$.', answer: '$8 + 5 = 13$.', spaceForWork: true },
        { question: 'Verifique se $432$ é divisível por $3$.', answer: 'Sim, pois $4+3+2=9$ (divisível por $3$).', spaceForWork: true },
        { question: 'O que é um número primo? Dê um exemplo.', answer: 'Número com apenas dois divisores ($1$ e ele mesmo). Ex: $5$.', spaceForWork: true },
        { question: 'Calcule o MDC de $12$ e $18$.', answer: '$6$.', spaceForWork: true },
        { question: 'Em uma árvore de natal, uma luz pisca a cada $4$s e outra a cada $6$s. Se piscarem juntas agora, daqui a quanto tempo piscarão juntas novamente?', answer: '$12$ segundos (MMC de $4$ e $6$).', spaceForWork: true },
        { question: 'Arme e efetue: $234 \\times 15$.', answer: '$3510$.', spaceForWork: true },
        { question: 'Qual o resto da divisão de $25$ por $4$?', answer: '$1$.', spaceForWork: false },
        { question: 'Escreva 1 milhão em potência de $10$.', answer: '$10^6$.', spaceForWork: false }
      ] 
    }
  ]
};
