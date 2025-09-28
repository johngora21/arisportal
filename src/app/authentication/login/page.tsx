"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

export default function AuthenticationLoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const API_BASE = '';

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || 'Login failed');
      }
      router.replace('/dashboard');
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
            <div className="auth-name">Merit Capital</div>
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
              <a className="auth-link" href="/authentication/forgot-password">Forgot password?</a>
            </div>
            <button type="submit" disabled={submitting}>{submitting ? 'Logging in...' : 'Login'}</button>
          </form>
          <div className="auth-actions">
            <a className="ghost" href="/authentication/signup">Signup</a>
          </div>
        </section>
      </div>
      <style jsx>{`
        .auth-wrap { min-height: 100vh; background: #ffffff; display: grid; place-items: center; padding: 24px; }
        .auth-split { width: 100%; max-width: 980px; display: grid; grid-template-columns: 1.1fr 1fr; gap: 0; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(17,24,39,.06); }
        .auth-side { background: #0b1220; color: #e5e7eb; padding: 36px; display: grid; align-content: start; gap: 12px; }
        .auth-side__header { display: flex; align-items: center; gap: 12px; border-bottom: 1px solid rgba(255,255,255,.08); padding-bottom: 12px; margin-bottom: 12px; }
        .auth-logo { width: 46px; height: 46px; border-radius: 12px; background: #111827; color: #fff; font-weight: 800; display: grid; place-items: center; border: 1px solid rgba(255,255,255,.08); }
        .auth-name { font-weight: 900; letter-spacing: .2px; font-size: 24px; }
        .auth-card { background: #fff; color: #111827; padding: 36px; display: grid; align-content: center; gap: 10px; }
        .auth-card h1 { margin: 0; font-size: 24px; font-weight: 800; }
        .auth-sub { margin: 0 0 10px; color: #6b7280; font-size: 13px; }
        form { display: grid; gap: 8px; }
        label { font-size: 12px; color: #374151; font-weight: 600; }
        input { height: 44px; border-radius: 12px; border: 1px solid #d1d5db; padding: 0 14px; outline: none; transition: box-shadow .2s, border-color .2s; }
        input:focus { border-color: #111827; box-shadow: 0 0 0 3px rgba(17,24,39,0.1); }
        button { height: 44px; border-radius: 12px; background: #111827; color: #fff; border: 1px solid #111827; font-weight: 800; cursor: pointer; }
        button:disabled { opacity: .7; cursor: not-allowed; }
        .auth-alert { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; border-radius: 12px; padding: 12px; font-size: 14px; }
        .auth-inline { display: flex; justify-content: flex-start; margin: 2px 0 8px; }
        .auth-link { color: #1e293b; text-decoration: none; font-size: 13px; font-weight: 600; }
        .auth-link:hover { text-decoration: underline; }
        .auth-actions { margin-top: 8px; display: flex; justify-content: flex-end; gap: 8px; }
        .ghost { display: inline-flex; align-items: center; justify-content: center; height: 40px; padding: 0 14px; border-radius: 10px; border: 1px solid #e5e7eb; color: #111827; text-decoration: none; font-weight: 700; }
        .ghost:hover { background: #f9fafb; }
        @media (max-width: 900px) { .auth-split { grid-template-columns: 1fr; } .auth-side { display: none; } }
      `}</style>
    </div>
  );
}


