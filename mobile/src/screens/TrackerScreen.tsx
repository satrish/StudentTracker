import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTrackerData } from '../hooks/useTrackerData';
import CheckButton from '../components/CheckButton';
import ProgressSection from '../components/ProgressSection';
import GiftModal from '../components/GiftModal';
import { ACTIVITIES, CATEGORY_COLORS, CATEGORY_LABELS } from '../activities';
import { isToday, formatDate } from '../utils/dateUtils';
import type { Gift } from '../types';

const DAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const CATEGORIES = ['morning', 'evening', 'night'] as const;

interface TrackerScreenProps {
  username: string;
  onLogout: () => void;
  onSwitchMode: () => void;
}

export default function TrackerScreen({ username, onLogout, onSwitchMode }: TrackerScreenProps) {
  const profileId = username;
  const { weekOffset, setWeekOffset, weekDates, data, loading, toggle } = useTrackerData(profileId);
  const [selectedDay, setSelectedDay] = useState<number>(() => {
    const today = new Date();
    const dow = today.getDay();
    return dow === 0 ? 6 : dow - 1;
  });
  const [childName, setChildName] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [giftQueue, setGiftQueue] = useState<Gift[]>([]);
  const [currentGift, setCurrentGift] = useState<Gift | null>(null);
  const prevDataRef = useRef(data);

  useEffect(() => {
    AsyncStorage.getItem('kdt_name').then((name) => {
      if (name) setChildName(name);
    });
  }, []);

  const saveName = (name: string) => {
    setChildName(name);
    AsyncStorage.setItem('kdt_name', name);
    setEditingName(false);
  };

  // Gift detection: check for completed rows (all 7 days for an activity) or columns (all activities for a day)
  useEffect(() => {
    const prev = prevDataRef.current;
    const newGifts: Gift[] = [];

    ACTIVITIES.forEach((act) => {
      const wasAllDone = weekDates.every((_, i) => prev[i]?.[act.id]);
      const isAllDone = weekDates.every((_, i) => data[i]?.[act.id]);
      if (!wasAllDone && isAllDone) {
        newGifts.push({ type: 'row', label: act.name });
      }
    });

    weekDates.forEach((_, i) => {
      const wasAllDone = ACTIVITIES.every((act) => prev[i]?.[act.id]);
      const isAllDone = ACTIVITIES.every((act) => data[i]?.[act.id]);
      if (!wasAllDone && isAllDone) {
        newGifts.push({ type: 'column', label: DAYS_SHORT[i] });
      }
    });

    if (newGifts.length > 0) {
      setGiftQueue((q) => [...q, ...newGifts]);
    }
    prevDataRef.current = data;
  }, [data, weekDates]);

  useEffect(() => {
    if (!currentGift && giftQueue.length > 0) {
      setCurrentGift(giftQueue[0]);
      setGiftQueue((q) => q.slice(1));
    }
  }, [currentGift, giftQueue]);

  const dayData = data[selectedDay] ?? {};
  const dayDoneCount = Object.values(dayData).filter(Boolean).length;
  const dayTotal = ACTIVITIES.length;

  const weekLabel = weekOffset === 0
    ? 'This Week'
    : weekOffset === -1
    ? 'Last Week'
    : `${Math.abs(weekOffset)} weeks ${weekOffset < 0 ? 'ago' : 'ahead'}`;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {editingName ? (
            <TextInput
              style={styles.nameInput}
              value={childName}
              onChangeText={setChildName}
              onBlur={() => saveName(childName)}
              onSubmitEditing={() => saveName(childName)}
              autoFocus
              placeholder="Child's name"
              placeholderTextColor="#C4B5FD"
            />
          ) : (
            <TouchableOpacity onPress={() => setEditingName(true)}>
              <Text style={styles.headerTitle}>⭐ {childName || username}</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.headerSub}>Kids Tracker</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerBtn} onPress={onSwitchMode}>
            <Text style={styles.headerBtnText}>🏏</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} onPress={onLogout}>
            <Text style={styles.headerBtnText}>↩</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Week Navigation */}
        <View style={styles.weekNav}>
          <TouchableOpacity
            style={styles.weekBtn}
            onPress={() => setWeekOffset(weekOffset - 1)}
          >
            <Text style={styles.weekBtnText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.weekLabel}>{weekLabel}</Text>
          <TouchableOpacity
            style={[styles.weekBtn, weekOffset >= 0 && styles.weekBtnDisabled]}
            onPress={() => weekOffset < 0 && setWeekOffset(weekOffset + 1)}
            disabled={weekOffset >= 0}
          >
            <Text style={[styles.weekBtnText, weekOffset >= 0 && styles.weekBtnTextDisabled]}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Day Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayRow} contentContainerStyle={styles.dayRowContent}>
          {weekDates.map((date, i) => {
            const today = isToday(date);
            const selected = selectedDay === i;
            const dayDone = Object.values(data[i] ?? {}).filter(Boolean).length;
            return (
              <TouchableOpacity
                key={i}
                style={[
                  styles.dayChip,
                  selected && styles.dayChipSelected,
                  today && !selected && styles.dayChipToday,
                ]}
                onPress={() => setSelectedDay(i)}
              >
                <Text style={[styles.dayChipLabel, selected && styles.dayChipLabelSelected]}>
                  {DAYS_SHORT[i]}
                </Text>
                <Text style={[styles.dayChipDate, selected && styles.dayChipLabelSelected]}>
                  {formatDate(date)}
                </Text>
                {dayDone > 0 && (
                  <Text style={styles.dayChipCount}>{dayDone}/{dayTotal}</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Day progress */}
        <View style={styles.dayProgress}>
          <Text style={styles.dayProgressText}>
            {DAYS_SHORT[selectedDay]} — {dayDoneCount}/{dayTotal} activities
          </Text>
          <View style={styles.dayBarBg}>
            <View
              style={[
                styles.dayBarFill,
                { width: `${dayTotal > 0 ? (dayDoneCount / dayTotal) * 100 : 0}%` as any },
              ]}
            />
          </View>
        </View>

        {loading ? (
          <ActivityIndicator color="#8B5CF6" size="large" style={{ marginTop: 40 }} />
        ) : (
          CATEGORIES.map((cat) => {
            const acts = ACTIVITIES.filter((a) => a.category === cat);
            if (!acts.length) return null;
            return (
              <View key={cat} style={styles.categorySection}>
                <View style={[styles.categoryHeader, { borderLeftColor: CATEGORY_COLORS[cat] }]}>
                  <Text style={[styles.categoryLabel, { color: CATEGORY_COLORS[cat] }]}>
                    {CATEGORY_LABELS[cat]}
                  </Text>
                </View>
                {acts.map((act) => (
                  <View key={act.id} style={styles.actRow}>
                    <Text style={styles.actEmoji}>{act.emoji}</Text>
                    <Text style={styles.actName}>{act.name}</Text>
                    <CheckButton
                      done={!!dayData[act.id]}
                      onToggle={() => toggle(selectedDay, act.id)}
                      color={CATEGORY_COLORS[act.category]}
                    />
                  </View>
                ))}
              </View>
            );
          })
        )}

        <ProgressSection data={data} weekDates={weekDates} profileId={profileId} />
        <View style={{ height: 24 }} />
      </ScrollView>

      {currentGift && (
        <GiftModal
          visible={!!currentGift}
          type={currentGift.type}
          label={currentGift.label}
          theme="kids"
          onClose={() => setCurrentGift(null)}
        />
      )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {},
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSub: {
    fontSize: 12,
    color: '#C4B5FD',
    marginTop: 2,
  },
  nameInput: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#C4B5FD',
    minWidth: 150,
    padding: 0,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  headerBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBtnText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  weekNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 16,
  },
  weekBtn: {
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
  weekBtnDisabled: {
    opacity: 0.35,
  },
  weekBtnText: {
    fontSize: 20,
    color: '#7C3AED',
    fontWeight: '700',
  },
  weekBtnTextDisabled: {
    color: '#9CA3AF',
  },
  weekLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4C1D95',
  },
  dayRow: {
    marginBottom: 4,
  },
  dayRowContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  dayChip: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    minWidth: 60,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  dayChipSelected: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  dayChipToday: {
    borderColor: '#7C3AED',
  },
  dayChipLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  dayChipDate: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  dayChipLabelSelected: {
    color: '#FFFFFF',
  },
  dayChipCount: {
    fontSize: 10,
    color: '#F59E0B',
    fontWeight: '700',
    marginTop: 2,
  },
  dayProgress: {
    marginHorizontal: 12,
    marginVertical: 8,
  },
  dayProgressText: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: '600',
  },
  dayBarBg: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  dayBarFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 3,
  },
  categorySection: {
    marginHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderLeftWidth: 4,
    backgroundColor: '#FAFAFA',
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  actRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  actEmoji: {
    fontSize: 22,
    width: 34,
  },
  actName: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
  },
});
