const fs = require('fs');
let content = fs.readFileSync('src/utils/generators.ts', 'utf8');
content = content.replace(
    /\\begin\{flushleft\}\n\s*\\textbf\{Disciplina:\} Matemática \\hfill \\textbf\{Ano\/Turma:\} \\underline\{\\hspace\{3cm\}\} \\\\\[0\.2cm\]\n\s*\\textbf\{Data:\} \\underline\{\\hspace\{3cm\}\} \\hfill \\textbf\{Professor\(a\):\} \$\{params\.teacher\} \\\\\[0\.2cm\]\n\s*\\textbf\{\$\{params\.isIndividual \? 'Aluno\(a\):' : 'Equipe:'\}\} \\underline\{\\hspace\{12cm\}\} \\\\\[0\.5cm\]\n\s*\\hrule\n\\end\{flushleft\}/,
    `\\begin{flushleft}
    \\textbf{Componente Curricular:} Matemática \\hfill \\textbf{Data:} \\underline{\\hspace{4cm}} \\\\[0.2cm]
    \\textbf{Professor(a):} \${params.teacher} \\hfill \\textbf{Ano/Turma:} \\underline{\\hspace{6cm}} \\\\[0.2cm]
    
    \\textbf{\${params.isIndividual ? 'Aluno(a):' : 'Equipe:'}} \\underline{\\hspace{12cm}} \\\\[0.5cm]
    
    \\hrule
\\end{flushleft}`
);
fs.writeFileSync('src/utils/generators.ts', content);
console.log('Updated generators.ts');
