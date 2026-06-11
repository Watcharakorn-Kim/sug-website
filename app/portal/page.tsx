'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DealerAuthProvider, useDealerAuth } from '@/lib/dealerAuth';

type Lang = 'th' | 'en';
const t = (lang: Lang, th: string, en: string) => lang === 'en' ? en : th;

function LoginForm() {
  const { login, isLoading } = useDealerAuth();
  const router = useRouter();
  const [lang, setLang] = useState<Lang>('th');
  const [username, setUsername] = useState('demo');
  const [password, setPassword] = useState('demo');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const ok = await login(username.trim(), password);
    setLoading(false);
    if (ok) {
      router.push('/');
    } else {
      setError(
        lang === 'en'
          ? 'Invalid username or password'
          : 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง · Invalid username or password'
      );
    }
  };

  const benefits = [
    [ 'ราคาคู่ค้าตามระดับบัญชีของคุณ', 'Trade pricing by your account tier' ],
    [ 'ตรวจสอบสต็อกและกำหนดส่งแบบเรียลไทม์', 'Real-time stock & delivery dates' ],
    [ 'สั่งซ้ำและดูประวัติคำสั่งซื้อ', 'Reorder and view your order history' ],
    [ 'ใบเสนอราคาและเอกสารวางบิล', 'Quotations and billing documents' ],
  ];

  return (
    <div className="auth-shell">
      <aside className="auth-aside">
        <img className="auth-logo" src="/logo-sug-trans.png" alt="SUG" />
        <div className="auth-aside-head">
          <span className="auth-kicker" lang={lang}>{t(lang, 'บัญชีคู่ค้า', 'TRADE ACCOUNT')}</span>
          <h1 lang={lang}>{t(lang, 'เข้าสู่ระบบบัญชีตัวแทน', 'Dealer account sign-in')}</h1>
          <p className="auth-sub" lang={lang}>{t(lang, 'เข้าถึงราคาคู่ค้าและสั่งซื้อสำหรับธุรกิจของคุณ', 'Access trade pricing and order for your business.')}</p>
        </div>
        <ul className="auth-benefits">
          {benefits.map(([th, en]) => (
            <li key={en} lang={lang}><span className="bi">✓</span>{t(lang, th, en)}</li>
          ))}
        </ul>
        <div className="auth-aside-foot">SIAM UNION GOLD TRADING CO., LTD. · B2B</div>
      </aside>

      <main className="auth-main">
        <div className="auth-topbar">
          <Link className="auth-back" href="/">
            ← {t(lang, 'กลับหน้าแรก', 'Back to home')}
          </Link>
          <div className="auth-langs">
            <button className={lang === 'th' ? 'on' : ''} onClick={() => setLang('th')}>TH</button>
            <span className="div">/</span>
            <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>EN</button>
          </div>
        </div>

        <div className="auth-body">
          <div className="auth-card">
            <h2 lang={lang}>{t(lang, 'เข้าสู่ระบบ', 'Sign in')}</h2>
            <p className="lead" lang={lang}>{t(lang, 'สำหรับตัวแทนจำหน่ายที่ได้รับการอนุมัติแล้ว', 'For approved dealer accounts.')}</p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="fld">
                <label lang={lang}>{t(lang, 'อีเมล หรือ รหัสตัวแทน', 'Email or dealer code')}<span className="req">*</span></label>
                <input 
                  type="text" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)} 
                  placeholder="you@company.co.th · DLR-10428" 
                  required
                />
                <span className="hint">{t(lang, 'รองรับทั้งอีเมลและรหัส DLR (เช่น DLR-10428)', 'Email or DLR code (e.g. DLR-10428)')}</span>
              </div>
              <div className="fld">
                <label lang={lang}>{t(lang, 'รหัสผ่าน', 'Password')}<span className="req">*</span></label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  required
                />
              </div>
              <div className="auth-row">
                <label className="remember" lang={lang}>
                  <input 
                    type="checkbox" 
                    checked={rememberMe} 
                    onChange={e => setRememberMe(e.target.checked)} 
                  /> {t(lang, 'จดจำฉันไว้', 'Remember me')}
                </label>
                <a className="link-orange" href="#" onClick={(e) => e.preventDefault()} lang={lang}>
                  {t(lang, 'ลืมรหัสผ่าน?', 'Forgot password?')}
                </a>
              </div>

              {error && (
                <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-1)', padding: '12px 16px', fontSize: 13, color: '#fca5a5' }}>
                  {error}
                </div>
              )}

              <button type="submit" className="btn-auth" disabled={loading || isLoading} lang={lang}>
                {loading || isLoading ? (
                  t(lang, 'กำลังเข้าสู่ระบบ...', 'Signing in...')
                ) : (
                  <>{t(lang, 'เข้าสู่ระบบ', 'Sign in')} <span className="arr">→</span></>
                )}
              </button>
            </form>

            <p className="auth-alt" lang={lang}>
              {t(lang, 'ยังไม่มีบัญชีคู่ค้า?', 'No trade account yet?')} <Link href="/contact">{t(lang, 'เปิดบัญชีตัวแทน', 'Open a dealer account')}</Link>
            </p>

            <div className="auth-note" lang={lang}>
              {t(lang,
                'ลูกค้าทั่วไปสามารถดูสินค้าและสเปกทั้งหมดได้โดยไม่ต้องเข้าสู่ระบบ — เข้าสู่ระบบเฉพาะเมื่อต้องการดูราคาคู่ค้าและสั่งซื้อ',
                'Anyone can browse all products and specs without signing in — sign in only to see trade pricing and to order.')}
            </div>
          </div>
        </div>
      </main>
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
