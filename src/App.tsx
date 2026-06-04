import { useEffect, useMemo, useState } from "react";
import JobCards from "./components/JobCards";
import JobForm from "./components/JobForm";
import { Job, PayPeriod } from "./types";
import { calcJobResult, formatCurrency } from "./utils/hmrc";
import { loadJobs, loadTips, saveJobs, saveTips } from "./storage/localStorage";

const MAIN_JOB_PAY_PERIODS: PayPeriod[] = [
  {
    id: "2025-10-27",
    label: "27/10/2025 – 23/11/2025 | Paid 05/12/2025",
    startDate: "2025-10-27",
    endDate: "2025-11-23",
    payday: "2025-12-05"
  },
  {
    id: "2025-11-24",
    label: "24/11/2025 – 28/12/2025 | Paid 05/01/2026",
    startDate: "2025-11-24",
    endDate: "2025-12-28",
    payday: "2026-01-05"
  },
  {
    id: "2025-12-29",
    label: "29/12/2025 – 25/01/2026 | Paid 05/02/2026",
    startDate: "2025-12-29",
    endDate: "2026-01-25",
    payday: "2026-02-05"
  },
  {
    id: "2026-01-26",
    label: "26/01/2026 – 22/02/2026 | Paid 05/03/2026",
    startDate: "2026-01-26",
    endDate: "2026-02-22",
    payday: "2026-03-05"
  },
  {
    id: "2026-02-23",
    label: "23/02/2026 – 29/03/2026 | Paid 02/04/2026",
    startDate: "2026-02-23",
    endDate: "2026-03-29",
    payday: "2026-04-02"
  },
  {
    id: "2026-03-30",
    label: "30/03/2026 – 26/04/2026 | Paid 05/05/2026",
    startDate: "2026-03-30",
    endDate: "2026-04-26",
    payday: "2026-05-05"
  },
  {
    id: "2026-04-27",
    label: "27/04/2026 – 24/05/2026 | Paid 05/06/2026",
    startDate: "2026-04-27",
    endDate: "2026-05-24",
    payday: "2026-06-05"
  },
  {
    id: "2026-05-25",
    label: "25/05/2026 – 28/06/2026 | Paid 03/07/2026",
    startDate: "2026-05-25",
    endDate: "2026-06-28",
    payday: "2026-07-03"
  },
  {
    id: "2026-06-29",
    label: "29/06/2026 – 26/07/2026 | Paid 04/08/2026",
    startDate: "2026-06-29",
    endDate: "2026-07-26",
    payday: "2026-08-04"
  },
  {
    id: "2026-07-27",
    label: "27/07/2026 – 23/08/2026 | Paid 04/09/2026",
    startDate: "2026-07-27",
    endDate: "2026-08-23",
    payday: "2026-09-04"
  },
  {
    id: "2026-08-24",
    label: "24/08/2026 – 27/09/2026 | Paid 05/10/2026",
    startDate: "2026-08-24",
    endDate: "2026-09-27",
    payday: "2026-10-05"
  },
  {
    id: "2026-09-28",
    label: "28/09/2026 – 25/10/2026 | Paid 05/11/2026",
    startDate: "2026-09-28",
    endDate: "2026-10-25",
    payday: "2026-11-05"
  },
  {
    id: "2026-10-26",
    label: "26/10/2026 – 22/11/2026 | Paid 04/12/2026",
    startDate: "2026-10-26",
    endDate: "2026-11-22",
    payday: "2026-12-04"
  },
  {
    id: "2026-11-23",
    label: "23/11/2026 – 27/12/2026 | Paid 05/01/2027",
    startDate: "2026-11-23",
    endDate: "2026-12-27",
    payday: "2027-01-05"
  }
];

const DEFAULT_JOBS: Job[] = [
  {
    id: crypto.randomUUID(),
    name: "Main job salary",
    taxCode: "S1131L",
    hourlyRate: 0,
    hoursWorked: 0,
    payCycleType: "variable",
    selectedPayPeriodId: MAIN_JOB_PAY_PERIODS[0].id,
    previousGrossYTD: 0,
    previousTaxPaidYTD: 0
  },
  {
    id: crypto.randomUUID(),
    name: "Second job",
    taxCode: "S0T",
    hourlyRate: 0,
    hoursWorked: 0,
    payCycleType: "fixed",
    customStartDate: "",
    customEndDate: "",
    customPayday: "",
    previousGrossYTD: 0,
    previousTaxPaidYTD: 0
  }
];

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [tips, setTips] = useState(0);

  useEffect(() => {
    const savedJobs = loadJobs();
    setJobs(savedJobs.length > 0 ? savedJobs : DEFAULT_JOBS);
    setTips(loadTips());
  }, []);

  useEffect(() => {
    if (jobs.length > 0) {
      saveJobs(jobs);
    }
  }, [jobs]);

  useEffect(() => {
    saveTips(tips);
  }, [tips]);

  function addJob(job: Job) {
    setJobs(prev => [...prev, job]);
  }

  function updateJob(updatedJob: Job) {
    setJobs(prev => prev.map(job => (job.id === updatedJob.id ? updatedJob : job)));
  }

  function deleteJob(id: string) {
    setJobs(prev => prev.filter(job => job.id !== id));
  }

  function resetExampleJobs() {
    setJobs(DEFAULT_JOBS);
    setTips(0);
  }

  const results = useMemo(() => {
    return jobs.map(job => {
      const selectedPeriod =
        MAIN_JOB_PAY_PERIODS.find(period => period.id === job.selectedPayPeriodId) ||
        MAIN_JOB_PAY_PERIODS[0];

      const payday =
        job.payCycleType === "variable"
          ? selectedPeriod.payday
          : job.customPayday || "";

      return calcJobResult(job, payday);
    });
  }, [jobs]);

  const totals = useMemo(() => {
    return results.reduce(
      (acc, result) => {
        acc.gross += result.gross;
        acc.tax += result.tax;
        acc.ni += result.ni;
        acc.net += result.net;
        return acc;
      },
      {
        gross: 0,
        tax: 0,
        ni: 0,
        net: 0
      }
    );
  }, [results]);

  return (
    <div className="app">
      <header className="hero">
        <div>
          <p className="eyebrow">Personal PAYE estimator</p>
          <h1>UK Shift Earnings Calculator</h1>
          <p>
            Estimate planned net income from your main job and second job. Tips
            are tracked separately and not included in planned income.
          </p>
        </div>

        <button className="secondary-btn" onClick={resetExampleJobs}>
          Reset default jobs
        </button>
      </header>

      <section className="summary">
        <div className="summary-card">
          <span>Total gross</span>
          <strong>{formatCurrency(totals.gross)}</strong>
        </div>

        <div className="summary-card">
          <span>PAYE tax</span>
          <strong>{formatCurrency(totals.tax)}</strong>
        </div>

        <div className="summary-card">
          <span>National Insurance</span>
          <strong>{formatCurrency(totals.ni)}</strong>
        </div>

        <div className="summary-card highlight">
          <span>Planned net income</span>
          <strong>{formatCurrency(totals.net)}</strong>
        </div>
      </section>

      <section className="card">
        <h2>Tips / tronc</h2>
        <p className="muted">
          This is not included in the planned net income calculation.
        </p>

        <label>
          Tips received
          <input
            type="number"
            min="0"
            step="0.01"
            value={tips}
            onChange={e => setTips(Number(e.target.value))}
          />
        </label>

        <p className="tips-line">
          Extra money outside planned income: <strong>{formatCurrency(tips)}</strong>
        </p>
      </section>

      <JobForm onAdd={addJob} />

      <section>
        {jobs.map(job => (
          <JobCards
            key={job.id}
            job={job}
            payPeriods={MAIN_JOB_PAY_PERIODS}
            onUpdate={updateJob}
            onDelete={deleteJob}
          />
        ))}
      </section>

      <footer className="footer">
        This is an estimator, not official payroll software. For closest results,
        enter your gross YTD and PAYE tax paid YTD from your latest payslip.
      </footer>
    </div>
  );
}
