import type { Result, Status } from "../types";
import { STATUS_ADVICE, THRESHOLDS } from "../lib/assessment";
import ScoreBar from "./ScoreBar";

const badge: Record<Status, string> = {
  "Exam Ready": "bg-emerald-100 text-emerald-900 border-emerald-600",
  "Almost Ready": "bg-amber-100 text-amber-900 border-amber-600",
  "Not Ready": "bg-red-100 text-red-900 border-red-600",
};

export default function Results({ result, onRetake }: { result: Result; onRetake: () => void }) {
  const wrong = result.total - result.correct;
  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <p className="text-sm text-slate-600">Your indicative readiness score</p>
        <p className="my-1 text-6xl font-bold text-slate-900">{result.overall}<span className="text-2xl text-slate-500">/100</span></p>
        <span className={`inline-block rounded-full border px-4 py-1 text-sm font-semibold ${badge[result.status]}`}>{result.status}</span>
        <p className="mx-auto mt-3 max-w-md text-slate-700">{STATUS_ADVICE[result.status]}</p>
        {result.downgraded && (
          <p className="mx-auto mt-2 max-w-md text-sm text-amber-800">
            Your total qualified as Exam Ready, but one skill is below 50%. The real exam tests every skill, so we lowered your status.
          </p>
        )}
        <p className="mt-3 text-sm text-slate-600">{result.correct} correct · {wrong} incorrect</p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-semibold text-slate-900">Skill breakdown</h2>
        <div className="space-y-4">
          {result.skills.map((s) => <ScoreBar key={s.skill} label={s.skill} percent={s.percent} detail={`${s.correct}/${s.total} · ${s.percent}%`} />)}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-3 font-semibold text-slate-900">Your focus areas</h2>
        {result.weakAreas.length === 0 ? (
          <p className="text-slate-700">No weak areas found. Keep practising with full mock exams to stay sharp.</p>
        ) : (
          <ol className="space-y-3">
            {result.weakAreas.map((w, i) => (
              <li key={w.topic} className="rounded-lg bg-slate-50 p-3">
                <p className="font-medium text-slate-900">{i + 1}. {w.topic} <span className="text-xs font-normal text-slate-500">({w.skill})</span></p>
                <p className="text-sm text-slate-700">{w.tip}</p>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-3 font-semibold text-slate-900">Answer review</h2>
        <ul className="divide-y divide-slate-200">
          {result.review.map(({ question: q, chosen, isCorrect }, i) => (
            <li key={q.id} className="py-3 text-sm">
              <p className="font-medium text-slate-900">{i + 1}. {q.prompt}</p>
              <p className={isCorrect ? "text-emerald-700" : "text-red-700"}>
                {isCorrect ? "✓ Correct: " : "✗ You chose: "}{q.options[chosen]}
              </p>
              {!isCorrect && <p className="text-slate-700">Correct answer: {q.options[q.correct]}</p>}
            </li>
          ))}
        </ul>
      </section>

      <p className="rounded-lg bg-slate-100 p-4 text-sm text-slate-700">
        <strong>Scoring:</strong> {THRESHOLDS.ready}–100 Exam Ready · {THRESHOLDS.almost}–{THRESHOLDS.ready - 1} Almost Ready · below {THRESHOLDS.almost} Not Ready.
        This is an indicative check of reading, vocabulary and grammar only. It is not a guarantee of passing the Goethe or ÖSD A1 exam, which also tests listening, writing and speaking.
      </p>
      <button onClick={onRetake} className="w-full rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-700 focus:outline-2 focus:outline-offset-2 focus:outline-slate-900">
        Retake assessment
      </button>
    </div>
  );
}
