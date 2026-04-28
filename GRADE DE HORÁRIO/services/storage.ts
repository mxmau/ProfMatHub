import { AppData, ClassGroup, ScheduleSlot, School } from "../types";
import { COLORS } from "../constants";

const STORAGE_KEY = "proforganiza_pe_v1";

// --- PRE-POPULATED DATA ---

const SCHOOL_SLM_ID = "school_tiradentes";
const SCHOOL_IG_ID = "school_elcida";

const schools: School[] = [
  {
    id: SCHOOL_SLM_ID,
    name: "Escola Municipal Tiradentes",
    city: "São Lourenço da Mata",
    durationMinutes: 45,
    slotsPerShift: 6,
    morningStart: "07:15",
    afternoonStart: "13:00",
    eveningStart: "18:40",
    color: "bg-blue-500"
  },
  {
    id: SCHOOL_IG_ID,
    name: "Escola Elcida Ramos de Souza",
    city: "Igarassu",
    durationMinutes: 50,
    slotsPerShift: 5,
    morningStart: "07:30",
    afternoonStart: "13:00",
    eveningStart: "18:30",
    color: "bg-emerald-500"
  }
];

// Helper to create classes
const createClass = (id: string, name: string, grade: string, schoolId: string, color: string): ClassGroup => ({
  id, name, grade, schoolId, preferredShift: "Manhã", color
});

const classes: ClassGroup[] = [
  // SLM - Tiradentes
  createClass("t_7a", "7º Ano A", "7º Ano", SCHOOL_SLM_ID, "bg-red-500"),
  createClass("t_7b", "7º Ano B", "7º Ano", SCHOOL_SLM_ID, "bg-orange-500"),
  createClass("t_7c", "7º Ano C", "7º Ano", SCHOOL_SLM_ID, "bg-amber-500"),
  createClass("t_7d", "7º Ano D", "7º Ano", SCHOOL_SLM_ID, "bg-yellow-500"),
  createClass("t_6a", "6º Ano A", "6º Ano", SCHOOL_SLM_ID, "bg-lime-500"),
  createClass("t_6b", "6º Ano B", "6º Ano", SCHOOL_SLM_ID, "bg-green-500"),
  createClass("t_6c", "6º Ano C", "6º Ano", SCHOOL_SLM_ID, "bg-emerald-500"),

  // IGARASSU - Elcida
  createClass("ig_7b", "7º Ano B", "7º Ano", SCHOOL_IG_ID, "bg-cyan-500"),
  createClass("ig_7c", "7º Ano C", "7º Ano", SCHOOL_IG_ID, "bg-sky-500"),
  createClass("ig_6c", "6º Ano C", "6º Ano", SCHOOL_IG_ID, "bg-indigo-500"),
];

// Schedule Times for SLM (Matches the image provided)
export const TIMES_MORNING = [
  { start: "07:15", end: "08:00" }, // 1
  { start: "08:00", end: "08:45" }, // 2
  { start: "08:45", end: "09:30" }, // 3
  // Break 09:30 - 09:50 implied
  { start: "09:50", end: "10:35" }, // 4
  { start: "10:35", end: "11:20" }, // 5
  { start: "11:20", end: "12:00" }, // 6
];

// Specific Afternoon times requested by user (No interval)
export const TIMES_AFTERNOON = [
    { start: "13:00", end: "13:50" }, // 1
    { start: "13:50", end: "14:40" }, // 2
    { start: "14:40", end: "15:30" }, // 3
    { start: "15:30", end: "16:20" }, // 4
    { start: "16:20", end: "17:10" }, // 5
];

const createSlot = (day: string, slotIndex: number, classId: string, note?: string): ScheduleSlot => ({
  id: `slot_${day}_${slotIndex}`,
  day: day as any,
  shift: "Manhã",
  slotIndex,
  startTime: TIMES_MORNING[slotIndex].start,
  endTime: TIMES_MORNING[slotIndex].end,
  schoolId: SCHOOL_SLM_ID,
  classGroupId: classId,
  notes: note
});

const schedule: ScheduleSlot[] = [
  // SEGUNDA
  createSlot("Segunda", 0, "t_7a"),
  createSlot("Segunda", 1, "t_7c"),
  createSlot("Segunda", 2, "t_7c"),
  createSlot("Segunda", 3, "t_7a"),
  createSlot("Segunda", 4, "t_7d"),
  createSlot("Segunda", 5, "t_7d"),

  // TERÇA
  createSlot("Terça", 0, "t_7c"),
  createSlot("Terça", 1, "t_7b"),
  createSlot("Terça", 2, "t_7b"),
  createSlot("Terça", 3, "t_7d"),
  createSlot("Terça", 4, "t_7d"),
  createSlot("Terça", 5, "t_6c", "Niv. de Matemática"),

  // QUARTA
  createSlot("Quarta", 0, "t_7d"),
  createSlot("Quarta", 1, "t_7d"),
  createSlot("Quarta", 2, "t_7c"),
  createSlot("Quarta", 3, "t_7c"),
  createSlot("Quarta", 4, "t_6b", "Niv. de Matemática"), 
  createSlot("Quarta", 5, "t_7a"),

  // QUINTA
  createSlot("Quinta", 0, "t_6b", "Niv. de Matemática"),
  createSlot("Quinta", 1, "t_7a"),
  createSlot("Quinta", 2, "t_7a"),
  createSlot("Quinta", 3, "t_6c", "Niv. de Matemática"),
  createSlot("Quinta", 4, "t_7b"),
  createSlot("Quinta", 5, "t_7c"),

  // SEXTA
  createSlot("Sexta", 0, "t_7c"),
  createSlot("Sexta", 1, "t_7b"),
  createSlot("Sexta", 2, "t_6a", "Niv. de Matemática"),
  createSlot("Sexta", 3, "t_6a", "Niv. de Matemática"),
  createSlot("Sexta", 4, "t_7a"),
  createSlot("Sexta", 5, "t_7b"),
];

// Correction for Quarta specifically to match image exactly
const quartaCorrection = [
    createSlot("Quarta", 3, "t_7b"), // Slot 4 in list (index 3) is 7B
];
// Apply correction
const finalSchedule = schedule.filter(s => !(s.day === 'Quarta' && s.slotIndex === 3)).concat(quartaCorrection);


const DEFAULT_DATA: AppData = {
  schools,
  classes,
  schedule: finalSchedule
};

export const loadData = (): AppData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_DATA;
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load data", e);
    return DEFAULT_DATA;
  }
};

export const saveData = (data: AppData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save data", e);
  }
};

// Utilities to generate time strings
export const addMinutes = (time: string, mins: number): string => {
  const [h, m] = time.split(':').map(Number);
  const totalMinutes = h * 60 + m + mins;
  const newH = Math.floor(totalMinutes / 60) % 24;
  const newM = totalMinutes % 60;
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
};