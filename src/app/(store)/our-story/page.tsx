'use client';

import { useMode } from '@/hooks/useMode';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { FireIcon, ChefIcon, LeafIcon, LockIcon } from '@/components/icons';
import WaveDivider from '@/components/WaveDivider';

function AnimatedSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(25px)',
        transition: `opacity 500ms ${delay}ms ease-out, transform 500ms ${delay}ms ease-out`,
      }}
    >
      {children}
    </div>
  );
}

const timeline = [
  { year: '2018', title: 'The Spark', desc: 'A 200 sq ft kitchen. Zero funding. Infinite hunger to prove something.' },
  { year: '2019', title: 'The Internet Found Us', desc: 'One viral reel. 10,000 orders. Second spot opens in Area B.' },
  { year: '2020', title: 'We Refused to Quit', desc: 'Pandemic hit. We went delivery-only and kept every single flame burning.' },
  { year: '2021', title: 'The Comeback', desc: 'Three new kitchens. Drive-throughs. Longer lines than ever.' },
  { year: '2022', title: 'The Challenge', desc: '"Make it healthy." Our fans dared us. We spent 8 months to deliver.' },
  { year: '2023', title: 'Dual Menu Drops', desc: 'Classic AND Healthy — on the same menu. Fast food, redefined.' },
  { year: '2024', title: 'Nationwide Obsession', desc: 'City after city. 15+ locations. Your city could be next.' },
];

export default function OurStoryPage() {
  const { isClassic } = useMode();

  const heroEdge = isClassic ? '#D46E1F' : '#3D8A48';
  const light = isClassic ? '#FFF9F0' : '#F5FBF7';

  return (
    <div className="min-h-screen has-pattern" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Hero */}
      <section
        className="py-16 px-5"
        style={{
          background: isClassic
            ? 'linear-gradient(135deg, #EB7A29, #D46E1F)'
            : 'linear-gradient(135deg, #4AA056, #3D8A48)',
        }}
      >
        <div className="max-w-[800px] mx-auto text-center">
          <AnimatedSection>
            <h1
              className="text-3xl md:text-5xl font-black text-white mb-4"
              style={{ fontFamily: "var(--font-hero)" }}
            >
              {isClassic ? 'Our Story — Burger Empire Abc City Since 2018' : 'How Burger Empire Made Fast Food Honest'}
            </h1>
            <p className="text-base text-white/75 max-w-lg mx-auto">
              {isClassic
                ? 'From 200 sq ft of pure ambition to 50,000+ obsessed fans. Here\'s how it happened.'
                : 'We asked: what if burgers could fuel your body AND your cravings? This is that story.'}
            </p>
          </AnimatedSection>
        </div>
      </section>

      <WaveDivider variant="wave" topColor={heroEdge} bottomColor="#FFFFFF" />

      {/* The Philosophy */}
      <section className="py-16 px-5">
        <div className="max-w-[800px] mx-auto text-center">
          <AnimatedSection>
            <div className="flex justify-center mb-6">
              <FireIcon size={56} color={isClassic ? '#EB7A29' : '#4AA056'} />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4" style={{ fontFamily: "var(--font-poppins)" }}>
              Why Our Burgers Hit Different
            </h2>
            <p className="text-gray-600 leading-relaxed text-base">
              Screaming-hot flat-top. A heavy press. 3 seconds of pure science. The result? A crust so crispy
              it crackles, a center so juicy it drips. Once you taste the smash, there&apos;s no going back.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-5" style={{ backgroundColor: light }}>
        <div className="max-w-[700px] mx-auto">
          <AnimatedSection>
            <h2 className="text-2xl font-black text-gray-900 text-center mb-12" style={{ fontFamily: "var(--font-poppins)" }}>
              Our Timeline
            </h2>
          </AnimatedSection>

          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-200" />

            {timeline.map((event, i) => (
              <AnimatedSection key={event.year} delay={i * 60}>
                <div className="relative flex items-start gap-6 mb-8 last:mb-0">
                  <div
                    className="w-12 h-12 rounded-md lg:rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-black text-white z-10"
                    style={{ backgroundColor: isClassic ? '#EB7A29' : '#4AA056' }}
                  >
                    {event.year.slice(2)}
                  </div>
                  <div className="bg-white rounded-md lg:rounded-xl border border-gray-100 p-5 flex-1">
                    <h3 className="text-[0.9375rem] font-bold text-gray-900 mb-1">{event.title}</h3>
                    <p className="text-sm text-gray-500">{event.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="py-16 px-5">
        <div className="max-w-[900px] mx-auto">
          <AnimatedSection>
            <h2 className="text-2xl font-black text-gray-900 text-center mb-12" style={{ fontFamily: "var(--font-poppins)" }}>
              The Humans Behind the Obsession
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: 'Abc Person', role: 'Chief Burger Officer', quote: 'If your burger doesn\'t make someone close their eyes mid-bite, you haven\'t tried hard enough.', icon: <ChefIcon size={48} color={isClassic ? '#EB7A29' : '#4AA056'} /> },
              { name: 'Xyz Person', role: 'Head of Healthy Innovation', quote: 'They said healthy burgers can\'t taste good. We took that as a dare — and won.', icon: <LeafIcon size={48} color={isClassic ? '#EB7A29' : '#4AA056'} /> },
            ].map((founder, i) => (
              <AnimatedSection key={founder.name} delay={i * 100}>
                <div className="bg-[#FAFAFA] rounded-xl lg:rounded-2xl p-8 text-center border border-gray-100">
                  <div className="flex justify-center mb-4">{founder.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900">{founder.name}</h3>
                  <p className="text-xs font-semibold uppercase tracking-wider mt-1 mb-4" style={{ color: isClassic ? '#EB7A29' : '#4AA056' }}>
                    {founder.role}
                  </p>
                  <blockquote className="text-sm text-gray-500 italic leading-relaxed" style={{ fontFamily: "var(--font-playfair)" }}>
                    &ldquo;{founder.quote}&rdquo;
                  </blockquote>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Healthy Journey */}
      <section className="py-16 px-5" style={{ backgroundColor: light }}>
        <div className="max-w-[700px] mx-auto text-center relative">
          {isClassic && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl lg:rounded-2xl flex flex-col items-center justify-center z-10">
              <LockIcon size={32} color="#9CA3AF" />
              <p className="text-gray-700 font-bold text-sm mb-1 mt-3">The Healthy Journey</p>
              <p className="text-gray-400 text-xs">Toggle to Healthy Mode to unlock</p>
            </div>
          )}
          <AnimatedSection>
            <h2 className="text-2xl font-black text-gray-900 mb-6" style={{ fontFamily: "var(--font-poppins)" }}>
              How We Made Healthy Irresistible
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-8">
              &ldquo;Can you make it healthy without killing the flavor?&rdquo; Our fans asked. So we locked ourselves
              in the kitchen for 8 months. 47 recipes. 3 nutritionists. Zero shortcuts. The result speaks for itself.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { stat: '47', label: 'Recipes Perfected' },
                { stat: '8', label: 'Months of Obsession' },
                { stat: '0', label: 'Artificial Anything' },
              ].map((item) => (
                <div key={item.label} className="bg-white rounded-md lg:rounded-xl p-4 border border-gray-100">
                  <div className="text-2xl font-black" style={{ color: isClassic ? '#EB7A29' : '#4AA056' }}>{item.stat}</div>
                  <div className="text-[0.6875rem] text-gray-400 mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
