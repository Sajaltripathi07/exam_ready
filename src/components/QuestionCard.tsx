import type { Question } from "../types";

interface Props { question: Question; selected?: number; onSelect: (i: number) => void }

export default function QuestionCard({ question, selected, onSelect }: Props) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-amber-700">{question.skill}</p>
      {question.passage && (
        <blockquote className="mb-4 whitespace-pre-line rounded-lg border-l-4 border-amber-400 bg-amber-50 p-4 text-slate-800">
          {question.passage}
        </blockquote>
      )}
      <h2 className="mb-4 text-lg font-semibold text-slate-900">{question.prompt}</h2>
      <div role="radiogroup" aria-label={question.prompt} className="space-y-2">
        {question.options.map((opt, i) => (
          <label key={opt} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors focus-within:outline-2 focus-within:outline-slate-900 ${
            selected === i ? "border-slate-900 bg-slate-100" : "border-slate-300 hover:bg-slate-50"}`}>
            <input type="radio" name={question.id} checked={selected === i} onChange={() => onSelect(i)} className="h-4 w-4 accent-slate-900" />
            <span className="text-slate-900">{opt}</span>
          </label>
        ))}
      </div>
    </section>
  );
}
