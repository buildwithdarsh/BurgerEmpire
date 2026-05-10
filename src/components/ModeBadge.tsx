'use client';

import { useMode } from '@/hooks/useMode';

interface ModeBadgeProps {
  classicBadges: string[];
  healthyBadges: string[];
}

export default function ModeBadge({ classicBadges, healthyBadges }: ModeBadgeProps) {
  const { isClassic } = useMode();
  const badges = isClassic ? classicBadges : healthyBadges;

  return (
    <div className="flex flex-wrap gap-1">
      {badges.map((badge, i) => (
        <span
          key={`${badge}-${i}`}
          className="text-[0.625rem] px-2 py-1 rounded-md font-semibold backdrop-blur-sm transition-all duration-300"
          style={{
            backgroundColor: isClassic
              ? 'rgba(154,30,41,0.85)'
              : 'rgba(74,160,86,0.85)',
            color: '#FFFFFF',
          }}
        >
          {badge}
        </span>
      ))}
    </div>
  );
}
