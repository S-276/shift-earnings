import { Job, WeekEntry } from "../types";

export function calcJobGross(job: Job, weeks: WeekEntry[]) {
  return weeks.reduce((sum, w) => sum + w.totalHours * job.hourlyRate, 0);
}

export function calcNet(job: Job, weeks: WeekEntry[], calcTax: any, calcNI: any) {
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
