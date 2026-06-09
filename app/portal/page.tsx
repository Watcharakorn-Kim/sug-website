'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DealerAuthProvider, useDealerAuth } from '@/lib/dealerAuth';

function LoginForm() {
  const { login, isLoading } = useDealerAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const ok = await login(username.trim(), password);
    setLoading(false);
    if (ok) {
      router.push('/');
    } else {
      setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง · Invalid username or password');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(155deg, #1a1b5e 0%, #0d0e35 60%, #14154F 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decor */}
      <div style={{ position: 'absolute', top: -200, right: -200, width: 600, height: 600, background: 'radial-gradient(circle, rgba(239,90,28,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -200, left: -200, width: 500, height: 500, background: 'radial-gradient(circle, rgba(43,44,145,0.3) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            <img src="/sug-logo-official.png" alt="SUG" style={{ height: 40, width: 'auto' }} />
            <span style={{ display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'left' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em', color: '#fff', textTransform: 'uppercase' }}>SUG</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 600, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>FASTENER</span>
            </span>
          </Link>
          <div style={{ marginTop: 24, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
            DEALER PORTAL
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 'var(--radius-2)',
          backdropFilter: 'blur(16px)',
          padding: '40px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
        }}>
          <h1 style={{ fontFamily: 'var(--font-body)', fontSize: 22, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>
            เข้าสู่ระบบ Dealer Portal
          </h1>
          <p style={{ fontFamily: 'var(--font-thai)', fontSize: 14, color: 'rgba(255,255,255,0.45)', margin: '0 0 32px' }}>
            Sign in to access dealer pricing and order tools.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 10 }}>
                ชื่อผู้ใช้ · USERNAME
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="dealer01"
                required
                autoComplete="username"
                style={{
                  width: '100%', padding: '14px 16px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 'var(--radius-1)',
                  color: '#fff', fontSize: 15,
                  fontFamily: 'var(--font-mono)',
                  outline: 'none', transition: 'border-color 180ms',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--sug-orange)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.15)')}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 10 }}>
                รหัสผ่าน · PASSWORD
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  style={{
                    width: '100%', padding: '14px 48px 14px 16px',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 'var(--radius-1)',
                    color: '#fff', fontSize: 15,
                    fontFamily: 'var(--font-mono)',
                    outline: 'none', transition: 'border-color 180ms',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'var(--sug-orange)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.15)')}
                />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, opacity: 0.5, color: '#fff' }}>
                  {showPw ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-1)', padding: '12px 16px', fontSize: 13, color: '#fca5a5' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || isLoading}
              style={{
                background: loading ? 'var(--sug-steel)' : 'var(--sug-orange)',
                color: '#fff', padding: '16px', borderRadius: 'var(--radius-1)',
                fontSize: 15, fontWeight: 700, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 180ms', fontFamily: 'var(--font-body)',
              }}
            >
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ · Login'}
            </button>
          </form>

          {/* Demo hint */}
          <div style={{ marginTop: 28, padding: '14px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-1)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>DEMO ACCESS</div>
            <code style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8 }}>
              username: demo<br />
              password: demo
            </code>
          </div>
        </div>

        {/* Back link */}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Link href="/" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', transition: 'color 180ms' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}>
            ← กลับหน้าหลัก · Back to main site
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PortalPage() {
  return (
    <DealerAuthProvider>
      <LoginForm />
    </DealerAuthProvider>
  );
}
