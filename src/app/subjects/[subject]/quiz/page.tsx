'use client';
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import PageLoader, { Spinner } from '@/components/Spinner';
import { useAuth } from '@/lib/auth-context';
import { api, QuizQuestion, QuizAttemptDetail } from '@/lib/api';
import { Clock, CheckCircle, XCircle, RotateCcw, ChevronRight, AlertTriangle, Trophy, LogIn } from 'lucide-react';

type Phase = 'loading' | 'login-required' | 'intro' | 'test' | 'result' | 'error';

export default function SubjectQuizPage() {
  const params = useParams();
  // The homepage/mcqs links encodeURIComponent the subject name (it can have
  // spaces), Next.js may or may not have already decoded the segment
  // depending on version, so decode defensively; a plain string with no
  // percent-escapes just passes through unchanged.
  const rawSubject = String(params?.subject || '');
  let subject = rawSubject;
  try {
    subject = decodeURIComponent(rawSubject);
  } catch {
    subject = rawSubject;
  }
  const { user, loading: authLoading } = useAuth();

  const [authOpen, setAuthOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [attempt, setAttempt] = useState<QuizAttemptDetail | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const totalTime = questions.length * 60;

  // Wait for auth to resolve, then either ask to log in or load the quiz.
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setPhase('login-required');
      return;
    }
    if (!subject) return;

    let cancelled = false;
    api.startSubjectQuiz(subject)
      .then(res => {
        if (cancelled) return;
        setQuestions(res.questions);
        setPhase('intro');
      })
      .catch(err => {
        if (cancelled) return;
        setErrorMessage(err?.message || 'Could not load this quiz.');
        setPhase('error');
      });
    return () => {
      cancelled = true;
    };
  }, [authLoading, user, subject]);

  const endTest = useCallback(() => {
    if (submitting) return;
    setSubmitting(true);
    const payload = questions.map(q => ({ id: q.id, selected: answers[q.id] ?? null }));
    api.submitSubjectQuiz(subject, payload)
      .then(res => {
        setAttempt(res.attempt);
        setPhase('result');
      })
      .catch(err => {
        setErrorMessage(err?.message || 'Could not submit your quiz.');
        setPhase('error');
      })
      .finally(() => setSubmitting(false));
  }, [subject, questions, answers, submitting]);

  useEffect(() => {
    if (phase !== 'test') return;
    if (timeLeft <= 0) { endTest(); return; }
    const t = setInterval(() => setTimeLeft(p => { if (p <= 1) { endTest(); return 0; } return p - 1; }), 1000);
    return () => clearInterval(t);
  }, [phase, timeLeft, endTest]);

  const startTest = () => {
    setAnswers({});
    setCurrentQ(0);
    setTimeLeft(totalTime);
    setFlagged(new Set());
    setPhase('test');
  };

  const restartWithFreshBatch = () => {
    setAttempt(null);
    setPhase('loading');
    api.startSubjectQuiz(subject)
      .then(res => {
        setQuestions(res.questions);
        setPhase('intro');
      })
      .catch(err => {
        setErrorMessage(err?.message || 'Could not load this quiz.');
        setPhase('error');
      });
  };

  const fmtTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const pct = totalTime > 0 ? Math.round((timeLeft / totalTime) * 100) : 0;
  const isUrgent = timeLeft < 120;
  const answered = Object.keys(answers).length;

  if (phase === 'loading') {
    return (
      <>
        <Navbar onLoginOpen={() => setAuthOpen(true)} />
        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
        <PageLoader label="Loading your quiz..." />
        <Footer />
      </>
    );
  }

  if (phase === 'login-required') {
    return (
      <>
        <Navbar onLoginOpen={() => setAuthOpen(true)} />
        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
        <div style={{ maxWidth: 500, margin: '80px auto', textAlign: 'center', padding: '0 20px' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <LogIn size={24} color="var(--primary)" />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--dark)', marginBottom: 8 }}>Log in to take this quiz</h1>
          <p style={{ color: 'var(--muted)', marginBottom: 24, fontSize: 14 }}>
            We save your score and answers to your profile so you can track progress over time, so you need an account first.
          </p>
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

  if (phase === 'error') {
    return (
      <>
        <Navbar onLoginOpen={() => setAuthOpen(true)} />
        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
        <div style={{ maxWidth: 500, margin: '80px auto', textAlign: 'center', padding: '0 20px' }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--dark)', marginBottom: 8 }}>Could not load quiz</h1>
          <p style={{ color: 'var(--muted)', marginBottom: 24, fontSize: 14 }}>{errorMessage}</p>
          <Link href="/mcqs" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 14 }}>Back to subjects</Link>
        </div>
        <Footer />
      </>
    );
  }

  if (phase === 'intro') {
    return (
      <>
        <Navbar onLoginOpen={() => setAuthOpen(true)} />
        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
        <div style={{ background: 'var(--dark)', padding: '44px 20px 52px' }}>
          <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📚</div>
            <h1 style={{ fontSize: 30, fontWeight: 800, color: 'white', marginBottom: 10, fontFamily: 'Sora, sans-serif' }}>{subject}</h1>
            <p style={{ fontSize: 15, color: '#94A3B8' }}>Mock test, random questions from every job that needs this subject</p>
          </div>
        </div>
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 20px' }}>
          <div style={{ background: 'var(--white)', borderRadius: 16, padding: 28, border: '1.5px solid var(--border)', marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--dark)', marginBottom: 20 }}>Test Configuration</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14 }}>
              {[
                { label: 'Total Questions', value: `${questions.length} MCQs` },
                { label: 'Time Allowed', value: `${Math.floor(totalTime / 60)} minutes` },
                { label: 'Marks per MCQ', value: '1 mark each' },
                { label: 'Negative Marking', value: 'None' },
              ].map((item, i) => (
                <div key={i} style={{ background: 'var(--bg)', borderRadius: 10, padding: '14px 16px' }}>
                  <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>{item.label}</p>
                  <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--dark)' }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: '#FFFBEB', borderRadius: 10, border: '1px solid #FCD34D', marginBottom: 28 }}>
            <AlertTriangle size={18} color="#D97706" />
            <p style={{ fontSize: 14, color: '#92400E' }}>Once started, the timer cannot be paused. Your result is saved to your profile automatically.</p>
          </div>

          <button onClick={startTest} style={{
            background: 'var(--primary)', color: 'white', padding: '14px 32px',
            borderRadius: 12, border: 'none', fontSize: 16, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            Start Quiz <ChevronRight size={18} />
          </button>
        </div>
        <Footer />
      </>
    );
  }

  if (phase === 'test') {
    const q = questions[currentQ];
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)', padding: '12px 20px', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--primary)' }}>{subject}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 14, color: 'var(--muted)' }}>{answered}/{questions.length} answered</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: isUrgent ? '#FFF1F2' : 'var(--primary-light)', padding: '8px 14px', borderRadius: 8 }}>
                <Clock size={16} color={isUrgent ? '#E11D48' : 'var(--primary)'} />
                <span style={{ fontSize: 16, fontWeight: 700, color: isUrgent ? '#E11D48' : 'var(--primary)', fontFamily: 'Sora, sans-serif' }}>{fmtTime(timeLeft)}</span>
              </div>
              <button onClick={endTest} disabled={submitting} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 8, border: '1.5px solid #FCA5A5', background: '#FFF1F2', color: '#E11D48', fontSize: 13, fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif', opacity: submitting ? 0.6 : 1 }}>
                {submitting && <Spinner size={13} thickness={2} color="#E11D48" />}
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
          <div style={{ maxWidth: 900, margin: '8px auto 0' }}>
            <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%`, background: isUrgent ? '#E11D48' : undefined }} /></div>
          </div>
        </div>

        <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 20px', width: '100%', display: 'flex', gap: 20, flex: 1 }} className="test-layout">
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ background: 'var(--white)', borderRadius: 14, padding: 28, border: '1.5px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>Question {currentQ + 1} of {questions.length}</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setFlagged(prev => { const n = new Set(prev); n.has(currentQ) ? n.delete(currentQ) : n.add(currentQ); return n; })} style={{ padding: '3px 10px', borderRadius: 6, border: `1.5px solid ${flagged.has(currentQ) ? '#F59E0B' : 'var(--border)'}`, background: flagged.has(currentQ) ? '#FFFBEB' : 'transparent', color: flagged.has(currentQ) ? '#D97706' : 'var(--muted)', fontSize: 12, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                    {flagged.has(currentQ) ? '🚩 Flagged' : '⚑ Flag'}
                  </button>
                </div>
              </div>

              <p style={{ fontSize: 17, fontWeight: 600, color: 'var(--dark)', marginBottom: 22, lineHeight: 1.6 }}>{q.question}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {q.options.map((opt, i) => {
                  const sel = answers[q.id] === i;
                  return (
                    <button key={i} onClick={() => setAnswers(prev => ({ ...prev, [q.id]: i }))} style={{
                      padding: '13px 16px', borderRadius: 10, textAlign: 'left', cursor: 'pointer',
                      fontFamily: 'DM Sans, sans-serif', fontSize: 15,
                      display: 'flex', alignItems: 'center', gap: 12,
                      background: sel ? 'var(--primary-light)' : 'var(--bg)',
                      border: `2px solid ${sel ? 'var(--primary)' : 'var(--border)'}`,
                      color: sel ? 'var(--primary)' : 'var(--dark)',
                      fontWeight: sel ? 600 : 400, transition: 'all 0.15s ease',
                    }}>
                      <span style={{ width: 28, height: 28, borderRadius: 7, flexShrink: 0, background: sel ? 'var(--primary)' : 'var(--white)', color: sel ? 'white' : 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, border: `1.5px solid ${sel ? 'var(--primary)' : 'var(--border)'}` }}>
                        {['A', 'B', 'C', 'D'][i]}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, paddingTop: 18, borderTop: '1px solid var(--border)' }}>
                <button onClick={() => setCurrentQ(p => Math.max(0, p - 1))} disabled={currentQ === 0} style={{ padding: '10px 20px', borderRadius: 9, border: '1.5px solid var(--border)', background: 'white', fontSize: 14, fontWeight: 500, cursor: currentQ === 0 ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif', color: 'var(--dark)', opacity: currentQ === 0 ? 0.4 : 1 }}>← Previous</button>
                {currentQ < questions.length - 1
                  ? <button onClick={() => setCurrentQ(p => p + 1)} style={{ padding: '10px 20px', borderRadius: 9, background: 'var(--primary)', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', color: 'white' }}>Next →</button>
                  : <button onClick={endTest} disabled={submitting} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 9, background: 'var(--success)', border: 'none', fontSize: 14, fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif', color: 'white', opacity: submitting ? 0.6 : 1 }}>{submitting && <Spinner size={13} thickness={2} color="white" />}{submitting ? 'Submitting...' : 'Submit ✓'}</button>
                }
              </div>
            </div>
          </div>

          <div style={{ width: 196, flexShrink: 0 }} className="q-palette">
            <div style={{ background: 'var(--white)', borderRadius: 14, padding: 16, border: '1.5px solid var(--border)' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--dark)', marginBottom: 12 }}>Questions</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 5 }}>
                {questions.map((_, i) => (
                  <button key={i} onClick={() => setCurrentQ(i)} style={{
                    width: '100%', aspectRatio: '1', borderRadius: 6, border: flagged.has(i) ? '1.5px solid #FCD34D' : 'none',
                    cursor: 'pointer', fontSize: 11, fontWeight: 600, fontFamily: 'DM Sans, sans-serif',
                    background: i === currentQ ? 'var(--primary)' : answers[questions[i].id] !== undefined ? '#DCFCE7' : flagged.has(i) ? '#FFFBEB' : 'var(--bg)',
                    color: i === currentQ ? 'white' : answers[questions[i].id] !== undefined ? '#15803D' : flagged.has(i) ? '#D97706' : 'var(--muted)',
                  }}>{i + 1}</button>
                ))}
              </div>
              <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 5 }}>
                {[['var(--primary)', 'Current', 'white'], ['#DCFCE7', 'Answered', '#15803D'], ['var(--bg)', 'Not answered', 'var(--muted)'], ['#FFFBEB', 'Flagged', '#D97706']].map(([bg, label], i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: bg }} />
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <style>{`@media(max-width:768px){.test-layout{flex-direction:column !important;}.q-palette{width:100% !important;}}`}</style>
      </div>
    );
  }

  // Results
  if (attempt) {
    const score = attempt.percentage;
    const grade = score >= 80 ? 'A' : score >= 70 ? 'B' : score >= 60 ? 'C' : score >= 50 ? 'D' : 'F';
    return (
      <>
        <Navbar onLoginOpen={() => setAuthOpen(true)} />
        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
          <div style={{ background: `linear-gradient(135deg, ${score >= 70 ? '#16A34A, #15803D' : score >= 50 ? '#D97706, #B45309' : '#E11D48, #BE123C'})`, borderRadius: 20, padding: '40px 32px', color: 'white', textAlign: 'center', marginBottom: 28 }}>
            <Trophy size={40} color="rgba(255,255,255,0.9)" style={{ marginBottom: 12 }} />
            <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6, fontFamily: 'Sora, sans-serif' }}>Quiz Completed!</h2>
            <p style={{ opacity: 0.8, marginBottom: 28, fontSize: 14 }}>Your result has been saved to your profile</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 36, flexWrap: 'wrap' }}>
              {[['Score', `${score}%`], ['Grade', grade], ['Correct', attempt.score], ['Wrong', attempt.total - attempt.score]].map(([l, v]) => (
                <div key={l} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 34, fontWeight: 800, fontFamily: 'Sora, sans-serif' }}>{v}</div>
                  <div style={{ fontSize: 13, opacity: 0.75 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--dark)', marginBottom: 16 }}>Answer Review</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
            {attempt.answers.map((a, i) => (
              <div key={a.id} style={{ background: 'var(--white)', borderRadius: 12, padding: 18, border: `1.5px solid ${a.isCorrect ? '#86EFAC' : a.selected !== null ? '#FCA5A5' : 'var(--border)'}` }}>
                <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 5, flexShrink: 0, background: a.isCorrect ? '#DCFCE7' : a.selected !== null ? '#FFF1F2' : 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {a.isCorrect ? <CheckCircle size={13} color="#16A34A" /> : a.selected !== null ? <XCircle size={13} color="#E11D48" /> : <span style={{ fontSize: 10, color: 'var(--muted)' }}>-</span>}
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--dark)' }}>Q{i + 1}. {a.question}</p>
                </div>
                <div style={{ paddingLeft: 32, fontSize: 13 }}>
                  <span style={{ color: '#16A34A' }}>✓ {a.options[a.correct]}</span>
                  {a.selected !== null && !a.isCorrect && <span style={{ color: '#E11D48', marginLeft: 14 }}>✗ Your answer: {a.options[a.selected]}</span>}
                  {a.selected === null && <span style={{ color: 'var(--muted)', marginLeft: 14 }}>Not attempted</span>}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={restartWithFreshBatch} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 22px', borderRadius: 10, border: '1.5px solid var(--border)', background: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', color: 'var(--dark)' }}>
              <RotateCcw size={15} /> Take another quiz
            </button>
            <Link href="/profile" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 22px', borderRadius: 10, background: 'var(--primary)', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', color: 'white', textDecoration: 'none' }}>
              View my progress <ChevronRight size={15} />
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return null;
}
