# Am I Exam-Ready? – German A1 readiness check

A small React app that helps A1 German learners judge whether they are ready to book a Goethe or ÖSD A1 exam. 12 multiple-choice questions (4 vocabulary, 4 grammar, 4 reading) produce a score, a readiness level, a skill breakdown and targeted practice advice. Everything runs in the browser with local state; no backend, no login.

## Run it
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
```

## Stack
React 18, TypeScript (strict), Tailwind CSS v4 (via `@tailwindcss/vite`), Vite.

## Structure
```
src/data/questions.ts      question bank (content only, edit here to change questions)
src/lib/assessment.ts      scoring, classification, validation, recommendations (no UI)
src/types.ts               shared types
src/components/            ProgressHeader, QuestionCard, ScoreBar, Results
src/App.tsx                stage flow: intro → quiz → results
```

## Scoring methodology
- Overall score = correct answers ÷ total × 100, rounded (each question is worth about 8.3 points).
- Per-skill score = correct ÷ questions in that skill.
- Levels: **80–100 Exam Ready**, **60–79 Almost Ready**, **below 60 Not Ready**.
- Balance rule: an overall "Exam Ready" is lowered to "Almost Ready" if any skill is below 50%, because the real exam needs adequate performance in every part. The results page explains when this happens.
- Weak areas: every question has a `topic` and a `tip`. Missed topics are de-duplicated, ordered by the weakness of their skill, and the top 3 are shown with their practice advice. If nothing was missed, a "keep practising" message is shown instead.
- All numbers, levels and recommendations are computed from the answers at runtime.

## UX decisions
One question at a time, clickable question numbers, Previous/Next, and a Submit button disabled until all 12 are answered. Reading passages are shown with their questions. States handled: intro, invalid or empty question bank (error alert), and an incomplete-submission message.

## Limitations
A 12-question check is indicative, not diagnostic. Listening, writing and speaking are not assessed. Passing the official exam is not guaranteed. Add more questions in `questions.ts` for a more reliable result; the logic adapts automatically.
