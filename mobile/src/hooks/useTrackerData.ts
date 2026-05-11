import { useState, useCallback, useEffect } from 'react';
import type { WeekData } from '../types';
import { getWeekDates, loadWeekData, saveWeekData } from '../utils/dateUtils';

export interface TrackerDataHook {
  weekOffset: number;
  setWeekOffset: (offset: number) => void;
  weekDates: Date[];
  data: WeekData;
  loading: boolean;
  toggle: (dayIndex: number, activityId: string) => void;
}

export function useTrackerData(profileId: string): TrackerDataHook {
  const [weekOffset, setWeekOffsetState] = useState(0);
  const [data, setData] = useState<WeekData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    loadWeekData(weekOffset, profileId).then((loaded) => {
      setData(loaded);
      setLoading(false);
    });
  }, [weekOffset, profileId]);

  const setWeekOffset = useCallback((offset: number) => {
    setWeekOffsetState(offset);
  }, []);

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
        saveWeekData(weekOffset, profileId, updated);
        return updated;
      });
    },
    [weekOffset, profileId]
  );

  const weekDates = getWeekDates(weekOffset);

  return { weekOffset, setWeekOffset, weekDates, data, loading, toggle };
}
