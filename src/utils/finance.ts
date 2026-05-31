import { Job, WeekEntry } from "../types";

/**
 * Custom allowances and HMRC simplified rules
 */
const ALLOWANCES: Record<string, number> = {
  "757L": 757,
  "500L": 500,
  "BR": 0,
  "D0": 0
};

/**
 * National Insurance (per month, simplified)
 */
export function calcNI(gross: number): number {
  const LEL = 1048; // lower threshold
  const UEL = 4189; // upper threshold

  if (gross <= LEL) return 0;
  if (gross <= UEL) return (gross - LEL) * 0.12;
  return (UEL - LEL) * 0.12 + (gross - UEL) * 0.02;
}

/**
 * Tax calculation combining custom allowance & simplified HMRC rules
 */
export function calcTax(job: Job, gross: number): number {
  const allowance = ALLOWANCES[job.taxCode] ?? 0;
  const taxable = Math.max(0, gross - allowance);

  switch (job.taxCode) {
    case "757L":
    case "500L":
      const BASIC_LIMIT = 2000; // simplified monthly basic rate limit
      if (taxable <= BASIC_LIMIT) return taxable * 0.2;
      return BASIC_LIMIT * 0.2 + (taxable - BASIC_LIMIT) * 0.4;

    case "BR":
      return gross * 0.2;

    case "D0":
      return gross * 0.35;

    default:
      return 0;
  }
}

/**
 * Calculate gross pay for a job based on weekly entries
 */
export function calcJobGross(job: Job, weeks: WeekEntry[]): number {
  return weeks.reduce((total, w) => total + w.totalHours * job.hourlyRate, 0);
}

/**
 * Unified net calculation combining gross, tax, NI
 */
export function calcNet(job: Job, weeks: WeekEntry[]) {
  const gross = calcJobGross(job, weeks);
  const tax = calcTax(job, gross);
  const ni = calcNI(gross);

  return {
    gross,
    tax,
    ni,
    net: gross - tax - ni
  };
}
