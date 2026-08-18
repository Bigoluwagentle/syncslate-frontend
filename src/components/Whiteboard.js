'use client';

import { useState, useRef, useEffect, Fragment } from 'react';
import { Stage, Layer, Rect, Circle, Text, Line } from 'react-konva';
import Toolbar from './Toolbar';

const COLORS = ['#4F46E5', '#FB7185', '#2DD4BF', '#F59E0B', '#64748B'];

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function Whiteboard({ boardId }) {
  const [tool, setTool] = useState('select');
  const [color, setColor] = useState(COLORS[0]);
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [drawingId, setDrawingId] = useState(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });

  const stageRef = useRef(null);
  const containerRef = useRef(null);

  // Keep the canvas sized to fill its container, including on window resize.
  useEffect(() => {
    function updateSize() {
      if (containerRef.current) {
        setStageSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    }
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Delete the selected shape with Delete/Backspace — but not while typing
  // inside the text-editing overlay.
  useEffect(() => {
    function handleKeyDown(e) {
      const tag = document.activeElement.tagName;
      if (tag === 'TEXTAREA' || tag === 'INPUT') return;
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        setElements((prev) => prev.filter((el) => el.id !== selectedId));
        setSelectedId(null);
      }
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
      setElements((prev) => [...prev, { id, type: 'rect', x: pos.x, y: pos.y, width: 0, height: 0, fill: color }]);
      setDrawingId(id);
    } else if (tool === 'circle') {
      setElements((prev) => [...prev, { id, type: 'circle', x: pos.x, y: pos.y, radius: 0, fill: color }]);
      setDrawingId(id);
    } else if (tool === 'pen') {
      setElements((prev) => [...prev, { id, type: 'path', points: [pos.x, pos.y], stroke: color }]);
      setDrawingId(id);
    } else if (tool === 'sticky') {
      const newEl = { id, type: 'sticky', x: pos.x, y: pos.y, width: 160, height: 160, fill: color, text: '' };
      setElements((prev) => [...prev, newEl]);
      setTool('select');
      setSelectedId(id);
      setEditingId(id);
    } else if (tool === 'text') {
      const newEl = { id, type: 'text', x: pos.x, y: pos.y, text: '', fontSize: 20, fill: '#14171F' };
      setElements((prev) => [...prev, newEl]);
      setTool('select');
      setSelectedId(id);
      setEditingId(id);
    }
  }

  function handleMouseMove() {
    if (!drawingId) return;
    const pos = getPointer();

    setElements((prev) =>
      prev.map((el) => {
        if (el.id !== drawingId) return el;
        if (el.type === 'rect') return { ...el, width: pos.x - el.x, height: pos.y - el.y };
        if (el.type === 'circle') {
          const dx = pos.x - el.x;
          const dy = pos.y - el.y;
          return { ...el, radius: Math.sqrt(dx * dx + dy * dy) };
        }
        if (el.type === 'path') return { ...el, points: [...el.points, pos.x, pos.y] };
        return el;
      })
    );
  }

  function handleMouseUp() {
    if (drawingId) {
      setDrawingId(null);
      setTool('select'); // after drawing one shape, drop back into select mode
    }
  }

  function updateElement(id, changes) {
    setElements((prev) => prev.map((el) => (el.id === id ? { ...el, ...changes } : el)));
  }

  const editingElement = elements.find((el) => el.id === editingId);

  return (
    <div className="flex h-full flex-col">
      <Toolbar tool={tool} setTool={setTool} color={color} setColor={setColor} colors={COLORS} />

      <div ref={containerRef} className="relative flex-1 overflow-hidden bg-white">
        <Stage
          ref={stageRef}
          width={stageSize.width}
          height={stageSize.height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
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

              if (el.type === 'rect') {
                return <Rect key={el.id} {...common} x={el.x} y={el.y} width={el.width} height={el.height} fill={el.fill} cornerRadius={4} />;
              }
              if (el.type === 'circle') {
                return <Circle key={el.id} {...common} x={el.x} y={el.y} radius={el.radius} fill={el.fill} />;
              }
              if (el.type === 'path') {
                return <Line key={el.id} points={el.points} stroke={el.stroke} strokeWidth={3} lineCap="round" lineJoin="round" tension={0.5} />;
              }
              if (el.type === 'sticky') {
                return (
                  <Fragment key={el.id}>
                    <Rect {...common} x={el.x} y={el.y} width={el.width} height={el.height} fill={el.fill} cornerRadius={6} shadowBlur={4} shadowOpacity={0.15} onDblClick={() => setEditingId(el.id)} />
                    {editingId !== el.id && (
                      <Text x={el.x + 10} y={el.y + 10} width={el.width - 20} text={el.text} fontSize={14} fill="#14171F" listening={false} />
                    )}
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