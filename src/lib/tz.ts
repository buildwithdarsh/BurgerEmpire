import { TZ } from '@buildwithdarsh/sdk';

TZ.init({
  orgSlug: 'burgerempire',
  orgKey: process.env['NEXT_PUBLIC_TZ_ORG_KEY'] || '',
  baseUrl: process.env['NEXT_PUBLIC_TZ_API_URL'] || 'https://api.work.withdarsh.com',
  keyPrefix: 'be',
});

export { TZ };
