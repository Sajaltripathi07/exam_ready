import { useMemo, useState } from "react";
import { QUESTIONS } from "./data/questions";
import { evaluate, isComplete, validateQuestions } from "./lib/assessment";
import type { Answers } from "./types";
import ProgressHeader from "./components/ProgressHeader";
import QuestionCard from "./components/QuestionCard";
import Results from "./components/Results";

type Stage = "intro" | "quiz" | "results";
const btn = "rounded-lg px-4 py-2.5 font-semibold focus:outline-2 focus:outline-offset-2 focus:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-40";

export default function App() {
  const errors = useMemo(() => validateQuestions(QUESTIONS), []);
  const [stage, setStage] = useState<Stage>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const result = useMemo(() => (stage === "results" ? evaluate(QUESTIONS, answers) : null), [stage, answers]);

  const reset = () => { setAnswers({}); setCurrent(0); setStage("intro"); };
  const q = QUESTIONS[current];
  const complete = isComplete(QUESTIONS, answers);
  const missing = QUESTIONS.filter((x) => answers[x.id] === undefined).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex h-1.5"><i className="flex-1 bg-black" /><i className="flex-1 bg-red-600" /><i className="flex-1 bg-amber-400" /></div>
      <header className="mx-auto max-w-2xl px-4 pt-6">
        <h1 className="text-2xl font-bold text-slate-900">Am I Exam-Ready?</h1>
        <p className="text-sm text-slate-600">German A1 · Goethe / ÖSD readiness check</p>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-6">
        {errors.length > 0 ? (
          <div role="alert" className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-900">
            The assessment could not be loaded. {errors.join(" ")}
          </div>
        ) : stage === "intro" ? (
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-lg font-semibold">Check your preparation in 5 minutes</h2>
            <p className="mb-3 text-slate-700">12 multiple-choice questions: 4 vocabulary, 4 grammar and 4 reading. You will get a score, a readiness level and a personal practice plan.</p>
            <p className="mb-5 text-sm text-slate-600">Indicative only. It does not guarantee a pass in the official exam, and it does not cover listening, writing or speaking.</p>
            <button className={`${btn} w-full bg-slate-900 text-white hover:bg-slate-700`} onClick={() => setStage("quiz")}>Start assessment</button>
          </section>
        ) : stage === "quiz" ? (
          <>
            <ProgressHeader questions={QUESTIONS} current={current} answers={answers} onJump={setCurrent} />
            <QuestionCard key={q.id} question={q} selected={answers[q.id]} onSelect={(i) => setAnswers((a) => ({ ...a, [q.id]: i }))} />
            <div className="mt-5 flex items-center justify-between gap-3">
              <button className={`${btn} border border-slate-300 bg-white text-slate-900 hover:bg-slate-100`} disabled={current === 0} onClick={() => setCurrent(current - 1)}>Previous</button>
              {current < QUESTIONS.length - 1 ? (
                <button className={`${btn} bg-slate-900 text-white hover:bg-slate-700`} onClick={() => setCurrent(current + 1)}>Next</button>
              ) : (
                <button className={`${btn} bg-red-700 text-white hover:bg-red-800`} disabled={!complete} onClick={() => setStage("results")}>Submit assessment</button>
              )}
            </div>
            {!complete && current === QUESTIONS.length - 1 && (
              <p role="status" className="mt-3 text-center text-sm text-amber-800">Answer all questions to submit. {missing} left.</p>
            )}
          </>
        ) : result ? (
          <Results result={result} onRetake={reset} />
        ) : null}
      </main>
    </div>
  );
}
