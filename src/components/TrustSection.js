import React from 'react';

const cards = [
  {
    icon: 'fa-lock',
    title: 'Bank-Grade Payment Security',
    desc: 'Every payment runs through Razorpay, the same PCI-DSS certified infrastructure used by India\'s leading banks and businesses. Tankha Puraan never sees or stores your card, UPI, or bank details — that data never touches our servers at all.'
  },
  {
    icon: 'fa-user-shield',
    title: 'Your Data Stays Yours',
    desc: 'We collect only what\'s needed to generate your specific report — nothing more. No bank-account linking, no SMS reading, no credential access, ever. Your salary details exist to build your PDF and are never sold or shared.'
  },
  {
    icon: 'fa-bolt',
    title: 'Instant, Automated Delivery',
    desc: 'Once payment is verified, your report is generated and emailed within minutes — no human ever reviews or delays it. If generation fails for any reason, you\'re auto-refunded within 10 minutes, no questions asked.'
  },
  {
    icon: 'fa-scroll',
    title: 'Built On Real Law, Not Guesswork',
    desc: 'Every calculation is grounded in the actual Income Tax Act, EPF Act, and the new Labour Codes — never AI-guessed numbers. The AI writes the narrative around verified math; it never does the math itself.'
  }
];

const TrustSection = () => (
  <section className="trust-section">
    <div className="container">
      <div className="products-header reveal">
        <p className="calc-label">◆ Why You Can Trust This ◆</p>
        <h2 className="calc-title">Built To Be Trusted With Your Salary</h2>
        <p className="calc-subtitle">The same seriousness a bank or a CA would bring — applied to a ₹99 report.</p>
      </div>

      <div className="trust-grid">
        {cards.map((c, i) => (
          <div key={i} className="trust-card reveal">
            <div className="trust-card-icon"><i className={`fas ${c.icon}`}></i></div>
            <h3 className="trust-card-title">{c.title}</h3>
            <p className="trust-card-desc">{c.desc}</p>
          </div>
        ))}
      </div>

      <div className="founder-promise reveal">
        <p className="founder-promise-label">◆ The Founder's Promise ◆</p>
        <p className="founder-promise-text">
          "Tankha Puraan exists because no salaried Indian should need to guess what their payslip means, whether their employer is playing fair, or what the law actually entitles them to. We built the CA, the vakeel, and the advisor most people can't afford into one ₹99 report — with real law behind every number, and nothing hidden in the fine print."
        </p>
        <p className="founder-promise-sign">— A Proud Indian, Founder, Tankha Puraan</p>
      </div>
    </div>
  </section>
);

export default TrustSection;
