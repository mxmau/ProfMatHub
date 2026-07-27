import { Unit } from './types.ts';

export const unit3: Unit = {
  id: 'u3-7',
  title: 'Unidade III: Álgebra Básica e Equações',
  dateRange: '08 Jul - 29 Set',
  description: 'Introdução formal à álgebra, expressões, equações do 1º grau e razão/proporção.',
  color: 'bg-yellow-100 border-yellow-300 text-yellow-800',
  bnccSkills: [
    'EF07MA13: Expressões algébricas.',
    'EF07MA18: Equações de 1º grau.',
    'EF07MA14/17: Razão, Proporção e Regra de 3.'
  ],
  items: [
    { id: 'l3-1', type: 'lesson', title: 'Aula 01 - Letras na Matemática', skill: 'EF07MA13', complexity: 'Baixa', content: { intro: 'Quando não sabemos o número, chamamos pelo nome (ou letra).', development: ['Variáveis x Incógnitas.', 'A letra guarda o lugar do número.', 'Expressões Algébricas (ex: o dobro de um número = $2x$).'], examples: [{ question: 'A metade de um número.', answer: '$x/2$.' }], conclusion: 'Álgebra é generalizar a aritmética.' } },
    { id: 'l3-2', type: 'lesson', title: 'Aula 02 - Tradução Algébrica', skill: 'EF07MA13', complexity: 'Média', content: { intro: 'Do português para o matematiquês.', development: ['O triplo, a terça parte, o sucessor ($x+1$), o antecessor ($x-1$).'], examples: [{ question: 'A soma de um número com seu dobro.', answer: '$x + 2x$.' }], conclusion: 'Tradução passo a passo.' } },
    { id: 'l3-3', type: 'lesson', title: 'Aula 03 - Valor Numérico de Expressões', skill: 'EF07MA13', complexity: 'Média', content: { intro: 'Substituindo a letra.', development: ['Trocar a variável por um número e calcular.', 'Cuidado com os sinais negativos na substituição.'], examples: [{ question: 'Calcule $2x + 5$ se $x = 3$.', answer: '$2(3) + 5 = 11$.' }], conclusion: 'Álgebra vira aritmética quando sabemos o valor da letra.' } },
    { id: 'ex3-1', type: 'exercise', title: 'Aula 04 - Bloco de Exercícios 1: Expressões', questions: [{ question: 'Calcule $3x - 1$ para $x=2$.', answer: '$5$.' }, { question: 'Traduza: O dobro de um número mais 5.', answer: '$2x + 5$.' }] },
    
    { id: 'l3-5', type: 'lesson', title: 'Aula 05 - Equação do 1º Grau: A Balança', skill: 'EF07MA18', complexity: 'Baixa', content: { intro: 'A balança da verdade.', development: ['Equação tem sinal de $=$ e incógnita.', '1º membro (esquerda) e 2º membro (direita).', 'Raiz da equação (o valor que torna verdade).'], examples: [{ question: '$x + 4 = 10$. Qual a raiz?', answer: '$6$.' }], conclusion: 'Resolver equação é equilibrar os lados.' } },
    { id: 'l3-6', type: 'lesson', title: 'Aula 06 - Operações Inversas na Equação', skill: 'EF07MA18', complexity: 'Média', content: { intro: 'Isolando o X (parte 1).', development: ['Passar para o outro lado somando ou subtraindo.', 'Manter a igualdade verdadeira.'], examples: [{ question: '$x - 5 = 15$', answer: '$x = 15 + 5 = 20$.' }], conclusion: 'Oposto da adição é subtração.' } },
    { id: 'l3-7', type: 'lesson', title: 'Aula 07 - Multiplicar e Dividir na Equação', skill: 'EF07MA18', complexity: 'Média', content: { intro: 'Isolando o X (parte 2).', development: ['Passar multiplicando ou dividindo.', 'O "número grudado" na letra está multiplicando.'], examples: [{ question: '$3x = 12$', answer: '$x = 12 \\div 3 = 4$.' }], conclusion: 'Oposto da multiplicação é a divisão.' } },
    { id: 'p3-1', type: 'practical', title: 'Aula 08 - Prática: O Jogo do Detetive', skill: 'EF07MA18', complexity: 'Alta', practicalDescription: 'Alunos recebem "cartas enigma". Devem montar a equação no quadro e resolver passo a passo usando as regras de inversão.' },
    { id: 'l3-9', type: 'lesson', title: 'Aula 09 - Resolução Completa de Equações', skill: 'EF07MA18', complexity: 'Alta', content: { intro: 'Juntando os passos.', development: ['Letras para um lado, números para o outro.', 'Simplificar e depois isolar o X final.'], examples: [{ question: '$2x + 5 = x + 9$', answer: '$x = 4$.' }], conclusion: 'Organize a casa antes de resolver.' } },
    { id: 'ex3-2', type: 'exercise', title: 'Aula 10 - Bloco de Exercícios 2: Equações Simples', questions: [{ question: '$4x = 20$', answer: '$x=5$' }, { question: '$x + 7 = 10$', answer: '$x=3$' }] },
    
    { id: 'l3-11', type: 'lesson', title: 'Aula 11 - Equações com Parênteses', skill: 'EF07MA18', complexity: 'Alta', content: { intro: 'Distribuindo antes de resolver.', development: ['O chuveirinho (propriedade distributiva).', 'Atenção redobrada aos sinais.'], examples: [{ question: '$2(x + 3) = 14$', answer: '$2x + 6 = 14 \\Rightarrow 2x = 8 \\Rightarrow x = 4$.' }], conclusion: 'Destrua os parênteses primeiro.' } },
    { id: 'l3-12', type: 'lesson', title: 'Aula 12 - Equações com Frações', skill: 'EF07MA18', complexity: 'Alta', content: { intro: 'O MMC salva o dia.', development: ['Equações com denominadores.', 'Tirar o MMC de toda a equação para sumir com as frações.'], examples: [{ question: '$x/2 + 3 = 5$', answer: '$x/2 = 2 \\Rightarrow x = 4$.' }], conclusion: 'Tire o MMC e livre-se dos denominadores.' } },
    { id: 'l3-13', type: 'lesson', title: 'Aula 13 - Problemas com Equações I', skill: 'EF07MA18', complexity: 'Alta', content: { intro: 'Lendo o problema.', development: ['Transformar o texto em equação.', 'Problemas envolvendo idades e dinheiro.'], examples: [{ question: 'A soma de dois números consecutivos é 15. Quais são?', answer: '$x + (x+1) = 15 \\Rightarrow 2x = 14 \\Rightarrow x=7$. Logo 7 e 8.' }], conclusion: 'Defina quem é o X logo no começo.' } },
    { id: 'l3-14', type: 'lesson', title: 'Aula 14 - Problemas com Equações II', skill: 'EF07MA18', complexity: 'Alta', content: { intro: 'Avançando nos desafios.', development: ['Problemas envolvendo geometria (perímetro) modelados por equações.'], examples: [{ question: 'Retângulo de base $x+2$ e altura $x$. Perímetro = 20.', answer: '$2(x+2) + 2x = 20 \\Rightarrow 4x + 4 = 20 \\Rightarrow x = 4$.' }], conclusion: 'A equação modela a vida.' } },
    { id: 'p3-2', type: 'practical', title: 'Aula 15 - Prática: Feira de Equações', skill: 'EF07MA18', complexity: 'Média', practicalDescription: 'Duplas criam problemas do tipo "Pensei num número" e trocam com outra dupla para que tentem resolver usando equações.' },
    { id: 'ex3-3', type: 'exercise', title: 'Aula 16 - Bloco de Exercícios 3: Equações Complexas', questions: [{ question: '$3(x-1) = 12$', answer: '$x=5$' }, { question: 'O dobro de $X$ mais 4 é 24.', answer: '$X=10$' }] },
    
    { id: 'l3-17', type: 'lesson', title: 'Aula 17 - Razão', skill: 'EF07MA17', complexity: 'Baixa', content: { intro: 'Comparando quantidades.', development: ['Razão é uma divisão/fração entre duas grandezas.', 'Ordem importa.', 'Escalas e velocidades médias como razões especiais.'], examples: [{ question: 'Razão entre 10 meninas e 15 meninos.', answer: '$10/15 = 2/3$.' }], conclusion: 'Razão é uma fração que compara coisas.' } },
    { id: 'l3-18', type: 'lesson', title: 'Aula 18 - Proporção', skill: 'EF07MA17', complexity: 'Média', content: { intro: 'Igualando razões.', development: ['Proporção é a igualdade de duas razões.', 'Produto dos meios = Produto dos extremos (Multiplicação Cruzada).'], examples: [{ question: 'Se $1/2 = x/4$, qual o X?', answer: '$2$.' }], conclusion: 'Multiplique cruzado para verificar.' } },
    { id: 'l3-19', type: 'lesson', title: 'Aula 19 - Grandezas Diretamente Proporcionais', skill: 'EF07MA17', complexity: 'Média', content: { intro: 'Se um sobe, o outro sobe.', development: ['Exemplos: Quantidade comprada e preço pago.', 'A razão constante.'], examples: [{ question: '1 pão é 1 real. 5 pães?', answer: '5 reais.' }], conclusion: 'Crescem na mesma velocidade.' } },
    { id: 'l3-20', type: 'lesson', title: 'Aula 20 - Grandezas Inversamente Proporcionais', skill: 'EF07MA17', complexity: 'Média', content: { intro: 'Se um sobe, o outro desce.', development: ['Exemplos: Velocidade e Tempo. Operários e Tempo de obra.', 'A multiplicação constante.'], examples: [{ question: '2 pintores fazem em 4 dias. 4 pintores?', answer: '2 dias (dobrou gente, caiu metade tempo).' }], conclusion: 'Mais rápido = Menos tempo.' } },
    
    { id: 'l3-21', type: 'lesson', title: 'Aula 21 - Regra de Três Simples', skill: 'EF07MA17', complexity: 'Alta', content: { intro: 'O canivete suíço da matemática.', development: ['Montar a tabela de grandezas.', 'Identificar se é Direta ou Inversa.', 'Resolver a equação.'], examples: [{ question: '100km em 2h. Quantos km em 5h?', answer: '$x = 250km$.' }], conclusion: 'A regra de três resolve (quase) tudo no dia a dia.' } },
    { id: 'p3-3', type: 'practical', title: 'Aula 22 - Prática: Supermercado e Proporção', skill: 'EF07MA17', complexity: 'Alta', practicalDescription: 'Analisar rótulos de produtos para descobrir se a embalagem maior é proporcionalmente mais barata usando regra de 3.' },
    { id: 'l3-23', type: 'lesson', title: 'Aula 23 - Revisão: Equações', skill: 'EF07MA18', complexity: 'Média', content: { intro: 'Revendo o X.', development: ['Isolamento e Equações com frações.'], examples: [], conclusion: 'Prontos para testes.' } },
    { id: 'l3-24', type: 'lesson', title: 'Aula 24 - Revisão: Razão e Proporção', skill: 'EF07MA17', complexity: 'Média', content: { intro: 'Revendo a regra de 3.', development: ['Direta vs Inversa.'], examples: [], conclusion: 'Fim da Unidade 3.' } },

    { 
      id: 'act3-1', type: 'activity', title: 'Avaliação Unidade III', skill: 'Geral', 
      questions: [
        { question: 'Traduza: O triplo de um número diminuído de $4$.', answer: '$3x - 4$.', spaceForWork: false },
        { question: 'Calcule $x$: $2x + 10 = 30$.', answer: '$x = 10$.', spaceForWork: true },
        { question: 'Um carro faz $10km$ com $1L$. Quantos litros precisa para $50km$?', answer: '$5L$.', spaceForWork: true },
        { question: 'Qual o valor numérico de $3x - 2$ quando $x = 5$?', answer: '$13$.', spaceForWork: true },
        { question: 'Resolva: $x/4 = 8$.', answer: '$x = 32$.', spaceForWork: true },
        { question: 'Traduza para expressão: "A metade de um número somada com $7$".', answer: '$x/2 + 7$.', spaceForWork: false },
        { question: 'Se $3$ camisetas custam R$ $45$, quanto custam $7$ camisetas?', answer: 'R$ $105$.', spaceForWork: true },
        { question: 'Resolva: $5x - 3 = 2x + 9$.', answer: '$3x = 12$, $x = 4$.', spaceForWork: true },
        { question: 'A razão entre meninos e meninas é $3/5$. Se há $15$ meninas, quantos meninos há?', answer: '$9$ meninos.', spaceForWork: true },
        { question: 'Verifique se $x = 3$ é raiz da equação $4x - 2 = 10$.', answer: 'Sim, pois $4(3) - 2 = 12 - 2 = 10$.', spaceForWork: true }
      ] 
    }
  ]
};

export const unit4: Unit = {
  "id": "u4-7",
  "title": "Unidade IV: Geometria, Volume, Estatística e Probabilidade",
  "dateRange": "28 Jul - 29 Set",
  "description": "No planejamento de Igarassu, este bloco corresponde à 3ª unidade: cinco aulas por semana, de 28/07 a 29/09, com Geometria, Volume, Estatística e Probabilidade. Cada AT e a prova são precedidas por revisão.",
  "color": "bg-orange-100 border-orange-300 text-orange-800",
  "bnccSkills": [
    "EF07MA23: Relações entre ângulos formados por retas paralelas e uma transversal.",
    "EF07MA24: Construção e análise de triângulos e suas propriedades.",
    "EF07MA27/28: Polígonos regulares, diagonais e ângulos internos.",
    "EF07MA36: Planejar e realizar pesquisa, interpretar tabelas, gráficos e medidas de tendência central.",
    "EF07MA37: Experimentos aleatórios, espaço amostral e cálculo de probabilidade.",
    "Acerta Brasil: Missões 2, 5, 12, 13, 14, 16, 19 e 20."
  ],
  "items": [
    {
      "id": "u3-w1-a1",
      "type": "lesson",
      "title": "Aula 01 - Abertura, diagnóstico e classificação dos ângulos",
      "skill": "EF07MA23",
      "duration": "Semana 1 | 28/07 a 03/08 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Semana 1: Ângulos: classificação, complementares, suplementares, OPV e paralelas.",
        "development": [
          "Ângulo é a abertura formada por duas semirretas de mesma origem. Agudo mede menos de 90°; reto mede 90°; obtuso fica entre 90° e 180°; raso mede 180°."
        ],
        "examples": [],
        "conclusion": "Prepara AT1 e prova: leitura de figuras, ângulo faltante, complemento/suplemento e retas paralelas.",
        "classwork": "Diagnóstico com 5 figuras. Livro: Missão 2, p. 17-18, leitura e uma atividade escolhida. Quadro: classificar 35°, 90°, 125° e 180°.",
        "homework": "Como houve livro, apenas concluir 1 item iniciado em sala e desenhar um exemplo de cada tipo de ângulo.",
        "alignment": "AT1: reconhecimento visual do ângulo. Prova: leitura correta da medida."
      }
    },
    {
      "id": "u3-w1-a2",
      "type": "lesson",
      "title": "Aula 02 - Ângulos complementares e suplementares",
      "skill": "EF07MA23",
      "duration": "Semana 1 | 28/07 a 03/08 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Semana 1: Ângulos: classificação, complementares, suplementares, OPV e paralelas.",
        "development": [
          "Dois ângulos são complementares quando somam 90° e suplementares quando somam 180°. Para encontrar o ângulo faltante, subtraímos a medida conhecida do total."
        ],
        "examples": [],
        "conclusion": "Prepara AT1 e prova: leitura de figuras, ângulo faltante, complemento/suplemento e retas paralelas.",
        "classwork": "Quadro: complemento de 25° e 68°; suplemento de 110° e 47°; resolver x + 72° = 180°. Correção com justificativa.",
        "homework": "Quadro: 1) comp.(34°); 2) sup.(126°); 3) se x + 58° = 90°, determine x.",
        "alignment": "Prova: mesmo raciocínio das questões de complemento e suplemento."
      }
    },
    {
      "id": "u3-w1-a3",
      "type": "lesson",
      "title": "Aula 03 - Ângulos opostos pelo vértice e adjacentes",
      "skill": "EF07MA23",
      "duration": "Semana 1 | 28/07 a 03/08 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Semana 1: Ângulos: classificação, complementares, suplementares, OPV e paralelas.",
        "development": [
          "Quando duas retas se cruzam, os ângulos opostos pelo vértice têm a mesma medida. Ângulos adjacentes que formam uma reta somam 180°."
        ],
        "examples": [],
        "conclusion": "Prepara AT1 e prova: leitura de figuras, ângulo faltante, complemento/suplemento e retas paralelas.",
        "classwork": "Desenhar duas retas concorrentes. Resolver três figuras com um ângulo dado e os demais indicados por letras; exigir a propriedade usada.",
        "homework": "Quadro: se um OPV mede 42°, determine o oposto e os dois adjacentes. Repetir para 135°.",
        "alignment": "AT1: painéis com letras. Prova: identificação de ângulos desconhecidos."
      }
    },
    {
      "id": "u3-w1-a4",
      "type": "lesson",
      "title": "Aula 04 - Retas paralelas cortadas por uma transversal",
      "skill": "EF07MA23",
      "duration": "Semana 1 | 28/07 a 03/08 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Semana 1: Ângulos: classificação, complementares, suplementares, OPV e paralelas.",
        "development": [
          "Em duas paralelas cortadas por uma transversal, ângulos correspondentes e alternos têm a mesma medida; colaterais internos somam 180°. Primeiro identifique a posição, depois calcule."
        ],
        "examples": [],
        "conclusion": "Prepara AT1 e prova: leitura de figuras, ângulo faltante, complemento/suplemento e retas paralelas.",
        "classwork": "Quadro com duas figuras no formato da prova: uma com 150° e outra com 120°. Pedir os ângulos correspondentes, alternos e suplementares.",
        "homework": "Quadro: em r // s, um ângulo mede 65°. Calcule o correspondente, o alterno interno e o colateral interno.",
        "alignment": "Prova: retas paralelas e transversal. AT1: cálculo em figura."
      }
    },
    {
      "id": "u3-w1-a5",
      "type": "lesson",
      "title": "Aula 05 - Consolidação de ângulos",
      "skill": "EF07MA23",
      "duration": "Semana 1 | 28/07 a 03/08 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Semana 1: Ângulos: classificação, complementares, suplementares, OPV e paralelas.",
        "development": [
          "A estratégia geral é: observar a figura, reconhecer a relação entre os ângulos, escolher 90°, 180° ou igualdade e registrar o cálculo."
        ],
        "examples": [],
        "conclusion": "Prepara AT1 e prova: leitura de figuras, ângulo faltante, complemento/suplemento e retas paralelas.",
        "classwork": "Miniatividade de 6 itens: classificar 2 ângulos, calcular 2 complementares/suplementares e resolver 2 figuras com OPV/paralelas. Corrigir por etapas.",
        "homework": "Refazer somente os itens errados, escrevendo ao lado qual propriedade deveria ter sido usada.",
        "alignment": "Treino direto do formato visual da AT1 e da prova, sem repetir seus valores."
      }
    },
    {
      "id": "u3-w2-a1",
      "type": "lesson",
      "title": "Aula 06 - Classificação dos triângulos",
      "skill": "EF07MA23/24",
      "duration": "Semana 2 | 04/08 a 10/08 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Semana 2: Triângulos, polígonos regulares, diagonais e soma dos ângulos internos.",
        "development": [
          "Quanto aos lados, o triângulo pode ser equilátero, isósceles ou escaleno. Quanto aos ângulos, pode ser acutângulo, retângulo ou obtusângulo."
        ],
        "examples": [],
        "conclusion": "Prepara AT1: pentágono regular, soma e medida de cada ângulo interno.",
        "classwork": "Livro: Missão 12, p. 97-99. Montar quadro de dupla classificação e justificar cada exemplo pelas medidas apresentadas.",
        "homework": "Como houve livro, escolher apenas 1 triângulo da página trabalhada e classificá-lo pelos lados e pelos ângulos.",
        "alignment": "Base conceitual para interpretar polígonos e ângulos sem depender de memorização isolada."
      }
    },
    {
      "id": "u3-w2-a2",
      "type": "lesson",
      "title": "Aula 07 - Soma dos ângulos internos do triângulo",
      "skill": "EF07MA23/24",
      "duration": "Semana 2 | 04/08 a 10/08 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Semana 2: Triângulos, polígonos regulares, diagonais e soma dos ângulos internos.",
        "development": [
          "A soma dos três ângulos internos de qualquer triângulo é 180°. Para achar o ângulo desconhecido, somamos os conhecidos e subtraímos de 180°."
        ],
        "examples": [],
        "conclusion": "Prepara AT1: pentágono regular, soma e medida de cada ângulo interno.",
        "classwork": "Livro: Missão 12, p. 100-101. Prática rápida: recortar os três ângulos de um triângulo e alinhá-los formando uma reta.",
        "homework": "Apenas 1 item do livro indicado pelo professor ou concluir o item não finalizado em sala.",
        "alignment": "AT1/prova: ângulo faltante em figura e registro do cálculo."
      }
    },
    {
      "id": "u3-w2-a3",
      "type": "lesson",
      "title": "Aula 08 - Ângulo externo e problemas com triângulos",
      "skill": "EF07MA23/24",
      "duration": "Semana 2 | 04/08 a 10/08 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Semana 2: Triângulos, polígonos regulares, diagonais e soma dos ângulos internos.",
        "development": [
          "O ângulo externo de um triângulo é igual à soma dos dois ângulos internos não adjacentes. Ele também é suplementar ao ângulo interno vizinho."
        ],
        "examples": [],
        "conclusion": "Prepara AT1: pentágono regular, soma e medida de cada ângulo interno.",
        "classwork": "Livro: Missão 12, p. 102-103. Resolver um exemplo pelos dois caminhos e comparar os resultados.",
        "homework": "Livro: somente 1 problema de ângulo externo selecionado na página trabalhada.",
        "alignment": "Treina escolha de procedimento, justificativa e cálculo com figura."
      }
    },
    {
      "id": "u3-w2-a4",
      "type": "lesson",
      "title": "Aula 09 - Polígonos regulares e diagonais",
      "skill": "EF07MA23/24",
      "duration": "Semana 2 | 04/08 a 10/08 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Semana 2: Triângulos, polígonos regulares, diagonais e soma dos ângulos internos.",
        "development": [
          "Polígono regular tem lados e ângulos de mesma medida. Uma diagonal liga dois vértices não consecutivos. De um vértice partem n - 3 diagonais."
        ],
        "examples": [],
        "conclusion": "Prepara AT1: pentágono regular, soma e medida de cada ângulo interno.",
        "classwork": "Quadro: triângulo, quadrilátero, pentágono e hexágono. Identificar quais podem ser regulares e calcular diagonais a partir de um vértice.",
        "homework": "Quadro: 1) diagonais de um vértice do octógono; 2) desenhar as diagonais de um pentágono; 3) explicar por que lado não é diagonal.",
        "alignment": "AT1: leitura do pentágono regular."
      }
    },
    {
      "id": "u3-w2-a5",
      "type": "lesson",
      "title": "Aula 10 - Soma dos ângulos internos dos polígonos",
      "skill": "EF07MA23/24",
      "duration": "Semana 2 | 04/08 a 10/08 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Semana 2: Triângulos, polígonos regulares, diagonais e soma dos ângulos internos.",
        "development": [
          "A soma dos ângulos internos de um polígono de n lados é S = (n - 2) × 180°. Se o polígono for regular, cada ângulo mede S ÷ n."
        ],
        "examples": [],
        "conclusion": "Prepara AT1: pentágono regular, soma e medida de cada ângulo interno.",
        "classwork": "Quadro: calcular soma e ângulo interno de quadrado, pentágono e hexágono regular. Fechar com um item visual no molde da AT1.",
        "homework": "Quadro: calcule a soma e cada ângulo interno de um octógono regular.",
        "alignment": "AT1, questão do pentágono: exatamente o mesmo percurso cognitivo com outros valores."
      }
    },
    {
      "id": "u3-w3-a1",
      "type": "lesson",
      "title": "Aula 11 - Quadriláteros e paralelismo",
      "skill": "EF07MA24/27",
      "duration": "Semana 3 | 11/08 a 17/08 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Semana 3: Quadriláteros, transformações, círculo e circunferência.",
        "development": [
          "Quadriláteros possuem quatro lados. Paralelogramo tem dois pares de lados paralelos; retângulo tem quatro ângulos retos; losango tem quatro lados iguais; quadrado reúne as duas propriedades."
        ],
        "examples": [],
        "conclusion": "Garante a cobertura integral da Unidade IV e reforça leitura de figuras.",
        "classwork": "Livro: Missão 13, p. 105-108. Construir um mapa de inclusão entre quadrado, retângulo, losango e paralelogramo.",
        "homework": "Como houve livro, responder somente 1 item de classificação escolhido pelo professor.",
        "alignment": "Fortalece propriedades geométricas cobradas por leitura visual."
      }
    },
    {
      "id": "u3-w3-a2",
      "type": "lesson",
      "title": "Aula 12 - Translação, reflexão e rotação",
      "skill": "EF07MA24/27",
      "duration": "Semana 3 | 11/08 a 17/08 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Semana 3: Quadriláteros, transformações, círculo e circunferência.",
        "development": [
          "Translação desliza a figura; reflexão produz uma imagem espelhada; rotação gira a figura em torno de um ponto. As três preservam forma e tamanho."
        ],
        "examples": [],
        "conclusion": "Garante a cobertura integral da Unidade IV e reforça leitura de figuras.",
        "classwork": "Livro: Missão 13, p. 109-112. Reproduzir uma figura simples na malha usando cada transformação.",
        "homework": "Concluir apenas uma transformação iniciada em sala e escrever seu nome.",
        "alignment": "EF07MA24: interpretação de posições e movimentos no plano."
      }
    },
    {
      "id": "u3-w3-a3",
      "type": "lesson",
      "title": "Aula 13 - Círculo, circunferência e seus elementos",
      "skill": "EF07MA24/27",
      "duration": "Semana 3 | 11/08 a 17/08 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Semana 3: Quadriláteros, transformações, círculo e circunferência.",
        "development": [
          "Circunferência é a linha de contorno; círculo é a região interna. Raio liga o centro à borda, diâmetro passa pelo centro e vale 2r, e corda liga dois pontos da circunferência."
        ],
        "examples": [],
        "conclusion": "Garante a cobertura integral da Unidade IV e reforça leitura de figuras.",
        "classwork": "Retomar Missão 2, p. 19-21. Desenhar uma circunferência e marcar centro, raio, diâmetro e duas cordas.",
        "homework": "Livro: 1 item selecionado. No caderno, completar: se r = 6 cm, então d = __ cm.",
        "alignment": "Cobertura de EF07MA27 e preparação para fórmulas de comprimento e área."
      }
    },
    {
      "id": "u3-w3-a4",
      "type": "lesson",
      "title": "Aula 14 - Comprimento da circunferência",
      "skill": "EF07MA24/27",
      "duration": "Semana 3 | 11/08 a 17/08 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Semana 3: Quadriláteros, transformações, círculo e circunferência.",
        "development": [
          "O comprimento da borda circular é C = 2 × π × r ou C = π × d. Para cálculos escolares, use π ≈ 3,14 quando indicado."
        ],
        "examples": [],
        "conclusion": "Garante a cobertura integral da Unidade IV e reforça leitura de figuras.",
        "classwork": "Quadro: calcular C para r = 5 cm e d = 12 cm. Comparar qual fórmula é mais direta em cada caso.",
        "homework": "Quadro: 1) r = 7 cm; 2) d = 20 cm; 3) uma roda de d = 50 cm dá uma volta: que distância percorre?",
        "alignment": "Treina seleção de fórmula, unidade linear e interpretação de situação."
      }
    },
    {
      "id": "u3-w3-a5",
      "type": "lesson",
      "title": "Aula 15 - Área do círculo",
      "skill": "EF07MA24/27",
      "duration": "Semana 3 | 11/08 a 17/08 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Semana 3: Quadriláteros, transformações, círculo e circunferência.",
        "development": [
          "A área da região interna é A = π × r². O raio deve ser elevado ao quadrado; a unidade da resposta também fica ao quadrado."
        ],
        "examples": [],
        "conclusion": "Garante a cobertura integral da Unidade IV e reforça leitura de figuras.",
        "classwork": "Quadro: áreas para r = 2 cm, 5 cm e 10 cm. Comparar comprimento (cm) com área (cm²).",
        "homework": "Quadro: 1) A de r = 4 cm; 2) A de d = 12 cm; 3) explicar por que é preciso achar o raio antes.",
        "alignment": "Cobertura completa da habilidade; previne confusão entre medida linear e área."
      }
    },
    {
      "id": "u3-w4-a1",
      "type": "lesson",
      "title": "Aula 16 - Prática: descobrindo o π",
      "skill": "EF07MA27/28",
      "duration": "Semana 4 | 18/08 a 24/08 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Semana 4: Prática do π, sólidos, planificações e início de volume.",
        "development": [
          "Ao dividir aproximadamente o comprimento de uma circunferência por seu diâmetro, obtemos um valor próximo de 3,14. Essa regularidade é representada por π."
        ],
        "examples": [],
        "conclusion": "Prepara a leitura tridimensional e os cálculos de volume da AT1.",
        "classwork": "Em grupos, medir tampa, prato ou copo com barbante e régua. Registrar diâmetro, comprimento e C ÷ d em uma tabela.",
        "homework": "Sem lista. Medir apenas um objeto circular de casa e trazer d e C aproximados.",
        "alignment": "Transforma a fórmula em relação observada e favorece compreensão conceitual."
      }
    },
    {
      "id": "u3-w4-a2",
      "type": "lesson",
      "title": "Aula 17 - Sólidos geométricos e planificações",
      "skill": "EF07MA27/28",
      "duration": "Semana 4 | 18/08 a 24/08 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Semana 4: Prática do π, sólidos, planificações e início de volume.",
        "development": [
          "Sólidos ocupam espaço. Prismas e pirâmides possuem faces planas; planificação é a abertura das faces em uma figura plana que pode ser dobrada novamente."
        ],
        "examples": [],
        "conclusion": "Prepara a leitura tridimensional e os cálculos de volume da AT1.",
        "classwork": "Livro: Missão 5, p. 41-44. Relacionar embalagens às suas planificações e justificar quais montagens são possíveis.",
        "homework": "Como houve livro, concluir somente 1 associação não terminada em sala.",
        "alignment": "Base visual para compreender comprimento, largura e altura no volume."
      }
    },
    {
      "id": "u3-w4-a3",
      "type": "lesson",
      "title": "Aula 18 - Faces, arestas e vértices",
      "skill": "EF07MA27/28",
      "duration": "Semana 4 | 18/08 a 24/08 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Semana 4: Prática do π, sólidos, planificações e início de volume.",
        "development": [
          "Faces são as superfícies; arestas são os encontros de duas faces; vértices são os encontros das arestas. No cubo: 6 faces, 12 arestas e 8 vértices."
        ],
        "examples": [],
        "conclusion": "Prepara a leitura tridimensional e os cálculos de volume da AT1.",
        "classwork": "Livro: Missão 5, p. 45-48. Contagem em cubo, prisma triangular e pirâmide de base quadrada.",
        "homework": "Livro: apenas 1 sólido indicado pelo professor; registrar F, A e V.",
        "alignment": "Apoia leitura correta de caixas e reservatórios representados em perspectiva."
      }
    },
    {
      "id": "u3-w4-a4",
      "type": "lesson",
      "title": "Aula 19 - Volume do cubo e do paralelepípedo",
      "skill": "EF07MA27/28",
      "duration": "Semana 4 | 18/08 a 24/08 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Semana 4: Prática do π, sólidos, planificações e início de volume.",
        "development": [
          "Volume mede o espaço ocupado. Para um bloco retangular, V = comprimento × largura × altura; para o cubo, V = a³. A unidade é cúbica."
        ],
        "examples": [],
        "conclusion": "Prepara a leitura tridimensional e os cálculos de volume da AT1.",
        "classwork": "Livro: Missão 16, p. 129-131. Quadro: caixa 8 cm × 5 cm × 3 cm e cubo de aresta 4 cm.",
        "homework": "Quadro: 1) 10 × 6 × 2 cm; 2) cubo de aresta 5 cm. Apresentar cm³.",
        "alignment": "AT1: cálculo direto do volume com três dimensões."
      }
    },
    {
      "id": "u3-w4-a5",
      "type": "lesson",
      "title": "Aula 20 - Problemas de volume no molde da AT1",
      "skill": "EF07MA27/28",
      "duration": "Semana 4 | 18/08 a 24/08 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Semana 4: Prática do π, sólidos, planificações e início de volume.",
        "development": [
          "Antes de multiplicar, confira se as três medidas estão na mesma unidade. Depois, escreva a unidade cúbica e interprete se o resultado representa espaço ou capacidade."
        ],
        "examples": [],
        "conclusion": "Prepara a leitura tridimensional e os cálculos de volume da AT1.",
        "classwork": "Quadro: uma caixa 40 × 30 × 20 cm; um aquário 60 × 25 × 30 cm; um cubo de 12 cm. Resolver e comparar.",
        "homework": "Quadro: uma caixa mede 50 × 20 × 15 cm. Calcular o volume e explicar o significado do resultado.",
        "alignment": "AT1, questões de caixa e reservatório: cálculo, unidade e interpretação."
      }
    },
    {
      "id": "u3-w5-a1",
      "type": "lesson",
      "title": "Aula 21 - Volume e capacidade em litros",
      "skill": "EF07MA28",
      "duration": "Semana 5 | 25/08 a 31/08 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Semana 5: Volume, capacidade, decisão entre reservatórios e AT1.",
        "development": [
          "As equivalências principais são 1 dm³ = 1 L, 1 cm³ = 1 mL e 1 m³ = 1000 L. Primeiro calcule o volume; depois escolha a conversão adequada."
        ],
        "examples": [],
        "conclusion": "Fechamento do bloco de Geometria e Volume com aplicação da AT1.",
        "classwork": "Livro: Missão 16, p. 132-134. Converter 2 dm³, 3500 cm³ e 1,5 m³ para capacidade.",
        "homework": "Como houve livro, apenas 1 conversão selecionada na página trabalhada.",
        "alignment": "AT1: converter cm³ em litros e registrar a unidade correta."
      }
    },
    {
      "id": "u3-w5-a2",
      "type": "lesson",
      "title": "Aula 22 - Caixas, aquários e reservatórios",
      "skill": "EF07MA28",
      "duration": "Semana 5 | 25/08 a 31/08 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Semana 5: Volume, capacidade, decisão entre reservatórios e AT1.",
        "development": [
          "Em problemas de capacidade, o volume interno determina quanto cabe no recipiente. Se as medidas estão em centímetros, o resultado sai em cm³ e pode ser convertido por 1000 cm³ = 1 L."
        ],
        "examples": [],
        "conclusion": "Fechamento do bloco de Geometria e Volume com aplicação da AT1.",
        "classwork": "Livro: Missão 16, p. 135-136. Resolver um problema de aquário e outro de blocos, com desenho dos dados.",
        "homework": "Concluir somente 1 problema iniciado em sala.",
        "alignment": "AT1: situação contextualizada, cálculo e conversão."
      }
    },
    {
      "id": "u3-w5-a3",
      "type": "lesson",
      "title": "Aula 23 - Tomada de decisão com capacidades",
      "skill": "EF07MA28",
      "duration": "Semana 5 | 25/08 a 31/08 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Semana 5: Volume, capacidade, decisão entre reservatórios e AT1.",
        "development": [
          "Para escolher entre recipientes, calcule a capacidade de cada um e compare com a necessidade. A justificativa deve apresentar os dois resultados, não apenas o nome do escolhido."
        ],
        "examples": [],
        "conclusion": "Fechamento do bloco de Geometria e Volume com aplicação da AT1.",
        "classwork": "Quadro: escolher recipiente para 36 L entre A = 40 × 30 × 25 cm e B = 50 × 30 × 30 cm. Exigir justificativa.",
        "homework": "Quadro: escolher para 24 L entre C = 40 × 20 × 25 cm e D = 50 × 25 × 20 cm.",
        "alignment": "AT1, questão de síntese: comparação de capacidades e decisão justificada."
      }
    },
    {
      "id": "u3-w5-a4",
      "type": "lesson",
      "title": "Aula 24 - Revisão dirigida para a AT1",
      "skill": "EF07MA28",
      "duration": "Semana 5 | 25/08 a 31/08 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Semana 5: Volume, capacidade, decisão entre reservatórios e AT1.",
        "development": [
          "Revisar por blocos: ângulo em figura; soma e ângulo interno de polígono regular; volume; conversão para litros; comparação de reservatórios."
        ],
        "examples": [],
        "conclusion": "Fechamento do bloco de Geometria e Volume com aplicação da AT1.",
        "classwork": "Lista de 6 itens inéditos no mesmo formato da AT1. Corrigir um item de cada vez e registrar o erro mais comum no quadro.",
        "homework": "Estudar o caderno e refazer 2 itens errados. Não acrescentar nova lista.",
        "alignment": "Simulação fiel das habilidades, sem repetir desenhos ou números da AT1."
      }
    },
    {
      "id": "u3-w5-a5",
      "type": "lesson",
      "title": "Aula 25 - Aplicação da AT1 e devolutiva inicial",
      "skill": "EF07MA28",
      "duration": "Semana 5 | 25/08 a 31/08 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Semana 5: Volume, capacidade, decisão entre reservatórios e AT1.",
        "development": [
          "A atividade verifica reconhecimento geométrico, aplicação de fórmulas, uso de unidades e justificativa. O cálculo deve aparecer mesmo quando a resposta final estiver correta."
        ],
        "examples": [],
        "conclusion": "Fechamento do bloco de Geometria e Volume com aplicação da AT1.",
        "classwork": "Aplicar a AT1. Se houver tempo, recolher e fazer uma devolutiva oral sobre organização do cálculo e unidades.",
        "homework": "Sem exercício novo. Solicitar apenas que o estudante anote quais conteúdos sentiu mais dificuldade.",
        "alignment": "AT1: avaliação formativa do primeiro bloco."
      }
    },
    {
      "id": "u3-at1",
      "type": "activity",
      "title": "AT1 - Terceiro Bimestre",
      "skill": "EF07MA23/24/27/28",
      "duration": "Semana 5 | 25/08 a 31/08 | aplicação após revisão",
      "complexity": "Média",
      "questions": [
        {
          "question": "A figura apresentada pelo professor mostra um ângulo ABC reto, com vértice em B. Indique a medida e classifique esse ângulo.",
          "answer": "90°; ângulo reto.",
          "spaceForWork": false
        },
        {
          "question": "Uma base tem a forma de um pentágono regular. a) Calcule a soma dos ângulos internos. b) Determine a medida de cada ângulo interno.",
          "answer": "a) (5 - 2) × 180° = 540°. b) 540° ÷ 5 = 108°.",
          "spaceForWork": true
        },
        {
          "question": "Uma caixa mede 50 cm de comprimento, 40 cm de largura e 30 cm de altura. a) Calcule o volume. b) Converta a capacidade para litros, usando 1 L = 1.000 cm³.",
          "answer": "a) 60.000 cm³. b) 60 L.",
          "spaceForWork": true
        },
        {
          "question": "Para armazenar 42 L, escolha entre A: 50 × 40 × 20 cm e B: 50 × 30 × 30 cm. Calcule as capacidades e justifique.",
          "answer": "A = 40.000 cm³ = 40 L; B = 45.000 cm³ = 45 L. Escolher B, pois comporta 42 L.",
          "spaceForWork": true
        }
      ]
    },
    {
      "id": "u3-at1-adaptada",
      "type": "activity",
      "title": "AT1 Adaptada - Terceiro Bimestre",
      "skill": "EF07MA23/24/27/28",
      "duration": "Semana 5 | 25/08 a 31/08 | aplicação após revisão",
      "complexity": "Média",
      "questions": [
        {
          "question": "Um ângulo reto mede quantos graus?",
          "answer": "90°.",
          "spaceForWork": false
        },
        {
          "question": "Um pentágono regular tem soma interna de 540°. Quanto mede cada um dos cinco ângulos iguais?",
          "answer": "540° ÷ 5 = 108°.",
          "spaceForWork": true
        },
        {
          "question": "Uma caixa mede 20 cm × 20 cm × 10 cm. Calcule o volume em cm³.",
          "answer": "20 × 20 × 10 = 4.000 cm³.",
          "spaceForWork": true
        }
      ]
    },
    {
      "id": "u3-w6-a1",
      "type": "lesson",
      "title": "Aula 26 - Leitura e organização de tabelas",
      "skill": "EF07MA36",
      "duration": "Semana 6 | 01/09 a 07/09 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Semana 6: Tabelas, gráficos e média aritmética.",
        "development": [
          "Uma tabela organiza dados em linhas e colunas. Antes de responder, identifique título, categorias, unidade e valores; depois localize exatamente o que o comando pede."
        ],
        "examples": [],
        "conclusion": "Prepara AT2: leitura de barras/linhas, diferenças e cálculo de média.",
        "classwork": "Livro: Missão 20, p. 161-162. Ler uma tabela e responder maior valor, menor valor, total e diferença.",
        "homework": "Como houve livro, apenas 1 pergunta de leitura direta indicada pelo professor.",
        "alignment": "AT2: localizar e comparar dados sem confundir categoria e valor."
      }
    },
    {
      "id": "u3-w6-a2",
      "type": "lesson",
      "title": "Aula 27 - Gráfico de barras",
      "skill": "EF07MA36",
      "duration": "Semana 6 | 01/09 a 07/09 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Semana 6: Tabelas, gráficos e média aritmética.",
        "development": [
          "No gráfico de barras, a altura ou o comprimento de cada barra representa um valor. Compare usando a escala e não apenas a aparência visual."
        ],
        "examples": [],
        "conclusion": "Prepara AT2: leitura de barras/linhas, diferenças e cálculo de média.",
        "classwork": "Livro: Missão 20, p. 163-164. Responder categoria maior, menor, diferença e total em um gráfico.",
        "homework": "Livro: concluir somente 1 item não finalizado.",
        "alignment": "AT2, questão 1: leitura de barras e cálculo da diferença."
      }
    },
    {
      "id": "u3-w6-a3",
      "type": "lesson",
      "title": "Aula 28 - Gráficos de linhas e setores",
      "skill": "EF07MA36",
      "duration": "Semana 6 | 01/09 a 07/09 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Semana 6: Tabelas, gráficos e média aritmética.",
        "development": [
          "Gráfico de linhas destaca mudanças ao longo do tempo. Gráfico de setores mostra partes de um todo, geralmente em porcentagem. Em ambos, título, legenda e escala são indispensáveis."
        ],
        "examples": [],
        "conclusion": "Prepara AT2: leitura de barras/linhas, diferenças e cálculo de média.",
        "classwork": "Livro: Missão 20, p. 165-168. Comparar um gráfico de linhas com um de setores e explicar qual pergunta cada um responde melhor.",
        "homework": "Como houve livro, escolher 1 gráfico e escrever duas informações corretas sobre ele.",
        "alignment": "AT2: leitura de linhas e interpretação de parte do todo."
      }
    },
    {
      "id": "u3-w6-a4",
      "type": "lesson",
      "title": "Aula 29 - Média aritmética",
      "skill": "EF07MA36",
      "duration": "Semana 6 | 01/09 a 07/09 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Semana 6: Tabelas, gráficos e média aritmética.",
        "development": [
          "Média é a soma dos valores dividida pela quantidade de valores. O divisor é a quantidade de dados, não o maior número nem a quantidade de valores diferentes."
        ],
        "examples": [],
        "conclusion": "Prepara AT2: leitura de barras/linhas, diferenças e cálculo de média.",
        "classwork": "Quadro: médias de (6, 8, 7, 9, 10), (12, 15, 9, 14) e (5, 5, 7, 8, 10). Organizar soma, divisão e resposta.",
        "homework": "Quadro: 1) média de 7, 8, 6, 9; 2) média de 12, 10, 8, 14, 11; 3) explicar qual foi o divisor.",
        "alignment": "AT2: tabela de pontuações/notas e cálculo de média."
      }
    },
    {
      "id": "u3-w6-a5",
      "type": "lesson",
      "title": "Aula 30 - Gráfico mais média no mesmo problema",
      "skill": "EF07MA36",
      "duration": "Semana 6 | 01/09 a 07/09 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Semana 6: Tabelas, gráficos e média aritmética.",
        "development": [
          "Alguns problemas exigem primeiro retirar os valores do gráfico ou da tabela e depois calcular a média. Registre a lista de dados antes de somar."
        ],
        "examples": [],
        "conclusion": "Prepara AT2: leitura de barras/linhas, diferenças e cálculo de média.",
        "classwork": "Quadro: gráfico simples com cinco valores 6, 10, 8, 15 e 11. Pedir maior, diferença e média. Corrigir a leitura antes da conta.",
        "homework": "Refazer apenas o item em que errou leitura ou média. Atenção: 07/09 é feriado; esta aula pode virar tarefa orientada.",
        "alignment": "AT2: integração entre representação visual e medida de tendência central."
      }
    },
    {
      "id": "u3-w7-a1",
      "type": "lesson",
      "title": "Aula 31 - Mediana",
      "skill": "EF07MA36/37",
      "duration": "Semana 7 | 08/09 a 15/09 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Semana 7: Mediana, moda, probabilidade, revisão e AT2.",
        "development": [
          "Mediana é o valor central após ordenar os dados. Com quantidade ímpar, usamos o termo do meio; com quantidade par, fazemos a média dos dois termos centrais."
        ],
        "examples": [],
        "conclusion": "Fecha Estatística e Probabilidade; revisa na Aula 4 e aplica a AT2 na Aula 5.",
        "classwork": "Quadro: 15, 20, 25, 25, 30, 35, 40; depois 4, 7, 9, 10, 12, 18. Marcar as posições centrais.",
        "homework": "Quadro: 1) mediana de 6, 9, 7, 5, 8; 2) de 10, 4, 8, 12, 6, 14; 3) ordenar antes de responder.",
        "alignment": "AT2: mediana em lista de tempos."
      }
    },
    {
      "id": "u3-w7-a2",
      "type": "lesson",
      "title": "Aula 32 - Moda e tabela de frequências",
      "skill": "EF07MA36/37",
      "duration": "Semana 7 | 08/09 a 15/09 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Semana 7: Mediana, moda, probabilidade, revisão e AT2.",
        "development": [
          "Moda é o valor que aparece com maior frequência. Pode haver uma moda, mais de uma ou nenhuma. Em tabela, procure a maior frequência e volte ao valor correspondente."
        ],
        "examples": [],
        "conclusion": "Fecha Estatística e Probabilidade; revisa na Aula 4 e aplica a AT2 na Aula 5.",
        "classwork": "Quadro: notas 5, 5, 7, 8, 10; tabela com valores 1, 2, 3, 4 e frequências 2, 6, 3, 1.",
        "homework": "Quadro: 1) moda de 2, 4, 4, 5, 6; 2) moda de 1, 1, 3, 3, 5; 3) conjunto sem moda.",
        "alignment": "AT2: moda em lista e tabela de frequências."
      }
    },
    {
      "id": "u3-w7-a3",
      "type": "lesson",
      "title": "Aula 33 - Probabilidade: espaço amostral, evento e cálculo",
      "skill": "EF07MA36/37",
      "duration": "Semana 7 | 08/09 a 15/09 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Semana 7: Mediana, moda, probabilidade, revisão e AT2.",
        "development": [
          "Experimento aleatório tem resultado incerto. Espaço amostral reúne os resultados possíveis; evento reúne os resultados desejados. Em casos equiprováveis, P(evento) = casos favoráveis ÷ casos possíveis."
        ],
        "examples": [],
        "conclusion": "Fecha Estatística e Probabilidade; revisa na Aula 4 e aplica a AT2 na Aula 5.",
        "classwork": "Livro: Missão 19, p. 153-160. Usar moeda, dado e sacola para escrever o espaço amostral, contar casos favoráveis e calcular a probabilidade em forma de fração.",
        "homework": "Como houve livro, apenas 1 item selecionado: probabilidade de sair número par em um dado.",
        "alignment": "AT2: interpretar o sorteio e montar corretamente a fração."
      }
    },
    {
      "id": "u3-w7-a4",
      "type": "lesson",
      "title": "Aula 34 - Revisão específica para a AT2",
      "skill": "EF07MA36/37",
      "duration": "Semana 7 | 08/09 a 15/09 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Semana 7: Mediana, moda, probabilidade, revisão e AT2.",
        "development": [
          "Retomar leitura de gráficos e tabelas, média, mediana, moda e probabilidade. Antes de calcular, identificar título, escala, dados, ordem dos valores e total de resultados possíveis."
        ],
        "examples": [],
        "conclusion": "Fecha Estatística e Probabilidade; revisa na Aula 4 e aplica a AT2 na Aula 5.",
        "classwork": "Revisão com 6 itens no formato da AT2: 1 gráfico, 1 tabela, 1 média, 1 mediana, 1 moda e 1 probabilidade. Corrigir os itens ainda na aula.",
        "homework": "Refazer somente 2 itens em que houve erro. Não acrescentar nova lista.",
        "alignment": "Revisão imediatamente anterior à aplicação da AT2."
      }
    },
    {
      "id": "u3-w7-a5",
      "type": "lesson",
      "title": "Aula 35 - Aplicação da AT2",
      "skill": "EF07MA36/37",
      "duration": "Semana 7 | 08/09 a 15/09 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Semana 7: Mediana, moda, probabilidade, revisão e AT2.",
        "development": [
          "A AT2 reúne leitura de gráficos e tabelas, média, mediana, moda e probabilidade. O estudante deve retirar os dados corretamente antes de calcular."
        ],
        "examples": [],
        "conclusion": "Fecha Estatística e Probabilidade; revisa na Aula 4 e aplica a AT2 na Aula 5.",
        "classwork": "Aplicar a AT2. Reservar os minutos finais para um checklist: gráfico, tabela, média, mediana, moda e probabilidade.",
        "homework": "Sem lista nova. Anotar os dois conteúdos que precisam de revisão antes da prova.",
        "alignment": "AT2: avaliação formativa do segundo bloco."
      }
    },
    {
      "id": "u3-at2",
      "type": "activity",
      "title": "AT2 - Terceiro Bimestre",
      "skill": "EF07MA36/37",
      "duration": "Semana 7 | 08/09 a 15/09 | aplicação após revisão",
      "complexity": "Média",
      "questions": [
        {
          "question": "Um gráfico de barras registra 18 caixas arrecadadas pela turma B e 8 pela turma C. Qual é a diferença?",
          "answer": "18 - 8 = 10 caixas.",
          "spaceForWork": true
        },
        {
          "question": "Um gráfico de linhas registra 8 empréstimos na quarta-feira e 15 na quinta-feira. Quantos empréstimos a mais houve na quinta?",
          "answer": "15 - 8 = 7 empréstimos.",
          "spaceForWork": true
        },
        {
          "question": "As pontuações de cinco grupos foram 6, 8, 7, 9 e 10. Calcule a média.",
          "answer": "(6 + 8 + 7 + 9 + 10) ÷ 5 = 40 ÷ 5 = 8 pontos.",
          "spaceForWork": true
        },
        {
          "question": "Os tempos de leitura foram 15, 20, 25, 25, 30, 35 e 40 minutos. Determine a mediana.",
          "answer": "25 minutos, o quarto valor da lista ordenada.",
          "spaceForWork": true
        },
        {
          "question": "As quantidades de livros 1, 2, 3 e 4 apareceram, respectivamente, em 2, 6, 3 e 1 dias. Qual é a moda?",
          "answer": "2 livros, pois apresenta a maior frequência: 6 dias.",
          "spaceForWork": true
        },
        {
          "question": "Uma sacola tem 10 fichas: 4 listradas, 3 pontilhadas e 3 quadriculadas. Qual é a probabilidade de retirar uma ficha pontilhada?",
          "answer": "3/10.",
          "spaceForWork": true
        }
      ]
    },
    {
      "id": "u3-at2-adaptada",
      "type": "activity",
      "title": "AT2 Adaptada - Terceiro Bimestre",
      "skill": "EF07MA36/37",
      "duration": "Semana 7 | 08/09 a 15/09 | aplicação após revisão",
      "complexity": "Média",
      "questions": [
        {
          "question": "Uma tabela mostra 18 caixas para a turma B e 8 para a turma C. Qual é a diferença?",
          "answer": "10 caixas.",
          "spaceForWork": true
        },
        {
          "question": "Considere 5, 5, 7, 8 e 10. a) Qual é a moda? b) Qual é a mediana?",
          "answer": "a) Moda = 5. b) Mediana = 7.",
          "spaceForWork": true
        },
        {
          "question": "Em uma sacola há 10 fichas, sendo 3 pontilhadas. Qual é a probabilidade de retirar uma pontilhada?",
          "answer": "3/10.",
          "spaceForWork": true
        }
      ]
    },
    {
      "id": "u3-w8-a1",
      "type": "lesson",
      "title": "Aula 36 - Devolutiva da AT1 por grupos de erro",
      "skill": "EF07MA23/24/27/28 + retomada de números inteiros",
      "duration": "Semana 8 | 16/09 a 22/09 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Semana 8: Correção das ATs, reensino e revisão espiral para a prova.",
        "development": [
          "Separar erros em quatro grupos: leitura do ângulo, polígono regular, volume/unidade e capacidade/justificativa. Reensinar o procedimento, não apenas informar a resposta."
        ],
        "examples": [],
        "conclusion": "Recupera erros das ATs e incorpora os conteúdos presentes na prova de referência.",
        "classwork": "Estações com uma questão inédita por grupo. Os estudantes começam no grupo correspondente ao próprio erro e depois trocam.",
        "homework": "Refazer 1 item equivalente ao erro principal e escrever a etapa que faltou.",
        "alignment": "AT1 e prova: recuperação direcionada, com nova oportunidade de demonstrar habilidade."
      }
    },
    {
      "id": "u3-w8-a2",
      "type": "lesson",
      "title": "Aula 37 - Simulado curto de Geometria e Volume",
      "skill": "EF07MA23/24/27/28 + retomada de números inteiros",
      "duration": "Semana 8 | 16/09 a 22/09 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Semana 8: Correção das ATs, reensino e revisão espiral para a prova.",
        "development": [
          "Em questões visuais, leia os dados antes de escolher a fórmula. Registre propriedade, substituição dos valores, cálculo e unidade."
        ],
        "examples": [],
        "conclusion": "Recupera erros das ATs e incorpora os conteúdos presentes na prova de referência.",
        "classwork": "6 itens: complemento/suplemento, paralelas, polígono regular, circunferência, volume e capacidade.",
        "homework": "Refazer apenas 2 itens errados. Não passar lista adicional.",
        "alignment": "Combina AT1 com o bloco geométrico da prova."
      }
    },
    {
      "id": "u3-w8-a3",
      "type": "lesson",
      "title": "Aula 38 - Reta numérica e ordem dos números inteiros",
      "skill": "EF07MA23/24/27/28 + retomada de números inteiros",
      "duration": "Semana 8 | 16/09 a 22/09 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Semana 8: Correção das ATs, reensino e revisão espiral para a prova.",
        "development": [
          "Na reta numérica, o número mais à esquerda é menor. Entre negativos, o que está mais distante de zero para a esquerda é o menor: -8 < -3."
        ],
        "examples": [],
        "conclusion": "Recupera erros das ATs e incorpora os conteúdos presentes na prova de referência.",
        "classwork": "Missão 14, p. 113-116, como revisão. Quadro: ordenar -8, 2, 0, -3 e 1; localizar altitudes e profundidades.",
        "homework": "Como houve livro, apenas 1 item de ordenação/localização selecionado.",
        "alignment": "Prova de referência: ordem crescente de números inteiros."
      }
    },
    {
      "id": "u3-w8-a4",
      "type": "lesson",
      "title": "Aula 39 - Operações com números inteiros",
      "skill": "EF07MA23/24/27/28 + retomada de números inteiros",
      "duration": "Semana 8 | 16/09 a 22/09 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Semana 8: Correção das ATs, reensino e revisão espiral para a prova.",
        "development": [
          "Na multiplicação e divisão, sinais iguais resultam em positivo e sinais diferentes em negativo. Em saldo bancário, depósito soma e saque subtrai."
        ],
        "examples": [],
        "conclusion": "Recupera erros das ATs e incorpora os conteúdos presentes na prova de referência.",
        "classwork": "Quadro: (-7) × (+16), (-48) ÷ (-8), saldo 100 + 350 - 600 e três operações semelhantes.",
        "homework": "Quadro: 1) (-9)×(+12); 2) (-72)÷(-9); 3) 250 + 120 - 500.",
        "alignment": "Prova de referência: operações e situação de saldo."
      }
    },
    {
      "id": "u3-w8-a5",
      "type": "lesson",
      "title": "Aula 40 - Questões no formato da prova: ângulos e paralelas",
      "skill": "EF07MA23/24/27/28 + retomada de números inteiros",
      "duration": "Semana 8 | 16/09 a 22/09 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Semana 8: Correção das ATs, reensino e revisão espiral para a prova.",
        "development": [
          "Para complemento/suplemento, identifique 90° ou 180°. Para paralelas, reconheça a posição do ângulo e depois use igualdade ou suplementaridade."
        ],
        "examples": [],
        "conclusion": "Recupera erros das ATs e incorpora os conteúdos presentes na prova de referência.",
        "classwork": "Folha/quadro com 5 itens no estilo da prova, usando novos valores e figuras mais limpas. Correção comentada com destaque para a propriedade.",
        "homework": "Estudar a correção e refazer somente o item em que escolheu a relação errada.",
        "alignment": "Prova: familiaridade com linguagem e diagrama sem memorização da resposta."
      }
    },
    {
      "id": "u3-w9-a1",
      "type": "lesson",
      "title": "Aula 41 - Devolutiva da AT2",
      "skill": "Todas as habilidades trabalhadas + revisão espiral",
      "duration": "Semana 9 | 23/09 a 28/09 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Semana 9: Revisão final integrada antes da prova de 29/09.",
        "development": [
          "Classificar os erros em leitura de gráfico, média, mediana/moda e probabilidade. Conferir se o problema foi de leitura, organização dos dados ou cálculo."
        ],
        "examples": [],
        "conclusion": "Consolidação final; a prova de 29/09 encerra o período.",
        "classwork": "Reensino em quatro grupos, com uma questão curta e inédita por grupo. Finalizar com correção coletiva.",
        "homework": "Refazer 1 item equivalente ao erro principal. Não acrescentar nova lista.",
        "alignment": "AT2 e prova: transformar o erro em roteiro de estudo."
      }
    },
    {
      "id": "u3-w9-a2",
      "type": "lesson",
      "title": "Aula 42 - Simulado integrado de 12 questões",
      "skill": "Todas as habilidades trabalhadas + revisão espiral",
      "duration": "Semana 9 | 23/09 a 28/09 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Semana 9: Revisão final integrada antes da prova de 29/09.",
        "development": [
          "O simulado deve alternar reconhecimento visual, cálculo, interpretação e justificativa. Distribuição sugerida: 5 geometria/volume, 4 estatística/gráficos, 2 probabilidade e 1 inteiros."
        ],
        "examples": [],
        "conclusion": "Consolidação final; a prova de 29/09 encerra o período.",
        "classwork": "Aplicar em tempo controlado. Exigir cálculos. Recolher para mapear os três conteúdos com mais erros na turma.",
        "homework": "Revisar fórmulas e conceitos; sem exercícios extras no mesmo dia.",
        "alignment": "Ensaio geral para a prova sem copiar itens das avaliações anteriores."
      }
    },
    {
      "id": "u3-w9-a3",
      "type": "lesson",
      "title": "Aula 43 - Correção do simulado por estações",
      "skill": "Todas as habilidades trabalhadas + revisão espiral",
      "duration": "Semana 9 | 23/09 a 28/09 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Semana 9: Revisão final integrada antes da prova de 29/09.",
        "development": [
          "Cada estação deve explicar um procedimento: ângulos/polígonos, círculo/volume, gráficos/tendência central, probabilidade/inteiros."
        ],
        "examples": [],
        "conclusion": "Consolidação final; a prova de 29/09 encerra o período.",
        "classwork": "Os grupos resolvem novamente uma questão de cada estação e registram uma frase de regra ou estratégia.",
        "homework": "Escolher 3 erros do simulado e produzir uma correção completa no caderno.",
        "alignment": "Reensino responsivo baseado em evidência da própria turma."
      }
    },
    {
      "id": "u3-w9-a4",
      "type": "lesson",
      "title": "Aula 44 - Revisão oral e folha de fórmulas comentada",
      "skill": "Todas as habilidades trabalhadas + revisão espiral",
      "duration": "Semana 9 | 23/09 a 28/09 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Semana 9: Revisão final integrada antes da prova de 29/09.",
        "development": [
          "Retomar: 90°/180°; S = (n - 2)×180°; C = 2πr; A = πr²; V = c×l×h; 1 dm³ = 1 L; média; mediana; moda; P = favoráveis/possíveis."
        ],
        "examples": [],
        "conclusion": "Consolidação final; a prova de 29/09 encerra o período.",
        "classwork": "Professor apresenta uma situação curta para cada fórmula; estudantes dizem quando usar, quais dados procurar e qual unidade esperar.",
        "homework": "Ler a folha de fórmulas e resolver apenas 1 exemplo de cada conteúdo em que ainda sente insegurança.",
        "alignment": "Evita uso mecânico: fórmula acompanhada de interpretação e unidade."
      }
    },
    {
      "id": "u3-w9-a5",
      "type": "lesson",
      "title": "Aula 45 - Revisão final antes da prova",
      "skill": "Todas as habilidades trabalhadas + revisão espiral",
      "duration": "Semana 9 | 23/09 a 28/09 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Semana 9: Revisão final integrada antes da prova de 29/09.",
        "development": [
          "Na prova: ler o comando, marcar os dados, desenhar quando necessário, registrar cálculo e conferir unidade. Em gráficos, ler título, legenda e escala antes de responder."
        ],
        "examples": [],
        "conclusion": "Consolidação final; a prova de 29/09 encerra o período.",
        "classwork": "Quiz oral de 10 perguntas rápidas, sem nota. Fechar com plano individual: 'sei fazer', 'preciso conferir' e 'vou começar por'.",
        "homework": "Nenhuma lista. Organizar material, descansar e revisar somente o próprio quadro de dificuldades.",
        "alignment": "Revisão imediatamente anterior à prova de 29/09."
      }
    },
    {
      "id": "u3-prova-final",
      "type": "exam",
      "title": "Prova do 3º Bimestre - 29/09",
      "skill": "Todas as habilidades da unidade",
      "duration": "29/09 | último momento do cronograma",
      "complexity": "Alta",
      "questions": [
        {
          "question": "Um ângulo mede 35°. Determine a medida de seu complementar.",
          "answer": "90° - 35° = 55°.",
          "spaceForWork": true
        },
        {
          "question": "Dois ângulos são opostos pelo vértice. Se um mede 72°, quanto mede o outro?",
          "answer": "72°.",
          "spaceForWork": false
        },
        {
          "question": "Duas retas paralelas são cortadas por uma transversal. Um dos ângulos correspondentes mede 110°. Qual é a medida do outro?",
          "answer": "110°.",
          "spaceForWork": false
        },
        {
          "question": "Calcule a soma dos ângulos internos de um hexágono.",
          "answer": "(6 - 2) × 180° = 720°.",
          "spaceForWork": true
        },
        {
          "question": "Um reservatório retangular mede 50 cm × 40 cm × 30 cm. Determine o volume e a capacidade em litros.",
          "answer": "60.000 cm³ = 60 L.",
          "spaceForWork": true
        },
        {
          "question": "Uma tabela apresenta os valores 6, 10, 8, 15 e 11. Calcule a média.",
          "answer": "(6 + 10 + 8 + 15 + 11) ÷ 5 = 50 ÷ 5 = 10.",
          "spaceForWork": true
        },
        {
          "question": "Determine a mediana e a moda dos dados 4, 5, 5, 7, 9.",
          "answer": "Mediana = 5 e moda = 5.",
          "spaceForWork": true
        },
        {
          "question": "Ao lançar um dado comum, qual é a probabilidade de sair um número par?",
          "answer": "3/6 = 1/2.",
          "spaceForWork": true
        },
        {
          "question": "Organize em ordem crescente: -8, 2, 0, -3 e 1.",
          "answer": "-8, -3, 0, 1, 2.",
          "spaceForWork": false
        },
        {
          "question": "Uma conta tinha saldo de R$ 100, recebeu R$ 350 e depois houve um saque de R$ 600. Qual é o saldo final?",
          "answer": "100 + 350 - 600 = -150. Saldo de -R$ 150.",
          "spaceForWork": true
        }
      ]
    }
  ]
};
