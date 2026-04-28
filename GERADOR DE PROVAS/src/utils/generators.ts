import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, ImageRun } from 'docx';
import { saveAs } from 'file-saver';
import { ExamData, ExamParams } from '../services/gemini';

export function generateLatex(params: ExamParams, data: ExamData): string {
  const actualSchool = params.school === 'Outra' ? params.customSchool || 'Escola' : params.school;
  const municipio = params.school === 'Escola Municipal Tiradentes' ? 'São Lourenço da Mata' : 'Igarassu';

  const escapeLatex = (text: string) => {
    if (!text) return '';
    // Escape % that are not preceded by \
    return text.replace(/(^|[^\\])%/g, '$1\\%');
  };

  let latex = `\\documentclass[12pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[portuguese]{babel}
\\usepackage{amsmath, amssymb, geometry, graphicx, tikz, enumitem, tabularx}
\\geometry{margin=2cm}

\\begin{document}

% ============ CABEÇALHO PERSONALIZADO ============
\\begin{center}
`;

  if (params.school === 'Escola Municipal Tiradentes') {
    latex += `    \\renewcommand{\\arraystretch}{1.5}
    \\noindent
    \\begin{tabularx}{\\textwidth}{|p{3cm}|X|p{4cm}|p{4cm}|}
    \\hline
    \\centering % LOGO AQUI SE HOUVER
    & 
    \\multicolumn{${params.isGraded ? '2' : '3'}}{c|}{
        \\begin{tabular}{c}
            \\textbf{PREFEITURA MUNICIPAL DE SÃO LOURENÇO DA MATA} \\\\
            \\textbf{SECRETARIA DE EDUCAÇÃO} \\\\
            \\textbf{ESCOLA MUNICIPAL TIRADENTES}
        \\end{tabular}
    } ${params.isGraded ? '& \n    \\centering \\textbf{NOTA} \\vspace{1cm}' : ''} \\tabularnewline
    \\hline
    \\multicolumn{3}{|l|}{\\textbf{${params.isIndividual ? 'ALUNOS :' : 'EQUIPE :'}}} & \\textbf{DATA:} \\hspace{0.5cm} / \\hspace{0.5cm} / 2026 \\tabularnewline
    \\hline
    \\multicolumn{2}{|l|}{\\textbf{COMPONENTE CURRICULAR:} ${params.subject?.toUpperCase() || 'MATEMÁTICA'}} & \\textbf{ANO/TURMA:} & \\textbf{PROF:} ${params.teacher?.toUpperCase()} \\tabularnewline
    \\hline
    \\multicolumn{4}{|c|}{\\textbf{${params.activityTitle?.toUpperCase() || 'ATIVIDADE 1'}}} \\tabularnewline
    \\hline
    \\end{tabularx}
\\end{center}

\\vspace{0.5cm}
`;
  } else {
    latex += `    {\\Large \\textbf{PREFEITURA DE ${municipio.toUpperCase()}}}\\\\[0.2cm]
    {\\Large \\textbf{SECRETARIA MUNICIPAL DE EDUCAÇÃO}}\\\\[0.2cm]
    {\\Large \\textbf{${actualSchool.toUpperCase()}}}\\\\[0.5cm]
    \\hrule
    \\vspace{0.5cm}
    {\\textbf{AVALIAÇÃO / FICHA DE EXERCÍCIOS}}\\\\
    {\\Large \\textbf{${params.activityTitle.toUpperCase()}}}\\\\
    \\vspace{0.3cm}
    \\hrule
\\end{center}

\\vspace{0.5cm}

\\begin{flushleft}
    \\textbf{Componente Curricular:} ${params.subject || 'Matemática'} \\hfill \\textbf{Ano/Turma:} \\underline{\\hspace{3cm}} \\\\[0.2cm]
    \\textbf{Data:} \\underline{\\hspace{3cm}} \\hfill \\textbf{Professor(a):} ${params.teacher} \\\\[0.2cm]
    \\textbf{Valor:} ${params.value} pontos \\hfill \\\\[0.5cm]
    
    \\textbf{${params.isIndividual ? 'Aluno(a):' : 'Equipe:'}} \\underline{\\hspace{8cm}} ${params.isGraded ? `\\hfill \\textbf{Nota:} \\underline{\\hspace{2cm}}` : ''} \\\\[0.5cm]
    
    \\hrule
\\end{flushleft}
`;
  }

  if (params.isGraded) {
    latex += `
\\vspace{0.5cm}

\\noindent
\\fbox{
\\begin{minipage}{\\dimexpr\\textwidth-2\\fboxsep-2\\fboxrule\\relax}
\\begin{center}\\textbf{REGRAS}\\end{center}
\\begin{minipage}[t]{0.48\\textwidth}
1. Preencha os seus nomes e sobrenomes da dupla.\\\\
2. As questões que exigirem cálculos e/ou justificativas só serão consideradas corretas com os mesmos.\\\\
3. Utilizar letra legível (o que não for compreendido não poderá ser considerado).
\\end{minipage}
\\hfill
\\begin{minipage}[t]{0.48\\textwidth}
4. Não é permitido consulta de material escrito, calculadora ou quaisquer equipamento eletrônico. Sob pena de ter sua nota zerada.\\\\
5. Qualquer ato de indisciplina, desrespeito ao professor ou aos demais colegas ou cópia de respostas de outros colegas será penalizado, a critério do professor, com a nota zero.
\\end{minipage}
\\vspace{0.2cm}
\\end{minipage}
}

\\vspace{0.5cm}
`;
  } else {
    latex += `
\\vspace{0.5cm}

\\textbf{INSTRUÇÕES:}
\\begin{itemize}
    \\item Leia atentamente todas as questões;
    \\item Mostre seus cálculos e raciocínios;
    \\item Respostas sem justificativa podem não receber pontuação completa;
    \\item Organize sua resolução de forma clara e legível.
\\end{itemize}

\\vspace{0.5cm}
\\hrule
\\vspace{0.5cm}
`;
  }

  latex += `
% CORPO DA PROVA
`;

  data.questions.forEach((q, index) => {
    latex += `\\noindent \\textbf{Questão ${index + 1}} (Tipo: ${q.type === 'direta' ? 'Direta' : 'Contextualizada'}) \\\\\n`;
    latex += `${escapeLatex(q.text)}\n`;
    
    if (q.options && q.options.length > 0) {
      latex += `\\begin{enumerate}[label=\\alph*)]\n`;
      q.options.forEach(opt => {
        latex += `    \\item ${escapeLatex(opt.replace(/^[a-eA-E][)\.]\s*/, ''))}\n`;
      });
      latex += `\\end{enumerate}\n\\vspace{0.5cm}\n\n`;
    } else {
      latex += `\\vspace{3cm}\n\n`;
    }
  });

  latex += `\\newpage\n`;
  latex += `\\section*{Gabarito e Mapa Pedagógico}\n\n`;

  data.questions.forEach((q, index) => {
    latex += `\\noindent \\textbf{Questão ${index + 1}}\\\\\n`;
    latex += `\\textbf{Resposta:} ${escapeLatex(q.answer)}\\\\\n`;
    latex += `\\textbf{Resolução:} ${escapeLatex(q.explanation)}\\\\\n`;
    latex += `\\textbf{Metadados:}\n`;
    latex += `\\begin{itemize}\n`;
    if (q.metadata.habilidadeIgarassu) latex += `    \\item Habilidade Igarassu: ${q.metadata.habilidadeIgarassu}\n`;
    if (q.metadata.descritorMatrizLuz) latex += `    \\item Descritor Matriz da Luz: ${q.metadata.descritorMatrizLuz}\n`;
    latex += `    \\item Nível: ${q.metadata.nivelComplexidade}\n`;
    latex += `    \\item Unidade Temática: ${q.metadata.unidadeTematica}\n`;
    latex += `    \\item Objeto de Conhecimento: ${q.metadata.objetoConhecimento}\n`;
    latex += `\\end{itemize}\n\n`;
  });

  latex += `\\end{document}`;
  return latex;
}

export async function generateDocx(params: ExamParams, data: ExamData) {
  const actualSchool = params.school === 'Outra' ? params.customSchool || 'Escola' : params.school;
  const municipio = params.school === 'Escola Municipal Tiradentes' ? 'São Lourenço da Mata' : 'Igarassu';

  let logoData: Uint8Array | null = null;
  let logoType: any = 'png';

  if (params.logoBase64) {
    try {
      if (params.logoBase64.startsWith('http')) {
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(params.logoBase64)}`;
        const response = await fetch(proxyUrl);
        const arrayBuffer = await response.arrayBuffer();
        logoData = new Uint8Array(arrayBuffer);
        logoType = params.logoBase64.toLowerCase().endsWith('.jpg') || params.logoBase64.toLowerCase().endsWith('.jpeg') ? 'jpeg' : 'png';
      } else {
        logoData = Uint8Array.from(atob(params.logoBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "")), c => c.charCodeAt(0));
        logoType = (params.logoBase64.match(/^data:image\/(png|jpeg|jpg);base64,/)?.[1] || 'png') as any;
      }
    } catch (error) {
      console.error("Failed to load logo for docx", error);
    }
  }

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 12, color: "000000" },
            bottom: { style: BorderStyle.SINGLE, size: 12, color: "000000" },
            left: { style: BorderStyle.SINGLE, size: 12, color: "000000" },
            right: { style: BorderStyle.SINGLE, size: 12, color: "000000" },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 12, color: "000000" },
            insideVertical: { style: BorderStyle.SINGLE, size: 12, color: "000000" },
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 15, type: WidthType.PERCENTAGE },
                  rowSpan: 2,
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: logoData ? [
                        new ImageRun({
                          data: logoData,
                          transformation: {
                            width: 60,
                            height: 60,
                          },
                          type: logoType,
                        })
                      ] : [],
                    })
                  ],
                }),
                new TableCell({
                  columnSpan: 3,
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: `PREFEITURA DE ${municipio.toUpperCase()}`, bold: true })],
                      alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph({
                      children: [new TextRun({ text: "SECRETARIA MUNICIPAL DE EDUCAÇÃO", bold: true })],
                      alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph({
                      children: [new TextRun({ text: actualSchool.toUpperCase(), bold: true })],
                      alignment: AlignmentType.CENTER,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  columnSpan: 3,
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: params.activityTitle.toUpperCase(), bold: true })],
                      alignment: AlignmentType.CENTER,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  columnSpan: 4,
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: params.isIndividual ? "ALUNO(A): " : "EQUIPE: ", bold: true })],
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: "Ano/Turma: ", bold: true }),
                      ],
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: "Data:      /     /     ", bold: true }),
                      ],
                      alignment: AlignmentType.CENTER,
                    }),
                  ],
                }),
                new TableCell({
                  columnSpan: 2,
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: "Professor: ", bold: true }),
                        new TextRun({ text: params.teacher }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            ...(params.isGraded ? [
              new TableRow({
                children: [
                  new TableCell({
                    columnSpan: 3,
                    children: [new Paragraph({ text: "" })],
                  }),
                  new TableCell({
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Nota: ", bold: true })],
                      }),
                    ],
                  }),
                ],
              })
            ] : []),
          ],
        }),
        new Paragraph({ text: "" }),
        ...(params.isGraded ? [
          new Paragraph({ children: [new TextRun({ text: "REGRAS", bold: true })], alignment: AlignmentType.CENTER }),
          new Paragraph({ text: "1. Preencha os seus nomes e sobrenomes da dupla." }),
          new Paragraph({ text: "2. As questões que exigirem cálculos e/ou justificativas só serão consideradas corretas com os mesmos." }),
          new Paragraph({ text: "3. Utilizar letra legível (o que não for compreendido não poderá ser considerado)." }),
          new Paragraph({ text: "4. Não é permitido consulta de material escrito, calculadora ou quaisquer equipamento eletrônico. Sob pena de ter sua nota zerada." }),
          new Paragraph({ text: "5. Qualquer ato de indisciplina, desrespeito ao professor ou aos demais colegas ou cópia de respostas de outros colegas será penalizado, a critério do professor, com a nota zero." }),
          new Paragraph({ text: "" }),
        ] : []),
        
        ...data.questions.flatMap((q, index) => {
          const elements = [
            new Paragraph({ children: [new TextRun({ text: `Questão ${index + 1}`, bold: true })] }),
            new Paragraph({ text: q.text }),
          ];
          
          if (q.options && q.options.length > 0) {
            const labels = ['a)', 'b)', 'c)', 'd)'];
            q.options.forEach((opt, i) => {
              elements.push(new Paragraph({ text: `${labels[i]} ${opt.replace(/^[a-eA-E][)\.]\s*/, '')}`, indent: { left: 720 } }));
            });
            elements.push(new Paragraph({ text: "" }));
          } else {
            elements.push(new Paragraph({ text: "\n\n\n\n" }));
          }
          
          return elements;
        }),

        ...(params.includeMap ? [
          new Paragraph({ text: "", pageBreakBefore: true }),
          new Paragraph({
            text: "Gabarito e Mapa Pedagógico",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ text: "" }),

          ...data.questions.flatMap((q, index) => {
            const elements = [
              new Paragraph({ children: [new TextRun({ text: `Questão ${index + 1}`, bold: true })] }),
              new Paragraph({ text: `Resposta: ${q.answer}` }),
              new Paragraph({ text: `Resolução: ${q.explanation}` }),
              new Paragraph({ children: [new TextRun({ text: "Metadados Curriculares:", bold: true })] }),
            ];

            if (q.metadata.habilidadeIgarassu) {
              elements.push(new Paragraph({ text: `- Igarassu: ${q.metadata.habilidadeIgarassu}`, indent: { left: 720 } }));
            }
            if (q.metadata.descritorMatrizLuz) {
              elements.push(new Paragraph({ text: `- Matriz da Luz: ${q.metadata.descritorMatrizLuz}`, indent: { left: 720 } }));
            }
            elements.push(new Paragraph({ text: `- Nível: ${q.metadata.nivelComplexidade}`, indent: { left: 720 } }));
            elements.push(new Paragraph({ text: `- Unidade Temática: ${q.metadata.unidadeTematica}`, indent: { left: 720 } }));
            elements.push(new Paragraph({ text: `- Objeto de Conhecimento: ${q.metadata.objetoConhecimento}`, indent: { left: 720 } }));
            elements.push(new Paragraph({ text: "" }));

            return elements;
          }),
        ] : []),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `prova_matematica_${params.grade.replace('º', '')}ano.docx`);
}
