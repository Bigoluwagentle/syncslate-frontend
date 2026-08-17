'use client';

import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/Logo';

export default function BoardsPage() {
  const { user, logout } = useAuth();

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
        <h1 className="text-xl font-semibold text-slate-900">Your boards</h1>
        <p className="mt-1 text-sm text-slate-500">Board list and creation coming next.</p>
      </div>
    </main>
  );
}