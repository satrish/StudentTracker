import AsyncStorage from '@react-native-async-storage/async-storage';
import type { WeekData } from '../types';

export function getMondayOfWeek(offset: number): Date {
  const today = new Date();
  const day = today.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday + offset * 7);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export function getWeekDates(offset: number): Date[] {
  const monday = getMondayOfWeek(offset);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function mondayToKey(monday: Date, profileId: string): string {
  const yyyy = monday.getFullYear();
  const mm = String(monday.getMonth() + 1).padStart(2, '0');
  const dd = String(monday.getDate()).padStart(2, '0');
  return `kdt_${profileId}_${yyyy}-${mm}-${dd}`;
}

export function weekStorageKey(offset: number, profileId: string): string {
  return mondayToKey(getMondayOfWeek(offset), profileId);
}

export async function loadWeekData(offset: number, profileId: string): Promise<WeekData> {
  const key = weekStorageKey(offset, profileId);
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw) return JSON.parse(raw) as WeekData;
  } catch {
    // ignore
  }
  return {};
}

export async function saveWeekData(offset: number, profileId: string, data: WeekData): Promise<void> {
  const key = weekStorageKey(offset, profileId);
  await AsyncStorage.setItem(key, JSON.stringify(data));
}

export async function getDayDoneCount(date: Date, profileId: string): Promise<number> {
  const dow = date.getDay();
  const diffToMon = dow === 0 ? -6 : 1 - dow;
  const monday = new Date(date);
  monday.setDate(date.getDate() + diffToMon);
  monday.setHours(0, 0, 0, 0);

  const key = mondayToKey(monday, profileId);
  let weekData: WeekData = {};
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw) weekData = JSON.parse(raw);
  } catch { /* ignore */ }

  const dayIndex = dow === 0 ? 6 : dow - 1;
  const dayData = weekData[dayIndex] ?? {};
  return Object.values(dayData).filter(Boolean).length;
}

export async function getStreak(totalActivities: number, profileId: string): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let streak = 0;

  for (let daysBack = 0; daysBack <= 365; daysBack++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - daysBack);

    const dow = checkDate.getDay();
    const diffToMon = dow === 0 ? -6 : 1 - dow;
    const mon = new Date(checkDate);
    mon.setDate(checkDate.getDate() + diffToMon);
    mon.setHours(0, 0, 0, 0);

    const key = mondayToKey(mon, profileId);
    let weekData: WeekData = {};
    try {
      const raw = await AsyncStorage.getItem(key);
      if (raw) weekData = JSON.parse(raw);
    } catch { /* ignore */ }

    const dayIndex = dow === 0 ? 6 : dow - 1;
    const dayData = weekData[dayIndex] ?? {};
    const doneCount = Object.values(dayData).filter(Boolean).length;

    if (doneCount >= totalActivities) {
      streak++;
    } else if (daysBack === 0) {
      continue;
    } else {
      break;
    }
  }

  return streak;
}
