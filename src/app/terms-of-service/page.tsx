'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';

const sections = [
  { id: 'acceptance', label: 'Acceptance of terms' },
  { id: 'the-service', label: 'The service we provide' },
  { id: 'accounts', label: 'Accounts and eligibility' },
  { id: 'acceptable-use', label: 'Acceptable use' },
  { id: 'content-and-accuracy', label: 'Job content and accuracy' },
  { id: 'no-guarantee', label: 'No guarantee of results' },
  { id: 'intellectual-property', label: 'Intellectual property' },
  { id: 'termination', label: 'Termination' },
  { id: 'liability', label: 'Limitation of liability' },
  { id: 'law', label: 'Governing law' },
  { id: 'changes', label: 'Changes to these terms' },
  { id: 'contact', label: 'Contact us' },
];

export default function TermsOfServicePage() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <Navbar onLoginOpen={() => setAuthOpen(true)} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />

      <div style={{ background: 'var(--dark)', padding: '48px 20px 56px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: 34, fontWeight: 800, color: 'white', marginBottom: 10, fontFamily: 'Sora, sans-serif' }}>
            Terms of Service
          </h1>
          <p style={{ fontSize: 14, color: '#94A3B8' }}>Last updated: July 2026</p>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 20px', display: 'grid', gridTemplateColumns: '220px 1fr', gap: 40 }} className="legal-layout">
        <aside className="legal-toc" style={{ position: 'sticky', top: 90, alignSelf: 'start' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.5px', marginBottom: 12 }}>ON THIS PAGE</p>
          {sections.map(s => (
            <a key={s.id} href={`#${s.id}`} style={{ display: 'block', fontSize: 13, color: 'var(--muted)', textDecoration: 'none', marginBottom: 10, lineHeight: 1.5 }}>
              {s.label}
            </a>
          ))}
        </aside>

        <div style={{ fontSize: 15, color: 'var(--dark)', lineHeight: 1.8 }}>
          <p style={{ color: 'var(--muted)', marginBottom: 28 }}>
            These Terms of Service ("Terms") govern your use of PrepHub PK (the "Service"). By creating an account
            or otherwise using the Service, you agree to these Terms. Please read them, and our{' '}
            <Link href="/privacy-policy" style={{ color: 'var(--primary)', fontWeight: 600 }}>Privacy Policy</Link> and{' '}
            <Link href="/disclaimer" style={{ color: 'var(--primary)', fontWeight: 600 }}>Disclaimer</Link>, before using PrepHub PK.
          </p>

          <section id="acceptance" style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 19, fontWeight: 700, color: 'var(--dark)', marginBottom: 12, fontFamily: 'Sora, sans-serif' }}>
              1. Acceptance of terms
            </h2>
            <p style={{ color: 'var(--muted)' }}>
              By accessing or using PrepHub PK, you confirm that you can form a binding contract, that you accept
              these Terms, and that you agree to comply with them. If you do not agree, please do not use the
              Service.
            </p>
          </section>

          <section id="the-service" style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 19, fontWeight: 700, color: 'var(--dark)', marginBottom: 12, fontFamily: 'Sora, sans-serif' }}>
              2. The service we provide
            </h2>
            <p style={{ color: 'var(--muted)' }}>
              PrepHub PK aggregates government job postings from official Pakistani commissions and testing bodies,
              and provides subject-based MCQ practice, prep material, and mock tests built around those postings.
              The Service is provided free of charge. We may add, change, or remove features at any time.
            </p>
          </section>

          <section id="accounts" style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 19, fontWeight: 700, color: 'var(--dark)', marginBottom: 12, fontFamily: 'Sora, sans-serif' }}>
              3. Accounts and eligibility
            </h2>
            <p style={{ color: 'var(--muted)', marginBottom: 12 }}>
              You need an account to save quiz results, track your progress, and take most mock tests. You agree to
              provide accurate information when registering, and to keep your password confidential. You are
              responsible for all activity that happens under your account.
            </p>
            <p style={{ color: 'var(--muted)' }}>
              You must be old enough to legally hold an account in your jurisdiction. If we learn an account belongs
              to someone below that age, we may suspend or remove it.
            </p>
          </section>

          <section id="acceptable-use" style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 19, fontWeight: 700, color: 'var(--dark)', marginBottom: 12, fontFamily: 'Sora, sans-serif' }}>
              4. Acceptable use
            </h2>
            <p style={{ color: 'var(--muted)', marginBottom: 12 }}>When using PrepHub PK, you agree not to:</p>
            <ul style={{ color: 'var(--muted)', paddingLeft: 20 }}>
              <li style={{ marginBottom: 8 }}>Attempt to bypass, scrape, or overload the Service in a way that disrupts it for others</li>
              <li style={{ marginBottom: 8 }}>Attempt to access another user&apos;s account or data</li>
              <li style={{ marginBottom: 8 }}>Submit false information through our forms, including the registration or contact form</li>
              <li style={{ marginBottom: 8 }}>Use the Service to distribute spam, malware, or unlawful content</li>
              <li>Reverse-engineer or resell access to the Service without our permission</li>
            </ul>
          </section>

          <section id="content-and-accuracy" style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 19, fontWeight: 700, color: 'var(--dark)', marginBottom: 12, fontFamily: 'Sora, sans-serif' }}>
              5. Job content and accuracy
            </h2>
            <p style={{ color: 'var(--muted)' }}>
              Job postings displayed on PrepHub PK are compiled from publicly available commission and testing body
              sources for convenience. We do our best to keep listings current, but we cannot guarantee that every
              detail, including deadlines, eligibility criteria, or vacancy counts, is accurate or up to date at any
              given moment. Always confirm details directly on the official commission&apos;s website before you
              apply or make any decision based on a listing. See our{' '}
              <Link href="/disclaimer" style={{ color: 'var(--primary)', fontWeight: 600 }}>Disclaimer</Link> for more detail.
            </p>
          </section>

          <section id="no-guarantee" style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 19, fontWeight: 700, color: 'var(--dark)', marginBottom: 12, fontFamily: 'Sora, sans-serif' }}>
              6. No guarantee of results
            </h2>
            <p style={{ color: 'var(--muted)', marginBottom: 14 }}>
              Our MCQs, mock tests, and study material are practice tools meant to support your preparation, they
              are not official past papers issued by any commission unless explicitly stated, and using them does
              not guarantee that you will pass any exam, be shortlisted, or be selected for any post. Any statistics
              shown on the Service, such as an aggregate pass rate, describe activity on the platform and are not a
              prediction of your individual outcome.
            </p>
            <p style={{ color: 'var(--muted)' }}>
              Much of our MCQ and study content is generated with the help of AI tools and reviewed before
              publishing, but it can still contain errors, including an incorrectly marked answer or an outdated
              fact. We do not warrant that this content is complete, accurate, or error-free, and it should be used
              alongside, not instead of, official syllabus material. See our{' '}
              <Link href="/disclaimer" style={{ color: 'var(--primary)', fontWeight: 600 }}>Disclaimer</Link> for more detail.
            </p>
          </section>

          <section id="intellectual-property" style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 19, fontWeight: 700, color: 'var(--dark)', marginBottom: 12, fontFamily: 'Sora, sans-serif' }}>
              7. Intellectual property
            </h2>
            <p style={{ color: 'var(--muted)' }}>
              The PrepHub PK name, logo, design, and original study material are the property of PrepHub PK.
              Government job postings remain the property of their respective issuing commissions and are used here
              for informational purposes. You may use the Service for your own personal exam preparation, but you
              may not copy, redistribute, or republish our original content for commercial purposes without our
              written permission.
            </p>
          </section>

          <section id="termination" style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 19, fontWeight: 700, color: 'var(--dark)', marginBottom: 12, fontFamily: 'Sora, sans-serif' }}>
              8. Termination
            </h2>
            <p style={{ color: 'var(--muted)' }}>
              You may stop using the Service and request account deletion at any time. We may suspend or terminate
              an account that violates these Terms, or that we reasonably believe poses a security risk to the
              Service or its users.
            </p>
          </section>

          <section id="liability" style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 19, fontWeight: 700, color: 'var(--dark)', marginBottom: 12, fontFamily: 'Sora, sans-serif' }}>
              9. Limitation of liability
            </h2>
            <p style={{ color: 'var(--muted)' }}>
              PrepHub PK is provided "as is" and "as available", without warranties of any kind. To the fullest
              extent permitted by law, PrepHub PK and its team are not liable for any loss or damage arising from
              your use of the Service, including missed application deadlines, exam outcomes, or reliance on job
              details that later turn out to be inaccurate or outdated. Always verify important information with the
              official source.
            </p>
          </section>

          <section id="law" style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 19, fontWeight: 700, color: 'var(--dark)', marginBottom: 12, fontFamily: 'Sora, sans-serif' }}>
              10. Governing law
            </h2>
            <p style={{ color: 'var(--muted)' }}>
              These Terms are governed by the laws of Pakistan, without regard to conflict-of-law principles. Any
              dispute arising from your use of the Service will be subject to the jurisdiction of the courts of
              Pakistan.
            </p>
          </section>

          <section id="changes" style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 19, fontWeight: 700, color: 'var(--dark)', marginBottom: 12, fontFamily: 'Sora, sans-serif' }}>
              11. Changes to these terms
            </h2>
            <p style={{ color: 'var(--muted)' }}>
              We may update these Terms as the Service evolves. If we make a material change, we will update the
              "Last updated" date above. Continuing to use PrepHub PK after a change means you accept the updated
              Terms.
            </p>
          </section>

          <section id="contact">
            <h2 style={{ fontSize: 19, fontWeight: 700, color: 'var(--dark)', marginBottom: 12, fontFamily: 'Sora, sans-serif' }}>
              12. Contact us
            </h2>
            <p style={{ color: 'var(--muted)', marginBottom: 20 }}>
              Questions about these Terms? Reach us at{' '}
              <a href="mailto:info@prephubpk.com" style={{ color: 'var(--primary)', fontWeight: 600 }}>info@prephubpk.com</a>{' '}
              or through our <Link href="/contact" style={{ color: 'var(--primary)', fontWeight: 600 }}>Contact page</Link>.
            </p>
            <p style={{ fontSize: 13, color: 'var(--muted-light)', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px' }}>
              These Terms are written to plainly describe how PrepHub PK operates. They are not a substitute for
              legal advice specific to your situation.
            </p>
          </section>
        </div>
      </div>

      <Footer />
      <style>{`
        @media(max-width:900px){
          .legal-layout{grid-template-columns:1fr !important;}
          .legal-toc{display:none !important;}
        }
      `}</style>
    </>
  );
}
