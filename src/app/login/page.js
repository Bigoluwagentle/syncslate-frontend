'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/Logo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      login(data.token, data.user);
      router.push('/boards');
    } catch (err) {
      setError(err.message);
      setSubmitting(false); // only reset on failure — on success we're navigating away anyway
    }
  }



  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center"><Logo /></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="mb-1 text-lg font-semibold text-slate-900">Welcome back</h1>
          <p className="mb-6 text-sm text-slate-500">Log in to open your boards.</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
            />
            <input
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required
            />
            {error && <p className="text-sm text-rose-500">{error}</p>}
           <button
              type="submit"
              disabled={submitting}
              className="mt-2 rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
            >
              {submitting ? 'Logging in…' : 'Log In'}
            </button>
          </form>
        </div>
        <p className="mt-4 text-center text-sm text-slate-500">
          Don't have an account? <a href="/signup" className="font-medium text-indigo-600 hover:underline">Sign up</a>
        </p>
      </div>
    </main>
  );
}