'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { X, Eye, EyeOff, Mail, Lock, User, Phone, MapPin, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { api, ApiError } from '@/lib/api';
import { PROVINCES } from '@/lib/api';
import { isValidPakistaniPhone, isLikelyDisposableEmail } from '@/lib/validation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

function Spinner({ size = 16 }: { size?: number }) {
  return <Loader2 size={size} style={{ animation: 'spin 0.8s linear infinite' }} />;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
        };
      };
    };
  }
}

export default function AuthModal({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) {
  const { login, register, loginWithGoogle, resendVerification, completeProfile } = useAuth();

  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unverified, setUnverified] = useState(false);
  const [resendSent, setResendSent] = useState(false);
  const [needsProfile, setNeedsProfile] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', province: '', password: '', agree: false,
  });
  const [forgotEmail, setForgotEmail] = useState('');
  const [profileForm, setProfileForm] = useState({ phone: '', province: '' });

  // Client-side cooldown after repeated wrong-password attempts. This is a
  // UX nicety, not the real defense, the server-side "throttle:login" rate
  // limiter is what actually protects against brute-force/hammering.
  const [failedLoginAttempts, setFailedLoginAttempts] = useState(0);
  const [loginCooldown, setLoginCooldown] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setLoginCooldown(s => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const googleBtnRef = useRef<HTMLDivElement>(null);

  const handleGoogleCredential = useCallback(async (response: { credential: string }) => {
    setLoading(true);
    try {
      const user = await loginWithGoogle(response.credential);
      setLoading(false);
      if (!user.profile_complete) {
        setNeedsProfile(true);
      } else {
        onClose();
      }
    } catch (err) {
      setLoading(false);
      toast.error(err instanceof Error ? err.message : 'Google sign-in failed.', { id: 'auth-toast' });
    }
  }, [loginWithGoogle, onClose]);

  // Render Google's "Sign in with Google" button whenever the modal is open
  // on the login/register tabs (not needed on the complete-profile step).
  useEffect(() => {
    if (!isOpen || needsProfile || tab === 'forgot') return;
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId || !googleBtnRef.current) return;

    let cancelled = false;

    const renderGoogleButton = () => {
      if (cancelled || !googleBtnRef.current || !window.google) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCredential,
      });
      googleBtnRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: 'outline', size: 'large', width: 360, text: tab === 'register' ? 'signup_with' : 'signin_with',
      });
    };

    // The Google Identity Services script (loaded in layout.tsx) may not
    // have finished loading yet on a fresh page load, this is not
    // guaranteed to happen before the modal opens. Without this, the
    // button area silently stays blank with no console error at all: the
    // exact symptom this was fixed for. Poll briefly instead of giving up
    // on the very first check.
    if (window.google) {
      renderGoogleButton();
      return;
    }

    const interval = setInterval(() => {
      if (window.google) {
        clearInterval(interval);
        renderGoogleButton();
      }
    }, 100);
    const giveUpAfter = setTimeout(() => clearInterval(interval), 10000);

    return () => {
      cancelled = true;
      clearInterval(interval);
      clearTimeout(giveUpAfter);
    };
  }, [isOpen, tab, needsProfile, handleGoogleCredential]);

  if (!isOpen) return null;

  const resetMessages = () => { setError(null); setUnverified(false); setResendSent(false); };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginCooldown > 0) return;
    resetMessages();
    setLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
      setLoading(false);
      setFailedLoginAttempts(0);
      onClose();
    } catch (err) {
      setLoading(false);
      const message = err instanceof Error ? err.message : 'Login failed.';

      if (err instanceof ApiError && err.status === 429) {
        // The server's own throttle kicked in, mirror its real wait time.
        setLoginCooldown(err.retryAfter || 30);
        setFailedLoginAttempts(0);
      } else if (err instanceof ApiError && err.unverified) {
        setUnverified(true);
        setError(message);
      } else {
        // Soft client-side cooldown before the server limit is even hit,
        // so repeated wrong-password clicks don't hammer the API for nothing.
        setFailedLoginAttempts(n => {
          const next = n + 1;
          if (next >= 3) {
            setLoginCooldown(15);
            return 0;
          }
          return next;
        });
      }

      toast.error(message, { id: 'auth-toast' });
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await resendVerification(loginForm.email);
      setResendSent(true);
      toast.success('Verification email sent.', { id: 'auth-toast' });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not resend verification email.', { id: 'auth-toast' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (isLikelyDisposableEmail(registerForm.email)) {
      toast.error('Please use a permanent email address. Temporary or disposable providers are not allowed.', { id: 'auth-toast' });
      return;
    }
    if (!isValidPakistaniPhone(registerForm.phone)) {
      toast.error('Enter a valid Pakistani mobile number, e.g. 03XXXXXXXXX or +923XXXXXXXXX.', { id: 'auth-toast' });
      return;
    }

    setLoading(true);
    try {
      await register({
        first_name: registerForm.firstName,
        last_name: registerForm.lastName,
        email: registerForm.email,
        phone: registerForm.phone,
        province: registerForm.province,
        password: registerForm.password,
      });
      setLoading(false);
      setSuccess(true);
    } catch (err) {
      setLoading(false);
      toast.error(err instanceof Error ? err.message : 'Registration failed.', { id: 'auth-toast' });
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);
    try {
      await api.forgotPassword(forgotEmail);
      setLoading(false);
      setSuccess(true);
    } catch (err) {
      setLoading(false);
      toast.error(err instanceof Error ? err.message : 'Could not send the reset link.', { id: 'auth-toast' });
    }
  };

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!isValidPakistaniPhone(profileForm.phone)) {
      toast.error('Enter a valid Pakistani mobile number, e.g. 03XXXXXXXXX or +923XXXXXXXXX.', { id: 'auth-toast' });
      return;
    }

    setLoading(true);
    try {
      await completeProfile({ phone: profileForm.phone, province: profileForm.province });
      setLoading(false);
      setNeedsProfile(false);
      onClose();
    } catch (err) {
      setLoading(false);
      toast.error(err instanceof Error ? err.message : 'Could not save your details.', { id: 'auth-toast' });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        style={{
          background: 'var(--white)', borderRadius: 20, width: '100%', maxWidth: 440,
          overflow: 'hidden', animation: 'fadeInUp 0.25s ease',
          boxShadow: '0 20px 60px rgba(15,23,42,0.15)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '24px 28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'linear-gradient(135deg, #1B4FD8, #6366F1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: 'white', fontWeight: 700, fontSize: 14, fontFamily: 'Sora, sans-serif' }}>P</span>
              </div>
              <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--dark)' }}>
                PrepHub PK
              </span>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--dark)', marginTop: 12 }}>
              {needsProfile ? 'Almost done' : tab === 'forgot' ? 'Reset password' : tab === 'login' ? 'Welcome back' : 'Create account'}
            </h2>
            <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 4 }}>
              {needsProfile
                ? 'A couple more details and you\'re set'
                : tab === 'forgot'
                ? "We'll send you a reset link"
                : tab === 'login'
                ? 'Continue your exam preparation'
                : 'Start preparing for your dream job'}
            </p>
          </div>
          <button onClick={onClose} style={{
            width: 34, height: 34, borderRadius: 8, border: '1.5px solid var(--border)',
            background: 'white', cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center', color: 'var(--muted)',
          }}>
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        {tab !== 'forgot' && !needsProfile && (
          <div style={{ display: 'flex', margin: '20px 28px 0', background: 'var(--bg)', borderRadius: 10, padding: 4 }}>
            {(['login', 'register'] as const).map(t => (
              <button key={t} onClick={() => { setTab(t); setSuccess(false); resetMessages(); }} style={{
                flex: 1, padding: '9px', borderRadius: 7, border: 'none', cursor: 'pointer',
                fontSize: 14, fontWeight: 600, fontFamily: 'DM Sans, sans-serif',
                background: tab === t ? 'var(--white)' : 'transparent',
                color: tab === t ? 'var(--primary)' : 'var(--muted)',
                boxShadow: tab === t ? '0 1px 4px rgba(15,23,42,0.08)' : 'none',
                transition: 'all 0.15s ease',
              }}>
                {t === 'login' ? 'Log in' : 'Sign up'}
              </button>
            ))}
          </div>
        )}

        <div style={{ padding: '20px 28px 28px' }}>
          {/* Inline error banner */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 8, background: '#FFF1F2',
              border: '1px solid #FECDD3', color: '#BE123C', borderRadius: 10,
              padding: '10px 12px', fontSize: 13, marginBottom: 16, lineHeight: 1.5,
            }}>
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                {error}
                {unverified && (
                  <div style={{ marginTop: 8 }}>
                    {resendSent ? (
                      <span style={{ color: '#16A34A', fontWeight: 600 }}>Verification email sent, check your inbox.</span>
                    ) : (
                      <button type="button" onClick={handleResend} disabled={loading} style={{
                        background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                        color: 'var(--primary)', fontWeight: 600, fontSize: 13, textDecoration: 'underline',
                      }}>
                        Resend verification email
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Complete-profile step (shown right after a first Google sign-in) */}
          {needsProfile ? (
            <form onSubmit={handleCompleteProfile}>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16, lineHeight: 1.5 }}>
                Google doesn&apos;t share your phone number or province, and we need them for your profile.
              </p>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--dark)', marginBottom: 6 }}>Phone number</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-light)' }} />
                  <input type="tel" required value={profileForm.phone}
                    onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                    placeholder="03XX-XXXXXXX"
                    className="input-field" style={{ paddingLeft: 42 }} />
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--dark)', marginBottom: 6 }}>Province</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-light)' }} />
                  <select required value={profileForm.province}
                    onChange={e => setProfileForm({ ...profileForm, province: e.target.value })}
                    className="input-field" style={{ paddingLeft: 42, appearance: 'auto' }}>
                    <option value="">Select province</option>
                    {PROVINCES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '13px', borderRadius: 10, background: 'var(--primary)',
                border: 'none', color: 'white', fontSize: 15, fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif',
                opacity: loading ? 0.8 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                {loading && <Spinner />}
                {loading ? 'Saving...' : 'Finish setting up my account'}
              </button>
            </form>
          ) : success ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'var(--success-light)', margin: '0 auto 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <CheckCircle size={32} color="var(--success)" />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--dark)', marginBottom: 8 }}>
                {tab === 'forgot' ? 'Email sent!' : 'Check your inbox!'}
              </h3>
              <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 20 }}>
                {tab === 'forgot'
                  ? 'Check your inbox for the reset link.'
                  : `We've sent a verification link to ${registerForm.email}. Verify your email to activate your account.`}
              </p>
              {tab !== 'forgot' && (
                <button
                  type="button"
                  disabled={loading || resendSent}
                  onClick={async () => {
                    setLoading(true);
                    try {
                      await resendVerification(registerForm.email);
                      setResendSent(true);
                      toast.success('Verification email sent.', { id: 'auth-toast' });
                    } catch (err) {
                      toast.error(err instanceof Error ? err.message : 'Could not resend verification email.', { id: 'auth-toast' });
                    } finally {
                      setLoading(false);
                    }
                  }}
                  style={{
                    background: 'none', border: 'none', cursor: resendSent ? 'default' : 'pointer',
                    color: resendSent ? '#16A34A' : 'var(--primary)', fontWeight: 600, fontSize: 13,
                    textDecoration: resendSent ? 'none' : 'underline', marginBottom: 16, display: 'block', width: '100%',
                  }}
                >
                  {resendSent ? 'Verification email resent' : "Didn't get it? Resend email"}
                </button>
              )}
              <button onClick={() => { setSuccess(false); setTab('login'); onClose(); }} style={{
                background: 'var(--primary)', color: 'white', padding: '11px 28px',
                borderRadius: 10, border: 'none', cursor: 'pointer',
                fontSize: 15, fontWeight: 600, fontFamily: 'DM Sans, sans-serif',
              }}>
                {tab === 'forgot' ? 'Back to login' : 'Got it'}
              </button>
            </div>
          ) : tab === 'login' ? (
            <>
              <form onSubmit={handleLogin}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--dark)', marginBottom: 6 }}>Email address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-light)' }} />
                    <input
                      type="email" required value={loginForm.email}
                      onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                      placeholder="you@example.com"
                      className="input-field"
                      style={{ paddingLeft: 42 }}
                    />
                  </div>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--dark)', marginBottom: 6 }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-light)' }} />
                    <input
                      type={showPassword ? 'text' : 'password'} required value={loginForm.password}
                      onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                      placeholder="Enter password"
                      className="input-field"
                      style={{ paddingLeft: 42, paddingRight: 44 }}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                      position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)',
                    }}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 20 }}>
                  <button type="button" onClick={() => { setTab('forgot'); resetMessages(); }} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 13, color: 'var(--primary)', fontWeight: 500,
                  }}>Forgot password?</button>
                </div>
                <button type="submit" disabled={loading || loginCooldown > 0} style={{
                  width: '100%', padding: '13px', borderRadius: 10, background: 'var(--primary)',
                  border: 'none', color: 'white', fontSize: 15, fontWeight: 600,
                  cursor: (loading || loginCooldown > 0) ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif',
                  opacity: (loading || loginCooldown > 0) ? 0.6 : 1, transition: 'all 0.15s ease',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>
                  {loading && <Spinner />}
                  {loading
                    ? 'Logging in...'
                    : loginCooldown > 0
                    ? `Try again in ${loginCooldown}s`
                    : 'Log in'}
                </button>
              </form>

              <div className="divider my-4" style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '18px 0' }}>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>or</span>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              </div>
              <div ref={googleBtnRef} style={{ display: 'flex', justifyContent: 'center', minHeight: 40 }} />
              {!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
                <p style={{ fontSize: 11, color: 'var(--muted-light)', textAlign: 'center', marginTop: 6 }}>
                  Google sign-in isn&apos;t configured yet.
                </p>
              )}

              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>Don&apos;t have an account? </span>
                <button type="button" onClick={() => { setTab('register'); resetMessages(); }} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 13, color: 'var(--primary)', fontWeight: 600,
                }}>Sign up free</button>
              </div>
            </>
          ) : tab === 'register' ? (
            <>
              <form onSubmit={handleRegister}>
                <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--dark)', marginBottom: 6 }}>First name</label>
                    <div style={{ position: 'relative' }}>
                      <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-light)' }} />
                      <input type="text" required value={registerForm.firstName}
                        onChange={e => setRegisterForm({ ...registerForm, firstName: e.target.value })}
                        placeholder="Muhammad"
                        className="input-field" style={{ paddingLeft: 42 }} />
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--dark)', marginBottom: 6 }}>Last name</label>
                    <input type="text" required value={registerForm.lastName}
                      onChange={e => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                      placeholder="Ahmed"
                      className="input-field" />
                  </div>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--dark)', marginBottom: 6 }}>Email address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-light)' }} />
                    <input type="email" required value={registerForm.email}
                      onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })}
                      placeholder="you@example.com"
                      className="input-field" style={{ paddingLeft: 42 }} />
                  </div>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--dark)', marginBottom: 6 }}>Phone number</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-light)' }} />
                    <input type="tel" required value={registerForm.phone}
                      onChange={e => setRegisterForm({ ...registerForm, phone: e.target.value })}
                      placeholder="03XX-XXXXXXX"
                      className="input-field" style={{ paddingLeft: 42 }} />
                  </div>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--dark)', marginBottom: 6 }}>Province</label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-light)' }} />
                    <select required value={registerForm.province}
                      onChange={e => setRegisterForm({ ...registerForm, province: e.target.value })}
                      className="input-field" style={{ paddingLeft: 42, appearance: 'auto' }}>
                      <option value="">Select province</option>
                      {PROVINCES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--dark)', marginBottom: 6 }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-light)' }} />
                    <input type={showPassword ? 'text' : 'password'} required minLength={8} value={registerForm.password}
                      onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })}
                      placeholder="Min 8 characters, upper & lower case, a number"
                      className="input-field" style={{ paddingLeft: 42, paddingRight: 44 }} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                      position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)',
                    }}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', marginBottom: 20 }}>
                  <input type="checkbox" required checked={registerForm.agree}
                    onChange={e => setRegisterForm({ ...registerForm, agree: e.target.checked })}
                    style={{ marginTop: 2 }} />
                  <span style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
                    I agree to the <span style={{ color: 'var(--primary)' }}>Terms of Service</span> and <span style={{ color: 'var(--primary)' }}>Privacy Policy</span>
                  </span>
                </label>
                <button type="submit" disabled={loading} style={{
                  width: '100%', padding: '13px', borderRadius: 10, background: 'var(--primary)',
                  border: 'none', color: 'white', fontSize: 15, fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif',
                  opacity: loading ? 0.8 : 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>
                  {loading && <Spinner />}
                  {loading ? 'Creating account...' : 'Create free account'}
                </button>
              </form>

              <div className="divider my-4" style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '18px 0' }}>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>or</span>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              </div>
              <div ref={googleBtnRef} style={{ display: 'flex', justifyContent: 'center', minHeight: 40 }} />
            </>
          ) : (
            <form onSubmit={handleForgot}>
              <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 20, lineHeight: 1.6 }}>
                Enter your email and we&apos;ll send you a link to reset your password.
              </p>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--dark)', marginBottom: 6 }}>Email address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-light)' }} />
                  <input type="email" required value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="input-field" style={{ paddingLeft: 42 }} />
                </div>
              </div>
              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '13px', borderRadius: 10, background: 'var(--primary)',
                border: 'none', color: 'white', fontSize: 15, fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                {loading && <Spinner />}
                {loading ? 'Sending...' : 'Send reset link'}
              </button>
              <button type="button" onClick={() => setTab('login')} style={{
                width: '100%', marginTop: 10, padding: '11px', borderRadius: 10,
                border: '1.5px solid var(--border)', background: 'white',
                fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                color: 'var(--dark)',
              }}>
                Back to login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
