import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// The job page itself is a client component, so it can't set its own <title>
// or meta description. This server-side layout does it instead: it fetches
// the job by slug and uses the job's own SEO title/description when the admin
// has filled them in, otherwise it falls back to a sensible default built
// from the job's details.

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';
const SITE_URL = (process.env.SITE_URL || 'https://prephubpk.com').replace(/\/$/, '');

type JobSeo = {
  slug?: string;
  title?: string;
  commission?: string;
  grade?: string;
  department?: string;
  seats?: number;
  lastDate?: string;
  description?: string;
  // Accept both camelCase and snake_case, whichever the API returns.
  metaTitle?: string | null;
  meta_title?: string | null;
  metaDescription?: string | null;
  meta_description?: string | null;
};

async function fetchJob(slug: string): Promise<JobSeo | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/jobs/${encodeURIComponent(slug)}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return (data?.job ?? null) as JobSeo | null;
  } catch {
    return null;
  }
}

function clean(value: string | null | undefined): string {
  return (value ?? '').replace(/\s+/g, ' ').trim();
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).replace(/\s+\S*$/, '') + '…';
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const job = await fetchJob(slug);

  if (!job) {
    return { title: 'Job Not Found | PrepHub PK', robots: { index: false } };
  }

  const jobTitle = clean(job.title);
  const commission = clean(job.commission);
  const grade = clean(job.grade);
  const year = new Date().getFullYear();

  // Default title: "Medical Officer BPS-17 Jobs 2026 | SPSC - PrepHub PK"
  const defaultTitle = [
    jobTitle,
    grade && !jobTitle.includes(grade) ? grade : '',
    `Jobs ${year}`,
  ].filter(Boolean).join(' ') + (commission ? ` | ${commission}` : '') + ' - PrepHub PK';

  // Default description built from the job's own details.
  const parts = [
    `${commission ? commission + ' ' : ''}${jobTitle}${grade ? ` (${grade})` : ''} jobs`,
    job.department ? `in ${clean(job.department)}` : '',
  ].filter(Boolean).join(' ');
  const seatsText = job.seats ? ` ${job.seats} post${job.seats > 1 ? 's' : ''}.` : '';
  const lastDateText = job.lastDate ? ` Last date: ${clean(job.lastDate)}.` : '';
  const defaultDescription = truncate(
    `${parts}.${seatsText}${lastDateText} Eligibility, quota, how to apply, plus free MCQs and preparation material on PrepHub PK.`,
    160,
  );

  const title = clean(job.metaTitle ?? job.meta_title) || defaultTitle;
  const description = clean(job.metaDescription ?? job.meta_description) || defaultDescription;
  const url = `${SITE_URL}/jobs/${job.slug || slug}`;

  return {
    // `absolute` stops any parent title template from being appended.
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'article', siteName: 'PrepHub PK' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default function JobLayout({ children }: { children: ReactNode }) {
  return children;
}
