'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import { Target, Layout, Megaphone, Mail as MailIcon, ArrowRight, CheckCircle } from 'lucide-react';

export default function AdvertisePage() {
  const [authOpen, setAuthOpen] = useState(false);

  const formats = [
    {
      icon: <Layout size={20} color="var(--primary)" />,
      title: 'On-site placements',
      body: 'Banner and card placements on high-traffic pages like the job listings and MCQ practice pages, seen by candidates while they\'re actively preparing.',
    },
    {
      icon: <MailIcon size={20} color="#16A34A" />,
      title: 'Job alert sponsorship',
      body: 'A sponsored slot alongside our job alert notifications, reaching candidates at the exact moment they\'re looking for new opportunities.',
    },
    {
      icon: <Megaphone size={20} color="#7C3AED" />,
      title: 'Sponsored content',
      body: 'Coaching centers, publishers, and edtech tools can reach a focused, exam-prep audience through sponsored guides or featured resources.',
    },
  ];

  const audience = [
    'Candidates actively preparing for FPSC, PPSC, SPSC, NTS, CSS, KPPSC, BPSC, and NPF recruitment exams',
    'A mix of first-time applicants and repeat exam-takers across Pakistan',
    'Visitors who return regularly to check new job postings and practice MCQs',
  ];

  return (
    <>
      <Navbar onLoginOpen={() => setAuthOpen(true)} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />

      <div style={{ background: 'var(--dark)', padding: '52px 20px 60px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: 'white', marginBottom: 14, fontFamily: 'Sora, sans-serif' }}>
            Advertise with Us
          </h1>
          <p style={{ fontSize: 16, color: '#94A3B8', lineHeight: 1.7 }}>
            Reach a focused, motivated audience of government job aspirants across Pakistan, right when they&apos;re preparing.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '56px 20px' }}>
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--dark)', marginBottom: 16, fontFamily: 'Sora, sans-serif' }}>
            Who you&apos;ll reach
          </h2>
          <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 20 }}>
            PrepHub PK is used by people actively preparing for competitive government exams, not casual browsers.
            They visit specifically to check new postings, practice MCQs, and take mock tests, which makes for an
            engaged, intent-driven audience if your product or service is relevant to exam preparation, career
            coaching, publishing, or education in Pakistan.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {audience.map(a => (
              <div key={a} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <CheckCircle size={17} color="#16A34A" style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: 14, color: 'var(--muted)', margin: 0 }}>{a}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--dark)', marginBottom: 20, fontFamily: 'Sora, sans-serif' }}>
            Ways to advertise
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {formats.map(f => (
              <div key={f.title} style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 14, padding: 22 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--dark)', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7 }}>{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ background: 'linear-gradient(135deg, #1B4FD8, #6366F1)', borderRadius: 16, padding: 32, color: 'white' }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 18 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Target size={20} color="white" />
            </div>
            <div>
              <h2 style={{ fontSize: 19, fontWeight: 700, marginBottom: 6, fontFamily: 'Sora, sans-serif' }}>Let&apos;s talk</h2>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7 }}>
                Placements, pricing, and available inventory depend on what you&apos;re looking to promote. Send us a
                short note about your goals and audience, and we&apos;ll get back to you with options and rates.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link href="/contact" style={{ background: 'white', color: 'var(--primary)', padding: '12px 24px', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
              Contact our team <ArrowRight size={15} />
            </Link>
            <a href="mailto:info@prephubpk.com" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '12px 24px', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <MailIcon size={15} /> info@prephubpk.com
            </a>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
