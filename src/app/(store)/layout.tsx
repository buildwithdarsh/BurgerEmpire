import { cookies } from "next/headers";
import { type ComponentType, Suspense } from "react";
import ModeProvider from "@/components/ModeProvider";
import MotionProvider from "@/components/MotionProvider";
import ComingSoonLanding from "@/components/ComingSoonLanding";
import ErrorBoundary from "@/components/ErrorBoundary";
import ToastContainer from "@/components/ui/Toast";
import NavigationProgress from "@/components/ui/NavigationProgress";
import FloatingModePill from "@/components/FloatingModePill";
import { AnalyticsScripts } from "@/components/AnalyticsScripts";
import { ConfigMeta } from "@/components/ConfigMeta";
import { MaintenanceGuard } from "@/components/MaintenanceGuard";
import type { Mode } from "@/store/mode";

// ┌─────────────────────────────────────────────────┐
// │  COMING SOON MODE                               │
// │  Controlled by NEXT_PUBLIC_COMING_SOON env var. │
// │  When true, ALL routes show the landing page.   │
// │  main → true (countdown)  dev → false (preview) │
// └─────────────────────────────────────────────────┘
const COMING_SOON = process.env.NEXT_PUBLIC_COMING_SOON !== "false";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const modeCookie = cookieStore.get("burger-empire-mode")?.value;
  const initialMode: Mode = modeCookie === "healthy" ? "healthy" : "classic";

  // Check preview bypass
  let isPreview = false;
  if (COMING_SOON) {
    const previewToken = cookieStore.get("bb-preview")?.value;
    if (previewToken) {
      const { verifyPreviewToken } = await import("@/lib/preview");
      const result = await verifyPreviewToken(previewToken);
      isPreview = result.valid;
    }
  }

  if (COMING_SOON && !isPreview) {
    return (
      <ModeProvider initialMode={initialMode}>
        <ComingSoonLanding />
      </ModeProvider>
    );
  }

  // ── Full site (restore imports above when going live) ──
  const Navbar = (await import("@/components/Navbar")).default as ComponentType;
  const Footer = (await import("@/components/Footer")).default as ComponentType;
  const CartDrawer = (await import("@/components/cart/CartDrawer")).default as ComponentType;
  const AppInitializer = (await import("@/components/AppInitializer")).default as ComponentType;
  const BurgerLoader = (await import("@/components/BurgerLoader")).default as ComponentType<{ initialMode: Mode }>;
  const WhatsAppOrderButton = (await import("@/components/WhatsAppOrderButton")).default as ComponentType;
  const CookieBanner = (await import("@/components/CookieBanner")).default as ComponentType;
  const ExitIntentModal = (await import("@/components/ExitIntentModal")).default as ComponentType;



  const MobileShell = (await import("@/components/MobileShell")).default as ComponentType;
  const PreviewBanner = isPreview
    ? (await import("@/components/PreviewBanner")).default as ComponentType
    : null;

  return (
    <ModeProvider initialMode={initialMode}>
      <MotionProvider>
        <MaintenanceGuard>
          {PreviewBanner && <PreviewBanner />}
          <ConfigMeta />
          <AnalyticsScripts />
          <Suspense fallback={null}>
            <NavigationProgress />
          </Suspense>
          <BurgerLoader initialMode={initialMode} />
          <AppInitializer />

          {/* Desktop: existing Navbar (hidden on mobile, display:contents preserves sticky) */}
          <div className="hidden md:contents">
            <Navbar />
          </div>

          {/* Mobile: slim header + bottom tab bar */}
          <MobileShell />

          <ErrorBoundary>
            <main className="pb-mobile-nav">{children}</main>
          </ErrorBoundary>

          {/* Desktop: existing Footer (hidden on mobile, BottomNav replaces it) */}
          <div className="hidden md:contents">
            <Footer />
          </div>

          <CartDrawer />
          <div className="hidden md:block">
            <WhatsAppOrderButton />
          </div>
          <FloatingModePill />
          <CookieBanner />
          <ExitIntentModal />
          <ToastContainer />
        </MaintenanceGuard>
      </MotionProvider>
    </ModeProvider>
  );
}
