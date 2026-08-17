'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/Logo';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const data = await apiRequest('/auth/signup', {
        method: 'POST',
        body: { name, email, password },
      });
      login(data.token, data.user);
      router.push('/boards'); 
    } catch (err) {
      setError(err.message);
    }
  }


  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center"><Logo /></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="mb-1 text-lg font-semibold text-slate-900">Create your account</h1>
          <p className="mb-6 text-sm text-slate-500">Start a board and invite others to it.</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required
            />
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
              className="mt-2 rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
            >
              Sign Up
            </button>
          </form>
        </div>
        <p className="mt-4 text-center text-sm text-slate-500">
          Already have an account? <a href="/login" className="font-medium text-indigo-600 hover:underline">Log in</a>
        </p>
      </div>
    </main>
  );
}
