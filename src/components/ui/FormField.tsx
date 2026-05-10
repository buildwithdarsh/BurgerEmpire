import { type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface FormFieldProps {
  /** Label text */
  label?: string;
  /** Corresponding input id for htmlFor */
  htmlFor?: string;
  /** Show red asterisk */
  required?: boolean;
  /** Error message string — also passed to children via context-free pattern */
  error?: string;
  /** Additional wrapper classes */
  className?: string;
  children: ReactNode;
}

export default function FormField({
  label,
  htmlFor,
  required,
  error,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-sm font-semibold text-gray-700"
        >
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p
          className="flex items-center gap-1 text-xs text-red-600"
          role="alert"
          id={htmlFor ? `${htmlFor}-error` : undefined}
        >
          <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
