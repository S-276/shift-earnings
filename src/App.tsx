import { useEffect, useState } from "react";
import JobForm from "./components/JobForm";
import ShiftForm from "./components/ShiftForm";
import Dashboard from "./pages/Dashboard";
import { Job, Shift } from "./types";
import { loadJobs, saveJobs, loadShifts, saveShifts } from "./storage/localStorage";

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);

  useEffect(() => {
    setJobs(loadJobs());
    setShifts(loadShifts());
  }, []);

  function addJob(job: Job) {
    const updated = [...jobs, job];
    setJobs(updated);
    saveJobs(updated);
  }

  function addShift(shift: Shift) {
    const updated = [...shifts, shift];
    setShifts(updated);
    saveShifts(updated);
  }

  return (
    <div>
      <h1>Shift Tracker</h1>

      <JobForm onAdd={addJob} />
      <ShiftForm jobs={jobs} onAdd={addShift} />

      <Dashboard jobs={jobs} shifts={shifts} />
    </div>
  );
}
