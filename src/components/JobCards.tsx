import { Job, PayPeriod } from "../types";
import { calcJobResult, formatCurrency } from "../utils/hmrc";

interface JobCardProps {
  job: Job;
  payPeriods: PayPeriod[];
  onUpdate: (job: Job) => void;
  onDelete: (id: string) => void;
}

export default function JobCards({
  job,
  payPeriods,
  onUpdate,
  onDelete
}: JobCardProps) {
  const selectedPeriod =
    payPeriods.find(p => p.id === job.selectedPayPeriodId) || payPeriods[0];

  const payday =
    job.payCycleType === "variable"
      ? selectedPeriod?.payday || ""
      : job.customPayday || "";

  const startDate =
    job.payCycleType === "variable"
      ? selectedPeriod?.startDate || ""
      : job.customStartDate || "";

  const endDate =
    job.payCycleType === "variable"
      ? selectedPeriod?.endDate || ""
      : job.customEndDate || "";

  const result = calcJobResult(job, payday, startDate, endDate);

  function update<K extends keyof Job>(key: K, value: Job[K]) {
    onUpdate({
      ...job,
      [key]: value
    });
  }

  return (
    <div className="card job-card">
      <div className="job-header">
        <div>
          <h2>{job.name}</h2>
          <p className="muted">Tax code: {job.taxCode}</p>
        </div>

        <button className="danger-btn" onClick={() => onDelete(job.id)}>
          Delete
        </button>
      </div>

      <div className="form-grid">
        <label>
          Job name
          <input
            value={job.name}
            onChange={e => update("name", e.target.value)}
          />
        </label>

        <label>
          Tax code
          <input
            value={job.taxCode}
            onChange={e => update("taxCode", e.target.value.toUpperCase())}
          />
        </label>

        <label>
          Hourly rate
          <input
            type="number"
            min="0"
            step="0.01"
            value={job.hourlyRate}
            onChange={e => update("hourlyRate", Number(e.target.value))}
          />
        </label>

        <label>
          Hours in this pay period
          <input
            type="number"
            min="0"
            step="0.25"
            value={job.hoursWorked}
            onChange={e => update("hoursWorked", Number(e.target.value))}
          />
        </label>

        <label>
          Previous gross YTD
          <input
            type="number"
            min="0"
            step="0.01"
            value={job.previousGrossYTD}
            onChange={e => update("previousGrossYTD", Number(e.target.value))}
          />
        </label>

        <label>
          Previous PAYE tax paid YTD
          <input
            type="number"
            min="0"
            step="0.01"
            value={job.previousTaxPaidYTD}
            onChange={e => update("previousTaxPaidYTD", Number(e.target.value))}
          />
        </label>

        <label>
          PAYE period
          <select
            value={job.payePeriodType}
            onChange={e =>
              update("payePeriodType", e.target.value as Job["payePeriodType"])
            }
          >
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
          </select>
        </label>

        <label>
          NI period
          <select
            value={job.niPeriodType}
            onChange={e =>
              update("niPeriodType", e.target.value as Job["niPeriodType"])
            }
          >
            <option value="monthly">Monthly</option>
            <option value="pay-period-weeks">Use actual pay-period weeks</option>
          </select>
        </label>

        <label>
          Include accrued holiday pay?
          <select
            value={job.includeHolidayPay ? "yes" : "no"}
            onChange={e => update("includeHolidayPay", e.target.value === "yes")}
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
            value={job.holidayPayRate}
            onChange={e => update("holidayPayRate", Number(e.target.value))}
          />
        </label>
      </div>

      {job.payCycleType === "variable" ? (
        <div className="section">
          <label>
            Pay period
            <select
              value={job.selectedPayPeriodId || selectedPeriod?.id}
              onChange={e => update("selectedPayPeriodId", e.target.value)}
            >
              {payPeriods.map(period => (
                <option key={period.id} value={period.id}>
                  {period.label}
                </option>
              ))}
            </select>
          </label>

          {selectedPeriod && (
            <p className="muted">
              {selectedPeriod.startDate} to {selectedPeriod.endDate} — paid on{" "}
              {selectedPeriod.payday}
            </p>
          )}
        </div>
      ) : (
        <div className="section">
          <h3>Custom pay period</h3>

          <div className="form-grid">
            <label>
              Start date
              <input
                type="date"
                value={job.customStartDate || ""}
                onChange={e => update("customStartDate", e.target.value)}
              />
            </label>

            <label>
              End date
              <input
                type="date"
                value={job.customEndDate || ""}
                onChange={e => update("customEndDate", e.target.value)}
              />
            </label>

            <label>
              Payday
              <input
                type="date"
                value={job.customPayday || ""}
                onChange={e => update("customPayday", e.target.value)}
              />
            </label>
          </div>
        </div>
      )}

      <div className="results-grid six-results">
        <div>
          <span>Basic gross</span>
          <strong>{formatCurrency(result.basicGross)}</strong>
        </div>

        <div>
          <span>Holiday pay</span>
          <strong>{formatCurrency(result.holidayPay)}</strong>
        </div>

        <div>
          <span>Total gross</span>
          <strong>{formatCurrency(result.gross)}</strong>
        </div>

        <div>
          <span>PAYE</span>
          <strong>{formatCurrency(result.tax)}</strong>
        </div>

        <div>
          <span>NI</span>
          <strong>{formatCurrency(result.ni)}</strong>
        </div>

        <div>
          <span>Net</span>
          <strong>{formatCurrency(result.net)}</strong>
        </div>
      </div>

      <p className="muted small">
        Tax {result.taxPeriodType === "weekly" ? "week" : "month"} used:{" "}
        {result.taxPeriodNumber || "N/A"}
      </p>
    </div>
  );
}
