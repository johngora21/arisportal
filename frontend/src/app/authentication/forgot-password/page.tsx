"use client";
import React from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const API_BASE = '';

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || 'Failed to request reset');
      setMessage('If that email exists, a reset link was sent.');
    } catch (err: any) {
      setError(err.message || 'Failed to request reset');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-solo">
        <h1>Forgot password</h1>
        <p className="auth-sub">Enter your email to receive a reset link</p>
        {message && <div className="auth-alert auth-alert--ok">{message}</div>}
        {error && <div className="auth-alert">{error}</div>}
        <form onSubmit={onSubmit}>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button type="submit" disabled={submitting}>{submitting ? 'Sending...' : 'Send reset link'}</button>
        </form>
        <div className="auth-actions">
          <a className="ghost" href="/authentication/login">Back to Login</a>
        </div>
      </div>
      <style jsx>{`
        .auth-wrap { min-height: 100vh; background: #ffffff; display: grid; place-items: center; padding: 24px; }
        .auth-solo { width: 100%; max-width: 520px; border: 1px solid #e5e7eb; border-radius: 16px; padding: 28px; box-shadow: 0 12px 32px rgba(17,24,39,.06); }
        h1 { margin: 0 0 8px; font-size: 24px; font-weight: 800; }
        .auth-sub { margin: 0 0 10px; color: #6b7280; font-size: 13px; }
        form { display: grid; gap: 8px; }
        label { font-size: 12px; color: #374151; font-weight: 600; }
        input { height: 44px; border-radius: 12px; border: 1px solid #d1d5db; padding: 0 14px; }
        button { height: 44px; border-radius: 12px; background: var(--mc-sidebar-bg); color: #fff; border: 1px solid var(--mc-sidebar-bg); font-weight: 800; cursor: pointer; }
        .auth-alert { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; border-radius: 12px; padding: 12px; font-size: 14px; }
        .auth-alert--ok { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
        .auth-actions { margin-top: 8px; display: flex; justify-content: flex-end; }
        .ghost { display: inline-flex; align-items: center; justify-content: center; height: 40px; padding: 0 14px; border-radius: 10px; border: 1px solid #e5e7eb; color: var(--mc-sidebar-bg); text-decoration: none; font-weight: 700; }
        .ghost:hover { background: #f9fafb; }
      `}</style>
    </div>
  );
}


