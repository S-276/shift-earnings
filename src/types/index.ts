/** Represents a single Job */
export interface Job {
  id: string;
  name: string;
  monthlyHours: number;
  hourlyRate: number;
  taxCode: "757L" | "BR" | "D0" | "500L";
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
