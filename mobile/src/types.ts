export type DayData = Record<string, boolean>;
export type WeekData = Record<number, DayData>;

export interface Profile {
  id: string;
  name: string;
  avatar: string;
  pin?: string;
}

export type Mode = 'kids' | 'sports';
export type Gift = { type: 'row' | 'column'; label: string };
