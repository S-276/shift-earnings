import { useState } from "react";
import JobCards from "./components/JobCards"; // match your component name
import { Job, WeekEntry } from "./types";

// Unified finance module
import { calcNet, calcJobGross, calcTax, calcNI } from "./utils/finance";

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [weeks, setWeeks] = useState<WeekEntry[]>([]);

  // Add a new weekly entry
  function addWeek(w: WeekEntry) {
    setWeeks(prev => [...prev, w]);
  }

  // Compute total gross money across all jobs
  const totalGross = jobs.reduce((sum, job) => {
    const jobWeeks = weeks.filter(w => w.jobId === job.id);
    return sum + calcJobGross(job, jobWeeks);
  }, 0);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <h1>Shift Tracker (Weekly Mode)</h1>

      {jobs.map(job => (
        <JobCards
          key={job.id}
          job={job}
          weeks={weeks}
          onAddWeek={addWeek}
        />
      ))}

      <div style={{ marginTop: 30, borderTop: "1px solid #eee", paddingTop: 10 }}>
        <h3>Summary</h3>
        <p>Total gross: £{totalGross.toFixed(2)}</p>
      </div>
    </div>
  );
}
