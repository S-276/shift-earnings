import { useState } from "react";
import JobCard from "./components/JobCard";
import { Job, WeekEntry } from "./types";

// keep your existing tax logic
import { calcTax, calcNI } from "./utils/tax";

export default function App() {
  const [jobs] = useState<Job[]>([]);
  const [weeks, setWeeks] = useState<WeekEntry[]>([]);

  function addWeek(w: WeekEntry) {
    setWeeks(prev => [...prev, w]);
  }

  const totalGross = weeks.reduce((a, w) => a + w.totalHours, 0);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <h1>Shift Tracker (Weekly Mode)</h1>

      {jobs.map(job => (
        <JobCard
          key={job.id}
          job={job}
          weeks={weeks}
          onAddWeek={addWeek}
          calcTax={calcTax}
          calcNI={calcNI}
        />
      ))}

      <div style={{ marginTop: 30 }}>
        <h3>Summary</h3>
        <p>Total hours: {totalGross}</p>
      </div>
    </div>
  );
}
