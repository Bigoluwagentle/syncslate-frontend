'use client';

const TOOLS = [
  { id: 'select', label: 'Select' },
  { id: 'rect', label: 'Rectangle' },
  { id: 'circle', label: 'Circle' },
  { id: 'sticky', label: 'Sticky' },
  { id: 'text', label: 'Text' },
  { id: 'pen', label: 'Pen' },
];

export default function Toolbar({ tool, setTool, color, setColor, colors, onDelete, hasSelection }) {
  return (
    <div className="flex flex-wrap items-center gap-4 border-b border-slate-200 bg-white px-4 py-2">
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

      <div className="flex items-center gap-2">
        {colors.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className="h-6 w-6 rounded-full border-2 transition"
            style={{ backgroundColor: c, borderColor: color === c ? '#14171F' : 'transparent' }}
          />
        ))}
        {/* Native color picker — click the swatch to open the OS color wheel for any color */}
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="h-6 w-6 cursor-pointer rounded-full border border-slate-200 p-0"
          title="Custom color"
        />
      </div>

      <div className="h-6 w-px bg-slate-200" />

      <button
        onClick={onDelete}
        disabled={!hasSelection}
        className="rounded-lg px-3 py-1.5 text-sm font-medium text-rose-500 transition hover:bg-rose-50 disabled:opacity-30 disabled:hover:bg-transparent"
      >
        Delete
      </button>
    </div>
  );
}