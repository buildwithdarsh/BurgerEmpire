'use client';

import { usePriceAnimation } from '@/hooks/usePriceAnimation';
import { useMode } from '@/hooks/useMode';
import { useConfig } from '@/hooks/useConfig';

interface PriceTagProps {
  classicPrice: number;
  healthyPrice: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function PriceTag({ classicPrice, healthyPrice, size = 'md' }: PriceTagProps) {
  const { isClassic } = useMode();
  const { config } = useConfig();
  const currencySymbol = config.branding?.currency_symbol || '₹';
  const targetPrice = isClassic ? classicPrice : healthyPrice;
  const displayPrice = usePriceAnimation(targetPrice);
  const delta = healthyPrice - classicPrice;

  const sizeClasses = {
    sm: 'text-[0.9375rem]',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <div className="flex items-center gap-1.5">
      <span className={`font-bold text-gray-900 ${sizeClasses[size]}`} style={{ fontFamily: "var(--font-poppins)" }}>
        {currencySymbol}{displayPrice}
      </span>
      {!isClassic && delta > 0 && (
        <span className="text-[0.625rem] px-1.5 py-0.5 rounded bg-green-50 text-green-600 font-semibold">
          +{currencySymbol}{delta}
        </span>
      )}
    </div>
  );
}
