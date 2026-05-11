import { useState, useCallback } from 'react';
import type { WeekData } from '../../../shared/src/types';
import { getWeekDates, weekStorageKey } from '../utils/dateUtils';

function loadData(offset: number, profileId: string): WeekData {
  const key = weekStorageKey(offset, profileId);
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as WeekData;
  } catch {
    // ignore parse errors
  }
  return {};
}

function saveData(offset: number, profileId: string, data: WeekData): void {
  const key = weekStorageKey(offset, profileId);
  localStorage.setItem(key, JSON.stringify(data));
}

export interface TrackerDataHook {
  weekOffset: number;
  setWeekOffset: (offset: number) => void;
  weekDates: Date[];
  data: WeekData;
  toggle: (dayIndex: number, activityId: string) => void;
}

export function useTrackerData(profileId: string): TrackerDataHook {
  const [weekOffset, setWeekOffsetState] = useState(0);
  const [data, setData] = useState<WeekData>(() => loadData(0, profileId));

  const setWeekOffset = useCallback((offset: number) => {
    setWeekOffsetState(offset);
    setData(loadData(offset, profileId));
  }, [profileId]);

  const toggle = useCallback(
    (dayIndex: number, activityId: string) => {
      setData((prev) => {
        const dayData = prev[dayIndex] ?? {};
        const updated: WeekData = {
          ...prev,
          [dayIndex]: {
            ...dayData,
            [activityId]: !dayData[activityId],
          },
        };
        saveData(weekOffset, profileId, updated);
        return updated;
      });
    },
    [weekOffset, profileId]
  );

  const weekDates = getWeekDates(weekOffset);

  return { weekOffset, setWeekOffset, weekDates, data, toggle };
}
