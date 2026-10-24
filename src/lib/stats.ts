import type { Student } from "../lib/supabase";

export function totalScore(s: Pick<Student, "math_score" | "science_score" | "english_score">): number {
  return s.math_score + s.science_score + s.english_score;
}

export function averageScore(s: Pick<Student, "math_score" | "science_score" | "english_score">): number {
  return Math.round((totalScore(s) / 3) * 10) / 10;
}

export function gradeBadgeClass(grade: string): string {
  switch (grade) {
    case "A":
      return "badge badge-a";
    case "B":
      return "badge badge-b";
    case "C":
      return "badge badge-c";
    default:
      return "badge";
  }
}

export interface Stats {
  count: number;
  avgMath: number;
  avgScience: number;
  avgEnglish: number;
  topPerformer: Student | null;
  gradeCounts: Record<string, number>;
  maleAvg: { math: number; science: number; english: number; overall: number } | null;
  femaleAvg: { math: number; science: number; english: number; overall: number } | null;
  above80Math: number;
}

export function computeStats(students: Student[]): Stats {
  if (students.length === 0) {
    return {
      count: 0,
      avgMath: 0,
      avgScience: 0,
      avgEnglish: 0,
      topPerformer: null,
      gradeCounts: {},
      maleAvg: null,
      femaleAvg: null,
      above80Math: 0,
    };
  }

  const sum = students.reduce(
    (acc, s) => {
      acc.math += s.math_score;
      acc.science += s.science_score;
      acc.english += s.english_score;
      return acc;
    },
    { math: 0, science: 0, english: 0 }
  );

  const avg = (n: number) => Math.round((n / students.length) * 10) / 10;

  const gradeCounts: Record<string, number> = {};
  for (const s of students) {
    gradeCounts[s.grade] = (gradeCounts[s.grade] || 0) + 1;
  }

  const topPerformer = [...students].sort(
    (a, b) => totalScore(b) - totalScore(a)
  )[0];

  const males = students.filter((s) => s.gender.toLowerCase() === "male");
  const females = students.filter((s) => s.gender.toLowerCase() === "female");

  const groupAvg = (group: Student[]) => {
    if (group.length === 0) return null;
    const m = group.reduce((a, s) => a + s.math_score, 0) / group.length;
    const sc = group.reduce((a, s) => a + s.science_score, 0) / group.length;
    const e = group.reduce((a, s) => a + s.english_score, 0) / group.length;
    return {
      math: Math.round(m * 10) / 10,
      science: Math.round(sc * 10) / 10,
      english: Math.round(e * 10) / 10,
      overall: Math.round(((m + sc + e) / 3) * 10) / 10,
    };
  };

  return {
    count: students.length,
    avgMath: avg(sum.math),
    avgScience: avg(sum.science),
    avgEnglish: avg(sum.english),
    topPerformer,
    gradeCounts,
    maleAvg: groupAvg(males),
    femaleAvg: groupAvg(females),
    above80Math: students.filter((s) => s.math_score > 80).length,
  };
}
