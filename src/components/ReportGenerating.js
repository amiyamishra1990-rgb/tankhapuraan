import React from 'react';

// stage: 0 = verifying payment, 1 = calculating, 2 = generating PDF, 3 = sending email, 4 = done
const STEPS = [
  { label: 'Verifying your payment' },
  { label: 'Running your numbers against the law' },
  { label: 'Generating your report' },
  { label: 'Sending it to your email' }
];

const ReportGenerating = ({ stage = 0, productName = 'report' }) => (
  <div className="generating-overlay">
    <div className="generating-card">
      <div className="generating-mark"><i className="fas fa-scroll"></i></div>
      <h3 className="generating-title">Preparing Your {productName}</h3>
      <p className="generating-sub">This takes under a minute. Please don't close this tab.</p>
      <div className="generating-steps">
        {STEPS.map((s, i) => {
          const state = i < stage ? 'done' : i === stage ? 'active' : '';
          return (
            <div key={i} className={`generating-step ${state}`}>
              <span className="generating-step-mark">
                {state === 'done' ? <i className="fas fa-check"></i> : state === 'active' ? <i className="fas fa-circle-notch"></i> : i + 1}
              </span>
              {s.label}
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

export default ReportGenerating;
