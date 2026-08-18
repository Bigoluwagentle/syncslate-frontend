'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as Y from 'yjs';
import { HocuspocusProvider } from '@hocuspocus/provider';

export function useYBoard(boardId, token) {
  const [elements, setElements] = useState([]);
  const [status, setStatus] = useState('connecting');
  const providerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!boardId || !token) return;

    const doc = new Y.Doc();
    const provider = new HocuspocusProvider({
      url: process.env.NEXT_PUBLIC_WS_URL,
      name: boardId, // must match a real board's _id — checked by onAuthenticate on the server
      token,
      document: doc,
    });

    const yElements = doc.getMap('elements');
    providerRef.current = provider;
    mapRef.current = yElements;

    // Whenever the map changes — from THIS tab or ANY other connected tab —
    // re-derive a plain array so React can render it normally.
    function syncFromY() {
      setElements(Array.from(yElements.values()));
    }
    yElements.observe(syncFromY);
    syncFromY();

    provider.on('status', (e) => setStatus(e.status));

    return () => {
      yElements.unobserve(syncFromY);
      provider.destroy();
      doc.destroy();
    };
  }, [boardId, token]);

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

  return { elements, addElement, updateElement, deleteElement, status };
}