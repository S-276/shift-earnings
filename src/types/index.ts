export type PayCycleType = "variable" | "fixed";

export type NiPeriodType = "monthly" | "pay-period-weeks";

export type PayePeriodType = "monthly" | "weekly";

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
  payePeriodType: PayePeriodType;

  includeHolidayPay: boolean;
  holidayPayRate: number;

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

  basicGross: number;
  holidayPay: number;
  gross: number;

  tax: number;
  ni: number;
  net: number;

  taxPeriodNumber: number;
  taxPeriodType: PayePeriodType;
  payday: string;
}
