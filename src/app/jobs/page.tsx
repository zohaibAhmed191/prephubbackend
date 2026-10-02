'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import JobCard from '@/components/JobCard';
import AuthModal from '@/components/AuthModal';
import { Spinner } from '@/components/Spinner';
import { api, Job } from '@/lib/api';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';

const commissions = ['All', 'FPSC', 'PPSC', 'SPSC', 'NTS', 'CSS', 'KPPSC', 'BPSC', 'NPF'];

function JobsContent() {
  const params = useSearchParams();
  const [authOpen, setAuthOpen] = useState(false);
  // Pre-filled from ?q= when arriving via the navbar/homepage search box.
  const [search, setSearch] = useState(() => params.get('q') || '');
  const [commission, setCommission] = useState('All');
  const [location, setLocation] = useState('All');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const locations = ['All', 'Federal', 'Punjab', 'Sindh', 'KPK', 'Balochistan', 'Gilgit Baltistan'];

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.getJobs()
      .then(res => {
        if (!cancelled) setJobs(res.jobs);
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
  }, []);

  const filtered = jobs.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) || j.department.toLowerCase().includes(search.toLowerCase());
    const matchComm = commission === 'All' || j.commission === commission;
    const matchLoc = location === 'All' || j.location === location;
    return matchSearch && matchComm && matchLoc;
  });

  return (
    <>
      <Navbar onLoginOpen={() => setAuthOpen(true)} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />

      {/* Page Header */}
      <div style={{ background: 'var(--dark)', padding: '40px 20px 50px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: 'white', marginBottom: 12, fontFamily: 'Sora, sans-serif' }}>Government Job Alerts</h1>
          <p style={{ fontSize: 16, color: '#94A3B8', marginBottom: 28 }}>1,250+ active jobs from FPSC, PPSC, SPSC, NTS and more, updated daily</p>
          <div style={{ background: 'white', borderRadius: 12, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12, maxWidth: 560, margin: '0 auto' }}>
            <Search size={18} color="var(--muted)" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by job title or department..." style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, fontFamily: 'DM Sans, sans-serif' }} />
            {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} color="var(--muted)" /></button>}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 20px' }}>
        <div style={{ display: 'flex', gap: 24 }} className="jobs-layout">
          {/* Sidebar Filters */}
          <div style={{ width: 240, flexShrink: 0 }} className="filters-sidebar">
            <div style={{ background: 'var(--white)', borderRadius: 14, padding: 20, border: '1.5px solid var(--border)', position: 'sticky', top: 80 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <SlidersHorizontal size={16} color="var(--primary)" />
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--dark)' }}>Filters</h3>
              </div>

              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 10, letterSpacing: '0.5px' }}>COMMISSION</p>
                {commissions.map(c => (
                  <button key={c} onClick={() => setCommission(c)} style={{
                    display: 'block', width: '100%', textAlign: 'left', padding: '9px 12px',
                    borderRadius: 8, border: 'none', cursor: 'pointer',
                    fontSize: 14, fontFamily: 'DM Sans, sans-serif', marginBottom: 4,
                    background: commission === c ? 'var(--primary-light)' : 'transparent',
                    color: commission === c ? 'var(--primary)' : 'var(--dark)',
                    fontWeight: commission === c ? 600 : 400,
                    transition: 'all 0.1s ease',
                  }}>{c}</button>
                ))}
              </div>

              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 10, letterSpacing: '0.5px' }}>LOCATION</p>
                {locations.map(l => (
                  <button key={l} onClick={() => setLocation(l)} style={{
                    display: 'block', width: '100%', textAlign: 'left', padding: '9px 12px',
                    borderRadius: 8, border: 'none', cursor: 'pointer',
                    fontSize: 14, fontFamily: 'DM Sans, sans-serif', marginBottom: 4,
                    background: location === l ? 'var(--primary-light)' : 'transparent',
                    color: location === l ? 'var(--primary)' : 'var(--dark)',
                    fontWeight: location === l ? 600 : 400,
                    transition: 'all 0.1s ease',
                  }}>{l}</button>
                ))}
              </div>

              {(commission !== 'All' || location !== 'All') && (
                <button onClick={() => { setCommission('All'); setLocation('All'); }} style={{
                  width: '100%', marginTop: 16, padding: '9px', borderRadius: 8,
                  border: '1px solid var(--border)', background: 'var(--bg)',
                  color: 'var(--muted)', fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                }}>Clear filters</button>
              )}
            </div>
          </div>

          {/* Jobs List */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <p style={{ fontSize: 14, color: 'var(--muted)' }}>
                Showing <strong style={{ color: 'var(--dark)' }}>{filtered.length}</strong> jobs
                {commission !== 'All' && ` for ${commission}`}
              </p>
              <button onClick={() => setFiltersOpen(true)} className="mobile-filter-btn" style={{
                display: 'none', alignItems: 'center', gap: 6, padding: '8px 14px',
                borderRadius: 8, border: '1.5px solid var(--border)', background: 'white',
                fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
              }}>
                <Filter size={14} /> Filters
              </button>
            </div>

            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center', padding: '60px 20px', background: 'var(--white)', borderRadius: 14, border: '1.5px solid var(--border)' }}>
                <Spinner size={28} />
                <p style={{ fontSize: 14, color: 'var(--muted)' }}>Loading jobs...</p>
              </div>
            ) : loadError ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--white)', borderRadius: 14, border: '1.5px solid var(--border)' }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--dark)', marginBottom: 8 }}>Could not load jobs</h3>
                <p style={{ fontSize: 14, color: 'var(--muted)' }}>Please try again in a moment.</p>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--white)', borderRadius: 14, border: '1.5px solid var(--border)' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--dark)', marginBottom: 8 }}>No jobs found</h3>
                <p style={{ fontSize: 14, color: 'var(--muted)' }}>Try adjusting your search or filters</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 16 }}>
                {filtered.map(job => <JobCard key={job.id} job={job} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
      <style>{`
        @media(max-width:768px){
          .jobs-layout{flex-direction:column !important;}
          .filters-sidebar{width:100% !important;}
          .mobile-filter-btn{display:flex !important;}
        }
      `}</style>
    </>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={null}>
      <JobsContent />
    </Suspense>
  );
}
