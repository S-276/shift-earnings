import { Shift } from "../types";

export function calculateHours(shift: Shift): number {
  const start = new Date(`2000-01-01T${shift.start}`);
  const end = new Date(`2000-01-01T${shift.end}`);

  const minutes = (end.getTime() - start.getTime()) / 60000;
  return (minutes - shift.breakMinutes) / 60;
}
