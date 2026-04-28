import { Unit } from './types.ts';

export const unit3: Unit = {
  id: 'u3',
  title: 'Unidade III: Geometria e Álgebra',
  dateRange: '08 Jul - 29 Set',
  description: 'Introdução à Álgebra (Igualdade), Plano Cartesiano e Geometria.',
  color: 'bg-yellow-100 border-yellow-300 text-yellow-800',
  bnccSkills: [
    'EF06MA14: Propriedades da igualdade.',
    'EF06MA16: Plano cartesiano e coordenadas.',
    'EF06MA17: Prismas e Pirâmides (vértices, faces, arestas).',
    'EF06MA18/19: Polígonos e Triângulos.',
    'EF06MA21: Retas paralelas, concorrentes e perpendiculares.'
  ],
  items: [
     { id: 'l3-1', type: 'lesson', title: 'Aula 01 - Intro à Álgebra: Igualdade', skill: 'EF06MA14', complexity: 'Baixa', content: { intro: 'A balança da matemática.', development: ['Sinal de $=$ como equilíbrio.', 'O que faço de um lado, faço do outro.'], examples: [{question: 'Se $3 + 4 = 7$, então $3 + 4 + 2 = ?$?', answer: '$7 + 2 = 9$.'}], conclusion: 'Igualdade é balança equilibrada.' } },
     { id: 'l3-2', type: 'lesson', title: 'Aula 02 - Valores Desconhecidos', skill: 'EF06MA14', complexity: 'Média', content: { intro: 'O mistério do quadradinho.', development: ['Usando letras ou símbolos para o desconhecido.', 'Operação inversa para descobrir.'], examples: [{question: '$X + 5 = 12$. Quem é $X$?', answer: '$X = 12 - 5 = 7$.'}], conclusion: 'Inverta a operação para achar o mistério.' } },
     { id: 'p3-1', type: 'practical', title: 'Aula 03 - Prática: A Balança', skill: 'EF06MA14', complexity: 'Baixa', practicalDescription: 'Com uma balança de pratos ou cabide, os alunos devem equilibrar pesos de um lado e do outro para entender o conceito de equações simples.' },
     { id: 'ex3-1', type: 'exercise', title: 'Bloco de Exercícios 1 (Álgebra)', questions: [{ question: 'Descubra: $? - 4 = 10$', answer: '$14$' }, { question: 'Qual a operação inversa da multiplicação?', answer: 'Divisão.' }] },

     { id: 'l3-4', type: 'lesson', title: 'Aula 04 - Plano Cartesiano', skill: 'EF06MA16', complexity: 'Baixa', content: { intro: 'O GPS da matemática.', development: ['Eixos X (horizontal) e Y (vertical).', 'Origem $(0,0)$.', 'Pares ordenados $(X,Y)$.'], examples: [{question: 'Onde fica $(2,3)$?', answer: 'Anda 2 para a direita, sobe 3.'}], conclusion: 'Primeiro anda no chão, depois sobe o elevador.' } },
     { id: 'l3-5', type: 'lesson', title: 'Aula 05 - Localização e Movimento', skill: 'EF06MA16', complexity: 'Média', content: { intro: 'Traçando caminhos.', development: ['Andar para direita/cima (positivo).', 'Criar polígonos ligando os pontos.'], examples: [{question: 'Ligue $(0,0)$, $(0,2)$ e $(2,0)$. Que figura é?', answer: 'Um triângulo.'}], conclusion: 'Geometria mora no plano cartesiano.' } },
     { id: 'p3-2', type: 'practical', title: 'Aula 06 - Prática: Batalha Naval', skill: 'EF06MA16', complexity: 'Média', practicalDescription: 'Jogar Batalha Naval no plano cartesiano para treinar a leitura rápida de pares ordenados (X,Y).' },
     { id: 'ex3-2', type: 'exercise', title: 'Bloco de Exercícios 2 (Cartesiano)', questions: [{ question: 'Qual eixo é o X?', answer: 'O eixo horizontal.' }, { question: 'Escreva a origem do plano.', answer: '$(0,0)$.' }] },

     { id: 'l3-7', type: 'lesson', title: 'Aula 07 - Formas Espaciais', skill: 'EF06MA17', complexity: 'Baixa', content: { intro: 'O mundo é 3D.', development: ['Poliedros (retos) x Corpos Redondos (rolam).', 'Faces, Vértices e Arestas.'], examples: [{question: 'Um dado tem quantas faces?', answer: '$6$.'}], conclusion: 'Vértices são as pontas, arestas as linhas.' } },
     { id: 'l3-8', type: 'lesson', title: 'Aula 08 - Prismas e Pirâmides', skill: 'EF06MA17', complexity: 'Média', content: { intro: 'Duas bases vs Uma ponta.', development: ['Prisma: bases iguais e paralelas, faces laterais retangulares.', 'Pirâmide: uma base, faces laterais triangulares unidas no topo.'], examples: [{question: 'Qual a face lateral da pirâmide?', answer: 'Triângulo.'}], conclusion: 'O nome vem do formato da base.' } },
     { id: 'l3-9', type: 'lesson', title: 'Aula 09 - Planificações', skill: 'EF06MA17', complexity: 'Alta', content: { intro: 'Desmontando a caixa.', development: ['Como um 3D vira um papel 2D.', 'Identificar o sólido pela sua planificação.'], examples: [{question: 'Como é a planificação de um cubo?', answer: '6 quadrados em formato de cruz.'}], conclusion: 'Use a imaginação espacial.' } },
     { id: 'p3-3', type: 'practical', title: 'Aula 10 - Prática: Montagem de Sólidos', skill: 'EF06MA17', complexity: 'Média', practicalDescription: 'Distribuir folhas com planificações. Os alunos devem recortar, dobrar e colar para montar Prismas e Pirâmides. Em seguida, contar V, F e A.' },

     { id: 'l3-11', type: 'lesson', title: 'Aula 11 - Polígonos (Formas Planas)', skill: 'EF06MA18', complexity: 'Baixa', content: { intro: 'Figuras fechadas com linhas retas.', development: ['Não pode cruzar nem ter curva.', 'Nomenclatura (Triângulo, Quadrilátero, Pentágono, etc).'], examples: [{question: 'Como chama a figura de 6 lados?', answer: 'Hexágono.'}], conclusion: 'Polígono = muitos ângulos.' } },
     { id: 'l3-12', type: 'lesson', title: 'Aula 12 - Classificação de Triângulos', skill: 'EF06MA19', complexity: 'Média', content: { intro: 'Nem todo triângulo é igual.', development: ['Pelos lados: Equilátero, Isósceles, Escaleno.', 'Pelos ângulos: Acutângulo, Retângulo, Obtusângulo.'], examples: [{question: 'Triângulo com 3 lados iguais?', answer: 'Equilátero.'}], conclusion: 'Lados e ângulos definem o triângulo.' } },
     { id: 'l3-13', type: 'lesson', title: 'Aula 13 - Retas e Seus Tipos', skill: 'EF06MA21', complexity: 'Média', content: { intro: 'A geometria das ruas.', development: ['Concorrentes (cruzam num ponto).', 'Paralelas (nunca se cruzam).', 'Perpendiculares (cruzam em cruz perfeita, $90^{\\circ}$).'], examples: [{question: 'Trilhos de trem são retas o que?', answer: 'Paralelas.'}], conclusion: 'As retas governam o espaço urbano.' } },
     { id: 'p3-4', type: 'practical', title: 'Aula 14 - Prática: Caça aos Polígonos', skill: 'EF06MA18', complexity: 'Baixa', practicalDescription: 'Passeio pela escola. Os alunos devem identificar retas (paralelas, concorrentes) e polígonos na arquitetura escolar, anotando num caderno.' },
     { id: 'ex3-3', type: 'exercise', title: 'Bloco de Exercícios 3 (Geometria)', questions: [{ question: 'Desenhe retas perpendiculares.', answer: 'Sinal de +' }, { question: 'Classifique triângulo com lados 3,4,5.', answer: 'Escaleno.' }] },

     { id: 'l3-16', type: 'lesson', title: 'Aula 15 - Revisão de Álgebra', skill: 'EF06MA14', complexity: 'Média', content: { intro: 'Revisando as balanças.', development: ['O que é igualdade.', 'Resolver problemas com valor desconhecido.'], examples: [], conclusion: 'Dúvidas.' } },
     { id: 'l3-17', type: 'lesson', title: 'Aula 16 - Revisão de Geometria', skill: 'EF06MA17', complexity: 'Média', content: { intro: 'Revisando Formas.', development: ['Prismas x Pirâmides.', 'Polígonos e Retas.'], examples: [], conclusion: 'Prontos para avaliação.' } },

     { 
       id: 'act3-1', type: 'activity', title: 'Atividade Avaliativa 1: Álgebra e Plano', skill: 'Geral', 
       questions: [
         { question: 'Na igualdade $8 + 4 = 10 + X$, qual o valor de $X$?', answer: '$X = 2$.', spaceForWork: true },
         { question: 'Se eu triplicar um número e o resultado for $24$, que número é esse?', answer: '$8$.', spaceForWork: true },
         { question: 'Localize os pontos $(1,2)$ e $(3,4)$ no plano cartesiano.', answer: 'Marcação no papel.', spaceForWork: true },
         { question: 'Qual eixo representa a coordenada vertical?', answer: 'Eixo Y (Ordenadas).', spaceForWork: false },
         { question: 'Se $X + 7 = 15$, quanto vale $X$?', answer: '$X = 8$.', spaceForWork: true },
         { question: 'Escreva as coordenadas da origem do plano cartesiano.', answer: '$(0, 0)$.', spaceForWork: false },
         { question: 'Complete: Se $2 \\times X = 18$, então $X = $ ___', answer: '$X = 9$.', spaceForWork: true },
         { question: 'Ligue os pontos $(0,0)$, $(4,0)$, $(4,3)$ e $(0,3)$. Que figura se forma?', answer: 'Retângulo.', spaceForWork: true },
         { question: 'Na igualdade $Y - 6 = 10$, qual o valor de $Y$?', answer: '$Y = 16$.', spaceForWork: true },
         { question: 'O ponto $(5, 2)$ está mais próximo do eixo $X$ ou do eixo $Y$?', answer: 'Mais próximo do eixo $X$ (distância $2$).', spaceForWork: true }
       ] 
     },
     { 
       id: 'act3-2', type: 'activity', title: 'Atividade Avaliativa 2: Formas e Retas', skill: 'Geral', 
       questions: [
         { question: 'Diferencie um poliedro de um corpo redondo.', answer: 'Poliedro tem faces planas; corpo redondo pode rolar (superfície curva).', spaceForWork: true },
         { question: 'Quantos vértices tem um cubo?', answer: '$8$ vértices.', spaceForWork: false },
         { question: 'Nomeie um triângulo que possui todos os lados de medidas diferentes.', answer: 'Triângulo Escaleno.', spaceForWork: false },
         { question: 'O que são retas concorrentes?', answer: 'Retas que se cruzam em um único ponto.', spaceForWork: true },
         { question: 'Quantas faces tem uma pirâmide de base quadrada?', answer: '$5$ faces (1 base + 4 laterais).', spaceForWork: false },
         { question: 'Classifique o triângulo com lados $5$, $5$ e $8$.', answer: 'Triângulo Isósceles (2 lados iguais).', spaceForWork: false },
         { question: 'Qual polígono tem $6$ lados?', answer: 'Hexágono.', spaceForWork: false },
         { question: 'Qual a diferença entre retas paralelas e perpendiculares?', answer: 'Paralelas nunca se cruzam; perpendiculares se cruzam em $90^\\circ$.', spaceForWork: true },
         { question: 'Um prisma de base triangular tem quantas arestas?', answer: '$9$ arestas.', spaceForWork: false },
         { question: 'Desenhe uma planificação simples de um cubo.', answer: '6 quadrados em formato de cruz.', spaceForWork: true }
       ] 
     },
     { 
       id: 'exam3', type: 'exam', title: 'Prova da Unidade III', skill: 'Geral', 
       questions: [
         { question: 'Descubra o valor de $Y$: $20 - Y = 12$.', answer: '$Y = 8$.', spaceForWork: true },
         { question: 'No par ordenado $(5, 8)$, o número $5$ representa a coordenada de qual eixo?', answer: 'Eixo X (Abscissas).', spaceForWork: false },
         { question: 'Qual a diferença entre Prisma e Pirâmide?', answer: 'Prisma tem 2 bases e faces retangulares. Pirâmide tem 1 base e faces triangulares.', spaceForWork: true },
         { question: 'Um polígono de 5 lados é chamado de?', answer: 'Pentágono.', spaceForWork: false },
         { question: 'Escreva a relação de retas que nunca se tocam.', answer: 'Retas paralelas.', spaceForWork: false },
         { question: 'Como chamamos o triângulo com 3 lados iguais?', answer: 'Triângulo Equilátero.', spaceForWork: false },
         { question: 'Desenhe e cite o nome do polígono regular com 4 lados.', answer: 'Quadrado.', spaceForWork: true },
         { question: 'Qual figura espacial é formada a partir de $6$ quadrados iguais?', answer: 'Cubo (Hexaedro Regular).', spaceForWork: true },
         { question: 'A igualdade $X + 5 = 5 + 3$ é verdadeira para qual valor de X?', answer: '$X = 3$.', spaceForWork: true },
         { question: 'Duas ruas que se cruzam formando um ângulo de $90^{\\circ}$ são representadas por retas?', answer: 'Perpendiculares.', spaceForWork: false }
       ] 
     }
  ]
};
