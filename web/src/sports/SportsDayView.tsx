import React, { useEffect, useState } from 'react';
import { SPORT_ACTIVITIES, SPORT_DAYS } from '../../../shared/src/sports-activities';
import type { WeekData } from '../../../shared/src/types';
import { isToday, formatDate } from '../utils/dateUtils';
import { CheckButton } from '../components/CheckButton';

const CATEGORY_META = {
  batting:  { border: '#F59E0B', bg: '#FFFBEB', text: '#92400E', label: '🏏 Batting' },
  bowling:  { border: '#EF4444', bg: '#FFF5F5', text: '#991B1B', label: '🎳 Bowling' },
  fielding: { border: '#10B981', bg: '#F0FDF4', text: '#065F46', label: '🤲 Fielding' },
  fitness:  { border: '#3B82F6', bg: '#EFF6FF', text: '#1E40AF', label: '⚡ Fitness' },
} as const;

const CATEGORIES = ['batting', 'bowling', 'fielding', 'fitness'] as const;

interface SportsDayViewProps {
  weekDates: Date[];
  data: WeekData;
  onToggle: (dayIndex: number, activityId: string) => void;
  weekOffset: number;
}

export const SportsDayView: React.FC<SportsDayViewProps> = ({ weekDates, data, onToggle, weekOffset }) => {
  const todayIndex = weekDates.findIndex(isToday);
  const [selectedDay, setSelectedDay] = useState(todayIndex === -1 ? 0 : todayIndex);

  useEffect(() => {
    const idx = weekDates.findIndex(isToday);
    setSelectedDay(idx === -1 ? 0 : idx);
  }, [weekOffset]); // eslint-disable-line react-hooks/exhaustive-deps

  const dayData = data[selectedDay] ?? {};
  const total = SPORT_ACTIVITIES.length;
  const doneCount = SPORT_ACTIVITIES.filter((a) => dayData[a.id]).length;
  const pct = Math.round((doneCount / total) * 100);

  return (
    <div className="space-y-4">
      {/* Day selector */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
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
                  ? { background: 'linear-gradient(135deg, #059669, #3B82F6)', color: 'white', boxShadow: '0 4px 12px rgba(5,150,105,0.35)' }
                  : today
                  ? { background: '#D1FAE5', color: '#065F46', border: '2px solid #10B981' }
                  : { background: '#F3F4F6', color: '#6B7280' }
              }
            >
              <span className="text-xs">{SPORT_DAYS[i].slice(0, 3)}</span>
              <span className="text-xs font-normal mt-0.5">{formatDate(date).split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Day progress */}
      <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-black text-gray-800">{SPORT_DAYS[selectedDay]}</span>
            <span className="text-gray-400 text-sm">{formatDate(weekDates[selectedDay])}</span>
            {isToday(weekDates[selectedDay]) && (
              <span className="px-1.5 py-0.5 bg-green-500 text-white text-xs rounded-full font-semibold">Today</span>
            )}
          </div>
          <span className="font-black text-green-700 text-lg">{doneCount}/{total}</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              background: pct === 100
                ? 'linear-gradient(90deg, #10B981, #059669)'
                : 'linear-gradient(90deg, #3B82F6, #10B981)',
            }}
          />
        </div>
        {pct === 100 && (
          <p className="mt-2 text-center text-sm font-bold text-green-600">🏆 Full workout complete! Beast mode! 🏆</p>
        )}
      </div>

      {/* Activities by category */}
      {CATEGORIES.map((cat) => {
        const catActivities = SPORT_ACTIVITIES.filter((a) => a.category === cat);
        const meta = CATEGORY_META[cat];
        return (
          <div key={cat} className="rounded-2xl overflow-hidden shadow-sm" style={{ border: `1.5px solid ${meta.border}` }}>
            <div className="px-4 py-2.5 font-bold text-sm text-white" style={{ background: meta.border }}>
              {meta.label}
            </div>
            <div style={{ backgroundColor: meta.bg }}>
              {catActivities.map((activity, idx) => {
                const done = !!dayData[activity.id];
                return (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between px-4 py-3"
                    style={idx > 0 ? { borderTop: `1px solid ${meta.border}28` } : undefined}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{activity.emoji}</span>
                      <span className="font-semibold text-sm" style={{ color: meta.text }}>{activity.name}</span>
                    </div>
                    <CheckButton done={done} onToggle={() => onToggle(selectedDay, activity.id)} />
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
