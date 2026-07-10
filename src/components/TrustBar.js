import React from 'react';

const TrustBar = () => (
  <section className="trust-bar">
    <div className="trust-items">
      <div className="trust-item"><div className="trust-icon"><i className="fas fa-lock"></i></div><span>Secured by Razorpay</span></div>
      <div className="trust-sep"></div>
      <div className="trust-item"><div className="trust-icon"><i className="fas fa-bolt"></i></div><span>Report in 10 minutes</span></div>
      <div className="trust-sep"></div>
      <div className="trust-item"><div className="trust-icon"><i className="fas fa-scroll"></i></div><span>As per Govt. Laws &amp; Labour Code</span></div>
      <div className="trust-sep"></div>
      <div className="trust-item"><div className="trust-icon"><i className="fas fa-rotate-left"></i></div><span>Auto-refund if pipeline fails</span></div>
    </div>
  </section>
);

export default TrustBar;
