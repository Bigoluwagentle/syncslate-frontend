'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [status, setStatus] = useState('Checking backend connection...');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`)
      .then((res) => res.json())
      .then((data) => setStatus(`Backend says: ${JSON.stringify(data)}`))
      .catch((err) => setStatus(`Failed to reach backend: ${err.message}`));
  }, []);

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>SyncSlate</h1>
      <p>{status}</p>
    </main>
  );
}