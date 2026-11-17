import type { Answers, Question } from "../types";

interface Props { questions: Question[]; current: number; answers: Answers; onJump: (i: number) => void }

export default function ProgressHeader({ questions, current, answers, onJump }: Props) {
  const answered = questions.filter((q) => answers[q.id] !== undefined).length;
  return (
    <div className="mb-5">
      <div className="mb-2 flex justify-between text-sm text-slate-600">
        <span className="font-semibold text-slate-900">Question {current + 1} of {questions.length}</span>
        <span>{answered} answered</span>
      </div>
      <div className="h-2 rounded-full bg-slate-200">
        <div className="h-2 rounded-full bg-slate-900" style={{ width: `${(answered / questions.length) * 100}%` }} />
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {questions.map((q, i) => (
          <button key={q.id} onClick={() => onJump(i)} aria-label={`Go to question ${i + 1}`}
            aria-current={i === current}
            className={`h-8 w-8 rounded-md border text-xs font-semibold focus:outline-2 focus:outline-offset-2 focus:outline-slate-900 ${
              i === current ? "border-slate-900 bg-slate-900 text-white"
              : answers[q.id] !== undefined ? "border-amber-400 bg-amber-100 text-slate-900"
              : "border-slate-300 bg-white text-slate-600"}`}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
