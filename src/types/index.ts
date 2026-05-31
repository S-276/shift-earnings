/** Represents a single Job */
export interface Job {
  id: string;
  name: string;
  monthlyHours: number;
  hourlyRate: number;
  taxCode: "1257L" | "BR" | "D0" | "D1";
  niThresholdMonthly?: number; // optional
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
