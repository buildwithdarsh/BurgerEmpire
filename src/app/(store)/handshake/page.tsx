"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useModeStore } from "@/store/mode";
import Link from "next/link";

/* ── Animations ── */

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ── Perks ── */

const perks = [
  {
    title: "Gourmet In-Villa Dining",
    desc: "BabyBurger signatures delivered to your Velora suite — hot, fresh, unforgettable.",
    gradient: "from-[#EB7A29] to-[#9A1E29]",
    healthyGradient: "from-[#4AA056] to-[#3D8A48]",
  },
  {
    title: "Double Loyalty Points",
    desc: "Earn on both platforms. Every stay fuels burger cravings, every bite levels up your getaway.",
    gradient: "from-[#C9A84C] to-[#EB7A29]",
    healthyGradient: "from-[#6AAF7E] to-[#4AA056]",
  },
  {
    title: "Exclusive Combo Drops",
    desc: "Limited-edition villa-stay + burger-feast combos you won't find anywhere else.",
    gradient: "from-[#9A1E29] to-[#C9A84C]",
    healthyGradient: "from-[#3D8A48] to-[#C9A84C]",
  },
  {
    title: "Priority Room Service",
    desc: "BabyBurger orders at Velora skip the queue. Record-time delivery — guaranteed.",
    gradient: "from-[#EB7A29] to-[#C9A84C]",
    healthyGradient: "from-[#4AA056] to-[#6AAF7E]",
  },
];

/* ── Page ── */

export default function HandshakePage() {
  const { mode } = useModeStore();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  const isClassic = mode === "classic";

  return (
    <main className="min-h-screen overflow-hidden" style={{ background: "var(--c-page-bg)" }}>
      {/* ━━━ HERO — Dark, full-bleed ━━━ */}
      <section
        ref={heroRef}
        className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
        style={{ background: "#0D0D0D" }}
      >
        {/* Parallax glow orbs */}
        <motion.div style={{ y: bgY }} className="absolute inset-0 z-0">
          {/* BabyBurger glow — left */}
          <div
            className="absolute top-1/3 -left-20 w-[500px] h-[500px] rounded-full blur-[120px]"
            style={{
              background: isClassic
                ? "rgba(235,122,41,0.15)"
                : "rgba(74,160,86,0.15)",
            }}
          />
          {/* Velora glow — right */}
          <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] rounded-full blur-[100px] bg-[rgba(201,168,76,0.1)]" />
          {/* Center highlight */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[80px] bg-white/[0.03]" />
        </motion.div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 z-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <motion.div
          style={{ y: textY }}
          className="relative z-10 text-center px-5 max-w-5xl mx-auto"
        >
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div variants={fadeUp} className="flex justify-center mb-8">
              <span
                className="inline-flex items-center gap-3 text-[0.6875rem] font-bold uppercase tracking-[0.25em] px-5 py-2 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: isClassic ? "#EB7A29" : "#4AA056" }}
                />
                Official Partnership
                <span className="w-2 h-2 rounded-full bg-[#C9A84C]" />
              </span>
            </motion.div>

            {/* Brand Names — Big, bold */}
            <motion.div variants={fadeUp} className="mb-6">
              <h1
                className="text-5xl sm:text-7xl lg:text-[6.25rem] font-bold leading-[0.95] tracking-tight"
                style={{ fontFamily: "var(--font-hero)" }}
              >
                <span className="text-white">Burger</span>
                <span style={{ color: isClassic ? "#EB7A29" : "#4AA056" }}>Buddy</span>
                {/* X connector */}
                <span className="flex items-center justify-center gap-4 my-4" aria-hidden="true">
                  <span
                    className="h-px flex-1 max-w-[80px] inline-block"
                    style={{
                      background: `linear-gradient(to right, transparent, ${isClassic ? "#EB7A29" : "#4AA056"})`,
                    }}
                  />
                  <span
                    className="text-lg font-medium tracking-wider"
                    style={{ color: "rgba(255,255,255,0.25)" }}
                  >
                    &times;
                  </span>
                  <span
                    className="h-px flex-1 max-w-[80px] inline-block"
                    style={{
                      background: "linear-gradient(to left, transparent, #C9A84C)",
                    }}
                  />
                </span>
                <span
                  className="block text-5xl sm:text-7xl lg:text-[6.25rem] leading-[0.95] tracking-tight"
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontWeight: 400,
                    letterSpacing: "0.04em",
                  }}
                >
                  <span
                    style={{
                      background: "linear-gradient(135deg, #C9A84C, #E8D5B0)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Velora
                  </span>
                </span>
              </h1>
            </motion.div>

            {/* Tagline */}
            <motion.p
              variants={fadeUp}
              className="text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-12"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              When flame-grilled perfection checks into a luxury villa, magic
              happens. Bold flavours meet serene escapes.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/menu"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl lg:rounded-2xl text-[0.875rem] font-bold uppercase tracking-wide transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.97]"
                style={{
                  background: isClassic ? "#EB7A29" : "#4AA056",
                  color: isClassic ? "#1A1A1A" : "#FFFFFF",
                  boxShadow: isClassic
                    ? "0 8px 30px rgba(235,122,41,0.3)"
                    : "0 8px 30px rgba(74,160,86,0.3)",
                }}
              >
                Explore Our Menu
              </Link>
              <a
                href="#story"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl lg:rounded-2xl text-[0.875rem] font-bold uppercase tracking-wide border-2 transition-all duration-300 hover:bg-white/5 hover:-translate-y-0.5"
                style={{
                  borderColor: "rgba(201,168,76,0.3)",
                  color: "#C9A84C",
                }}
              >
                The Story &darr;
              </a>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <span className="text-[0.625rem] uppercase tracking-widest text-white/30 font-semibold">
            Scroll
          </span>
          <svg
            width="20"
            height="24"
            viewBox="0 0 20 24"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="2"
          >
            <path
              d="M10 4L10 20M10 20L4 14M10 20L16 14"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </section>

      {/* ━━━ STORY SECTION ━━━ */}
      <section
        id="story"
        className="relative py-24 sm:py-32 px-5"
        style={{ background: "var(--c-page-bg)" }}
      >
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-5xl mx-auto"
        >
          {/* Heading */}
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span
              className="inline-block text-[0.6875rem] font-bold uppercase tracking-[0.25em] px-4 py-1.5 rounded-full mb-5"
              style={{
                background: isClassic
                  ? "rgba(235,122,41,0.1)"
                  : "rgba(74,160,86,0.1)",
                color: isClassic ? "#EB7A29" : "#4AA056",
              }}
            >
              The Story
            </span>
            <h2
              className="text-3xl sm:text-5xl font-bold"
              style={{
                fontFamily: "var(--font-hero)",
                color: "var(--c-text-on-bg)",
              }}
            >
              Two Passions.{" "}
              <span
                style={{
                  background: `linear-gradient(135deg, ${isClassic ? "#EB7A29" : "#4AA056"}, #C9A84C)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                One Experience.
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div variants={fadeUp} className="space-y-5">
              <p
                className="text-base sm:text-lg leading-relaxed"
                style={{
                  color: "var(--c-text-on-bg)",
                  opacity: 0.75,
                  fontFamily: "var(--font-body)",
                }}
              >
                At <strong>BabyBurger</strong>, food is an event — not a meal.
                At <strong>Velora</strong>, every stay is a private
                celebration curated down to the last detail.
              </p>
              <p
                className="text-base sm:text-lg leading-relaxed"
                style={{
                  color: "var(--c-text-on-bg)",
                  opacity: 0.75,
                  fontFamily: "var(--font-body)",
                }}
              >
                The question was never <em>if</em> — it was{" "}
                <em>how soon</em>. Now, world-class burgers meet world-class
                hospitality, creating moments you&apos;ll savour long after
                checkout.
              </p>

              {/* Stats row */}
              <div className="flex gap-8 pt-4">
                {[
                  { value: "50K+", label: "Happy Foodies" },
                  { value: "4.9", label: "Velora Rating" },
                  { value: "1", label: "Epic Collab" },
                ].map((s) => (
                  <div key={s.label}>
                    <div
                      className="text-2xl font-black"
                      style={{
                        fontFamily: "var(--font-hero)",
                        color: isClassic ? "#EB7A29" : "#4AA056",
                      }}
                    >
                      {s.value}
                    </div>
                    <div
                      className="text-[0.6875rem] font-medium uppercase tracking-wider"
                      style={{ color: "var(--c-text-on-bg)", opacity: 0.45 }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Visual — gradient card */}
            <motion.div variants={scaleIn} className="relative">
              <div
                className="aspect-[4/5] max-w-sm mx-auto rounded-3xl overflow-hidden relative"
                style={{
                  background: isClassic
                    ? "linear-gradient(160deg, #1A1A1A 0%, #2C1A00 100%)"
                    : "linear-gradient(160deg, #1C2B1E 0%, #0A1A0D 100%)",
                }}
              >
                {/* Inner glow */}
                <div
                  className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] rounded-full blur-[80px]"
                  style={{
                    background: isClassic
                      ? "rgba(235,122,41,0.12)"
                      : "rgba(74,160,86,0.12)",
                  }}
                />
                <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[200px] h-[200px] rounded-full blur-[60px] bg-[rgba(201,168,76,0.08)]" />

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center p-8">
                  <div
                    className="text-[0.6875rem] font-bold uppercase tracking-[0.3em] mb-8"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    Exclusively Yours
                  </div>

                  <div
                    className="text-4xl sm:text-5xl font-bold leading-[1.1] text-center mb-3"
                    style={{ fontFamily: "var(--font-hero)", color: "#fff" }}
                  >
                    Burger
                    <span style={{ color: isClassic ? "#EB7A29" : "#4AA056" }}>
                      Buddy
                    </span>
                  </div>
                  <div
                    className="text-lg mb-3"
                    style={{ color: "rgba(255,255,255,0.2)" }}
                  >
                    &times;
                  </div>
                  <div
                    className="text-3xl sm:text-4xl text-center"
                    style={{
                      fontFamily: "var(--font-cormorant)",
                      fontWeight: 400,
                      background: "linear-gradient(135deg, #C9A84C, #E8D5B0)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Velora
                  </div>

                  <div
                    className="w-12 h-px mt-8"
                    style={{
                      background: `linear-gradient(to right, ${isClassic ? "#EB7A29" : "#4AA056"}, #C9A84C)`,
                    }}
                  />

                  <div
                    className="text-[0.6875rem] font-medium uppercase tracking-[0.2em] mt-6"
                    style={{ color: "rgba(255,255,255,0.25)" }}
                  >
                    Flavour &middot; Luxury &middot; Together
                  </div>
                </div>

                {/* Border glow */}
                <div
                  className="absolute inset-0 rounded-3xl pointer-events-none"
                  style={{
                    border: `1px solid ${isClassic ? "rgba(235,122,41,0.12)" : "rgba(74,160,86,0.12)"}`,
                  }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ━━━ PERKS — Dark surface ━━━ */}
      <section
        className="relative py-24 sm:py-32 px-5"
        style={{ background: "var(--c-surface)" }}
      >
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span
              className="inline-block text-[0.6875rem] font-bold uppercase tracking-[0.25em] px-4 py-1.5 rounded-full mb-5"
              style={{
                background: isClassic
                  ? "rgba(235,122,41,0.08)"
                  : "rgba(74,160,86,0.08)",
                color: isClassic ? "#EB7A29" : "#4AA056",
              }}
            >
              What You Get
            </span>
            <h2
              className="text-3xl sm:text-5xl font-bold"
              style={{
                fontFamily: "var(--font-hero)",
                color: "var(--c-text-primary)",
              }}
            >
              Perks of the Partnership
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5">
            {perks.map((perk, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{
                  y: -4,
                  transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                }}
                className="group relative rounded-xl lg:rounded-2xl p-7 sm:p-8 transition-all duration-300"
                style={{
                  background: isClassic
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {/* Number accent */}
                <div
                  className="text-[5rem] font-black leading-none absolute top-4 right-6 select-none pointer-events-none"
                  style={{
                    fontFamily: "var(--font-hero)",
                    background: `linear-gradient(135deg, ${isClassic ? "rgba(235,122,41,0.06)" : "rgba(74,160,86,0.06)"}, transparent)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>

                {/* Gradient top border */}
                <div
                  className={`absolute top-0 left-6 right-6 h-px bg-gradient-to-r ${isClassic ? perk.gradient : perk.healthyGradient} opacity-30 group-hover:opacity-60 transition-opacity duration-300`}
                />

                <h3
                  className="text-lg sm:text-xl font-bold mb-3 relative z-10"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--c-text-primary)",
                  }}
                >
                  {perk.title}
                </h3>
                <p
                  className="text-sm leading-relaxed relative z-10"
                  style={{ color: "var(--c-text-primary)", opacity: 0.5 }}
                >
                  {perk.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ━━━ FINAL CTA ━━━ */}
      <section className="relative py-28 sm:py-40 px-5 overflow-hidden bg-[#0D0D0D]">
        {/* Center glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{
            background: isClassic
              ? "rgba(235,122,41,0.08)"
              : "rgba(74,160,86,0.08)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-center max-w-3xl mx-auto"
        >
          <h2
            className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6"
            style={{ fontFamily: "var(--font-hero)", color: "#FFFFFF" }}
          >
            Ready to{" "}
            <span
              style={{
                background: `linear-gradient(135deg, ${isClassic ? "#EB7A29" : "#4AA056"}, #C9A84C)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Taste the Stay
            </span>
            ?
          </h2>
          <p
            className="text-base sm:text-lg mb-12 leading-relaxed"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Book your Velora escape and unlock BabyBurger perks — or order
            now and stack points toward your next villa getaway.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/menu"
              className="inline-flex items-center justify-center px-10 py-4 rounded-xl lg:rounded-2xl text-[0.875rem] font-bold uppercase tracking-wide transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.97]"
              style={{
                background: `linear-gradient(135deg, ${isClassic ? "#EB7A29" : "#4AA056"}, ${isClassic ? "#FFBD4A" : "#6AAF7E"})`,
                color: isClassic ? "#1A1A1A" : "#FFFFFF",
                boxShadow: isClassic
                  ? "0 10px 40px rgba(235,122,41,0.25)"
                  : "0 10px 40px rgba(74,160,86,0.25)",
              }}
            >
              Order from BabyBurger
            </Link>
            <a
              href="https://velora.example.com/booking"
              className="inline-flex items-center justify-center px-10 py-4 rounded-xl lg:rounded-2xl text-[0.875rem] font-bold uppercase tracking-wide border-2 transition-all duration-300 hover:bg-white/5 hover:-translate-y-0.5"
              style={{
                borderColor: "rgba(201,168,76,0.3)",
                color: "#C9A84C",
              }}
            >
              Book at Velora
            </a>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
