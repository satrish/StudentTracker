import React from 'react';
import { ACTIVITIES, DAYS } from '../../../shared/src/activities';
import type { WeekData } from '../../../shared/src/types';
import { isToday, formatDate } from '../utils/dateUtils';
import { ActivityHeader } from './ActivityHeader';
import { CheckButton } from './CheckButton';

interface TrackerTableProps {
  weekDates: Date[];
  data: WeekData;
  onToggle: (dayIndex: number, activityId: string) => void;
}

const TOTAL = ACTIVITIES.length;

export const TrackerTable: React.FC<TrackerTableProps> = ({ weekDates, data, onToggle }) => {
  return (
    <div className="overflow-x-auto rounded-2xl shadow-lg border border-gray-100">
      <table
        className="border-collapse bg-white"
        style={{ minWidth: '1200px' }}
      >
        <thead>
          <tr>
            <th className="p-3 bg-gradient-to-b from-purple-100 to-pink-50 text-left" style={{ minWidth: '110px' }}>
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wide">Day</span>
            </th>
            {ACTIVITIES.map((activity) => (
              <ActivityHeader key={activity.id} activity={activity} />
            ))}
            <th className="p-3 bg-gradient-to-b from-purple-100 to-pink-50 text-center" style={{ minWidth: '80px' }}>
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wide">Score</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {weekDates.map((date, dayIndex) => {
            const dayData = data[dayIndex] ?? {};
            const doneCount = ACTIVITIES.filter((a) => dayData[a.id]).length;
            const scorePercent = Math.round((doneCount / TOTAL) * 100);
            const todayRow = isToday(date);

            return (
              <tr
                key={dayIndex}
                className={`border-t border-gray-100 transition-colors ${todayRow ? 'bg-pink-50' : 'hover:bg-gray-50'}`}
              >
                {/* Day cell */}
                <td className="p-3" style={{ minWidth: '110px' }}>
                  <div className={`font-bold text-sm ${todayRow ? 'text-pink-600' : 'text-gray-700'}`}>
                    {DAYS[dayIndex]}
                  </div>
                  <div className={`text-xs mt-0.5 ${todayRow ? 'text-pink-400' : 'text-gray-400'}`}>
                    {formatDate(date)}
                  </div>
                  {todayRow && (
                    <span className="inline-block mt-1 px-1.5 py-0.5 bg-pink-500 text-white text-xs rounded-full font-semibold">
                      Today
                    </span>
                  )}
                </td>

                {/* Activity cells */}
                {ACTIVITIES.map((activity) => (
                  <td key={activity.id} className="p-1 text-center align-middle">
                    <CheckButton
                      done={!!dayData[activity.id]}
                      onToggle={() => onToggle(dayIndex, activity.id)}
                    />
                  </td>
                ))}

                {/* Score cell */}
                <td className="p-2 text-center align-middle" style={{ minWidth: '80px' }}>
                  <div className="font-bold text-sm text-gray-700">
                    {doneCount}/{TOTAL}
                  </div>
                  <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden w-14 mx-auto">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${scorePercent}%`,
                        background: scorePercent === 100
                          ? 'linear-gradient(90deg, #10B981, #059669)'
                          : 'linear-gradient(90deg, #F59E0B, #EF4444)',
                      }}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
