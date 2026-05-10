import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';

export interface TextareaProps extends ComponentPropsWithoutRef<'textarea'> {
  sizing?: 'sm' | 'md';
  error?: boolean | string;
  /** Show a "X / maxLength" counter below the textarea */
  showCount?: boolean;
}

const SIZE_CLASSES = {
  sm: '!px-2.5 !py-1.5 !text-[0.7125rem] rounded-md',
  md: '!px-2.5 !py-1.5 !text-base rounded-md md:!px-3 md:!py-2 md:!text-[0.8125rem] lg:rounded-lg',
} as const;

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ sizing = 'md', error, showCount, className, ...props }, ref) => (
    <div>
      <textarea
        ref={ref}
        className={cn(
          'w-full border bg-white resize-none transition-colors focus:outline-none',
          SIZE_CLASSES[sizing],
          error ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-gray-400',
          props.disabled && 'opacity-50 cursor-not-allowed bg-gray-50',
          className,
        )}
        aria-invalid={!!error || undefined}
        {...props}
      />
      {showCount && props.maxLength && (
        <p className="text-right text-[0.625rem] text-gray-400 mt-1">
          {(typeof props.value === 'string' ? props.value.length : 0)} / {props.maxLength}
        </p>
      )}
    </div>
  )
);

Textarea.displayName = 'Textarea';
export default Textarea;
