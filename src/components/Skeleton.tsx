/**
 * Lightweight skeleton placeholder for loading states.
 * Compose any layout by combining instances with Tailwind sizing classes.
 *
 * @example
 *   <Skeleton className="h-4 w-24" />           // text line
 *   <Skeleton className="h-48 w-full rounded-2xl" />  // card image
 */
export default function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-gray-200/70 ${className}`}
    />
  );
}
