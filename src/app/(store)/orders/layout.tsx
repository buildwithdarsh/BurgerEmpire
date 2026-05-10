import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Orders',
  description: 'View and track your Burger Empire orders.',
  alternates: { canonical: 'https://burger-empire.build.withdarsh.com/orders' },
  robots: { index: false, follow: false },
};

export default function OrdersLayout({ children }: { children: React.ReactNode }): React.ReactNode {
  return children;
}
