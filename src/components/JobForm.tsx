import { useState } from "react";
import { Job } from "../types";

export default function JobForm({
  onAdd
}: {
  onAdd: (job: Job) => void;
}) {
  const [name, setName] = useState("");
  const [rate, setRate] = useState(0);
  const [taxCode, setTaxCode] = useState<Job["taxCode"]>("1257L");

  function submit() {
    onAdd({
      id: crypto.randomUUID(),
      name,
      hourlyRate: rate,
      taxCode
    });

    setName("");
    setRate(0);
  }

  return (
    <div>
      <input placeholder="Job" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Rate" type="number" value={rate} onChange={e => setRate(+e.target.value)} />

      <select value={taxCode} onChange={e => setTaxCode(e.target.value as any)}>
        <option value="1257L">1257L</option>
        <option value="BR">BR</option>
        <option value="D0">D0</option>
        <option value="D1">D1</option>
      </select>

      <button onClick={submit}>Add</button>
    </div>
  );
}
