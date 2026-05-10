'use client';
import { useRef, useState, useEffect } from 'react';

interface OtpInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  disabled?: boolean;
  error?: boolean;
}

export default function OtpInput({ length = 6, onComplete, disabled, error }: OtpInputProps) {
  const [digits, setDigits] = useState<string[]>(Array(length).fill(''));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);

    // Auto-advance
    if (value && index < length - 1) {
      refs.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    const complete = newDigits.join('');
    if (complete.length === length) {
      onComplete(complete);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    const newDigits = Array(length).fill('');
    text.split('').forEach((d, i) => { newDigits[i] = d; });
    setDigits(newDigits);
    if (text.length === length) {
      onComplete(text);
    } else {
      refs.current[text.length]?.focus();
    }
  };

  // Reset on error
  useEffect(() => {
    if (error) {
      setDigits(Array(length).fill(''));
      refs.current[0]?.focus();
    }
  }, [error, length]);

  return (
    <div className="flex gap-2 justify-center">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={el => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={i === 0 ? handlePaste : undefined}
          disabled={disabled}
          className={`w-11 h-13 text-center text-xl font-bold rounded-xl border-2 transition-all outline-none
            ${error ? 'border-red-300 bg-red-50 animate-shake' : d ? 'border-gray-900 bg-white' : 'border-gray-200 bg-gray-50'}
            focus:border-gray-900 focus:bg-white
            disabled:opacity-50
          `}
        />
      ))}
    </div>
  );
}
