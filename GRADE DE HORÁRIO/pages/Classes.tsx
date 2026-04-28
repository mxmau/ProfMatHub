import React, { useState } from 'react';
import { AppData, ClassGroup, Shift } from '../types';
import { Button } from '../components/ui/Button';
import { Trash2, Edit2, Plus, GraduationCap } from 'lucide-react';
import { COLORS, SHIFTS } from '../constants';

interface ClassesProps {
  data: AppData;
  onUpdateClasses: (classes: ClassGroup[]) => void;
}

const Classes: React.FC<ClassesProps> = ({ data, onUpdateClasses }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [shift, setShift] = useState<Shift>('Manhã');
  const [color, setColor] = useState(COLORS[0]);

  const resetForm = () => {
    setName('');
    setGrade('');
    setSchoolId(data.schools[0]?.id || '');
    setShift('Manhã');
    setColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
    setEditingId(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolId) {
        alert("Cadastre uma escola primeiro!");
        return;
    }
    const newClass: ClassGroup = {
      id: editingId || Date.now().toString(),
      name,
      grade,
      schoolId,
      preferredShift: shift,
      color
    };

    if (editingId) {
      onUpdateClasses(data.classes.map(c => c.id === editingId ? newClass : c));
    } else {
      onUpdateClasses([...data.classes, newClass]);
    }
    setIsFormOpen(false);
    resetForm();
  };

  const handleEdit = (cls: ClassGroup) => {
    setEditingId(cls.id);
    setName(cls.name);
    setGrade(cls.grade);
    setSchoolId(cls.schoolId);
    setShift(cls.preferredShift);
    setColor(cls.color);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza? Isso apagará as aulas agendadas para esta turma.')) {
      onUpdateClasses(data.classes.filter(c => c.id !== id));
    }
  };

  const getSchoolName = (id: string) => data.schools.find(s => s.id === id)?.name || 'Escola Desconhecida';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Turmas</h2>
        <Button onClick={() => { resetForm(); setIsFormOpen(true); }}>
          <Plus size={18} className="mr-2" />
          Nova Turma
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {data.classes.map(cls => (
          <div key={cls.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 relative group overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full ${cls.color}`}></div>
            <div className="pl-3">
              <div className="flex justify-between items-start">
                 <h3 className="text-lg font-bold text-gray-900">{cls.name}</h3>
                 <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded">{cls.preferredShift}</span>
              </div>
              <p className="text-sm font-medium text-gray-500 mb-2">{cls.grade}</p>
              <p className="text-xs text-gray-400 truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                {getSchoolName(cls.schoolId)}
              </p>
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-50 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <button onClick={() => handleEdit(cls)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                <Edit2 size={16} />
              </button>
              <button onClick={() => handleDelete(cls.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
         {data.classes.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-400 bg-white border border-dashed rounded-xl">
             <GraduationCap size={48} className="mx-auto mb-2 opacity-20" />
             <p>Nenhuma turma cadastrada.</p>
          </div>
        )}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              {editingId ? 'Editar Turma' : 'Nova Turma'}
            </h3>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome da Turma</label>
                <input 
                  required
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: 7º Ano A"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Série / Ano</label>
                <input 
                  required
                  type="text" 
                  value={grade} 
                  onChange={(e) => setGrade(e.target.value)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Ensino Fundamental II"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Escola</label>
                <select
                  required
                  value={schoolId}
                  onChange={(e) => setSchoolId(e.target.value)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                    <option value="" disabled>Selecione...</option>
                    {data.schools.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.city})</option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Turno Principal</label>
                <div className="mt-1 flex gap-2">
                    {SHIFTS.map(s => (
                        <button
                            key={s}
                            type="button"
                            onClick={() => setShift(s)}
                            className={`flex-1 py-2 text-sm rounded-lg border ${
                                shift === s 
                                ? 'bg-blue-50 border-blue-500 text-blue-700' 
                                : 'bg-white border-gray-200 text-gray-600'
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Etiqueta Visual</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-6 h-6 rounded-full ${c} ${color === c ? 'ring-2 ring-offset-1 ring-blue-500' : ''}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-8">
                <Button variant="secondary" type="button" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
                <Button type="submit">Salvar</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Classes;