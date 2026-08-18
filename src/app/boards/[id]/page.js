'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';
import Logo from '@/components/Logo';

const Whiteboard = dynamic(() => import('@/components/Whiteboard'), { ssr: false });

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
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
        <div className="flex items-center gap-4">
          <Logo />
          {board && <span className="text-sm font-medium text-slate-700">{board.name}</span>}
        </div>
        <button
          onClick={() => router.push('/boards')}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-50"
        >
          ← All boards
        </button>
      </header>

      {error && <p className="px-6 py-2 text-sm text-rose-500">{error}</p>}

      <div className="flex-1 overflow-hidden">
        {board && <Whiteboard boardId={board._id} />}
      </div>
    </div>
  );
}