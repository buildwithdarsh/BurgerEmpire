import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Account',
  description: 'Manage your Burger Empire account, addresses, and preferences.',
  alternates: { canonical: 'https://burger-empire.build.withdarsh.com/account' },
  robots: { index: false, follow: false },
};

export default function AccountLayout({ children }: { children: React.ReactNode }): React.ReactNode {
  return children;
}
