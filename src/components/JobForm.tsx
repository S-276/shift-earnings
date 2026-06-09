import { useState } from "react";
import { Job, NiPeriodType, PayCycleType, PayePeriodType } from "../types";

interface JobFormProps {
  onAdd: (job: Job) => void;
}

export default function JobForm({ onAdd }: JobFormProps) {
  const [name, setName] = useState("");
  const [taxCode, setTaxCode] = useState("S1131L");
  const [hourlyRate, setHourlyRate] = useState(0);
  const [payCycleType, setPayCycleType] = useState<PayCycleType>("variable");
  const [niPeriodType, setNiPeriodType] = useState<NiPeriodType>("monthly");
  const [payePeriodType, setPayePeriodType] = useState<PayePeriodType>("monthly");
  const [includeHolidayPay, setIncludeHolidayPay] = useState(false);
  const [holidayPayRate, setHolidayPayRate] = useState(12.07);

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
      niPeriodType,
      payePeriodType,
      includeHolidayPay,
      holidayPayRate,
      previousGrossYTD: 0,
      previousTaxPaidYTD: 0
    };

    onAdd(job);

    setName("");
    setTaxCode("S1131L");
    setHourlyRate(0);
    setPayCycleType("variable");
    setNiPeriodType("monthly");
    setPayePeriodType("monthly");
    setIncludeHolidayPay(false);
    setHolidayPayRate(12.07);
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
            onChange={e => setPayCycleType(e.target.value as PayCycleType)}
          >
            <option value="variable">Variable employer schedule</option>
            <option value="fixed">Custom dates</option>
          </select>
        </label>

        <label>
          PAYE period
          <select
            value={payePeriodType}
            onChange={e => setPayePeriodType(e.target.value as PayePeriodType)}
          >
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
          </select>
        </label>

        <label>
          NI period
          <select
            value={niPeriodType}
            onChange={e => setNiPeriodType(e.target.value as NiPeriodType)}
          >
            <option value="monthly">Monthly</option>
            <option value="pay-period-weeks">Use actual pay-period weeks</option>
          </select>
        </label>

        <label>
          Include accrued holiday pay?
          <select
            value={includeHolidayPay ? "yes" : "no"}
            onChange={e => setIncludeHolidayPay(e.target.value === "yes")}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </label>

        <label>
          Holiday pay rate %
          <input
            type="number"
            min="0"
            step="0.01"
            value={holidayPayRate}
            onChange={e => setHolidayPayRate(Number(e.target.value))}
          />
        </label>
      </div>

      <button className="primary-btn" onClick={submit}>
        Add source
      </button>
    </div>
  );
}
