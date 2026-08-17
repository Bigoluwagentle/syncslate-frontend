'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';
import Logo from '@/components/Logo';

export default function BoardsPage() {
  const { user, token, loading, logout } = useAuth();
  const router = useRouter();

  const [boards, setBoards] = useState([]);
  const [boardsLoading, setBoardsLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);

  // Redirect to login if we've finished checking localStorage and
  // there's still no logged-in user.
  useEffect(() => {
    if (!loading && !token) {
      router.push('/login');
    }
  }, [loading, token, router]);

  // Fetch the board list once we know we have a token.
  useEffect(() => {
    if (!token) return;
    apiRequest('/boards', { token })
      .then(setBoards)
      .catch((err) => setError(err.message))
      .finally(() => setBoardsLoading(false));
  }, [token]);

  async function handleCreate(e) {
    e.preventDefault();
    setCreating(true);
    setError('');
    try {
      const board = await apiRequest('/boards', {
        method: 'POST',
        token,
        body: { name: newName },
      });
      setBoards((prev) => [board, ...prev]); // show it immediately, no refetch needed
      setNewName('');
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  }

  // Don't render the real page until we know whether the user is logged in —
  // avoids a flash of "no boards" before the redirect kicks in.
  if (loading || !token) return null;

  return (
    <main className="min-h-screen">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <Logo />
        <div className="flex items-center gap-3 text-sm">
          <span className="text-slate-500">{user?.name} · {user?.email}</span>
          <button
            onClick={logout}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-700 transition hover:bg-slate-50"
          >
            Log out
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-900">Your boards</h1>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
          >
            + New board
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="mt-4 flex gap-2">
            <input
              autoFocus
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              placeholder="Board name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={creating}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
            >
              {creating ? 'Creating…' : 'Create'}
            </button>
          </form>
        )}

        {error && <p className="mt-3 text-sm text-rose-500">{error}</p>}

        <div className="mt-6">
          {boardsLoading ? (
            <p className="text-sm text-slate-400">Loading boards…</p>
          ) : boards.length === 0 ? (
            <p className="text-sm text-slate-400">No boards yet — create your first one above.</p>
          ) : (
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {boards.map((board) => (
                <li key={board._id}>
                  <button
                    onClick={() => router.push(`/boards/${board._id}`)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-indigo-300 hover:shadow-sm"
                  >
                    <p className="font-medium text-slate-900">{board.name}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Created {new Date(board.createdAt).toLocaleDateString()}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}