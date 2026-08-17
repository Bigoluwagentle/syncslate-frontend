import Link from 'next/link';
import Logo from '@/components/Logo';

function CursorMock() {
  const cursors = [
    { name: 'Ada', color: '#4F46E5', top: '20%', left: '55%' },
    { name: 'Femi', color: '#FB7185', top: '55%', left: '30%' },
    { name: 'Zee', color: '#2DD4BF', top: '68%', left: '68%' },
  ];

  return (
    <div
      className="relative h-80 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white sm:h-96"
      style={{
        backgroundImage: 'radial-gradient(#E4E7EC 1px, transparent 1px)',
        backgroundSize: '18px 18px',
      }}
    >
      {/* fake shapes on the "board" */}
      <div className="absolute left-[12%] top-[22%] h-16 w-24 rounded-lg bg-indigo-100 ring-1 ring-indigo-200" />
      <div className="absolute left-[45%] top-[45%] h-20 w-20 rounded-full bg-rose-100 ring-1 ring-rose-200" />
      <div className="absolute left-[65%] top-[15%] h-12 w-32 rounded-lg bg-teal-100 ring-1 ring-teal-200" />

      {cursors.map((c) => (
        <div key={c.name} className="absolute flex flex-col items-start" style={{ top: c.top, left: c.left }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M1 1L7 16L9.5 9.5L16 7L1 1Z" fill={c.color} />
          </svg>
          <span
            className="mt-0.5 rounded-full px-2 py-0.5 text-xs font-medium text-white"
            style={{ backgroundColor: c.color }}
          >
            {c.name}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <div className="flex items-center gap-4 text-sm">
          <Link href="/login" className="text-slate-600 hover:text-slate-900">Log in</Link>
          <Link
            href="/signup"
            className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-500"
          >
            Get started
          </Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-12 lg:grid-cols-2 lg:py-20">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Draw together.<br />Nobody's edits get lost.
          </h1>
          <p className="mt-5 max-w-md text-base text-slate-500">
            SyncSlate is a real-time collaborative whiteboard. Every change merges
            correctly, even when two people edit the same board at the same instant —
            powered by CRDTs, not a fragile last-write-wins.
          </p>
          <div className="mt-8 flex gap-3">
            <Link
              href="/signup"
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
            >
              Create a board
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Log in
            </Link>
          </div>
        </div>
        <CursorMock />
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-indigo-500" />
            <h3 className="mt-3 text-sm font-semibold text-slate-900">Live sync</h3>
            <p className="mt-1 text-sm text-slate-500">Edits appear on every screen instantly, no refresh needed.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-rose-400" />
            <h3 className="mt-3 text-sm font-semibold text-slate-900">Conflict-free merging</h3>
            <p className="mt-1 text-sm text-slate-500">Two people editing at once still converge to the same board, correctly.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-teal-400" />
            <h3 className="mt-3 text-sm font-semibold text-slate-900">See who's here</h3>
            <p className="mt-1 text-sm text-slate-500">Live cursors show exactly where everyone is working.</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-400">
        SyncSlate — built to demonstrate real-time CRDT sync.
      </footer>
    </main>
  );
}