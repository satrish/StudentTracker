import { useEffect, useRef, useState } from 'react';
import { SPORT_ACTIVITIES, SPORT_DAYS } from '../../../shared/src/sports-activities';
import { useTrackerData } from '../hooks/useTrackerData';
import { SportsTrackerTable } from './SportsTrackerTable';
import { SportsDayView } from './SportsDayView';
import { SportsProgressSection } from './SportsProgressSection';
import { GiftModal } from '../components/GiftModal';
import { MonthlyDashboard } from '../components/MonthlyDashboard';
import type { WeekData } from '../../../shared/src/types';

const PROFILE_ID = 'sports';

type Gift = { type: 'row' | 'column'; label: string };

export function SportsTracker() {
  const { weekOffset, setWeekOffset, weekDates, data, toggle } = useTrackerData(PROFILE_ID);

  const [showDashboard, setShowDashboard] = useState(false);

  // Gift queue for row/column completions
  const [giftQueue, setGiftQueue] = useState<Gift[]>([]);
  const prevDataRef = useRef<WeekData>(data);
  const weekOffsetRef = useRef(weekOffset);

  // Detect row/column completions
  useEffect(() => {
    // Week changed — reset baseline, no gifts
    if (weekOffsetRef.current !== weekOffset) {
      weekOffsetRef.current = weekOffset;
      prevDataRef.current = data;
      return;
    }

    const prev = prevDataRef.current;
    prevDataRef.current = data;
    const newGifts: Gift[] = [];

    // Row: all activities done for a day
    weekDates.forEach((_, dayIndex) => {
      const dayData = data[dayIndex] ?? {};
      const prevDayData = prev[dayIndex] ?? {};
      const wasComplete = SPORT_ACTIVITIES.every((a) => prevDayData[a.id]);
      const isComplete = SPORT_ACTIVITIES.every((a) => dayData[a.id]);
      if (!wasComplete && isComplete) {
        newGifts.push({ type: 'row', label: SPORT_DAYS[dayIndex] });
      }
    });

    // Column: one activity done all 7 days
    SPORT_ACTIVITIES.forEach((activity) => {
      const wasComplete = weekDates.every((_, i) => !!(prev[i] ?? {})[activity.id]);
      const isComplete = weekDates.every((_, i) => !!(data[i] ?? {})[activity.id]);
      if (!wasComplete && isComplete) {
        newGifts.push({ type: 'column', label: `${activity.emoji} ${activity.name}` });
      }
    });

    if (newGifts.length > 0) {
      setGiftQueue((q) => [...q, ...newGifts]);
    }
  }, [data, weekOffset]);

  const dismissGift = () => setGiftQueue((q) => q.slice(1));

  if (showDashboard) {
    return (
      <MonthlyDashboard
        profileId={PROFILE_ID}
        totalActivities={SPORT_ACTIVITIES.length}
        theme="cricket"
        onBack={() => setShowDashboard(false)}
      />
    );
  }

  const getWeekLabel = () => {
    if (weekOffset === 0) return 'This Week';
    if (weekOffset === -1) return 'Last Week';
    if (weekOffset === 1) return 'Next Week';
    const monday = weekDates[0];
    return monday.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #D1FAE5, #DBEAFE, #FEF3C7)' }}>
      <header
        className="sticky top-0 z-40 shadow-lg"
        style={{ background: 'linear-gradient(135deg, #059669, #3B82F6, #F59E0B)' }}
      >
        <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between gap-2">
          <span className="text-white font-black text-lg sm:text-2xl tracking-tight drop-shadow flex-1">
            🏏 Cricket Training Tracker
          </span>

          {/* Dashboard */}
          <button
            onClick={() => setShowDashboard(true)}
            className="px-2.5 py-1.5 rounded-lg text-sm font-semibold cursor-pointer flex-shrink-0"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
          >
            📊
          </button>

          {/* Week navigation */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => setWeekOffset(weekOffset - 1)}
              className="px-2.5 py-1.5 rounded-lg font-semibold text-sm cursor-pointer"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
            >
              ←
            </button>
            <button
              onClick={() => setWeekOffset(0)}
              className="px-2.5 py-1.5 bg-white rounded-lg font-bold text-xs sm:text-sm cursor-pointer shadow whitespace-nowrap"
              style={{ color: '#059669' }}
            >
              {getWeekLabel()}
            </button>
            <button
              onClick={() => setWeekOffset(weekOffset + 1)}
              className="px-2.5 py-1.5 rounded-lg font-semibold text-sm cursor-pointer"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
            >
              →
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="hidden lg:block">
          <SportsTrackerTable weekDates={weekDates} data={data} onToggle={toggle} />
        </div>
        <div className="lg:hidden">
          <SportsDayView
            key={weekOffset}
            weekDates={weekDates}
            data={data}
            onToggle={toggle}
            weekOffset={weekOffset}
          />
        </div>
        <SportsProgressSection weekDates={weekDates} data={data} profileId={PROFILE_ID} />
      </main>

      {giftQueue.length > 0 && (
        <GiftModal
          type={giftQueue[0].type}
          label={giftQueue[0].label}
          theme="cricket"
          onClose={dismissGift}
        />
      )}
    </div>
  );
}
