/**
 * Construct a Cloudinary delivery URL from a stored path.
 *
 * Usage:
 *   cloudinaryUrl('burgerempire/menu/crispy-veg-burger')
 *   // → https://res.cloudinary.com/dakd6siup/image/upload/f_auto,q_auto/burgerempire/menu/crispy-veg-burger
 *
 *   cloudinaryUrl('burgerempire/images/og-home', 'f_jpg,q_80,w_1200,h_630,c_fill')
 *   // → full URL with custom transforms (useful for OG images)
 *
 * If the path is already a full URL (http/https), it is returned unchanged.
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dakd6siup';
const BASE = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

export function cloudinaryUrl(path: string, transforms = 'f_auto,q_auto'): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${BASE}/${transforms}/${path}`;
}
