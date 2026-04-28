import React, { useState, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  BookOpen, ChevronLeft, Calendar as CalendarIcon, FileText, CheckCircle, 
  PenTool, GraduationCap, Share2, BarChart3, Layout, Clock, 
  AlertCircle, ChevronRight, Calculator, Shapes, ListChecks, Printer, Eye,
  Download, FileSpreadsheet, School, MapPin, ClipboardCheck, AlertTriangle
} from 'lucide-react';

import { Item, Unit, Grade } from './types';
import { igarassu as LOGO_IGARASSU, saoLourenco as LOGO_SAO_LOURENCO } from './logos';

import { DATA } from './data';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

// Register PWA Service Worker
import { registerSW } from 'virtual:pwa-register';

if ('serviceWorker' in navigator) {
  registerSW({ immediate: true });
}

const GeradorProvasApp = lazy(() => import('./GERADOR DE PROVAS/src/App'));
const GradeHorarioApp = lazy(() => import('./GRADE DE HORÁRIO/App'));

type ModuleId = 'hub' | 'notas' | 'gerador' | 'grade';
type SchoolId = 'igarassu' | 'saolourenco';

interface SchoolInfo {
  id: SchoolId;
  name: string;
  city: string;
  municipio: string;
  headerLine1: string;
  headerLine2: string;
  headerLine3: string;
  logo: string;
}

const SCHOOLS: Record<SchoolId, SchoolInfo> = {
  igarassu: {
    id: 'igarassu',
    name: 'Escola Ecilda Ramos de Souza',
    city: 'Igarassu - PE',
    municipio: 'Igarassu',
    headerLine1: 'PREFEITURA DE IGARASSU',
    headerLine2: 'SECRETARIA MUNICIPAL DE EDUCAÇÃO',
    headerLine3: 'Escola Ecilda Ramos de Souza',
    logo: LOGO_IGARASSU,
  },
  saolourenco: {
    id: 'saolourenco',
    name: 'Escola Municipal Tiradentes',
    city: 'São Lourenço da Mata - PE',
    municipio: 'São Lourenço da Mata',
    headerLine1: 'PREFEITURA MUNICIPAL DE SÃO LOURENÇO DA MATA',
    headerLine2: 'SECRETARIA DE EDUCAÇÃO',
    headerLine3: 'ESCOLA MUNICIPAL TIRADENTES',
    logo: LOGO_SAO_LOURENCO,
  },
};

// Helper to render LaTeX math inside text
const renderTextWithLatex = (text: string) => {
  if (!text || !text.includes('$')) return text;
  const parts = text.split('$');
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return <InlineMath key={index} math={part} />;
    }
    return <span key={index}>{part}</span>;
  });
};


// --- COMPONENTS ---

const Header = ({ title, subtitle, onBack }: { title: string, subtitle?: string, onBack?: () => void }) => (
  <div className="bg-indigo-600 text-white p-4 shadow-md sticky top-0 z-20 print:hidden">
    <div className="max-w-4xl mx-auto flex items-center">
      {onBack && (
        <button onClick={onBack} aria-label="Voltar" title="Voltar" className="mr-3 p-1 hover:bg-indigo-500 rounded-full transition">
          <ChevronLeft size={24} />
        </button>
      )}
      <div>
        <h1 className="text-xl font-bold">{title}</h1>
        {subtitle && <p className="text-xs text-indigo-200">{subtitle}</p>}
      </div>
    </div>
  </div>
);

// CSV Export Logic
const generateAndDownloadCSV = (grade: Grade) => {
  const headers = [
    'Ano/Série',
    'Unidade',
    'Período da Unidade',
    'Semana Estimada',
    'Tipo',
    'Título/Tema',
    'Habilidade BNCC',
    'Complexidade',
    'Resumo do Conteúdo/Questões'
  ];

  const rows: string[] = [];

  // Helper to escape CSV fields
  const escapeCsv = (str: string) => {
    if (!str) return '';
    const stringValue = String(str);
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  grade.units.forEach(unit => {
    let itemIndex = 0;
    unit.items.forEach(item => {
      // Exclude exams as requested
      if (item.type === 'exam') return;

      itemIndex++;
      // Estimate week number (approx 4 lessons per week)
      const weekNum = Math.ceil(itemIndex / 4);

      let contentSummary = '';
      if (item.content) {
        contentSummary = `${item.content.intro} ${item.content.development.join(' ')}`;
      } else if (item.practicalDescription) {
        contentSummary = item.practicalDescription;
      } else if (item.questions) {
        contentSummary = item.questions.map(q => q.question).join(' | ');
      }

      const row = [
        grade.title,
        unit.title,
        unit.dateRange,
        `Semana ${weekNum}`,
        item.type === 'lesson' ? 'Aula Teórica' : item.type === 'practical' ? 'Prática' : item.type === 'exercise' ? 'Exercício' : item.type,
        item.title,
        item.skill || '',
        item.complexity || '',
        contentSummary
      ].map(escapeCsv).join(',');

      rows.push(row);
    });
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Planejamento_${grade.id}_Ano_Matematica_2026.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// ... (UnitOverview and Calendar2026 remain unchanged) ...
// --- NEW COMPONENT: UNIT OVERVIEW ---
const UnitOverview = ({ unit }: { unit: Unit }) => {
  const lessonCount = unit.items.filter(i => i.type === 'lesson').length;
  const practicalCount = unit.items.filter(i => i.type === 'practical').length;
  const examCount = unit.items.filter(i => i.type === 'exam' || i.type === 'exercise' || i.type === 'activity').length;
  
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-xs uppercase font-bold mb-1">Total de Itens</div>
          <div className="text-3xl font-bold text-indigo-600">{lessonCount + practicalCount + examCount}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-xs uppercase font-bold mb-1">Aulas Teóricas</div>
          <div className="text-3xl font-bold text-blue-600">{lessonCount}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-xs uppercase font-bold mb-1">Práticas</div>
          <div className="text-3xl font-bold text-purple-600">{practicalCount}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-xs uppercase font-bold mb-1">Avaliações</div>
          <div className="text-3xl font-bold text-red-600">{examCount}</div>
        </div>
      </div>
      
      <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
        <h3 className="text-lg font-bold text-indigo-900 mb-2">Resumo da Unidade</h3>
        <p className="text-indigo-800 leading-relaxed mb-4">{unit.description}</p>
        
        {unit.bnccSkills && unit.bnccSkills.length > 0 && (
          <div className="mt-4 pt-4 border-t border-indigo-200">
            <h4 className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-3">Habilidades Trabalhadas (BNCC/IGPE)</h4>
            <ul className="grid gap-2">
              {unit.bnccSkills.map((skill, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-indigo-800 bg-white p-2 rounded border border-indigo-100">
                  <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
                  <span>{skill}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

// Simple Calendar Component Helper
const MonthCalendar: React.FC<{ year: number, month: number, getDayStatus: (d: number) => { color: string, title?: string } | null }> = ({ year, month, getDayStatus }) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay(); // 0 = Sunday
  const monthName = new Date(year, month).toLocaleString('pt-BR', { month: 'long' });

  const days = [];
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 h-full">
      <h4 className="font-bold text-center capitalize mb-2 text-gray-700">{monthName}</h4>
      <div className="grid grid-cols-7 text-xs text-center text-gray-400 mb-1">
        <div>D</div><div>S</div><div>T</div><div>Q</div><div>Q</div><div>S</div><div>S</div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-sm">
        {days.map((d, idx) => {
          if (!d) return <div key={idx}></div>;
          const status = getDayStatus(d);
          return (
            <div 
              key={idx} 
              title={status?.title}
              className={`
                aspect-square flex items-center justify-center rounded-full text-xs
                ${status ? `${status.color} text-white font-bold shadow-sm` : 'text-gray-600'}
              `}
            >
              {d}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Calendar2026 = ({ currentUnitId, grade }: { currentUnitId: string, grade: Grade }) => {
  // Brazilian Holidays 2026
  const HOLIDAYS_2026 = [
    { d: 1, m: 0, name: 'Confraternização Universal' },
    { d: 17, m: 1, name: 'Carnaval' },
    { d: 3, m: 3, name: 'Sexta-feira Santa' },
    { d: 21, m: 3, name: 'Tiradentes' },
    { d: 1, m: 4, name: 'Dia do Trabalho' },
    { d: 4, m: 5, name: 'Corpus Christi' },
    { d: 7, m: 8, name: 'Independência do Brasil' },
    { d: 12, m: 9, name: 'N. Sra. Aparecida' },
    { d: 2, m: 10, name: 'Finados' },
    { d: 15, m: 10, name: 'Proclamação da República' },
    { d: 25, m: 11, name: 'Natal' }
  ];

  // Helper to parse "10 Fev - 15 Abr"
  const parseRange = (rangeStr: string) => {
    const monthsMap: Record<string, number> = { 'Jan': 0, 'Fev': 1, 'Mar': 2, 'Abr': 3, 'Mai': 4, 'Jun': 5, 'Jul': 6, 'Ago': 7, 'Set': 8, 'Out': 9, 'Nov': 10, 'Dez': 11 };
    const parts = rangeStr.split(' - ');
    if (parts.length !== 2) return null;
    
    const parseDate = (s: string) => {
      const [d, m] = s.split(' ');
      return new Date(2026, monthsMap[m], parseInt(d));
    };

    return { start: parseDate(parts[0]), end: parseDate(parts[1]) };
  };

  // Pre-process unit ranges
  const unitRanges = grade.units.map(u => {
    const range = parseRange(u.dateRange);
    // Extract base color (e.g. 'bg-blue-100' -> 'bg-blue-500')
    const baseColor = u.color.split(' ')[0].replace('100', '500');
    return { ...u, start: range?.start, end: range?.end, baseColor };
  });

  const getDayStatus = (day: number, month: number) => {
    // Check Holidays
    const holiday = HOLIDAYS_2026.find(h => h.d === day && h.m === month);
    if (holiday) return { color: 'bg-red-500', title: holiday.name };

    // Check Units
    const date = new Date(2026, month, day);
    for (const u of unitRanges) {
      if (u.start && u.end && date >= u.start && date <= u.end) {
        return { color: u.baseColor, title: u.title };
      }
    }
    return null;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center gap-2 text-indigo-900 mb-6">
          <CalendarIcon className="w-6 h-6" />
          <h3 className="text-2xl font-bold">Calendário Acadêmico 2026</h3>
        </div>

        {/* Enhanced Legend */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500 flex items-center gap-3">
             <div className="w-4 h-4 rounded-full bg-red-500 shrink-0"></div>
             <div>
               <h4 className="font-bold text-gray-800 text-sm">Feriados Nacionais</h4>
               <p className="text-xs text-gray-500">Dias sem atividade letiva prevista.</p>
             </div>
          </div>
          
          {unitRanges.map(u => (
            <div key={u.id} className={`bg-white p-5 rounded-lg shadow-sm border-l-4 ${u.color.replace('bg-', 'border-').split(' ')[0].replace('100', '500')}`}>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-gray-800">{u.title}</h4>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">{u.dateRange}</span>
              </div>
              <div className="mt-3">
                <p className="text-xs font-bold uppercase text-gray-400 mb-1">Habilidades Principais:</p>
                <ul className="text-xs space-y-1 text-gray-600">
                  {u.bnccSkills?.slice(0, 3).map((skill, i) => (
                    <li key={i} className="truncate" title={skill}>• {skill}</li>
                  ))}
                  {(u.bnccSkills?.length || 0) > 3 && <li className="italic text-gray-400">+ outras habilidades</li>}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(m => (
          <MonthCalendar 
            key={m} 
            year={2026} 
            month={m} 
            getDayStatus={(d) => getDayStatus(d, m)}
          />
        ))}
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-500 max-w-2xl mx-auto">
        * Este calendário é uma estimativa pedagógica baseada na BNCC. Datas exatas de provas e feriados locais podem variar conforme o regimento escolar.
      </div>
    </div>
  );
};

// ... (LessonView remains unchanged) ...
const LessonView = ({ lesson }: { lesson: Item }) => {
  if (lesson.type === 'practical') {
    return (
      <div className="max-w-3xl mx-auto p-4 space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-purple-200 overflow-hidden">
          <div className="bg-purple-600 text-white p-4 flex justify-between items-center">
             <span className="font-bold flex items-center gap-2">
              <Shapes size={20} /> Atividade Prática
            </span>
            <span className="text-xs bg-purple-700 px-2 py-1 rounded">{lesson.skill}</span>
          </div>
          <div className="p-8 space-y-6">
             <h2 className="text-2xl font-bold text-gray-800 text-center">{lesson.title}</h2>
             <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
               <h3 className="font-bold text-purple-900 mb-2">Descrição:</h3>
               <p className="text-gray-700 leading-relaxed text-lg">{lesson.practicalDescription}</p>
             </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!lesson.content) return <div className="p-4">Conteúdo vazio.</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-green-600 text-white p-3 flex justify-between items-center">
          <span className="font-bold flex items-center gap-2"><PenTool size={18} /> Lousa</span>
          <span className="text-xs bg-green-700 px-2 py-1 rounded">{lesson.skill}</span>
        </div>
        <div className="p-6 bg-[#fdfbf7] font-hand text-lg text-gray-800 leading-relaxed lined-paper">
          <h2 className="text-2xl font-bold text-center text-indigo-900 mb-6 border-b-2 border-indigo-200 pb-2 uppercase">{lesson.title}</h2>
          <div className="mb-6"><span className="font-bold text-purple-700 block mb-1">Introdução:</span><p className="ml-4">{lesson.content.intro}</p></div>
          <div className="mb-6"><span className="font-bold text-blue-700 block mb-1">Desenvolvimento:</span><ul className="list-disc ml-8 space-y-2">{lesson.content.development.map((item, idx) => <li key={idx}>{item}</li>)}</ul></div>
          <div className="mb-6 bg-yellow-50 border-2 border-yellow-200 p-4 rounded-lg"><span className="font-bold text-orange-700 block mb-2 text-center uppercase">Exemplos</span>{lesson.content.examples.map((ex, idx) => <div key={idx}><p className="font-bold">Ex {idx+1}) {ex.question}</p><p className="text-blue-600 ml-4">R: {ex.answer}</p></div>)}</div>
          <div className="mt-8 p-3 bg-indigo-50 border-l-4 border-indigo-500 rounded-r"><span className="font-bold text-indigo-800">Resumo: </span><span>{lesson.content.conclusion}</span></div>
        </div>
      </div>
    </div>
  );
};

// --- UPDATED ASSESSMENT VIEW (PRINT MODE) ---

const AssessmentView = ({ item, school }: { item: Item, school: SchoolInfo }) => {
  const [showAnswers, setShowAnswers] = useState(false);
  const [isTwoColumnMode, setIsTwoColumnMode] = useState(false);
  
  if (!item.questions) return <div className="p-4">Sem questões cadastradas.</div>;

  const handlePrint = () => {
    window.print();
  };

  const handleExportDocx = () => {
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML to Word Document</title></head><body>";
    const footer = "</body></html>";
    
    // Create a clone of the printable area to clean it up for Word
    const printArea = document.getElementById("assessment-print-area");
    if (!printArea) return;
    
    const clone = printArea.cloneNode(true) as HTMLElement;
    
    // Remove screen-only elements
    const hiddenElements = clone.querySelectorAll('.print\\:hidden');
    hiddenElements.forEach(el => el.parentNode?.removeChild(el));
    
    const sourceHTML = header + clone.innerHTML + footer;
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = `${item.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.doc`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };

  return (
    <div className={`mx-auto p-4 transition-all duration-300 ${isTwoColumnMode ? 'max-w-[210mm]' : 'max-w-4xl'}`}>
      {/* Screen Controls */}
      <div className="flex justify-between items-center mb-6 print:hidden">
        <h2 className="text-xl font-bold text-gray-800">{item.title}</h2>
        <div className="flex gap-2">
          {!isTwoColumnMode && (
            <button 
              onClick={() => setShowAnswers(!showAnswers)}
              className="flex items-center gap-2 text-sm bg-white border border-gray-300 px-3 py-2 rounded hover:bg-gray-50 transition"
            >
              {showAnswers ? <CheckCircle size={16} className="text-green-600"/> : <CheckCircle size={16} className="text-gray-400"/>}
              {showAnswers ? 'Ocultar Gabarito' : 'Ver Gabarito'}
            </button>
          )}
          <button 
            onClick={() => setIsTwoColumnMode(!isTwoColumnMode)}
            className={`flex items-center gap-2 text-sm px-3 py-2 rounded transition border ${isTwoColumnMode ? 'bg-indigo-100 text-indigo-700 border-indigo-300' : 'bg-white border-gray-300 hover:bg-gray-50'}`}
          >
            {isTwoColumnMode ? <Layout size={16} /> : <Eye size={16} />}
            {isTwoColumnMode ? 'Voltar para Lista' : 'Modo Impressão (2 Colunas)'}
          </button>
          <button 
            onClick={handleExportDocx}
            className="flex items-center gap-2 text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition shadow-sm"
          >
            <Download size={16} /> Exportar DOCX
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 text-sm bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition shadow-sm"
          >
            <Printer size={16} /> Imprimir (PDF)
          </button>
        </div>
      </div>

      {/* Exam Paper Container */}
      <div id="assessment-print-area" className={`bg-white p-8 md:p-12 shadow-sm border border-gray-200 print:shadow-none print:border-none print:p-0 ${isTwoColumnMode ? 'min-h-[297mm]' : ''}`}>
        
        {/* Exam Header - Table format matching PDF models */}
        <table className="w-full border-collapse border-2 border-black text-sm mb-6">
          <tbody>
            {school.id === 'saolourenco' ? (
              <>
                <tr>
                  <td className="border border-black p-2 w-[20%] text-center align-middle" rowSpan={1}>
                    <img src={school.logo} alt="Brasão" className="max-h-16 mx-auto" />
                  </td>
                  <td className="border border-black p-2 text-center font-bold uppercase w-[55%]">
                    {school.headerLine1}<br/>
                    {school.headerLine2}<br/>
                    {school.headerLine3}
                  </td>
                  <td className="border border-black p-2 w-[25%] text-center align-top">
                    <span className="font-bold uppercase">NOTA</span><br/><br/><br/>
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className="border border-black p-2">
                    <span className="font-bold uppercase">ALUNO(A) :</span>
                  </td>
                  <td className="border border-black p-2">
                    <span className="font-bold uppercase">DATA:</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/2026
                  </td>
                </tr>
                <tr>
                  <td colSpan={1} className="border border-black p-2">
                    <span className="font-bold uppercase">COMPONENTE CURRICULAR:</span> MATEMÁTICA
                  </td>
                  <td className="border border-black p-2">
                    <span className="font-bold uppercase">ANO/TURMA:</span>
                  </td>
                  <td className="border border-black p-2">
                    <span className="font-bold uppercase">PROF:</span>
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} className="border border-black p-2 text-center font-bold uppercase">
                    {item.title.toUpperCase()}
                  </td>
                </tr>
              </>
            ) : (
              <>
                <tr>
                  <td className="border border-black p-2 w-[15%] text-center align-middle" rowSpan={2}>
                    <img src={school.logo} alt="Brasão" className="max-h-16 mx-auto" />
                  </td>
                  <td colSpan={3} className="border border-black p-2 text-center font-bold uppercase">
                    {school.headerLine1}<br/>
                    {school.headerLine2}<br/>
                    {school.headerLine3}
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} className="border border-black p-2 text-center font-bold uppercase">
                    {item.title.toUpperCase()}
                  </td>
                </tr>
                <tr>
                  <td colSpan={4} className="border border-black p-2">
                    <span className="font-bold">ALUNO(A):</span>
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className="border border-black p-2">
                    <span className="font-bold">Componente Curricular:</span> Matemática
                  </td>
                  <td colSpan={2} className="border border-black p-2">
                    <span className="font-bold">Ano/Turma:</span>
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className="border border-black p-2 text-center">
                    <span className="font-bold">Data:</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </td>
                  <td colSpan={2} className="border border-black p-2">
                    <span className="font-bold">Professor:</span>
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} className="border border-black p-2">
                  </td>
                  <td className="border border-black p-2 w-[20%]">
                    <span className="font-bold">Nota:</span>
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>

        {/* Questions List */}
        <div className={`
          font-latex text-gray-900
          ${isTwoColumnMode ? 'grid grid-cols-2 gap-x-8 gap-y-4 text-sm' : 'flex flex-col space-y-8 text-lg'}
          print:grid print:grid-cols-2 print:gap-x-8 print:gap-y-4 print:text-sm
        `}>
          {item.questions.map((q, idx) => (
            <div key={idx} className="break-inside-avoid flex flex-col">
              <div className="flex gap-2 mb-2">
                <span className="font-bold">{idx + 1}.</span>
                <div className="flex-1">
                  <p className="leading-relaxed">{renderTextWithLatex(q.question)}</p>
                  
                  {q.imageUrl && (
                    <div className="mt-4 mb-4">
                      <img src={q.imageUrl} alt="Figura da questão" className="max-w-xs md:max-w-md rounded shadow-sm border border-gray-200" />
                    </div>
                  )}

                  {q.options && (
                    <div className="ml-2 mt-2 space-y-1">
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2">
                          <div className="w-4 h-4 border border-gray-400 rounded-full"></div>
                          <span>{renderTextWithLatex(opt)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Space for working out - Rounded Rectangle */}
              {/* Visible in print OR if isTwoColumnMode is active */}
              <div className={`
                mt-3 border border-gray-400 rounded-xl w-full
                ${isTwoColumnMode ? 'block h-24' : 'hidden print:block print:h-24'}
              `}></div>

              {/* Answers (Screen Mode Only - Only show if NOT in print preview mode) */}
              {!isTwoColumnMode && (
                <div className="print:hidden">
                  {showAnswers && (
                    <div className="mt-3 ml-6 p-3 bg-green-50 border border-green-100 rounded text-sm text-green-800 font-medium animate-in fade-in">
                      <span className="font-bold">Gabarito:</span> {renderTextWithLatex(q.answer)}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className={`mt-12 pt-4 border-t border-gray-300 text-center text-xs italic text-gray-500 font-latex ${isTwoColumnMode ? 'block' : 'hidden print:block'}`}>
          "A matemática é o alfabeto com o qual Deus escreveu o universo." - Galileu Galilei
        </div>
      </div>
    </div>
  );
};

// ... (UnitList and ItemList remain largely unchanged, mostly reusing the existing components) ...
const UnitList = ({ grade, onSelectUnit }: { grade: Grade, onSelectUnit: (u: Unit) => void }) => (
  <div className="p-4 grid gap-4 max-w-4xl mx-auto print:hidden">
    {grade.units.map(unit => (
      <button 
        key={unit.id} 
        onClick={() => onSelectUnit(unit)}
        className="text-left bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-indigo-300 transition group"
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-700">{unit.title}</h3>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${unit.color.split(' ')[0]} ${unit.color.split(' ')[2]}`}>
            <CalendarIcon size={12} /> {unit.dateRange}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-4">{unit.description}</p>
        <div className="flex gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1"><BookOpen size={14}/> {unit.items.filter(i => i.type === 'lesson').length} Aulas</span>
          <span className="flex items-center gap-1"><GraduationCap size={14}/> {unit.items.filter(i => i.type === 'exam' || i.type === 'activity').length} Avaliações</span>
        </div>
      </button>
    ))}

    {/* Export Section */}
    <div className="mt-8 pt-8 border-t border-gray-200">
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-100 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            Exportar Planejamento
          </h3>
          <p className="text-sm text-emerald-700 mt-1 max-w-lg">
            Baixe todo o conteúdo programático (Aulas, Habilidades, Exercícios e Datas) em formato de planilha para abrir no Google Sheets ou Excel. *Não inclui as provas.
          </p>
        </div>
        <button 
          onClick={() => generateAndDownloadCSV(grade)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition shadow-sm"
        >
          <Download size={20} />
          Baixar Planilha (CSV)
        </button>
      </div>
    </div>
  </div>
);

// ==================== CHECKLIST SYSTEM ====================
type ChecklistData = Record<string, Record<string, boolean>>; // gradeId_unitId -> { itemId: true/false }
type PendingItems = Record<string, string[]>; // gradeId_unitId -> [itemId, ...] (items carried over)

const CHECKLIST_KEY = 'profmat_checklist';
const PENDING_KEY = 'profmat_pending';
const CONFIRMED_KEY = 'profmat_confirmed';

const loadChecklist = (): ChecklistData => {
  try { return JSON.parse(localStorage.getItem(CHECKLIST_KEY) || '{}'); } catch { return {}; }
};
const saveChecklist = (d: ChecklistData) => localStorage.setItem(CHECKLIST_KEY, JSON.stringify(d));
const loadPending = (): PendingItems => {
  try { return JSON.parse(localStorage.getItem(PENDING_KEY) || '{}'); } catch { return {}; }
};
const savePending = (d: PendingItems) => localStorage.setItem(PENDING_KEY, JSON.stringify(d));
const loadConfirmed = (): Record<string, boolean> => {
  try { return JSON.parse(localStorage.getItem(CONFIRMED_KEY) || '{}'); } catch { return {}; }
};
const saveConfirmed = (d: Record<string, boolean>) => localStorage.setItem(CONFIRMED_KEY, JSON.stringify(d));

const ChecklistView = ({ unit, grade }: { unit: Unit, grade: Grade }) => {
  const unitKey = `${grade.id}_${unit.id}`;
  const [checklist, setChecklist] = useState<ChecklistData>(loadChecklist);
  const [pending, setPending] = useState<PendingItems>(loadPending);
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>(loadConfirmed);
  const [showReport, setShowReport] = useState(false);

  const isConfirmed = confirmed[unitKey] || false;
  const unitChecks = checklist[unitKey] || {};
  const pendingForUnit = pending[unitKey] || [];

  // Find items carried over from previous unit
  const unitIdx = grade.units.findIndex(u => u.id === unit.id);
  const isLastUnit = unitIdx === grade.units.length - 1;

  // Get previous unit's pending items that were carried to this unit
  const carriedItems: { id: string; title: string; skill?: string; fromUnit: string }[] = [];
  if (pendingForUnit.length > 0) {
    // These are item IDs from previous units
    for (const prevUnit of grade.units.slice(0, unitIdx)) {
      for (const item of prevUnit.items) {
        if (pendingForUnit.includes(item.id)) {
          carriedItems.push({ id: item.id, title: item.title, skill: item.skill, fromUnit: prevUnit.title });
        }
      }
    }
  }

  const allItems = [...unit.items.map(i => ({ ...i, fromUnit: '' })), ...carriedItems.map(c => ({ ...c, type: 'lesson' as const }))];

  const toggleItem = (itemId: string) => {
    if (isConfirmed) return;
    const updated = { ...checklist, [unitKey]: { ...unitChecks, [itemId]: !unitChecks[itemId] } };
    setChecklist(updated);
    saveChecklist(updated);
  };

  const confirmUnit = () => {
    if (!confirm('Confirmar esta unidade? Os itens não marcados serão movidos para a próxima unidade (ou gerar relatório se for a última).')) return;
    
    // Find unchecked items
    const uncheckedIds = allItems.filter(i => !unitChecks[i.id]).map(i => i.id);

    if (isLastUnit) {
      // Show report
      setShowReport(true);
    } else {
      // Move to next unit
      const nextUnit = grade.units[unitIdx + 1];
      const nextKey = `${grade.id}_${nextUnit.id}`;
      const existingPending = pending[nextKey] || [];
      const updatedPending = { ...pending, [nextKey]: [...existingPending, ...uncheckedIds] };
      setPending(updatedPending);
      savePending(updatedPending);
    }

    const updatedConfirmed = { ...confirmed, [unitKey]: true };
    setConfirmed(updatedConfirmed);
    saveConfirmed(updatedConfirmed);
  };

  const resetUnit = () => {
    if (!confirm('Resetar o checklist desta unidade?')) return;
    const updatedChecklist = { ...checklist };
    delete updatedChecklist[unitKey];
    setChecklist(updatedChecklist);
    saveChecklist(updatedChecklist);
    const updatedConfirmed = { ...confirmed };
    delete updatedConfirmed[unitKey];
    setConfirmed(updatedConfirmed);
    saveConfirmed(updatedConfirmed);
    setShowReport(false);
  };

  const checkedCount = allItems.filter(i => unitChecks[i.id]).length;
  const totalCount = allItems.length;
  const progress = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  // Report for last unit
  const uncheckedItems = allItems.filter(i => !unitChecks[i.id]);
  const uncheckedSkills = [...new Set(uncheckedItems.map(i => i.skill).filter(Boolean))];

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-4 print:hidden">
      {/* Progress Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-gray-700">Progresso: {checkedCount}/{totalCount}</span>
          <span className={`text-sm font-bold ${progress === 100 ? 'text-green-600' : 'text-indigo-600'}`}>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div className={`h-3 rounded-full transition-all ${progress === 100 ? 'bg-green-500' : 'bg-indigo-500'}`} style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Carried items notice */}
      {carriedItems.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex items-start gap-2">
          <AlertTriangle size={18} className="text-amber-600 mt-0.5 shrink-0" />
          <div className="text-sm text-amber-800">
            <strong>{carriedItems.length} item(ns)</strong> foram transferidos de unidades anteriores por não terem sido dados.
          </div>
        </div>
      )}

      {/* Items */}
      {allItems.map(item => (
        <button
          key={item.id}
          onClick={() => toggleItem(item.id)}
          disabled={isConfirmed}
          className={`w-full flex items-center gap-3 p-3 rounded-lg border transition text-left ${
            unitChecks[item.id] 
              ? 'bg-green-50 border-green-300 line-through text-gray-400' 
              : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-800'
          } ${isConfirmed ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className={`w-6 h-6 rounded border-2 flex items-center justify-center shrink-0 ${
            unitChecks[item.id] ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'
          }`}>
            {unitChecks[item.id] && <CheckCircle size={16} />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm truncate">{item.title}</div>
            <div className="flex items-center gap-2 mt-0.5">
              {item.skill && <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">{item.skill}</span>}
              {item.fromUnit && <span className="text-xs bg-amber-100 px-1.5 py-0.5 rounded text-amber-700">← {item.fromUnit}</span>}
            </div>
          </div>
        </button>
      ))}

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        {!isConfirmed ? (
          <button onClick={confirmUnit} className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition flex items-center justify-center gap-2">
            <ClipboardCheck size={20} /> Confirmar Unidade
          </button>
        ) : (
          <div className="flex-1 py-3 bg-green-100 text-green-700 font-bold rounded-xl text-center flex items-center justify-center gap-2">
            <CheckCircle size={20} /> Unidade Confirmada
          </div>
        )}
        <button onClick={resetUnit} className="px-4 py-3 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition text-sm">Resetar</button>
      </div>

      {/* Report Modal */}
      {showReport && uncheckedItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 p-6 rounded-xl mt-4">
          <h3 className="text-lg font-bold text-red-800 flex items-center gap-2 mb-3"><AlertTriangle size={20} /> Relatório de Conteúdos Não Ministrados</h3>
          <p className="text-sm text-red-700 mb-4">Os seguintes itens/aulas <strong>não foram ministrados</strong> ao longo do ano:</p>
          <ul className="space-y-2 mb-4">
            {uncheckedItems.map(item => (
              <li key={item.id} className="text-sm text-red-800 bg-white p-2 rounded border border-red-100 flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0 text-red-500" />
                <span className="font-medium">{item.title}</span>
                {item.skill && <span className="text-xs bg-red-100 px-1.5 py-0.5 rounded">{item.skill}</span>}
              </li>
            ))}
          </ul>
          {uncheckedSkills.length > 0 && (
            <div className="mt-4 pt-4 border-t border-red-200">
              <h4 className="text-sm font-bold text-red-800 mb-2">Habilidades BNCC não contempladas:</h4>
              <div className="flex flex-wrap gap-2">
                {uncheckedSkills.map(s => <span key={s} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">{s}</span>)}
              </div>
            </div>
          )}
        </div>
      )}
      {showReport && uncheckedItems.length === 0 && (
        <div className="bg-green-50 border border-green-200 p-6 rounded-xl mt-4 text-center">
          <CheckCircle size={40} className="text-green-600 mx-auto mb-2" />
          <h3 className="text-lg font-bold text-green-800">Parabéns! 🎉</h3>
          <p className="text-sm text-green-700 mt-1">Todos os conteúdos foram ministrados com sucesso!</p>
        </div>
      )}
    </div>
  );
};

const ItemList = ({ unit, onSelectItem }: { unit: Unit, onSelectItem: (i: Item) => void }) => (
  <div className="p-4 max-w-4xl mx-auto space-y-3 print:hidden">
    {unit.items.map((item, idx) => {
      let Icon = BookOpen;
      let colorClass = "bg-blue-100 text-blue-700";
      
      if (item.type === 'exercise') { Icon = PenTool; colorClass = "bg-orange-100 text-orange-700"; }
      if (item.type === 'activity') { Icon = Share2; colorClass = "bg-purple-100 text-purple-700"; }
      if (item.type === 'exam') { Icon = GraduationCap; colorClass = "bg-red-100 text-red-700"; }
      if (item.type === 'practical') { Icon = Shapes; colorClass = "bg-pink-100 text-pink-700"; }

      return (
        <button 
          key={item.id} 
          onClick={() => onSelectItem(item)}
          className="w-full flex items-center gap-4 bg-white p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
        >
          <div className={`p-3 rounded-full ${colorClass}`}>
            <Icon size={20} />
          </div>
          <div className="text-left flex-1">
            <h4 className="font-semibold text-gray-800">{item.title}</h4>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 capitalize">{item.type === 'exam' ? 'Prova' : item.type === 'activity' ? 'Atividade' : item.type === 'practical' ? 'Prática' : 'Aula'}</span>
              {item.skill && <span className="text-xs bg-gray-100 px-1 rounded text-gray-500">Hab: {item.skill}</span>}
            </div>
          </div>
          <ChevronRight size={20} className="text-gray-300" />
        </button>
      );
    })}
  </div>
);

const App = () => {
  const [activeModule, setActiveModule] = useState<ModuleId>('hub');
  const [gradeId, setGradeId] = useState<string | null>(null);
  const [unitId, setUnitId] = useState<string | null>(null);
  const [itemId, setItemId] = useState<string | null>(null);
  const [tab, setTab] = useState<'content' | 'overview' | 'calendar' | 'checklist'>('content');
  const [schoolId, setSchoolId] = useState<SchoolId>('igarassu');
  const school = SCHOOLS[schoolId];

  const grade = gradeId ? DATA[gradeId] : null;
  const unit = (grade && unitId) ? grade.units.find(u => u.id === unitId) : null;
  const item = (unit && itemId) ? unit.items.find(i => i.id === itemId) : null;

  React.useEffect(() => { setTab('content'); }, [unitId]);

  // --- HUB SCREEN ---
  if (activeModule === 'hub') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4 print:hidden">
        <div className="max-w-2xl w-full space-y-8">
          {/* Hub Title */}
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="bg-indigo-500/20 p-3 rounded-2xl backdrop-blur-sm border border-indigo-500/30">
                <Calculator size={32} className="text-indigo-300" />
              </div>
            </div>
            <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">ProfMat Hub</h1>
            <p className="text-indigo-300/80 text-lg">Ferramentas do Professor de Matemática</p>
          </div>

          {/* School Selector */}
          <div className="bg-white/5 backdrop-blur-lg p-4 rounded-2xl border border-white/10">
            <p className="text-xs font-bold text-indigo-300/70 uppercase tracking-wider mb-3 flex items-center gap-1.5"><School size={14} /> Escola Selecionada</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSchoolId('igarassu')}
                className={`p-3 rounded-xl text-sm font-medium border-2 transition flex items-center gap-2 ${
                  schoolId === 'igarassu' ? 'border-indigo-400 bg-indigo-500/20 text-white' : 'border-white/10 text-indigo-200/70 hover:border-white/20'
                }`}
              >
                <MapPin size={14} /> Igarassu
              </button>
              <button
                onClick={() => setSchoolId('saolourenco')}
                className={`p-3 rounded-xl text-sm font-medium border-2 transition flex items-center gap-2 ${
                  schoolId === 'saolourenco' ? 'border-purple-400 bg-purple-500/20 text-white' : 'border-white/10 text-indigo-200/70 hover:border-white/20'
                }`}
              >
                <MapPin size={14} /> S. Lourenço
              </button>
            </div>
            <p className="text-xs text-indigo-300/50 mt-2 text-center">{school.name}</p>
          </div>

          {/* Module Cards */}
          <div className="grid gap-4">
            {/* Notas de Aula */}
            <button 
              onClick={() => setActiveModule('notas')} 
              className="group bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 hover:border-indigo-400/50 hover:bg-white/10 transition-all text-left flex items-center gap-5"
            >
              <div className="bg-indigo-500/20 p-4 rounded-xl text-indigo-300 group-hover:bg-indigo-500 group-hover:text-white transition-all shrink-0">
                <BookOpen size={28} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-white group-hover:text-indigo-200 transition">📚 Notas de Aula</h2>
                <p className="text-sm text-indigo-300/60 mt-1">Planejamento completo 6º e 7º ano — Aulas, Atividades e Provas com conteúdo BNCC</p>
              </div>
              <ChevronRight size={20} className="text-indigo-400/40 group-hover:text-indigo-300 transition shrink-0" />
            </button>

            {/* Gerador de Provas */}
            <button 
              onClick={() => setActiveModule('gerador')}
              className="group bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 hover:border-emerald-400/50 hover:bg-white/10 transition-all text-left flex items-center gap-5 w-full"
            >
              <div className="bg-emerald-500/20 p-4 rounded-xl text-emerald-300 group-hover:bg-emerald-500 group-hover:text-white transition-all shrink-0">
                <FileText size={28} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-white group-hover:text-emerald-200 transition">📝 Gerador de Provas</h2>
                <p className="text-sm text-emerald-300/60 mt-1">Gere provas com IA (Gemini) — Contextualizadas, com gabarito e mapa pedagógico</p>
              </div>
              <ChevronRight size={20} className="text-emerald-400/40 group-hover:text-emerald-300 transition shrink-0" />
            </button>

            {/* Grade de Horário */}
            <button 
              onClick={() => setActiveModule('grade')}
              className="group bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 hover:border-amber-400/50 hover:bg-white/10 transition-all text-left flex items-center gap-5 w-full"
            >
              <div className="bg-amber-500/20 p-4 rounded-xl text-amber-300 group-hover:bg-amber-500 group-hover:text-white transition-all shrink-0">
                <CalendarIcon size={28} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-white group-hover:text-amber-200 transition">📅 Grade de Horário</h2>
                <p className="text-sm text-amber-300/60 mt-1">Monte sua grade semanal — Escolas, turmas e horários organizados</p>
              </div>
              <ChevronRight size={20} className="text-amber-400/40 group-hover:text-amber-300 transition shrink-0" />
            </button>
          </div>

          <p className="text-center text-xs text-indigo-400/30">v2.0 — Planejamento 2026</p>
        </div>
      </div>
    );
  }

  // --- GERADOR DE PROVAS MODULE ---
  if (activeModule === 'gerador') {
    return (
      <div className="min-h-screen bg-slate-50 relative">
        <button 
          onClick={() => setActiveModule('hub')} 
          className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm shadow-sm border border-slate-200 rounded-xl text-slate-700 hover:text-emerald-600 font-medium transition-all print:hidden"
        >
          <ChevronLeft className="w-5 h-5" />
          Voltar ao Hub
        </button>
        <div className="pt-4">
          <Suspense fallback={<div className="flex h-screen items-center justify-center text-emerald-600">Carregando Gerador de Provas...</div>}>
            <GeradorProvasApp />
          </Suspense>
        </div>
      </div>
    );
  }

  // --- GRADE DE HORÁRIO MODULE ---
  if (activeModule === 'grade') {
    return (
      <div className="min-h-screen bg-slate-50 relative">
        <button 
          onClick={() => setActiveModule('hub')} 
          className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm shadow-sm border border-slate-200 rounded-xl text-slate-700 hover:text-amber-600 font-medium transition-all print:hidden"
        >
          <ChevronLeft className="w-5 h-5" />
          Voltar ao Hub
        </button>
        <div className="pt-4">
          <Suspense fallback={<div className="flex h-screen items-center justify-center text-amber-600">Carregando Grade de Horário...</div>}>
            <GradeHorarioApp />
          </Suspense>
        </div>
      </div>
    );
  }

  // --- NOTAS DE AULA MODULE ---
  if (!grade) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 print:hidden">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <button onClick={() => { setActiveModule('hub'); setGradeId(null); setUnitId(null); setItemId(null); }} className="text-sm text-indigo-500 hover:text-indigo-700 mb-4 flex items-center gap-1 mx-auto">
              <ChevronLeft size={16} /> Voltar ao Hub
            </button>
            <h1 className="text-4xl font-extrabold text-indigo-900 mb-2">📚 Notas de Aula</h1>
            <p className="text-gray-600">Planejamento 2026 (BNCC) — {school.name}</p>
          </div>

          <div className="grid gap-4">
            <button onClick={() => setGradeId('6')} className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100 hover:border-indigo-400 hover:shadow-md transition text-left flex items-center gap-4 group">
              <div className="bg-indigo-100 p-4 rounded-full text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition"><span className="text-2xl font-bold">6º</span></div>
              <div><h2 className="text-xl font-bold text-gray-800">6º Ano</h2><p className="text-sm text-gray-500">Ensino Fundamental</p></div>
            </button>
            <button onClick={() => setGradeId('7')} className="bg-white p-6 rounded-xl shadow-sm border border-purple-100 hover:border-purple-400 hover:shadow-md transition text-left flex items-center gap-4 group">
              <div className="bg-purple-100 p-4 rounded-full text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition"><span className="text-2xl font-bold">7º</span></div>
              <div><h2 className="text-xl font-bold text-gray-800">7º Ano</h2><p className="text-sm text-gray-500">Ensino Fundamental</p></div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="min-h-screen bg-slate-50 pb-8 print:bg-white relative">
        <button onClick={() => { setActiveModule('hub'); setGradeId(null); setUnitId(null); setItemId(null); }} className="fixed top-2 left-2 z-50 flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-lg shadow-lg hover:bg-indigo-700 transition-all print:hidden"><ChevronLeft size={14} />Hub</button>
        <Header title={grade.title} subtitle="Selecione a Unidade" onBack={() => setGradeId(null)} />
        <UnitList grade={grade} onSelectUnit={(u) => setUnitId(u.id)} />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-slate-50 pb-8 print:bg-white relative">
        <button onClick={() => { setActiveModule('hub'); setGradeId(null); setUnitId(null); setItemId(null); }} className="fixed top-2 left-2 z-50 flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-lg shadow-lg hover:bg-indigo-700 transition-all print:hidden"><ChevronLeft size={14} />Hub</button>
        <Header title={unit.title} subtitle={grade.title} onBack={() => setUnitId(null)} />
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-16 z-10 print:hidden">
          <div className="max-w-4xl mx-auto flex">
            <button onClick={() => setTab('content')} className={`flex-1 py-3 text-sm font-medium border-b-2 transition ${tab === 'content' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Conteúdo</button>
            <button onClick={() => setTab('checklist')} className={`flex-1 py-3 text-sm font-medium border-b-2 transition ${tab === 'checklist' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>✅ Checklist</button>
            <button onClick={() => setTab('overview')} className={`flex-1 py-3 text-sm font-medium border-b-2 transition ${tab === 'overview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Visão Geral</button>
            <button onClick={() => setTab('calendar')} className={`flex-1 py-3 text-sm font-medium border-b-2 transition ${tab === 'calendar' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Calendário</button>
          </div>
        </div>
        {tab === 'content' && <ItemList unit={unit} onSelectItem={(i) => setItemId(i.id)} />}
        {tab === 'checklist' && <ChecklistView unit={unit} grade={grade} />}
        {tab === 'overview' && <UnitOverview unit={unit} />}
        {tab === 'calendar' && <Calendar2026 currentUnitId={unit.id} grade={grade} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-8 print:bg-white print:p-0 print:min-h-0 relative">
      <button onClick={() => { setActiveModule('hub'); setGradeId(null); setUnitId(null); setItemId(null); }} className="fixed top-2 left-2 z-50 flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-lg shadow-lg hover:bg-indigo-700 transition-all print:hidden"><ChevronLeft size={14} />Hub</button>
      <Header 
        title={item.type === 'lesson' || item.type === 'practical' ? 'Nota de Aula' : 'Avaliação'} 
        subtitle={`${unit.title} > ${item.title}`} 
        onBack={() => setItemId(null)} 
      />
      {item.type === 'lesson' || item.type === 'practical' ? <LessonView lesson={item} /> : <AssessmentView item={item} school={school} />}
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);