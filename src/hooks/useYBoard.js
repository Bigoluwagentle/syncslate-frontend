'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as Y from 'yjs';
import { HocuspocusProvider } from '@hocuspocus/provider';

const CURSOR_COLORS = ['#4F46E5', '#FB7185', '#2DD4BF', '#F59E0B', '#A855F7'];

function colorForUser(userId) {
  let hash = 0;
  for (const char of userId) hash = char.charCodeAt(0) + ((hash << 5) - hash);
  return CURSOR_COLORS[Math.abs(hash) % CURSOR_COLORS.length];
}

export function useYBoard(boardId, token, user) {
  const [elements, setElements] = useState([]);
  const [peers, setPeers] = useState([]);
  const [status, setStatus] = useState('connecting');
  const providerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!boardId || !token) return;

    const doc = new Y.Doc();
    const provider = new HocuspocusProvider({
      url: process.env.NEXT_PUBLIC_WS_URL,
      name: boardId,
      token,
      document: doc,
    });

    const yElements = doc.getMap('elements');
    providerRef.current = provider;
    mapRef.current = yElements;

    function syncFromY() {
      setElements(Array.from(yElements.values()));
    }
    yElements.observe(syncFromY);
    syncFromY();

    provider.on('status', (e) => setStatus(e.status));

    // Broadcast who we are once connected — every other tab will see this.
    provider.on('synced', () => {
      provider.awareness.setLocalStateField('user', {
        name: user?.name || 'Anonymous',
        color: colorForUser(user?.id || 'anon'),
      });
    });

    // Whenever ANYONE's awareness state changes, rebuild the peer list —
    // excluding our own entry, since we don't need to draw our own cursor.
    function handleAwarenessChange() {
      const states = Array.from(provider.awareness.getStates().entries());
      const others = states
        .filter(([clientId]) => clientId !== provider.awareness.clientID)
        .map(([clientId, state]) => ({ clientId, ...state }))
        .filter((p) => p.cursor && p.user);
      setPeers(others);
    }
    provider.awareness.on('change', handleAwarenessChange);

    return () => {
      yElements.unobserve(syncFromY);
      provider.awareness.off('change', handleAwarenessChange);
      provider.destroy();
      doc.destroy();
    };
  }, [boardId, token, user]);

  const addElement = useCallback((el) => {
    mapRef.current?.set(el.id, el);
  }, []);

  const updateElement = useCallback((id, changes) => {
    const map = mapRef.current;
    const existing = map?.get(id);
    if (!existing) return;
    map.set(id, { ...existing, ...changes });
  }, []);

  const deleteElement = useCallback((id) => {
    mapRef.current?.delete(id);
  }, []);

  // Called on every mouse move over the canvas — broadcasts OUR position
  // to everyone else connected to this board.
  const updateCursor = useCallback((pos) => {
    providerRef.current?.awareness.setLocalStateField('cursor', pos);
  }, []);

  return { elements, addElement, updateElement, deleteElement, status, peers, updateCursor };
}