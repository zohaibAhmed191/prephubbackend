'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import PageLoader, { Spinner } from '@/components/Spinner';
import { useAuth } from '@/lib/auth-context';
import { api, QuizAttemptSummary, QuizAttemptDetail, PROVINCES } from '@/lib/api';
import { BarChart2, Award, Briefcase, Clock, TrendingUp, Target, Lock, ChevronRight, LogIn, Calendar } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'results' | 'bookmarks' | 'settings'>('overview');
  const [attempts, setAttempts] = useState<QuizAttemptSummary[]>([]);
  const [latest, setLatest] = useState<QuizAttemptDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (authLoading || !user) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    api.getQuizAttempts()
      .then(async res => {
        if (cancelled) return;
        setAttempts(res.attempts);
        if (res.attempts.length > 0) {
          try {
            const detail = await api.getQuizAttempt(res.attempts[0].id);
            if (!cancelled) setLatest(detail.attempt);
          } catch {
            // subject breakdown is a nice-to-have, fine if this one call fails
          }
        }
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [authLoading, user]);

  if (authLoading) {
    return (
      <>
        <Navbar onLoginOpen={() => setAuthOpen(true)} />
        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
        <PageLoader />
        <Footer />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar onLoginOpen={() => setAuthOpen(true)} />
        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
        <div style={{ maxWidth: 500, margin: '80px auto', textAlign: 'center', padding: '0 20px' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <LogIn size={24} color="var(--primary)" />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--dark)', marginBottom: 8 }}>Log in to see your profile</h1>
          <p style={{ color: 'var(--muted)', marginBottom: 24, fontSize: 14 }}>Your quiz history and progress are saved to your account.</p>
          <button onClick={() => setAuthOpen(true)} style={{
            background: 'var(--primary)', color: 'white', padding: '12px 28px', borderRadius: 10,
            border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
          }}>
            Log in / Sign up
          </button>
        </div>
        <Footer />
      </>
    );
  }

  const totalAttempts = attempts.length;
  const avgScore = totalAttempts > 0 ? Math.round(attempts.reduce((s, a) => s + a.percentage, 0) / totalAttempts) : 0;
  const bestScore = totalAttempts > 0 ? Math.max(...attempts.map(a => a.percentage)) : 0;
  const improvement = totalAttempts >= 2 ? attempts[0].percentage - attempts[attempts.length - 1].percentage : 0;

  // Subject-wise accuracy from the most recent attempt, if we could load it.
  const subjectStats: { subject: string; pct: number }[] = [];
  if (latest) {
    const bySubject: Record<string, { correct: number; total: number }> = {};
    latest.answers.forEach(a => {
      const key = a.subject || 'General';
      if (!bySubject[key]) bySubject[key] = { correct: 0, total: 0 };
      bySubject[key].total++;
      if (a.isCorrect) bySubject[key].correct++;
    });
    Object.entries(bySubject).forEach(([subject, v]) => {
      subjectStats.push({ subject, pct: Math.round((v.correct / v.total) * 100) });
    });
  }
  const weakestSubject = subjectStats.length > 0
    ? subjectStats.reduce((min, s) => (s.pct < min.pct ? s : min), subjectStats[0])
    : null;

  const gradeOf = (pct: number) => (pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : pct >= 50 ? 'D' : 'F');
  const gradeBg = (g: string) => ({ A: '#DCFCE7', B: '#EEF3FF', C: '#FFFBEB', D: '#FFF4EC', F: '#FFF1F2' }[g] || '#F1F5F9');
  const gradeColor = (g: string) => ({ A: '#16A34A', B: '#1B4FD8', C: '#D97706', D: '#EA580C', F: '#E11D48' }[g] || '#64748B');

  const initials = user
    ? (((user.first_name?.[0] || user.name?.[0] || '') + (user.last_name?.[0] || '')).toUpperCase() || 'U')
    : '';
  const provinceLabel = user?.province ? PROVINCES.find(p => p.value === user.province)?.label || user.province : null;

  const tabs = [
    { key: 'overview', label: 'Overview', icon: <BarChart2 size={15} /> },
    { key: 'results', label: 'My Results', icon: <Award size={15} /> },
    { key: 'bookmarks', label: 'Saved Jobs', icon: <Briefcase size={15} /> },
    { key: 'settings', label: 'Settings', icon: <Lock size={15} /> },
  ];

  return (
    <>
      <Navbar onLoginOpen={() => setAuthOpen(true)} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />

      <div style={{ background: 'linear-gradient(135deg,#0F172A,#1B4FD8)', padding: '40px 20px 80px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#6366F1,#818CF8)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid rgba(255,255,255,0.2)', flexShrink: 0 }}>
            <span style={{ color: 'white', fontSize: 26, fontWeight: 800, fontFamily: 'Sora,sans-serif' }}>{initials}</span>
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'white', fontFamily: 'Sora,sans-serif' }}>{user?.name || 'My Profile'}</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginTop: 4 }}>
              {user?.email}{provinceLabel ? ` · ${provinceLabel}` : ''}
            </p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '-32px auto 0', padding: '0 20px 60px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(155px,1fr))', gap: 14, marginBottom: 28 }}>
          {[
            { label: 'Quizzes Taken', value: totalAttempts, icon: <Target size={18} color="#1B4FD8" />, bg: 'var(--primary-light)' },
            { label: 'Average Score', value: `${avgScore}%`, icon: <BarChart2 size={18} color="#16A34A" />, bg: '#DCFCE7' },
            { label: 'Best Score', value: `${bestScore}%`, icon: <Award size={18} color="#D97706" />, bg: '#FFFBEB' },
            { label: 'Change', value: `${improvement >= 0 ? '+' : ''}${improvement}%`, icon: <TrendingUp size={18} color="#7C3AED" />, bg: '#FAF5FF' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'var(--white)', borderRadius: 14, padding: '18px 16px', border: '1.5px solid var(--border)', boxShadow: '0 4px 20px rgba(15,23,42,0.06)' }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>{s.icon}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--dark)', fontFamily: 'Sora,sans-serif' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--white)', borderRadius: 14, border: '1.5px solid var(--border)', overflow: 'hidden', boxShadow: '0 4px 20px rgba(15,23,42,0.06)' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
            {tabs.map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key as typeof activeTab)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '15px 20px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: 14, fontWeight: 600, fontFamily: 'DM Sans,sans-serif', background: activeTab === t.key ? 'var(--primary-light)' : 'transparent', color: activeTab === t.key ? 'var(--primary)' : 'var(--muted)', borderBottom: activeTab === t.key ? '2px solid var(--primary)' : '2px solid transparent', transition: 'all 0.15s' }}>
                {t.icon}{t.label}
              </button>
            ))}
          </div>

          <div style={{ padding: 28 }}>
            {loading && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '40px 20px' }}>
                <Spinner size={26} />
                <p style={{ color: 'var(--muted)', fontSize: 14 }}>Loading your results...</p>
              </div>
            )}
            {loadError && <p style={{ color: 'var(--muted)', fontSize: 14 }}>Could not load your results. Please try again in a moment.</p>}

            {!loading && !loadError && activeTab === 'overview' && (
              totalAttempts === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 20px' }}>
                  <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 16 }}>You haven&apos;t taken any quizzes yet.</p>
                  <Link href="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--primary)', color: 'white', padding: '11px 24px', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
                    Browse jobs <ChevronRight size={15} />
                  </Link>
                </div>
              ) : (
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--dark)', marginBottom: 20 }}>Score Progress</h3>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 32, height: 110 }}>
                    {[...attempts].slice(0, 6).reverse().map((a, i) => (
                      <div key={a.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: a.percentage >= 70 ? 'var(--success)' : '#F59E0B' }}>{a.percentage}%</span>
                        <div style={{ width: '100%', height: `${a.percentage}px`, background: a.percentage >= 70 ? 'var(--success)' : '#F59E0B', borderRadius: '6px 6px 0 0', opacity: 0.85 }} />
                        <span style={{ fontSize: 10, color: 'var(--muted)' }}>Quiz {i + 1}</span>
                      </div>
                    ))}
                  </div>

                  {subjectStats.length > 0 && (
                    <>
                      <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--dark)', marginBottom: 16 }}>Subject Performance (Latest Quiz)</h3>
                      {subjectStats.map(s => (
                        <div key={s.subject} style={{ marginBottom: 14 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--dark)' }}>{s.subject}</span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: s.pct >= 70 ? 'var(--success)' : '#F59E0B' }}>{s.pct}%</span>
                          </div>
                          <div className="progress-bar"><div className="progress-fill" style={{ width: `${s.pct}%`, background: s.pct >= 70 ? 'var(--success)' : '#F59E0B' }} /></div>
                        </div>
                      ))}
                      {weakestSubject && (
                        <div style={{ marginTop: 24, padding: 18, background: '#FFF4EC', borderRadius: 12, border: '1px solid rgba(249,115,22,0.2)' }}>
                          <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--dark)', marginBottom: 6 }}>Recommendation</h4>
                          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
                            Your weakest area in the last quiz was <strong>{weakestSubject.subject}</strong> at {weakestSubject.pct}%. Focus more practice there.
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )
            )}

            {!loading && !loadError && activeTab === 'results' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--dark)' }}>All Quiz Results</h3>
                  <span style={{ fontSize: 13, color: 'var(--muted)' }}>{totalAttempts} quizzes</span>
                </div>
                {totalAttempts === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px 20px' }}>
                    <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 16 }}>You haven&apos;t taken any quizzes yet.</p>
                    <Link href="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--primary)', color: 'white', padding: '11px 24px', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
                      Browse jobs <ChevronRight size={15} />
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {attempts.map(a => {
                      const grade = gradeOf(a.percentage);
                      const isSubject = a.type === 'subject';
                      const href = isSubject
                        ? `/subjects/${encodeURIComponent(a.subject || '')}/quiz`
                        : (a.jobSlug ? `/jobs/${a.jobSlug}` : `/jobs/${a.jobId}`);
                      return (
                        <Link key={a.id} href={href} style={{ background: 'var(--bg)', borderRadius: 12, padding: '18px 20px', border: '1.5px solid var(--border)', textDecoration: 'none', display: 'block' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                            <div>
                              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
                                {a.commission && <span className={`badge tag-${a.commission.toLowerCase()}`}>{a.commission}</span>}
                                {isSubject && <span className="badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>Subject Practice</span>}
                                <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--dark)' }}>{isSubject ? a.subject : a.jobTitle}</h4>
                              </div>
                              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--muted)' }}>
                                  <Calendar size={13} /> {new Date(a.takenAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                                <span style={{ fontSize: 13, color: 'var(--muted)' }}>{a.score}/{a.total} correct</span>
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                              <span style={{ background: gradeBg(grade), color: gradeColor(grade), padding: '3px 12px', borderRadius: 7, fontSize: 14, fontWeight: 800 }}>Grade {grade}</span>
                              <span style={{ background: a.percentage >= 70 ? '#DCFCE7' : '#FFFBEB', color: a.percentage >= 70 ? '#16A34A' : '#D97706', padding: '3px 14px', borderRadius: 7, fontSize: 16, fontWeight: 800, fontFamily: 'Sora,sans-serif' }}>{a.percentage}%</span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'bookmarks' && (
              <div style={{ textAlign: 'center', padding: '30px 20px' }}>
                <Briefcase size={28} color="var(--muted-light)" style={{ marginBottom: 12 }} />
                <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 6 }}>Saving jobs isn&apos;t available yet.</p>
                <p style={{ fontSize: 13, color: 'var(--muted-light)' }}>This is coming in a future update.</p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--dark)', marginBottom: 24 }}>Account Information</h3>
                <div style={{ background: 'var(--bg)', borderRadius: 12, padding: 20 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="resp-2col">
                    {[
                      { label: 'Full Name', val: user?.name || '-' },
                      { label: 'Email', val: user?.email || '-' },
                      { label: 'Phone', val: user?.phone || '-' },
                      { label: 'Province', val: provinceLabel || '-' },
                    ].map(f => (
                      <div key={f.label}>
                        <label style={{ display: 'block', fontSize: 12, color: 'var(--muted)', marginBottom: 5, fontWeight: 500 }}>{f.label}</label>
                        <input readOnly value={f.val} className="input-field" style={{ fontSize: 14 }} />
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--muted-light)', marginTop: 16 }}>Editing your profile details isn&apos;t available here yet.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
      <style>{`@media(max-width:640px){.resp-2col{grid-template-columns:1fr !important;}}`}</style>
    </>
  );
}
