interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

export function BurgerIcon({ className, size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Top bun */}
      <path d="M8 28C8 16 18 8 32 8C46 8 56 16 56 28H8Z" fill={color} opacity={0.9} />
      {/* Sesame seeds */}
      <ellipse cx="22" cy="18" rx="2" ry="3" fill="white" opacity={0.6} transform="rotate(-15 22 18)" />
      <ellipse cx="34" cy="15" rx="2" ry="3" fill="white" opacity={0.6} transform="rotate(10 34 15)" />
      <ellipse cx="44" cy="20" rx="2" ry="3" fill="white" opacity={0.6} transform="rotate(-5 44 20)" />
      {/* Lettuce */}
      <path d="M6 30C6 30 10 34 16 32C22 30 26 34 32 32C38 30 42 34 48 32C54 30 58 34 58 30H6Z" fill="#4CAF50" />
      {/* Patty */}
      <rect x="7" y="33" width="50" height="8" rx="4" fill="#5D4037" />
      {/* Cheese */}
      <path d="M6 33L10 38H54L58 33H6Z" fill="#FFC107" opacity={0.8} />
      {/* Bottom bun */}
      <path d="M8 44H56C56 50 48 56 32 56C16 56 8 50 8 44Z" fill={color} opacity={0.85} />
    </svg>
  );
}

export function LeafIcon({ className, size = 24, color = '#4AA056' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 8C8 10 5.9 16.2 3.9 19.9C3.5 20.6 4.2 21.3 4.9 20.9C8 19.1 12 18 17 8Z" fill={color} opacity={0.8} />
      <path d="M6.5 12C6.5 12 9 11 12 7C15 3 20 2 20 2C20 2 19 7 15 10C11 13 6.5 12 6.5 12Z" fill={color} />
      <path d="M12 7L8 18" stroke={color} strokeWidth="1" opacity={0.4} />
    </svg>
  );
}

export function FireIcon({ className, size = 24, color = '#EB7A29' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 23C16.4183 23 20 19.4183 20 15C20 11 17 8 16 6C15 8 14 9 12 9C10 9 9 7 9 5C9 4 9.5 3 10 2C7 4 4 8 4 13C4 18.5 7.58172 23 12 23Z" fill={color} />
      <path d="M12 23C14.2091 23 16 20.5 16 17.5C16 14.5 14 13 13 12C12.5 13 12 14 11 14C10 14 9.5 13 9.5 12C9.5 11.5 9.8 11 10 10.5C8.5 12 7 14 7 16.5C7 20 9.79086 23 12 23Z" fill="#FFCA28" />
    </svg>
  );
}

export function StarIcon({ className, size = 24, color = '#EB7A29' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L14.9 8.6L22 9.2L16.8 13.9L18.4 21L12 17.3L5.6 21L7.2 13.9L2 9.2L9.1 8.6L12 2Z" />
    </svg>
  );
}

export function ClockIcon({ className, size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12,6 12,12 16,14" />
    </svg>
  );
}

export function LocationIcon({ className, size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function CartIcon({ className, size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

export function ArrowRightIcon({ className, size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12,5 19,12 12,19" />
    </svg>
  );
}

export function PlusIcon({ className, size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export function HeartIcon({ className, size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  );
}

export function ChevronIcon({ className, size = 24, color = 'currentColor', direction = 'right' }: IconProps & { direction?: 'left' | 'right' | 'up' | 'down' }) {
  const rotation = { left: 180, right: 0, up: -90, down: 90 }[direction];
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: `rotate(${rotation}deg)` }}>
      <polyline points="9,18 15,12 9,6" />
    </svg>
  );
}

export function SearchIcon({ className, size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export function VegIcon({ className, size = 16 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 16 16">
      <rect x="1" y="1" width="14" height="14" rx="2" fill="none" stroke="#0F8A0F" strokeWidth="1.5" />
      <circle cx="8" cy="8" r="4" fill="#0F8A0F" />
    </svg>
  );
}

export function NonVegIcon({ className, size = 16 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 16 16">
      <rect x="1" y="1" width="14" height="14" rx="2" fill="none" stroke="#9A1E29" strokeWidth="1.5" />
      <polygon points="8,3 13,13 3,13" fill="#9A1E29" />
    </svg>
  );
}

export function FriesIcon({ className, size = 24, color = '#EB7A29' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M7 22L5 8H19L17 22H7Z" fill="#9A1E29" />
      <rect x="8" y="3" width="2" height="12" rx="1" fill={color} />
      <rect x="11" y="2" width="2" height="13" rx="1" fill={color} />
      <rect x="14" y="4" width="2" height="11" rx="1" fill={color} />
    </svg>
  );
}

export function ShakeIcon({ className, size = 24, color = '#E91E63' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M8 8L6 22H18L16 8H8Z" fill={color} opacity={0.8} />
      <path d="M7 6H17V8H7V6Z" fill={color} />
      <circle cx="12" cy="4" r="2" fill="white" stroke={color} strokeWidth="1" />
      <path d="M10 12C10 12 11 14 12 14C13 14 14 12 14 12" stroke="white" strokeWidth="1" opacity={0.5} />
    </svg>
  );
}

export function PhoneIcon({ className, size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}

export function TruckIcon({ className, size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16,8 20,8 23,11 23,16 16,16" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

export function ShieldIcon({ className, size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9,12 11,14 15,10" />
    </svg>
  );
}

export function GiftIcon({ className, size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20,12 20,22 4,22 4,12" />
      <rect x="2" y="7" width="20" height="5" />
      <line x1="12" y1="22" x2="12" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
    </svg>
  );
}

export function TrophyIcon({ className, size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4a2 2 0 01-2-2V5a2 2 0 012-2h2" />
      <path d="M18 9h2a2 2 0 002-2V5a2 2 0 00-2-2h-2" />
      <path d="M6 3h12v7a6 6 0 01-12 0V3z" />
      <path d="M12 16v2" />
      <path d="M8 22h8" />
      <path d="M10 18h4" />
    </svg>
  );
}

export function UsersIcon({ className, size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

export function GlobeIcon({ className, size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  );
}

export function BreadIcon({ className, size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 14C4 10 8 6 12 6C16 6 20 10 20 14H4Z" fill={color} opacity={0.85} />
      <ellipse cx="9" cy="10" rx="1" ry="1.5" fill="white" opacity={0.5} />
      <ellipse cx="14" cy="9" rx="1" ry="1.5" fill="white" opacity={0.5} />
      <path d="M4 16H20C20 19 17 21 12 21C7 21 4 19 4 16Z" fill={color} opacity={0.7} />
    </svg>
  );
}

export function MeatIcon({ className, size = 24, color = '#5D4037' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="12" rx="9" ry="6" fill={color} opacity={0.8} />
      <ellipse cx="12" cy="11" rx="7" ry="4.5" fill={color} />
      <path d="M8 10C9 9 11 9 12 9.5C13 10 15 10 16 9" stroke="white" strokeWidth="0.5" opacity={0.3} />
    </svg>
  );
}

export function CheeseIcon({ className, size = 24, color = '#FFC107' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M2 18L12 4L22 18H2Z" fill={color} />
      <circle cx="8" cy="14" r="1.5" fill="white" opacity={0.4} />
      <circle cx="14" cy="16" r="1" fill="white" opacity={0.4} />
      <circle cx="16" cy="12" r="1.2" fill="white" opacity={0.4} />
    </svg>
  );
}

export function WheatIcon({ className, size = 24, color = '#4AA056' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
      <path d="M12 22V10" />
      <path d="M12 14C9 14 7 12 7 10C9 10 12 11 12 14Z" fill={color} opacity={0.3} />
      <path d="M12 14C15 14 17 12 17 10C15 10 12 11 12 14Z" fill={color} opacity={0.3} />
      <path d="M12 10C9 10 7 8 7 6C9 6 12 7 12 10Z" fill={color} opacity={0.3} />
      <path d="M12 10C15 10 17 8 17 6C15 6 12 7 12 10Z" fill={color} opacity={0.3} />
      <path d="M12 7C10 7 8.5 5.5 8.5 4C10 4 12 5 12 7Z" fill={color} opacity={0.3} />
      <path d="M12 7C14 7 15.5 5.5 15.5 4C14 4 12 5 12 7Z" fill={color} opacity={0.3} />
    </svg>
  );
}

export function SaladIcon({ className, size = 24, color = '#4AA056' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 14C4 18.4 7.6 22 12 22C16.4 22 20 18.4 20 14H4Z" fill={color} opacity={0.2} />
      <path d="M3 14H21" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M8 14C8 10 10 8 12 6C14 8 16 10 16 14" stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M6 14C7 11 9 9 10 8" stroke="#8BC34A" strokeWidth="1.5" fill="none" />
      <path d="M18 14C17 11 15 9 14 8" stroke="#8BC34A" strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="4" r="1.5" fill="#FF5722" />
    </svg>
  );
}

export function MapIcon({ className, size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1,6 1,22 8,18 16,22 23,18 23,2 16,6 8,2" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  );
}

export function CameraIcon({ className, size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

export function LockIcon({ className, size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

export function ChefIcon({ className, size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="7" r="5" fill={color} opacity={0.15} stroke={color} strokeWidth="1.5" />
      <path d="M7 8C7 5 9 3 12 3C15 3 17 5 17 8" stroke={color} strokeWidth="1.5" />
      <rect x="6" y="12" width="12" height="3" rx="1" fill={color} opacity={0.2} stroke={color} strokeWidth="1" />
      <path d="M8 15V20C8 21 9 22 12 22C15 22 16 21 16 20V15" stroke={color} strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export function SparkleIcon({ className, size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" />
      <path d="M19 15L19.7 17.3L22 18L19.7 18.7L19 21L18.3 18.7L16 18L18.3 17.3L19 15Z" opacity={0.6} />
    </svg>
  );
}

export function ZapIcon({ className, size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" />
    </svg>
  );
}

export function MailIcon({ className, size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 7l-10 7L2 7" />
    </svg>
  );
}

export function InstagramIcon({ className, size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function TwitterIcon({ className, size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function FacebookIcon({ className, size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  );
}

export function YoutubeIcon({ className, size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43z" />
      <polygon points="9.75,15.02 15.5,11.75 9.75,8.48" fill={color} />
    </svg>
  );
}

// ─── Admin / UI Icons ─────────────────────────────────────────────────────────

export function PencilIcon({ className, size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

export function TrashIcon({ className, size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3,6 5,6 21,6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  );
}

export function XIcon({ className, size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function CheckIcon({ className, size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20,6 9,17 4,12" />
    </svg>
  );
}

export function DownloadIcon({ className, size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7,10 12,15 17,10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export function UploadIcon({ className, size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17,8 12,3 7,8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

export function RefreshIcon({ className, size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1,4 1,10 7,10" />
      <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
    </svg>
  );
}

export function ToggleOnIcon({ className, size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="1" y="6" width="22" height="12" rx="6" fill={color} />
      <circle cx="17" cy="12" r="4" fill="white" />
    </svg>
  );
}

export function ToggleOffIcon({ className, size = 24, color = '#D1D5DB' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="1" y="6" width="22" height="12" rx="6" fill={color} />
      <circle cx="7" cy="12" r="4" fill="white" />
    </svg>
  );
}

export function SlidersIcon({ className, size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
      <line x1="4"  y1="6"  x2="20" y2="6"  stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="4"  y1="12" x2="20" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="4"  y1="18" x2="20" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="9"  cy="6"  r="2.5" fill={color} />
      <circle cx="15" cy="12" r="2.5" fill={color} />
      <circle cx="9"  cy="18" r="2.5" fill={color} />
    </svg>
  );
}

export function CoinIcon({ className, size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" fill={color} opacity={0.2} stroke={color} strokeWidth="1.5" />
      <circle cx="12" cy="12" r="6" fill={color} opacity={0.3} />
      <path d="M12 8v1m0 6v1m-2-4h1.5a1 1 0 010 2H12m0-2h.5a1 1 0 010-2H11" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function BanIcon({ className, size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
  );
}

export function TicketIcon({ className, size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7a1 1 0 011-1h16a1 1 0 011 1v3a2 2 0 000 4v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3a2 2 0 000-4V7z" />
      <line x1="9" y1="6" x2="9" y2="18" strokeDasharray="2 2" />
    </svg>
  );
}

export function TagIcon({ className, size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

export function RocketIcon({ className, size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

export function CreditCardIcon({ className, size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

export function WalletIcon({ className, size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 010-4h14v4" />
      <path d="M3 5v14a2 2 0 002 2h16v-5" />
      <path d="M18 12a2 2 0 100 4h4v-4h-4z" />
    </svg>
  );
}
