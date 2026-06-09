import { Job } from "../types";

const JOBS_KEY = "shift_earnings_jobs_v4";
const TIPS_KEY = "shift_earnings_tips_v4";

export function saveJobs(jobs: Job[]): void {
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
}

export function loadJobs(): Job[] {
  const raw = localStorage.getItem(JOBS_KEY);

  if (!raw) return [];

  try {
    return JSON.parse(raw) as Job[];
  } catch {
    return [];
  }
}

export function saveTips(amount: number): void {
  localStorage.setItem(TIPS_KEY, String(amount));
}

export function loadTips(): number {
  const raw = localStorage.getItem(TIPS_KEY);
  return raw ? Number(raw) : 0;
}
