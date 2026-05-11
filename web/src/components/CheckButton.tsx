import React, { useState } from 'react';

interface CheckButtonProps {
  done: boolean;
  onToggle: () => void;
}

export const CheckButton: React.FC<CheckButtonProps> = ({ done, onToggle }) => {
  const [animating, setAnimating] = useState(false);

  const handleClick = () => {
    setAnimating(true);
    onToggle();
    setTimeout(() => setAnimating(false), 300);
  };

  return (
    <button
      onClick={handleClick}
      className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-yellow-400 ${animating ? 'pop-animate' : ''}`}
      style={
        done
          ? {
              background: 'linear-gradient(135deg, #FDE68A, #F59E0B)',
              borderColor: '#F59E0B',
              boxShadow: '0 2px 8px rgba(245,158,11,0.4)',
            }
          : {
              background: '#F9FAFB',
              borderColor: '#D1D5DB',
            }
      }
      aria-label={done ? 'Mark as not done' : 'Mark as done'}
    >
      {done ? (
        <span className="text-lg leading-none select-none">⭐</span>
      ) : (
        <span className="w-4 h-4 rounded-full bg-gray-200 block" />
      )}
    </button>
  );
};
