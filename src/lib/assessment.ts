import type { Answers, Question, Result, Skill, SkillScore, Status, WeakArea } from "../types";

export const SKILLS: Skill[] = ["Vocabulary", "Grammar", "Reading"];
export const THRESHOLDS = { ready: 80, almost: 60 } as const;
export const MIN_SKILL_PERCENT = 50; // an Exam Ready result needs every skill at or above this

export function classify(score: number): Status {
  if (score >= THRESHOLDS.ready) return "Exam Ready";
  if (score >= THRESHOLDS.almost) return "Almost Ready";
  return "Not Ready";
}

/** Returns a list of problems with the question bank (empty = valid). */
export function validateQuestions(qs: Question[]): string[] {
  const errors: string[] = [];
  if (qs.length === 0) errors.push("No questions available.");
  const ids = new Set<string>();
  qs.forEach((q) => {
    if (ids.has(q.id)) errors.push(`Duplicate id ${q.id}.`);
    ids.add(q.id);
    if (q.options.length < 2 || q.correct < 0 || q.correct >= q.options.length) errors.push(`Invalid options in ${q.id}.`);
  });
  return errors;
}

export const isComplete = (qs: Question[], a: Answers) => qs.every((q) => a[q.id] !== undefined);

export function evaluate(qs: Question[], answers: Answers): Result {
  const review = qs.map((question) => {
    const chosen = answers[question.id];
    return { question, chosen, isCorrect: chosen === question.correct };
  });
  const correct = review.filter((r) => r.isCorrect).length;
  const overall = Math.round((correct / qs.length) * 100);

  const skills: SkillScore[] = SKILLS.map((skill) => {
    const items = review.filter((r) => r.question.skill === skill);
    const c = items.filter((r) => r.isCorrect).length;
    return { skill, correct: c, total: items.length, percent: items.length ? Math.round((c / items.length) * 100) : 0 };
  });

  let status = classify(overall);
  const downgraded = status === "Exam Ready" && skills.some((s) => s.percent < MIN_SKILL_PERCENT);
  if (downgraded) status = "Almost Ready";

  // Weakest areas: missed topics, ordered by how weak their skill is; max 3.
  const rank = (s: Skill) => skills.find((x) => x.skill === s)!.percent;
  const seen = new Set<string>();
  const weakAreas: WeakArea[] = review
    .filter((r) => !r.isCorrect)
    .sort((a, b) => rank(a.question.skill) - rank(b.question.skill))
    .filter((r) => !seen.has(r.question.topic) && !!seen.add(r.question.topic))
    .slice(0, 3)
    .map((r) => ({ topic: r.question.topic, skill: r.question.skill, tip: r.question.tip }));

  return { overall, correct, total: qs.length, status, downgraded, skills, weakAreas, review };
}

export const STATUS_ADVICE: Record<Status, string> = {
  "Exam Ready": "Your basics look solid. Take a full official mock exam (including speaking and writing) before booking.",
  "Almost Ready": "You are close. Focus on the weak areas below for 1–2 weeks, then retake this check.",
  "Not Ready": "Build your foundations first. Work through the recommendations below and retake in 2–4 weeks.",
};
