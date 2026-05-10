'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/cn';
import { cloudinaryUrl } from '@/lib/cloudinary-url';
import Spinner from './Spinner';
import { TZ } from '@/lib/tz';

type CloudinaryFolder = 'menu' | 'blog' | 'promotions' | 'general';

interface ImageUploadProps {
  /** Current image URL (for preview / existing image) */
  value?: string | null;
  /** Called with the Cloudinary URL after successful upload, or null on remove */
  onChange: (url: string | null) => void;
  /** Cloudinary folder to organize uploads */
  folder?: CloudinaryFolder;
  /** Aspect ratio hint for the preview container */
  aspect?: 'square' | 'video' | 'wide';
  /** Custom class for the outer container */
  className?: string;
  /** Disable upload interaction */
  disabled?: boolean;
}

const ASPECT_CLASSES = {
  square: 'aspect-square',
  video: 'aspect-video',
  wide: 'aspect-[21/9]',
} as const;

const MAX_SIZE_MB = 5;

export default function ImageUpload({
  value,
  onChange,
  folder = 'general',
  aspect = 'video',
  className,
  disabled = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(
    async (file: File) => {
      setError(null);

      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        return;
      }

      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`File too large (max ${MAX_SIZE_MB}MB)`);
        return;
      }

      setUploading(true);

      try {
        const result = await TZ.storefront.upload.upload(file, folder);
        const data = result as any;
        onChange(data.image?.url ?? data.url);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed');
      } finally {
        setUploading(false);
      }
    },
    [folder, onChange]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) upload(file);
      // Reset so the same file can be re-selected
      e.target.value = '';
    },
    [upload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) upload(file);
    },
    [upload]
  );

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(null);
      setError(null);
    },
    [onChange]
  );

  return (
    <div className={cn('relative', className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={handleFileSelect}
        disabled={disabled || uploading}
      />

      <div
        onClick={() => !disabled && !uploading && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled && !uploading) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={!disabled && !uploading ? handleDrop : undefined}
        className={cn(
          'relative overflow-hidden rounded-lg border-2 border-dashed transition-colors cursor-pointer',
          ASPECT_CLASSES[aspect],
          dragOver
            ? 'border-orange-400 bg-orange-50'
            : value
              ? 'border-gray-200 bg-gray-50'
              : 'border-gray-300 bg-gray-50 hover:border-gray-400',
          disabled && 'opacity-50 cursor-not-allowed',
          uploading && 'cursor-wait'
        )}
      >
        {value ? (
          <>
            <Image
              src={cloudinaryUrl(value)}
              alt="Uploaded image"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
            {!disabled && !uploading && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 z-10 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80 transition-colors"
                aria-label="Remove image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400">
            {uploading ? (
              <>
                <Spinner size="md" />
                <span className="text-xs">Uploading...</span>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span className="text-xs">Click or drag image here</span>
                <span className="text-[10px] text-gray-300">
                  JPG, PNG, WebP &middot; Max {MAX_SIZE_MB}MB
                </span>
              </>
            )}
          </div>
        )}

        {/* Uploading overlay on existing image */}
        {uploading && value && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
            <Spinner size="md" className="text-white" />
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
