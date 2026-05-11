import React, { useEffect, useState } from 'react';
import { ACTIVITIES, DAYS } from '../../../shared/src/activities';
import type { WeekData } from '../../../shared/src/types';
import { isToday, formatDate } from '../utils/dateUtils';
import { CheckButton } from './CheckButton';

const CATEGORY_META = {
  morning: { border: '#F59E0B', bg: '#FFFBEB', text: '#92400E', label: '🌅 Morning' },
  school:  { border: '#10B981', bg: '#F0FDF4', text: '#065F46', label: '🏫 After School' },
  evening: { border: '#3B82F6', bg: '#EFF6FF', text: '#1E40AF', label: '🌆 Evening' },
  night:   { border: '#8B5CF6', bg: '#FAF5FF', text: '#5B21B6', label: '🌙 Night' },
} as const;

const CATEGORIES = ['morning', 'school', 'evening', 'night'] as const;

interface DayViewProps {
  weekDates: Date[];
  data: WeekData;
  onToggle: (dayIndex: number, activityId: string) => void;
  weekOffset: number;
}

export const DayView: React.FC<DayViewProps> = ({ weekDates, data, onToggle, weekOffset }) => {
  const todayIndex = weekDates.findIndex(isToday);
  const [selectedDay, setSelectedDay] = useState(todayIndex === -1 ? 0 : todayIndex);

  useEffect(() => {
    const idx = weekDates.findIndex(isToday);
    setSelectedDay(idx === -1 ? 0 : idx);
  }, [weekOffset]); // eslint-disable-line react-hooks/exhaustive-deps

  const dayData = data[selectedDay] ?? {};
  const total = ACTIVITIES.length;
  const doneCount = ACTIVITIES.filter((a) => dayData[a.id]).length;
  const pct = Math.round((doneCount / total) * 100);

  return (
    <div className="space-y-4">
      {/* Day selector */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {weekDates.map((date, i) => {
          const today = isToday(date);
          const sel = i === selectedDay;
          return (
            <button
              key={i}
              onClick={() => setSelectedDay(i)}
              className="flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-xl font-bold transition-all cursor-pointer text-center"
              style={
                sel
                  ? {
                      background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                      color: 'white',
                      boxShadow: '0 4px 12px rgba(124,58,237,0.35)',
                    }
                  : today
                  ? {
                      background: '#FCE7F3',
                      color: '#BE185D',
                      border: '2px solid #EC4899',
                    }
                  : {
                      background: '#F3F4F6',
                      color: '#6B7280',
                    }
              }
            >
              <span className="text-xs">{DAYS[i].slice(0, 3)}</span>
              <span className="text-xs font-normal mt-0.5">{formatDate(date).split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Day progress */}
      <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-black text-gray-800">{DAYS[selectedDay]}</span>
            <span className="text-gray-400 text-sm">{formatDate(weekDates[selectedDay])}</span>
            {isToday(weekDates[selectedDay]) && (
              <span className="px-1.5 py-0.5 bg-pink-500 text-white text-xs rounded-full font-semibold">
                Today
              </span>
            )}
          </div>
          <span className="font-black text-purple-700 text-lg">
            {doneCount}/{total}
          </span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              background:
                pct === 100
                  ? 'linear-gradient(90deg, #10B981, #059669)'
                  : 'linear-gradient(90deg, #818CF8, #C084FC, #F472B6)',
            }}
          />
        </div>
        {pct === 100 && (
          <p className="mt-2 text-center text-sm font-bold text-green-600">
            ⭐ All done! Amazing work! ⭐
          </p>
        )}
      </div>

      {/* Activities by category */}
      {CATEGORIES.map((cat) => {
        const catActivities = ACTIVITIES.filter((a) => a.category === cat);
        const meta = CATEGORY_META[cat];
        return (
          <div
            key={cat}
            className="rounded-2xl overflow-hidden shadow-sm"
            style={{ border: `1.5px solid ${meta.border}` }}
          >
            <div
              className="px-4 py-2.5 font-bold text-sm text-white"
              style={{ background: meta.border }}
            >
              {meta.label}
            </div>
            <div style={{ backgroundColor: meta.bg }}>
              {catActivities.map((activity, idx) => {
                const done = !!dayData[activity.id];
                return (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between px-4 py-3"
                    style={
                      idx > 0
                        ? { borderTop: `1px solid ${meta.border}28` }
                        : undefined
                    }
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{activity.emoji}</span>
                      <span
                        className="font-semibold text-sm"
                        style={{ color: meta.text }}
                      >
                        {activity.name}
                      </span>
                    </div>
                    <CheckButton
                      done={done}
                      onToggle={() => onToggle(selectedDay, activity.id)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
