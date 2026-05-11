import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { WeekData } from '../types';
import { ACTIVITIES } from '../activities';
import { getStreak } from '../utils/dateUtils';

interface ProgressSectionProps {
  data: WeekData;
  weekDates: Date[];
  profileId: string;
}

export default function ProgressSection({ data, weekDates, profileId }: ProgressSectionProps) {
  const [streak, setStreak] = useState(0);
  const total = ACTIVITIES.length;

  useEffect(() => {
    getStreak(total, profileId).then(setStreak);
  }, [data, profileId, total]);

  const weekTotal = weekDates.reduce((acc, _, i) => {
    const dayData = data[i] ?? {};
    return acc + Object.values(dayData).filter(Boolean).length;
  }, 0);

  const weekMax = total * 7;
  const weekPct = weekMax > 0 ? Math.round((weekTotal / weekMax) * 100) : 0;

  const byActivity = ACTIVITIES.map((act) => {
    const done = weekDates.filter((_, i) => data[i]?.[act.id]).length;
    return { ...act, done };
  });

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.progressBox}>
          <Text style={styles.label}>Weekly Progress</Text>
          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: `${weekPct}%` as any }]} />
          </View>
          <Text style={styles.pct}>{weekPct}%</Text>
        </View>

        <View style={styles.streakBox}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <Text style={styles.streakNum}>{streak}</Text>
          <Text style={styles.streakLabel}>day streak</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Activity Breakdown</Text>
      <View style={styles.grid}>
        {byActivity.map((act) => (
          <View key={act.id} style={styles.actItem}>
            <Text style={styles.actEmoji}>{act.emoji}</Text>
            <Text style={styles.actName} numberOfLines={1}>{act.name}</Text>
            <Text style={styles.actDone}>{act.done}/7</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    margin: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  progressBox: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 6,
  },
  barBg: {
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 5,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 5,
  },
  pct: {
    fontSize: 13,
    color: '#8B5CF6',
    fontWeight: '700',
    marginTop: 4,
  },
  streakBox: {
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 10,
    minWidth: 72,
  },
  streakEmoji: {
    fontSize: 20,
  },
  streakNum: {
    fontSize: 22,
    fontWeight: '800',
    color: '#D97706',
  },
  streakLabel: {
    fontSize: 11,
    color: '#92400E',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actItem: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 8,
  },
  actEmoji: {
    fontSize: 18,
  },
  actName: {
    flex: 1,
    fontSize: 12,
    color: '#374151',
  },
  actDone: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8B5CF6',
  },
});
