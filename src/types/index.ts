export interface Job {
  id: string;
  name: string;
  hourlyRate: number;
  taxCode: "757L" | "500L" | "BR" | "D0";
}

export interface WeekEntry {
  id: string;
  jobId: string;
  weekStart: string;
  weekEnd: string;
  totalHours: number;
}
