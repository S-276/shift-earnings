import { Job } from "../types";

/**
 * Save jobs to localStorage
 */
export const saveJobs = (jobs: Job[]) => {
  localStorage.setItem("jobs", JSON.stringify(jobs));
};

/**
 * Load jobs from localStorage
 */
export const loadJobs = (): Job[] => {
  const data = localStorage.getItem("jobs");
  if (!data) return [];
  return JSON.parse(data) as Job[];
};
