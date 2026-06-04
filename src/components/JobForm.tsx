import { useState } from "react";
import { Job } from "../types";

interface JobFormProps {
  onAdd: (job: Job) => void;
}

export default function JobForm({ onAdd }: JobFormProps) {
  const [name, setName] = useState("");
  const [taxCode, setTaxCode] = useState("S1131L");
  const [hourlyRate, setHourlyRate] = useState(0);
  const [payCycleType, setPayCycleType] = useState<"variable" | "fixed">("variable");

  function submit() {
    if (!name.trim()) return;
    if (hourlyRate <= 0) return;

    const job: Job = {
      id: crypto.randomUUID(),
      name: name.trim(),
      taxCode: taxCode.trim().toUpperCase(),
      hourlyRate,
      hoursWorked: 0,
      payCycleType,
      previousGrossYTD: 0,
      previousTaxPaidYTD: 0
    };

    onAdd(job);

    setName("");
    setTaxCode("S1131L");
    setHourlyRate(0);
    setPayCycleType("variable");
  }

  return (
    <div className="card">
      <h2>Add income source</h2>

      <div className="form-grid">
        <label>
          Name
          <input
            value={name}
            placeholder="Example: Main job"
            onChange={e => setName(e.target.value)}
          />
        </label>

        <label>
          Tax code
          <input
            value={taxCode}
            placeholder="S1131L"
            onChange={e => setTaxCode(e.target.value)}
          />
        </label>

        <label>
          Hourly rate
          <input
            type="number"
            min="0"
            step="0.01"
            value={hourlyRate}
            onChange={e => setHourlyRate(Number(e.target.value))}
          />
        </label>

        <label>
          Pay cycle
          <select
            value={payCycleType}
            onChange={e => setPayCycleType(e.target.value as "variable" | "fixed")}
          >
            <option value="variable">Variable employer schedule</option>
            <option value="fixed">Custom dates</option>
          </select>
        </label>
      </div>

      <button className="primary-btn" onClick={submit}>
        Add source
      </button>
    </div>
  );
}
