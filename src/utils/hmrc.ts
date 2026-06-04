import { Job, JobResult } from "../types";

type Region = "scotland" | "rest-of-uk";

interface TaxCodeInfo {
  region: Region;
  cleanCode: string;
  allowance: number;
  flatRate?: number;
}

/**
 * Converts tax codes like:
 * S1131L -> Scottish, £11,310 allowance
 * S126L  -> Scottish, £1,260 allowance
 * S0T    -> Scottish, £0 allowance, normal Scottish bands
 * BR     -> 20% flat
 * SBR    -> 20% flat Scottish basic rate
 */
export function parseTaxCode(taxCode: string): TaxCodeInfo {
  const raw = taxCode.toUpperCase().replace(/\s+/g, "");
  const isScottish = raw.startsWith("S");

  const cleanCode = isScottish ? raw.slice(1) : raw;
  const region: Region = isScottish ? "scotland" : "rest-of-uk";

  if (cleanCode === "BR") {
    return {
      region,
      cleanCode,
      allowance: 0,
      flatRate: 0.2
    };
  }

  if (cleanCode === "D0") {
    return {
      region,
      cleanCode,
      allowance: 0,
      flatRate: region === "scotland" ? 0.42 : 0.4
    };
  }

  if (cleanCode === "D1") {
    return {
      region,
      cleanCode,
      allowance: 0,
      flatRate: region === "scotland" ? 0.45 : 0.45
    };
  }

  if (cleanCode === "0T") {
    return {
      region,
      cleanCode,
      allowance: 0
    };
  }

  const lCodeMatch = cleanCode.match(/^(\d+)L$/);

  if (lCodeMatch) {
    return {
      region,
      cleanCode,
      allowance: Number(lCodeMatch[1]) * 10
    };
  }

  return {
    region,
    cleanCode,
    allowance: 0
  };
}

export function calcGross(job: Job): number {
  return job.hourlyRate * job.hoursWorked;
}

/**
 * UK tax month:
 * Month 1 = 6 Apr to 5 May
 * Month 2 = 6 May to 5 Jun
 * ...
 * Month 12 = 6 Mar to 5 Apr
 */
export function getTaxMonthNumber(payday: string): number {
  if (!payday) return 1;

  const date = new Date(payday + "T00:00:00");
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if (month === 4 && day >= 6) return 1;
  if (month === 5 && day <= 5) return 1;

  if (month === 5 && day >= 6) return 2;
  if (month === 6 && day <= 5) return 2;

  if (month === 6 && day >= 6) return 3;
  if (month === 7 && day <= 5) return 3;

  if (month === 7 && day >= 6) return 4;
  if (month === 8 && day <= 5) return 4;

  if (month === 8 && day >= 6) return 5;
  if (month === 9 && day <= 5) return 5;

  if (month === 9 && day >= 6) return 6;
  if (month === 10 && day <= 5) return 6;

  if (month === 10 && day >= 6) return 7;
  if (month === 11 && day <= 5) return 7;

  if (month === 11 && day >= 6) return 8;
  if (month === 12 && day <= 5) return 8;

  if (month === 12 && day >= 6) return 9;
  if (month === 1 && day <= 5) return 9;

  if (month === 1 && day >= 6) return 10;
  if (month === 2 && day <= 5) return 10;

  if (month === 2 && day >= 6) return 11;
  if (month === 3 && day <= 5) return 11;

  return 12;
}

function taxFromBands(taxable: number, bands: { limit: number; rate: number }[]): number {
  let remaining = taxable;
  let tax = 0;
  let previousLimit = 0;

  for (const band of bands) {
    if (remaining <= 0) break;

    const bandWidth = band.limit - previousLimit;
    const amountInBand = Math.min(remaining, bandWidth);

    tax += amountInBand * band.rate;
    remaining -= amountInBand;
    previousLimit = band.limit;
  }

  return tax;
}

/**
 * Annual taxable-income bands after allowance.
 * This is suitable for estimating PAYE.
 */
export function calcAnnualTax(taxableIncome: number, region: Region): number {
  if (taxableIncome <= 0) return 0;

  if (region === "scotland") {
    const scottishBands = [
      { limit: 3967, rate: 0.19 },
      { limit: 16956, rate: 0.2 },
      { limit: 31092, rate: 0.21 },
      { limit: 62430, rate: 0.42 },
      { limit: 112570, rate: 0.45 },
      { limit: Infinity, rate: 0.48 }
    ];

    return taxFromBands(taxableIncome, scottishBands);
  }

  const ukBands = [
    { limit: 37700, rate: 0.2 },
    { limit: 125140 - 12570, rate: 0.4 },
    { limit: Infinity, rate: 0.45 }
  ];

  return taxFromBands(taxableIncome, ukBands);
}

/**
 * Cumulative PAYE estimate.
 *
 * Needs:
 * - current gross
 * - previous gross YTD
 * - previous tax paid YTD
 * - tax month number
 * - tax code
 */
export function calcCumulativePAYE(job: Job, grossThisPeriod: number, payday: string): number {
  const taxCode = parseTaxCode(job.taxCode);
  const taxMonthNumber = getTaxMonthNumber(payday);

  if (taxCode.flatRate !== undefined) {
    return grossThisPeriod * taxCode.flatRate;
  }

  const allowanceToDate = (taxCode.allowance * taxMonthNumber) / 12;

  const grossToDate = job.previousGrossYTD + grossThisPeriod;
  const taxableToDate = Math.max(0, grossToDate - allowanceToDate);

  const annualisedTaxable = taxableToDate * (12 / taxMonthNumber);
  const annualTax = calcAnnualTax(annualisedTaxable, taxCode.region);
  const taxDueToDate = annualTax * (taxMonthNumber / 12);

  const taxThisPeriod = taxDueToDate - job.previousTaxPaidYTD;

  return Math.max(0, taxThisPeriod);
}

/**
 * Simplified monthly employee NI estimate.
 * Suitable because your pay is paid monthly-ish.
 */
function getWeeksInPayPeriod(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 4;

  const start = new Date(startDate + "T00:00:00");
  const end = new Date(endDate + "T00:00:00");

  const daysInclusive =
    Math.round((end.getTime() - start.getTime()) / 86400000) + 1;

  return Math.max(1, Math.round(daysInclusive / 7));
}

export function calcNI(
  gross: number,
  niPeriodType: "monthly" | "pay-period-weeks",
  startDate: string,
  endDate: string
): number {
  let primaryThreshold: number;
  let upperEarningsLimit: number;

  if (niPeriodType === "monthly") {
    primaryThreshold = 1048;
    upperEarningsLimit = 4189;
  } else {
    const weeks = getWeeksInPayPeriod(startDate, endDate);
    primaryThreshold = 242 * weeks;
    upperEarningsLimit = 967 * weeks;
  }

  if (gross <= primaryThreshold) return 0;

  if (gross <= upperEarningsLimit) {
    return (gross - primaryThreshold) * 0.08;
  }

  return (
    (upperEarningsLimit - primaryThreshold) * 0.08 +
    (gross - upperEarningsLimit) * 0.02
  );
}

export function calcJobResult(
  job: Job,
  payday: string,
  startDate: string,
  endDate: string
): JobResult {
  const gross = calcGross(job);
  const tax = calcCumulativePAYE(job, gross, payday);
  const ni = calcNI(gross, job.niPeriodType, startDate, endDate);
  const taxMonthNumber = getTaxMonthNumber(payday);

  return {
    jobId: job.id,
    name: job.name,
    taxCode: job.taxCode,
    gross,
    tax,
    ni,
    net: gross - tax - ni,
    taxMonthNumber,
    payday
  };
}
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP"
  }).format(value || 0);
}
