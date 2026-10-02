'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, User, ChevronDown, BookOpen, Briefcase, BarChart2, LogOut, Award } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface NavbarProps {
  onLoginOpen?: () => void;
}

export default function Navbar({ onLoginOpen }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const router = useRouter();
  const isLoggedIn = !!user;

  const displayName = user?.first_name || user?.name?.split(' ')[0] || 'Account';
  const initials = user
    ? (((user.first_name?.[0] || user.name?.[0] || '') + (user.last_name?.[0] || '')).toUpperCase() || 'U')
    : '';

  const handleLogout = async () => {
    setProfileOpen(false);
    await logout();
    router.push('/');
  };

  const submitSearch = (term?: string) => {
    const q = (term ?? searchQuery).trim();
    setSearchOpen(false);
    router.push(q ? `/jobs?q=${encodeURIComponent(q)}` : '/jobs');
  };

  const navLinks = [
    { label: 'Jobs', href: '/jobs', icon: <Briefcase size={16} /> },
    { label: 'MCQs', href: '/mcqs', icon: <BookOpen size={16} /> },
    { label: 'Mock Tests', href: '/mock-test', icon: <BarChart2 size={16} /> },
  ];

  return (
    <>
      <nav className="glass nav-sticky border-b" style={{ borderColor: 'var(--border)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
            
            {/* Logo */}
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: 'linear-gradient(135deg, #1B4FD8, #6366F1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Award size={20} color="white" />
              </div>
              <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 20, color: 'var(--dark)' }}>
                Prep<span style={{ color: 'var(--primary)' }}>Hub</span> PK
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hidden-mobile">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 14px', borderRadius: 8,
                  color: 'var(--muted)', textDecoration: 'none',
                  fontSize: 14, fontWeight: 500,
                  transition: 'all 0.15s ease',
                }}
                  onMouseEnter={e => {
                    (e.target as HTMLElement).style.color = 'var(--primary)';
                    (e.target as HTMLElement).style.background = 'var(--primary-light)';
                  }}
                  onMouseLeave={e => {
                    (e.target as HTMLElement).style.color = 'var(--muted)';
                    (e.target as HTMLElement).style.background = 'transparent';
                  }}
                >
                  {link.icon} {link.label}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Search button */}
              <button
                className="hidden-mobile"
                onClick={() => setSearchOpen(true)}
                style={{
                  width: 38, height: 38, borderRadius: 9, border: '1.5px solid var(--border)',
                  background: 'var(--white)', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: 'var(--muted)',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--primary)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                <Search size={17} />
              </button>

              {isLoggedIn ? (
                <>
                  {/* Profile dropdown */}
                  <div className="hidden-mobile" style={{ position: 'relative' }}>
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '6px 12px', borderRadius: 10,
                        border: '1.5px solid var(--border)', background: 'var(--white)',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #1B4FD8, #6366F1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <span style={{ color: 'white', fontSize: 12, fontWeight: 600 }}>{initials}</span>
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--dark)' }} className="hidden-mobile">{displayName}</span>
                      <ChevronDown size={14} color="var(--muted)" />
                    </button>

                    {profileOpen && (
                      <div style={{
                        position: 'absolute', top: '110%', right: 0, width: 200,
                        background: 'var(--white)', borderRadius: 12, padding: '8px 0',
                        boxShadow: '0 8px 30px rgba(15,23,42,0.12)',
                        border: '1px solid var(--border)',
                        animation: 'fadeInUp 0.15s ease',
                        zIndex: 200,
                      }}>
                        {[
                          { icon: <User size={15} />, label: 'My Profile', href: '/profile' },
                          { icon: <BarChart2 size={15} />, label: 'My Results', href: '/profile#results' },
                        ].map(item => (
                          <Link key={item.label} href={item.href} style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '10px 16px', color: 'var(--dark)',
                            textDecoration: 'none', fontSize: 14,
                            transition: 'background 0.1s ease',
                          }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                          >
                            <span style={{ color: 'var(--muted)' }}>{item.icon}</span>
                            {item.label}
                          </Link>
                        ))}
                        <div className="divider" style={{ margin: '6px 0' }} />
                        <button onClick={handleLogout} style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '10px 16px', color: '#E11D48',
                          background: 'transparent', border: 'none',
                          fontSize: 14, cursor: 'pointer', width: '100%',
                        }}>
                          <LogOut size={15} /> Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="hidden-mobile" style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={onLoginOpen}
                    style={{
                      padding: '8px 18px', borderRadius: 9,
                      border: '1.5px solid var(--border)', background: 'var(--white)',
                      fontSize: 14, fontWeight: 500, color: 'var(--dark)',
                      cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--primary)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                  >
                    Log in
                  </button>
                  <button
                    onClick={onLoginOpen}
                    style={{
                      padding: '8px 18px', borderRadius: 9,
                      background: 'var(--primary)', border: 'none',
                      fontSize: 14, fontWeight: 600, color: 'white',
                      cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--primary-dark)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'var(--primary)')}
                  >
                    Sign up free
                  </button>
                </div>
              )}

              {/* Mobile menu toggle: animated hamburger that morphs into an X */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                className="show-mobile hamburger-btn"
              >
                <span className={`hamburger-line${menuOpen ? ' open' : ''}`} />
                <span className={`hamburger-line${menuOpen ? ' open' : ''}`} />
                <span className={`hamburger-line${menuOpen ? ' open' : ''}`} />
              </button>
            </div>
          </div>

          {/* Mobile Menu: always in the DOM so it can animate open AND closed;
              height/opacity are transitioned rather than mount/unmount. */}
          <div className="mobile-menu-panel" style={{ maxHeight: menuOpen ? 640 : 0, opacity: menuOpen ? 1 : 0 }}>
            <div style={{ borderTop: '1px solid var(--border)', padding: '12px 0 16px' }}>
              {/* Identity header, mirrors the desktop profile trigger */}
              {isLoggedIn && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px', marginBottom: 10,
                  animation: menuOpen ? 'slideInRight 0.3s ease both' : 'none',
                  animationDelay: '0s',
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1B4FD8, #6366F1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <span style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>{initials}</span>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--dark)', margin: 0 }}>{user?.name || displayName}</p>
                    <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
                  </div>
                </div>
              )}

              {/* Search, moved here from the top bar on mobile */}
              <div style={{
                marginBottom: 12,
                animation: menuOpen ? 'slideInRight 0.3s ease both' : 'none',
                animationDelay: `${(isLoggedIn ? 1 : 0) * 0.05}s`,
              }}>
                <button onClick={() => { setSearchOpen(true); setMenuOpen(false); }} style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '11px', borderRadius: 9, border: '1.5px solid var(--border)',
                  background: 'white', fontSize: 14, fontWeight: 500, color: 'var(--dark)',
                  cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                }}>
                  <Search size={16} /> Search
                </button>
              </div>

              {navLinks.map((link, i) => (
                <Link key={link.href} href={link.href} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '12px 8px', color: 'var(--dark)',
                  textDecoration: 'none', fontSize: 15, fontWeight: 500,
                  borderRadius: 8,
                  animation: menuOpen ? 'slideInRight 0.3s ease both' : 'none',
                  animationDelay: `${((isLoggedIn ? 2 : 1) + i) * 0.05}s`,
                }}
                  onClick={() => setMenuOpen(false)}
                >
                  <span style={{ color: 'var(--primary)' }}>{link.icon}</span>
                  {link.label}
                </Link>
              ))}

              {isLoggedIn ? (
                <div style={{
                  marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)',
                  animation: menuOpen ? 'slideInRight 0.3s ease both' : 'none',
                  animationDelay: `${(2 + navLinks.length) * 0.05}s`,
                }}>
                  {[
                    { icon: <User size={16} />, label: 'My Profile', href: '/profile' },
                    { icon: <BarChart2 size={16} />, label: 'My Results', href: '/profile#results' },
                  ].map(item => (
                    <Link key={item.label} href={item.href} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '12px 8px', color: 'var(--dark)',
                      textDecoration: 'none', fontSize: 15, fontWeight: 500,
                      borderRadius: 8,
                    }}
                      onClick={() => setMenuOpen(false)}
                    >
                      <span style={{ color: 'var(--muted)' }}>{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}
                  <button onClick={() => { setMenuOpen(false); handleLogout(); }} style={{
                    display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                    padding: '12px 8px', color: '#E11D48', background: 'transparent',
                    border: 'none', fontSize: 15, fontWeight: 500, cursor: 'pointer',
                    fontFamily: 'DM Sans, sans-serif', borderRadius: 8,
                  }}>
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              ) : (
                <div style={{
                  display: 'flex', gap: 10, marginTop: 12,
                  animation: menuOpen ? 'slideInRight 0.3s ease both' : 'none',
                  animationDelay: `${(1 + navLinks.length) * 0.05}s`,
                }}>
                  <button onClick={() => { onLoginOpen?.(); setMenuOpen(false); }} style={{
                    flex: 1, padding: '11px', borderRadius: 9, border: '1.5px solid var(--border)',
                    background: 'white', fontSize: 14, fontWeight: 500, cursor: 'pointer',
                    fontFamily: 'DM Sans, sans-serif',
                  }}>Log in</button>
                  <button onClick={() => { onLoginOpen?.(); setMenuOpen(false); }} style={{
                    flex: 1, padding: '11px', borderRadius: 9, background: 'var(--primary)',
                    border: 'none', fontSize: 14, fontWeight: 600, color: 'white',
                    cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                  }}>Sign up free</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Search Modal */}
      {searchOpen && (
        <div className="modal-overlay" onClick={() => setSearchOpen(false)}>
          <div
            style={{
              background: 'var(--white)', borderRadius: 16, padding: 24,
              width: '100%', maxWidth: 560,
              animation: 'fadeInUp 0.2s ease',
            }}
            onClick={e => e.stopPropagation()}
          >
            <form onSubmit={e => { e.preventDefault(); submitSearch(); }} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <Search size={20} color="var(--muted)" />
              <input
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search jobs, MCQs, exams..."
                style={{
                  flex: 1, border: 'none', outline: 'none',
                  fontSize: 17, fontFamily: 'DM Sans, sans-serif',
                  color: 'var(--dark)',
                }}
              />
              <button type="button" onClick={() => setSearchOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>
                <X size={20} />
              </button>
            </form>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
              <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10, fontWeight: 500 }}>POPULAR SEARCHES</p>
              {['FPSC Assistant Director 2026', 'PPSC Sub-Inspector', 'CSS MCQs Pakistan Studies', 'NTS Test Prep'].map(s => (
                <div key={s} onClick={() => submitSearch(s)} style={{
                  padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
                  fontSize: 14, color: 'var(--dark)',
                  display: 'flex', alignItems: 'center', gap: 10,
                  transition: 'background 0.1s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <Search size={14} color="var(--muted-light)" />
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .hidden-mobile { display: flex !important; }
          .show-mobile { display: none !important; }
          .mobile-menu-panel { max-height: 0 !important; opacity: 0 !important; }
        }

        .mobile-menu-panel {
          overflow: hidden;
          transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease;
        }

        .hamburger-btn {
          width: 38px; height: 38px; border-radius: 9px;
          border: 1.5px solid var(--border); background: var(--white);
          cursor: pointer; position: relative;
          transition: border-color 0.15s ease;
        }
        .hamburger-btn:hover { border-color: var(--primary); }
        .hamburger-line {
          position: absolute; left: 10px; width: 18px; height: 2px;
          background: var(--dark); border-radius: 2px;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease, top 0.3s ease;
        }
        .hamburger-line:nth-child(1) { top: 13px; }
        .hamburger-line:nth-child(2) { top: 18px; }
        .hamburger-line:nth-child(3) { top: 23px; }
        .hamburger-line.open:nth-child(1) { top: 18px; transform: rotate(45deg); }
        .hamburger-line.open:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .hamburger-line.open:nth-child(3) { top: 18px; transform: rotate(-45deg); }
      `}</style>
    </>
  );
}
