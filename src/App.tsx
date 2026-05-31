import { useState } from "react";
import JobCard from "./components/JobCards";
import JobForm from "./components/JobForm";
import { Job, WeekEntry } from "./types";

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [weeks, setWeeks] = useState<WeekEntry[]>([]);

  function addWeek(w: WeekEntry) {
    setWeeks(prev => [...prev, w]);
  }

  function addJob(job: Job) {
    setJobs(prev => [...prev, job]);
  }

  const totalGross = weeks.reduce((sum, w) => sum + w.totalHours, 0);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <h1>Shift Tracker (Weekly Mode)</h1>

      {/* ADD JOB FORM */}
      <JobForm onAdd={addJob} />

      {/* JOBS */}
      {jobs.map(job => (
        <JobCard
          key={job.id}
          job={job}
          weeks={weeks}
          onAddWeek={addWeek}
        />
      ))}

      <div style={{ marginTop: 30 }}>
        <h3>Summary</h3>
        <p>Total hours: {totalGross}</p>
      </div>
    </div>
  );
}
