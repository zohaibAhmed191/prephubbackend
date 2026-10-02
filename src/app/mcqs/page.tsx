'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import { Spinner } from '@/components/Spinner';
import { api, Subject } from '@/lib/api';
import { ChevronRight, BookOpen } from 'lucide-react';

// Real subjects come from the MCQ bank with no icon of their own, so this
// maps common exam subject names to an emoji, falling back to a generic one.
const SUBJECT_ICONS: Record<string, string> = {
  'General Knowledge': '🌍',
  'Pakistan Studies': '🇵🇰',
  'Pakistan Affairs': '🇵🇰',
  'Islamiat': '☪️',
  'English': '📝',
  'English Grammar': '📝',
  'English Essay': '📝',
  'Current Affairs': '📰',
  'Everyday Science': '🔬',
  'Basic Math': '🔢',
  'Mathematics': '🔢',
  'Computer Basics': '💻',
  'Computer Science': '💻',
  'Networking': '🌐',
  'Economics': '💰',
  'Accountancy': '📊',
  'Sindhi': '📖',
  'Urdu': '📖',
};
const iconForSubject = (name: string) => SUBJECT_ICONS[name] || '📚';

export default function MCQsPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.getSubjects()
      .then(res => {
        if (!cancelled) setSubjects(res.subjects);
      })
      .catch(() => {
        if (!cancelled) setSubjects([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const totalMcqs = subjects.reduce((sum, s) => sum + s.mcqCount, 0);

  return (
    <>
      <Navbar onLoginOpen={() => setAuthOpen(true)} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />

      <div style={{ background: 'var(--dark)', padding: '40px 20px 50px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: 34, fontWeight: 800, color: 'white', marginBottom: 10, fontFamily: 'Sora, sans-serif' }}>MCQ Practice Bank</h1>
          <p style={{ fontSize: 15, color: '#94A3B8' }}>
            {loading ? 'Loading subjects...' : `${totalMcqs.toLocaleString()}+ MCQs for FPSC, PPSC, SPSC, NTS, CSS, NPF exams`}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}>
        <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 24 }}>
          Pick a subject to start a timed mock test drawn from every published job that needs it, not just one job posting. Log in to take a quiz, your score is saved to your profile automatically.
        </p>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '60px 20px', background: 'var(--white)', borderRadius: 14, border: '1.5px solid var(--border)' }}>
            <Spinner size={28} />
            <p style={{ fontSize: 14, color: 'var(--muted)' }}>Loading subjects...</p>
          </div>
        ) : subjects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--white)', borderRadius: 14, border: '1.5px solid var(--border)' }}>
            <BookOpen size={28} color="var(--muted-light)" style={{ marginBottom: 12 }} />
            <p style={{ fontSize: 15, color: 'var(--muted)' }}>No subjects are available yet. Check back soon.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {subjects.map(s => (
              <Link key={s.subject} href={`/subjects/${encodeURIComponent(s.subject)}/quiz`} style={{ textDecoration: 'none' }}>
                <div className="card-hover" style={{ background: 'var(--white)', borderRadius: 14, padding: '22px 18px', border: '1.5px solid var(--border)', textAlign: 'center' }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>{iconForSubject(s.subject)}</div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--dark)', marginBottom: 4 }}>{s.subject}</h4>
                  <p style={{ fontSize: 12, color: 'var(--muted)' }}>{s.mcqCount.toLocaleString()} MCQs</p>
                  <div style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--primary)', fontSize: 12, fontWeight: 600 }}>Practice <ChevronRight size={12} /></div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
