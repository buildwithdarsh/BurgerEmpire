'use client';

import dynamic from 'next/dynamic';
import { useMode } from '@/hooks/useMode';
import { useConfig } from '@/hooks/useConfig';
import HeroSection from '@/components/home/HeroSection';
import HealthyModeDiscoveryModal from '@/components/home/HealthyModeDiscoveryModal';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import FeaturedCarousel from '@/components/home/FeaturedCarousel';
import WaveDivider from '@/components/WaveDivider';

// Below-the-fold: lazy-loaded to reduce initial JS
const PromiseStrip = dynamic(() => import('@/components/home/PromiseStrip'));
const ExplodedBurger = dynamic(() => import('@/components/home/ExplodedBurger'));
const PromotionsBanner = dynamic(() => import('@/components/home/PromotionsBanner'));
const StudentPassStrip = dynamic(() => import('@/components/home/StudentPassStrip'));
const ComboDealTeaser = dynamic(() => import('@/components/home/ComboDealTeaser'));
const ReviewsTeaser = dynamic(() => import('@/components/home/ReviewsTeaser'));
const SocialWall = dynamic(() => import('@/components/home/SocialWall'));
const AwardsSection = dynamic(() => import('@/components/home/AwardsSection'));
const LoyaltyHighlight = dynamic(() => import('@/components/home/LoyaltyHighlight'));
const ReferAndEarn = dynamic(() => import('@/components/home/ReferAndEarn'));
const LoyaltyBanner = dynamic(() => import('@/components/home/LoyaltyBanner'));
const GiftCardsSection = dynamic(() => import('@/components/home/GiftCardsSection'));
const PWATeaser = dynamic(() => import('@/components/home/PWATeaser'));
export default function HomeContent() {
  const { isClassic } = useMode();
  const { config } = useConfig();

  // Section BG colors
  const hero   = isClassic ? '#C06820' : '#3D8A48';
  const white  = '#FFFFFF';
  const cream  = isClassic ? '#FDF5EC' : '#EDF7F0';
  const peach  = isClassic ? '#FDF3E7' : '#E8F5EC';
  const honey  = isClassic ? '#FCF0DE' : '#E0F2E6';

  return (
    <>
      <HeroSection />
      <WaveDivider variant="wave" topColor={hero} bottomColor={white} />
      <HealthyModeDiscoveryModal />
      <HowItWorksSection />
      <FeaturedCarousel />
      {/* <NonVegReveal /> */}
      <WaveDivider variant="curve" topColor={white} bottomColor={cream} />
      <PromiseStrip />
      <WaveDivider variant="tilt" flip topColor={cream} bottomColor={peach} />
      <ExplodedBurger />
      <WaveDivider variant="wave" topColor={peach} bottomColor={cream} />
      <PromotionsBanner />
      <StudentPassStrip />
      <WaveDivider variant="curve" topColor={cream} bottomColor={peach} />
      <ComboDealTeaser />
      <ReviewsTeaser />
      <WaveDivider variant="curve" flip topColor={cream} bottomColor={honey} />
      <SocialWall />
      <AwardsSection />
      <LoyaltyHighlight />
      <WaveDivider variant="tilt" topColor={honey} bottomColor={white} />
      <ReferAndEarn />
      <WaveDivider variant="curve" topColor={white} bottomColor={honey} />
      <LoyaltyBanner />
      <GiftCardsSection />
      {config.app?.pwa_enabled && <PWATeaser />}
    </>
  );
}
