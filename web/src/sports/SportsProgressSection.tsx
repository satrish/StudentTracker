import React from 'react';
import { SPORT_ACTIVITIES } from '../../../shared/src/sports-activities';
import type { WeekData } from '../../../shared/src/types';
import { getStreak } from '../utils/dateUtils';

interface SportsProgressSectionProps {
  weekDates: Date[];
  data: WeekData;
  profileId: string;
}

const TOTAL = SPORT_ACTIVITIES.length;

const CATEGORY_COLORS = {
  batting:  { bg: '#FEF3C7', border: '#F59E0B' },
  bowling:  { bg: '#FEE2E2', border: '#EF4444' },
  fielding: { bg: '#D1FAE5', border: '#10B981' },
  fitness:  { bg: '#DBEAFE', border: '#3B82F6' },
};

function getFitnessMessage(pct: number): string {
  if (pct >= 100) return '🏆🏆🏆 Perfect week! You\'re a cricket champion!';
  if (pct >= 80)  return '🏏🏏 Excellent training! Almost match-ready!';
  if (pct >= 60)  return '🏏 Great effort! Keep grinding!';
  if (pct >= 40)  return '💪 Solid start! More drills to go!';
  if (pct >= 20)  return '🔥 Just warming up! Let\'s go!';
  return '🌱 Every practice session counts — start today!';
}

export const SportsProgressSection: React.FC<SportsProgressSectionProps> = ({ weekDates, data, profileId }) => {
  const streak = getStreak(TOTAL, profileId);
  const today = new Date();
  const relevantDays = weekDates.filter((d) => d <= today);
  const totalPossible = relevantDays.length * TOTAL;
  const totalDone = relevantDays.reduce((sum, _, idx) => {
    const dayIndex = weekDates.indexOf(relevantDays[idx]);
    const dayData = data[dayIndex] ?? {};
    return sum + SPORT_ACTIVITIES.filter((a) => dayData[a.id]).length;
  }, 0);
  const weekPct = totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0;

  const activityStats = SPORT_ACTIVITIES.map((activity) => {
    const doneCount = weekDates.filter((_, dayIndex) => {
      const dayData = data[dayIndex] ?? {};
      return !!dayData[activity.id];
    }).length;
    return { activity, doneCount };
  });

  return (
    <div className="mt-6 space-y-6">
      {/* Weekly progress */}
      <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide">Weekly Progress</h3>
            {streak > 0 && (
              <span
                className="px-2.5 py-1 rounded-full text-xs font-black text-white"
                style={{ background: 'linear-gradient(135deg, #10B981, #3B82F6)' }}
              >
                🔥 {streak} day streak!
              </span>
            )}
          </div>
          <span className="text-lg font-black text-green-600">{weekPct}%</span>
        </div>
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${weekPct}%`,
              background: 'linear-gradient(90deg, #3B82F6, #10B981, #059669)',
            }}
          />
        </div>
        <p className="mt-3 text-center text-base font-semibold text-gray-600">{getFitnessMessage(weekPct)}</p>
      </div>

      {/* Per-activity breakdown */}
      <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
        <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide mb-4">Cricket Training Breakdown</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {activityStats.map(({ activity, doneCount }) => {
            const colors = CATEGORY_COLORS[activity.category];
            const pct = Math.round((doneCount / 7) * 100);
            return (
              <div
                key={activity.id}
                className="rounded-xl p-3 text-center"
                style={{ backgroundColor: colors.bg, borderLeft: `3px solid ${colors.border}` }}
              >
                <div className="text-xl mb-1">{activity.emoji}</div>
                <div className="text-xs font-semibold text-gray-700 leading-tight mb-2">{activity.name}</div>
                <div className="text-sm font-black text-gray-800">{doneCount}/7</div>
                <div className="mt-1.5 h-1.5 bg-white bg-opacity-70 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: colors.border }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
