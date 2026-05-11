import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getDayDoneCount } from '../utils/dateUtils';
import { ACTIVITIES } from '../activities';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface MonthlyDashboardScreenProps {
  username: string;
}

interface DayInfo {
  date: Date;
  pct: number;
  done: number;
}

function getHeatColor(pct: number): string {
  if (pct === 0) return '#F3F4F6';
  if (pct < 25) return '#EDE9FE';
  if (pct < 50) return '#C4B5FD';
  if (pct < 75) return '#8B5CF6';
  if (pct < 100) return '#6D28D9';
  return '#4C1D95';
}

export default function MonthlyDashboardScreen({ username }: MonthlyDashboardScreenProps) {
  const today = new Date();
  const [monthOffset, setMonthOffset] = useState(0);
  const [days, setDays] = useState<DayInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const total = ACTIVITIES.length;

  const targetMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const year = targetMonth.getFullYear();
  const month = targetMonth.getMonth();

  const loadMonthData = useCallback(async () => {
    setLoading(true);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const result: DayInfo[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const done = await getDayDoneCount(date, username);
      result.push({ date, pct: total > 0 ? Math.round((done / total) * 100) : 0, done });
    }
    setDays(result);
    setLoading(false);
  }, [year, month, username, total]);

  useEffect(() => {
    loadMonthData();
  }, [loadMonthData]);

  // Build calendar grid (Mon-Sun)
  const firstDay = new Date(year, month, 1);
  const firstDow = firstDay.getDay(); // 0=Sun
  const leadingBlanks = firstDow === 0 ? 6 : firstDow - 1;

  const trackedDays = days.filter((d) => d.done > 0);
  const perfectDays = days.filter((d) => d.pct === 100);
  const avgPct = trackedDays.length > 0
    ? Math.round(trackedDays.reduce((s, d) => s + d.pct, 0) / trackedDays.length)
    : 0;

  const isCurrentMonth = monthOffset === 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📅 Monthly Dashboard</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Month Nav */}
        <View style={styles.monthNav}>
          <TouchableOpacity style={styles.navBtn} onPress={() => setMonthOffset((o) => o - 1)}>
            <Text style={styles.navBtnText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.monthLabel}>{MONTH_NAMES[month]} {year}</Text>
          <TouchableOpacity
            style={[styles.navBtn, isCurrentMonth && styles.navBtnDisabled]}
            disabled={isCurrentMonth}
            onPress={() => setMonthOffset((o) => o + 1)}
          >
            <Text style={[styles.navBtnText, isCurrentMonth && styles.navBtnTextDisabled]}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{avgPct}%</Text>
            <Text style={styles.statLabel}>Avg Completion</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{perfectDays.length}</Text>
            <Text style={styles.statLabel}>Perfect Days</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{trackedDays.length}</Text>
            <Text style={styles.statLabel}>Days Tracked</Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator color="#8B5CF6" size="large" style={{ marginTop: 40 }} />
        ) : (
          <View style={styles.calendarCard}>
            {/* Day headers */}
            <View style={styles.calendarRow}>
              {DAY_LABELS.map((d) => (
                <Text key={d} style={styles.calHeaderCell}>{d}</Text>
              ))}
            </View>

            {/* Calendar grid */}
            {(() => {
              const cells: React.ReactNode[] = [];
              for (let b = 0; b < leadingBlanks; b++) {
                cells.push(<View key={`blank-${b}`} style={styles.calCell} />);
              }
              days.forEach((info, idx) => {
                const isToday =
                  info.date.getDate() === today.getDate() &&
                  info.date.getMonth() === today.getMonth() &&
                  info.date.getFullYear() === today.getFullYear();
                cells.push(
                  <View key={idx} style={[styles.calCell]}>
                    <View
                      style={[
                        styles.calDot,
                        { backgroundColor: getHeatColor(info.pct) },
                        isToday && styles.calDotToday,
                      ]}
                    >
                      <Text style={[styles.calDayNum, info.pct >= 50 && styles.calDayNumLight]}>
                        {info.date.getDate()}
                      </Text>
                    </View>
                  </View>
                );
              });

              const rows: React.ReactNode[] = [];
              for (let i = 0; i < cells.length; i += 7) {
                rows.push(
                  <View key={i} style={styles.calendarRow}>
                    {cells.slice(i, i + 7).map((cell, j) => (
                      <View key={j} style={styles.calCellWrapper}>{cell}</View>
                    ))}
                  </View>
                );
              }
              return rows;
            })()}

            {/* Legend */}
            <View style={styles.legend}>
              <Text style={styles.legendLabel}>Less</Text>
              {['#F3F4F6', '#EDE9FE', '#C4B5FD', '#8B5CF6', '#6D28D9', '#4C1D95'].map((c) => (
                <View key={c} style={[styles.legendDot, { backgroundColor: c }]} />
              ))}
              <Text style={styles.legendLabel}>More</Text>
            </View>
          </View>
        )}

        {/* Best day callout */}
        {!loading && perfectDays.length > 0 && (
          <View style={styles.bestDay}>
            <Text style={styles.bestDayEmoji}>🏆</Text>
            <Text style={styles.bestDayText}>
              {perfectDays.length === 1
                ? `Perfect day on ${perfectDays[0].date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}!`
                : `${perfectDays.length} perfect days this month!`}
            </Text>
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F3FF',
  },
  header: {
    backgroundColor: '#4C1D95',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  scroll: { flex: 1 },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 16,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  navBtnDisabled: { opacity: 0.35 },
  navBtnText: {
    fontSize: 20,
    color: '#7C3AED',
    fontWeight: '700',
  },
  navBtnTextDisabled: { color: '#9CA3AF' },
  monthLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: '#4C1D95',
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 12,
    gap: 10,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statNum: {
    fontSize: 22,
    fontWeight: '800',
    color: '#7C3AED',
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  calendarCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  calendarRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  calHeaderCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    paddingVertical: 4,
  },
  calCell: {
    flex: 1,
    aspectRatio: 1,
    padding: 2,
  },
  calCellWrapper: {
    flex: 1,
  },
  calDot: {
    flex: 1,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1,
  },
  calDotToday: {
    borderWidth: 2,
    borderColor: '#7C3AED',
  },
  calDayNum: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
  },
  calDayNumLight: {
    color: '#FFFFFF',
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 4,
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },
  legendLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginHorizontal: 4,
  },
  bestDay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  bestDayEmoji: { fontSize: 24 },
  bestDayText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#92400E',
  },
});
