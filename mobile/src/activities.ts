export interface Activity {
  id: string;
  name: string;
  emoji: string;
  category: 'morning' | 'school' | 'evening' | 'night';
}

export const ACTIVITIES: Activity[] = [
  { id: 'early-wake-up', name: 'Wake Up Early', emoji: '⏰', category: 'morning' },
  { id: 'morning-prayer', name: 'Morning Prayer', emoji: '🙏', category: 'morning' },
  { id: 'breakfast', name: 'Breakfast', emoji: '🍳', category: 'morning' },
  { id: 'on-time-to-school', name: 'On Time to School', emoji: '🏫', category: 'morning' },
  { id: 'evening-snack', name: 'Evening Snack', emoji: '🍎', category: 'evening' },
  { id: 'completing-hw', name: 'Completing HW', emoji: '📚', category: 'evening' },
  { id: 'evening-drink', name: 'Evening Drink', emoji: '🥤', category: 'evening' },
  { id: 'self-grooming', name: 'Self Grooming', emoji: '🪥', category: 'evening' },
  { id: 'evening-prayer', name: 'Evening Prayer', emoji: '🕯️', category: 'evening' },
  { id: 'playing-exercise', name: 'Playing/Exercise', emoji: '🏃', category: 'evening' },
  { id: 'brushing-at-night', name: 'Brushing at Night', emoji: '🦷', category: 'night' },
  { id: 'caring-buddy', name: 'Caring Buddy', emoji: '🤝', category: 'night' },
];

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const CATEGORY_COLORS: Record<string, string> = {
  morning: '#F59E0B',
  school: '#3B82F6',
  evening: '#8B5CF6',
  night: '#4F46E5',
};

export const CATEGORY_LABELS: Record<string, string> = {
  morning: 'Morning',
  school: 'School',
  evening: 'Evening',
  night: 'Night',
};
