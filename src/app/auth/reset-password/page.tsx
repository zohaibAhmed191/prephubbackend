'use client';
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Lock, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import { Spinner } from '@/components/Spinner';
import { api, ApiError } from '@/lib/api';

function ResetPasswordContent() {
  const params = useSearchParams();
  const token = params.get('token') || '';
  const email = params.get('email') || '';

  const [authOpen, setAuthOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (!token || !email) {
    return (
      <>
        <Navbar onLoginOpen={() => setAuthOpen(true)} />
        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} defaultTab="login" />
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
          <div style={{ textAlign: 'center', maxWidth: 420 }}>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}><XCircle size={48} color="#E11D48" /></div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--dark)', fontFamily: 'Sora, sans-serif', marginBottom: 10 }}>Invalid reset link</h1>
            <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 24 }}>
              This link is missing some information. Please request a new password reset link.
            </p>
            <button onClick={() => setAuthOpen(true)} style={{ background: 'var(--primary)', color: 'white', padding: '12px 28px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}>
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

  if (done) {
    return (
      <>
        <Navbar onLoginOpen={() => setAuthOpen(true)} />
        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} defaultTab="login" />
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
          <div style={{ textAlign: 'center', maxWidth: 420 }}>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}><CheckCircle size={48} color="var(--success)" /></div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--dark)', fontFamily: 'Sora, sans-serif', marginBottom: 10 }}>Password reset</h1>
            <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 24 }}>Your password has been changed. You can now log in with your new password.</p>
            <button onClick={() => setAuthOpen(true)} style={{ background: 'var(--primary)', color: 'white', padding: '12px 28px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters.', { id: 'reset-toast' });
      return;
    }
    if (password !== confirm) {
      toast.error('Passwords do not match.', { id: 'reset-toast' });
      return;
    }
    setLoading(true);
    try {
      await api.resetPassword({ token, email, password, password_confirmation: confirm });
      setLoading(false);
      setDone(true);
    } catch (err) {
      setLoading(false);
      const message = err instanceof ApiError ? err.message : 'Could not reset your password.';
      toast.error(message, { id: 'reset-toast' });
    }
  };

  return (
    <>
      <Navbar onLoginOpen={() => setAuthOpen(true)} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} defaultTab="login" />
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
        <div style={{ width: '100%', maxWidth: 420, background: 'var(--white)', borderRadius: 16, border: '1.5px solid var(--border)', padding: 32 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--dark)', fontFamily: 'Sora, sans-serif', marginBottom: 6, textAlign: 'center' }}>Set a new password</h1>
          <p style={{ fontSize: 14, color: 'var(--muted)', textAlign: 'center', marginBottom: 24 }}>for {email}</p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--dark)', marginBottom: 6 }}>New password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-light)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="input-field"
                  style={{ paddingLeft: 42, paddingRight: 42 }}
                />
                <button type="button" onClick={() => setShowPassword(s => !s)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-light)', display: 'flex' }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--dark)', marginBottom: 6 }}>Confirm new password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-light)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Re-enter your new password"
                  className="input-field"
                  style={{ paddingLeft: 42 }}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px', borderRadius: 10, background: 'var(--primary)',
              border: 'none', color: 'white', fontSize: 15, fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              opacity: loading ? 0.8 : 1,
            }}>
              {loading && <Spinner size={16} color="white" />}
              {loading ? 'Saving...' : 'Reset password'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}
