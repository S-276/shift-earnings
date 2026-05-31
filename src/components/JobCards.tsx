import { Job, WeekEntry } from "../types";
import WeekForm from "./WeekForm";
import { calcNet } from "../utils/calc";

export default function JobCard({
  job,
  weeks,
  onAddWeek,
  calcTax,
  calcNI
}: {
  job: Job;
  weeks: WeekEntry[];
  onAddWeek: (w: WeekEntry) => void;
  calcTax: any;
  calcNI: any;
}) {
  const jobWeeks = weeks.filter(w => w.jobId === job.id);
  const totals = calcNet(job, jobWeeks, calcTax, calcNI);

  return (
    <div style={styles.card}>
      <h2>
        {job.name} <span style={styles.tag}>{job.taxCode}</span>
      </h2>

      <p>£{job.hourlyRate}/hour</p>

      {/* WEEKS */}
      <div style={styles.section}>
        <h4>Weeks</h4>

        {jobWeeks.length === 0 && <p>No weeks added yet</p>}

        {jobWeeks.map(w => (
          <div key={w.id} style={styles.week}>
            <span>{w.weekStart}</span>
            <span>{w.totalHours}h</span>
          </div>
        ))}
      </div>

      {/* ADD WEEK */}
      <WeekForm jobId={job.id} onAdd={onAddWeek} />

      {/* TOTALS */}
      <div style={styles.totals}>
        <p>Gross: £{totals.gross.toFixed(2)}</p>
        <p>Tax: £{totals.tax.toFixed(2)}</p>
        <p>NI: £{totals.ni.toFixed(2)}</p>
        <p><b>Net: £{totals.net.toFixed(2)}</b></p>
      </div>
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #ddd",
    padding: 16,
    borderRadius: 10,
    marginBottom: 16
  },
  tag: {
    fontSize: 12,
    background: "#eee",
    padding: "2px 6px",
    marginLeft: 6
  },
  section: {
    marginTop: 10
  },
  week: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 14
  },
  totals: {
    marginTop: 10,
    borderTop: "1px solid #eee",
    paddingTop: 10
  }
};
