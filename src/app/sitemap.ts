import type { MetadataRoute } from 'next';
import type { Job } from '@/lib/api';

// Set SITE_URL in production if the live domain differs.
const SITE_URL = (process.env.SITE_URL || 'https://prephubpk.com').replace(/\/$/, '');
// Server-side only, talks to the backend directly rather than bouncing
// through this same Next.js server's own /api rewrite.
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

async function getPublishedJobs(): Promise<Job[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/jobs`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.jobs) ? data.jobs : [];
  } catch {
    // Sitemap generation should never fail the whole page just because the
    // backend was briefly unreachable, fall back to the static routes only.
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const jobs = await getPublishedJobs();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/jobs`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/mcqs`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/mock-test`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/contact`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/advertise`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/privacy-policy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/terms-of-service`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/disclaimer`, changeFrequency: 'yearly', priority: 0.2 },
  ];

  // /jobs/{slug}, same URL shape the app itself links to (see lib/api.ts's
  // jobHref helper), kept up to date automatically since this is generated
  // from the live jobs list on every sitemap request.
  const jobRoutes: MetadataRoute.Sitemap = jobs.map(job => ({
    url: `${SITE_URL}/jobs/${job.slug}`,
    lastModified: job.publishDate || undefined,
    changeFrequency: 'daily',
    priority: job.featured ? 0.8 : 0.6,
  }));

  return [...staticRoutes, ...jobRoutes];
}
