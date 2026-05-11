import React, { useMemo, useState } from 'react';
import { getDayDoneCount, isToday } from '../utils/dateUtils';

interface MonthlyDashboardProps {
  profileId: string;
  totalActivities: number;
  theme: 'kids' | 'cricket';
  onBack: () => void;
}

const THEME = {
  kids: {
    header: 'linear-gradient(135deg, #7C3AED, #EC4899, #F59E0B)',
    bg: 'linear-gradient(135deg, #EDE9FE, #FCE7F3, #FEF3C7)',
    accent: '#7C3AED',
    accentLight: '#EDE9FE',
    perfect: '#10B981',
    label: '⭐ Kids Monthly Progress',
  },
  cricket: {
    header: 'linear-gradient(135deg, #059669, #3B82F6, #F59E0B)',
    bg: 'linear-gradient(135deg, #D1FAE5, #DBEAFE, #FEF3C7)',
    accent: '#059669',
    accentLight: '#D1FAE5',
    perfect: '#3B82F6',
    label: '🏏 Cricket Monthly Progress',
  },
};

const DAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function getCellColor(pct: number, isFuture: boolean): string {
  if (isFuture) return '#F3F4F6';
  if (pct === 0) return '#FEE2E2';
  if (pct < 34)  return '#FED7AA';
  if (pct < 67)  return '#FEF08A';
  if (pct < 100) return '#BBF7D0';
  return '#4ADE80';
}

function getCellTextColor(pct: number, isFuture: boolean): string {
  if (isFuture) return '#9CA3AF';
  if (pct === 0) return '#EF4444';
  if (pct < 34)  return '#D97706';
  if (pct < 67)  return '#92400E';
  if (pct < 100) return '#065F46';
  return '#14532D';
}

export const MonthlyDashboard: React.FC<MonthlyDashboardProps> = ({
  profileId, totalActivities, theme, onBack,
}) => {
  const t = THEME[theme];
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth()); // 0-indexed

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  // Build calendar grid (Mon-Sun)
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDow = firstDay.getDay();
    const startPad = startDow === 0 ? 6 : startDow - 1;
    const days: (Date | null)[] = Array(startPad).fill(null);
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d));
    }
    while (days.length % 7 !== 0) days.push(null);
    return days;
  }, [year, month]);

  // Load completion for each real day
  const dayStats = useMemo(() => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return calendarDays.map((date) => {
      if (!date) return null;
      const isFuture = date > today;
      const done = isFuture ? 0 : getDayDoneCount(date, profileId);
      const pct = totalActivities > 0 ? Math.round((done / totalActivities) * 100) : 0;
      return { date, done, pct, isFuture };
    });
  }, [calendarDays, profileId, totalActivities]);

  // Monthly stats — only past days
  const stats = useMemo(() => {
    const pastDays = dayStats.filter((d) => d && !d.isFuture) as NonNullable<typeof dayStats[0]>[];
    const tracked = pastDays.filter((d) => d.done > 0);
    const perfect = pastDays.filter((d) => d.pct === 100);
    const totalDone = pastDays.reduce((s, d) => s + d.done, 0);
    const avgPct = pastDays.length > 0
      ? Math.round(pastDays.reduce((s, d) => s + d.pct, 0) / pastDays.length)
      : 0;
    const bestDay = pastDays.reduce(
      (best, d) => (d.done > (best?.done ?? -1) ? d : best),
      null as typeof pastDays[0] | null,
    );
    return { tracked: tracked.length, perfect: perfect.length, totalDone, avgPct, bestDay, pastCount: pastDays.length };
  }, [dayStats]);

  // Weekly breakdown
  const weeks = useMemo(() => {
    const result: { label: string; pct: number; days: number }[] = [];
    for (let i = 0; i < dayStats.length; i += 7) {
      const slice = dayStats.slice(i, i + 7).filter((d) => d && !d.isFuture) as NonNullable<typeof dayStats[0]>[];
      if (slice.length === 0) continue;
      const avg = Math.round(slice.reduce((s, d) => s + d.pct, 0) / slice.length);
      const firstReal = slice[0].date;
      result.push({
        label: firstReal.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        pct: avg,
        days: slice.length,
      });
    }
    return result;
  }, [dayStats]);

  return (
    <div className="min-h-screen" style={{ background: t.bg }}>
      {/* Header */}
      <header className="sticky top-0 z-40 shadow-lg" style={{ background: t.header }}>
        <div className="max-w-screen-lg mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-3 py-1.5 rounded-lg text-sm font-bold cursor-pointer flex-shrink-0"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
          >
            ← Back
          </button>
          <span className="text-white font-black text-lg sm:text-xl tracking-tight drop-shadow flex-1">
            {t.label}
          </span>
        </div>
      </header>

      <main className="max-w-screen-lg mx-auto px-4 py-6 space-y-6">

        {/* Month navigation */}
        <div className="bg-white rounded-2xl shadow-md p-4 flex items-center justify-between border border-gray-100">
          <button
            onClick={prevMonth}
            className="px-4 py-2 rounded-xl font-bold text-sm cursor-pointer"
            style={{ background: t.accentLight, color: t.accent }}
          >
            ← Prev
          </button>
          <span className="font-black text-xl text-gray-800">
            {MONTH_NAMES[month]} {year}
          </span>
          <button
            onClick={nextMonth}
            className="px-4 py-2 rounded-xl font-bold text-sm cursor-pointer"
            style={{ background: t.accentLight, color: t.accent }}
          >
            Next →
          </button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Monthly Avg', value: `${stats.avgPct}%`, icon: '📊', color: t.accent },
            { label: 'Perfect Days', value: stats.perfect, icon: '🌟', color: '#10B981' },
            { label: 'Days Tracked', value: `${stats.tracked}/${stats.pastCount}`, icon: '📅', color: '#3B82F6' },
            { label: 'Total Done', value: stats.totalDone, icon: '✅', color: '#F59E0B' },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className="bg-white rounded-2xl shadow-md p-4 text-center border border-gray-100">
              <div className="text-2xl mb-1">{icon}</div>
              <div className="font-black text-2xl" style={{ color }}>{value}</div>
              <div className="text-xs font-semibold text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Calendar heatmap */}
        <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
          <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide mb-4">
            Daily Completion Heatmap
          </h3>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1.5 mb-1.5">
            {DAY_HEADERS.map((d) => (
              <div key={d} className="text-center text-xs font-bold text-gray-400">{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1.5">
            {dayStats.map((stat, i) => {
              if (!stat) {
                return <div key={i} />;
              }
              const { date, pct, isFuture } = stat;
              const today = isToday(date);
              return (
                <div
                  key={i}
                  className="rounded-xl flex flex-col items-center justify-center aspect-square relative"
                  style={{
                    background: getCellColor(pct, isFuture),
                    outline: today ? `2.5px solid ${t.accent}` : undefined,
                    outlineOffset: today ? '1px' : undefined,
                  }}
                  title={`${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}: ${pct}%`}
                >
                  <span
                    className="text-xs font-bold leading-none"
                    style={{ color: getCellTextColor(pct, isFuture) }}
                  >
                    {date.getDate()}
                  </span>
                  {!isFuture && (
                    <span
                      className="text-[9px] font-semibold leading-none mt-0.5"
                      style={{ color: getCellTextColor(pct, isFuture) }}
                    >
                      {pct}%
                    </span>
                  )}
                  {pct === 100 && <span className="text-[10px] leading-none">⭐</span>}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <span className="text-xs text-gray-400 font-semibold">Legend:</span>
            {[
              { color: '#FEE2E2', label: '0%' },
              { color: '#FED7AA', label: '1–33%' },
              { color: '#FEF08A', label: '34–66%' },
              { color: '#BBF7D0', label: '67–99%' },
              { color: '#4ADE80', label: '100% ⭐' },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1">
                <div className="w-4 h-4 rounded" style={{ background: color }} />
                <span className="text-xs text-gray-500">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly breakdown */}
        {weeks.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
            <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide mb-4">
              Weekly Breakdown
            </h3>
            <div className="space-y-3">
              {weeks.map((week, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-600">
                      Week of {week.label}
                    </span>
                    <span className="text-sm font-black" style={{ color: t.accent }}>
                      {week.pct}%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${week.pct}%`,
                        background: week.pct === 100
                          ? 'linear-gradient(90deg, #10B981, #059669)'
                          : t.header,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Best day callout */}
        {stats.bestDay && stats.bestDay.done > 0 && (
          <div
            className="rounded-2xl p-5 text-center shadow-md"
            style={{ background: t.header }}
          >
            <div className="text-3xl mb-2">🏅</div>
            <p className="text-white font-black text-lg">Best Day This Month</p>
            <p className="text-white/90 font-semibold mt-1">
              {stats.bestDay.date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <p className="text-white/80 text-sm mt-1">
              {stats.bestDay.done} / {totalActivities} activities — {stats.bestDay.pct}%
            </p>
          </div>
        )}

      </main>
    </div>
  );
};
