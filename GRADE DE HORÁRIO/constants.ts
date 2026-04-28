import { DayOfWeek, Shift } from "./types";

export const DAYS: DayOfWeek[] = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export const SHIFTS: Shift[] = ['Manhã', 'Tarde', 'Noite'];

export const COLORS = [
  'bg-red-500', 'bg-orange-500', 'bg-amber-500', 
  'bg-yellow-500', 'bg-lime-500', 'bg-green-500', 
  'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500', 
  'bg-sky-500', 'bg-blue-500', 'bg-indigo-500', 
  'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 
  'bg-pink-500', 'bg-rose-500'
];

export const CITY_PRESETS = {
  SLM: {
    city: 'São Lourenço da Mata',
    duration: 45,
    slots: 6,
    morningStart: "07:15",
    afternoonStart: "13:00",
    eveningStart: "18:40"
  },
  IGARASSU: {
    city: 'Igarassu',
    duration: 50,
    slots: 5,
    morningStart: "07:30",
    afternoonStart: "13:00",
    eveningStart: "18:30"
  }
};