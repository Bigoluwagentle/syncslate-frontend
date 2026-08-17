'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';
import Logo from '@/components/Logo';

export default function BoardPage() {
  const { id } = useParams();
  const { token, loading } = useAuth();
  const router = useRouter();

  const [board, setBoard] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !token) router.push('/login');
  }, [loading, token, router]);

  useEffect(() => {
    if (!token) return;
    apiRequest(`/boards/${id}`, { token })
      .then(setBoard)
      .catch((err) => setError(err.message));
  }, [token, id]);

  if (loading || !token) return null;

  return (
    <main className="min-h-screen">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <Logo />
        <button
          onClick={() => router.push('/boards')}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-50"
        >
          ← All boards
        </button>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-10">
        {error && <p className="text-sm text-rose-500">{error}</p>}
        {board && (
          <>
            <h1 className="text-xl font-semibold text-slate-900">{board.name}</h1>
            <p className="mt-2 text-sm text-slate-400">
              Board ID: {board._id} — canvas goes here next.
            </p>
          </>
        )}
      </div>
    </main>
  );
}