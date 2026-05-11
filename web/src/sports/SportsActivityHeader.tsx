import React from 'react';
import type { SportActivity, SportCategory } from '../../../shared/src/sports-activities';

const SPORT_COLORS: Record<SportCategory, { bg: string; border: string; text: string }> = {
  batting:  { bg: '#FEF3C7', border: '#F59E0B', text: '#92400E' },
  bowling:  { bg: '#FEE2E2', border: '#EF4444', text: '#991B1B' },
  fielding: { bg: '#D1FAE5', border: '#10B981', text: '#065F46' },
  fitness:  { bg: '#DBEAFE', border: '#3B82F6', text: '#1E40AF' },
};

export const SportsActivityHeader: React.FC<{ activity: SportActivity }> = ({ activity }) => {
  const colors = SPORT_COLORS[activity.category];
  return (
    <th
      className="p-1 text-center align-bottom"
      style={{ minWidth: '52px', maxWidth: '52px', backgroundColor: colors.bg }}
    >
      <div className="flex items-center justify-center mx-auto" style={{ height: '90px' }}>
        <div className="rotate-header text-xs font-semibold leading-tight" style={{ color: colors.text }}>
          <span className="mr-1">{activity.emoji}</span>
          {activity.name}
        </div>
      </div>
      <div className="w-full h-1 rounded-full mt-1" style={{ backgroundColor: colors.border }} />
    </th>
  );
};
