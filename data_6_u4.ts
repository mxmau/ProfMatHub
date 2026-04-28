import { Unit } from './types.ts';

export const unit4: Unit = {
  id: 'u4',
  title: 'Unidade IV: Grandezas, Medidas e Estatística',
  dateRange: '30 Set - 15 Dez',
  description: 'Comprimento, Massa, Tempo, Área, Volume, e Tratamento de Informação.',
  color: 'bg-red-100 border-red-300 text-red-800',
  bnccSkills: [
    'EF06MA24: Medidas de comprimento, massa e capacidade.',
    'EF06MA25: Medidas de tempo.',
    'EF06MA28: Plantas baixas e escalas.',
    'EF06MA29: Área e perímetro.',
    'EF06MA31: Probabilidade.',
    'EF06MA32: Gráficos e tabelas estatísticas  items: [
     { id: 'l4-1', type: 'lesson', title: 'Aula 01 - Medidas de Comprimento', skill: 'EF06MA24', complexity: 'Baixa', content: { intro: 'O quão longo é isso?', development: ['Unidade padrão: Metro ($m$).', 'Múltiplos (km) e Submúltiplos (cm, mm).', 'A régua e a fita métrica.'], examples: [{question: 'Quantos centímetros tem em 1 metro?', answer: '$100cm$.'}], conclusion: 'Medir é comparar grandezas.' } },
     { id: 'l4-2', type: 'lesson', title: 'Aula 02 - Conversão de Comprimento', skill: 'EF06MA24', complexity: 'Média', content: { intro: 'Trocando as réguas.', development: ['Andar com a vírgula para a direita (multiplicar).', 'Andar com a vírgula para a esquerda (dividir).'], examples: [{question: 'Converta $2,5m$ para centímetros.', answer: '$250cm$.'}], conclusion: 'Para unidades menores, multiplique. Maiores, divida.' } },
     { id: 'p4-1', type: 'practical', title: 'Aula 03 - Prática: Medindo a Sala', skill: 'EF06MA24', complexity: 'Baixa', practicalDescription: 'Usando trenas, os alunos devem medir o comprimento, largura e porta da sala de aula, anotando as medidas em m e convertendo para cm e mm no caderno.' },
     
     { id: 'l4-4', type: 'lesson', title: 'Aula 04 - Medidas de Massa', skill: 'EF06MA24', complexity: 'Baixa', content: { intro: 'O peso das coisas.', development: ['Grama ($g$), Quilograma ($kg$), Tonelada ($t$).', 'Relação de $1000$ em $1000$.'], examples: [{question: 'Quantos $kg$ tem $1$ tonelada?', answer: '$1000 kg$.'}], conclusion: 'Kilo significa mil.' } },
     { id: 'l4-5', type: 'lesson', title: 'Aula 05 - Medidas de Capacidade', skill: 'EF06MA24', complexity: 'Baixa', content: { intro: 'O espaço dos líquidos.', development: ['Litro ($L$) e Mililitro ($mL$).', 'Relação: $1 L = 1000 mL$.'], examples: [{question: 'Quantos $mL$ tem em $1,5L$?', answer: '$1500mL$.'}], conclusion: 'Garrafas e remédios usam essa grandeza.' } },
     { id: 'ex4-1', type: 'exercise', title: 'Aula 06 - Bloco de Exercícios 1: Comprimento, Massa e Volume', questions: [{ question: 'Converta $3km$ em metros.', answer: '$3000m$' }, { question: 'Converta $2500g$ em kg.', answer: '$2,5kg$' }] },
     
     { id: 'l4-7', type: 'lesson', title: 'Aula 07 - Medidas de Tempo', skill: 'EF06MA25', complexity: 'Média', content: { intro: 'O relógio não para.', development: ['Base sexagesimal (60).', '1 hora = 60 min, 1 min = 60 s.', 'Leitura de relógios analógicos e digitais.'], examples: [{question: 'Quantos minutos tem $2$ horas?', answer: '$120$ minutos.'}], conclusion: 'O tempo muda a cada 60.' } },
     { id: 'l4-8', type: 'lesson', title: 'Aula 08 - Intervalos de Tempo', skill: 'EF06MA25', complexity: 'Alta', content: { intro: 'Quanto tempo passou?', development: ['Subtração de horários.', 'Emprestar horas (1 hora vira 60 min, não 10!).'], examples: [{question: 'De 10h45 até 12h15 passaram quanto tempo?', answer: '1h30min.'}], conclusion: 'Cuidado extra ao subtrair tempo.' } },
     { id: 'p4-2', type: 'practical', title: 'Aula 09 - Prática: O Chef de Cozinha', skill: 'EF06MA24', complexity: 'Média', practicalDescription: 'Os alunos trazem receitas culinárias. Devem calcular os tempos totais de forno/preparo e converter as medidas dos ingredientes (ex: 500g para 0,5kg).' },
     
     { id: 'l4-10', type: 'lesson', title: 'Aula 10 - Perímetro de Polígonos', skill: 'EF06MA29', complexity: 'Baixa', content: { intro: 'O contorno da cerca.', development: ['Soma de todos os lados.', 'Polígonos regulares (lados iguais).'], examples: [{question: 'Perímetro de um quadrado de lado $5cm$.', answer: '$5+5+5+5 = 20cm$.'}], conclusion: 'Perímetro = Comprimento da Borda.' } },
     { id: 'l4-11', type: 'lesson', title: 'Aula 11 - Área de Retângulos e Quadrados', skill: 'EF06MA29', complexity: 'Média', content: { intro: 'O preenchimento do piso.', development: ['Medida de superfície ($m^2$).', 'Fórmula da Área do Retângulo: Base $\\times$ Altura.'], examples: [{question: 'Área de sala 4m por 5m.', answer: '$20m^2$.'}], conclusion: 'Área = Preenchimento (multiplica 2 lados).' } },
     { id: 'ex4-2', type: 'exercise', title: 'Aula 12 - Bloco de Exercícios 2: Área e Perímetro', questions: [{ question: 'Área de um quadrado de lado $6m$.', answer: '$36m^2$' }, { question: 'Perímetro do mesmo quadrado.', answer: '$24m$' }] },
     
     { id: 'l4-13', type: 'lesson', title: 'Aula 13 - Introdução a Escala', skill: 'EF06MA28', complexity: 'Alta', content: { intro: 'O mundo no papel.', development: ['Escala: Desenho vs Tamanho Real.', 'Relação de proporção simples (ex: $1:100$).'], examples: [{question: 'Escala 1:100. Uma parede de 4m no desenho tem quantos cm?', answer: '$4cm$.'}], conclusion: 'Escala é uma fração que diminui a realidade.' } },
     { id: 'p4-3', type: 'practical', title: 'Aula 14 - Prática: A Planta Baixa da Sala', skill: 'EF06MA28', complexity: 'Alta', practicalDescription: 'Com as medidas da Aula 03, desenhar uma planta baixa da sala de aula em papel milimetrado usando escala.' },
     { id: 'l4-15', type: 'lesson', title: 'Aula 15 - Resolução de Problemas com Medidas', skill: 'EF06MA29', complexity: 'Alta', content: { intro: 'Aplicando no mundo real.', development: ['Interpretar textos longos.', 'Mistura de unidades em um problema só.'], examples: [{question: 'Reformar quadra $10\\times20m$. R$ 5 o metro. Custo?', answer: 'Área = $200$. Custo = $R$ 1000$.'}], conclusion: 'Organize os dados antes de calcular.' } },
     
     { id: 'l4-16', type: 'lesson', title: 'Aula 16 - Introdução à Probabilidade', skill: 'EF06MA31', complexity: 'Média', content: { intro: 'Qual a chance?', development: ['Espaço Amostral (tudo o que pode acontecer).', 'Evento (o que eu quero).'], examples: [{question: 'Ao lançar um dado, quais os resultados possíveis?', answer: '1, 2, 3, 4, 5, 6.'}], conclusion: 'Conheça todas as opções antes de apostar.' } },
     { id: 'l4-17', type: 'lesson', title: 'Aula 17 - Cálculo Simples de Probabilidade', skill: 'EF06MA31', complexity: 'Alta', content: { intro: 'A matemática da sorte.', development: ['Fórmula: (O que eu quero) / (Total de opções).', 'Transformar a fração em porcentagem.'], examples: [{question: 'Qual a chance de tirar par no dado?', answer: '$3/6 = 1/2 = 50\\%$.'}], conclusion: 'A probabilidade é sempre entre 0 e 100%.' } },
     { id: 'ex4-3', type: 'exercise', title: 'Aula 18 - Bloco de Exercícios 3: Escala e Probabilidade', questions: [{ question: 'Lançar uma moeda, chance de Cara?', answer: '$1/2$ ou $50\\%$' }, { question: 'Escala 1:10. Desenho de 5cm. Real?', answer: '$50cm$' }] },
     
     { id: 'l4-19', type: 'lesson', title: 'Aula 19 - Estatística: Gráficos de Barras', skill: 'EF06MA32', complexity: 'Baixa', content: { intro: 'Desenhar números para comparar rápido.', development: ['Eixos X e Y.', 'Leitura de valores em barras verticais e horizontais.'], examples: [{question: 'Se a barra A é o dobro da B, o que significa?', answer: 'A tem o dobro da quantidade.'}], conclusion: 'Um bom gráfico não precisa de texto.' } },
     { id: 'l4-20', type: 'lesson', title: 'Aula 20 - Estatística: Gráficos de Setores (Pizza)', skill: 'EF06MA32', complexity: 'Média', content: { intro: 'As partes do todo.', development: ['Relação do gráfico de pizza com porcentagem.', '100% é a pizza inteira.'], examples: [{question: 'No gráfico de pizza, a metade é que porcentagem?', answer: '$50\\%$.'}], conclusion: 'Perfeito para ver fatias de um orçamento.' } },
     { id: 'p4-4', type: 'practical', title: 'Aula 21 - Prática: A Pesquisa da Turma', skill: 'EF06MA32', complexity: 'Alta', practicalDescription: 'Alunos fazem uma pesquisa na sala ("Sabor de sorvete favorito"), montam uma tabela de frequências no quadro e, depois, desenham um gráfico de barras com os resultados.' },
     
     { id: 'l4-22', type: 'lesson', title: 'Aula 22 - Leitura de Tabelas Complexas', skill: 'EF06MA32', complexity: 'Média', content: { intro: 'A planilha da vida.', development: ['Tabelas de dupla entrada (linhas e colunas).', 'Cruzamento de dados.'], examples: [{question: 'Para que serve a linha de "Total"?', answer: 'Para checar se todos foram contados.'}], conclusion: 'Tabela é o esqueleto da informação.' } },
     { id: 'l4-23', type: 'lesson', title: 'Aula 23 - Revisão: Grandezas e Geometria', skill: 'EF06MA24', complexity: 'Média', content: { intro: 'Revisando as fórmulas.', development: ['Conversões e Áreas.'], examples: [], conclusion: 'Dúvidas e treino.' } },
     { id: 'l4-24', type: 'lesson', title: 'Aula 24 - Revisão: Probabilidade e Estatística', skill: 'EF06MA31', complexity: 'Média', content: { intro: 'Revisando a chance.', development: ['Frações de probabilidade e Leitura Gráfica.'], examples: [], conclusion: 'Prontos para as avaliações finais.' } },

     { 
       id: 'act4-1', type: 'activity', title: 'Atividade Avaliativa 1: Medidas e Geometria', skill: 'Geral', 
       questions: [
         { question: 'Transforme $5,4 km$ em metros.', answer: '$5400 m$.', spaceForWork: true },
         { question: 'Calcule o perímetro de um retângulo de $8cm$ por $3cm$.', answer: '$22 cm$.', spaceForWork: true },
         { question: 'Qual a área de um quadrado de $7m$ de lado?', answer: '$49 m^2$.', spaceForWork: true },
         { question: 'Uma aula começou $07h30$ e durou $50$ minutos. Que horas terminou?', answer: '$08h20$.', spaceForWork: true },
         { question: 'Converta $2500 g$ em $kg$.', answer: '$2,5 kg$.', spaceForWork: true },
         { question: 'Quantos $mL$ há em $3,2 L$?', answer: '$3200 mL$.', spaceForWork: true },
         { question: 'Um terreno retangular tem $15m$ por $8m$. Qual o perímetro da cerca necessária?', answer: '$46 m$.', spaceForWork: true },
         { question: 'Converta $3$ horas em minutos.', answer: '$180$ minutos.', spaceForWork: true },
         { question: 'Uma piscina tem $2m$ de comprimento, $1,5m$ de largura e $0,5m$ de profundidade. Qual a área do fundo?', answer: '$3 m^2$.', spaceForWork: true },
         { question: 'Se em um mapa (escala 1:200) uma parede mede $3cm$, qual o tamanho real?', answer: '$600 cm = 6 m$.', spaceForWork: true }
       ] 
     },
     { 
       id: 'act4-2', type: 'activity', title: 'Atividade Avaliativa 2: Tratamento de Dados', skill: 'Geral', 
       questions: [
         { question: 'Ao lançar um dado de $6$ faces, qual a chance de sair o número $5$?', answer: '$1/6$.', spaceForWork: true },
         { question: 'Em um saquinho há $3$ bolas vermelhas e $2$ azuis. Chance de tirar azul?', answer: '$2/5$.', spaceForWork: true },
         { question: 'Por que o gráfico de pizza (setores) é ideal para representar $100\\%$ do total?', answer: 'Pois o círculo completo representa o todo ($100\\%$).', spaceForWork: true },
         { question: 'Um dado é lançado uma vez. Qual a probabilidade de sair um número par?', answer: '$3/6 = 1/2$.', spaceForWork: true },
         { question: 'Em uma pesquisa, $15$ de $50$ alunos preferem futebol. Qual a porcentagem?', answer: '$30\\%$.', spaceForWork: true },
         { question: 'Complete: gráfico de ______ é bom para comparar quantidades.', answer: 'Barras.', spaceForWork: false },
         { question: 'Uma moeda é lançada $2$ vezes. Quantos resultados possíveis existem?', answer: '$4$ resultados (CC, CK, KC, KK).', spaceForWork: true },
         { question: 'O que é espaço amostral?', answer: 'O conjunto de todos os resultados possíveis de um experimento.', spaceForWork: true },
         { question: 'Em uma urna há $4$ bolas brancas e $6$ pretas. Qual a probabilidade de tirar branca?', answer: '$4/10 = 2/5$.', spaceForWork: true },
         { question: 'Qual tipo de gráfico é melhor para mostrar a evolução de um dado ao longo do tempo?', answer: 'Gráfico de linha.', spaceForWork: false }
       ] 
     },
     { 
       id: 'exam4', type: 'exam', title: 'Prova da Unidade IV', skill: 'Geral', 
       questions: [
         { question: 'Converta $1200 mL$ para Litros.', answer: '$1,2 L$.', spaceForWork: true },
         { question: 'Um terreno tem $10m$ de largura e $25m$ de comprimento. Qual a área?', answer: '$250 m^2$.', spaceForWork: true },
         { question: 'Um carro andou $2h15min$ e parou. Depois andou mais $1h50min$. Qual o tempo total de viagem?', answer: '$4h05min$.', spaceForWork: true },
         { question: 'Se em um mapa (escala 1:1000) a distância é $5cm$, qual a real?', answer: '$5000 cm = 50 m$.', spaceForWork: true },
         { question: 'Lançando um dado, qual a probabilidade de sair um número ímpar?', answer: '$3/6$ ou $1/2$ ($50\\%$).', spaceForWork: true },
         { question: 'Qual o perímetro de um triângulo equilátero de lado $6cm$?', answer: '$18 cm$.', spaceForWork: true },
         { question: 'Quantos gramas existem em $3,5 kg$?', answer: '$3500 g$.', spaceForWork: true },
         { question: 'Um gráfico mostra 40 alunos. $25\\%$ tem olhos azuis. Quantos são?', answer: '$10$ alunos.', spaceForWork: true },
         { question: 'Desenhe um retângulo e escreva a fórmula para calcular sua área.', answer: 'Área = Base $\\times$ Altura.', spaceForWork: true },
         { question: 'Um filme começou às $19h45$ e terminou às $21h30$. Quanto tempo durou?', answer: '$1h45min$.', spaceForWork: true }
       ] 
     }
  ]
};
