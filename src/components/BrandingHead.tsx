'use client';

import { useEffect } from 'react';
import { useConfig } from '@/hooks/useConfig';

/**
 * Client component that injects dynamic branding into <head> and applies
 * theme CSS custom properties + font-family from org config.
 *
 * Rendered inside the root layout's <body> — Next.js hoists <link>/<meta>
 * tags into <head> automatically when rendered from a client component.
 */
export default function BrandingHead() {
  const { config } = useConfig();

  // Apply theme colors + font-family + dark mode as side effects
  useEffect(() => {
    const root = document.documentElement;

    if (config.branding?.primary_color) {
      root.style.setProperty('--color-primary', config.branding.primary_color);
    }
    if (config.branding?.secondary_color) {
      root.style.setProperty('--color-secondary', config.branding.secondary_color);
    }
    if (config.branding?.accent_color) {
      root.style.setProperty('--color-accent', config.branding.accent_color);
    }
    if (config.branding?.font_family) {
      root.style.setProperty('--font-brand', config.branding.font_family);
      document.body.style.fontFamily = `${config.branding.font_family}, var(--font-body), sans-serif`;
    }
    if (config.branding?.dark_mode_enabled) {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }

    return () => {
      root.style.removeProperty('--color-primary');
      root.style.removeProperty('--color-secondary');
      root.style.removeProperty('--color-accent');
      root.style.removeProperty('--font-brand');
      root.removeAttribute('data-theme');
      document.body.style.fontFamily = '';
    };
  }, [config]);

  return (
    <>
      {/* Favicon override from config */}
      {config.branding?.favicon_url && (
        <link rel="icon" href={config.branding.favicon_url} />
      )}

      {/* OG image override from config */}
      {config.branding?.og_image_url && (
        <meta property="og:image" content={config.branding.og_image_url} />
      )}
    </>
  );
}
