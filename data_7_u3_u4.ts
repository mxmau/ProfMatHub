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
    { id: 'l4-1', type: 'lesson', title: 'Aula 01 - Ângulos: Classificação Básica', skill: 'EF07MA23', complexity: 'Baixa', content: { intro: 'A medida da abertura.', development: ['Agudo ($< 90^\\circ$), Reto ($90^\\circ$), Obtuso ($> 90^\\circ$) e Raso ($180^\\circ$).', 'Uso do transferidor.'], examples: [{ question: 'Como chamamos o ângulo de $180^\\circ$?', answer: 'Ângulo Raso (meia-volta).' }], conclusion: 'O ângulo mede a curva, não a linha.' } },
    { id: 'l4-2', type: 'lesson', title: 'Aula 02 - Ângulos Complementares e Suplementares', skill: 'EF07MA23', complexity: 'Média', content: { intro: 'Completando a volta.', development: ['Complementares (somam $90^\\circ$).', 'Suplementares (somam $180^\\circ$).', 'Uso de equações para achar ângulos faltantes.'], examples: [{ question: 'Qual o suplemento de $100^\\circ$?', answer: '$80^\\circ$.' }], conclusion: 'Juntos formam um canto ou uma reta.' } },
    { id: 'l4-3', type: 'lesson', title: 'Aula 03 - Ângulos Opostos pelo Vértice (OPV)', skill: 'EF07MA23', complexity: 'Média', content: { intro: 'A tesoura da matemática.', development: ['Retas concorrentes geram ângulos iguais lado a lado oposto.', 'Propriedades dos ângulos OPV.'], examples: [{ question: 'Se um lado da "tesoura" tem $40^\\circ$, e o outro lado oposto?', answer: '$40^\\circ$ também.' }], conclusion: 'Opostos no vértice são iguais.' } },
    { id: 'p4-1', type: 'practical', title: 'Aula 04 - Prática: Caça aos Ângulos', skill: 'EF07MA23', complexity: 'Baixa', practicalDescription: 'Alunos andam pela escola com transferidores de papel para medir ou classificar ângulos em portas, rampas e tesouras do telhado.' },
    
    { id: 'l4-5', type: 'lesson', title: 'Aula 05 - Polígonos Regulares e Diagonais', skill: 'EF07MA24', complexity: 'Média', content: { intro: 'As formas perfeitas.', development: ['Polígonos Regulares (Lados e ângulos iguais).', 'O que é uma diagonal.', 'Cálculo de diagonais a partir de um vértice ($d = n - 3$).'], examples: [{ question: 'Quantas diagonais partem de um vértice de um pentágono?', answer: '$5 - 3 = 2$.' }], conclusion: 'Todos os regulares são simétricos.' } },
    { id: 'l4-6', type: 'lesson', title: 'Aula 06 - Soma dos Ângulos Internos', skill: 'EF07MA24', complexity: 'Alta', content: { intro: 'O segredo interno.', development: ['A fórmula da soma: $S_i = (n-2) \\times 180^\\circ$.', 'A base em triângulos (cada polígono pode ser dividido em triângulos).'], examples: [{ question: 'Soma dos ângulos de um triângulo?', answer: '$180^\\circ$.' }, { question: 'Quadrilátero?', answer: '$360^\\circ$.' }], conclusion: 'Triângulos são a base de todos os polígonos.' } },
    { id: 'p4-2', type: 'practical', title: 'Aula 07 - Prática: O Tapete de Polígonos', skill: 'EF07MA24', complexity: 'Alta', practicalDescription: 'Com papelão, construir diferentes polígonos, medir todos os ângulos e provar a fórmula $S_i = (n-2) \\times 180^\\circ$ colando os vértices lado a lado.' },
    { id: 'ex4-1', type: 'exercise', title: 'Aula 08 - Bloco de Exercícios 1: Ângulos e Polígonos', questions: [{ question: 'Complemento de $30^\\circ$?', answer: '$60^\\circ$' }, { question: 'Qual a soma interna do Pentágono?', answer: '$540^\\circ$' }] },
    
    { id: 'l4-9', type: 'lesson', title: 'Aula 09 - Círculo e Circunferência', skill: 'EF07MA27', complexity: 'Baixa', content: { intro: 'A forma perfeita e o infinito.', development: ['Circunferência (a linha de borda) x Círculo (a área preenchida).', 'Raio ($r$) e Diâmetro ($D = 2r$).', 'Apresentando o número $\\pi$ (Pi).'], examples: [{ question: 'Se o raio é $5cm$, qual o diâmetro?', answer: '$10cm$.' }], conclusion: 'Diâmetro é sempre o dobro do raio.' } },
    { id: 'l4-10', type: 'lesson', title: 'Aula 10 - Comprimento da Circunferência', skill: 'EF07MA27', complexity: 'Média', content: { intro: 'Medindo o tamanho da borda redonda.', development: ['Fórmula: $C = 2 \\times \\pi \\times r$.', 'Aproximação de $\\pi = 3,14$.'], examples: [{ question: 'Se $r = 10$, qual o comprimento?', answer: '$C = 2 \\times 3,14 \\times 10 = 62,8$.' }], conclusion: 'A circunferência é "duas vezes o raio vezes pi".' } },
    { id: 'l4-11', type: 'lesson', title: 'Aula 11 - Área do Círculo', skill: 'EF07MA27', complexity: 'Alta', content: { intro: 'O espaço interno.', development: ['Fórmula: $A = \\pi \\times r^2$.', 'Cálculos usando potências e o valor de $\\pi$.'], examples: [{ question: 'Se $r = 2$, qual a área?', answer: '$A = 3,14 \\times 2^2 = 3,14 \\times 4 = 12,56$.' }], conclusion: 'Área usa o raio ao quadrado.' } },
    { id: 'p4-3', type: 'practical', title: 'Aula 12 - Prática: Descobrindo o PI', skill: 'EF07MA27', complexity: 'Média', practicalDescription: 'Levar latas, bambolês e pratos. Medir com barbante a borda (Circunferência) e dividir pelo Diâmetro medido com régua para achar sempre valores próximos a 3,14.' },
    
    { id: 'l4-13', type: 'lesson', title: 'Aula 13 - Volume do Paralelepípedo e Cubo', skill: 'EF07MA28', complexity: 'Média', content: { intro: 'Capacidade tridimensional.', development: ['O que é volume.', 'Fórmula: Comprimento $\\times$ Largura $\\times$ Altura.', 'O caso especial do cubo ($a^3$).'], examples: [{ question: 'Piscina $2m \\times 3m \\times 1m$. Qual o volume?', answer: '$6 m^3$.' }], conclusion: 'Área da base $\\times$ Altura te dá o Volume.' } },
    { id: 'l4-14', type: 'lesson', title: 'Aula 14 - Volume e Capacidade (Litros)', skill: 'EF07MA28', complexity: 'Alta', content: { intro: 'De metros cúbicos para litros.', development: ['A relação mágica: $1 dm^3 = 1 Litro$.', 'A relação $1 m^3 = 1000 Litros$.'], examples: [{ question: 'Quantos litros cabem numa caixa dágua de $2m^3$?', answer: '$2000$ Litros.' }], conclusion: 'Metros medem o espaço, litros medem o líquido.' } },
    { id: 'ex4-2', type: 'exercise', title: 'Aula 15 - Bloco de Exercícios 2: Círculos e Volumes', questions: [{ question: 'Diâmetro de círculo com $r=4$.', answer: '$8$' }, { question: 'Volume de cubo de aresta $3$.', answer: '$27$' }] },
    
    { id: 'l4-16', type: 'lesson', title: 'Aula 16 - Estatística Básica: Média', skill: 'EF07MA36', complexity: 'Baixa', content: { intro: 'Os números que resumem tudo.', development: ['Média aritmética simples.', 'Soma tudo e divide pela quantidade de elementos.'], examples: [{ question: 'Média de notas $6$, $8$ e $10$.', answer: '$(6+8+10) \\div 3 = 8$.' }], conclusion: 'A média distribui os valores igualmente.' } },
    { id: 'l4-17', type: 'lesson', title: 'Aula 17 - Mediana e Moda', skill: 'EF07MA36', complexity: 'Média', content: { intro: 'O do meio e o da moda.', development: ['Mediana: o valor central (após colocar em ordem crescente). Se par, média dos dois centrais.', 'Moda: o valor mais frequente.'], examples: [{ question: 'Conjunto: $2, 5, 5, 8$. Qual a moda e mediana?', answer: 'Moda é $5$. Mediana é $5$.' }], conclusion: 'A moda é o que mais repete.' } },
    { id: 'l4-18', type: 'lesson', title: 'Aula 18 - Análise de Gráficos', skill: 'EF07MA36', complexity: 'Baixa', content: { intro: 'Lendo a estatística no jornal.', development: ['Interpretação de gráficos de barras, linhas e setores.', 'Como calcular médias a partir do gráfico.'], examples: [{ question: 'Se a barra sobe, o que indica?', answer: 'Crescimento do valor ao longo daquele eixo.' }], conclusion: 'O gráfico fala por si só.' } },
    { id: 'p4-4', type: 'practical', title: 'Aula 19 - Prática: A Média da Turma', skill: 'EF07MA36', complexity: 'Média', practicalDescription: 'Os alunos coletam o número de calçados da turma e devem calcular Média, Moda e Mediana, desenhando um gráfico no quadro.' },
    { id: 'l4-20', type: 'lesson', title: 'Aula 20 - Probabilidade: Eventos e Espaço Amostral', skill: 'EF07MA37', complexity: 'Média', content: { intro: 'As chances do acaso.', development: ['O que é experimento aleatório.', 'Fórmula: (Casos Favoráveis) / (Casos Possíveis).'], examples: [{ question: 'Chance de tirar coroa na moeda?', answer: '$1/2 = 50\\%$.' }], conclusion: 'A sorte obedece à fração.' } },
    { id: 'ex4-3', type: 'exercise', title: 'Aula 21 - Bloco de Exercícios 3: Estatística', questions: [{ question: 'Média de $5, 10, 15$.', answer: '$10$' }, { question: 'Chance de tirar 6 no dado.', answer: '$1/6$' }] },
    
    { id: 'l4-22', type: 'lesson', title: 'Aula 22 - Revisão: Geometria e Volumes', skill: 'EF07MA24', complexity: 'Alta', content: { intro: 'Revisando as fórmulas.', development: ['Ângulos, Áreas e Paralelepípedos.'], examples: [], conclusion: 'Dúvidas finais.' } },
    { id: 'l4-23', type: 'lesson', title: 'Aula 23 - Revisão: Estatística e Probabilidade', skill: 'EF07MA36', complexity: 'Alta', content: { intro: 'Revendo dados e chances.', development: ['Média, Moda, Mediana e Frações.'], examples: [], conclusion: 'Tudo pronto para a prova final.' } },
    { id: 'l4-24', type: 'lesson', title: 'Aula 24 - Aprofundamento Anual', skill: 'Geral', complexity: 'Alta', content: { intro: 'Fechamento do Ano Letivo.', development: ['Resolução de desafios globais envolvendo Álgebra e Geometria misturadas.'], examples: [], conclusion: 'Prontos para o 8º Ano.' } },

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
        { question: 'A área de um quadrado é $36 cm^2$. Qual o tamanho do seu lado?', answer: '$6 cm$.', spaceForWork: true, imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='130' viewBox='0 0 120 130'%3E%3Crect x='10' y='10' width='100' height='100' fill='%23d1fae5' stroke='%23059669' stroke-width='2'/%3E%3Ctext x='60' y='65' font-size='13' fill='%23065f46' font-family='Arial' text-anchor='middle'%3E36 cm²%3C/text%3E%3Ctext x='60' y='125' font-size='11' fill='%23065f46' font-family='Arial' text-anchor='middle'%3E? cm%3C/text%3E%3C/svg%3E" },
        { question: 'O que mede um ângulo reto?', answer: '$90^\\circ$.', spaceForWork: false, imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cline x1='20' y1='100' x2='20' y2='20' stroke='%232563eb' stroke-width='2'/%3E%3Cline x1='20' y1='100' x2='100' y2='100' stroke='%232563eb' stroke-width='2'/%3E%3Crect x='20' y='80' width='20' height='20' fill='none' stroke='%23dc2626' stroke-width='1.5'/%3E%3Ctext x='60' y='85' font-size='14' fill='%23dc2626' font-family='Arial'%3E90°%3C/text%3E%3C/svg%3E" },
        { question: 'Calcule o volume de um cubo de aresta $3m$.', answer: '$27 m^3$.', spaceForWork: true, imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Cpolygon points='30,120 90,150 90,60 30,30' fill='%23a5b4fc' stroke='%234338ca' stroke-width='2'/%3E%3Cpolygon points='90,150 150,120 150,30 90,60' fill='%23818cf8' stroke='%234338ca' stroke-width='2'/%3E%3Cpolygon points='30,30 90,0 150,30 90,60' fill='%23c7d2fe' stroke='%234338ca' stroke-width='2'/%3E%3Ctext x='85' y='115' font-size='14' fill='%231e1b4b' font-family='Arial' text-anchor='middle'%3E3m%3C/text%3E%3C/svg%3E" },
        { question: 'Média das idades $10, 12, 14$.', answer: '$(10+12+14) \\div 3 = 12$.', spaceForWork: true },
        { question: 'Resolva: $(-3) \\times (-5)$.', answer: '$+15$.', spaceForWork: false }
      ] 
    }
  ]
};
