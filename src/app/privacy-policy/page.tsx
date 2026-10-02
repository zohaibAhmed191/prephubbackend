'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';

const sections = [
  { id: 'information-we-collect', label: 'Information we collect' },
  { id: 'how-we-use-it', label: 'How we use your information' },
  { id: 'sign-in-with-google', label: 'Signing in with Google' },
  { id: 'cookies-and-storage', label: 'Cookies and local storage' },
  { id: 'sharing', label: 'How we share information' },
  { id: 'data-retention', label: 'Data retention' },
  { id: 'your-rights', label: 'Your rights and choices' },
  { id: 'childrens-privacy', label: "Children's privacy" },
  { id: 'security', label: 'Security' },
  { id: 'changes', label: 'Changes to this policy' },
  { id: 'contact', label: 'Contact us' },
];

export default function PrivacyPolicyPage() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <Navbar onLoginOpen={() => setAuthOpen(true)} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />

      <div style={{ background: 'var(--dark)', padding: '48px 20px 56px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: 34, fontWeight: 800, color: 'white', marginBottom: 10, fontFamily: 'Sora, sans-serif' }}>
            Privacy Policy
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
            This Privacy Policy explains what information PrepHub PK ("we", "us", "our") collects when you use our
            website, why we collect it, and what control you have over it. We built PrepHub PK to help people prepare
            for government job exams in Pakistan, and we try to collect only what we actually need to run that
            service.
          </p>

          <section id="information-we-collect" style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 19, fontWeight: 700, color: 'var(--dark)', marginBottom: 12, fontFamily: 'Sora, sans-serif' }}>
              1. Information we collect
            </h2>
            <p style={{ color: 'var(--muted)', marginBottom: 12 }}>
              <strong style={{ color: 'var(--dark)' }}>Account information.</strong> When you register with an email
              and password, we store your name, email address, phone number, and province. If you sign in with
              Google instead, we receive your name, email address, and Google account identifier from Google, we
              never see or store your Google password.
            </p>
            <p style={{ color: 'var(--muted)', marginBottom: 12 }}>
              <strong style={{ color: 'var(--dark)' }}>Activity data.</strong> If you take a mock test or subject
              practice quiz while logged in, we store which questions you answered, whether they were correct, your
              score, and when you took it, so you can review your progress on your profile.
            </p>
            <p style={{ color: 'var(--muted)' }}>
              <strong style={{ color: 'var(--dark)' }}>Technical data.</strong> Like most websites, our servers log
              IP addresses for basic security purposes, such as rate-limiting login attempts and contact form
              submissions to prevent abuse. We do not use this to track your browsing outside of PrepHub PK.
            </p>
          </section>

          <section id="how-we-use-it" style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 19, fontWeight: 700, color: 'var(--dark)', marginBottom: 12, fontFamily: 'Sora, sans-serif' }}>
              2. How we use your information
            </h2>
            <p style={{ color: 'var(--muted)', marginBottom: 12 }}>We use the information above to:</p>
            <ul style={{ color: 'var(--muted)', paddingLeft: 20, marginBottom: 0 }}>
              <li style={{ marginBottom: 8 }}>Create and secure your account, and verify your email address</li>
              <li style={{ marginBottom: 8 }}>Save your quiz results so you can track your progress over time</li>
              <li style={{ marginBottom: 8 }}>Respond to messages you send us through the contact form</li>
              <li style={{ marginBottom: 8 }}>Detect and prevent abuse, spam, and unauthorized access</li>
              <li>Improve the platform based on how it&apos;s actually used</li>
            </ul>
          </section>

          <section id="sign-in-with-google" style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 19, fontWeight: 700, color: 'var(--dark)', marginBottom: 12, fontFamily: 'Sora, sans-serif' }}>
              3. Signing in with Google
            </h2>
            <p style={{ color: 'var(--muted)' }}>
              When you use "Sign in with Google", Google verifies your identity and shares your basic profile
              information (name and email) with us so we can create or log you into your PrepHub PK account. This
              happens through Google&apos;s standard sign-in flow, we never receive or store your Google password,
              and you can review or revoke PrepHub PK&apos;s access at any time from your Google account settings.
            </p>
          </section>

          <section id="cookies-and-storage" style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 19, fontWeight: 700, color: 'var(--dark)', marginBottom: 12, fontFamily: 'Sora, sans-serif' }}>
              4. Cookies and local storage
            </h2>
            <p style={{ color: 'var(--muted)' }}>
              We use your browser&apos;s local storage to keep you signed in between visits, this is what lets you
              close the tab and come back later without logging in again. We don&apos;t use third-party advertising
              or tracking cookies on PrepHub PK.
            </p>
          </section>

          <section id="sharing" style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 19, fontWeight: 700, color: 'var(--dark)', marginBottom: 12, fontFamily: 'Sora, sans-serif' }}>
              5. How we share information
            </h2>
            <p style={{ color: 'var(--muted)' }}>
              We do not sell your personal information, and we don&apos;t share it with advertisers. We may share
              limited information with service providers who help us run the platform, such as our email delivery
              provider (to send verification and password reset emails) and our hosting provider, only to the extent
              needed to provide the service. We may also disclose information if required by law.
            </p>
          </section>

          <section id="data-retention" style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 19, fontWeight: 700, color: 'var(--dark)', marginBottom: 12, fontFamily: 'Sora, sans-serif' }}>
              6. Data retention
            </h2>
            <p style={{ color: 'var(--muted)' }}>
              We keep your account information for as long as your account is active. If you ask us to delete your
              account, we will remove your personal information within a reasonable time, except where we need to
              retain limited records for legal or security reasons.
            </p>
          </section>

          <section id="your-rights" style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 19, fontWeight: 700, color: 'var(--dark)', marginBottom: 12, fontFamily: 'Sora, sans-serif' }}>
              7. Your rights and choices
            </h2>
            <p style={{ color: 'var(--muted)', marginBottom: 12 }}>You can, at any time:</p>
            <ul style={{ color: 'var(--muted)', paddingLeft: 20, marginBottom: 12 }}>
              <li style={{ marginBottom: 8 }}>View the information on your account from your profile page</li>
              <li style={{ marginBottom: 8 }}>Ask us to correct inaccurate information</li>
              <li style={{ marginBottom: 8 }}>Ask us to delete your account and associated data</li>
              <li>Ask what information we hold about you</li>
            </ul>
            <p style={{ color: 'var(--muted)' }}>
              To exercise any of these, email us at{' '}
              <a href="mailto:info@prephubpk.com" style={{ color: 'var(--primary)', fontWeight: 600 }}>info@prephubpk.com</a>{' '}
              or use our <Link href="/contact" style={{ color: 'var(--primary)', fontWeight: 600 }}>Contact page</Link>.
            </p>
          </section>

          <section id="childrens-privacy" style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 19, fontWeight: 700, color: 'var(--dark)', marginBottom: 12, fontFamily: 'Sora, sans-serif' }}>
              8. Children&apos;s privacy
            </h2>
            <p style={{ color: 'var(--muted)' }}>
              PrepHub PK is built for people preparing for government job exams, which typically require candidates
              to be at least 18 years old, and the platform is not intended for young children. We do not knowingly
              collect personal information from children under 13. If you believe a child has created an account,
              contact us and we will remove it.
            </p>
          </section>

          <section id="security" style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 19, fontWeight: 700, color: 'var(--dark)', marginBottom: 12, fontFamily: 'Sora, sans-serif' }}>
              9. Security
            </h2>
            <p style={{ color: 'var(--muted)' }}>
              Passwords are encrypted and never stored in plain text, and all traffic to PrepHub PK is encrypted in
              transit. No online service can guarantee absolute security, but we take reasonable, industry-standard
              measures to protect your information.
            </p>
          </section>

          <section id="changes" style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 19, fontWeight: 700, color: 'var(--dark)', marginBottom: 12, fontFamily: 'Sora, sans-serif' }}>
              10. Changes to this policy
            </h2>
            <p style={{ color: 'var(--muted)' }}>
              We may update this policy from time to time as the platform grows. If we make a material change,
              we&apos;ll update the "Last updated" date at the top of this page. We encourage you to review this
              page occasionally.
            </p>
          </section>

          <section id="contact">
            <h2 style={{ fontSize: 19, fontWeight: 700, color: 'var(--dark)', marginBottom: 12, fontFamily: 'Sora, sans-serif' }}>
              11. Contact us
            </h2>
            <p style={{ color: 'var(--muted)', marginBottom: 20 }}>
              Questions about this policy or how we handle your data? Reach us at{' '}
              <a href="mailto:info@prephubpk.com" style={{ color: 'var(--primary)', fontWeight: 600 }}>info@prephubpk.com</a>.
            </p>
            <p style={{ fontSize: 13, color: 'var(--muted-light)', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px' }}>
              This policy is written in plain language to describe our actual practices. It is not a substitute for
              legal advice, if you need this policy reviewed for a specific regulatory or compliance requirement,
              please consult a qualified legal professional.
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
