import type { MetadataRoute } from 'next';

const SITE_URL = (process.env.SITE_URL || 'https://prephubpk.com').replace(/\/$/, '');

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Login-gated or purely interactive pages, nothing for a crawler to
      // usefully index there anyway (a logged-out visit just bounces to a
      // login prompt).
      disallow: ['/profile', '/auth/', '/jobs/*/quiz', '/subjects/*/quiz'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
