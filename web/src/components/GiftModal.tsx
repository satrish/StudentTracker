import React from 'react';

interface GiftModalProps {
  type: 'row' | 'column';
  label: string;        // day name for row, "emoji name" for column
  theme: 'kids' | 'cricket';
  onClose: () => void;
}

const CONFIG = {
  kids: {
    row: {
      bg: 'linear-gradient(135deg, #FDE68A, #FCA5A5, #C4B5FD)',
      border: '#F59E0B',
      icon: '🎁',
      title: 'Day Complete!',
      subtitle: (label: string) => `You finished all activities for ${label}!`,
      body: 'Keep going superstar — every day counts!',
      btn: 'linear-gradient(135deg, #7C3AED, #EC4899)',
      btnText: 'Awesome! 🚀',
    },
    column: {
      bg: 'linear-gradient(135deg, #C4B5FD, #818CF8, #6EE7B7)',
      border: '#7C3AED',
      icon: '🏆',
      title: '7-Day Streak!',
      subtitle: (label: string) => `${label} done every day this week!`,
      body: 'That\'s true dedication — you\'re unstoppable!',
      btn: 'linear-gradient(135deg, #7C3AED, #3B82F6)',
      btnText: 'I\'m on fire! 🔥',
    },
  },
  cricket: {
    row: {
      bg: 'linear-gradient(135deg, #6EE7B7, #93C5FD, #FDE68A)',
      border: '#10B981',
      icon: '🎁',
      title: 'Training Day Complete!',
      subtitle: (label: string) => `Full cricket session done for ${label}!`,
      body: 'Every session makes you a better cricketer!',
      btn: 'linear-gradient(135deg, #059669, #3B82F6)',
      btnText: 'Let\'s go! 🏏',
    },
    column: {
      bg: 'linear-gradient(135deg, #93C5FD, #6EE7B7, #FDE68A)',
      border: '#3B82F6',
      icon: '🏆',
      title: 'Perfect 7-Day Streak!',
      subtitle: (label: string) => `${label} — completed all week!`,
      body: 'Champions are built through consistency. You\'re one!',
      btn: 'linear-gradient(135deg, #3B82F6, #059669)',
      btnText: 'Champion! 🥇',
    },
  },
};

export const GiftModal: React.FC<GiftModalProps> = ({ type, label, theme, onClose }) => {
  const c = CONFIG[theme][type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative bounce-in bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center"
        style={{
          background: c.bg,
          border: `4px solid ${c.border}`,
        }}
      >
        {/* Floating gift icon */}
        <div className="text-6xl mb-3 animate-bounce">{c.icon}</div>

        <h2 className="text-2xl font-black text-gray-800 mb-2">{c.title}</h2>
        <p className="text-gray-700 font-semibold mb-1">{c.subtitle(label)}</p>

        {/* 5 animated stars */}
        <div className="flex justify-center gap-2 my-4">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="star-drop text-3xl"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              ⭐
            </span>
          ))}
        </div>

        <p className="text-gray-600 text-sm mb-6">{c.body}</p>

        <button
          onClick={onClose}
          className="px-8 py-3 rounded-full font-bold text-white text-lg cursor-pointer transition-transform hover:scale-105 active:scale-95 focus:outline-none"
          style={{
            background: c.btn,
            boxShadow: `0 4px 15px rgba(0,0,0,0.2)`,
          }}
        >
          {c.btnText}
        </button>
      </div>
    </div>
  );
};
