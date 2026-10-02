'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import { Target, BookOpen, ShieldCheck, Users, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  const [authOpen, setAuthOpen] = useState(false);

  const values = [
    {
      icon: <Target size={20} color="var(--primary)" />,
      title: 'Everything in one place',
      body: "Job alerts, prep material, and mock tests are usually scattered across a dozen different websites and Facebook groups. We pull all of it into one place so you spend your time preparing, not searching.",
    },
    {
      icon: <BookOpen size={20} color="#16A34A" />,
      title: 'Practice that matches the exam',
      body: 'MCQs and study material are organized by the actual subjects each job requires, so a Sub-Inspector candidate and a CSS candidate see different, relevant practice sets instead of one generic question bank.',
    },
    {
      icon: <ShieldCheck size={20} color="#D97706" />,
      title: 'Honest about our limits',
      body: "We are not FPSC, PPSC, SPSC, NTS, CSS, KPPSC, BPSC, or NPF, and we don't claim to be. Every job posting links back to the original source, and we always tell you to double-check dates and eligibility there before you apply.",
    },
    {
      icon: <Users size={20} color="#7C3AED" />,
      title: 'Built for Pakistani job seekers',
      body: 'From Sub-Inspector and Junior Clerk postings to CSS and other central superior services exams, our subjects, quotas, and commission coverage are built around how recruitment actually works in Pakistan.',
    },
  ];

  return (
    <>
      <Navbar onLoginOpen={() => setAuthOpen(true)} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />

      <div style={{ background: 'var(--dark)', padding: '52px 20px 60px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: 'white', marginBottom: 14, fontFamily: 'Sora, sans-serif' }}>
            About PrepHub PK
          </h1>
          <p style={{ fontSize: 16, color: '#94A3B8', lineHeight: 1.7 }}>
            A free, straightforward platform for anyone preparing for a government job in Pakistan, built around
            three things: real job alerts, relevant practice material, and honest information.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '56px 20px' }}>
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--dark)', marginBottom: 16, fontFamily: 'Sora, sans-serif' }}>
            Why we built this
          </h2>
          <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 16 }}>
            Preparing for a government job in Pakistan usually means checking half a dozen commission websites for
            new postings, hunting down past papers from unreliable sources, and guessing at which subjects actually
            matter for a specific post. It works, but it takes far longer than it should, and a lot of good
            candidates lose time to logistics rather than studying.
          </p>
          <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 16 }}>
            PrepHub PK exists to close that gap. We track job postings from FPSC, PPSC, SPSC, NTS, CSS, KPPSC, BPSC,
            and the NPF Testing &amp; Assessment Services, and for many of them we build a matching set of MCQs and
            study notes around the subjects that post actually requires. Where a job has an MCQ bank behind it, you
            can take a timed mock test in the same pattern as the real exam and see your score immediately. Where a
            subject shows up across several different jobs, such as General Knowledge or Pakistan Studies, you can
            also practice that subject on its own instead of being tied to a single job posting.
          </p>
          <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.8 }}>
            The platform is free to use and we intend to keep it that way. If you create an account, we save your
            quiz history and scores so you can see which subjects need more work, but browsing jobs, reading prep
            material, and taking most practice quizzes doesn&apos;t require signing up at all.
          </p>
        </section>

        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--dark)', marginBottom: 20, fontFamily: 'Sora, sans-serif' }}>
            What we care about
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {values.map(v => (
              <div key={v.title} style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 14, padding: 22 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  {v.icon}
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--dark)', marginBottom: 8 }}>{v.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7 }}>{v.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 16, padding: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--dark)', marginBottom: 10, fontFamily: 'Sora, sans-serif' }}>
            One important note
          </h2>
          <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 20 }}>
            PrepHub PK is an independent preparation resource. We are not affiliated with, endorsed by, or acting on
            behalf of FPSC, PPSC, SPSC, NTS, the CSS examination system, KPPSC, BPSC, the NPF, or any other government
            body. Job details, closing dates, and eligibility criteria can change on short notice, so always confirm
            the official listing on the relevant commission&apos;s website before you apply. See our{' '}
            <Link href="/disclaimer" style={{ color: 'var(--primary)', fontWeight: 600 }}>Disclaimer</Link> for the full picture.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={() => setAuthOpen(true)} style={{ background: 'var(--primary)', color: 'white', padding: '11px 22px', borderRadius: 10, border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: 6 }}>
              Create a free account <ArrowRight size={15} />
            </button>
            <Link href="/contact" style={{ background: 'var(--white)', color: 'var(--dark)', padding: '11px 22px', borderRadius: 10, border: '1.5px solid var(--border)', fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
              Get in touch
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
