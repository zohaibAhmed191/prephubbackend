'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import { Spinner } from '@/components/Spinner';
import { api, Job } from '@/lib/api';
import { CheckCircle, AlertTriangle, ChevronRight, Target } from 'lucide-react';

const BATCH_SIZE = 20;

export default function MockTestPage() {
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<number | null>(null);
  const [starting, setStarting] = useState(false);

  // Real, prep-ready jobs from the database, not a static list, so this
  // always reflects whatever jobs actually have an MCQ bank behind them.
  useEffect(() => {
    let cancelled = false;
    api.getJobs()
      .then(res => {
        if (!cancelled) setJobs(res.jobs.filter(j => j.prepReady && j.mcqCount > 0));
      })
      .catch(() => {
        if (!cancelled) setJobs([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const selected = jobs.find(j => j.id === selectedJob) || null;
  const questionCount = selected ? Math.min(selected.mcqCount, BATCH_SIZE) : BATCH_SIZE;
  const totalMinutes = questionCount;

  const handleStart = () => {
    if (!selected || starting) return;
    setStarting(true);
    // The actual timed test, MCQs, scoring, and profile save all live on the
    // job's own quiz page, this page is just a real-job picker in front of it.
    router.push(`/jobs/${selected.slug}/quiz`);
  };

  return (
    <>
      <Navbar onLoginOpen={() => setAuthOpen(true)} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      <div style={{ background: 'var(--dark)', padding: '44px 20px 52px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎯</div>
          <h1 style={{ fontSize: 34, fontWeight: 800, color: 'white', marginBottom: 10, fontFamily: 'Sora, sans-serif' }}>Mock Tests</h1>
          <p style={{ fontSize: 15, color: '#94A3B8' }}>Timed exam-pattern tests with instant results and analysis</p>
        </div>
      </div>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--dark)', marginBottom: 20 }}>Select an exam to prepare for</h2>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '50px 20px', background: 'var(--white)', borderRadius: 14, border: '1.5px solid var(--border)', marginBottom: 36 }}>
            <Spinner size={28} />
            <p style={{ fontSize: 14, color: 'var(--muted)' }}>Loading available jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', background: 'var(--white)', borderRadius: 14, border: '1.5px solid var(--border)', marginBottom: 36 }}>
            <Target size={28} color="var(--muted-light)" style={{ marginBottom: 12 }} />
            <p style={{ fontSize: 15, color: 'var(--muted)' }}>No jobs with an MCQ bank are ready for mock tests yet. Check back soon.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginBottom: 36 }}>
            {jobs.map(job => (
              <div key={job.id} onClick={() => setSelectedJob(job.id)} style={{
                background: selectedJob === job.id ? 'var(--primary-light)' : 'var(--white)',
                borderRadius: 14, padding: 20,
                border: `2px solid ${selectedJob === job.id ? 'var(--primary)' : 'var(--border)'}`,
                cursor: 'pointer', transition: 'all 0.15s ease',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span className={`badge tag-${job.commission.toLowerCase()}`}>{job.commission}</span>
                  {selectedJob === job.id && <CheckCircle size={18} color="var(--primary)" />}
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--dark)', marginBottom: 4 }}>{job.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>{job.department}</p>
                <div style={{ display: 'flex', gap: 12 }}>
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>📝 {job.mcqCount} MCQs</span>
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>📚 {job.subjects.length} subjects</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ background: 'var(--white)', borderRadius: 16, padding: 28, border: '1.5px solid var(--border)', marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--dark)', marginBottom: 20 }}>Test Configuration</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14 }}>
            {[
              { label: 'Total Questions', value: selected ? `${questionCount} MCQs` : `Up to ${BATCH_SIZE} MCQs` },
              { label: 'Time Allowed', value: `${totalMinutes} minutes` },
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
          <p style={{ fontSize: 14, color: '#92400E' }}>Once started, the timer cannot be paused. You&apos;ll need to log in first, results are saved to your profile automatically.</p>
        </div>

        <button onClick={handleStart} disabled={!selected || starting} style={{
          background: selected ? 'var(--primary)' : 'var(--border)', color: 'white', padding: '14px 32px',
          borderRadius: 12, border: 'none', fontSize: 16, fontWeight: 700,
          cursor: selected ? 'pointer' : 'not-allowed', fontFamily: 'DM Sans, sans-serif',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          {selected ? 'Start Mock Test' : 'Select a job above to continue'} <ChevronRight size={18} />
        </button>
      </div>
      <Footer />
    </>
  );
}
