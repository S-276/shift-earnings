import { Job, Shift } from "../types";

const JOBS_KEY = "jobs";
const SHIFTS_KEY = "shifts";

export const saveJobs = (jobs: Job[]) =>
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));

export const loadJobs = (): Job[] =>
  JSON.parse(localStorage.getItem(JOBS_KEY) || "[]");

export const saveShifts = (shifts: Shift[]) =>
  localStorage.setItem(SHIFTS_KEY, JSON.stringify(shifts));

export const loadShifts = (): Shift[] =>
  JSON.parse(localStorage.getItem(SHIFTS_KEY) || "[]");
