"use client";

import { useMemo, useState } from "react";

const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const baseline = [82, 84, 88, 91, 94, 98, 96, 93, 97, 100, 95, 90];

export function RidershipPlanner() {
  const [freq, setFreq] = useState(0);
  const [fare, setFare] = useState(0);

  const series = useMemo(
    () =>
      baseline.map(
        (v) => v * (1 + 0.35 * (freq / 100)) * (1 - 0.22 * (fare / 100)),
      ),
    [freq, fare],
  );

  const annual = Math.round(series.reduce((a, b) => a + b, 0) * 12);
  const peak = Math.round(Math.max(...series));
  const delta = Math.round(((series[5] - baseline[5]) / baseline[5]) * 100);

  return (
    <div className="planner">
      <p className="kicker">Interactive · placeholder model</p>
      <h3>Scenario planner</h3>
      <p className="muted">
        Drag service frequency and fare level. Bars are an illustrative
        elasticity, not a calibrated agency model.
      </p>
      <div className="controls">
        <label>
          Service frequency {freq > 0 ? `+${freq}%` : `${freq}%`}
          <input
            type="range"
            min={-20}
            max={40}
            value={freq}
            onChange={(e) => setFreq(Number(e.target.value))}
          />
        </label>
        <label>
          Fare change {fare > 0 ? `+${fare}%` : `${fare}%`}
          <input
            type="range"
            min={-15}
            max={25}
            value={fare}
            onChange={(e) => setFare(Number(e.target.value))}
          />
        </label>
      </div>
      <div className="bars" aria-hidden>
        {series.map((v, i) => (
          <i
            key={months[i]}
            title={`${months[i]}: ${Math.round(v)}`}
            style={{ height: `${(v / 140) * 100}%` }}
          />
        ))}
      </div>
      <div className="tags" style={{ marginTop: 8 }}>
        {months.map((m) => (
          <span key={m} className="tag">
            {m}
          </span>
        ))}
      </div>
      <div className="kpi-row">
        <div className="kpi">
          <span className="muted">Index (Jun)</span>
          <b>{peak}</b>
        </div>
        <div className="kpi">
          <span className="muted">Vs. baseline</span>
          <b>
            {delta > 0 ? "+" : ""}
            {delta}%
          </b>
        </div>
        <div className="kpi">
          <span className="muted">Annual index</span>
          <b>{annual.toLocaleString()}</b>
        </div>
      </div>
    </div>
  );
}
