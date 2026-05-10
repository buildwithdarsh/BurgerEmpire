'use client';

import { motion } from 'framer-motion';

const ease = [0.16, 1, 0.3, 1] as const;

/** Receipt flying into kitchen */
export function PlacedIllustration({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" className="w-full h-full">
      {/* Kitchen window */}
      <motion.rect x="100" y="30" width="80" height="100" rx="12" fill={color} opacity={0.08}
        initial={{ opacity: 0 }} animate={{ opacity: 0.08 }} transition={{ duration: 0.5 }}
      />
      <motion.rect x="100" y="30" width="80" height="100" rx="12" stroke={color} strokeWidth="2" fill="none" opacity={0.2}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease }}
      />
      {/* Window shelf */}
      <motion.rect x="105" y="85" width="70" height="3" rx="1.5" fill={color} opacity={0.15}
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.4, duration: 0.4 }}
      />
      {/* Bell on shelf */}
      <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8, type: 'spring', stiffness: 300 }}>
        <circle cx="140" cy="78" r="6" fill={color} opacity={0.2} />
        <path d="M137 78a3 3 0 016 0" stroke={color} strokeWidth="1.5" fill="none" opacity={0.5} />
        <circle cx="140" cy="74" r="1" fill={color} opacity={0.4} />
      </motion.g>
      {/* Ring animation on bell */}
      <motion.g
        animate={{ rotate: [-5, 5, -5, 0] }}
        transition={{ delay: 1.2, duration: 0.4, ease: 'easeInOut' }}
        style={{ transformOrigin: '140px 74px' }}
      >
        <motion.path d="M133 72C132 70 133 68 135 68" stroke={color} strokeWidth="1" opacity={0.3}
          initial={{ opacity: 0 }} animate={{ opacity: [0, 0.3, 0] }} transition={{ delay: 1.2, duration: 0.6 }}
        />
        <motion.path d="M147 72C148 70 147 68 145 68" stroke={color} strokeWidth="1" opacity={0.3}
          initial={{ opacity: 0 }} animate={{ opacity: [0, 0.3, 0] }} transition={{ delay: 1.3, duration: 0.6 }}
        />
      </motion.g>

      {/* Receipt flying in */}
      <motion.g
        initial={{ x: -60, y: 20, rotate: -15, opacity: 0 }}
        animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease, delay: 0.3 }}
      >
        {/* Receipt paper */}
        <rect x="30" y="45" width="45" height="60" rx="4" fill="white" stroke={color} strokeWidth="1.5" />
        {/* Receipt lines */}
        {[0, 1, 2, 3].map((i) => (
          <motion.rect key={i} x="38" y={55 + i * 10} width={i === 3 ? 20 : 28} height="3" rx="1.5" fill={color} opacity={0.15}
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }}
          />
        ))}
        {/* Checkmark on receipt */}
        <motion.path d="M40 85L44 89L52 81" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.3, duration: 0.4 }}
        />
      </motion.g>

      {/* Motion trail dots */}
      {[0, 1, 2].map((i) => (
        <motion.circle key={i} cx={78 + i * 8} cy={75} r="2" fill={color}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0.3, 0], scale: [0, 1, 0] }}
          transition={{ delay: 0.5 + i * 0.1, duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
        />
      ))}
    </svg>
  );
}

/** Chef thumbs up with receipt */
export function ConfirmedIllustration({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" className="w-full h-full">
      {/* Chef body */}
      <motion.g initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease }}>
        {/* Body/apron */}
        <path d="M80 95H120V140C120 145 115 148 100 148C85 148 80 145 80 140V95Z" fill={color} opacity={0.1} />
        <rect x="88" y="95" width="24" height="50" rx="2" fill="white" opacity={0.5} />

        {/* Head */}
        <circle cx="100" cy="72" r="20" fill={color} opacity={0.08} stroke={color} strokeWidth="1.5" />

        {/* Chef hat */}
        <motion.g initial={{ y: 8, scale: 0.8 }} animate={{ y: 0, scale: 1 }} transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}>
          <path d="M80 58C80 42 88 35 100 35C112 35 120 42 120 58H80Z" fill="white" stroke={color} strokeWidth="1.5" />
          <rect x="78" y="56" width="44" height="6" rx="3" fill="white" stroke={color} strokeWidth="1.5" />
          {/* Hat puff */}
          <circle cx="92" cy="40" r="5" fill="white" stroke={color} strokeWidth="1" opacity={0.5} />
          <circle cx="108" cy="40" r="5" fill="white" stroke={color} strokeWidth="1" opacity={0.5} />
          <circle cx="100" cy="36" r="6" fill="white" stroke={color} strokeWidth="1" opacity={0.5} />
        </motion.g>

        {/* Face: smile */}
        <motion.path d="M93 75C95 78 105 78 107 75" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 0.4 }}
        />
        {/* Eyes */}
        <circle cx="94" cy="69" r="1.5" fill={color} opacity={0.5} />
        <circle cx="106" cy="69" r="1.5" fill={color} opacity={0.5} />
      </motion.g>

      {/* Thumbs up hand */}
      <motion.g
        initial={{ x: 20, y: 10, rotate: 15, scale: 0 }}
        animate={{ x: 0, y: 0, rotate: 0, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.5, type: 'spring', stiffness: 200 }}
      >
        <rect x="130" y="75" width="12" height="30" rx="6" fill={color} opacity={0.2} stroke={color} strokeWidth="1.5" />
        <rect x="128" y="68" width="16" height="12" rx="6" fill={color} opacity={0.15} stroke={color} strokeWidth="1.5" />
      </motion.g>

      {/* Sparkles around thumbs up */}
      {[
        { x: 155, y: 65, delay: 1.2 },
        { x: 150, y: 55, delay: 1.4 },
        { x: 160, y: 75, delay: 1.3 },
      ].map((s, i) => (
        <motion.g key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.3, 1], opacity: [0, 0.6, 0.3] }}
          transition={{ delay: s.delay, duration: 0.4 }}
        >
          <line x1={s.x - 3} y1={s.y} x2={s.x + 3} y2={s.y} stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <line x1={s.x} y1={s.y - 3} x2={s.x} y2={s.y + 3} stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </motion.g>
      ))}

      {/* Mini receipt in other hand */}
      <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring' }}>
        <rect x="52" y="82" width="20" height="28" rx="2" fill="white" stroke={color} strokeWidth="1" />
        <rect x="56" y="88" width="12" height="2" rx="1" fill={color} opacity={0.15} />
        <rect x="56" y="93" width="10" height="2" rx="1" fill={color} opacity={0.15} />
        <rect x="56" y="98" width="8" height="2" rx="1" fill={color} opacity={0.15} />
      </motion.g>
    </svg>
  );
}

/** Chef cooking with pan and steam */
export function PreparingIllustration({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" className="w-full h-full">
      {/* Stove/counter */}
      <motion.rect x="30" y="120" width="140" height="8" rx="4" fill={color} opacity={0.1}
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5 }}
      />

      {/* Pan */}
      <motion.g initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6, ease }}>
        {/* Pan body */}
        <ellipse cx="100" cy="110" rx="45" ry="10" fill={color} opacity={0.08} />
        <path d="M55 105C55 95 72 88 100 88C128 88 145 95 145 105" stroke={color} strokeWidth="2" fill="none" />
        <ellipse cx="100" cy="105" rx="45" ry="10" fill={color} opacity={0.06} stroke={color} strokeWidth="1.5" />
        {/* Handle */}
        <motion.rect x="145" y="100" width="35" height="6" rx="3" fill={color} opacity={0.2} stroke={color} strokeWidth="1.5"
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} style={{ transformOrigin: '145px 103px' }} transition={{ delay: 0.4, duration: 0.4 }}
        />
      </motion.g>

      {/* Food in pan - patty */}
      <motion.ellipse cx="90" cy="96" rx="14" ry="5" fill={color} opacity={0.3}
        animate={{ y: [0, -15, 0], rotate: [0, 180, 360] }}
        transition={{ delay: 1, duration: 1.2, ease: 'easeInOut', repeat: Infinity, repeatDelay: 2 }}
        style={{ transformOrigin: '90px 96px' }}
      />
      {/* Veggies */}
      <motion.circle cx="108" cy="95" r="4" fill="#43A047" opacity={0.4}
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8, type: 'spring' }}
      />
      <motion.circle cx="80" cy="97" r="3" fill="#EF5350" opacity={0.4}
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.9, type: 'spring' }}
      />

      {/* Steam wisps */}
      {[
        { x: 80, delay: 0.6 },
        { x: 95, delay: 0.8 },
        { x: 110, delay: 1.0 },
        { x: 120, delay: 1.2 },
      ].map((s, i) => (
        <motion.path key={i}
          d={`M${s.x} 85C${s.x - 4} 70 ${s.x + 4} 55 ${s.x} 40`}
          stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1], opacity: [0, 0.25, 0] }}
          transition={{ delay: s.delay, duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
        />
      ))}

      {/* Flame under pan */}
      {[85, 100, 115].map((x, i) => (
        <motion.path key={i}
          d={`M${x} 128C${x - 3} 122 ${x} 118 ${x} 118C${x} 118 ${x + 3} 122 ${x} 128`}
          fill={color} opacity={0.3}
          animate={{ scaleY: [0.8, 1.2, 0.8], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
          style={{ transformOrigin: `${x}px 128px` }}
        />
      ))}
    </svg>
  );
}

/** Food bag being packed */
export function ReadyIllustration({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" className="w-full h-full">
      {/* Paper bag */}
      <motion.g initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease }}>
        {/* Bag body */}
        <path d="M60 55H140L135 145H65L60 55Z" fill={color} opacity={0.08} />
        <path d="M60 55H140L135 145H65L60 55Z" stroke={color} strokeWidth="2" strokeLinejoin="round" fill="none" />
        {/* Bag fold top */}
        <path d="M60 55L65 45H135L140 55" stroke={color} strokeWidth="2" fill="none" />
        {/* Bag handles */}
        <motion.path d="M80 55V45" stroke={color} strokeWidth="2" strokeLinecap="round"
          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.4, duration: 0.3 }}
        />
        <motion.path d="M120 55V45" stroke={color} strokeWidth="2" strokeLinecap="round"
          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.5, duration: 0.3 }}
        />
        {/* Brand logo circle on bag */}
        <motion.circle cx="100" cy="95" r="15" stroke={color} strokeWidth="1.5" fill="none" opacity={0.2}
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6, type: 'spring' }}
        />
        <motion.text x="100" y="100" textAnchor="middle" fontSize="10" fill={color} fontWeight="800" opacity={0.25}
          initial={{ opacity: 0 }} animate={{ opacity: 0.25 }} transition={{ delay: 0.8 }}
        >
          BB
        </motion.text>
      </motion.g>

      {/* Items going into bag */}
      <motion.g
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: [0, 1, 1, 0] }}
        transition={{ delay: 1, duration: 1.5, repeat: Infinity, repeatDelay: 1.5 }}
      >
        {/* Mini burger going in */}
        <rect x="88" y="25" width="24" height="10" rx="5" fill={color} opacity={0.3} />
        <rect x="86" y="30" width="28" height="4" rx="2" fill={color} opacity={0.2} />
      </motion.g>

      {/* Checkmark seal */}
      <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2, type: 'spring', stiffness: 300 }}>
        <circle cx="145" cy="50" r="12" fill={color} opacity={0.15} />
        <circle cx="145" cy="50" r="12" stroke={color} strokeWidth="1.5" fill="none" />
        <motion.path d="M139 50L143 54L151 46" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.5, duration: 0.4 }}
        />
      </motion.g>

      {/* Sparkles */}
      {[{ x: 50, y: 40 }, { x: 155, y: 80 }].map((s, i) => (
        <motion.g key={i} initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1], opacity: [0, 0.5, 0.3] }}
          transition={{ delay: 1.6 + i * 0.15, duration: 0.4 }}
        >
          <line x1={s.x - 4} y1={s.y} x2={s.x + 4} y2={s.y} stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <line x1={s.x} y1={s.y - 4} x2={s.x} y2={s.y + 4} stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </motion.g>
      ))}
    </svg>
  );
}

/** Scooter with food delivery, motion lines */
export function DispatchedIllustration({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" className="w-full h-full">
      {/* Road */}
      <motion.rect x="10" y="130" width="180" height="3" rx="1.5" fill={color} opacity={0.1}
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5 }}
      />
      {/* Road dashes */}
      {[40, 80, 120, 160].map((x, i) => (
        <motion.rect key={i} x={x} y="135" width="15" height="2" rx="1" fill={color} opacity={0.08}
          initial={{ opacity: 0 }} animate={{ opacity: 0.08 }} transition={{ delay: 0.3 + i * 0.1 }}
        />
      ))}

      {/* Scooter group — subtle horizontal bobble */}
      <motion.g
        animate={{ x: [0, 3, 0, -2, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Wheels */}
        <motion.circle cx="85" cy="125" r="10" stroke={color} strokeWidth="2" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }}
        />
        <circle cx="85" cy="125" r="3" fill={color} opacity={0.2} />
        <motion.circle cx="140" cy="125" r="10" stroke={color} strokeWidth="2" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.1, duration: 0.6 }}
        />
        <circle cx="140" cy="125" r="3" fill={color} opacity={0.2} />

        {/* Wheel spokes spin */}
        <motion.g animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} style={{ transformOrigin: '85px 125px' }}>
          <line x1="85" y1="118" x2="85" y2="132" stroke={color} strokeWidth="0.8" opacity={0.15} />
          <line x1="78" y1="125" x2="92" y2="125" stroke={color} strokeWidth="0.8" opacity={0.15} />
        </motion.g>
        <motion.g animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} style={{ transformOrigin: '140px 125px' }}>
          <line x1="140" y1="118" x2="140" y2="132" stroke={color} strokeWidth="0.8" opacity={0.15} />
          <line x1="133" y1="125" x2="147" y2="125" stroke={color} strokeWidth="0.8" opacity={0.15} />
        </motion.g>

        {/* Scooter body */}
        <motion.g initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.5, ease }}>
          <path d="M80 115H145L140 105H100L95 115Z" fill={color} opacity={0.15} stroke={color} strokeWidth="1.5" />
          {/* Seat */}
          <rect x="105" y="98" width="25" height="7" rx="3.5" fill={color} opacity={0.2} stroke={color} strokeWidth="1" />
          {/* Handlebar */}
          <path d="M140 105L148 90" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <line x1="144" y1="90" x2="152" y2="90" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        </motion.g>

        {/* Food bag on back */}
        <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}>
          <rect x="82" y="78" width="24" height="28" rx="4" fill={color} opacity={0.12} stroke={color} strokeWidth="1.5" />
          <rect x="86" y="78" width="16" height="4" rx="2" fill={color} opacity={0.1} />
          {/* BB logo */}
          <text x="94" y="97" textAnchor="middle" fontSize="8" fill={color} fontWeight="800" opacity={0.2}>BB</text>
        </motion.g>

        {/* Rider silhouette */}
        <motion.g initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.4 }}>
          <circle cx="120" cy="75" r="8" fill={color} opacity={0.12} stroke={color} strokeWidth="1.5" />
          {/* Helmet */}
          <path d="M112 73C112 66 115 63 120 63C125 63 128 66 128 73" fill={color} opacity={0.08} stroke={color} strokeWidth="1" />
          {/* Body */}
          <path d="M115 83L110 105H130L125 83" fill={color} opacity={0.06} />
        </motion.g>
      </motion.g>

      {/* Motion lines (left side) */}
      {[0, 1, 2].map((i) => (
        <motion.line key={i}
          x1={30 + i * 5} y1={108 + i * 8} x2={50 + i * 5} y2={108 + i * 8}
          stroke={color} strokeWidth="2" strokeLinecap="round"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: [0, 0.3, 0], x: [10, -15] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}

      {/* Speed dots */}
      {[0, 1, 2, 3].map((i) => (
        <motion.circle key={`dot-${i}`}
          cx={20 + i * 12} cy={125} r="1.5" fill={color}
          animate={{ opacity: [0, 0.4, 0], x: [-5, -20] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </svg>
  );
}
