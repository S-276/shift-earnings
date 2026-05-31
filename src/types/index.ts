/** Represents a single Job */
export interface Job {
  id: string; // unique ID
  name: string; // e.g. "Hospital"
  monthlyHours: number; // total hours in the month
  hourlyRate: number; // £ per hour
}

/** Represents a calculated monthly earning */
export interface MonthlyEarnings {
  jobId: string;
  gross: number;
  tax: number;
  ni: number; // National Insurance
  net: number;
}

/** Represents the payday forecast */
export interface PaydayForecast {
  jobId: string;
  nextPayday: string; // ISO date
  netAmount: number;
}
