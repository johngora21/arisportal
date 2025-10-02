"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

export default function AuthenticationSignupInvestor() {
  const router = useRouter();
  const [full_name, setFullName] = React.useState('');
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
      const res = await fetch(`${API_BASE}/api/v1/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name, role: 'investor' }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || 'Signup failed');
      }
      alert('Investor account created. Super Admin must verify before login.');
      router.replace('/authentication/login');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="form-card">
        <h1>Investor Signup</h1>
        {error && <div className="alert">{error}</div>}
        <form onSubmit={onSubmit}>
          <label>Full name</label>
          <input value={full_name} onChange={(e) => setFullName(e.target.value)} required />
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" disabled={submitting}>{submitting ? 'Creating...' : 'Create account'}</button>
        </form>
        <div className="actions"><a href="/authentication/login">Back to Login</a></div>
      </div>
      <style jsx>{`
        .auth-wrap { min-height: 100vh; background: #fff; display: grid; place-items: center; padding: 24px; }
        .form-card { width: 100%; max-width: 520px; background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 28px; box-shadow: 0 12px 32px rgba(17,24,39,.06); }
        h1 { margin: 2px 0 12px; font-size: 22px; font-weight: 800; }
        form { display: grid; gap: 8px; }
        label { font-size: 12px; color: #374151; font-weight: 600; }
        input { height: 44px; border-radius: 12px; border: 1px solid #d1d5db; padding: 0 14px; }
        button { height: 44px; border-radius: 12px; background: var(--mc-sidebar-bg); color: #fff; border: 1px solid var(--mc-sidebar-bg); font-weight: 800; }
        .alert { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; border-radius: 12px; padding: 12px; font-size: 14px; }
        .actions { margin-top: 10px; }
      `}</style>
    </div>
  );
}


