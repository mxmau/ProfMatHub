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
    {
      id: 'l3-1', type: 'lesson', title: 'Aula 01 - Letras na Matemática', skill: 'EF07MA13', complexity: 'Baixa',
      content: {
        intro: 'Quando não sabemos o número, chamamos pelo nome (ou letra).',
        development: ['Variáveis x Incógnitas.', 'Traduzir texto para matematiquês.', 'Expressões Algébricas (ex: o dobro de um número = $2x$).'],
        examples: [{ question: 'A metade de um número mais três.', answer: '$x/2 + 3$.' }],
        conclusion: 'A letra guarda o lugar do número.'
      }
    },
    {
      id: 'l3-2', type: 'lesson', title: 'Aula 02 - Valor Numérico', skill: 'EF07MA13', complexity: 'Média',
      content: {
        intro: 'Substituindo a letra.',
        development: ['Trocar a variável por um número e calcular.', 'Cuidado com os sinais negativos na substituição.'],
        examples: [{ question: 'Calcule $2x + 5$ se $x = 3$.', answer: '$2(3) + 5 = 11$.' }],
        conclusion: 'Álgebra vira aritmética quando sabemos o valor da letra.'
      }
    },
    {
      id: 'l3-3', type: 'lesson', title: 'Aula 03 - Equação do 1º Grau (Conceito)', skill: 'EF07MA18', complexity: 'Média',
      content: {
        intro: 'A balança da verdade.',
        development: ['Equação tem sinal de $=$ e incógnita.', '1º membro (esquerda) e 2º membro (direita).', 'Raiz da equação (o valor que torna verdade).'],
        examples: [{ question: '$x + 4 = 10$. Qual a raiz?', answer: '$6$.' }],
        conclusion: 'Resolver equação é descobrir quem é o X.'
      }
    },
    {
      id: 'l3-4', type: 'lesson', title: 'Aula 04 - Isolando o X', skill: 'EF07MA18', complexity: 'Alta',
      content: {
        intro: 'Operações Inversas em Ação.',
        development: ['"Passar para o outro lado" com a operação oposta.', 'Se está somando, vai subtraindo. Se multiplica, vai dividindo.'],
        examples: [{ question: '$3x - 2 = 10$', answer: '$3x = 12 \\Rightarrow x = 4$.' }],
        conclusion: 'Letras de um lado, números do outro.'
      }
    },
    { id: 'p3-1', type: 'practical', title: 'Aula 05 - Prática: O Detetive do X', skill: 'EF07MA18', complexity: 'Alta', practicalDescription: 'Alunos recebem "cartas enigma" (problemas textuais curtos). Devem montar a equação no quadro e resolver passo a passo.' },
    {
      id: 'l3-6', type: 'lesson', title: 'Aula 06 - Razão e Proporção', skill: 'EF07MA17', complexity: 'Baixa',
      content: {
        intro: 'Comparando quantidades.',
        development: ['Razão é uma divisão/fração entre duas grandezas.', 'Proporção é a igualdade de duas razões.', 'Produto dos meios = Produto dos extremos (Cruzamento).'],
        examples: [{ question: 'Razão entre 2 e 5.', answer: '$2/5$.' }, { question: 'Se $1/2 = x/4$, qual o X?', answer: '$2$.' }],
        conclusion: 'Multiplique cruzado.'
      }
    },
    {
      id: 'l3-7', type: 'lesson', title: 'Aula 07 - Regra de Três Simples', skill: 'EF07MA17', complexity: 'Alta',
      content: {
        intro: 'O canivete suíço da matemática.',
        development: ['Montar a tabela de grandezas.', 'Diretamente proporcionais (aumentam juntas).', 'Multiplicar cruzado e resolver a equação.'],
        examples: [{ question: '2 pães custam R$1. Quanto custam 6 pães?', answer: 'R$3.' }],
        conclusion: 'A regra de três resolve (quase) tudo no dia a dia.'
      }
    },
    { id: 'ex3-1', type: 'exercise', title: 'Exercícios 3 (Equações)', questions: [{ question: 'Resolva $5x = 20$', answer: '$x = 4$' }, { question: 'Arme a regra de 3: 1kg custa 5, quanto custa 3kg?', answer: '$x = 15$' }] },
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
  id: 'u4-7',
  title: 'Unidade IV: Geometria, Volumes e Estatística',
  dateRange: '30 Set - 15 Dez',
  description: 'Ângulos, Circunferência, Polígonos regulares, Volumes e Gráficos.',
  color: 'bg-red-100 border-red-300 text-red-800',
  bnccSkills: [
    'EF07MA23/24: Ângulos e Polígonos.',
    'EF07MA27/28: Círculo, Circunferência e Volume.',
    'EF07MA36/37: Média, Moda, Mediana e Probabilidade.'
  ],
  items: [
    {
      id: 'l4-1', type: 'lesson', title: 'Aula 01 - Ângulos (Revisão e Tipos)', skill: 'EF07MA23', complexity: 'Baixa',
      content: {
        intro: 'A medida da abertura.',
        development: ['Agudo ($< 90^\\circ$), Reto ($90^\\circ$), Obtuso ($> 90^\\circ$) e Raso ($180^\\circ$).', 'Uso do transferidor.'],
        examples: [{ question: 'Como chamamos o ângulo de $180^\\circ$?', answer: 'Ângulo Raso (meia-volta).' }],
        conclusion: 'O ângulo mede a curva, não a linha.'
      }
    },
    {
      id: 'l4-2', type: 'lesson', title: 'Aula 02 - Polígonos e Diagonais', skill: 'EF07MA24', complexity: 'Média',
      content: {
        intro: 'Avaliando figuras fechadas.',
        development: ['Polígonos Regulares (Lados e ângulos iguais).', 'Cálculo de diagonais a partir de um vértice.', 'Soma dos ângulos internos ($S_i = (n-2) \\times 180^\\circ$).'],
        examples: [{ question: 'Soma dos ângulos de um triângulo?', answer: '$180^\\circ$.' }],
        conclusion: 'Triângulos são a base de todos os polígonos.'
      }
    },
    { id: 'p4-1', type: 'practical', title: 'Aula 03 - Prática: Construção com Régua e Compasso', skill: 'EF07MA24', complexity: 'Média', practicalDescription: 'Usando régua e compasso, os alunos devem construir um triângulo equilátero e um hexágono regular.' },
    {
      id: 'l4-4', type: 'lesson', title: 'Aula 04 - Círculo e Circunferência', skill: 'EF07MA27', complexity: 'Baixa',
      content: {
        intro: 'A forma perfeita.',
        development: ['Circunferência (borda) x Círculo (preenchido).', 'Raio e Diâmetro ($D = 2r$).', 'Apresentando o número $\\pi$ (Pi).'],
        examples: [{ question: 'Se o raio é $5cm$, qual o diâmetro?', answer: '$10cm$.' }],
        conclusion: 'Diâmetro é o dobro do raio.'
      }
    },
    {
      id: 'l4-5', type: 'lesson', title: 'Aula 05 - Volume do Paralelepípedo', skill: 'EF07MA28', complexity: 'Média',
      content: {
        intro: 'Capacidade tridimensional.',
        development: ['Volume = Comprimento $\\times$ Largura $\\times$ Altura.', 'Unidade em cubos ($m^3$, $cm^3$).', 'Relação $1 dm^3 = 1 Litro$.'],
        examples: [{ question: 'Piscina $2m \\times 3m \\times 1m$. Qual o volume?', answer: '$6 m^3$.' }],
        conclusion: 'Área $\\times$ Altura te dá o Volume.'
      }
    },
    { id: 'ex4-1', type: 'exercise', title: 'Exercícios 4 (Geometria)', questions: [{ question: 'Diâmetro de círculo com $r=4$.', answer: '$8$' }, { question: 'Volume de cubo de lado $2$.', answer: '$8$' }] },
    {
      id: 'l4-7', type: 'lesson', title: 'Aula 06 - Estatística (Moda, Média, Mediana)', skill: 'EF07MA36', complexity: 'Alta',
      content: {
        intro: 'Os números que resumem tudo.',
        development: ['Média: Soma tudo e divide pela quantidade.', 'Moda: O que mais aparece.', 'Mediana: O valor do meio (colocando em ordem).'],
        examples: [{ question: 'Média de notas $6$, $8$ e $10$.', answer: '$(6+8+10) \\div 3 = 8$.' }],
        conclusion: 'Cada medida nos conta uma história diferente.'
      }
    },
    { 
      id: 'act4-1', type: 'activity', title: 'Avaliação Unidade IV', skill: 'Geral', 
      questions: [
        { question: 'Calcule a soma dos ângulos internos de um quadrilátero.', answer: '$360^\\circ$.', spaceForWork: true },
        { question: 'Se o raio de uma bicicleta é $30cm$, qual o diâmetro?', answer: '$60cm$.', spaceForWork: false },
        { question: 'Qual o volume de uma caixa de sapatos de $30cm \\times 20cm \\times 10cm$?', answer: '$6000 cm^3$.', spaceForWork: true },
        { question: 'Calcule a Média e a Moda dos números: $5, 5, 8, 10$.', answer: 'Soma = $28$. Média = $7$. Moda = $5$.', spaceForWork: true },
        { question: 'Um ângulo de $120^\\circ$ é agudo, reto ou obtuso?', answer: 'Obtuso (maior que $90^\\circ$).', spaceForWork: false },
        { question: 'Qual a soma dos ângulos internos de um triângulo?', answer: '$180^\\circ$.', spaceForWork: false },
        { question: 'Uma caixa cúbica tem aresta de $5cm$. Qual seu volume?', answer: '$125 cm^3$.', spaceForWork: true },
        { question: 'Qual a mediana do conjunto: $3, 7, 1, 9, 5$?', answer: 'Ordenando: $1, 3, 5, 7, 9$. Mediana = $5$.', spaceForWork: true },
        { question: 'O diâmetro de um círculo é $14cm$. Qual o raio?', answer: '$7cm$.', spaceForWork: false },
        { question: 'Calcule a média aritmética das notas: $6, 7, 8, 9$.', answer: '$(6+7+8+9) \\div 4 = 7,5$.', spaceForWork: true }
      ] 
    },
    { 
      id: 'exam-final', type: 'exam', title: 'Prova Final (7º Ano)', skill: 'Geral', 
      questions: [
        { question: 'Resolva a equação: $3x + 5 = 20$.', answer: '$x = 5$.', spaceForWork: true },
        { question: 'Qual o oposto de $-20$?', answer: '$20$.', spaceForWork: false },
        { question: 'Converta a razão $1/4$ para porcentagem.', answer: '$25\\%$.', spaceForWork: true },
        { question: 'Calcule: $-8 - 5$.', answer: '$-13$.', spaceForWork: true },
        { question: 'Uma máquina produz $100$ peças em $2$ horas. Em $5$ horas, quantas peças ela produz?', answer: '$250$ peças.', spaceForWork: true },
        { question: 'A área de um quadrado é $36 cm^2$. Qual o tamanho do seu lado?', answer: '$6 cm$.', spaceForWork: true },
        { question: 'O que mede um ângulo reto?', answer: '$90^\\circ$.', spaceForWork: false },
        { question: 'Calcule o volume de um cubo de aresta $3m$.', answer: '$27 m^3$.', spaceForWork: true, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Cubo.svg/300px-Cubo.svg.png' },
        { question: 'Média das idades $10, 12, 14$.', answer: '$(10+12+14) \\div 3 = 12$.', spaceForWork: true },
        { question: 'Resolva: $(-3) \\times (-5)$.', answer: '$+15$.', spaceForWork: false }
      ] 
    }
  ]
};
