'use client';

import { useMode } from '@/hooks/useMode';
import { motion } from 'framer-motion';

/* ── Animated SVG illustrations for each step ── */

function BrowseIllustration({ color }: { color: string }) {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      {/* Magnifying glass circle */}
      <motion.circle cx="22" cy="22" r="12" stroke={color} strokeWidth="2.5" fill="none"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, ease: 'easeOut' }}
      />
      {/* Glass fill */}
      <motion.circle cx="22" cy="22" r="12" fill={color} opacity={0.1}
        initial={{ scale: 0 }} whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.2, duration: 0.4 }}
      />
      {/* Handle */}
      <motion.line x1="31" y1="31" x2="40" y2="40" stroke={color} strokeWidth="3" strokeLinecap="round"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.4, duration: 0.4, ease: 'easeOut' }}
      />
      {/* Menu lines inside glass */}
      {[16, 21, 26].map((y, i) => (
        <motion.line key={y} x1="16" y1={y} x2="28" y2={y} stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity={0.5}
          initial={{ scaleX: 0, opacity: 0 }} whileInView={{ scaleX: 1, opacity: 0.5 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.6 + i * 0.1, duration: 0.3, ease: 'easeOut' }}
        />
      ))}
      {/* Sparkle */}
      <motion.circle cx="14" cy="14" r="1.5" fill={color} opacity={0.6}
        initial={{ scale: 0 }} whileInView={{ scale: [0, 1.4, 1] }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.9, duration: 0.4 }}
      />
    </svg>
  );
}

function CustomiseIllustration({ color }: { color: string }) {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      {/* Slider tracks */}
      {[14, 24, 34].map((y, i) => (
        <motion.line key={y} x1="8" y1={y} x2="40" y2={y} stroke={color} strokeWidth="2" strokeLinecap="round" opacity={0.2}
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: i * 0.12, duration: 0.5, ease: 'easeOut' }}
        />
      ))}
      {/* Active track fills */}
      <motion.line x1="8" y1="14" x2="28" y2="14" stroke={color} strokeWidth="2" strokeLinecap="round"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.3, duration: 0.4 }}
      />
      <motion.line x1="8" y1="24" x2="18" y2="24" stroke={color} strokeWidth="2" strokeLinecap="round"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.4, duration: 0.4 }}
      />
      <motion.line x1="8" y1="34" x2="34" y2="34" stroke={color} strokeWidth="2" strokeLinecap="round"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.5, duration: 0.4 }}
      />
      {/* Slider knobs */}
      {[{ cx: 28, cy: 14, delay: 0.5 }, { cx: 18, cy: 24, delay: 0.6 }, { cx: 34, cy: 34, delay: 0.7 }].map((knob, i) => (
        <motion.circle key={i} cx={knob.cx} cy={knob.cy} r="4" fill={color}
          initial={{ scale: 0 }} whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: knob.delay, type: 'spring', stiffness: 300 }}
        />
      ))}
      {/* Settings gear sparkle */}
      <motion.path d="M40 8L41 6M40 8L42 9M40 8L38 9" stroke={color} strokeWidth="1" strokeLinecap="round" opacity={0.5}
        initial={{ scale: 0 }} whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.9, duration: 0.3 }}
      />
    </svg>
  );
}

function PayIllustration({ color }: { color: string }) {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      {/* Wallet body */}
      <motion.rect x="6" y="12" width="36" height="26" rx="4" fill={color} opacity={0.1}
        initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        style={{ transformOrigin: '6px 25px' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
      <motion.rect x="6" y="12" width="36" height="26" rx="4" stroke={color} strokeWidth="2" fill="none"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, ease: 'easeOut' }}
      />
      {/* Flap */}
      <motion.path d="M6 18H42" stroke={color} strokeWidth="2" opacity={0.4}
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.3, duration: 0.4 }}
      />
      {/* Card slot */}
      <motion.rect x="28" y="22" width="14" height="10" rx="2" fill={color} opacity={0.2}
        initial={{ x: 42, opacity: 0 }} whileInView={{ x: 28, opacity: 0.2 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.5, duration: 0.4, ease: 'easeOut' }}
      />
      {/* Card circle */}
      <motion.circle cx="38" cy="27" r="3" stroke={color} strokeWidth="1.5" fill="none"
        initial={{ scale: 0 }} whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.7, type: 'spring', stiffness: 300 }}
      />
      {/* Coins */}
      {[{ cx: 14, cy: 28, delay: 0.6 }, { cx: 22, cy: 26, delay: 0.7 }].map((c, i) => (
        <motion.circle key={i} cx={c.cx} cy={c.cy} r="3.5" fill={color} opacity={0.35}
          initial={{ scale: 0, y: 5 }} whileInView={{ scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: c.delay, type: 'spring', stiffness: 260 }}
        />
      ))}
      {/* Rupee symbol */}
      <motion.text x="14" y="31" textAnchor="middle" fontSize="5" fontWeight="800" fill="white"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.8 }}
      >
        ₹
      </motion.text>
      {/* Security check */}
      <motion.path d="M38 8L36 10L34 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={0.5}
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.9, duration: 0.3 }}
      />
    </svg>
  );
}

function EnjoyIllustration({ color }: { color: string }) {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      {/* Delivery bag body */}
      <motion.path
        d="M10 20H38V40C38 42 36 44 34 44H14C12 44 10 42 10 40V20Z"
        fill={color} opacity={0.1}
        initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        style={{ transformOrigin: '24px 44px' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
      <motion.path
        d="M10 20H38V40C38 42 36 44 34 44H14C12 44 10 42 10 40V20Z"
        stroke={color} strokeWidth="2" fill="none"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, ease: 'easeOut' }}
      />
      {/* Bag handles */}
      <motion.path d="M16 20V14C16 10 19 8 24 8C29 8 32 10 32 14V20" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.3, duration: 0.5 }}
      />
      {/* Burger icon on bag */}
      <motion.ellipse cx="24" cy="30" rx="8" ry="3" fill={color} opacity={0.25}
        initial={{ scale: 0 }} whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
      />
      <motion.path d="M16 33H32" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity={0.4}
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.6, duration: 0.3 }}
      />
      {/* Location pin / tracking dot */}
      <motion.circle cx="40" cy="12" r="3" fill={color} opacity={0.6}
        initial={{ scale: 0 }} whileInView={{ scale: [0, 1.4, 1] }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.7, duration: 0.4 }}
      />
      {/* Pulse ring around tracking dot */}
      <motion.circle cx="40" cy="12" r="6" stroke={color} strokeWidth="1" fill="none"
        animate={{ r: [6, 10, 6], opacity: [0.3, 0, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Speed lines */}
      {[0, 1, 2].map((i) => (
        <motion.line key={i}
          x1={2} y1={28 + i * 5} x2={7} y2={28 + i * 5}
          stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity={0.3}
          initial={{ x: 6, opacity: 0 }} whileInView={{ x: 0, opacity: 0.3 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.8 + i * 0.1, duration: 0.3, ease: 'easeOut' }}
        />
      ))}
    </svg>
  );
}

/* ── Step data ── */

type StepItem = {
  illustration: (color: string) => React.ReactNode;
  title: string;
  description: string;
  number: string;
};

const steps: StepItem[] = [
  {
    illustration: (c) => <BrowseIllustration color={c} />,
    title: 'Browse',
    description: 'Pick your items in Classic or Healthy mode',
    number: '01',
  },
  {
    illustration: (c) => <CustomiseIllustration color={c} />,
    title: 'Customise',
    description: 'Choose sizes, addons — build it your way',
    number: '02',
  },
  {
    illustration: (c) => <PayIllustration color={c} />,
    title: 'Pay',
    description: 'COD or online, fast and secure',
    number: '03',
  },
  {
    illustration: (c) => <EnjoyIllustration color={c} />,
    title: 'Enjoy',
    description: 'Track your order live until delivery',
    number: '04',
  },
];

export default function HowItWorksSection() {
  const { isClassic } = useMode();
  const accentColor = isClassic ? '#EB7A29' : '#4AA056';

  return (
    <section
      className="py-14 md:py-20 px-5 transition-colors duration-500 overflow-hidden"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.span
            className="inline-flex items-center gap-2 text-[0.625rem] font-bold uppercase tracking-[0.2em] mb-3 px-3 py-1 rounded-full border"
            style={{
              color: accentColor,
              borderColor: isClassic ? 'rgba(235,122,41,0.25)' : 'rgba(74,160,86,0.25)',
              backgroundColor: isClassic ? 'rgba(235,122,41,0.08)' : 'rgba(74,160,86,0.08)',
            }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4 }}
          >
            {isClassic ? 'Simple & Delicious' : 'Simple & Healthy'}
          </motion.span>

          <motion.h2
            className="text-2xl md:text-[1.75rem] font-black text-gray-900 leading-tight"
            style={{ fontFamily: "var(--font-poppins)" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            How It Works
          </motion.h2>

          <motion.p
            className="text-sm text-gray-600 mt-2 max-w-md mx-auto"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {isClassic
              ? 'From craving to first bite in four easy steps — hot, fresh, and at your door.'
              : 'From picking your plan to guilt-free enjoyment — four simple steps to a healthier you.'}
          </motion.p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 items-start relative">
          {/* Connecting dashed line — desktop only, vertically centered on 80px icon boxes */}
          <motion.div
            className="hidden md:block absolute top-[40px] left-[14%] right-[14%] z-0"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div
              className="w-full border-t-2 border-dashed"
              style={{ borderColor: isClassic ? 'rgba(235,122,41,0.25)' : 'rgba(74,160,86,0.25)' }}
            />
            {/* Arrow heads */}
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute top-1/2 -translate-y-1/2"
                style={{ left: `${25 + i * 33.33}%` }}
              >
                <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                  <path d="M1 1L6 5L1 9" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={0.4} />
                </svg>
              </div>
            ))}
          </motion.div>

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              className="flex flex-col items-center text-center relative z-10 px-2"
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Icon container */}
              <motion.div
                className="w-[80px] h-[80px] rounded-2xl flex items-center justify-center relative overflow-hidden mb-4 transition-colors duration-500"
                style={{ backgroundColor: isClassic ? 'rgba(235,122,41,0.12)' : 'rgba(74,160,86,0.12)' }}
                whileHover={{ scale: 1.08, rotate: 2 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {/* Subtle glow pulse */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{ backgroundColor: accentColor, opacity: 0.05 }}
                  animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.12, 0.05] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
                />
                {step.illustration(accentColor)}
              </motion.div>

              {/* Step number pill */}
              <motion.span
                className="inline-block text-[0.625rem] font-bold px-2.5 py-0.5 rounded-full mb-2"
                style={{
                  backgroundColor: isClassic ? 'rgba(235,122,41,0.1)' : 'rgba(74,160,86,0.1)',
                  color: accentColor,
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.2 + i * 0.1, type: 'spring', stiffness: 250 }}
              >
                Step {step.number}
              </motion.span>

              {/* Title */}
              <motion.h3
                className="text-sm font-bold text-gray-900 mb-1"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.3 }}
              >
                {step.title}
              </motion.h3>

              {/* Description */}
              <motion.p
                className="text-xs text-gray-600 leading-relaxed max-w-[160px]"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.3 }}
              >
                {step.description}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
