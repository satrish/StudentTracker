import { useEffect, useRef, useState } from 'react';
import { ACTIVITIES, DAYS } from '../../shared/src/activities';
import { useTrackerData } from './hooks/useTrackerData';
import { TrackerTable } from './components/TrackerTable';
import { DayView } from './components/DayView';
import { ProgressSection } from './components/ProgressSection';
import { GiftModal } from './components/GiftModal';
import { MonthlyDashboard } from './components/MonthlyDashboard';
import { LoginPage } from './components/LoginPage';
import { SportsTracker } from './sports/SportsTracker';
import type { WeekData } from '../../shared/src/types';
import './index.css';

const KIDS_PROFILE_ID = 'kids';

type Mode = 'kids' | 'sports';
type Gift = { type: 'row' | 'column'; label: string };

function App() {
  const { weekOffset, setWeekOffset, weekDates, data, toggle } = useTrackerData(KIDS_PROFILE_ID);

  // Auth state
  const [loggedIn, setLoggedIn] = useState(() => !!localStorage.getItem('kdt_user'));

  // App mode
  const [mode, setMode] = useState<Mode>('kids');
  const [showDashboard, setShowDashboard] = useState(false);

  // Child name — stored in localStorage
  const [name, setName] = useState(() => localStorage.getItem('kdt_name') ?? '');
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Gift queue for row/column completions
  const [giftQueue, setGiftQueue] = useState<Gift[]>([]);
  const prevDataRef = useRef<WeekData>(data);
  const weekOffsetRef = useRef(weekOffset);

  useEffect(() => {
    if (editingName) nameInputRef.current?.focus();
  }, [editingName]);

  const saveName = () => {
    const trimmed = nameInput.trim();
    setName(trimmed);
    localStorage.setItem('kdt_name', trimmed);
    setEditingName(false);
  };

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
      const wasComplete = ACTIVITIES.every((a) => prevDayData[a.id]);
      const isComplete = ACTIVITIES.every((a) => dayData[a.id]);
      if (!wasComplete && isComplete) {
        newGifts.push({ type: 'row', label: DAYS[dayIndex] });
      }
    });

    // Column: one activity done all 7 days
    ACTIVITIES.forEach((activity) => {
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

  const handleLogin = (username: string) => {
    localStorage.setItem('kdt_user', username);
    setLoggedIn(true);
    if (!name) {
      setName(username);
      localStorage.setItem('kdt_name', username);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('kdt_user');
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Kids dashboard
  if (showDashboard && mode === 'kids') {
    return (
      <MonthlyDashboard
        profileId={KIDS_PROFILE_ID}
        totalActivities={ACTIVITIES.length}
        theme="kids"
        onBack={() => setShowDashboard(false)}
      />
    );
  }

  // Sports mode
  if (mode === 'sports') {
    return (
      <div>
        <div
          className="sticky top-0 z-50 flex items-center justify-between px-4 py-2 shadow"
          style={{ background: '#1F2937' }}
        >
          <div className="flex gap-2">
            <button
              onClick={() => setMode('kids')}
              className="px-3 py-1.5 rounded-lg text-sm font-bold cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.1)', color: '#9CA3AF' }}
            >
              ⭐ Kids
            </button>
            <button
              onClick={() => setMode('sports')}
              className="px-3 py-1.5 rounded-lg text-sm font-bold cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #059669, #3B82F6)', color: 'white' }}
            >
              🏏 Cricket
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg text-sm font-semibold cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.1)', color: '#9CA3AF' }}
          >
            Logout
          </button>
        </div>
        <SportsTracker />
      </div>
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
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #EDE9FE, #FCE7F3, #FEF3C7)' }}>
      <header
        className="sticky top-0 z-40 shadow-lg"
        style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899, #F59E0B)' }}
      >
        <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between gap-2">
          {/* Title / Name editor */}
          {editingName ? (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <input
                ref={nameInputRef}
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveName();
                  if (e.key === 'Escape') setEditingName(false);
                }}
                className="px-3 py-1.5 rounded-lg text-sm font-semibold text-gray-800 bg-white focus:outline-none w-40"
                placeholder="Child's name..."
                maxLength={20}
              />
              <button
                onClick={saveName}
                className="px-3 py-1.5 bg-white text-purple-700 rounded-lg text-sm font-bold cursor-pointer flex-shrink-0"
              >
                Save
              </button>
              <button
                onClick={() => setEditingName(false)}
                className="px-2 py-1.5 rounded-lg text-sm cursor-pointer flex-shrink-0"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setNameInput(name); setEditingName(true); }}
              className="text-white font-black text-lg sm:text-2xl tracking-tight drop-shadow cursor-pointer bg-transparent border-none text-left hover:opacity-80 transition-opacity flex-1 min-w-0 truncate"
              title="Click to set child's name"
            >
              ⭐ {name ? `${name}'s Starchart` : 'Kids Daily Tracker'} ⭐
            </button>
          )}

          {/* Dashboard */}
          <button
            onClick={() => setShowDashboard(true)}
            className="px-2.5 py-1.5 rounded-lg text-sm font-semibold cursor-pointer flex-shrink-0"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
          >
            📊
          </button>

          {/* Cricket mode switcher */}
          <button
            onClick={() => setMode('sports')}
            className="px-2.5 py-1.5 rounded-lg text-sm font-semibold cursor-pointer flex-shrink-0"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
          >
            🏏 Cricket
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="px-2.5 py-1.5 rounded-lg text-sm font-semibold cursor-pointer flex-shrink-0"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
          >
            Logout
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
              style={{ color: '#7C3AED' }}
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
          <TrackerTable weekDates={weekDates} data={data} onToggle={toggle} />
        </div>
        <div className="lg:hidden">
          <DayView
            key={weekOffset}
            weekDates={weekDates}
            data={data}
            onToggle={toggle}
            weekOffset={weekOffset}
          />
        </div>
        <ProgressSection weekDates={weekDates} data={data} profileId={KIDS_PROFILE_ID} />
      </main>

      {giftQueue.length > 0 && (
        <GiftModal
          type={giftQueue[0].type}
          label={giftQueue[0].label}
          theme="kids"
          onClose={dismissGift}
        />
      )}
    </div>
  );
}

export default App;
