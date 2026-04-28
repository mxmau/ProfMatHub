import React, { useState } from 'react';
import { AppData, ScheduleSlot, School, ClassGroup } from '../types';
import { MapPin, ChevronLeft, ChevronRight, GraduationCap, Building2, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format, addDays, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DashboardProps {
  data: AppData;
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Get Day of Week string (Segunda, Terça...)
  const getDayString = (date: Date) => {
    const dayStr = format(date, 'eeee', { locale: ptBR });
    const map: Record<string, string> = {
      'segunda-feira': 'Segunda',
      'terça-feira': 'Terça',
      'quarta-feira': 'Quarta',
      'quinta-feira': 'Quinta',
      'sexta-feira': 'Sexta',
      'sábado': 'Sábado',
      'domingo': 'Domingo'
    };
    return map[dayStr] || dayStr;
  };

  const currentDayStr = getDayString(selectedDate);
  
  // Filter slots for the day
  const todaysSlots = data.schedule
    .filter(slot => slot.day === currentDayStr)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const changeDate = (days: number) => {
    setSelectedDate(addDays(selectedDate, days));
  };

  const getSchool = (id: string): School | undefined => data.schools.find(s => s.id === id);
  const getClass = (id: string): ClassGroup | undefined => data.classes.find(c => c.id === id);

  // Helper to determine if a class is happening right now
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  const isToday = isSameDay(now, selectedDate);

  const getSlotStatus = (slot: ScheduleSlot) => {
    if (!isToday) return 'upcoming';
    
    const [startH, startM] = slot.startTime.split(':').map(Number);
    const [endH, endM] = slot.endTime.split(':').map(Number);
    const startMins = startH * 60 + startM;
    const endMins = endH * 60 + endM;

    if (currentTime >= startMins && currentTime < endMins) return 'current';
    if (currentTime > endMins) return 'past';
    return 'upcoming';
  };

  return (
    <div className="space-y-6">
      {/* Date Header with Date Picker */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center space-y-4 md:space-y-0 md:flex-row md:justify-between">
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
            <button onClick={() => changeDate(-1)} className="p-3 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
            <ChevronLeft size={24} />
            </button>
            
            <div className="flex flex-col items-center">
                <h2 className="text-xl font-bold text-gray-800 capitalize flex items-center gap-2">
                    {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    {isToday && <span className="text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full text-xs">Hoje</span>}
                    <label className="cursor-pointer hover:text-blue-600 flex items-center gap-1">
                        <CalendarIcon size={14} />
                        <span>Mudar data</span>
                        <input 
                            type="date" 
                            className="w-0 h-0 opacity-0 absolute"
                            onChange={(e) => {
                                if (e.target.valueAsDate) {
                                    // Adjust for timezone offset to prevent day shifting
                                    const date = new Date(e.target.valueAsDate.getUTCFullYear(), e.target.valueAsDate.getUTCMonth(), e.target.valueAsDate.getUTCDate());
                                    setSelectedDate(date);
                                }
                            }}
                        />
                    </label>
                </div>
            </div>

            <button onClick={() => changeDate(1)} className="p-3 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
            <ChevronRight size={24} />
            </button>
        </div>

        {/* Daily Summary */}
        <div className="flex gap-4 text-sm border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 w-full md:w-auto justify-center md:justify-end">
             <div className="text-center md:text-right">
                <span className="block text-gray-400 text-xs uppercase font-semibold">Total de Aulas</span>
                <span className="block text-2xl font-bold text-gray-800 leading-none">{todaysSlots.length}</span>
             </div>
        </div>
      </div>

      {/* Timeline List */}
      <div className="space-y-4">
        {todaysSlots.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
            <div className="bg-gray-50 p-4 rounded-full mb-4">
                <CalendarIcon size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700">Dia Livre!</h3>
            <p className="text-gray-500 text-sm">Nenhuma aula agendada para {format(selectedDate, "dd/MM", { locale: ptBR })}.</p>
          </div>
        ) : (
          todaysSlots.map((slot) => {
            const school = getSchool(slot.schoolId);
            const classGroup = getClass(slot.classGroupId);
            const status = getSlotStatus(slot);

            // Dynamic Styles based on Status
            const containerClasses = status === 'current' 
                ? 'bg-blue-600 text-white shadow-xl scale-[1.01] border-blue-500' 
                : status === 'past' 
                ? 'bg-gray-50 text-gray-400 border-gray-100 opacity-75'
                : 'bg-white text-gray-800 border-gray-200 hover:border-blue-300 hover:shadow-md';
            
            const badgeClasses = status === 'current'
                ? 'bg-white/20 text-white'
                : 'bg-gray-100 text-gray-600';

            return (
              <div 
                key={slot.id} 
                className={`flex flex-col sm:flex-row gap-4 p-5 rounded-xl border transition-all duration-300 ${containerClasses}`}
              >
                {/* Time Section */}
                <div className={`flex flex-row sm:flex-col items-center sm:justify-center gap-2 sm:gap-1 min-w-[5rem] sm:border-r ${status === 'current' ? 'border-white/20' : 'border-gray-100'} pr-4`}>
                  <div className="flex items-center gap-1 font-bold text-lg">
                    <Clock size={16} className={status === 'current' ? 'text-blue-200' : 'text-gray-400'} />
                    {slot.startTime}
                  </div>
                  <div className={`hidden sm:block w-px h-4 ${status === 'current' ? 'bg-blue-400' : 'bg-gray-300'}`}></div>
                  <div className="text-sm opacity-80 sm:text-center">
                    até {slot.endTime}
                  </div>
                </div>

                {/* Info Section */}
                <div className="flex-1 space-y-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-bold leading-tight">{classGroup?.name}</h3>
                            <p className={`flex items-center gap-1.5 text-sm mt-1 ${status === 'current' ? 'text-blue-100' : 'text-gray-500'}`}>
                                <GraduationCap size={16} />
                                {classGroup?.grade}
                            </p>
                        </div>
                        {classGroup?.color && (
                            <div className={`w-4 h-4 rounded-full shadow-sm ring-2 ring-white/20 ${classGroup.color}`}></div>
                        )}
                    </div>

                    {/* Tags: School & City */}
                    <div className="flex flex-wrap gap-2">
                        {school && (
                            <>
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wide ${badgeClasses}`}>
                                    <MapPin size={12} />
                                    {school.city}
                                </span>
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium ${badgeClasses}`}>
                                    <Building2 size={12} />
                                    {school.name}
                                </span>
                            </>
                        )}
                    </div>
                    
                    {slot.notes && (
                        <div className={`mt-2 text-sm italic p-2 rounded ${status === 'current' ? 'bg-white/10' : 'bg-yellow-50 text-yellow-700'}`}>
                            📝 {slot.notes}
                        </div>
                    )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Dashboard;