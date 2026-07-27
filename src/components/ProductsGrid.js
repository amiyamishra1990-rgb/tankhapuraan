import React from 'react';

const products = [
  { id: 'p1', adhyaya: 'Adhyaya I — Kar', icon: 'fa-scroll', name: 'Tankha Puraan Patrika', hindi: 'कर व्यवस्था विश्लेषण', bestFor: 'Tax Season · Regime Confusion', tagline: 'Old vs New regime — kaun sa bachata hai zyada paisa?', receives: ['Slab-by-slab Old vs New comparison', 'Personal deduction optimizer', 'Ready-to-submit HR declaration letter'], price: '₹99', period: '/report', status: 'live', statusClass: 'status-live' },
  { id: 'p2', adhyaya: 'Adhyaya II — Vetan', icon: 'fa-file-invoice-dollar', name: 'Slip Pariksha', hindi: 'वेतन पर्ची परीक्षा', bestFor: 'New Job · Slip Doubts', tagline: 'Tumhari salary slip sahi hai ya galat?', receives: ['Line-by-line slip decode', 'Slip Health Score out of 100', 'HR query letter if something\'s off'], price: '₹99', period: '/report', status: 'live', statusClass: 'status-live' },
  { id: 'p3', adhyaya: 'Adhyaya III — Vetan Sanhita', icon: 'fa-gavel', name: 'Naya Wage Code Jaanch', hindi: 'नया वेतन संहिता जाँच', bestFor: 'New Labour Code Worries', tagline: 'Naye Labour Codes ne tumhari salary badal di?', receives: ['50% wage rule compliance verdict', 'Hidden take-home impact check', 'Gratuity growth projection'], price: '₹99', period: '/report', status: 'live', statusClass: 'status-live' },
  { id: 'p4', adhyaya: 'Adhyaya IV — Samvaad', icon: 'fa-handshake', name: 'Hike Mantra', hindi: 'वेतन वृद्धि मंत्र', bestFor: 'Appraisal Season', tagline: 'Appraisal se pehle ka hathiyar.', receives: ['Real take-home reality check', 'Transparent settlement-range math', 'Ready-to-say negotiation script'], price: '₹99', period: '/report', status: 'live', statusClass: 'status-live' },
  { id: 'p5', adhyaya: 'Adhyaya V — Kar Yatra', icon: 'fa-route', name: 'Kar Yatra', hindi: 'कर यात्रा', bestFor: 'Jan–Feb Proof Deadline', tagline: 'Proof jama nahi kiya? March mein tumhari take-home gir sakti hai.', receives: ['Your YTD tax trajectory, both regimes', 'March take-home shock projection', 'New Income Tax Act declaration check'], price: '₹99', period: '/report', status: 'coming-soon', statusClass: 'status-soon' },
  { id: 'p6', adhyaya: 'Adhyaya VI — Kar-Legal', icon: 'fa-file-shield', name: 'IT Notice Nivaran', hindi: 'आयकर नोटिस निवारण', bestFor: 'Got A Tax Notice', tagline: 'Income Tax ka notice aaya? Ghabrao mat.', receives: ['Plain-language notice explainer', 'Ready-to-file reply letter', 'Step-by-step filing instructions'], price: '₹99', period: '/report', status: 'coming-soon', statusClass: 'status-soon' },
  { id: 'p7', adhyaya: 'Adhyaya VII — EPFO', icon: 'fa-balance-scale', name: 'PF Nyaya', hindi: 'पीएफ न्याय', bestFor: 'PF Stuck Or Delayed', tagline: 'PF mein gadbad hai?', receives: ['Passbook vs deduction cross-check', 'Formal EPFO complaint letter', 'Step-by-step resolution path'], price: '₹99', period: '/report', status: 'coming-soon', statusClass: 'status-soon' },
  { id: 'p8', adhyaya: 'Adhyaya VIII — Legal', icon: 'fa-shield-halved', name: 'Adhikar Patra', hindi: 'अधिकार पत्र', bestFor: 'Notice Period · Exit Disputes', tagline: 'Salary roki? Galat nikalaya?', receives: ['Your exact rights under Labour Law', 'Formal legal notice, ready to send', 'Escalation path if unresolved'], price: '₹99', period: '/report', status: 'coming-soon', statusClass: 'status-soon' }
];

const ProductsGrid = ({ openProduct, showComingSoon }) => (
  <section className="products-section" id="productsSection">
    <div className="container">
      <div className="products-header reveal">
        <p className="calc-label">◆ Complete Scripture ◆</p>
        <h2 className="calc-title">8 Adhyayas of Tankha Puraan</h2>
        <p className="calc-subtitle">Har report ₹99 flat. Farak keemat ka nahi — samasya ka hai. Apna Adhyaya chuno.</p>
      </div>
      <div className="ornament-divider">✦ ✦ ✦</div>
      <div className="products-grid">
        {products.map(p => (
          <div key={p.id} className={`product-card ${p.status} reveal`} onClick={() => p.status === 'coming-soon' ? showComingSoon(p.name) : openProduct(p.id)}>
            <p className="product-adhyaya">{p.adhyaya}</p>
            <div className="product-icon"><i className={`fas ${p.icon}`}></i></div>
            <span className="product-best-for">Best For: {p.bestFor}</span>
            <h3 className="product-name">{p.name}</h3>
            <p className="product-hindi">{p.hindi}</p>
            <p className="product-tagline">{p.tagline}</p>
            <ul className="product-receives">
              {p.receives.map((r, i) => <li key={i}><i className="fas fa-check-circle"></i>{r}</li>)}
            </ul>
            <div className="product-card-footer">
              <span className="product-price">{p.price} <span className="period">{p.period}</span></span>
              <span className={`product-status ${p.statusClass}`}>{p.status === 'live' ? 'Live' : p.status === 'building' ? 'Building' : 'Coming Soon'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ProductsGrid;
