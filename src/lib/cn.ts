/**
 * Lightweight conditional classname joiner.
 * Accepts strings, undefined, null, false — filters falsy values and joins with a space.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
