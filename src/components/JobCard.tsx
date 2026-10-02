'use client';
import Link from 'next/link';
import { Calendar, MapPin, Users, BookOpen, ChevronRight, Clock } from 'lucide-react';
import { jobHref } from '@/lib/api';

interface Job {
  id: number;
  slug: string;
  title: string;
  department: string;
  commission: string;
  grade: string;
  seats: number;
  lastDate: string;
  location: string;
  subjects: string[];
  mcqCount: number;
  prepReady: boolean;
  featured?: boolean;
}

export default function JobCard({ job }: { job: Job }) {
  const daysLeft = Math.ceil((new Date(job.lastDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isUrgent = daysLeft <= 7;
  const tagClass = `tag-${job.commission.toLowerCase()}`;

  return (
    <Link href={jobHref(job)} style={{ textDecoration: 'none' }}>
      <div className="card-hover" style={{
        background: 'var(--white)',
        borderRadius: 14,
        padding: 20,
        border: `1.5px solid ${job.featured ? 'rgba(27,79,216,0.2)' : 'var(--border)'}`,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {job.featured && (
          <div style={{
            position: 'absolute', top: 0, right: 0,
            background: 'linear-gradient(135deg, #1B4FD8, #6366F1)',
            color: 'white', fontSize: 10, fontWeight: 600,
            padding: '4px 12px', borderBottomLeftRadius: 10,
            letterSpacing: '0.5px',
          }}>FEATURED</div>
        )}

        {/* Top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div style={{ flex: 1, paddingRight: 40 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--dark)', marginBottom: 4 }}>{job.title}</h3>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.4 }}>{job.department}</p>
          </div>
          <span className={`badge ${tagClass}`}>{job.commission}</span>
        </div>

        {/* Meta row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--muted)' }}>
            <MapPin size={13} /> {job.location}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--muted)' }}>
            <Users size={13} /> {job.seats} seats
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--muted)' }}>
            <BookOpen size={13} /> {job.grade}
          </span>
        </div>

        {/* Subjects */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
          {job.subjects.slice(0, 3).map(s => (
            <span key={s} style={{
              background: 'var(--bg)', color: 'var(--muted)',
              padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500,
            }}>{s}</span>
          ))}
          {job.subjects.length > 3 && (
            <span style={{
              background: 'var(--bg)', color: 'var(--muted)',
              padding: '3px 10px', borderRadius: 6, fontSize: 12,
            }}>+{job.subjects.length - 3}</span>
          )}
        </div>

        {/* Bottom row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Clock size={13} color={isUrgent ? '#E11D48' : 'var(--muted)'} />
            <span style={{ fontSize: 13, color: isUrgent ? '#E11D48' : 'var(--muted)', fontWeight: isUrgent ? 600 : 400 }}>
              {daysLeft > 0 ? `${daysLeft} days left` : 'Closed'}
            </span>
            {job.prepReady && (
              <span style={{
                background: 'var(--success-light)', color: 'var(--success)',
                padding: '2px 8px', borderRadius: 5, fontSize: 11, fontWeight: 600, marginLeft: 8,
              }}>Prep Ready</span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--primary)', fontSize: 13, fontWeight: 600 }}>
            Start Prep <ChevronRight size={15} />
          </div>
        </div>
      </div>
    </Link>
  );
}
