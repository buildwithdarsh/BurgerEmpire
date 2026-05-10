'use client';

import { useMode } from '@/hooks/useMode';
import { BurgerIcon, LeafIcon } from './icons';

export default function ModeToggle() {
  const { isClassic, toggleMode, isTransitioning } = useMode();

  return (
    <button
      onClick={() => !isTransitioning && toggleMode()}
      disabled={isTransitioning}
      className="relative flex items-center w-[56px] h-[28px] rounded-full p-[3px] transition-colors duration-500 cursor-pointer focus:outline-none"
      style={{
        backgroundColor: isClassic ? '#EB7A29' : '#4AA056',
      }}
      aria-label={`Switch to ${isClassic ? 'Healthy' : 'Classic'} mode`}
    >
      {/* Icons inside track */}
      <span
        className="absolute left-[7px] top-1/2 -translate-y-1/2 transition-opacity duration-300"
        style={{ opacity: isClassic ? 0.4 : 0 }}
      >
        <BurgerIcon size={12} color="#fff" />
      </span>
      <span
        className="absolute right-[7px] top-1/2 -translate-y-1/2 transition-opacity duration-300"
        style={{ opacity: isClassic ? 0 : 0.4 }}
      >
        <LeafIcon size={12} color="#fff" />
      </span>

      {/* Thumb */}
      <div
        className="w-[22px] h-[22px] rounded-full bg-white transition-transform duration-500 flex items-center justify-center"
        style={{
          transform: isClassic ? 'translateX(0)' : 'translateX(28px)',
          transitionTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}
      >
        {isClassic
          ? <BurgerIcon size={12} color="#EB7A29" />
          : <LeafIcon size={12} color="#4AA056" />
        }
      </div>
    </button>
  );
}
