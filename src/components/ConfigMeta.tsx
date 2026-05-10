'use client';
import { useConfig } from '@/hooks/useConfig';

export function ConfigMeta() {
  const { config } = useConfig();
  if (!config?.seo) return null;

  return (
    <>
      {config.seo.meta_title && <title>{config.seo.meta_title}</title>}
      {config.seo.meta_title && <meta property="og:title" content={config.seo.meta_title} />}
      {config.seo.meta_description && <meta name="description" content={config.seo.meta_description} />}
      {config.seo.og_type && <meta property="og:type" content={config.seo.og_type} />}
      {config.seo.twitter_handle && <meta name="twitter:site" content={`@${config.seo.twitter_handle}`} />}
      {config.seo.canonical_url && <link rel="canonical" href={config.seo.canonical_url} />}
      {config.branding?.og_image_url && <meta property="og:image" content={config.branding.og_image_url} />}
    </>
  );
}
