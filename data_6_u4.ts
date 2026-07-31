import { Unit } from './types.ts';

export const unit4: Unit = {
  "id": "u4",
  "title": "Unidade IV: Decimais, Grandezas e Medidas",
  "dateRange": "05 Out - 30 Nov",
  "description": "Notas resumidas para a 4ª unidade: conteudos da Unidade II, Aulas 15-23, e da Unidade IV, Aulas 01-15. AT1 em decimais, AT2 em grandezas e medidas, e prova de todos os conteudos em 30/11.",
  "color": "bg-red-100 border-red-300 text-red-800",
  "bnccSkills": [
    "EF06MA08: representacao, comparacao e ordenacao de numeros decimais.",
    "EF06MA11: operacoes e problemas com numeros decimais.",
    "EF06MA13: porcentagens simples.",
    "EF06MA24: medidas de comprimento, massa e capacidade.",
    "EF06MA25: medidas de tempo e intervalos.",
    "EF06MA28: plantas baixas e escalas.",
    "EF06MA29: area e perimetro."
  ],
  "items": [
    {
      "id": "l4-1",
      "type": "lesson",
      "title": "Aula 01 - Decimais: leitura e valor posicional",
      "skill": "EF06MA08",
      "duration": "05/10 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Os numeros decimais aparecem em dinheiro, medidas e resultados de medidas.",
        "development": [
          "Reconhecer parte inteira e parte decimal.",
          "Ler decimos, centesimos e milesimos.",
          "Relacionar cada algarismo ao seu valor posicional."
        ],
        "examples": [
          {
            "question": "Como se le 2,35?",
            "answer": "Dois inteiros e trinta e cinco centesimos."
          }
        ],
        "conclusion": "A virgula separa a parte inteira da parte decimal.",
        "classwork": "Quadro de valor posicional e leitura de precos do cotidiano.",
        "homework": "Escrever por extenso 0,7; 1,25; 3,408.",
        "alignment": "Retomada da Unidade II, Aula 15. Missao 10, p. 81-88."
      }
    },
    {
      "id": "l4-2",
      "type": "lesson",
      "title": "Aula 02 - Fracao decimal e numero decimal",
      "skill": "EF06MA08",
      "duration": "06/10 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Uma fracao com denominador 10, 100 ou 1000 pode ser escrita como decimal.",
        "development": [
          "Transformar decimos, centesimos e milesimos em decimais.",
          "Transformar decimais exatos em fracoes decimais.",
          "Manter a equivalencia ao acrescentar zeros."
        ],
        "examples": [
          {
            "question": "Escreva 3/100 em decimal.",
            "answer": "0,03."
          }
        ],
        "conclusion": "Fracao decimal e numero decimal sao duas representacoes do mesmo valor.",
        "classwork": "Cartoes de pareamento entre fracoes e decimais.",
        "homework": "Converter 6/10, 45/100 e 8/1000.",
        "alignment": "Retomada da Unidade II, Aula 16. Missao 10, p. 81-88."
      }
    },
    {
      "id": "l4-3",
      "type": "lesson",
      "title": "Aula 03 - Comparacao, ordenacao e reta numerica",
      "skill": "EF06MA08",
      "duration": "07/10 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Comparar decimais exige observar primeiro a parte inteira e depois as casas decimais.",
        "development": [
          "Completar casas com zeros sem mudar o valor.",
          "Usar >, < e =.",
          "Localizar decimais entre inteiros na reta numerica."
        ],
        "examples": [
          {
            "question": "Qual e maior: 0,5 ou 0,45?",
            "answer": "0,50 > 0,45."
          }
        ],
        "conclusion": "Zeros a direita da parte decimal ajudam a comparar.",
        "classwork": "Reta de 0 a 2 e ordenacao de cartoes decimais.",
        "homework": "Ordenar 0,8; 0,08; 0,75; 1,2.",
        "alignment": "Retomada da Unidade II, Aula 17. Missao 10, p. 81-88."
      }
    },
    {
      "id": "l4-4",
      "type": "lesson",
      "title": "Aula 04 - Adicao e subtracao de decimais",
      "skill": "EF06MA11",
      "duration": "08/10 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Operar decimais fica mais seguro quando as virgulas ficam alinhadas.",
        "development": [
          "Alinhar unidades, decimos e centesimos.",
          "Completar casas com zeros.",
          "Estimar o resultado antes de calcular."
        ],
        "examples": [
          {
            "question": "Calcule 3,45 + 12,2.",
            "answer": "15,65."
          }
        ],
        "conclusion": "Na adicao e na subtracao, a virgula deve ficar na mesma coluna.",
        "classwork": "Problemas de compras e troco no quadro.",
        "homework": "Calcular 8,5 - 2,75 e 4,08 + 1,7.",
        "alignment": "Retomada da Unidade II, Aula 18. Missao 14, p. 113-120."
      }
    },
    {
      "id": "l4-5",
      "type": "lesson",
      "title": "Aula 05 - Multiplicacao de decimais",
      "skill": "EF06MA11",
      "duration": "09/10 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "A multiplicacao de decimais pode representar preco por quantidade e medidas repetidas.",
        "development": [
          "Multiplicar sem as virgulas.",
          "Contar as casas decimais dos fatores.",
          "Conferir a ordem de grandeza do resultado."
        ],
        "examples": [
          {
            "question": "Calcule 1,2 x 0,3.",
            "answer": "0,36."
          }
        ],
        "conclusion": "Depois da multiplicacao, as casas decimais dos fatores determinam a posicao da virgula.",
        "classwork": "Tabela de precos por quantidade.",
        "homework": "Resolver 2,5 x 1,4 e 0,6 x 0,08.",
        "alignment": "Retomada da Unidade II, Aula 19. Missao 14, p. 113-120."
      }
    },
    {
      "id": "l4-6",
      "type": "lesson",
      "title": "Aula 06 - Divisao de decimais",
      "skill": "EF06MA11",
      "duration": "12/10 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Dividir decimais permite encontrar preco por unidade, medida por parte e quantidade de grupos.",
        "development": [
          "Tornar o divisor inteiro quando necessario.",
          "Usar zeros para continuar a divisao.",
          "Relacionar dividendo, divisor e quociente."
        ],
        "examples": [
          {
            "question": "Calcule 3 / 0,5.",
            "answer": "6."
          }
        ],
        "conclusion": "Na divisao, podemos multiplicar dividendo e divisor por 10, 100 ou 1000 sem alterar o quociente.",
        "classwork": "Divisao de valores de uma lista de compras.",
        "homework": "Resolver 6 / 0,5 e 12,6 / 3.",
        "alignment": "Retomada da Unidade II, Aula 20. Missao 14, p. 113-120."
      }
    },
    {
      "id": "l4-7",
      "type": "lesson",
      "title": "Aula 07 - Problemas com decimais e dinheiro",
      "skill": "EF06MA11",
      "duration": "13/10 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Os dados de um problema precisam ser organizados antes da operacao.",
        "development": [
          "Identificar unidade, quantidade e pergunta.",
          "Escolher adicao, subtracao, multiplicacao ou divisao.",
          "Escrever a resposta com unidade monetaria."
        ],
        "examples": [
          {
            "question": "Duas compras custam R$ 12,50 e R$ 7,80. Qual o total?",
            "answer": "R$ 20,30."
          }
        ],
        "conclusion": "A operacao correta nasce da leitura do contexto.",
        "classwork": "Mercadinho matematico com precos decimais.",
        "homework": "Criar e resolver um problema de compra com tres itens.",
        "alignment": "Retomada da Unidade II, Aula 21. Missao 14, p. 113-120."
      }
    },
    {
      "id": "l4-8",
      "type": "lesson",
      "title": "Aula 08 - Porcentagem como fracao e decimal",
      "skill": "EF06MA13",
      "duration": "14/10 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Porcentagens simples podem ser relacionadas a fracoes de denominador 100 e a decimais.",
        "development": [
          "Relacionar 10%, 25%, 50% e 100% a fracoes e decimais.",
          "Calcular porcentagens simples por decomposicao.",
          "Distinguir valor decimal de porcentagem."
        ],
        "examples": [
          {
            "question": "Quanto e 10% de 250?",
            "answer": "25."
          }
        ],
        "conclusion": "Porcentagem e uma forma de representar uma parte de cada 100.",
        "classwork": "Quadro de equivalencias entre porcentagem, fracao e decimal.",
        "homework": "Calcular 25% de 80 e escrever 0,4 como porcentagem.",
        "alignment": "Retomada da Unidade II, Aulas 22-23. Missao 18, p. 145-152."
      }
    },
    {
      "id": "l4-9",
      "type": "lesson",
      "title": "Aula 09 - Revisao dirigida para a AT1",
      "skill": "EF06MA08/11/13",
      "duration": "15/10 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "A revisao organiza os procedimentos que serao avaliados.",
        "development": [
          "Leitura e representacao de decimais.",
          "Comparacao, operacoes e problemas.",
          "Porcentagens simples em situacoes reais."
        ],
        "examples": [],
        "conclusion": "Conferir a virgula, a unidade e a coerencia do resultado.",
        "classwork": "Estacoes de revisao com um exemplo de cada habilidade.",
        "homework": "Refazer os dois itens em que houve mais dificuldade.",
        "alignment": "Revisao antes da AT1; foco principal em decimais."
      }
    },
    {
      "id": "act4-1",
      "type": "activity",
      "title": "AT1 - Decimais",
      "skill": "Geral",
      "duration": "16/10 | 50 min",
      "questions": [
        {
          "question": "Escreva por extenso o numero 3,08.",
          "answer": "Tres inteiros e oito centesimos.",
          "spaceForWork": false
        },
        {
          "question": "Transforme 7/10 em numero decimal.",
          "answer": "0,7.",
          "spaceForWork": false
        },
        {
          "question": "Compare: 0,6 ___ 0,56.",
          "answer": "0,6 > 0,56.",
          "spaceForWork": false
        },
        {
          "question": "Calcule: 4,75 + 2,8.",
          "answer": "7,55.",
          "spaceForWork": true
        },
        {
          "question": "Calcule: 9,2 - 3,45.",
          "answer": "5,75.",
          "spaceForWork": true
        },
        {
          "question": "Calcule: 1,2 x 0,3.",
          "answer": "0,36.",
          "spaceForWork": true
        },
        {
          "question": "Calcule: 3 / 0,5.",
          "answer": "6.",
          "spaceForWork": true
        },
        {
          "question": "Uma compra custa R$ 12,50 e outra custa R$ 7,80. Qual o total?",
          "answer": "R$ 20,30.",
          "spaceForWork": true
        },
        {
          "question": "Calcule 25% de 80.",
          "answer": "20.",
          "spaceForWork": true
        },
        {
          "question": "Ordene do menor para o maior: 0,9; 0,09; 0,99.",
          "answer": "0,09; 0,9; 0,99.",
          "spaceForWork": true
        }
      ]
    },
    {
      "id": "l4-10",
      "type": "lesson",
      "title": "Aula 10 - Medidas de comprimento (IV.01)",
      "skill": "EF06MA24",
      "duration": "19/10 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "As grandezas ajudam a descrever e organizar situacoes reais.",
        "development": [
          "Metro como unidade principal.",
          "Quilometro, centimetro e milimetro.",
          "Escolha da unidade adequada ao objeto."
        ],
        "examples": [],
        "conclusion": "Uma medida precisa de unidade e instrumento adequados.",
        "classwork": "Medir objetos da sala com regua e fita metrica.",
        "homework": "Listar tres objetos e a unidade mais adequada.",
        "alignment": "Missao 13, p. 105-112."
      }
    },
    {
      "id": "l4-11",
      "type": "lesson",
      "title": "Aula 11 - Conversao de comprimento (IV.02)",
      "skill": "EF06MA24",
      "duration": "20/10 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "As grandezas ajudam a descrever e organizar situacoes reais.",
        "development": [
          "Relacao entre m, cm, mm e km.",
          "Multiplicar ou dividir por 10, 100 e 1000.",
          "Conferir se a unidade final faz sentido."
        ],
        "examples": [],
        "conclusion": "Converter e reescrever uma mesma medida sem mudar seu valor.",
        "classwork": "Tabela de conversoes com medidas da escola.",
        "homework": "Converter 2,5 m para cm e 3500 m para km.",
        "alignment": "Missao 13, p. 105-112."
      }
    },
    {
      "id": "l4-12",
      "type": "practical",
      "title": "Aula 12 - Pratica: medindo a sala (IV.03)",
      "skill": "EF06MA24",
      "duration": "21/10 | 50 min",
      "complexity": "Média",
      "practicalDescription": "Medir comprimento, largura, porta e quadro; registrar em m e cm."
    },
    {
      "id": "l4-13",
      "type": "lesson",
      "title": "Aula 13 - Medidas de massa (IV.04)",
      "skill": "EF06MA24",
      "duration": "22/10 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "As grandezas ajudam a descrever e organizar situacoes reais.",
        "development": [
          "Grama, quilograma e tonelada representam massas em escalas diferentes.",
          "Relacionar kg e g.",
          "Escolher a unidade conforme o objeto."
        ],
        "examples": [],
        "conclusion": "Em conversoes de massa, 1 kg = 1000 g.",
        "classwork": "Classificar objetos por massa estimada.",
        "homework": "Converter 2,5 kg para g e 3500 g para kg.",
        "alignment": "Missao 13, p. 105-112."
      }
    },
    {
      "id": "l4-14",
      "type": "lesson",
      "title": "Aula 14 - Medidas de capacidade (IV.05)",
      "skill": "EF06MA24",
      "duration": "23/10 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "As grandezas ajudam a descrever e organizar situacoes reais.",
        "development": [
          "Litro e mililitro medem a capacidade de recipientes.",
          "Relacionar L e mL.",
          "Diferenciar capacidade de massa."
        ],
        "examples": [],
        "conclusion": "Em conversoes de capacidade, 1 L = 1000 mL.",
        "classwork": "Comparar embalagens e estimar capacidades.",
        "homework": "Converter 1,75 L para mL e 2500 mL para L.",
        "alignment": "Missao 13, p. 105-112."
      }
    },
    {
      "id": "l4-15",
      "type": "lesson",
      "title": "Aula 15 - Exercicios de conversao (IV.06)",
      "skill": "EF06MA24",
      "duration": "26/10 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "As grandezas ajudam a descrever e organizar situacoes reais.",
        "development": [
          "Conversoes aparecem juntas em problemas do cotidiano.",
          "Organizar dados em tabela.",
          "Usar estimativa para detectar erro."
        ],
        "examples": [],
        "conclusion": "A unidade final deve responder ao que o problema pergunta.",
        "classwork": "Lista curta com comprimento, massa e capacidade.",
        "homework": "Corrigir e explicar um erro de conversao.",
        "alignment": "Missao 13, p. 105-112."
      }
    },
    {
      "id": "l4-16",
      "type": "lesson",
      "title": "Aula 16 - Medidas de tempo (IV.07)",
      "skill": "EF06MA25",
      "duration": "27/10 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "As grandezas ajudam a descrever e organizar situacoes reais.",
        "development": [
          "O tempo usa relacoes de 60.",
          "Hora, minuto e segundo.",
          "Leitura de horarios analogicos e digitais."
        ],
        "examples": [],
        "conclusion": "1 h = 60 min e 1 min = 60 s.",
        "classwork": "Montar uma linha do tempo da rotina escolar.",
        "homework": "Converter 3 h para minutos e 150 min para horas e minutos.",
        "alignment": "Aplicacao de grandezas; atividade autoral."
      }
    },
    {
      "id": "l4-17",
      "type": "lesson",
      "title": "Aula 17 - Intervalos de tempo (IV.08)",
      "skill": "EF06MA25",
      "duration": "28/10 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "As grandezas ajudam a descrever e organizar situacoes reais.",
        "development": [
          "Calcular duracao exige comparar horario inicial e final.",
          "Quando necessario, trocar 1 h por 60 min.",
          "Verificar se o resultado e plausivel."
        ],
        "examples": [],
        "conclusion": "A subtracao de horarios usa base 60, nao base 10.",
        "classwork": "Resolver intervalos da entrada, recreio e saida.",
        "homework": "Calcular o intervalo de 9h45 a 12h15.",
        "alignment": "Aplicacao de grandezas; atividade autoral."
      }
    },
    {
      "id": "l4-18",
      "type": "practical",
      "title": "Aula 18 - Pratica: medidas em uma receita (IV.09)",
      "skill": "EF06MA24/25",
      "duration": "29/10 | 50 min",
      "complexity": "Média",
      "practicalDescription": "Adaptar uma receita e calcular tempo total e medidas."
    },
    {
      "id": "l4-19",
      "type": "lesson",
      "title": "Aula 19 - Perimetro de poligonos (IV.10)",
      "skill": "EF06MA29",
      "duration": "30/10 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "As grandezas ajudam a descrever e organizar situacoes reais.",
        "development": [
          "Perimetro e o comprimento do contorno.",
          "Somar todos os lados.",
          "Usar unidade linear."
        ],
        "examples": [],
        "conclusion": "Perimetro mede a borda, por isso sua unidade nao e quadrada.",
        "classwork": "Medir e calcular o contorno de figuras em malha.",
        "homework": "Calcular o perimetro de um retangulo de 8 cm por 3 cm.",
        "alignment": "Missao 9, p. 73-80."
      }
    },
    {
      "id": "l4-20",
      "type": "lesson",
      "title": "Aula 20 - Area de retangulos e quadrados (IV.11)",
      "skill": "EF06MA29",
      "duration": "02/11 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "As grandezas ajudam a descrever e organizar situacoes reais.",
        "development": [
          "Area mede a superficie ocupada.",
          "Contar quadradinhos e usar base x altura.",
          "Escrever unidade quadrada."
        ],
        "examples": [],
        "conclusion": "Area de retangulo = comprimento x largura.",
        "classwork": "Cobrir figuras com quadradinhos e comparar areas.",
        "homework": "Calcular a area de uma sala de 5 m por 4 m.",
        "alignment": "Missao 9, p. 73-80."
      }
    },
    {
      "id": "l4-21",
      "type": "lesson",
      "title": "Aula 21 - Exercicios de area e perimetro (IV.12)",
      "skill": "EF06MA29",
      "duration": "03/11 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "As grandezas ajudam a descrever e organizar situacoes reais.",
        "development": [
          "Area e perimetro respondem perguntas diferentes.",
          "Uma figura pode ter mesmo perimetro e area diferente.",
          "Conferir a unidade da resposta."
        ],
        "examples": [],
        "conclusion": "Area preenche; perimetro contorna.",
        "classwork": "Quadro comparativo em malha quadriculada.",
        "homework": "Para um quadrado de lado 6 m, calcule area e perimetro.",
        "alignment": "Missao 9, p. 73-80."
      }
    },
    {
      "id": "l4-22",
      "type": "lesson",
      "title": "Aula 22 - Introducao a escala (IV.13)",
      "skill": "EF06MA28",
      "duration": "04/11 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "As grandezas ajudam a descrever e organizar situacoes reais.",
        "development": [
          "Escala relaciona desenho e tamanho real.",
          "Ler a razao 1:n.",
          "Manter a mesma unidade antes de comparar."
        ],
        "examples": [],
        "conclusion": "Na escala 1:100, 1 cm no desenho representa 100 cm reais.",
        "classwork": "Interpretar planta simples de uma sala.",
        "homework": "Em escala 1:100, 4 cm representam 4 m.",
        "alignment": "Missao 8, p. 65-72."
      }
    },
    {
      "id": "l4-23",
      "type": "practical",
      "title": "Aula 23 - Pratica: planta baixa da sala (IV.14)",
      "skill": "EF06MA28",
      "duration": "05/11 | 50 min",
      "complexity": "Média",
      "practicalDescription": "Desenhar a sala em escala e indicar porta, quadro e carteiras."
    },
    {
      "id": "l4-24",
      "type": "lesson",
      "title": "Aula 24 - Problemas com medidas (IV.15)",
      "skill": "EF06MA24/25/28/29",
      "duration": "06/11 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "As grandezas ajudam a descrever e organizar situacoes reais.",
        "development": [
          "Problemas reais misturam unidades, tempo, area, perimetro e escala.",
          "Separar dados, pergunta e operacoes.",
          "Apresentar resultado com unidade."
        ],
        "examples": [],
        "conclusion": "Resolver exige selecionar grandezas e procedimentos, nao apenas aplicar uma formula.",
        "classwork": "Problema integrado de reforma de uma sala ou quadra.",
        "homework": "Resolver um problema com duas grandezas e justificar as unidades.",
        "alignment": "Missoes 8, 9 e 13; p. 65-80 e 105-112."
      }
    },
    {
      "id": "l4-25",
      "type": "lesson",
      "title": "Aula 25 - Problemas integrados de conversao",
      "skill": "EF06MA24",
      "duration": "09/11 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Conversoes sao ferramentas para comparar medidas e tomar decisoes.",
        "development": [
          "Selecionar unidade de resposta.",
          "Usar tabela de equivalencias.",
          "Estimar antes e conferir depois."
        ],
        "examples": [
          {
            "question": "Converta 2,4 L para mL.",
            "answer": "2400 mL."
          }
        ],
        "conclusion": "A unidade escolhida precisa combinar com a pergunta.",
        "classwork": "Oficina com estações de comprimento, massa e capacidade.",
        "homework": "Resolver dois problemas e indicar a unidade usada.",
        "alignment": "Consolidacao da Missao 13, p. 105-112."
      }
    },
    {
      "id": "l4-26",
      "type": "lesson",
      "title": "Aula 26 - Problemas de tempo, massa e capacidade",
      "skill": "EF06MA24/25",
      "duration": "10/11 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Uma rotina ou receita pode reunir varias grandezas.",
        "development": [
          "Ler medidas em uma tabela.",
          "Somar intervalos de tempo.",
          "Converter antes de comparar."
        ],
        "examples": [
          {
            "question": "Quanto e 2h35 + 1h45?",
            "answer": "4h20."
          }
        ],
        "conclusion": "Grandezas diferentes nao devem ser somadas sem organizar suas unidades.",
        "classwork": "Resolver uma situacao de preparo e transporte.",
        "homework": "Criar uma tabela com tres grandezas e seus valores.",
        "alignment": "Aplicacao das Aulas IV.04-IV.09."
      }
    },
    {
      "id": "l4-27",
      "type": "lesson",
      "title": "Aula 27 - Oficina Acerta: Missao 13",
      "skill": "EF06MA24",
      "duration": "11/11 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "A Missao 13 retoma conversoes de unidades em problemas contextualizados.",
        "development": [
          "Selecionar exercicios de conversao.",
          "Explicar o fator usado.",
          "Corrigir com justificativa."
        ],
        "examples": [
          {
            "question": "Em 3,5 kg, quantos gramas ha?",
            "answer": "3500 g."
          }
        ],
        "conclusion": "Converter e explicar o fator de multiplicacao ou divisao.",
        "classwork": "Selecionar e resolver os itens essenciais da Missao 13, p. 105-112.",
        "homework": "Registrar uma estrategia de conversao no caderno.",
        "alignment": "Acerta Brasil: Missao 13, p. 105-112."
      }
    },
    {
      "id": "l4-28",
      "type": "lesson",
      "title": "Aula 28 - Oficina Acerta: Missao 9",
      "skill": "EF06MA29",
      "duration": "12/11 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "A Missao 9 diferencia contorno e preenchimento de figuras planas.",
        "development": [
          "Separar perguntas de area e perimetro.",
          "Escolher unidade linear ou quadrada.",
          "Comparar estrategias de resolucao."
        ],
        "examples": [
          {
            "question": "Qual a area de um retangulo 7 m por 3 m?",
            "answer": "21 m2."
          }
        ],
        "conclusion": "Area e perimetro sao medidas diferentes e devem ser nomeadas corretamente.",
        "classwork": "Selecionar e resolver os itens essenciais da Missao 9, p. 73-80.",
        "homework": "Refazer um item trocando area por perimetro.",
        "alignment": "Acerta Brasil: Missao 9, p. 73-80."
      }
    },
    {
      "id": "l4-29",
      "type": "lesson",
      "title": "Aula 29 - Revisao especifica para a AT2",
      "skill": "EF06MA24/25/28/29",
      "duration": "13/11 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "A revisao da AT2 retoma todas as grandezas e medidas trabalhadas.",
        "development": [
          "Conversoes de comprimento, massa e capacidade.",
          "Tempo e intervalos.",
          "Area, perimetro e escala."
        ],
        "examples": [],
        "conclusion": "Antes de responder, identifique a grandeza e a unidade pedida.",
        "classwork": "Circuito de quatro estações de revisao.",
        "homework": "Refazer os itens com erro e escrever a unidade correta.",
        "alignment": "Revisao antes da AT2; foco nas Aulas IV.01-IV.15."
      }
    },
    {
      "id": "act4-2",
      "type": "activity",
      "title": "AT2 - Grandezas e Medidas",
      "skill": "Geral",
      "duration": "16/11 | 50 min",
      "questions": [
        {
          "question": "Converta 2,5 m para centimetros.",
          "answer": "250 cm.",
          "spaceForWork": false
        },
        {
          "question": "Converta 3,2 kg para gramas.",
          "answer": "3200 g.",
          "spaceForWork": false
        },
        {
          "question": "Converta 1,75 L para mililitros.",
          "answer": "1750 mL.",
          "spaceForWork": false
        },
        {
          "question": "Uma atividade comeca as 8h35 e termina as 10h20. Qual a duracao?",
          "answer": "1h45min.",
          "spaceForWork": true
        },
        {
          "question": "Calcule o perimetro de um retangulo de 8 cm por 3 cm.",
          "answer": "22 cm.",
          "spaceForWork": true
        },
        {
          "question": "Calcule a area de um retangulo de 5 m por 4 m.",
          "answer": "20 m2.",
          "spaceForWork": true
        },
        {
          "question": "Em uma escala 1:100, 3 cm no desenho representam quantos metros reais?",
          "answer": "3 m.",
          "spaceForWork": false
        },
        {
          "question": "Um quadrado de lado 6 m tem qual area e qual perimetro?",
          "answer": "Area 36 m2 e perimetro 24 m.",
          "spaceForWork": true
        },
        {
          "question": "Uma receita usa 500 g de farinha e 750 mL de agua. Qual medida de massa e qual de capacidade aparecem?",
          "answer": "500 g e 750 mL.",
          "spaceForWork": true
        },
        {
          "question": "Explique a diferenca entre area e perimetro.",
          "answer": "Area mede a superficie; perimetro mede o contorno.",
          "spaceForWork": true
        }
      ]
    },
    {
      "id": "l4-30",
      "type": "lesson",
      "title": "Aula 30 - Reensino: conversoes",
      "skill": "EF06MA24",
      "duration": "17/11 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Os erros de conversao mostram qual relacao precisa ser retomada.",
        "development": [
          "Rever tabelas de comprimento, massa e capacidade.",
          "Usar setas e fatores de conversao.",
          "Explicar o procedimento oralmente."
        ],
        "examples": [],
        "conclusion": "Uma conversao correta conserva o valor da medida.",
        "classwork": "Grupos de reensino conforme os erros da AT2.",
        "homework": "Uma conversao de cada grandeza trabalhada.",
        "alignment": "Reensino apos a AT2."
      }
    },
    {
      "id": "l4-31",
      "type": "lesson",
      "title": "Aula 31 - Reensino: area, perimetro e escala",
      "skill": "EF06MA28/29",
      "duration": "18/11 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Desenhos ajudam a diferenciar contorno, superficie e reducao em escala.",
        "development": [
          "Identificar o que a pergunta solicita.",
          "Usar malha quadriculada.",
          "Conferir unidade e proporcao."
        ],
        "examples": [],
        "conclusion": "Desenhar antes de calcular pode tornar o problema mais claro.",
        "classwork": "Oficina com malha quadriculada e planta baixa.",
        "homework": "Corrigir uma solucao que confundiu area e perimetro.",
        "alignment": "Reensino apos a AT2; Missoes 8 e 9."
      }
    },
    {
      "id": "l4-32",
      "type": "lesson",
      "title": "Aula 32 - Reensino: tempo, massa e capacidade",
      "skill": "EF06MA24/25",
      "duration": "19/11 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Grandezas aparecem em sequencias e rotinas do cotidiano.",
        "development": [
          "Organizar horarios em linha do tempo.",
          "Converter massa e capacidade.",
          "Usar unidades adequadas."
        ],
        "examples": [],
        "conclusion": "O resultado precisa ser possivel no contexto.",
        "classwork": "Problemas diferenciados por nivel de apoio.",
        "homework": "Resolver um intervalo de tempo e uma conversao.",
        "alignment": "Reensino apos a AT2."
      }
    },
    {
      "id": "l4-33",
      "type": "lesson",
      "title": "Aula 33 - Resolucao de problemas e correcao",
      "skill": "EF06MA24/25/28/29",
      "duration": "20/11 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "Resolver problemas envolve selecionar informacoes e justificar escolhas.",
        "development": [
          "Sublinhar dados e pergunta.",
          "Planejar operacoes.",
          "Verificar resultado e unidade."
        ],
        "examples": [],
        "conclusion": "Uma resposta matematica completa inclui numero, unidade e justificativa quando necessaria.",
        "classwork": "Problemas mistos em duplas e correcao comentada.",
        "homework": "Reescrever uma resolucao com mais clareza.",
        "alignment": "Consolidacao de todas as habilidades da AT2."
      }
    },
    {
      "id": "l4-34",
      "type": "lesson",
      "title": "Aula 34 - Revisao final: decimais",
      "skill": "EF06MA08/11/13",
      "duration": "23/11 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "A prova retoma decimais, operacoes e porcentagens simples.",
        "development": [
          "Representar e comparar decimais.",
          "Operar com virgula alinhada.",
          "Resolver problemas monetarios e de porcentagem."
        ],
        "examples": [],
        "conclusion": "Estimar e conferir evitam erros mecanicos.",
        "classwork": "Lista final curta com devolutiva imediata.",
        "homework": "Refazer os itens em que ainda ha duvida.",
        "alignment": "Revisao final para a prova; Missoes 10, 14 e 18."
      }
    },
    {
      "id": "l4-35",
      "type": "lesson",
      "title": "Aula 35 - Revisao final: grandezas e medidas",
      "skill": "EF06MA24/25/28/29",
      "duration": "24/11 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "A revisao organiza formulas, conversoes e unidades.",
        "development": [
          "Comprimento, massa, capacidade e tempo.",
          "Area, perimetro e escala.",
          "Leitura de problemas."
        ],
        "examples": [],
        "conclusion": "Escolha a grandeza antes de escolher a operacao.",
        "classwork": "Mapa de procedimentos e questoes-modelo.",
        "homework": "Montar uma ficha com formulas e equivalencias.",
        "alignment": "Revisao final para a prova; Missoes 8, 9 e 13."
      }
    },
    {
      "id": "l4-36",
      "type": "lesson",
      "title": "Aula 36 - Revisao final integrada",
      "skill": "EF06MA08/11/13/24/25/28/29",
      "duration": "25/11 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "A prova exigira a leitura de diferentes representacoes e unidades.",
        "development": [
          "Misturar decimais e medidas.",
          "Interpretar tabelas simples de dados.",
          "Justificar a unidade e a estrategia."
        ],
        "examples": [],
        "conclusion": "A escolha do procedimento deve responder ao contexto.",
        "classwork": "Rodizio de questoes com autocorrecao orientada.",
        "homework": "Selecionar tres questoes para estudar novamente.",
        "alignment": "Revisao final de todos os conteudos."
      }
    },
    {
      "id": "l4-37",
      "type": "lesson",
      "title": "Aula 37 - Simulado e correcao",
      "skill": "Geral",
      "duration": "26/11 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "O simulado permite identificar o que ainda precisa de atencao.",
        "development": [
          "Resolver sem ajuda inicial.",
          "Classificar os erros por habilidade.",
          "Corrigir usando procedimento completo."
        ],
        "examples": [],
        "conclusion": "Errar na revisao ajuda a decidir o que retomar antes da prova.",
        "classwork": "Simulado curto e correcao dialogada.",
        "homework": "Revisar apenas os itens ainda inconsistentes.",
        "alignment": "Preparacao para a prova."
      }
    },
    {
      "id": "l4-38",
      "type": "lesson",
      "title": "Aula 38 - Checklist e orientacao para a prova",
      "skill": "Geral",
      "duration": "27/11 | 50 min",
      "complexity": "Média",
      "content": {
        "intro": "O checklist organiza conhecimentos e cuidados para a avaliacao.",
        "development": [
          "Ler comandos com atencao.",
          "Registrar calculos e unidades.",
          "Conferir resultados antes de entregar."
        ],
        "examples": [],
        "conclusion": "Uma boa prova mostra o raciocinio e a resposta final.",
        "classwork": "Checklist coletivo e resolucao de duvidas finais.",
        "homework": "Organizar material e revisar a ficha pessoal.",
        "alignment": "Revisao final imediatamente antes da prova."
      }
    },
    {
      "id": "exam4",
      "type": "exam",
      "title": "Prova do 4º Bimestre - 30/11",
      "skill": "Geral",
      "duration": "30/11 | 50 min",
      "questions": [
        {
          "question": "Escreva 2,35 por extenso.",
          "answer": "Dois inteiros e trinta e cinco centesimos.",
          "spaceForWork": false
        },
        {
          "question": "Calcule 4,8 + 2,35.",
          "answer": "7,15.",
          "spaceForWork": true
        },
        {
          "question": "Calcule 1,2 x 0,5.",
          "answer": "0,6.",
          "spaceForWork": true
        },
        {
          "question": "Calcule 25% de 120.",
          "answer": "30.",
          "spaceForWork": true
        },
        {
          "question": "Converta 3,5 kg para gramas.",
          "answer": "3500 g.",
          "spaceForWork": false
        },
        {
          "question": "Uma viagem durou de 7h45 a 10h20. Qual foi a duracao?",
          "answer": "2h35min.",
          "spaceForWork": true
        },
        {
          "question": "Calcule a area de um terreno de 12 m por 8 m.",
          "answer": "96 m2.",
          "spaceForWork": true
        },
        {
          "question": "Calcule o perimetro do mesmo terreno.",
          "answer": "40 m.",
          "spaceForWork": true
        },
        {
          "question": "Em escala 1:200, uma parede mede 4 cm no desenho. Qual o tamanho real?",
          "answer": "8 m.",
          "spaceForWork": true
        },
        {
          "question": "Explique a diferenca entre area e perimetro e escreva a unidade de cada uma.",
          "answer": "Area mede superficie em unidade quadrada; perimetro mede contorno em unidade linear.",
          "spaceForWork": true
        }
      ]
    }
  ]
};
