import Link from 'next/link';
import { Award } from 'lucide-react';


export default function Footer() {
  return (
    <footer style={{ background: 'var(--dark)', color: 'white', marginTop: 80 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '60px 20px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 9,
                background: 'linear-gradient(135deg, #1B4FD8, #6366F1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Award size={18} color="white" />
              </div>
              <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 18 }}>
                Prep<span style={{ color: '#6366F1' }}>Hub</span> PK
              </span>
            </div>
            <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.7, marginBottom: 20 }}>
              Pakistan's #1 platform for government job preparation. Find jobs, study material, and take mock tests, all in one place.
            </p>
            {/* Social links temporarily hidden until real accounts are ready. */}
          </div>

          {/* Jobs by Commission */}
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: 'white' }}>Jobs by Commission</h4>
            {['FPSC Jobs', 'PPSC Jobs', 'SPSC Jobs', 'NTS Jobs', 'CSS Exam', 'KPPSC Jobs', 'BPSC Jobs', 'NPF Jobs'].map(item => (
              <Link key={item} href="/jobs" style={{
                display: 'block', fontSize: 14, color: '#94A3B8', textDecoration: 'none',
                marginBottom: 10, transition: 'color 0.1s ease',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Preparation */}
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: 'white' }}>Preparation</h4>
            {['MCQ Practice', 'Mock Tests', 'Subject Notes', 'Current Affairs', 'English MCQs', 'Pakistan Studies'].map(item => (
              <Link key={item} href="/mcqs" style={{
                display: 'block', fontSize: 14, color: '#94A3B8', textDecoration: 'none',
                marginBottom: 10, transition: 'color 0.1s ease',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Company */}
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: 'white' }}>Company</h4>
            {[
              { label: 'About Us', href: '/about' },
              { label: 'Contact Us', href: '/contact' },
              { label: 'Privacy Policy', href: '/privacy-policy' },
              { label: 'Terms of Service', href: '/terms-of-service' },
              { label: 'Disclaimer', href: '/disclaimer' },
              { label: 'Advertise with Us', href: '/advertise' },
            ].map(item => (
              <Link key={item.label} href={item.href} style={{
                display: 'block', fontSize: 14, color: '#94A3B8', textDecoration: 'none',
                marginBottom: 10, transition: 'color 0.1s ease',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 28, display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 13, color: '#64748B' }}>
            © 2026 PrepHub PK. All rights reserved. Job advertisements sourced from official commission websites.
          </p>
        </div>
      </div>
    </footer>
  );
}
