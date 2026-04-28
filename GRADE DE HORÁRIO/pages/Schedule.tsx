import React, { useState } from 'react';
import { AppData, ScheduleSlot, DayOfWeek, Shift } from '../types';
import { DAYS, SHIFTS } from '../constants';
import { addMinutes, TIMES_AFTERNOON, TIMES_MORNING } from '../services/storage';
import { Button } from '../components/ui/Button';
import { 
  Trash2, Plus, Wand2, X, 
  LayoutGrid, CalendarDays, Clock, Printer, Eraser, Type, Minus, Plus as PlusIcon, Save, Smartphone 
} from 'lucide-react';

interface ScheduleProps {
  data: AppData;
  onUpdateSchedule: (newSchedule: ScheduleSlot[]) => void;
}

type ViewMode = 'daily' | 'weekly';

const Schedule: React.FC<ScheduleProps> = ({ data, onUpdateSchedule }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('daily');
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Segunda');
  
  // -- Modals State --
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAutoOpen, setIsAutoOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // -- Edit State --
  const [editingSlotIndex, setEditingSlotIndex] = useState<number | null>(null);
  const [editingShift, setEditingShift] = useState<Shift>('Manhã');
  const [editingDay, setEditingDay] = useState<DayOfWeek>('Segunda');
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>('');
  const [selectedClassId, setSelectedClassId] = useState<string>('');

  // -- Auto Generator State --
  const [autoStep, setAutoStep] = useState(1);
  const [availability, setAvailability] = useState<Record<string, string>>({});
  const [classCounts, setClassCounts] = useState<Record<string, number>>({});
  const [previewSchedule, setPreviewSchedule] = useState<ScheduleSlot[]>([]);

  // -- Print State --
  const [printConfig, setPrintConfig] = useState({
    showMorning: true,
    showAfternoon: true,
    fontSize: 12, // in pt
    orientation: 'landscape' as 'portrait' | 'landscape'
  });

  // --------------------------------------------------------
  // HELPER FUNCTIONS
  // --------------------------------------------------------

  const getSlotStructure = (schoolId: string, shift: Shift, index: number) => {
    if (shift === 'Tarde' && index < TIMES_AFTERNOON.length) {
        return {
            start: TIMES_AFTERNOON[index].start,
            end: TIMES_AFTERNOON[index].end
        };
    }
    const school = data.schools.find(s => s.id === schoolId);
    if (!school) return { start: '00:00', end: '00:00' };

    let start = school.morningStart;
    if (shift === 'Tarde') start = school.afternoonStart;
    if (shift === 'Noite') start = school.eveningStart;

    let time = start;
    for (let i = 0; i < index; i++) {
        time = addMinutes(time, school.durationMinutes);
    }
    const endTime = addMinutes(time, school.durationMinutes);
    return { start: time, end: endTime };
  };

  const handleManualSave = () => {
    alert('Alterações salvas com sucesso!');
  };

  const handleSaveSlot = () => {
    if (editingSlotIndex === null || !selectedSchoolId || !selectedClassId) return;
    const { start, end } = getSlotStructure(selectedSchoolId, editingShift, editingSlotIndex);
    const newSlot: ScheduleSlot = {
      id: Date.now().toString(),
      day: editingDay,
      shift: editingShift,
      slotIndex: editingSlotIndex,
      startTime: start,
      endTime: end,
      schoolId: selectedSchoolId,
      classGroupId: selectedClassId
    };
    const filtered = data.schedule.filter(s => 
      !(s.day === editingDay && s.shift === editingShift && s.slotIndex === editingSlotIndex)
    );
    onUpdateSchedule([...filtered, newSlot]);
    closeModal();
  };

  const handleDeleteSlot = (id: string) => {
     const filtered = data.schedule.filter(s => s.id !== id);
     onUpdateSchedule(filtered);
  };

  const handleClearSchedule = (scope: 'Manhã' | 'Tarde' | 'Ambos') => {
    if (!confirm(`Tem certeza que deseja apagar todas as aulas de: ${scope}?`)) return;
    let newSchedule = scope === 'Ambos' ? [] : data.schedule.filter(s => s.shift !== scope);
    onUpdateSchedule(newSchedule);
    setIsClearModalOpen(false);
  };

  const triggerPrint = () => {
    const printArea = document.getElementById('printable-area');
    if (!printArea) return;
    setIsPrintModalOpen(false);

    // Color definitions for Tailwind classes
    const colorCSS = `
      .bg-red-500{background-color:#ef4444!important}.bg-orange-500{background-color:#f97316!important}
      .bg-amber-500{background-color:#f59e0b!important}.bg-yellow-500{background-color:#eab308!important}
      .bg-lime-500{background-color:#84cc16!important}.bg-green-500{background-color:#22c55e!important}
      .bg-emerald-500{background-color:#10b981!important}.bg-teal-500{background-color:#14b8a6!important}
      .bg-cyan-500{background-color:#06b6d4!important}.bg-sky-500{background-color:#0ea5e9!important}
      .bg-blue-500{background-color:#3b82f6!important}.bg-indigo-500{background-color:#6366f1!important}
      .bg-violet-500{background-color:#8b5cf6!important}.bg-purple-500{background-color:#a855f7!important}
      .bg-fuchsia-500{background-color:#d946ef!important}.bg-pink-500{background-color:#ec4899!important}
      .bg-rose-500{background-color:#f43f5e!important}.bg-gray-200{background-color:#e5e7eb!important}
      .bg-gray-100{background-color:#f3f4f6!important}.bg-gray-50{background-color:#f9fafb!important}
    `;

    // Strategy: hide the React root, insert a temp print div, print, then cleanup.
    // This avoids breaking React's virtual DOM.
    const root = document.getElementById('root');
    if (!root) return;

    // Build standalone print styles
    const printStyles = `
      <style id="temp-print-style">
        @page{size:A4 ${printConfig.orientation};margin:10mm}
        *{box-sizing:border-box}
        body{font-family:Arial,Helvetica,sans-serif;background:#fff;margin:0;padding:10px;
          -webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}
        table{width:100%;border-collapse:collapse}
        td,th{border:1px solid #000;padding:6px;font-size:${printConfig.fontSize}pt}
        .print-font-main{font-size:1.1em;font-weight:bold}
        .print-font-sub{font-size:.75em}
        .print-title{font-size:1.5em}
        .print-page{page-break-after:always}
        .print-page:last-child{page-break-after:auto}
        .print-cell-container{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:50px;padding:4px}
        .font-bold{font-weight:bold}.text-center{text-align:center}
        .uppercase{text-transform:uppercase}.tracking-widest{letter-spacing:.15em}
        .leading-tight{line-height:1.2}.mt-1{margin-top:4px}.mt-6{margin-top:24px}
        .mb-2{margin-bottom:8px}.mb-6{margin-bottom:24px}.pb-2{padding-bottom:8px}
        .p-1{padding:4px}.p-2{padding:8px}.text-sm{font-size:.875em}
        .text-2xl{font-size:1.5em}.text-lg{font-size:1.125em}
        .text-right{text-align:right}.italic{font-style:italic}
        .border-b-2{border-bottom:2px solid #000}
        .opacity-90{opacity:.9}.font-medium{font-weight:500}
        .text-gray-500{color:#6b7280}
        .w-full{width:100%}.h-full{height:100%}.h-20{height:80px}.w-32{width:128px}
        .flex{display:flex}.flex-col{flex-direction:column}
        .items-center{align-items:center}.justify-center{justify-content:center}
        ${colorCSS}
      </style>
    `;

    // Create temp container
    const tempDiv = document.createElement('div');
    tempDiv.id = 'temp-print-container';
    tempDiv.innerHTML = printStyles + printArea.innerHTML;

    // Hide React app, show temp content
    root.style.display = 'none';
    document.body.appendChild(tempDiv);

    // Small delay so the browser re-renders
    setTimeout(() => {
      window.print();

      // Cleanup: restore React app
      const restore = () => {
        root.style.display = '';
        const tc = document.getElementById('temp-print-container');
        if (tc) tc.remove();
        const ts = document.getElementById('temp-print-style');
        if (ts) ts.remove();
        window.removeEventListener('afterprint', restore);
      };
      window.addEventListener('afterprint', restore);
      // Fallback for browsers that don't fire afterprint
      setTimeout(restore, 5000);
    }, 100);
  };

  const openModal = (day: DayOfWeek, shift: Shift, index: number, existingSlot?: ScheduleSlot) => {
    setEditingDay(day);
    setEditingShift(shift);
    setEditingSlotIndex(index);
    if (existingSlot) {
      setSelectedSchoolId(existingSlot.schoolId);
      setSelectedClassId(existingSlot.classGroupId);
    } else {
      if (data.schools.length > 0) setSelectedSchoolId(data.schools[0].id);
      setSelectedClassId('');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSlotIndex(null);
  };

  // --------------------------------------------------------
  // AUTO GENERATOR LOGIC
  // --------------------------------------------------------
  const initAutoGenerator = () => {
    const counts: Record<string, number> = {};
    data.classes.forEach(c => counts[c.id] = 2); 
    setClassCounts(counts);
    const smartAvailability: Record<string, string> = {};
    data.schedule.forEach(slot => {
        const key = `${slot.day}-${slot.shift}`;
        if (!smartAvailability[key]) smartAvailability[key] = slot.schoolId;
    });
    setAvailability(smartAvailability);
    setPreviewSchedule([]);
    setAutoStep(1);
    setIsAutoOpen(true);
  };

  const handleAvailabilityToggle = (day: DayOfWeek, shift: Shift, schoolId: string) => {
    const key = `${day}-${shift}`;
    setAvailability(prev => ({...prev, [key]: prev[key] === schoolId ? '' : schoolId }));
  };

  const runGenerator = () => {
    const newSchedule: ScheduleSlot[] = [];
    const remainingCounts = { ...classCounts };
    for (const day of DAYS) {
        for (const shift of SHIFTS) {
            const key = `${day}-${shift}`;
            const schoolId = availability[key];
            if (!schoolId) continue;
            const school = data.schools.find(s => s.id === schoolId);
            if (!school) continue;
            const schoolClasses = data.classes.filter(c => c.schoolId === schoolId);
            for (let i = 0; i < school.slotsPerShift; i++) {
                const candidate = schoolClasses.find(c => remainingCounts[c.id] > 0);
                if (candidate) {
                     const { start, end } = getSlotStructure(schoolId, shift, i);
                     newSchedule.push({
                        id: `auto-${Date.now()}-${Math.random()}`,
                        day, shift, slotIndex: i, startTime: start, endTime: end,
                        schoolId: school.id, classGroupId: candidate.id
                     });
                     remainingCounts[candidate.id]--;
                }
            }
        }
    }
    setPreviewSchedule(newSchedule);
    setAutoStep(3);
  };

  const applyAutoSchedule = () => {
    onUpdateSchedule(previewSchedule);
    setIsAutoOpen(false);
  };

  // --------------------------------------------------------
  // RENDER HELPERS
  // --------------------------------------------------------

  const renderCellContent = (day: DayOfWeek, shift: Shift, index: number, showTime = true, isPrint = false) => {
    const slot = data.schedule.find(s => s.day === day && s.shift === shift && s.slotIndex === index);
    const school = slot ? data.schools.find(s => s.id === slot.schoolId) : null;
    const classGroup = slot ? data.classes.find(c => c.id === slot.classGroupId) : null;

    if (isPrint) {
        if (!slot) return <div className="h-full w-full"></div>;
        const bgColor = classGroup?.color || 'bg-gray-200';
        return (
            <div className={`print-cell-container flex flex-col items-center justify-center h-full w-full p-1 ${bgColor}`} style={{ minHeight: '100%', width: '100%' }}>
                <div className="font-bold text-center leading-tight print-font-main" style={{ color: 'white' }}>{classGroup?.name}</div>
                <div className="opacity-90 font-medium tracking-wide uppercase mt-1 print-font-sub" style={{ color: 'white' }}>{school?.city === 'São Lourenço da Mata' ? 'SLM' : 'IGA'}</div>
            </div>
        );
    }

    let timeLabel = slot ? `${slot.startTime} - ${slot.endTime}` : '';
    if (!slot) {
        if (shift === 'Manhã' && index < TIMES_MORNING.length) timeLabel = `${TIMES_MORNING[index].start} - ${TIMES_MORNING[index].end}`;
        else if (shift === 'Tarde' && index < TIMES_AFTERNOON.length) timeLabel = `${TIMES_AFTERNOON[index].start} - ${TIMES_AFTERNOON[index].end}`;
    }

    if (!slot) {
        return (
            <div onClick={() => openModal(day, shift, index)} className="h-full min-h-[60px] flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg hover:border-blue-300 hover:bg-gray-50 cursor-pointer transition-colors p-2 text-center">
                {showTime && <span className="text-[10px] text-gray-400 mb-1">{timeLabel}</span>}
                <Plus size={16} className="text-gray-300" />
            </div>
        );
    }

    return (
        <div onClick={() => openModal(day, shift, index, slot)} className={`h-full min-h-[60px] p-2 rounded-lg border-l-4 shadow-sm cursor-pointer hover:shadow-md transition-all relative group bg-white ${classGroup?.color ? classGroup.color.replace('bg-', 'border-') : 'border-gray-300'}`}>
             <div className="flex justify-between items-start">
                <div>
                    <div className="font-bold text-gray-800 text-sm leading-tight">{classGroup?.name}</div>
                    {showTime && <div className="text-[10px] text-gray-500 font-mono mt-0.5">{slot.startTime} - {slot.endTime}</div>}
                </div>
             </div>
             <div className="mt-1 flex items-center justify-between">
                <span className={`text-[10px] px-1.5 py-0.5 rounded text-white ${school?.color || 'bg-gray-400'}`}>{school?.city === 'São Lourenço da Mata' ? 'SLM' : 'IGA'}</span>
                <button onClick={(e) => { e.stopPropagation(); handleDeleteSlot(slot.id); }} className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-opacity">
                    <Trash2 size={12} />
                </button>
             </div>
        </div>
    );
  };

  const renderPrintableTable = (shift: 'Manhã' | 'Tarde') => {
      const times = shift === 'Manhã' ? TIMES_MORNING : TIMES_AFTERNOON;
      const slotCount = shift === 'Manhã' ? 6 : 5;
      return (
        <div className="print-page">
            <h1 className="text-center font-bold text-2xl mb-2 uppercase print-title">Grade Horária - Professor(a)</h1>
            <h2 className="text-center font-bold text-lg mb-6 border-b-2 border-black pb-2 uppercase tracking-widest">{shift}</h2>
            <table className="print-table w-full border-collapse border border-black">
                <thead>
                    <tr>
                        <th className="border border-black bg-gray-100 p-2 w-32 text-center font-bold">Horário</th>
                        {DAYS.map(d => <th key={d} className="border border-black bg-gray-100 p-2 text-center uppercase font-bold">{d}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({length: slotCount}).map((_, i) => (
                        <tr key={`${shift}-row-${i}`}>
                            <td className="border border-black text-center p-2 bg-gray-50">
                                <div className="font-bold">{i+1}º Aula</div>
                                <div className="text-sm">{times[i]?.start} - {times[i]?.end}</div>
                            </td>
                            {DAYS.map(d => (
                                <td key={d} className="border border-black p-0 h-20 align-middle w-40">
                                    {renderCellContent(d, shift, i, true, true)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-6 text-sm text-gray-500 text-right italic">Gerado por ProfOrganiza PE</div>
        </div>
      );
  };

  return (
    <div className="space-y-6">
      {/* PRINT CSS — hide everything except #printable-area */}
      <style>{`
        @media print {
          @page { 
            size: A4 ${printConfig.orientation}; 
            margin: 10mm; 
          }

          /* Hide EVERYTHING by default */
          body > * {
            display: none !important;
          }

          /* The React root must stay visible so #printable-area inside it renders */
          #root, #__next, #app, [data-reactroot] {
            display: block !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          /* Hide all direct children of root except our area */
          #root > *:not(#printable-area),
          #__next > *:not(#printable-area) {
            display: none !important;
          }

          /* But walk the tree: #printable-area may be nested deeper.
             So we also mark .space-y-6 parent visible but hide its siblings. */
          .space-y-6 {
            display: block !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .space-y-6 > *:not(#printable-area) {
            display: none !important;
          }

          /* Force #printable-area to show */
          #printable-area {
            display: block !important;
            visibility: visible !important;
            position: static !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            background: white !important;
          }

          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background-color: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* FORCE FONT SIZE ON ALL TABLE ELEMENTS */
          .print-table, .print-table td, .print-table th {
            font-size: ${printConfig.fontSize}pt !important;
          }
          .print-font-main { font-size: 1.1em !important; }
          .print-font-sub { font-size: 0.75em !important; }
          .print-title { font-size: 1.5em !important; }

          /* Page breaks */
          .print-page {
            page-break-after: always;
            break-after: page;
            margin-bottom: 0;
          }
          .print-page:last-child {
            page-break-after: auto;
            break-after: auto;
          }

          /* Force Vibrant Colors */
          .bg-red-500 { background-color: #ef4444 !important; }
          .bg-orange-500 { background-color: #f97316 !important; }
          .bg-amber-500 { background-color: #f59e0b !important; }
          .bg-yellow-500 { background-color: #eab308 !important; }
          .bg-lime-500 { background-color: #84cc16 !important; }
          .bg-green-500 { background-color: #22c55e !important; }
          .bg-emerald-500 { background-color: #10b981 !important; }
          .bg-teal-500 { background-color: #14b8a6 !important; }
          .bg-cyan-500 { background-color: #06b6d4 !important; }
          .bg-sky-500 { background-color: #0ea5e9 !important; }
          .bg-blue-500 { background-color: #3b82f6 !important; }
          .bg-indigo-500 { background-color: #6366f1 !important; }
          .bg-violet-500 { background-color: #8b5cf6 !important; }
          .bg-purple-500 { background-color: #a855f7 !important; }
          .bg-fuchsia-500 { background-color: #d946ef !important; }
          .bg-pink-500 { background-color: #ec4899 !important; }
          .bg-rose-500 { background-color: #f43f5e !important; }
          .bg-gray-200 { background-color: #e5e7eb !important; }
        }
      `}</style>

      {/* HEADER & CONTROLS */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Grade Horária</h2>
          <p className="text-gray-500 text-sm">Gerencie suas aulas da Manhã e Tarde.</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
            <div className="flex bg-gray-100 p-1 rounded-lg mr-2">
                <button onClick={() => setViewMode('daily')} className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${viewMode === 'daily' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}><LayoutGrid size={16} /> <span className="hidden sm:inline">Diário</span></button>
                <button onClick={() => setViewMode('weekly')} className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${viewMode === 'weekly' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}><CalendarDays size={16} /> <span className="hidden sm:inline">Semanal</span></button>
            </div>
            <button onClick={() => setIsClearModalOpen(true)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Limpar Grade"><Eraser size={20} /></button>
            <button onClick={() => setIsPrintModalOpen(true)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Imprimir"><Printer size={20} /></button>
            <div className="h-6 w-px bg-gray-300 mx-1 hidden md:block"></div>
            <Button variant="primary" onClick={handleManualSave}><Save size={16} className="mr-2" />Salvar</Button>
            <Button variant="secondary" onClick={initAutoGenerator}><Wand2 size={16} className="mr-2" />Gerar</Button>
        </div>
      </div>

      {/* VIEWS */}
      {viewMode === 'daily' && (
        <div className="space-y-4 print:hidden">
            <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide bg-white p-2 rounded-xl border border-gray-200">
                {DAYS.map(day => (
                <button key={day} onClick={() => setSelectedDay(day)} className={`flex-1 min-w-[100px] px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${selectedDay === day ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>{day}</button>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100"><div className="bg-yellow-100 p-2 rounded-full text-yellow-600"><Clock size={18} /></div><h3 className="font-bold text-gray-700">Manhã</h3></div>
                    <div className="space-y-3">{Array.from({ length: 6 }).map((_, i) => (<div key={i} className="flex gap-3"><div className="w-8 flex items-center justify-center font-bold text-gray-300 text-sm">{i + 1}º</div><div className="flex-1">{renderCellContent(selectedDay, 'Manhã', i)}</div></div>))}</div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100"><div className="bg-orange-100 p-2 rounded-full text-orange-600"><Clock size={18} /></div><h3 className="font-bold text-gray-700">Tarde</h3></div>
                    <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => (<div key={i} className="flex gap-3"><div className="w-8 flex items-center justify-center font-bold text-gray-300 text-sm">{i + 1}º</div><div className="flex-1">{renderCellContent(selectedDay, 'Tarde', i)}</div></div>))}</div>
                </div>
            </div>
        </div>
      )}

      {viewMode === 'weekly' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden print:hidden">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] border-collapse">
                    <thead>
                        <tr>
                            <th className="p-3 border-b border-r bg-gray-50 text-left w-20 sticky left-0 z-10">Horário</th>
                            {DAYS.map(day => (<th key={day} className="p-3 border-b border-gray-100 text-center font-bold text-gray-700 bg-gray-50 min-w-[140px]">{day}</th>))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        <tr className="bg-blue-50/30"><td colSpan={DAYS.length + 1} className="p-2 text-xs font-bold text-blue-800 uppercase tracking-wider text-center border-b border-blue-100">Manhã</td></tr>
                        {Array.from({ length: 6 }).map((_, idx) => (
                            <tr key={`m-${idx}`}>
                                <td className="p-2 border-r bg-gray-50 text-xs font-medium text-gray-500 text-center sticky left-0 z-10">{idx + 1}º Aula<div className="text-[9px] opacity-75 mt-0.5">{TIMES_MORNING[idx]?.start}</div></td>
                                {DAYS.map(day => (<td key={day} className="p-1 border-r border-gray-100 h-24 align-top">{renderCellContent(day, 'Manhã', idx, false)}</td>))}
                            </tr>
                        ))}
                        <tr className="bg-orange-50/30"><td colSpan={DAYS.length + 1} className="p-2 text-xs font-bold text-orange-800 uppercase tracking-wider text-center border-b border-orange-100 border-t border-t-gray-200">Tarde</td></tr>
                        {Array.from({ length: 5 }).map((_, idx) => (
                            <tr key={`a-${idx}`}>
                                <td className="p-2 border-r bg-gray-50 text-xs font-medium text-gray-500 text-center sticky left-0 z-10">{idx + 1}º Aula<div className="text-[9px] opacity-75 mt-0.5">{TIMES_AFTERNOON[idx]?.start}</div></td>
                                {DAYS.map(day => (<td key={day} className="p-1 border-r border-gray-100 h-24 align-top">{renderCellContent(day, 'Tarde', idx, false)}</td>))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}

      {/* PRINT CONFIG MODAL */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm print:hidden">
             <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                 <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-2"><Printer className="text-blue-600" /><h3 className="text-lg font-bold">Configurações de Impressão</h3></div>
                    <button onClick={() => setIsPrintModalOpen(false)}><X className="text-gray-400" /></button>
                 </div>
                 <div className="p-6 overflow-y-auto flex-1 space-y-8">
                    {/* Orientation */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">Orientação da Página</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => setPrintConfig(p => ({...p, orientation: 'portrait'}))} className={`p-4 border rounded-xl flex flex-col items-center gap-2 ${printConfig.orientation === 'portrait' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white text-gray-600 hover:bg-gray-50'}`}><Smartphone className="w-8 h-8" /><span className="text-sm font-medium">Retrato (Vertical)</span></button>
                            <button onClick={() => setPrintConfig(p => ({...p, orientation: 'landscape'}))} className={`p-4 border rounded-xl flex flex-col items-center gap-2 ${printConfig.orientation === 'landscape' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white text-gray-600 hover:bg-gray-50'}`}><div className="transform rotate-90"><Smartphone className="w-8 h-8" /></div><span className="text-sm font-medium">Paisagem (Horizontal)</span></button>
                        </div>
                    </div>
                    {/* Font Size */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2"><Type size={18} /> Tamanho da Letra na Impressão</h4>
                        <div className="flex items-center gap-6 bg-gray-50 p-4 rounded-xl">
                            <button onClick={() => setPrintConfig(p => ({...p, fontSize: Math.max(6, p.fontSize - 1)}))} className="p-3 bg-white border border-gray-200 rounded-full hover:bg-gray-100 transition-colors shadow-sm"><Minus size={20}/></button>
                            <div className="text-center min-w-[80px]">
                                <span className="text-3xl font-bold text-blue-600">{printConfig.fontSize}</span>
                                <span className="text-xs block text-gray-400 font-medium">pt (pontos)</span>
                            </div>
                            <button onClick={() => setPrintConfig(p => ({...p, fontSize: Math.min(24, p.fontSize + 1)}))} className="p-3 bg-white border border-gray-200 rounded-full hover:bg-gray-100 transition-colors shadow-sm"><PlusIcon size={20}/></button>
                        </div>
                        <p className="mt-2 text-xs text-gray-400">Dica: 12pt é o padrão ideal. Para colocar tudo em uma folha, tente 9pt ou 10pt.</p>
                    </div>
                    {/* Shifts */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-700 mb-3">Turnos Incluídos</h4>
                        <div className="flex gap-6">
                            <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg hover:bg-gray-50"><input type="checkbox" checked={printConfig.showMorning} onChange={e => setPrintConfig(p => ({...p, showMorning: e.target.checked}))} className="w-5 h-5 text-blue-600" /><span>Manhã</span></label>
                            <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg hover:bg-gray-50"><input type="checkbox" checked={printConfig.showAfternoon} onChange={e => setPrintConfig(p => ({...p, showAfternoon: e.target.checked}))} className="w-5 h-5 text-blue-600" /><span>Tarde</span></label>
                        </div>
                    </div>
                 </div>
                 <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
                    <Button variant="secondary" onClick={() => setIsPrintModalOpen(false)}>Cancelar</Button>
                    <Button onClick={triggerPrint} className="px-8"><Printer size={18} className="mr-2"/> Imprimir Agora</Button>
                 </div>
             </div>
        </div>
      )}

      {/* PRINTABLE AREA — hidden on screen, visible only in @media print */}
      <div id="printable-area" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
          {printConfig.showMorning && renderPrintableTable('Manhã')}
          {printConfig.showAfternoon && renderPrintableTable('Tarde')}
      </div>

      {/* Manual Modal (Add/Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm print:hidden">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-start mb-4">
                    <div><h3 className="text-lg font-bold text-gray-800">{editingSlotIndex !== null ? `Editar ${editingSlotIndex + 1}º Horário` : 'Nova Aula'}</h3><p className="text-sm text-gray-500">{editingDay} - {editingShift}</p></div>
                    <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
                </div>
                <div className="space-y-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Escola</label><select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={selectedSchoolId} onChange={(e) => setSelectedSchoolId(e.target.value)}><option value="">Selecione...</option>{data.schools.map(s => (<option key={s.id} value={s.id}>{s.name} ({s.city})</option>))}</select></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Turma</label><select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} disabled={!selectedSchoolId}><option value="">Selecione...</option>{data.classes.filter(c => c.schoolId === selectedSchoolId).map(c => (<option key={c.id} value={c.id}>{c.name} - {c.grade}</option>))}</select></div>
                </div>
                <div className="flex justify-end gap-2 mt-6"><Button variant="secondary" onClick={closeModal}>Cancelar</Button><Button onClick={handleSaveSlot} disabled={!selectedSchoolId || !selectedClassId}>Salvar</Button></div>
            </div>
        </div>
      )}

      {/* CLEAR MODAL */}
      {isClearModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm print:hidden">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
                <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4"><Eraser className="text-red-600" size={24} /></div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Limpar Grade</h3>
                <p className="text-gray-500 text-sm mb-6">Qual período você deseja limpar?</p>
                <div className="space-y-2">
                    <button onClick={() => handleClearSchedule('Manhã')} className="w-full py-2.5 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors">Apenas Manhã</button>
                    <button onClick={() => handleClearSchedule('Tarde')} className="w-full py-2.5 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors">Apenas Tarde</button>
                    <button onClick={() => handleClearSchedule('Ambos')} className="w-full py-2.5 rounded-lg bg-red-50 border border-red-100 text-red-700 font-medium hover:bg-red-100 transition-colors">Limpar Tudo</button>
                </div>
                <button onClick={() => setIsClearModalOpen(false)} className="mt-4 text-gray-400 hover:text-gray-600 text-sm underline">Cancelar</button>
            </div>
        </div>
      )}

      {/* AUTO MODAL */}
      {isAutoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm print:hidden">
             <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center"><h3 className="text-xl font-bold">Gerador Automático (Passo {autoStep}/3)</h3><button onClick={() => setIsAutoOpen(false)}><X /></button></div>
                <div className="p-6 overflow-y-auto flex-1">
                    {autoStep === 1 && (
                        <div>
                             <p className="mb-4 text-sm text-gray-600">Selecione a escola para cada turno/dia:</p>
                             <table className="w-full text-sm">
                                <thead><tr><th></th>{DAYS.map(d => <th key={d} className="p-2">{d}</th>)}</tr></thead>
                                <tbody>
                                    {SHIFTS.filter(s => s !== 'Noite').map(shift => (
                                        <tr key={shift}><td className="font-bold p-2">{shift}</td>{DAYS.map(day => {
                                                const k = `${day}-${shift}`;
                                                const sid = availability[k];
                                                const s = data.schools.find(sch => sch.id === sid);
                                                return (<td key={day} className="border p-2 text-center">{s ? <div onClick={() => handleAvailabilityToggle(day,shift,sid)} className={`text-white text-[10px] p-1 rounded cursor-pointer ${s.color}`}>{s.name}</div> : <div className="text-gray-300 text-[10px]">Livre</div>}<div className="flex justify-center gap-1 mt-1">{data.schools.map(sch => <div key={sch.id} onClick={() => handleAvailabilityToggle(day,shift,sch.id)} className={`w-2 h-2 rounded-full cursor-pointer ${sch.color}`} />)}</div></td>)
                                            })}</tr>
                                    ))}
                                </tbody>
                             </table>
                        </div>
                    )}
                    {autoStep === 2 && (<div className="grid grid-cols-2 gap-4">{data.classes.map(c => (<div key={c.id} className="border p-3 rounded flex justify-between"><span>{c.name}</span><div className="flex gap-2"><button onClick={() => setClassCounts(p => ({...p, [c.id]: (p[c.id]||0)-1}))}>-</button><span>{classCounts[c.id]||0}</span><button onClick={() => setClassCounts(p => ({...p, [c.id]: (p[c.id]||0)+1}))}>+</button></div></div>))}</div>)}
                    {autoStep === 3 && (<div className="grid grid-cols-3 gap-2">{previewSchedule.map(sl => (<div key={sl.id} className="text-xs border p-1 rounded">{sl.day} {sl.shift} - {data.classes.find(c=>c.id===sl.classGroupId)?.name}</div>))}</div>)}
                </div>
                <div className="p-6 border-t flex justify-end gap-2">{autoStep > 1 && <Button variant="secondary" onClick={() => setAutoStep(p=>p-1)}>Voltar</Button>}{autoStep < 3 ? <Button onClick={() => { if(autoStep===2) runGenerator(); else setAutoStep(p=>p+1)}}>Próximo</Button> : <Button onClick={applyAutoSchedule}>Salvar</Button>}</div>
             </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;