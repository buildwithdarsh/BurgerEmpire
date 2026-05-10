import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';

type NativeInputProps = Omit<ComponentPropsWithoutRef<'input'>, 'size' | 'prefix'>;

export interface InputProps extends NativeInputProps {
  sizing?: 'sm' | 'md' | 'lg';
  error?: boolean | string;
  prefix?: React.ReactNode;
  icon?: React.ReactNode;
  label?: string;
}

const SIZE_CLASSES = {
  sm: 'px-2.5 py-1.5 text-xs rounded-md',
  md: 'px-3 py-2 text-sm rounded-lg',
  lg: 'px-3.5 py-3 text-sm rounded-lg',
} as const;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ sizing = 'md', error, prefix, icon, label, className, ...props }, ref) => {
    const hasIcon = !!icon;
    const hasPrefix = !!prefix;

    const input = (
      <input
        ref={ref}
        className={cn(
          'w-full border bg-white transition-colors focus:outline-none placeholder:text-gray-400',
          SIZE_CLASSES[sizing],
          error ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-100',
          props.disabled && 'opacity-50 cursor-not-allowed bg-gray-50',
          hasIcon && 'pl-10',
          hasPrefix && !hasIcon && 'pl-8',
          className,
        )}
        placeholder={label ?? props.placeholder}
        aria-invalid={!!error || undefined}
        {...props}
      />
    );

    if (hasIcon) {
      return (
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon}
          </span>
          {input}
          {typeof error === 'string' && error && (
            <p className="mt-1 text-xs text-red-500">{error}</p>
          )}
        </div>
      );
    }

    if (hasPrefix) {
      return (
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold pointer-events-none">
            {prefix}
          </span>
          {input}
          {typeof error === 'string' && error && (
            <p className="mt-1 text-xs text-red-500">{error}</p>
          )}
        </div>
      );
    }

    return (
      <>
        {input}
        {typeof error === 'string' && error && (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        )}
      </>
    );
  }
);

Input.displayName = 'Input';
export default Input;
