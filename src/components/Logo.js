export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xl font-semibold tracking-tight text-slate-900">SyncSlate</span>
      <span className="flex -space-x-1">
        <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 ring-2 ring-white" />
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400 ring-2 ring-white" />
        <span className="h-2.5 w-2.5 rounded-full bg-teal-400 ring-2 ring-white" />
      </span>
    </div>
  );
}