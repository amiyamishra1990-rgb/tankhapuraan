import React from 'react';

const HowItWorks = () => (
  <section className="how-section">
    <div className="container">
      <div className="how-header reveal">
        <p className="calc-label">◆ Simple Process ◆</p>
        <h2 className="calc-title">Kaise Kaam Karta Hai</h2>
      </div>
      <div className="how-steps">
        <div className="how-step reveal">
          <div className="how-number">1</div>
          <h3 className="how-title">Bharo</h3>
          <p className="how-desc">Apni details daalo — salary, deductions, aur apni bhasha chuno. Bas 2 minute ka kaam.</p>
        </div>
        <div className="how-step reveal">
          <div className="how-number">2</div>
          <h3 className="how-title">Email Do</h3>
          <p className="how-desc">Bas apna email daalo — koi payment nahi, koi card nahi. 100% free, hamesha ke liye.</p>
        </div>
        <div className="how-step reveal">
          <div className="how-number">3</div>
          <h3 className="how-title">Pao Report</h3>
          <p className="how-desc">10 minute mein tumhara report email pe aata hai — apni bhasha mein, complete analysis ke saath.</p>
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorks;
