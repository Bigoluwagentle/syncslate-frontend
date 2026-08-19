'use client';

import { useState, useRef, useEffect, Fragment } from 'react';
import { Stage, Layer, Rect, Circle, Text, Line } from 'react-konva';
import Toolbar from './Toolbar';
import { useYBoard } from '@/hooks/useYBoard';

const COLORS = ['#4F46E5', '#FB7185', '#2DD4BF', '#F59E0B', '#64748B'];

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function Whiteboard({ boardId, token, user }) {
  const { elements, addElement, updateElement, deleteElement, status, peers, updateCursor } = useYBoard(boardId, token, user);

  const [tool, setTool] = useState('select');
  const [color, setColor] = useState(COLORS[0]);
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [drawingId, setDrawingId] = useState(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });

  const stageRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    function updateSize() {
      if (containerRef.current) {
        setStageSize({ width: containerRef.current.clientWidth, height: containerRef.current.clientHeight });
      }
    }
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  function deleteSelected() {
    if (!selectedId) return;
    deleteElement(selectedId);
    setSelectedId(null);
  }

  useEffect(() => {
    function handleKeyDown(e) {
      const tag = document.activeElement.tagName;
      if (tag === 'TEXTAREA' || tag === 'INPUT') return;
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) deleteSelected();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId]);

  function getPointer() {
    return stageRef.current.getPointerPosition();
  }

  function handleMouseDown(e) {
    const clickedOnEmpty = e.target === e.target.getStage();

    if (tool === 'select') {
      if (clickedOnEmpty) setSelectedId(null);
      return;
    }

    const pos = getPointer();
    const id = makeId();

    if (tool === 'rect') {
      addElement({ id, type: 'rect', x: pos.x, y: pos.y, width: 0, height: 0, fill: color });
      setDrawingId(id);
    } else if (tool === 'circle') {
      addElement({ id, type: 'circle', x: pos.x, y: pos.y, radius: 0, fill: color });
      setDrawingId(id);
    } else if (tool === 'pen') {
      addElement({ id, type: 'path', points: [pos.x, pos.y], stroke: color });
      setDrawingId(id);
    } else if (tool === 'sticky') {
      addElement({ id, type: 'sticky', x: pos.x, y: pos.y, width: 160, height: 160, fill: color, text: '' });
      setTool('select');
      setSelectedId(id);
      setEditingId(id);
    } else if (tool === 'text') {
      addElement({ id, type: 'text', x: pos.x, y: pos.y, text: '', fontSize: 20, fill: '#14171F' });
      setTool('select');
      setSelectedId(id);
      setEditingId(id);
    }
  }

  function handleMouseMove() {
    const pos = getPointer();
    if (pos) updateCursor(pos);

    if (!drawingId) return;
    const el = elements.find((e) => e.id === drawingId);
    if (!el) return;

    if (el.type === 'rect') {
      updateElement(drawingId, { width: pos.x - el.x, height: pos.y - el.y });
    } else if (el.type === 'circle') {
      const dx = pos.x - el.x;
      const dy = pos.y - el.y;
      updateElement(drawingId, { radius: Math.sqrt(dx * dx + dy * dy) });
    } else if (el.type === 'path') {
      updateElement(drawingId, { points: [...el.points, pos.x, pos.y] });
    }
  }

  function handleMouseUp() {
    if (drawingId) {
      setDrawingId(null);
      setTool('select');
    }
  }

  const editingElement = elements.find((el) => el.id === editingId);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <Toolbar tool={tool} setTool={setTool} color={color} setColor={setColor} colors={COLORS} onDelete={deleteSelected} hasSelection={!!selectedId} />
        <span className={`mr-4 rounded-full px-2 py-0.5 text-xs font-medium ${status === 'connected' ? 'bg-teal-50 text-teal-600' : 'bg-amber-50 text-amber-600'}`}>
          {status === 'connected' ? 'Live' : 'Connecting…'}
        </span>
      </div>

      <div ref={containerRef} className="relative flex-1 overflow-hidden bg-white">
        <Stage ref={stageRef} width={stageSize.width} height={stageSize.height} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
          <Layer>
            {elements.map((el) => {
              const isSelected = el.id === selectedId;
              const common = {
                draggable: tool === 'select',
                onClick: () => tool === 'select' && setSelectedId(el.id),
                onDragEnd: (e) => updateElement(el.id, { x: e.target.x(), y: e.target.y() }),
                stroke: isSelected ? '#4F46E5' : undefined,
                strokeWidth: isSelected ? 2 : 0,
              };

              if (el.type === 'rect') return <Rect key={el.id} {...common} x={el.x} y={el.y} width={el.width} height={el.height} fill={el.fill} cornerRadius={4} />;
              if (el.type === 'circle') return <Circle key={el.id} {...common} x={el.x} y={el.y} radius={el.radius} fill={el.fill} />;
              if (el.type === 'path') return <Line key={el.id} points={el.points} stroke={el.stroke} strokeWidth={3} lineCap="round" lineJoin="round" tension={0.5} />;
              if (el.type === 'sticky') {
                return (
                  <Fragment key={el.id}>
                    <Rect {...common} x={el.x} y={el.y} width={el.width} height={el.height} fill={el.fill} cornerRadius={6} shadowBlur={4} shadowOpacity={0.15} onDblClick={() => setEditingId(el.id)} />
                    {editingId !== el.id && <Text x={el.x + 10} y={el.y + 10} width={el.width - 20} text={el.text} fontSize={14} fill="#14171F" listening={false} />}
                  </Fragment>
                );
              }
              if (el.type === 'text') {
                return editingId === el.id ? null : (
                  <Text key={el.id} {...common} x={el.x} y={el.y} text={el.text || 'Double-click to edit'} fontSize={el.fontSize} fill={el.text ? el.fill : '#94A3B8'} onDblClick={() => setEditingId(el.id)} />
                );
              }
              return null;
            })}
          </Layer>
        </Stage>

        {peers.map((peer) => (
          <div
            key={peer.clientId}
            className="pointer-events-none absolute z-10 transition-transform duration-75"
            style={{ left: peer.cursor.x, top: peer.cursor.y }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M1 1L7 16L9.5 9.5L16 7L1 1Z" fill={peer.user.color} />
            </svg>
            <span
              className="mt-0.5 inline-block rounded-full px-2 py-0.5 text-xs font-medium text-white"
              style={{ backgroundColor: peer.user.color }}
            >
              {peer.user.name}
            </span>
          </div>
        ))}

        {editingElement && (
          <textarea
            autoFocus
            value={editingElement.text}
            onChange={(e) => updateElement(editingElement.id, { text: e.target.value })}
            onBlur={() => setEditingId(null)}
            onKeyDown={(e) => e.key === 'Escape' && setEditingId(null)}
            className="absolute resize-none rounded-md border border-indigo-300 bg-white/95 p-2 text-sm outline-none"
            style={{
              left: editingElement.x,
              top: editingElement.y,
              width: editingElement.type === 'sticky' ? editingElement.width : 200,
              height: editingElement.type === 'sticky' ? editingElement.height : 40,
            }}
          />
        )}
      </div>
    </div>
  );
}