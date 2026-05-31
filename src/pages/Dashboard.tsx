import { Job, Shift } from "../types";
import { calcNet } from "../utils/hmrc";

export default function Dashboard({
  jobs,
  shifts
}: {
  jobs: Job[];
  shifts: Shift[];
}) {
  return (
    <div>
      {jobs.map(job => {
        const jobShifts = shifts.filter(s => s.jobId === job.id);
        const result = calcNet(job, jobShifts);

        return (
          <div key={job.id}>
            <h3>{job.name}</h3>
            <p>Gross: £{result.gross.toFixed(2)}</p>
            <p>Tax: £{result.tax.toFixed(2)}</p>
            <p>NI: £{result.ni.toFixed(2)}</p>
            <p><b>Net: £{result.net.toFixed(2)}</b></p>
          </div>
        );
      })}
    </div>
  );
}
