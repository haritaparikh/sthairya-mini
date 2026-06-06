export default function RescueBadge() {
  return (
    <div className="animate-badge-glow inline-flex items-center gap-2 bg-warning/15 border border-warning/30 rounded-full px-4 py-2">
      <span className="text-warning text-lg">⚡</span>
      <span className="text-warning font-semibold text-sm tracking-wide uppercase">
        Rescue Mode Activated
      </span>
    </div>
  );
}
