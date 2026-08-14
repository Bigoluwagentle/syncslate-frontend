'use client';

import { useAuth } from '@/context/AuthContext';

export default function BoardsPage() {
  const { user, logout } = useAuth();

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Boards</h1>
      <p>Logged in as: {user?.name} ({user?.email})</p>
      <button onClick={logout}>Log out</button>
    </main>
  );
}