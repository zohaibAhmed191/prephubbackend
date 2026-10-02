'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import { AlertTriangle } from 'lucide-react';

export default function DisclaimerPage() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <Navbar onLoginOpen={() => setAuthOpen(true)} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />

      <div style={{ background: 'var(--dark)', padding: '48px 20px 56px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: 34, fontWeight: 800, color: 'white', marginBottom: 10, fontFamily: 'Sora, sans-serif' }}>
            Disclaimer
          </h1>
          <p style={{ fontSize: 14, color: '#94A3B8' }}>Last updated: July 2026</p>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 20px' }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: 14, padding: '20px 22px', marginBottom: 36 }}>
          <AlertTriangle size={22} color="#D97706" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: 14, color: '#92400E', lineHeight: 1.7, margin: 0 }}>
            <strong>PrepHub PK is an independent, privately run preparation platform.</strong> We are not FPSC, PPSC,
            SPSC, NTS, the CSS examination system, KPPSC, BPSC, the NPF Testing &amp; Assessment Services, or any
            other government body, and we are not affiliated with, endorsed by, or acting on behalf of any of them.
          </p>
        </div>

        <div style={{ fontSize: 15, color: 'var(--dark)', lineHeight: 1.8 }}>
          <section style={{ marginBottom: 30 }}>
            <h2 style={{ fontSize: 19, fontWeight: 700, color: 'var(--dark)', marginBottom: 12, fontFamily: 'Sora, sans-serif' }}>
              Job listings
            </h2>
            <p style={{ color: 'var(--muted)' }}>
              Job postings on PrepHub PK are compiled from publicly available announcements published by the
              relevant commissions and testing bodies, purely for the convenience of job seekers. We do not create,
              issue, or control these vacancies. Closing dates, eligibility criteria, vacancy counts, fees, and other
              details can change without notice, and errors can occur when information is compiled. Before you apply
              for any position, or make any decision based on a listing you see here, please verify every detail
              directly on the official website of the issuing commission or organization.
            </p>
          </section>

          <section style={{ marginBottom: 30 }}>
            <h2 style={{ fontSize: 19, fontWeight: 700, color: 'var(--dark)', marginBottom: 12, fontFamily: 'Sora, sans-serif' }}>
              MCQs, mock tests, and study material
            </h2>
            <p style={{ color: 'var(--muted)', marginBottom: 14 }}>
              MCQs, mock tests, and prep notes on PrepHub PK are prepared for practice and educational purposes.
              Unless a question or paper is explicitly labeled as an official past paper, our practice content is not
              issued by, sourced from, or endorsed by any commission, and it may not reflect the exact format,
              difficulty, or syllabus weighting of the real exam. Use it to reinforce your understanding of a
              subject, not as a substitute for the official syllabus published by the relevant commission.
            </p>
            <p style={{ color: 'var(--muted)', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px' }}>
              <strong style={{ color: 'var(--dark)' }}>Much of this content is generated with the help of AI tools</strong>{' '}
              and reviewed before publishing, but AI-generated content can still contain factual errors, outdated
              information, or an incorrect marked answer. Treat every MCQ and explanation as a study aid rather than
              an authoritative source, and if something looks wrong, please report it to us at{' '}
              <a href="mailto:info@prephubpk.com" style={{ color: 'var(--primary)', fontWeight: 600 }}>info@prephubpk.com</a>{' '}
              so we can correct it.
            </p>
          </section>

          <section style={{ marginBottom: 30 }}>
            <h2 style={{ fontSize: 19, fontWeight: 700, color: 'var(--dark)', marginBottom: 12, fontFamily: 'Sora, sans-serif' }}>
              Statistics shown on the platform
            </h2>
            <p style={{ color: 'var(--muted)' }}>
              Figures such as active job counts, MCQ totals, registered student counts, or an aggregate pass rate
              reflect activity and usage on PrepHub PK, or, where noted, an approximate figure. They describe the
              platform, not a prediction or promise of your personal exam result.
            </p>
          </section>

          <section style={{ marginBottom: 30 }}>
            <h2 style={{ fontSize: 19, fontWeight: 700, color: 'var(--dark)', marginBottom: 12, fontFamily: 'Sora, sans-serif' }}>
              No professional advice
            </h2>
            <p style={{ color: 'var(--muted)' }}>
              Nothing on PrepHub PK constitutes legal, financial, or career advice. Recruitment rules, quotas, and
              eligibility requirements can be complex and vary by post, always rely on the official advertisement
              and, where needed, your own professional judgment or a qualified advisor.
            </p>
          </section>

          <section style={{ marginBottom: 30 }}>
            <h2 style={{ fontSize: 19, fontWeight: 700, color: 'var(--dark)', marginBottom: 12, fontFamily: 'Sora, sans-serif' }}>
              External links
            </h2>
            <p style={{ color: 'var(--muted)' }}>
              Where we link to a commission&apos;s official website or another external source, we do so for
              reference only. We are not responsible for the content, accuracy, or availability of external sites.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 19, fontWeight: 700, color: 'var(--dark)', marginBottom: 12, fontFamily: 'Sora, sans-serif' }}>
              Questions
            </h2>
            <p style={{ color: 'var(--muted)' }}>
              If you spot a listing that looks outdated or incorrect, please tell us, it helps everyone using the
              platform. Reach us at{' '}
              <a href="mailto:info@prephubpk.com" style={{ color: 'var(--primary)', fontWeight: 600 }}>info@prephubpk.com</a>{' '}
              or through our <Link href="/contact" style={{ color: 'var(--primary)', fontWeight: 600 }}>Contact page</Link>.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
}
