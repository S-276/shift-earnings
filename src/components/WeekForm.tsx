import { useState } from "react";
import { WeekEntry } from "../types";

export default function WeekForm({
  jobId,
  onAdd
}: {
  jobId: string;
  onAdd: (w: WeekEntry) => void;
}) {
  const [weekStart, setWeekStart] = useState("");
  const [hours, setHours] = useState(0);

  function submit() {
    if (!weekStart || hours <= 0) return;

    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    onAdd({
      id: crypto.randomUUID(),
      jobId,
      weekStart,
      weekEnd: end.toISOString().split("T")[0],
      totalHours: hours
    });

    setWeekStart("");
    setHours(0);
  }

  return (
    <div style={styles.form}>
      <input type="date" value={weekStart} onChange={e => setWeekStart(e.target.value)} />
      <input
        type="number"
        placeholder="Hours this week"
        value={hours}
        onChange={e => setHours(+e.target.value)}
      />
      <button onClick={submit}>Add Week</button>
    </div>
  );
}

const styles = {
  form: {
    display: "flex",
    gap: 8,
    marginTop: 10
  }
};
