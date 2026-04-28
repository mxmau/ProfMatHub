import { Unit } from './types.ts';

export const unit2: Unit = {
  id: 'u2',
  title: 'Unidade II: Números Racionais',
  dateRange: '16 Abr - 07 Jul',
  description: 'Frações, Decimais, Porcentagem e Operações.',
  color: 'bg-green-100 border-green-300 text-green-800',
  bnccSkills: [
    'EF06MA07: Frações (significados: parte/todo, quociente).',
    'EF06MA08: Números decimais e reta numérica.',
    'EF06MA09: Fração de quantidade.',
    'EF06MA10: Adição e subtração de frações.',
    'EF06MA11: Operações com números decimais.',
    'EF06MA13: Porcentagem (cálculo e estimativa).'
  ],
  items: [
     { id: 'l2-1', type: 'lesson', title: 'Aula 01 - Revisão e Aplicação Prática de MMC e MDC', skill: 'EF06MA06', complexity: 'Média', content: { intro: 'Encerrando a parte de múltiplos e divisores.', development: ['Diferença entre MMC (encontros no futuro) e MDC (repartir o máximo possível).', 'Resolução guiada de problemas clássicos.'], examples: [{question: 'Como sei se a questão é de MMC?', answer: 'Geralmente fala sobre eventos que vão se repetir juntos.'}], conclusion: 'Ler o problema com atenção é metade da solução.' } },
     { id: 'ex2-1', type: 'exercise', title: 'Aula 02 - Bloco de Exercícios 1: MMC e MDC', questions: [{ question: 'Ônibus saem a cada 10 e 15 minutos. Quando sairão juntos?', answer: 'MMC(10,15) = 30 min.' }, { question: 'Qual o MDC de 18 e 24?', answer: '6.' }] },
     { id: 'l2-3', type: 'lesson', title: 'Aula 03 - O Conceito de Fração', skill: 'EF06MA07', complexity: 'Baixa', content: { intro: 'Dividindo a pizza em partes iguais.', development: ['Fração como parte de um todo.', 'Numerador (quantas partes peguei) e Denominador (em quantas dividi).', 'Leitura de frações (meios, terços, quartos).'], examples: [{question: 'Pintei 3 de 8 pedaços. Qual a fração?', answer: '$3/8$'}], conclusion: 'Fração é divisão.' } },
     { id: 'p2-1', type: 'practical', title: 'Aula 04 - Prática: A Pizzaria das Frações', skill: 'EF06MA07', complexity: 'Baixa', practicalDescription: 'Com recortes de pizzas de papel, alunos montam pedidos fracionados (ex: 1/2 calabresa, 1/4 queijo) e somam as partes visualmente.' },
     
     { id: 'l2-5', type: 'lesson', title: 'Aula 05 - Tipos de Fração', skill: 'EF06MA07', complexity: 'Baixa', content: { intro: 'Pequenas, grandes e inteiras.', development: ['Fração Própria (menor que um inteiro).', 'Fração Imprópria (maior que um inteiro).', 'Fração Aparente (resulta num inteiro exato).'], examples: [{question: '$5/2$ é própria ou imprópria?', answer: 'Imprópria, pois $5 > 2$.'}], conclusion: 'Olhe para o numerador em relação ao denominador.' } },
     { id: 'l2-6', type: 'lesson', title: 'Aula 06 - Números Mistos e Transformações', skill: 'EF06MA07', complexity: 'Média', content: { intro: 'Inteiros misturados com frações.', development: ['O que é número misto: $1 \\frac{1}{2}$.', 'Transformar misto em imprópria e vice-versa.'], examples: [{question: 'Transforme $2 \\frac{1}{3}$ em imprópria.', answer: '$(2\\times3)+1 = 7/3$.'}], conclusion: 'A forma imprópria facilita os cálculos.' } },
     { id: 'l2-7', type: 'lesson', title: 'Aula 07 - Frações Equivalentes', skill: 'EF06MA07', complexity: 'Média', content: { intro: 'A mesma quantidade com nomes diferentes.', development: ['Multiplicar ou dividir numerador e denominador pelo mesmo número.', 'A igualdade de valor.'], examples: [{question: 'Encontre uma equivalente a $1/2$.', answer: 'Multiplicando por 2: $2/4$.'}], conclusion: 'A forma muda, o valor fica.' } },
     { id: 'l2-8', type: 'lesson', title: 'Aula 08 - Simplificação e Comparação de Frações', skill: 'EF06MA07', complexity: 'Alta', content: { intro: 'Tornando as coisas mais simples.', development: ['Dividir em cima e embaixo até chegar na Fração Irredutível.', 'Como comparar frações reduzindo ao mesmo denominador.'], examples: [{question: 'Simplifique $15/20$.', answer: 'Divida por 5: $3/4$.'}], conclusion: 'Sempre responda na forma irredutível.' } },
     
     { id: 'l2-9', type: 'lesson', title: 'Aula 09 - Fração de uma Quantidade', skill: 'EF06MA09', complexity: 'Média', content: { intro: 'Calculando fatias reais de um número.', development: ['Dividir pelo de baixo, multiplicar pelo de cima.', 'A palavra "de" na matemática significa multiplicação.'], examples: [{question: 'Calcule $2/5$ de $20$.', answer: '$20 \\div 5 = 4$. Depois, $4 \\times 2 = 8$.'}], conclusion: 'Divide pela base, multiplica pelo topo.' } },
     { id: 'ex2-2', type: 'exercise', title: 'Aula 10 - Bloco de Exercícios 2: Fração e Quantidade', questions: [{ question: 'Calcule $3/7$ de $49$.', answer: '$21$.' }, { question: 'João leu $2/3$ de um livro de 90 páginas. Quantas páginas faltam?', answer: 'Leu 60. Faltam 30.' }] },
     { id: 'l2-11', type: 'lesson', title: 'Aula 11 - Adição e Subtração de Frações (Denominadores Iguais)', skill: 'EF06MA10', complexity: 'Baixa', content: { intro: 'Somando fatias do mesmo tamanho.', development: ['Conserva o denominador.', 'Soma ou subtrai os numeradores.'], examples: [{question: '$2/5 + 1/5$', answer: '$3/5$'}], conclusion: 'Denominador igual = vida fácil.' } },
     { id: 'l2-12', type: 'lesson', title: 'Aula 12 - Adição e Subtração (Denominadores Diferentes)', skill: 'EF06MA10', complexity: 'Alta', content: { intro: 'Tamanhos diferentes não se misturam direto.', development: ['Passo 1: Encontrar o MMC dos denominadores.', 'Passo 2: Fazer frações equivalentes.', 'Passo 3: Somar/Subtrair numeradores.'], examples: [{question: '$1/2 + 1/3$', answer: 'MMC é 6. Vira $3/6 + 2/6 = 5/6$.'}], conclusion: 'MMC salva o dia nas frações.' } },
     
     { id: 'l2-13', type: 'lesson', title: 'Aula 13 - Resolução de Problemas com Frações', skill: 'EF06MA10', complexity: 'Alta', content: { intro: 'Traduza o problema.', development: ['Identificar o inteiro ($1$ ou a fração inteira $N/N$).', 'Subtrair do inteiro para achar o que falta.'], examples: [{question: 'Gastei $1/3$ e $1/4$ do salário. Quanto sobrou?', answer: 'Gastei $7/12$. Sobraram $5/12$.'}], conclusion: 'Desenhe se estiver difícil de visualizar.' } },
     { id: 'p2-2', type: 'practical', title: 'Aula 14 - Prática: A Horta Fracionada', skill: 'EF06MA10', complexity: 'Média', practicalDescription: 'Desenhar uma planta de horta em malha quadriculada. Dividir o terreno com frações de diferentes tamanhos para cenoura, alface e tomate, e calcular a área restante.' },
     { id: 'l2-15', type: 'lesson', title: 'Aula 15 - Introdução aos Números Decimais', skill: 'EF06MA08', complexity: 'Baixa', content: { intro: 'A vírgula separando o inteiro da quebra.', development: ['Décimos, Centésimos, Milésimos.', 'Relação com moeda nacional (Reais e Centavos).'], examples: [{question: 'Como ler $0,5$?', answer: 'Cinco décimos.'}], conclusion: 'Dinheiro ajuda a entender decimais.' } },
     { id: 'l2-16', type: 'lesson', title: 'Aula 16 - Transformação: Fração em Decimal e Vice-versa', skill: 'EF06MA08', complexity: 'Média', content: { intro: 'Dois lados da mesma moeda.', development: ['Frações com denominador 10, 100, 1000.', 'Uma casa decimal = 1 zero no denominador.'], examples: [{question: 'Escreva $3/100$ em decimal.', answer: '$0,03$'}], conclusion: 'Contar as casas e colocar a vírgula.' } },
     
     { id: 'l2-17', type: 'lesson', title: 'Aula 17 - Comparação, Ordenação e Reta Numérica', skill: 'EF06MA08A', complexity: 'Média', content: { intro: 'Quem é maior e onde ficam na reta?', development: ['Igualar o número de casas decimais com zeros.', 'Localização entre números inteiros.'], examples: [{question: 'Maior: $0,5$ ou $0,45$?', answer: '$0,50$ é maior que $0,45$.'}], conclusion: 'Preencha com zeros para não confundir.' } },
     { id: 'l2-18', type: 'lesson', title: 'Aula 18 - Adição e Subtração de Decimais', skill: 'EF06MA11', complexity: 'Média', content: { intro: 'Vírgula debaixo de vírgula.', development: ['Alinhar as vírgulas.', 'Completar com zeros onde faltar.', 'Somar como naturais.'], examples: [{question: '$2,5 + 0,15$', answer: '$2,65$'}], conclusion: 'Organização vertical é tudo.' } },
     { id: 'l2-19', type: 'lesson', title: 'Aula 19 - Multiplicação de Decimais', skill: 'EF06MA11', complexity: 'Alta', content: { intro: 'Esqueça a vírgula, depois lembre dela.', development: ['Multiplicar sem as vírgulas.', 'Somar o total de casas decimais dos fatores.', 'Colocar a vírgula no resultado.'], examples: [{question: '$1,2 \\times 0,3$', answer: '$12 \\times 3 = 36$. Duas casas = $0,36$.'}], conclusion: 'Multiplica e depois conta as casas.' } },
     { id: 'l2-20', type: 'lesson', title: 'Aula 20 - Divisão de Decimais', skill: 'EF06MA11', complexity: 'Alta', content: { intro: 'Igualando as casas antes de dividir.', development: ['Igualar as casas decimais.', 'Cortar as vírgulas.', 'Dividir normalmente.'], examples: [{question: '$3 \\div 0,5$', answer: '$30 \\div 5 = 6$.'}], conclusion: 'Sem vírgulas, é só divisão natural.' } },
     
     { id: 'p2-3', type: 'practical', title: 'Aula 21 - Prática: Mercadinho Matemático', skill: 'EF06MA11', complexity: 'Baixa', practicalDescription: 'Com dinheiro fictício e folhetos, alunos devem "comprar" múltiplos itens por peso (ex: 1,5 kg) e calcular o troco usando operações decimais.' },
     { id: 'l2-22', type: 'lesson', title: 'Aula 22 - Introdução à Porcentagem', skill: 'EF06MA13', complexity: 'Baixa', content: { intro: 'Por cada cento.', development: ['Símbolo $\%$.', 'Porcentagem como fração de denominador $100$.', 'Porcentagem como decimal ($50\\% = 0,5$).'], examples: [{question: 'Escreva $25\\%$ como fração irredutível.', answer: '$1/4$.'}], conclusion: 'Três formas de escrever a mesma coisa.' } },
     { id: 'l2-23', type: 'lesson', title: 'Aula 23 - Cálculo de Porcentagens Básicas (Cálculo Mental)', skill: 'EF06MA13', complexity: 'Média', content: { intro: 'Truques rápidos de mente.', development: ['$50\\%$ = metade.', '$25\\%$ = um quarto.', '$10\\%$ = décima parte (corta um zero).'], examples: [{question: '$10\\%$ de $250$', answer: '$25$'}], conclusion: 'Atalhos salvam tempo nas compras.' } },
     { id: 'ex2-4', type: 'exercise', title: 'Aula 24 - Bloco de Exercícios 3: Decimais e Porcentagem', questions: [{ question: '$10\\%$ de $50$', answer: '$5$' }, { question: '$3,5 + 2,1$', answer: '$5,6$' }] },

     { 
       id: 'act2-1', type: 'activity', title: 'Atividade Avaliativa 1: Frações e Decimais', skill: 'Geral', 
       questions: [
         { question: 'Represente $2/5$ em forma de desenho.', answer: 'Desenho com 2 partes pintadas de 5.', spaceForWork: true },
         { question: 'Converta a fração $3/10$ em número decimal.', answer: '$0,3$.', spaceForWork: false },
         { question: 'Compare usando > ou <: $0,5$ e $0,05$.', answer: '$0,5 > 0,05$.', spaceForWork: false },
         { question: 'Calcule a soma: $3,45 + 12,2$.', answer: '$15,65$.', spaceForWork: true },
         { question: 'Uma pizza foi dividida em $8$ pedaços. João comeu $3$. Que fração sobrou?', answer: '$5/8$.', spaceForWork: true },
         { question: 'Classifique a fração $7/3$: própria, imprópria ou aparente?', answer: 'Imprópria, pois $7 > 3$.', spaceForWork: false },
         { question: 'Simplifique a fração $8/12$.', answer: '$2/3$ (divide ambos por $4$).', spaceForWork: true },
         { question: 'Encontre uma fração equivalente a $1/4$ com denominador $20$.', answer: '$5/20$.', spaceForWork: true },
         { question: 'Em um grupo de $30$ alunos, $12$ são meninas. Qual a fração de meninas?', answer: '$12/30 = 2/5$.', spaceForWork: true },
         { question: 'Escreva $0,75$ na forma de fração irredutível.', answer: '$75/100 = 3/4$.', spaceForWork: true }
       ] 
     },
     { 
       id: 'act2-2', type: 'activity', title: 'Atividade Avaliativa 2: Problemas com Racionais', skill: 'Geral', 
       questions: [
         { question: 'Calcule $1/3$ de $60$ reais.', answer: '$20$ reais.', spaceForWork: true },
         { question: 'Se você gastou $0,4$ do seu dia dormindo, quantas horas isso representa? (Dica: $24 \\times 0,4$)', answer: '$9,6$ horas.', spaceForWork: true },
         { question: 'Some as frações: $1/2 + 1/4$.', answer: '$3/4$.', spaceForWork: true },
         { question: 'Quanto é $25\\%$ de $100$?', answer: '$25$.', spaceForWork: true },
         { question: 'Transforme $40/100$ em porcentagem.', answer: '$40\\%$.', spaceForWork: false },
         { question: 'Um produto custava R$ $120$. Teve $15\\%$ de desconto. Qual o valor do desconto?', answer: 'R$ $18$.', spaceForWork: true },
         { question: 'Resolva: $2/3 + 1/6$.', answer: 'MMC = $6$. Vira $4/6 + 1/6 = 5/6$.', spaceForWork: true },
         { question: 'Multiplique: $0,3 \\times 0,4$.', answer: '$0,12$.', spaceForWork: true },
         { question: 'Uma receita pede $3/4$ de $kg$ de farinha. Se Maria quer fazer metade da receita, quanto de farinha usará?', answer: '$3/8$ de $kg$.', spaceForWork: true },
         { question: 'Ordene da menor para a maior: $0,4$; $1/3$; $0,35$.', answer: '$1/3 \\approx 0,33$; $0,35$; $0,4$.', spaceForWork: true }
       ] 
     },
     { 
       id: 'exam2', type: 'exam', title: 'Prova da Unidade II', skill: 'Geral', 
       questions: [
         { question: 'Simplifique a fração $15/20$.', answer: '$3/4$.', spaceForWork: true },
         { question: 'Escreva a fração imprópria $5/2$ na forma decimal.', answer: '$2,5$.', spaceForWork: true },
         { question: 'Resolva: $3/5 + 1/5$.', answer: '$4/5$.', spaceForWork: true },
         { question: 'Resolva: $1/2 - 1/3$ (Tire o MMC).', answer: '$1/6$.', spaceForWork: true },
         { question: 'Multiplique: $2,5 \\times 1,4$.', answer: '$3,5$.', spaceForWork: true },
         { question: 'Divida: $6 \\div 0,5$.', answer: '$12$.', spaceForWork: true },
         { question: 'Uma blusa custa R$ $80,00$. Na promoção tem $20\\%$ de desconto. Qual o valor do desconto?', answer: 'R$ $16,00$.', spaceForWork: true },
         { question: 'Qual é maior: $1/2$ ou $0,6$?', answer: '$0,6$ (pois $1/2 = 0,5$).', spaceForWork: false },
         { question: 'Em uma turma de $40$ alunos, $3/4$ gostam de futebol. Quantos alunos gostam de futebol?', answer: '$30$ alunos.', spaceForWork: true },
         { question: 'Escreva como se lê o número $2,35$.', answer: 'Dois inteiros e trinta e cinco centésimos.', spaceForWork: false }
       ] 
     }
  ]
};
