'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import JobCard from '@/components/JobCard';
import AuthModal from '@/components/AuthModal';
import { Spinner } from '@/components/Spinner';
import { useAuth } from '@/lib/auth-context';
import { api, Job, Subject, RecentResult } from '@/lib/api';
import { Search, ArrowRight, BookOpen, FileText, BarChart2, Bell, Users, TrendingUp, CheckCircle, Star, ChevronRight, Briefcase, Zap, Sparkles } from 'lucide-react';

// "3 days ago" style label for the recent results feed.
function timeAgo(iso: string): string {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;
  const years = Math.floor(days / 365);
  return `${years} year${years === 1 ? '' : 's'} ago`;
}

// Real subjects come from the MCQ bank with no icon/color of their own, so
// this maps common exam subject names to an emoji, falling back to a
// generic one for anything not listed.
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

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'FPSC', 'PPSC', 'SPSC', 'NTS', 'CSS', 'NPF'];
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [recentResults, setRecentResults] = useState<RecentResult[]>([]);
  const [resultsLoading, setResultsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setJobsLoading(true);
    api.getJobs()
      .then(res => {
        if (!cancelled) setJobs(res.jobs);
      })
      .catch(() => {
        if (!cancelled) setJobs([]);
      })
      .finally(() => {
        if (!cancelled) setJobsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setSubjectsLoading(true);
    api.getSubjects()
      .then(res => {
        if (!cancelled) setSubjects(res.subjects);
      })
      .catch(() => {
        if (!cancelled) setSubjects([]);
      })
      .finally(() => {
        if (!cancelled) setSubjectsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setResultsLoading(true);
    api.getRecentResults()
      .then(res => {
        if (!cancelled) setRecentResults(res.results);
      })
      .catch(() => {
        if (!cancelled) setRecentResults([]);
      })
      .finally(() => {
        if (!cancelled) setResultsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Navbar onLoginOpen={() => setAuthOpen(true)} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />

      {/* HERO */}
      <section className="hero-bg" style={{ padding: '80px 20px 100px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 30, padding: '6px 16px', marginBottom: 24, border: '1px solid rgba(255,255,255,0.15)' }}>
            <Zap size={14} color="#F59E0B" />
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>Pakistan&apos;s #1 Government Job Prep Platform</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 58px)', fontWeight: 800, color: 'white', lineHeight: 1.1, marginBottom: 20, fontFamily: 'Sora, sans-serif' }}>
            Find the Job.<br /><span style={{ color: '#818CF8' }}>Ace the Exam.</span><br />Get Hired.
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)', marginBottom: 40, lineHeight: 1.7 }}>
            Job alerts, prep material, MCQ practice, and mock tests, all matched to the exact exam you&apos;re preparing for. Free forever.
          </p>
          <form
            onSubmit={e => {
              e.preventDefault();
              const q = searchQuery.trim();
              router.push(q ? `/jobs?q=${encodeURIComponent(q)}` : '/jobs');
            }}
            style={{ background: 'white', borderRadius: 14, padding: '8px 8px 8px 20px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 20px 60px rgba(0,0,0,0.3)', maxWidth: 600, margin: '0 auto 20px' }}
          >
            <Search size={20} color="var(--muted)" />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search jobs, MCQs, exams..." style={{ flex: 1, border: 'none', outline: 'none', fontSize: 16, fontFamily: 'DM Sans, sans-serif', color: 'var(--dark)' }} />
            <button type="submit" style={{ background: 'var(--primary)', color: 'white', padding: '12px 22px', borderRadius: 10, fontSize: 15, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: 6 }}>
              Search <ArrowRight size={16} />
            </button>
          </form>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Popular:</span>
            {['FPSC 2026', 'CSS Exam', 'PPSC Sub-Inspector', 'SPSC Jobs'].map(t => (
              <Link key={t} href={`/jobs?q=${encodeURIComponent(t)}`} style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', padding: '5px 12px', borderRadius: 20, fontSize: 13, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)' }}>{t}</Link>
            ))}
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{ background: 'var(--dark-2)', padding: '28px 20px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          {[
            { label: 'Active Jobs', value: jobsLoading ? null : jobs.length.toLocaleString(), icon: <Briefcase size={18} color="#818CF8" /> },
            { label: 'MCQs in Bank', value: '50k+', icon: <BookOpen size={18} color="#4ADE80" /> },
            { label: 'Students', value: '8k+', icon: <Users size={18} color="#FCD34D" /> },
            { label: 'Pass Rate', value: '99%', icon: <TrendingUp size={18} color="#F87171" /> },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '16px 20px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
                {s.icon}
                {s.value === null
                  ? <Spinner size={16} thickness={2} color="white" />
                  : <span style={{ fontSize: 26, fontWeight: 800, color: 'white', fontFamily: 'Sora, sans-serif' }}>{s.value}</span>
                }
              </div>
              <p style={{ fontSize: 12, color: '#64748B' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 20px' }}>

        {/* Latest Jobs */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 26, fontWeight: 700, color: 'var(--dark)', marginBottom: 4 }}>Latest Job Alerts</h2>
              <p style={{ fontSize: 14, color: 'var(--muted)' }}>Updated daily from official commission websites</p>
            </div>
            <Link href="/jobs" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--primary)', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>View all <ChevronRight size={16} /></Link>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
            {filters.map(f => (
              <button key={f} onClick={() => setActiveFilter(f)} style={{ padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'DM Sans, sans-serif', background: activeFilter === f ? 'var(--primary)' : 'var(--white)', color: activeFilter === f ? 'white' : 'var(--muted)', border: activeFilter === f ? 'none' : '1.5px solid var(--border)', transition: 'all 0.15s ease' }}>{f}</button>
            ))}
          </div>
          {jobsLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '50px 20px', background: 'var(--white)', borderRadius: 14, border: '1.5px solid var(--border)' }}>
              <Spinner size={28} />
              <p style={{ fontSize: 14, color: 'var(--muted)' }}>Loading latest jobs...</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18 }}>
              {jobs.filter(j => activeFilter === 'All' || j.commission === activeFilter).slice(0, 6).map(job => <JobCard key={job.id} job={job} />)}
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link href="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--primary-light)', color: 'var(--primary)', padding: '13px 32px', borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>
              Browse all {jobsLoading ? '' : jobs.length.toLocaleString()} jobs <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* How it works */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: 'var(--dark)', marginBottom: 8 }}>How PrepHub PK Works</h2>
            <p style={{ fontSize: 15, color: 'var(--muted)' }}>From job alert to exam ready, all in one place</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {[
              { step: '01', title: 'Job Posted', desc: 'We post FPSC, PPSC, SPSC, NTS, NPF jobs daily from official sources', icon: <Bell size={22} color="var(--primary)" />, bg: 'var(--primary-light)' },
              { step: '02', title: 'Prep Material', desc: 'Notes auto-generated for that exact job\'s syllabus subjects', icon: <BookOpen size={22} color="#16A34A" />, bg: '#DCFCE7' },
              { step: '03', title: 'Practice MCQs', desc: 'Subject-wise MCQ bank matched to required exam subjects', icon: <FileText size={22} color="#7C3AED" />, bg: '#FAF5FF' },
              { step: '04', title: 'Mock Test', desc: 'Full timed test in exact exam pattern, results saved to profile', icon: <BarChart2 size={22} color="#F59E0B" />, bg: '#FFFBEB' },
            ].map((item, i) => (
              <div key={i} style={{ background: 'var(--white)', borderRadius: 14, padding: 24, border: '1.5px solid var(--border)', position: 'relative' }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>{item.icon}</div>
                <div style={{ position: 'absolute', top: 16, right: 18, fontSize: 34, fontWeight: 800, color: 'var(--border)', fontFamily: 'Sora, sans-serif' }}>{item.step}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--dark)', marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Subjects */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: 26, fontWeight: 700, color: 'var(--dark)', marginBottom: 4 }}>Practice by Subject</h2>
              <p style={{ fontSize: 14, color: 'var(--muted)' }}>
                {subjectsLoading ? 'Loading subjects from our MCQ bank...' : `${subjects.reduce((sum, s) => sum + s.mcqCount, 0).toLocaleString()}+ MCQs covering all exam subjects`}
              </p>
            </div>
            <Link href="/mcqs" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--primary)', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>View all <ChevronRight size={16} /></Link>
          </div>
          {subjectsLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '50px 20px', background: 'var(--white)', borderRadius: 14, border: '1.5px solid var(--border)' }}>
              <Spinner size={28} />
              <p style={{ fontSize: 14, color: 'var(--muted)' }}>Loading subjects...</p>
            </div>
          ) : subjects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--white)', borderRadius: 14, border: '1.5px solid var(--border)' }}>
              <p style={{ fontSize: 14, color: 'var(--muted)' }}>No subjects available yet. Check back soon.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 14 }}>
              {subjects.slice(0, 8).map(subject => (
                <Link key={subject.subject} href={`/subjects/${encodeURIComponent(subject.subject)}/quiz`} style={{ textDecoration: 'none' }}>
                  <div className="card-hover" style={{ background: 'var(--white)', borderRadius: 12, padding: '18px 14px', border: '1.5px solid var(--border)', textAlign: 'center' }}>
                    <div style={{ fontSize: 28, marginBottom: 10 }}>{iconForSubject(subject.subject)}</div>
                    <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--dark)', marginBottom: 4 }}>{subject.subject}</h4>
                    <p style={{ fontSize: 12, color: 'var(--muted)' }}>{subject.mcqCount.toLocaleString()} MCQs</p>
                    <div style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--primary)', fontSize: 12, fontWeight: 600 }}>Practice <ChevronRight size={12} /></div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* CTA + Results */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 64 }} className="resp-2col">
          {user ? (
            <div style={{ background: 'linear-gradient(135deg, #1B4FD8, #6366F1)', borderRadius: 16, padding: 32, color: 'white' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>👋</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10, fontFamily: 'Sora, sans-serif' }}>
                Welcome back, {user.first_name || user.name?.split(' ')[0] || 'there'}!
              </h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 20, lineHeight: 1.7 }}>
                Ready to sharpen your prep? Jump back into practice or see how far you&apos;ve come.
              </p>
              <ul style={{ marginBottom: 24, listStyle: 'none', padding: 0 }}>
                {['Pick up a mock test', 'See your weak areas', 'Track your score history'].map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'rgba(255,255,255,0.9)', marginBottom: 8 }}>
                    <Sparkles size={15} color="#FCD34D" /> {f}
                  </li>
                ))}
              </ul>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link href="/mock-test" style={{ background: 'white', color: 'var(--primary)', padding: '12px 24px', borderRadius: 10, fontSize: 15, fontWeight: 700, fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                  Take a mock test <ArrowRight size={16} />
                </Link>
                <Link href="/profile" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '12px 24px', borderRadius: 10, fontSize: 15, fontWeight: 700, fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)' }}>
                  View my progress
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ background: 'linear-gradient(135deg, #1B4FD8, #6366F1)', borderRadius: 16, padding: 32, color: 'white' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🎯</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10, fontFamily: 'Sora, sans-serif' }}>Create a Free Account</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 20, lineHeight: 1.7 }}>Save results, track progress, and get notified about new jobs.</p>
              <ul style={{ marginBottom: 24, listStyle: 'none', padding: 0 }}>
                {['Save all test results', 'Weak area analysis', 'Job alert notifications', 'Free forever'].map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'rgba(255,255,255,0.9)', marginBottom: 8 }}>
                    <CheckCircle size={15} color="#4ADE80" /> {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => setAuthOpen(true)} style={{ background: 'white', color: 'var(--primary)', padding: '12px 24px', borderRadius: 10, border: 'none', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: 8 }}>
                Sign up free <ArrowRight size={16} />
              </button>
            </div>
          )}
          <div style={{ background: 'var(--white)', borderRadius: 16, padding: 28, border: '1.5px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <Star size={18} color="#F59E0B" fill="#F59E0B" />
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--dark)' }}>Recent Mock Test Results</h3>
            </div>
            {resultsLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '24px 0' }}>
                <Spinner size={22} />
                <p style={{ fontSize: 13, color: 'var(--muted)' }}>Loading recent results...</p>
              </div>
            ) : recentResults.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--muted)', padding: '12px 0' }}>No mock tests taken yet, be the first!</p>
            ) : (
              recentResults.map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: i < recentResults.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: `hsl(${i * 70 + 180}, 55%, 88%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: `hsl(${i * 70 + 180}, 55%, 30%)` }}>{r.name.charAt(0)}</div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--dark)' }}>{r.name}</p>
                      <p style={{ fontSize: 12, color: 'var(--muted)' }}>{r.exam}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ background: r.score >= 80 ? 'var(--success-light)' : 'var(--primary-light)', color: r.score >= 80 ? 'var(--success)' : 'var(--primary)', padding: '3px 10px', borderRadius: 6, fontSize: 14, fontWeight: 700 }}>{r.score}%</div>
                    <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{timeAgo(r.takenAt)}</p>
                  </div>
                </div>
              ))
            )}
            <Link href="/mock-test" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16, color: 'var(--primary)', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
              Take a mock test <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>

      <Footer />
      <style>{`@media(max-width:640px){.resp-2col{grid-template-columns:1fr !important;}}`}</style>
    </>
  );
}
