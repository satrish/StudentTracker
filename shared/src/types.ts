export type DayData = Record<string, boolean>; // activityId -> done
export type WeekData = Record<number, DayData>; // dayIndex (0-6) -> DayData

export interface Profile {
  id: string;
  name: string;
  avatar: string; // emoji
  pin?: string;   // optional 4-digit PIN (stored as plain text — local-only app)
}
