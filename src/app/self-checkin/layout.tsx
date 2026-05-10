import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Self Check-in | Burger Empire',
  description: 'Dine-in kiosk ordering',
  robots: { index: false, follow: false },
};

// Standalone kiosk layout — no Navbar, Footer, or CartDrawer.
// Body background is inherited from globals.css (--c-page-bg = #FAF8F4).
export default function SelfCheckinLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
