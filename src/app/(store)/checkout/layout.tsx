import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your Burger Empire order.',
  alternates: { canonical: 'https://burger-empire.build.withdarsh.com/checkout' },
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }): React.ReactNode {
  return children;
}
