import { useState } from "react";
import { Shift, Job } from "../types";

export default function ShiftForm({
  jobs,
  onAdd
}: {
  jobs: Job[];
  onAdd: (s: Shift) => void;
}) {
  const [jobId, setJobId] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [breakMin, setBreakMin] = useState(0);

  function submit() {
    onAdd({
      id: crypto.randomUUID(),
      jobId,
      date: new Date().toISOString(),
      start,
      end,
      breakMinutes: breakMin
    });
  }

  return (
    <div>
      <select onChange={e => setJobId(e.target.value)}>
        <option>Select Job</option>
        {jobs.map(j => (
          <option key={j.id} value={j.id}>
            {j.name}
          </option>
        ))}
      </select>

      <input type="time" onChange={e => setStart(e.target.value)} />
      <input type="time" onChange={e => setEnd(e.target.value)} />
      <input type="number" onChange={e => setBreakMin(+e.target.value)} />

      <button onClick={submit}>Add Shift</button>
    </div>
  );
}
