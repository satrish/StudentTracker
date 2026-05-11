import React from 'react';
import type { Activity } from '../../../shared/src/activities';

const CATEGORY_COLORS: Record<Activity['category'], { bg: string; border: string; text: string }> = {
  morning: { bg: '#FEF3C7', border: '#F59E0B', text: '#92400E' },
  school:  { bg: '#D1FAE5', border: '#10B981', text: '#065F46' },
  evening: { bg: '#DBEAFE', border: '#3B82F6', text: '#1E40AF' },
  night:   { bg: '#F3E8FF', border: '#8B5CF6', text: '#5B21B6' },
};

interface ActivityHeaderProps {
  activity: Activity;
}

export const ActivityHeader: React.FC<ActivityHeaderProps> = ({ activity }) => {
  const colors = CATEGORY_COLORS[activity.category];
  return (
    <th
      className="p-1 text-center align-bottom"
      style={{ minWidth: '52px', maxWidth: '52px', backgroundColor: colors.bg }}
    >
      <div
        className="flex items-center justify-center mx-auto"
        style={{ height: '90px' }}
      >
        <div
          className="rotate-header text-xs font-semibold leading-tight"
          style={{ color: colors.text }}
        >
          <span className="mr-1">{activity.emoji}</span>
          {activity.name}
        </div>
      </div>
      <div
        className="w-full h-1 rounded-full mt-1"
        style={{ backgroundColor: colors.border }}
      />
    </th>
  );
};
