export type PayCycleType = "variable" | "fixed";

export type NiPeriodType = "monthly" | "pay-period-weeks";

export interface PayPeriod {
  id: string;
  label: string;
  startDate: string;
  endDate: string;
  payday: string;
}

export interface Job {
  id: string;
  name: string;
  taxCode: string;
  hourlyRate: number;
  hoursWorked: number;
  payCycleType: PayCycleType;
  niPeriodType: NiPeriodType;
  selectedPayPeriodId?: string;
  customStartDate?: string;
  customEndDate?: string;
  customPayday?: string;
  previousGrossYTD: number;
  previousTaxPaidYTD: number;
}

export interface JobResult {
  jobId: string;
  name: string;
  taxCode: string;
  gross: number;
  tax: number;
  ni: number;
  net: number;
  taxMonthNumber: number;
  payday: string;
}
