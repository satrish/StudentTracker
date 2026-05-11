import React from 'react';
import { ACTIVITIES } from '../../../shared/src/activities';
import type { WeekData } from '../../../shared/src/types';
import { getStreak } from '../utils/dateUtils';

interface ProgressSectionProps {
  weekDates: Date[];
  data: WeekData;
  profileId: string;
}

const TOTAL = ACTIVITIES.length;

function getStarMessage(pct: number): string {
  if (pct >= 100) return '⭐⭐⭐⭐⭐ Perfect week! You\'re amazing!';
  if (pct >= 80)  return '⭐⭐⭐⭐ Excellent work! Almost there!';
  if (pct >= 60)  return '⭐⭐⭐ Great effort! Keep it up!';
  if (pct >= 40)  return '⭐⭐ Good start! You can do better!';
  if (pct >= 20)  return '⭐ Just started! Let\'s go!';
  return '🌱 Every journey starts with one step!';
}

const CATEGORY_COLORS = {
  morning: { bg: '#FEF3C7', border: '#F59E0B' },
  school:  { bg: '#D1FAE5', border: '#10B981' },
  evening: { bg: '#DBEAFE', border: '#3B82F6' },
  night:   { bg: '#F3E8FF', border: '#8B5CF6' },
};

export const ProgressSection: React.FC<ProgressSectionProps> = ({ weekDates, data, profileId }) => {
  const streak = getStreak(TOTAL, profileId);

  // Calculate weekly progress — only include past days and today
  const today = new Date();
  const relevantDays = weekDates.filter(
    (d) => d <= today
  );

  const totalPossible = relevantDays.length * TOTAL;
  const totalDone = relevantDays.reduce((sum, _, idx) => {
    // idx corresponds to day index relative to weekDates, but we need dayIndex in week
    const dayIndex = weekDates.indexOf(relevantDays[idx]);
    const dayData = data[dayIndex] ?? {};
    return sum + ACTIVITIES.filter((a) => dayData[a.id]).length;
  }, 0);

  const weekPct = totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0;

  // Per-activity stats
  const activityStats = ACTIVITIES.map((activity) => {
    const doneCount = weekDates.filter((_, dayIndex) => {
      const dayData = data[dayIndex] ?? {};
      return !!dayData[activity.id];
    }).length;
    return { activity, doneCount };
  });

  return (
    <div className="mt-6 space-y-6">
      {/* Weekly progress bar */}
      <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide">
              Weekly Progress
            </h3>
            {streak > 0 && (
              <span
                className="px-2.5 py-1 rounded-full text-xs font-black text-white"
                style={{ background: 'linear-gradient(135deg, #F59E0B, #EF4444)' }}
              >
                🔥 {streak} day streak!
              </span>
            )}
          </div>
          <span className="text-lg font-black text-purple-600">{weekPct}%</span>
        </div>
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${weekPct}%`,
              background: 'linear-gradient(90deg, #818CF8, #C084FC, #F472B6)',
            }}
          />
        </div>
        <p className="mt-3 text-center text-base font-semibold text-gray-600">
          {getStarMessage(weekPct)}
        </p>
      </div>

      {/* Per-activity breakdown */}
      <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
        <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide mb-4">
          Activity Breakdown
        </h3>
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
                <div className="text-xs font-semibold text-gray-700 leading-tight mb-2">
                  {activity.name}
                </div>
                <div className="text-sm font-black text-gray-800">
                  {doneCount}/7
                </div>
                <div className="mt-1.5 h-1.5 bg-white bg-opacity-70 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: colors.border,
                    }}
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
