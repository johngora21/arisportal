import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || 'Login failed');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-split">
        <section className="auth-side">
          <div className="auth-side__header">
            <div className="auth-logo">MC</div>
            <div className="auth-name">Aris Portal</div>
          </div>
          <h2>Fueling innovation with smart capital</h2>
          <p>Connect with investors, mentors, and resources to grow your startup.</p>
        </section>
        <section className="auth-card">
          <h1>Login</h1>
          <p className="auth-sub">Access your account</p>
          {error && <div className="auth-alert">{error}</div>}
          <form onSubmit={onSubmit}>
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <div className="auth-inline">
              <a className="auth-link" href="/forgot-password">Forgot password?</a>
            </div>
            <button type="submit" disabled={submitting}>{submitting ? 'Logging in...' : 'Login'}</button>
          </form>
          <div className="auth-actions">
            <a className="ghost" href="/signup">Signup</a>
          </div>
        </section>
      </div>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const [me, setMe] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/v1/auth/me', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        setMe(data?.data);
      } else {
        navigate('/');
      }
    };
    load();
  }, [navigate]);

  return (
    <div style={{ padding: 24, display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: 0 }}>Welcome{me?.full_name ? `, ${me.full_name}` : ''}</h1>
          <div style={{ color: '#6b7280', fontSize: 14 }}>Role: {me?.role || 'guest'}</div>
        </div>
        <button
          style={{ height: 40, borderRadius: 10, background: '#111827', color: '#fff', border: '1px solid #111827', cursor: 'pointer', padding: '0 14px' }}
          onClick={async () => { await fetch('/api/v1/auth/logout', { method: 'POST', credentials: 'include' }); navigate('/'); }}
        >Logout</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 12, color: '#6b7280' }}>Quick stat</div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>Coming soon</div>
        </div>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 12, color: '#6b7280' }}>Projects</div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>0</div>
        </div>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 12, color: '#6b7280' }}>Notifications</div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>0</div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}
