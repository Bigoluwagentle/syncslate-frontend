'use client';

const TOOLS = [
  { id: 'select', label: 'Select' },
  { id: 'rect', label: 'Rectangle' },
  { id: 'circle', label: 'Circle' },
  { id: 'sticky', label: 'Sticky' },
  { id: 'text', label: 'Text' },
  { id: 'pen', label: 'Pen' },
];

export default function Toolbar({ tool, setTool, color, setColor, colors }) {
  return (
    <div className="flex items-center gap-4 border-b border-slate-200 bg-white px-4 py-2">
      <div className="flex gap-1">
        {TOOLS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTool(t.id)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              tool === t.id ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="h-6 w-px bg-slate-200" />

      <div className="flex gap-2">
        {colors.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className="h-6 w-6 rounded-full border-2 transition"
            style={{ backgroundColor: c, borderColor: color === c ? '#14171F' : 'transparent' }}
          />
        ))}
      </div>
    </div>
  );
}