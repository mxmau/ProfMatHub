export type City = 'São Lourenço da Mata' | 'Igarassu' | 'Outra';

export type Shift = 'Manhã' | 'Tarde' | 'Noite';

export type DayOfWeek = 'Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta' | 'Sábado';

export interface School {
  id: string;
  name: string;
  city: City;
  durationMinutes: number;
  slotsPerShift: number;
  morningStart: string; // "07:30"
  afternoonStart: string; // "13:00"
  eveningStart: string; // "18:30"
  color: string;
}

export interface ClassGroup {
  id: string;
  name: string;
  grade: string;
  schoolId: string;
  preferredShift: Shift;
  color: string;
}

export interface ScheduleSlot {
  id: string;
  day: DayOfWeek;
  shift: Shift;
  slotIndex: number; // 0 to N-1
  startTime: string; // Calculated
  endTime: string; // Calculated
  schoolId: string;
  classGroupId: string;
  notes?: string;
}

// Helper interface for the grid view
export interface GridCell {
  day: DayOfWeek;
  shift: Shift;
  slotIndex: number;
  timeLabel: string; // "07:30 - 08:15"
  assignedSlot?: ScheduleSlot;
}

export interface AppData {
  schools: School[];
  classes: ClassGroup[];
  schedule: ScheduleSlot[];
}