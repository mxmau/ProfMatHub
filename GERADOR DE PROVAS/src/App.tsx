import React, { useState, useRef, useEffect } from 'react';
import { FileText, Download, Copy, CheckCircle2, Loader2, BookOpen, Settings2, School, Printer, FileDown, ShieldCheck, X, Wand2, History } from 'lucide-react';
import { generateExam, ExamParams, ExamData, runQAAndCorrect, RetryError, onProviderChange, getCurrentProvider } from './services/gemini';
import { generateLatex, generateDocx } from './utils/generators';
import { saveExamToBank, findSimilarExam, getExamsFromBank, StoredExam } from './utils/storage';
import Markdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const formatMarkdownText = (text: string) => {
  if (!text) return '';
  return text
    .replace(/\\vspace\{[^}]+\}/g, '') // Remove \vspace
    .replace(/(?<!\\)R\$/g, 'R\\$'); // Escape R$ to prevent math mode breaking
};

import { igarassu, saoLourenco } from './logos';

const LOGO_IGARASSU = igarassu;
const LOGO_SAO_LOURENCO = saoLourenco;

export default function App() {
  const [params, setParams] = useState<ExamParams>({
    school: 'Escola Ecilda Ramos de Souza',
    customSchool: '',
    activityTitle: 'Prova de Matemática',
    grade: '6º',
    classRoom: 'A',
    date: new Date().toLocaleDateString('pt-BR'),
    teacher: '',
    value: '10',
    questionCount: 10,
    curriculum: 'Ambos',
    topics: '',
    difficulty: 'Mesclado',
    context: '',
    includeMap: true,
    isIndividual: false,
    isGraded: true,
    logoBase64: LOGO_IGARASSU,
    subject: 'Matemática',
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [generatedLatex, setGeneratedLatex] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string>('');
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const [retryMessage, setRetryMessage] = useState<string>('');
  const [viewMode, setViewMode] = useState<'preview' | 'latex'>('preview');
  const [qaReport, setQaReport] = useState<string | null>(null);
  const [pendingCorrectedExam, setPendingCorrectedExam] = useState<ExamData | null>(null);
  const [isRunningQA, setIsRunningQA] = useState(false);
  const [isApplyingCorrections, setIsApplyingCorrections] = useState(false);
  const [showQAModal, setShowQAModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyExams, setHistoryExams] = useState<StoredExam[]>([]);
  const [progress, setProgress] = useState(0);
  const [lastParams, setLastParams] = useState<ExamParams | null>(null);
  const [activeProvider, setActiveProvider] = useState<string>(getCurrentProvider());

  const printRef = useRef<HTMLDivElement>(null);

  const handleRetry = (attempt: number, maxRetries: number, reason: string) => {
    setRetryMessage(`${reason}. Tentativa ${attempt} de ${maxRetries}...`);
  };

  useEffect(() => {
    return onProviderChange((provider) => setActiveProvider(provider));
  }, []);

  useEffect(() => {
    if (!isGenerating) {
      setProgress(0);
      return;
    }

    let targetProgress = 0;
    if (generationStep === 'Elaborando questões contextualizadas...') targetProgress = 80;
    else if (generationStep === 'Finalizando formatação...') targetProgress = 99;
    else if (generationStep === 'Executando Controle de Qualidade (QA)...') targetProgress = 60;
    else if (generationStep === 'Aplicando correções baseadas no QA...') targetProgress = 90;

    const interval = setInterval(() => {
      setProgress(prev => {
        const diff = targetProgress - prev;
        if (diff > 0) {
          const increment = Math.max(0.5, diff * 0.05);
          return Math.min(prev + increment, targetProgress);
        }
        return prev;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isGenerating, generationStep]);

  const handleRunQA = async () => {
    if (!examData || !lastParams) return;
    
    if (qaReport) {
      setShowQAModal(true);
      return;
    }

    setIsRunningQA(true);
    setShowQAModal(true);
    setQaReport(null);
    setPendingCorrectedExam(null);
    setRetryMessage('');
    try {
      const result = await runQAAndCorrect(examData, lastParams, handleRetry);
      setQaReport(result.qaReport);
      setPendingCorrectedExam(result.correctedExam);
    } catch (err: any) {
      setQaReport("Erro ao gerar relatório de QA: " + err.message);
      if (err.retryLog) {
        setDebugLog(err.retryLog);
      }
    } finally {
      setIsRunningQA(false);
      setRetryMessage('');
    }
  };

  const applyCorrections = async () => {
    if (pendingCorrectedExam && lastParams) {
      setIsApplyingCorrections(true);
      
      // Simulate processing time for visual feedback
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setExamData(pendingCorrectedExam);
      const newLatex = generateLatex(lastParams, pendingCorrectedExam);
      setGeneratedLatex(newLatex);
      saveExamToBank(lastParams, pendingCorrectedExam);
      setPendingCorrectedExam(null);
      setQaReport(null);
      setIsApplyingCorrections(false);
      setShowQAModal(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError('');
    setDebugLog([]);
    setExamData(null);
    setGeneratedLatex('');
    setQaReport(null);
    setPendingCorrectedExam(null);
    setLastParams(params);
    setRetryMessage('');
    
    try {
      // Check local cache first
      const cachedExam = findSimilarExam(params);
      let data: ExamData;
      let localQaReport: string | null = null;
      
      if (cachedExam) {
        setGenerationStep('Recuperando prova do banco local...');
        // Simulate a small delay for UX
        await new Promise(resolve => setTimeout(resolve, 500));
        data = cachedExam.examData;
      } else {
        setGenerationStep('Elaborando questões contextualizadas...');
        data = await generateExam(params, handleRetry);
        
        setGenerationStep('Executando Controle de Qualidade (QA)...');
        try {
          const qaResult = await runQAAndCorrect(data, params, handleRetry);
          localQaReport = qaResult.qaReport;
          setQaReport(qaResult.qaReport);
          setPendingCorrectedExam(qaResult.correctedExam);
        } catch (qaErr: any) {
          console.error("QA failed:", qaErr);
          localQaReport = "O Controle de Qualidade falhou ou excedeu o tempo limite. A prova original foi mantida.\n\n" + (qaErr.message || "");
          setQaReport(localQaReport);
        }
        
        saveExamToBank(params, data);
      }
      
      setGenerationStep('Finalizando formatação...');
      const finalLatex = generateLatex(params, data);
      
      setExamData(data);
      setGeneratedLatex(finalLatex);
      setViewMode('preview');
      
      // Show QA modal automatically if we just ran it
      if (!cachedExam && localQaReport) {
        setShowQAModal(true);
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao gerar a prova.');
      if (err.retryLog) {
        setDebugLog(err.retryLog);
      }
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
      setRetryMessage('');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLatex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadLatex = () => {
    const blob = new Blob([generatedLatex], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prova_matematica_${params.grade.replace('º', '')}ano.tex`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadDocx = async () => {
    if (examData) {
      await generateDocx(params, examData);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const actualSchool = params.school === 'Outra' ? params.customSchool || 'Escola' : params.school;
  const municipio = params.school === 'Escola Municipal Tiradentes' ? 'São Lourenço da Mata' : 'Igarassu';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans print:bg-white">
      {/* Header - Hidden when printing */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              Gerador de Provas <span className="text-indigo-600">Igarassu</span>
            </h1>
          </div>
          <button
            onClick={() => {
              setHistoryExams(getExamsFromBank());
              setShowHistoryModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <History className="w-4 h-4" />
            Histórico de Provas
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0 print:max-w-none">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:block">
          
          {/* Sidebar / Form - Hidden when printing */}
          <div className="lg:col-span-4 space-y-6 print:hidden">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <School className="w-5 h-5 text-slate-500" />
                <h2 className="text-lg font-medium">Dados da Escola</h2>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex gap-4">
                  <div className={params.school === 'Escola Municipal Tiradentes' ? "flex-1" : "w-full"}>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Escola</label>
                    <select 
                      title="Escola"
                      aria-label="Escola"
                      className="w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 border p-2.5 text-sm"
                      value={params.school}
                      onChange={e => {
                        const school = e.target.value;
                        let curriculum = params.curriculum;
                        let logoBase64 = params.logoBase64;
                        
                        if (school === 'Escola Municipal Tiradentes') {
                          curriculum = 'Matriz da Luz';
                          logoBase64 = LOGO_SAO_LOURENCO;
                        } else if (school === 'Escola Ecilda Ramos de Souza') {
                          curriculum = 'Currículo de Igarassu';
                          logoBase64 = LOGO_IGARASSU;
                        } else {
                          logoBase64 = '';
                        }
                        
                        setParams({...params, school, curriculum, logoBase64});
                      }}
                    >
                      <option value="Escola Ecilda Ramos de Souza">Escola Ecilda Ramos de Souza (Igarassu)</option>
                      <option value="Escola Municipal Tiradentes">Escola Municipal Tiradentes (São Lourenço da Mata)</option>
                      <option value="Outra">Outra</option>
                    </select>
                  </div>
                  {params.school === 'Escola Municipal Tiradentes' && (
                    <div className="w-24">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Nota</label>
                      <input 
                        type="text" 
                        title="Nota"
                        placeholder="Ex: 10,0"
                        className="w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 border p-2.5 text-sm"
                        value={params.value}
                        onChange={e => setParams({...params, value: e.target.value})}
                      />
                    </div>
                  )}
                </div>

                {params.school === 'Outra' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nome da Escola</label>
                    <input 
                      type="text" 
                      title="Nome da Escola"
                      placeholder="Nome da Escola"
                      className="w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 border p-2.5 text-sm"
                      value={params.customSchool}
                      onChange={e => setParams({...params, customSchool: e.target.value})}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Brasão da Prefeitura (Opcional)</label>
                  <input 
                    type="file" 
                    title="Brasão da Prefeitura"
                    placeholder="Brasão da Prefeitura"
                    accept="image/*"
                    className="w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 border p-2.5 text-sm"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setParams({...params, logoBase64: reader.result as string});
                        };
                        reader.readAsDataURL(file);
                      } else {
                        setParams({...params, logoBase64: ''});
                      }
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Título da Atividade</label>
                  <input 
                    type="text" 
                    title="Título da Atividade"
                    placeholder="Título da Atividade"
                    className="w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 border p-2.5 text-sm"
                    value={params.activityTitle}
                    onChange={e => setParams({...params, activityTitle: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className={params.school === 'Escola Municipal Tiradentes' ? "col-span-2" : ""}>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Componente Curricular</label>
                    <select 
                      title="Componente Curricular"
                      aria-label="Componente Curricular"
                      className="w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 border p-2.5 text-sm"
                      value={params.subject}
                      onChange={e => setParams({...params, subject: e.target.value})}
                    >
                      <option value="Matemática">Matemática</option>
                      <option value="Niv. em Matemática">Niv. em Matemática</option>
                    </select>
                  </div>
                  <div className={params.school === 'Escola Municipal Tiradentes' ? "col-span-2" : ""}>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Ano/Série</label>
                    <select 
                      title="Ano/Série"
                      aria-label="Ano/Série"
                      className="w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 border p-2.5 text-sm"
                      value={params.grade}
                      onChange={e => setParams({...params, grade: e.target.value})}
                    >
                      <option value="6º">6º Ano</option>
                      <option value="7º">7º Ano</option>
                      <option value="8º">8º Ano</option>
                      <option value="9º">9º Ano</option>
                    </select>
                  </div>
                  {params.school !== 'Escola Municipal Tiradentes' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Valor/Nota</label>
                      <input 
                        type="text" 
                        title="Valor/Nota"
                        placeholder="Valor/Nota"
                        className="w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 border p-2.5 text-sm"
                        value={params.value}
                        onChange={e => setParams({...params, value: e.target.value})}
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Atividade</label>
                    <select 
                      title="Tipo de Atividade"
                      aria-label="Tipo de Atividade"
                      className="w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 border p-2.5 text-sm"
                      value={params.isIndividual ? 'individual' : 'equipe'}
                      onChange={e => setParams({...params, isIndividual: e.target.value === 'individual'})}
                    >
                      <option value="equipe">Em Equipe</option>
                      <option value="individual">Individual</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Vale Nota?</label>
                    <select 
                      title="Vale Nota?"
                      aria-label="Vale Nota?"
                      className="w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 border p-2.5 text-sm"
                      value={params.isGraded ? 'sim' : 'nao'}
                      onChange={e => setParams({...params, isGraded: e.target.value === 'sim'})}
                    >
                      <option value="sim">Sim</option>
                      <option value="nao">Não</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Professor(a)</label>
                  <input 
                    type="text" 
                    title="Professor(a)"
                    placeholder="Professor(a)"
                    className="w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 border p-2.5 text-sm"
                    value={params.teacher}
                    onChange={e => setParams({...params, teacher: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 mb-6 pt-6 border-t border-slate-100">
                <Settings2 className="w-5 h-5 text-slate-500" />
                <h2 className="text-lg font-medium">Parâmetros da Prova</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Base Curricular</label>
                  <select 
                    title="Base Curricular"
                    aria-label="Base Curricular"
                    className="w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 border p-2.5 text-sm"
                    value={params.curriculum}
                    onChange={e => setParams({...params, curriculum: e.target.value})}
                  >
                    <option value="Currículo de Igarassu">Currículo de Igarassu</option>
                    <option value="Matriz da Luz">Matriz da Luz</option>
                    <option value="Ambos">Ambos (Igarassu + Matriz da Luz)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Qtd. Questões</label>
                    <input 
                      type="number" 
                      title="Quantidade de Questões"
                      placeholder="Quantidade"
                      min="1" 
                      max="30"
                      className="w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 border p-2.5 text-sm"
                      value={params.questionCount}
                      onChange={e => setParams({...params, questionCount: parseInt(e.target.value) || 10})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Dificuldade</label>
                    <select 
                      title="Dificuldade"
                      aria-label="Dificuldade"
                      className="w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 border p-2.5 text-sm"
                      value={params.difficulty}
                      onChange={e => setParams({...params, difficulty: e.target.value})}
                    >
                      <option value="Fácil">Fácil</option>
                      <option value="Médio">Médio</option>
                      <option value="Difícil">Difícil</option>
                      <option value="Mesclado">Mesclado</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tópicos/Conteúdos <span className="text-slate-400 font-normal">(Opcional)</span></label>
                  <input 
                    type="text" 
                    placeholder="Ex: Frações, Equações do 1º grau..."
                    className="w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 border p-2.5 text-sm"
                    value={params.topics}
                    onChange={e => setParams({...params, topics: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contexto Temático <span className="text-slate-400 font-normal">(Opcional)</span></label>
                  <input 
                    type="text" 
                    placeholder="Ex: Turismo local, comércio..."
                    className="w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 border p-2.5 text-sm"
                    value={params.context}
                    onChange={e => setParams({...params, context: e.target.value})}
                  />
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <input 
                    type="checkbox" 
                    id="includeMap"
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    checked={params.includeMap}
                    onChange={e => setParams({...params, includeMap: e.target.checked})}
                  />
                  <label htmlFor="includeMap" className="text-sm font-medium text-slate-700">
                    Incluir Gabarito e Mapa Pedagógico
                  </label>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Gerando Prova...
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5" />
                      Gerar Prova
                    </>
                  )}
                </button>
                
                {error && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100 flex flex-col gap-2">
                    <p>{error}</p>
                    {debugLog.length > 0 && (
                      <button
                        onClick={() => {
                          const logText = debugLog.join('\n');
                          navigator.clipboard.writeText(logText);
                          alert('Log de erros copiado para a área de transferência!');
                        }}
                        className="self-start px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg text-xs font-medium transition-colors"
                      >
                        Copiar Log de Erros (Debug)
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content / Output */}
          <div className="lg:col-span-8 print:col-span-12">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-full min-h-[600px] flex flex-col overflow-hidden print:border-none print:shadow-none">
              {/* Output Header - Hidden when printing */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 print:hidden">
                <div className="flex items-center gap-4">
                  <h3 className="font-medium text-slate-800">Resultado</h3>
                  {examData && (
                    <div className="flex bg-slate-200 p-1 rounded-lg">
                      <button 
                        onClick={() => setViewMode('preview')}
                        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${viewMode === 'preview' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600 hover:text-slate-900'}`}
                      >
                        Visualizar
                      </button>
                      <button 
                        onClick={() => setViewMode('latex')}
                        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${viewMode === 'latex' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600 hover:text-slate-900'}`}
                      >
                        LaTeX
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {viewMode === 'latex' && (
                    <button
                      onClick={handleCopy}
                      disabled={!generatedLatex || isGenerating}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copiado!' : 'Copiar'}
                    </button>
                  )}
                  
                  <button
                    onClick={handleDownloadDocx}
                    disabled={!examData || isGenerating}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FileDown className="w-4 h-4" />
                    DOCX
                  </button>

                  <button
                    onClick={handleDownloadLatex}
                    disabled={!generatedLatex || isGenerating}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4" />
                    .tex
                  </button>

                  <button
                    onClick={handleRunQA}
                    disabled={!examData || isGenerating || isRunningQA}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isRunningQA ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                    {qaReport ? 'Ver Relatório QA' : 'Validar (QA)'}
                  </button>

                  <button
                    onClick={handlePrint}
                    disabled={!examData || isGenerating}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Printer className="w-4 h-4" />
                    Imprimir / PDF
                  </button>
                </div>
              </div>

              {/* Output Body */}
              <div className="flex-1 p-0 relative bg-white print:p-0">
                {isGenerating ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-50/80 backdrop-blur-sm z-10 print:hidden">
                    <Loader2 className="w-8 h-8 animate-spin mb-4 text-indigo-600" />
                    <p className="text-sm font-medium text-slate-700">{generationStep || 'Elaborando questões...'}</p>
                    
                    <div className="w-64 max-w-[80%] h-2 bg-slate-200 rounded-full mt-4 overflow-hidden">
                      <div 
                        className="h-full bg-indigo-600 transition-all duration-500 ease-out rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs mt-2 text-slate-500">{Math.round(progress)}% concluído</p>
                    {retryMessage ? (
                      <p className="text-xs mt-2 text-amber-600 font-medium">{retryMessage}</p>
                    ) : (
                      <p className="text-xs mt-2 text-slate-500">Isso pode levar alguns minutos. Por favor, aguarde.</p>
                    )}
                    {isGenerating && (
                      <p className="text-xs mt-1 text-slate-400">
                        Provedor: <span className={`font-semibold ${activeProvider === 'gemini' ? 'text-blue-500' : activeProvider === 'groq' ? 'text-green-500' : 'text-purple-500'}`}>
                          {activeProvider === 'gemini' ? '🔵 Gemini' : activeProvider === 'groq' ? '🟢 Groq (Llama)' : '🟣 Gemini Flash'}
                        </span>
                      </p>
                    )}
                  </div>
                ) : !examData ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 bg-slate-50 print:hidden">
                    <FileText className="w-12 h-12 text-slate-300 mb-4" />
                    <p className="text-slate-500 font-medium">Nenhuma prova gerada ainda.</p>
                    <p className="text-sm text-slate-400 mt-1">Preencha os parâmetros ao lado e clique em gerar.</p>
                  </div>
                ) : null}
                
                {viewMode === 'latex' && examData && (
                  <pre className="p-6 text-sm font-mono text-slate-300 bg-[#1E1E1E] overflow-auto h-full absolute inset-0 whitespace-pre-wrap break-words print:hidden">
                    {generatedLatex}
                  </pre>
                )}

                {viewMode === 'preview' && examData && (
                  <div className="p-8 max-w-[210mm] mx-auto bg-white print:p-0 print:m-0" ref={printRef}>
                    {/* Header */}
                    <table className="w-full border-collapse border-2 border-black text-sm mb-4">
                      <tbody>
                        {params.school === 'Escola Municipal Tiradentes' ? (
                          <>
                            <tr>
                              <td className="border border-black p-2 w-[25%] text-center align-middle">
                                {params.logoBase64 ? (
                                  <img src={params.logoBase64} alt="Brasão" className="max-h-16 mx-auto" referrerPolicy="no-referrer" />
                                ) : null}
                              </td>
                              <td colSpan={params.isGraded ? 2 : 3} className={`border border-black p-2 text-center font-bold uppercase ${params.isGraded ? 'w-[50%]' : 'w-[75%]'}`}>
                                PREFEITURA MUNICIPAL DE SÃO LOURENÇO DA MATA<br/>
                                SECRETARIA DE EDUCAÇÃO<br/>
                                ESCOLA MUNICIPAL TIRADENTES
                              </td>
                              {params.isGraded && (
                                <td className="border border-black p-2 w-[25%] text-center align-top">
                                  <span className="font-bold uppercase">NOTA</span><br/><br/><br/>
                                </td>
                              )}
                            </tr>
                            <tr>
                              <td colSpan={3} className="border border-black p-2">
                                <span className="font-bold uppercase">{params.isIndividual ? 'ALUNO(A) :' : 'EQUIPE :'}</span> 
                              </td>
                              <td className="border border-black p-2">
                                <span className="font-bold uppercase">DATA:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/2026
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={2} className="border border-black p-2">
                                <span className="font-bold uppercase">COMPONENTE CURRICULAR:</span> {params.subject?.toUpperCase() || 'MATEMÁTICA'}
                              </td>
                              <td className="border border-black p-2 w-[25%]">
                                <span className="font-bold uppercase">ANO/TURMA:</span> 
                              </td>
                              <td className="border border-black p-2 w-[25%]">
                                <span className="font-bold uppercase">PROF:</span> {params.teacher?.toUpperCase()}
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={4} className="border border-black p-2 text-center font-bold uppercase">
                                {params.activityTitle?.toUpperCase() || 'ATIVIDADE 1'}
                              </td>
                            </tr>
                          </>
                        ) : (
                          <>
                            <tr>
                              <td className="border border-black p-2 w-[15%] text-center align-middle" rowSpan={2}>
                                {params.logoBase64 ? (
                                  <img src={params.logoBase64} alt="Brasão" className="max-h-16 mx-auto" referrerPolicy="no-referrer" />
                                ) : null}
                              </td>
                              <td colSpan={3} className="border border-black p-2 text-center font-bold uppercase">
                                PREFEITURA DE {municipio}<br/>
                                SECRETARIA MUNICIPAL DE EDUCAÇÃO<br/>
                                {actualSchool}
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={3} className="border border-black p-2 text-center font-bold uppercase">
                                {params.activityTitle}
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={4} className="border border-black p-2">
                                <span className="font-bold">{params.isIndividual ? 'ALUNO(A):' : 'EQUIPE:'}</span> 
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={2} className="border border-black p-2">
                                <span className="font-bold">Componente Curricular:</span> {params.subject || 'Matemática'}
                              </td>
                              <td colSpan={2} className="border border-black p-2">
                                <span className="font-bold">Ano/Turma:</span> 
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={2} className="border border-black p-2 text-center">
                                <span className="font-bold">Data:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              </td>
                              <td colSpan={2} className="border border-black p-2">
                                <span className="font-bold">Professor:</span> {params.teacher}
                              </td>
                            </tr>
                            {params.isGraded && (
                              <tr>
                                <td colSpan={3} className="border border-black p-2">
                                  
                                </td>
                                <td className="border border-black p-2 w-[20%]">
                                  <span className="font-bold">Nota:</span>
                                </td>
                              </tr>
                            )}
                          </>
                        )}
                      </tbody>
                    </table>

                    {params.isGraded && (
                      <div className="border border-black p-3 mb-8 text-sm">
                        <p className="text-center font-bold mb-2">REGRAS</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                          <div>
                            <p>1. Preencha os seus nomes e sobrenomes da dupla.</p>
                            <p>2. As questões que exigirem cálculos e/ou justificativas só serão consideradas corretas com os mesmos.</p>
                            <p>3. Utilizar letra legível (o que não for compreendido não poderá ser considerado).</p>
                          </div>
                          <div>
                            <p>4. Não é permitido consulta de material escrito, calculadora ou quaisquer equipamento eletrônico. Sob pena de ter sua nota zerada.</p>
                            <p>5. Qualquer ato de indisciplina, desrespeito ao professor ou aos demais colegas ou cópia de respostas de outros colegas será penalizado, a critério do professor, com a nota zero.</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Questions */}
                    <div className="space-y-8">
                      {examData.questions.map((q, index) => (
                        <div key={index} className="break-inside-avoid">
                          <p className="font-bold mb-2">Questão {index + 1}</p>
                          <div className="prose prose-sm max-w-none mb-4">
                            <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                              {formatMarkdownText(q.text)}
                            </Markdown>
                          </div>
                          
                          {q.options && q.options.length > 0 ? (
                            <ol className="list-[lower-alpha] pl-5 space-y-2">
                              {q.options.map((opt, i) => (
                                <li key={i}>
                                  <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                    {formatMarkdownText(opt).replace(/^[a-eA-E][)\.]\s*/, '')}
                                  </Markdown>
                                </li>
                              ))}
                            </ol>
                          ) : (
                            <div className="h-32 border border-dashed border-slate-300 rounded-lg mt-4 print:border-none print:h-40"></div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Gabarito - Page Break before this */}
                    {params.includeMap && (
                      <div className="mt-16 pt-8 border-t-2 border-dashed border-slate-300 print:break-before-page">
                        <h2 className="text-xl font-bold mb-6 text-center">Gabarito e Mapa Pedagógico</h2>
                        <div className="space-y-6">
                          {examData.questions.map((q, index) => (
                            <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-200 print:bg-white print:border-slate-300 break-inside-avoid">
                              <p className="font-bold mb-2">Questão {index + 1}</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm"><strong>Resposta:</strong> {q.answer}</p>
                                  <div className="text-sm mt-2">
                                    <strong>Resolução:</strong>
                                    <div className="prose prose-sm max-w-none mt-1">
                                      <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                        {q.explanation}
                                      </Markdown>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-sm bg-white p-3 rounded border border-slate-100 print:border-slate-200">
                                  <p className="font-semibold mb-1">Metadados Curriculares:</p>
                                  <ul className="list-disc pl-4 space-y-1 text-slate-600 print:text-black">
                                    {q.metadata.habilidadeIgarassu && <li><strong>Igarassu:</strong> {q.metadata.habilidadeIgarassu}</li>}
                                    {q.metadata.descritorMatrizLuz && <li><strong>Matriz da Luz:</strong> {q.metadata.descritorMatrizLuz}</li>}
                                    <li><strong>Nível:</strong> {q.metadata.nivelComplexidade}</li>
                                    <li><strong>Unidade Temática:</strong> {q.metadata.unidadeTematica}</li>
                                    <li><strong>Objeto de Conhecimento:</strong> {q.metadata.objetoConhecimento}</li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* QA Modal */}
      {showQAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm print:hidden">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <h2 className="text-xl font-semibold text-slate-800">Relatório de Controle de Qualidade (QC)</h2>
              </div>
              <button 
                title="Fechar"
                aria-label="Fechar"
                onClick={() => setShowQAModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
              {isApplyingCorrections ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                  <Loader2 className="w-10 h-10 animate-spin mb-4 text-emerald-600" />
                  <p className="text-lg font-medium text-slate-700">Aplicando correções...</p>
                  <p className="text-sm mt-2 text-slate-500">Atualizando a prova e recarregando o documento.</p>
                </div>
              ) : isRunningQA ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                  <Loader2 className="w-10 h-10 animate-spin mb-4 text-emerald-600" />
                  <p className="text-lg font-medium text-slate-700">Analisando a prova...</p>
                  {retryMessage ? (
                    <p className="text-sm mt-2 text-amber-600 font-medium">{retryMessage}</p>
                  ) : (
                    <p className="text-sm mt-2 text-slate-500">Executando as 5 fases de validação.</p>
                  )}
                </div>
              ) : qaReport ? (
                <div className="flex flex-col gap-4">
                  <div className="prose prose-slate max-w-none prose-headings:text-slate-800 prose-a:text-indigo-600">
                    <Markdown>{qaReport}</Markdown>
                  </div>
                  {debugLog.length > 0 && (
                    <button
                      onClick={() => {
                        const logText = debugLog.join('\n');
                        navigator.clipboard.writeText(logText);
                        alert('Log de erros copiado para a área de transferência!');
                      }}
                      className="self-start px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg text-xs font-medium transition-colors"
                    >
                      Copiar Log de Erros (Debug)
                    </button>
                  )}
                </div>
              ) : null}
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3">
              <button
                onClick={() => setShowQAModal(false)}
                disabled={isApplyingCorrections}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Fechar
              </button>
              {pendingCorrectedExam && (
                <button
                  onClick={applyCorrections}
                  disabled={isApplyingCorrections}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isApplyingCorrections ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                  {isApplyingCorrections ? 'Aplicando...' : 'Aplicar Correções'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm print:hidden">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <History className="w-6 h-6 text-indigo-600" />
                <h2 className="text-xl font-semibold text-slate-900">Histórico de Provas (Banco Local)</h2>
              </div>
              <button
                title="Fechar"
                aria-label="Fechar"
                onClick={() => setShowHistoryModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
              {historyExams.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">Nenhuma prova no histórico</h3>
                  <p className="text-slate-500">As provas geradas aparecerão aqui para acesso rápido.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {historyExams.map((exam) => (
                    <div key={exam.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium text-slate-900 line-clamp-1" title={exam.params.topics}>
                          {exam.params.topics}
                        </h4>
                        <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-md whitespace-nowrap">
                          {new Date(exam.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <span className="font-medium">Disciplina:</span> {exam.params.subject}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <span className="font-medium">Ano:</span> {exam.params.grade}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <span className="font-medium">Dificuldade:</span> {exam.params.difficulty}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <span className="font-medium">Questões:</span> {exam.params.questionCount}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setExamData(exam.examData);
                          setLastParams(exam.params);
                          const latex = generateLatex(exam.params, exam.examData);
                          setGeneratedLatex(latex);
                          setShowHistoryModal(false);
                        }}
                        className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        Carregar Prova
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
