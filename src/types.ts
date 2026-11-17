export type Skill = "Vocabulary" | "Grammar" | "Reading";
export type Status = "Not Ready" | "Almost Ready" | "Exam Ready";

export interface Question {
  id: string;
  skill: Skill;
  topic: string;      // used to group weak areas
  passage?: string;   // reading text shown above the question
  prompt: string;
  options: string[];
  correct: number;    // index into options
  tip: string;        // practice recommendation if answered wrongly
}
export type Answers = Record<string, number>;

export interface SkillScore { skill: Skill; correct: number; total: number; percent: number }
export interface WeakArea { topic: string; skill: Skill; tip: string }
export interface Result {
  overall: number; correct: number; total: number; status: Status; downgraded: boolean;
  skills: SkillScore[]; weakAreas: WeakArea[]; review: { question: Question; chosen: number; isCorrect: boolean }[];
}
