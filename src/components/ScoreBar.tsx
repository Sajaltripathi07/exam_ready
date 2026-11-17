interface Props { label: string; percent: number; detail?: string }
const tone = (p: number) => (p >= 80 ? "bg-emerald-600" : p >= 60 ? "bg-amber-500" : "bg-red-600");

export default function ScoreBar({ label, percent, detail }: Props) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="font-medium text-slate-800">{label}</span>
        <span className="text-slate-600">{detail ?? `${percent}%`}</span>
      </div>
      <div className="h-3 rounded-full bg-slate-200" role="progressbar" aria-label={label}
        aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <div className={`h-3 rounded-full ${tone(percent)}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
