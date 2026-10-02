'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Info } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import PageLoader from '@/components/Spinner';
import { api } from '@/lib/api';

type Status = 'checking' | 'success' | 'already' | 'invalid';

function VerifyContent() {
  const params = useSearchParams();
  const [authOpen, setAuthOpen] = useState(false);
  const [status, setStatus] = useState<Status>('checking');

  useEffect(() => {
    const id = params.get('id');
    const hash = params.get('hash');
    const expires = params.get('expires');
    const signature = params.get('signature');

    if (!id || !hash || !expires || !signature) {
      setStatus('invalid');
      return;
    }

    let cancelled = false;
    api.verifyEmail(id, hash, expires, signature)
      .then(res => {
        if (!cancelled) setStatus(res.status);
      })
      .catch(() => {
        if (!cancelled) setStatus('invalid');
      });
    return () => {
      cancelled = true;
    };
  }, [params]);

  if (status === 'checking') {
    return (
      <>
        <Navbar onLoginOpen={() => setAuthOpen(true)} />
        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} defaultTab="login" />
        <PageLoader label="Verifying your email..." />
        <Footer />
      </>
    );
  }

  const content = {
    success: {
      icon: <CheckCircle size={48} color="var(--success)" />,
      title: 'Email verified!',
      body: 'Your account is active. You can now log in and start preparing.',
    },
    already: {
      icon: <Info size={48} color="var(--primary)" />,
      title: 'Already verified',
      body: 'This email address was already verified. You can log in.',
    },
    invalid: {
      icon: <XCircle size={48} color="#E11D48" />,
      title: 'Verification link invalid',
      body: "This link has expired or isn't valid. Try logging in and resending the verification email.",
    },
  } as const;

  const data = content[status];

  return (
    <>
      <Navbar onLoginOpen={() => setAuthOpen(true)} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} defaultTab="login" />
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
        <div style={{ textAlign: 'center', maxWidth: 420 }}>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>{data.icon}</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--dark)', fontFamily: 'Sora, sans-serif', marginBottom: 10 }}>
            {data.title}
          </h1>
          <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 24 }}>{data.body}</p>
          <button
            onClick={() => setAuthOpen(true)}
            style={{
              background: 'var(--primary)', color: 'white', padding: '12px 28px',
              borderRadius: 10, border: 'none', cursor: 'pointer',
              fontSize: 15, fontWeight: 600, fontFamily: 'DM Sans, sans-serif',
            }}
          >
            Log in
          </button>
          <div style={{ marginTop: 16 }}>
            <Link href="/" style={{ fontSize: 13, color: 'var(--muted)' }}>Back to home</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyContent />
    </Suspense>
  );
}
