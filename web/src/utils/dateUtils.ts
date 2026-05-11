/**
 * Returns the Monday of the week offset from the current week.
 * offset = 0 means current week, -1 = last week, 1 = next week.
 */
export function getMondayOfWeek(offset: number): Date {
  const today = new Date();
  const day = today.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday + offset * 7);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

/**
 * Returns an array of 7 Date objects (Mon–Sun) for the given week offset.
 */
export function getWeekDates(offset: number): Date[] {
  const monday = getMondayOfWeek(offset);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

/**
 * Returns true if the given date is today.
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

/**
 * Formats a date as "25 Mar".
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function mondayToKey(monday: Date, profileId: string): string {
  const yyyy = monday.getFullYear();
  const mm = String(monday.getMonth() + 1).padStart(2, '0');
  const dd = String(monday.getDate()).padStart(2, '0');
  return `kdt_${profileId}_${yyyy}-${mm}-${dd}`;
}

/**
 * Returns the localStorage key for a given week offset and profile.
 * Key format: kdt_{profileId}_YYYY-MM-DD (Monday's date)
 */
export function weekStorageKey(offset: number, profileId: string): string {
  return mondayToKey(getMondayOfWeek(offset), profileId);
}

/**
 * Returns the number of completed activities for a specific date and profile.
 */
export function getDayDoneCount(date: Date, profileId: string): number {
  const dow = date.getDay();
  const diffToMon = dow === 0 ? -6 : 1 - dow;
  const monday = new Date(date);
  monday.setDate(date.getDate() + diffToMon);
  monday.setHours(0, 0, 0, 0);

  const key = mondayToKey(monday, profileId);
  let weekData: Record<string, Record<string, boolean>> = {};
  try {
    const raw = localStorage.getItem(key);
    if (raw) weekData = JSON.parse(raw);
  } catch { /* ignore */ }

  const dayIndex = dow === 0 ? 6 : dow - 1;
  const dayData = weekData[dayIndex] ?? {};
  return Object.values(dayData).filter(Boolean).length;
}

/**
 * Returns the number of consecutive days (going back from today) where
 * all activities were completed. Today is skipped if not yet complete.
 */
export function getStreak(totalActivities: number, profileId: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let streak = 0;

  for (let daysBack = 0; daysBack <= 365; daysBack++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - daysBack);

    const dow = checkDate.getDay(); // 0=Sun
    const diffToMon = dow === 0 ? -6 : 1 - dow;
    const mon = new Date(checkDate);
    mon.setDate(checkDate.getDate() + diffToMon);
    mon.setHours(0, 0, 0, 0);

    const key = mondayToKey(mon, profileId);
    let weekData: Record<string, Record<string, boolean>> = {};
    try {
      const raw = localStorage.getItem(key);
      if (raw) weekData = JSON.parse(raw);
    } catch { /* ignore */ }

    const dayIndex = dow === 0 ? 6 : dow - 1;
    const dayData = weekData[dayIndex] ?? {};
    const doneCount = Object.values(dayData).filter(Boolean).length;

    if (doneCount >= totalActivities) {
      streak++;
    } else if (daysBack === 0) {
      continue; // today not finished yet — don't break the streak
    } else {
      break;
    }
  }

  return streak;
}
