export type SportCategory = 'batting' | 'bowling' | 'fielding' | 'fitness';

export interface SportActivity {
  id: string;
  name: string;
  emoji: string;
  category: SportCategory;
}

export const SPORT_ACTIVITIES: SportActivity[] = [
  { id: 'batting-practice', name: 'Batting Practice', emoji: '🏏', category: 'batting' },
  { id: 'shadow-batting', name: 'Shadow Batting', emoji: '🪞', category: 'batting' },
  { id: 'footwork-drills', name: 'Footwork Drills', emoji: '👣', category: 'batting' },
  { id: 'shot-selection', name: 'Shot Selection', emoji: '🎯', category: 'batting' },
  { id: 'bowling-run-up', name: 'Bowling Run-up', emoji: '🏃', category: 'bowling' },
  { id: 'line-length', name: 'Line & Length', emoji: '📏', category: 'bowling' },
  { id: 'spin-drills', name: 'Spin Drills', emoji: '🌀', category: 'bowling' },
  { id: 'yorker-practice', name: 'Yorker Practice', emoji: '🎳', category: 'bowling' },
  { id: 'catching-practice', name: 'Catching Practice', emoji: '🤲', category: 'fielding' },
  { id: 'ground-fielding', name: 'Ground Fielding', emoji: '🌱', category: 'fielding' },
  { id: 'throw-accuracy', name: 'Throw Accuracy', emoji: '💪', category: 'fielding' },
  { id: 'agility-ladder', name: 'Agility Ladder', emoji: '🪜', category: 'fitness' },
  { id: 'sprints', name: 'Sprints', emoji: '⚡', category: 'fitness' },
  { id: 'strength-training', name: 'Strength Training', emoji: '🏋️', category: 'fitness' },
  { id: 'stretching', name: 'Stretching', emoji: '🤸', category: 'fitness' },
];

export const SPORT_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const SPORT_CATEGORY_COLORS: Record<string, string> = {
  batting: '#F97316',
  bowling: '#10B981',
  fielding: '#3B82F6',
  fitness: '#EF4444',
};

export const SPORT_CATEGORY_LABELS: Record<string, string> = {
  batting: 'Batting',
  bowling: 'Bowling',
  fielding: 'Fielding',
  fitness: 'Fitness',
};
