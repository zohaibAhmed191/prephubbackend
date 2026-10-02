'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import { Spinner } from '@/components/Spinner';
import { api, ApiError } from '@/lib/api';
import { Mail, MessageSquare, Clock, CheckCircle, Send } from 'lucide-react';

export default function ContactPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError('');
    setSubmitting(true);
    try {
      await api.sendContactMessage(form);
      setSent(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not send your message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar onLoginOpen={() => setAuthOpen(true)} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />

      <div style={{ background: 'var(--dark)', padding: '52px 20px 60px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: 'white', marginBottom: 14, fontFamily: 'Sora, sans-serif' }}>
            Contact Us
          </h1>
          <p style={{ fontSize: 16, color: '#94A3B8', lineHeight: 1.7 }}>
            Found an incorrect job listing, have a question about your account, or just want to say hello? Send us a message.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '56px 20px', display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 32 }} className="contact-layout">
        {/* Info column */}
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--dark)', marginBottom: 20, fontFamily: 'Sora, sans-serif' }}>
            Ways to reach us
          </h2>
          <div style={{ display: 'flex', gap: 14, marginBottom: 22 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Mail size={18} color="var(--primary)" />
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--dark)', marginBottom: 2 }}>Email</p>
              <a href="mailto:info@prephubpk.com" style={{ fontSize: 14, color: 'var(--muted)', textDecoration: 'none' }}>info@prephubpk.com</a>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 14, marginBottom: 22 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Clock size={18} color="#16A34A" />
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--dark)', marginBottom: 2 }}>Response time</p>
              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>We usually reply within 1 to 2 business days.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 14, marginBottom: 22 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#FAF5FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <MessageSquare size={18} color="#7C3AED" />
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--dark)', marginBottom: 2 }}>What to include</p>
              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>
                For a job listing issue, the job title and commission help us find it faster. For an account
                question, use the email address you registered with.
              </p>
            </div>
          </div>
          <div style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 12, padding: 16, marginTop: 8 }}>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>
              Advertising or partnership inquiry instead? Visit{' '}
              <a href="/advertise" style={{ color: 'var(--primary)', fontWeight: 600 }}>Advertise with Us</a>.
            </p>
          </div>
        </div>

        {/* Form column */}
        <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 16, padding: 28 }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '40px 10px' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <CheckCircle size={26} color="#16A34A" />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--dark)', marginBottom: 8 }}>Message sent</h3>
              <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 20 }}>
                Thanks for reaching out. We&apos;ll get back to you at the email address you provided.
              </p>
              <button onClick={() => setSent(false)} style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '10px 20px', borderRadius: 9, border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }} className="resp-2col">
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--dark)', marginBottom: 6 }}>Your name</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full name" className="input-field" maxLength={100} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--dark)', marginBottom: 6 }}>Your email</label>
                  <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="input-field" maxLength={255} />
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--dark)', marginBottom: 6 }}>Subject</label>
                <input required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="What is this about?" className="input-field" maxLength={150} />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--dark)', marginBottom: 6 }}>Message</label>
                <textarea
                  required
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us what's going on..."
                  rows={6}
                  maxLength={5000}
                  className="input-field"
                  style={{ resize: 'vertical', fontFamily: 'DM Sans, sans-serif', paddingTop: 10 }}
                />
              </div>

              {error && (
                <p style={{ fontSize: 13, color: '#E11D48', marginBottom: 14, background: '#FFF1F2', padding: '10px 14px', borderRadius: 8 }}>{error}</p>
              )}

              <button type="submit" disabled={submitting} style={{
                width: '100%', padding: '13px', borderRadius: 10, background: 'var(--primary)',
                border: 'none', color: 'white', fontSize: 15, fontWeight: 600,
                cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif',
                opacity: submitting ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                {submitting ? <Spinner size={15} thickness={2} color="white" /> : <Send size={15} />}
                {submitting ? 'Sending...' : 'Send message'}
              </button>
            </form>
          )}
        </div>
      </div>

      <Footer />
      <style>{`
        @media(max-width:768px){
          .contact-layout{grid-template-columns:1fr !important;}
          .resp-2col{grid-template-columns:1fr !important;}
        }
      `}</style>
    </>
  );
}
