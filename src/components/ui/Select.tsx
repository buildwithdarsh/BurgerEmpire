import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';

export interface SelectProps extends ComponentPropsWithoutRef<'select'> {
  sizing?: 'sm' | 'md';
  error?: boolean | string;
}

const SIZE_CLASSES = {
  sm: '!px-2.5 !py-1.5 !text-[0.7125rem] rounded-md',
  md: '!px-2.5 !py-1.5 !text-base rounded-md md:!px-3 md:!py-2 md:!text-[0.8125rem] lg:rounded-lg',
} as const;

/** Custom chevron as data-URI SVG — works on all backgrounds */
const ARROW_STYLE = {
  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
  backgroundPosition: 'right 12px center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '20px',
} as const;

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ sizing = 'md', error, className, style, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'w-full border bg-white appearance-none transition-colors focus:outline-none pr-10',
        SIZE_CLASSES[sizing],
        error ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-gray-400',
        props.disabled && 'opacity-50 cursor-not-allowed bg-gray-50',
        className,
      )}
      style={{ ...ARROW_STYLE, ...style }}
      aria-invalid={!!error || undefined}
      {...props}
    >
      {children}
    </select>
  )
);

Select.displayName = 'Select';
export default Select;
