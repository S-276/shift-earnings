export interface Job {
  id: string;
  name: string;
  hourlyRate: number;
  taxCode: "757L" | "BR" | "D0" | "500L";
}

export interface Shift {
  id: string;
  jobId: string;
  date: string;
  start: string;
  end: string;
  breakMinutes: number;
}

export interface JobEarnings {
  jobId: string;
  gross: number;
  tax: number;
  ni: number;
  net: number;
}
