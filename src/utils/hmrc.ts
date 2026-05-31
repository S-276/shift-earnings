import { Job, Shift } from "../types";
import { calculateHours } from "./shifts";

const PERSONAL_ALLOWANCE = 12570 / 12;
const BASIC_LIMIT = (50270 - 12570) / 12;

export function calcJobGross(job: Job, shifts: Shift[]) {
  return shifts.reduce((total, s) => {
    const hours = calculateHours(s);
    return total + hours * job.hourlyRate;
  }, 0);
}

export function calcTax(job: Job, gross: number) {
  let taxable = 0;

  switch (job.taxCode) {
    case "1257L":
      taxable = Math.max(0, gross - PERSONAL_ALLOWANCE);

      if (taxable <= BASIC_LIMIT) return taxable * 0.2;

      return BASIC_LIMIT * 0.2 + (taxable - BASIC_LIMIT) * 0.4;

    case "BR":
      return gross * 0.2;

    case "D0":
      return gross * 0.4;

    case "D1":
      return gross * 0.45;
  }
}

export function calcNI(gross: number) {
  const LEL = 1048;
  const UEL = 4189;

  if (gross <= LEL) return 0;

  if (gross <= UEL) return (gross - LEL) * 0.12;

  return (UEL - LEL) * 0.12 + (gross - UEL) * 0.02;
}

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
