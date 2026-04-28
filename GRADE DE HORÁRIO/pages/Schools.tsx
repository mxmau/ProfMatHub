import React, { useState } from 'react';
import { AppData, School, City } from '../types';
import { Button } from '../components/ui/Button';
import { Trash2, Edit2, Plus, Building2, RotateCcw } from 'lucide-react';
import { CITY_PRESETS, COLORS } from '../constants';

interface SchoolsProps {
  data: AppData;
  onUpdateSchools: (schools: School[]) => void;
}

const Schools: React.FC<SchoolsProps> = ({ data, onUpdateSchools }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [city, setCity] = useState<City>('São Lourenço da Mata');
  const [duration, setDuration] = useState(45);
  const [slots, setSlots] = useState(6);
  const [morningStart, setMorningStart] = useState("07:30");
  const [color, setColor] = useState(COLORS[0]);

  const resetForm = () => {
    setName('');
    setCity('São Lourenço da Mata');
    applyPreset('São Lourenço da Mata');
    setEditingId(null);
    setColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
  };

  const applyPreset = (cityName: City) => {
    if (cityName === 'São Lourenço da Mata') {
        setDuration(CITY_PRESETS.SLM.duration);
        setSlots(CITY_PRESETS.SLM.slots);
        setMorningStart(CITY_PRESETS.SLM.morningStart);
    } else if (cityName === 'Igarassu') {
        setDuration(CITY_PRESETS.IGARASSU.duration);
        setSlots(CITY_PRESETS.IGARASSU.slots);
        setMorningStart(CITY_PRESETS.IGARASSU.morningStart);
    }
  };

  const handleCityChange = (newCity: City) => {
    setCity(newCity);
    applyPreset(newCity);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newSchool: School = {
      id: editingId || Date.now().toString(),
      name,
      city,
      durationMinutes: duration,
      slotsPerShift: slots,
      morningStart,
      afternoonStart: "13:00", 
      eveningStart: "18:30",
      color
    };

    if (editingId) {
      onUpdateSchools(data.schools.map(s => s.id === editingId ? newSchool : s));
    } else {
      onUpdateSchools([...data.schools, newSchool]);
    }
    setIsFormOpen(false);
    resetForm();
  };

  const handleEdit = (school: School) => {
    setEditingId(school.id);
    setName(school.name);
    setCity(school.city);
    setDuration(school.durationMinutes);
    setSlots(school.slotsPerShift);
    setMorningStart(school.morningStart);
    setColor(school.color);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza? Isso pode afetar turmas e horários vinculados.')) {
      onUpdateSchools(data.schools.filter(s => s.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Escolas</h2>
        <Button onClick={() => { resetForm(); setIsFormOpen(true); }}>
          <Plus size={18} className="mr-2" />
          Nova Escola
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.schools.map(school => (
          <div key={school.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide bg-gray-100 text-gray-600`}>
                  {school.city}
                </span>
                <div className={`w-4 h-4 rounded-full ${school.color}`}></div>
              </div>
              <h3 className="text-lg font-bold text-gray-900">{school.name}</h3>
              
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-600">
                <div className="bg-gray-50 p-2 rounded">
                  <span className="block text-xs text-gray-400 uppercase">Duração</span>
                  <span className="font-semibold">{school.durationMinutes} min</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="block text-xs text-gray-400 uppercase">Aulas/Turno</span>
                  <span className="font-semibold">{school.slotsPerShift}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
              <button onClick={() => handleEdit(school)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                <Edit2 size={18} />
              </button>
              <button onClick={() => handleDelete(school.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {data.schools.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-400 bg-white border border-dashed rounded-xl">
             <Building2 size={48} className="mx-auto mb-2 opacity-20" />
             <p>Nenhuma escola cadastrada.</p>
          </div>
        )}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              {editingId ? 'Editar Escola' : 'Nova Escola'}
            </h3>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome da Escola</label>
                <input 
                  required
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ex: Escola Estadual..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Cidade</label>
                <div className="mt-1 grid grid-cols-2 gap-2">
                    {(['São Lourenço da Mata', 'Igarassu'] as City[]).map((c) => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => handleCityChange(c)}
                            className={`p-3 rounded-lg text-sm border font-medium ${
                                city === c 
                                ? 'bg-blue-50 border-blue-500 text-blue-700' 
                                : 'bg-white border-gray-200 text-gray-600'
                            }`}
                        >
                            {c}
                        </button>
                    ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Duração Aula (min)</label>
                    <div className="relative">
                        <input 
                        type="number" 
                        value={duration} 
                        onChange={(e) => setDuration(parseInt(e.target.value))}
                        className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
                        />
                         <button 
                            type="button" 
                            title="Restaurar padrão da cidade"
                            onClick={() => setDuration(city === 'São Lourenço da Mata' ? 45 : 50)}
                            className="absolute right-2 top-3 text-gray-400 hover:text-blue-500"
                        ><RotateCcw size={14} /></button>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Aulas por Turno</label>
                     <div className="relative">
                        <input 
                        type="number" 
                        value={slots} 
                        onChange={(e) => setSlots(parseInt(e.target.value))}
                        className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
                        />
                         <button 
                            type="button" 
                             title="Restaurar padrão da cidade"
                            onClick={() => setSlots(city === 'São Lourenço da Mata' ? 6 : 5)}
                            className="absolute right-2 top-3 text-gray-400 hover:text-blue-500"
                        ><RotateCcw size={14} /></button>
                    </div>
                </div>
              </div>

              <div>
                 <label className="block text-sm font-medium text-gray-700">Início Manhã</label>
                 <input 
                      type="time" 
                      value={morningStart} 
                      onChange={(e) => setMorningStart(e.target.value)}
                      className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
                    />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cor de Identificação</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-8 h-8 rounded-full ${c} ${color === c ? 'ring-4 ring-offset-1 ring-blue-200' : ''}`}
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

export default Schools;