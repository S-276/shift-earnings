import { Job, Shift } from "../types";
import { calculateHours } from "./shifts";

/**
 * Custom allowance per job type
 */
const ALLOWANCES: Record<string, number> = {
  "757L": 757,
  "500L": 500,
  "BR": 0,    // BR = basic rate taxed 20% on full gross
  "D0": 0     // D0 = fun mode flat tax
};

/**
 * Calculate gross pay for a job based on shifts
 */
export function calcJobGross(job: Job, shifts: Shift[]): number {
  return shifts.reduce((total, s) => {
    const hours = calculateHours(s);
    return total + hours * job.hourlyRate;
  }, 0);
}

/**
 * Calculate tax based on custom allowance
 */
export function calcTax(job: Job, gross: number): number {
  const allowance = ALLOWANCES[job.taxCode] ?? 0;
  const taxable = Math.max(0, gross - allowance);

  switch (job.taxCode) {
    case "757L":
    case "500L":
      // simplified progressive: first £BASIC_LIMIT taxed 20%, remainder 40%
      const BASIC_LIMIT = 2000; // tweak for MVP
      if (taxable <= BASIC_LIMIT) return taxable * 0.2;
      return BASIC_LIMIT * 0.2 + (taxable - BASIC_LIMIT) * 0.4;

    case "BR":
      // all income taxed at 20%, ignores allowance
      return gross * 0.2;

    case "D0":
      // fun flat 35% for D0
      return gross * 0.35;

    default:
      return 0;
  }
}

/**
 * National Insurance (per month, simplified)
 */
export function calcNI(gross: number): number {
  const LEL = 1048; // lower limit
  const UEL = 4189; // upper limit

  if (gross <= LEL) return 0;
  if (gross <= UEL) return (gross - LEL) * 0.12;
  return (UEL - LEL) * 0.12 + (gross - UEL) * 0.02;
}

/**
 * Return full net calculation for a job
 */
export function calcNet(job: Job, shifts: Shift[]) {
  const gross = calcJobGross(job, shifts);
  const tax = calcTax(job, gross);
  const ni = calcNI(gross);

  return {
    gross,
    tax,
    ni,
    net: gross - tax - ni
  };
}
