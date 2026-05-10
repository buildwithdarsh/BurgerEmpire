/** Server-side API base URL for fetch calls in Server Components / route handlers */
export const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'https://dev-api.build.withdarsh.com'}/api/v1`;

export const ORG_SLUG = 'burgerempire';

export const serverHeaders = {
  'Content-Type': 'application/json',
  'X-Org-Slug': ORG_SLUG,
} as const;
