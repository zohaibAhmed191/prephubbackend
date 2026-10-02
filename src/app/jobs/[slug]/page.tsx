'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import PageLoader from '@/components/Spinner';
import toast from 'react-hot-toast';
import { sampleMCQs } from '@/lib/data';
import { api, Job, Material } from '@/lib/api';
import {
  ArrowLeft, MapPin, Users, Calendar, Clock, BookOpen,
  FileText, BarChart2, ChevronRight, CheckCircle, ExternalLink,
  Bookmark, Share2, AlertCircle
} from 'lucide-react';

export default function JobDetailPage() {
  const params = useParams();
  // URL is /jobs/{slug} (e.g. /jobs/assistant-director-fpsc). The slug is a
  // real, unique, admin-editable database column, the backend looks the job
  // up by it directly, no numeric id involved.
  const slug = String(params?.slug ?? '');

  const [authOpen, setAuthOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'prep' | 'mcqs'>('overview');
  const [bookmarked, setBookmarked] = useState(false);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    api.getJob(slug)
      .then(res => {
        if (!cancelled) setJob(res.job);
      })
      .catch(() => {
        if (!cancelled) setJob(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard');
    } catch {
      toast.error('Could not copy the link. Please copy it manually from the address bar.');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar onLoginOpen={() => setAuthOpen(true)} />
        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
        <PageLoader label="Loading job details..." />
        <Footer />
      </>
    );
  }

  if (!job) {
    return (
      <>
        <Navbar onLoginOpen={() => setAuthOpen(true)} />
        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
        <div style={{ maxWidth: 600, margin: '80px auto', textAlign: 'center', padding: '0 20px' }}>
          <div style={{ fontSize: 64, marginBottom: 16, fontFamily: 'Sora, sans-serif', fontWeight: 800, color: 'var(--dark)' }}>404</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--dark)', marginBottom: 8 }}>Job not found</h1>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>This job may have been removed or the link is incorrect.</p>
          <Link href="/jobs" style={{ background: 'var(--primary)', color: 'white', padding: '12px 24px', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 14, display: 'inline-block' }}>
            Browse all jobs
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const daysLeft = Math.ceil((new Date(job.lastDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isUrgent = daysLeft <= 7;
  const tagClass = `tag-${job.commission.toLowerCase()}`;
  const relatedMCQs = job.mcqs && job.mcqs.length > 0 ? job.mcqs.slice(0, 4) : sampleMCQs.slice(0, 4);

  const tabs = [
    { key: 'overview', label: 'Job Details', icon: <FileText size={15} /> },
    { key: 'prep', label: 'Prep Material', icon: <BookOpen size={15} /> },
    { key: 'mcqs', label: `MCQs (${job.mcqCount})`, icon: <BarChart2 size={15} /> },
  ];

  return (
    <>
      <Navbar onLoginOpen={() => setAuthOpen(true)} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />

      {/* Breadcrumb */}
      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)', padding: '12px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href="/" style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'none' }}>Home</Link>
          <ChevronRight size={13} color="var(--muted-light)" />
          <Link href="/jobs" style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'none' }}>Jobs</Link>
          <ChevronRight size={13} color="var(--muted-light)" />
          <span style={{ fontSize: 13, color: 'var(--dark)', fontWeight: 500 }}>{job.title}</span>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0F172A, #1E3A8A)', padding: '36px 20px 44px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Link href="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.6)', fontSize: 13, textDecoration: 'none', marginBottom: 20 }}>
            <ArrowLeft size={14} /> Back to jobs
          </Link>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
                <span className={`badge ${tagClass}`}>{job.commission}</span>
                {job.featured && (
                  <span style={{ background: 'rgba(99,102,241,0.3)', color: '#A5B4FC', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>Featured</span>
                )}
                {job.prepReady && (
                  <span style={{ background: 'rgba(22,163,74,0.2)', color: '#4ADE80', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>✓ Prep Ready</span>
                )}
              </div>
              <h1 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 800, color: 'white', marginBottom: 8, fontFamily: 'Sora, sans-serif' }}>{job.title}</h1>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', marginBottom: 18 }}>{job.department}</p>
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                {[
                  { icon: <MapPin size={14} />, text: job.location },
                  { icon: <Users size={14} />, text: `${job.seats} seats` },
                  { icon: <BookOpen size={14} />, text: job.grade },
                  { icon: <Calendar size={14} />, text: `Last date: ${job.lastDate}` },
                ].map((m, i) => (
                  <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>
                    {m.icon} {m.text}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
              <div style={{
                background: isUrgent ? 'rgba(225,29,72,0.15)' : 'rgba(255,255,255,0.1)',
                border: `1px solid ${isUrgent ? 'rgba(225,29,72,0.3)' : 'rgba(255,255,255,0.15)'}`,
                borderRadius: 10, padding: '10px 16px', textAlign: 'center',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <Clock size={14} color={isUrgent ? '#F87171' : 'rgba(255,255,255,0.6)'} />
                  <span style={{ fontSize: 12, color: isUrgent ? '#F87171' : 'rgba(255,255,255,0.6)' }}>Time remaining</span>
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: isUrgent ? '#F87171' : 'white', fontFamily: 'Sora, sans-serif' }}>
                  {daysLeft > 0 ? `${daysLeft} days` : 'Closed'}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setBookmarked(!bookmarked)} style={{
                  width: 38, height: 38, borderRadius: 9,
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: bookmarked ? 'rgba(27,79,216,0.4)' : 'rgba(255,255,255,0.1)',
                  color: 'white', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Bookmark size={16} fill={bookmarked ? 'white' : 'none'} />
                </button>
                <button onClick={handleShare} style={{
                  width: 38, height: 38, borderRadius: 9,
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Share2 size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 20px 60px', display: 'flex', gap: 24, alignItems: 'flex-start' }} className="detail-layout">

        {/* Main */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ background: 'var(--white)', borderRadius: 14, border: '1.5px solid var(--border)', overflow: 'hidden', marginBottom: 20 }}>
            {/* Tabs: equal-width and shrinkable so all three always fit,
                narrow screens just get tighter padding/font instead of a
                tab getting clipped or needing a scroll gesture to find. */}
            <div className="job-tabs" style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
              {tabs.map(t => (
                <button key={t.key} className="job-tab-btn" onClick={() => setActiveTab(t.key as typeof activeTab)} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '14px 12px',
                  border: 'none', cursor: 'pointer', flex: '1 1 0', minWidth: 0,
                  fontSize: 14, fontWeight: 600, fontFamily: 'DM Sans, sans-serif',
                  background: activeTab === t.key ? 'var(--primary-light)' : 'transparent',
                  color: activeTab === t.key ? 'var(--primary)' : 'var(--muted)',
                  borderBottom: activeTab === t.key ? '2px solid var(--primary)' : '2px solid transparent',
                  transition: 'all 0.15s',
                }}>
                  {t.icon} <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.label}</span>
                </button>
              ))}
            </div>

            <div style={{ padding: 24 }}>

              {/* OVERVIEW */}
              {activeTab === 'overview' && (
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--dark)', marginBottom: 12 }}>About this Position</h3>
                  <div className="rich-content" style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 20 }} dangerouslySetInnerHTML={{ __html: job.description }} />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }} className="resp-2col">
                    {[
                      { label: 'Age Limit', value: job.age },
                      { label: 'Grade / Scale', value: job.grade },
                      { label: 'Total Seats', value: `${job.seats} posts` },
                      { label: 'Last Date', value: job.lastDate },
                      { label: 'Commission', value: job.commission },
                    ].map((item, i) => (
                      <div key={i} style={{ background: 'var(--bg)', borderRadius: 10, padding: '14px 16px' }}>
                        <p style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{item.label}</p>
                        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--dark)' }}>{item.value}</p>
                      </div>
                    ))}
                  </div>

                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--dark)', marginBottom: 12 }}>Requirements</h3>
                  <div className="rich-content" style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 20 }} dangerouslySetInnerHTML={{ __html: job.requirements }} />

                  {job.quota && job.quota.length > 0 && (
                    <>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--dark)', marginBottom: 12 }}>Regional / Provincial Quota</h3>
                      <div style={{ overflowX: 'auto', marginBottom: 20, border: '1.5px solid var(--border)', borderRadius: 10 }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                          <thead>
                            <tr style={{ background: 'var(--bg)' }}>
                              <th style={{ textAlign: 'left', padding: '10px 14px', fontWeight: 700, color: 'var(--dark)', borderBottom: '1.5px solid var(--border)' }}>Quota</th>
                              <th style={{ textAlign: 'left', padding: '10px 14px', fontWeight: 700, color: 'var(--dark)', borderBottom: '1.5px solid var(--border)' }}>General</th>
                              <th style={{ textAlign: 'left', padding: '10px 14px', fontWeight: 700, color: 'var(--dark)', borderBottom: '1.5px solid var(--border)' }}>Women</th>
                              <th style={{ textAlign: 'left', padding: '10px 14px', fontWeight: 700, color: 'var(--dark)', borderBottom: '1.5px solid var(--border)' }}>Minorities</th>
                            </tr>
                          </thead>
                          <tbody>
                            {job.quota.map((row, i) => (
                              <tr key={i} style={{ borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
                                <td style={{ padding: '9px 14px', fontWeight: 600, color: 'var(--dark)' }}>{row.quota}</td>
                                <td style={{ padding: '9px 14px', color: 'var(--muted)' }}>{row.general || '-'}</td>
                                <td style={{ padding: '9px 14px', color: 'var(--muted)' }}>{row.women || '-'}</td>
                                <td style={{ padding: '9px 14px', color: 'var(--muted)' }}>{row.minorities || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}

                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--dark)', marginBottom: 12 }}>Exam Subjects</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                    {job.subjects.map(s => (
                      <span key={s} style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>{s}</span>
                    ))}
                  </div>

                  <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <AlertCircle size={16} color="#0284C7" />
                    <p style={{ fontSize: 13, color: '#0369A1' }}>
                      Source: <strong>{job.commission}</strong>, original advertisement from{' '}
                      <a href={job.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#0284C7', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        {job.sourceUrl} <ExternalLink size={11} />
                      </a>
                    </p>
                  </div>
                </div>
              )}

              {/* PREP MATERIAL */}
              {activeTab === 'prep' && (
                <div>
                  <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 20 }}>
                    Preparation material for the <strong style={{ color: 'var(--dark)' }}>{job.title}</strong> exam syllabus.
                  </p>
                  {job.subjects.map((subject, i) => {
                    const subjectMaterials = (job.materials || []).filter(m => m.subject === subject);
                    const hasAny = subjectMaterials.length > 0;
                    const types: { key: Material['type']; label: string }[] = [
                      { key: 'topic_notes', label: 'Topic Notes' },
                      { key: 'key_points', label: 'Key Points' },
                      { key: 'past_questions', label: 'Past Questions' },
                    ];

                    return (
                      <div key={i} style={{ background: 'var(--bg)', borderRadius: 12, padding: 18, marginBottom: 12, border: '1.5px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                          <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--dark)' }}>{subject}</h4>
                          <span style={{
                            background: hasAny ? 'var(--success-light)' : 'var(--border)',
                            color: hasAny ? 'var(--success)' : 'var(--muted)',
                            padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                          }}>{hasAny ? 'Ready' : 'Coming Soon'}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {types.map(({ key, label }) => {
                            const material = subjectMaterials.find(m => m.type === key);
                            if (!material) {
                              return (
                                <div key={key} style={{
                                  display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px',
                                  borderRadius: 8, border: '1.5px dashed var(--border)',
                                  fontSize: 13, color: 'var(--muted-light)', fontFamily: 'DM Sans, sans-serif',
                                }}>
                                  <BookOpen size={13} /> {label} <span style={{ marginLeft: 4 }}>(not added yet)</span>
                                </div>
                              );
                            }
                            return (
                              <div key={key} style={{ padding: '12px 14px', borderRadius: 8, border: '1.5px solid var(--border)', background: 'var(--white)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: material.content ? 8 : 0 }}>
                                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--dark)' }}>
                                    <BookOpen size={13} color="var(--primary)" /> {label}{material.title ? `: ${material.title}` : ''}
                                  </span>
                                  {material.fileUrl && (
                                    <a href={material.fileUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary)', textDecoration: 'none' }}>
                                      Download {material.fileName ? `(${material.fileName})` : ''}
                                    </a>
                                  )}
                                </div>
                                {material.content && (
                                  <div className="rich-content" style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: material.content }} />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                  <button onClick={() => setAuthOpen(true)} style={{
                    width: '100%', marginTop: 8, padding: '13px', borderRadius: 10,
                    background: 'var(--primary)', border: 'none', color: 'white',
                    fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                  }}>
                    Sign up to access full prep material
                  </button>
                </div>
              )}

              {/* MCQs */}
              {activeTab === 'mcqs' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                    <p style={{ fontSize: 14, color: 'var(--muted)' }}>Sample MCQs for this exam</p>
                    <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '4px 12px', borderRadius: 6, fontSize: 13, fontWeight: 700 }}>{job.mcqCount} total</span>
                  </div>
                  {relatedMCQs.map((q, idx) => (
                    <div key={q.id} style={{ background: 'var(--bg)', borderRadius: 12, padding: 18, marginBottom: 12, border: '1.5px solid var(--border)' }}>
                      <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                        <span style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--primary-light)', color: 'var(--primary)', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{idx + 1}</span>
                        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--dark)', lineHeight: 1.5 }}>{q.question}</p>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, paddingLeft: 34 }}>
                        {q.options.map((opt, i) => (
                          <div key={i} style={{
                            padding: '8px 12px', borderRadius: 8,
                            background: i === q.correct ? '#DCFCE7' : 'var(--white)',
                            border: `1.5px solid ${i === q.correct ? '#86EFAC' : 'var(--border)'}`,
                            fontSize: 13,
                            color: i === q.correct ? '#15803D' : 'var(--dark)',
                            fontWeight: i === q.correct ? 600 : 400,
                            display: 'flex', alignItems: 'center', gap: 6,
                          }}>
                            {i === q.correct && <CheckCircle size={13} color="#16A34A" />}
                            <span style={{ fontSize: 11, fontWeight: 700, color: i === q.correct ? '#16A34A' : 'var(--muted-light)' }}>{['A','B','C','D'][i]}.</span>
                            {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <Link href={`/jobs/${job.slug}/quiz`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8, padding: '13px', borderRadius: 10, background: 'var(--primary)', color: 'white', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
                    Practice all {job.mcqCount} MCQs <ChevronRight size={16} />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ width: 280, flexShrink: 0 }} className="detail-sidebar">
          <div style={{ background: 'linear-gradient(135deg, #1B4FD8, #6366F1)', borderRadius: 14, padding: 20, marginBottom: 16, color: 'white' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, fontFamily: 'Sora, sans-serif' }}>Start Preparing Now</h3>
            <p style={{ fontSize: 13, opacity: 0.85, marginBottom: 16, lineHeight: 1.5 }}>Take a full mock test for this exact exam and track your progress.</p>
            <Link href={`/jobs/${job.slug}/quiz`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'white', color: 'var(--primary)', padding: '11px', borderRadius: 9, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
              Take Mock Test <ChevronRight size={15} />
            </Link>
          </div>

          <div style={{ background: 'var(--white)', borderRadius: 14, padding: 18, border: '1.5px solid var(--border)', marginBottom: 16 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--dark)', marginBottom: 14 }}>Quick Facts</h4>
            {[
              { label: 'MCQs available', value: `${job.mcqCount}+` },
              { label: 'Subjects', value: job.subjects.length },
              { label: 'Grade', value: job.grade },
              { label: 'Total seats', value: job.seats },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>{s.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--dark)' }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
      <style>{`
        @media(max-width:768px){
          .detail-layout { flex-direction: column !important; }
          .detail-sidebar { width: 100% !important; }
          .resp-2col { grid-template-columns: 1fr !important; }
        }
        @media(max-width:420px){
          .job-tab-btn { padding: 12px 6px !important; font-size: 12px !important; gap: 4px !important; }
        }
        .rich-content p { margin: 0 0 12px; }
        .rich-content p:last-child { margin-bottom: 0; }
        .rich-content ul, .rich-content ol { margin: 0 0 12px; padding-left: 22px; }
        .rich-content li { margin-bottom: 4px; }
        .rich-content a { color: var(--primary); }
      `}</style>
    </>
  );
}