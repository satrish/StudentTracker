import React from 'react';

interface CelebrationModalProps {
  onClose: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative bounce-in bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center border-4 border-yellow-400"
        style={{
          background: 'linear-gradient(135deg, #FEF9C3, #FDE68A, #FCD34D)',
        }}
      >
        <div className="text-6xl mb-4 animate-bounce">🎉</div>
        <h2 className="text-2xl font-black text-yellow-800 mb-2">
          Amazing Job!
        </h2>
        <p className="text-yellow-700 font-semibold mb-1">
          You completed ALL your activities today!
        </p>
        <p className="text-4xl my-4">⭐⭐⭐⭐⭐</p>
        <p className="text-yellow-700 text-sm mb-6">
          You are a superstar! Keep up the incredible work!
        </p>
        <button
          onClick={onClose}
          className="px-8 py-3 rounded-full font-bold text-white text-lg cursor-pointer transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-yellow-300"
          style={{
            background: 'linear-gradient(135deg, #F59E0B, #EF4444)',
            boxShadow: '0 4px 15px rgba(245,158,11,0.4)',
          }}
        >
          Thank you! 🚀
        </button>
      </div>
    </div>
  );
};
