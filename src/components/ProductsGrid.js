import React from 'react';

const products = [
  { id: 'p1', adhyaya: 'Adhyaya I — Kar', icon: 'fa-scroll', name: 'Tankha Puraan Patrika', hindi: 'कर व्यवस्था विश्लेषण', bestFor: 'Tax Season · Regime Confusion', tagline: 'Old vs New regime — kaun sa bachata hai zyada paisa?', receives: ['Slab-by-slab Old vs New comparison', 'Personal deduction optimizer', 'Ready-to-submit HR declaration letter'], status: 'live' },
  { id: 'p2', adhyaya: 'Adhyaya II — Vetan', icon: 'fa-file-invoice-dollar', name: 'Slip Pariksha', hindi: 'वेतन पर्ची परीक्षा', bestFor: 'New Job · Slip Doubts', tagline: 'Tumhari salary slip sahi hai ya galat?', receives: ['Line-by-line slip decode', 'Slip Health Score out of 100', 'HR query letter if something\'s off'], status: 'live' },
  { id: 'p3', adhyaya: 'Adhyaya III — Vetan Sanhita', icon: 'fa-gavel', name: 'Naya Wage Code Jaanch', hindi: 'नया वेतन संहिता जाँच', bestFor: 'New Labour Code Worries', tagline: 'Naye Labour Codes ne tumhari salary badal di?', receives: ['50% wage rule compliance verdict', 'Hidden take-home impact check', 'Gratuity growth projection'], status: 'live' },
  { id: 'p4', adhyaya: 'Adhyaya IV — Samvaad', icon: 'fa-handshake', name: 'Hike Mantra', hindi: 'वेतन वृद्धि मंत्र', bestFor: 'Appraisal Season', tagline: 'Appraisal se pehle ka hathiyar.', receives: ['Real take-home reality check', 'Transparent settlement-range math', 'Ready-to-say negotiation script'], status: 'live' }
];

const ProductsGrid = ({ openProduct }) => (
  <section className="products-section" id="productsSection">
    <div className="container">
      <div className="products-header reveal">
        <p className="calc-label">◆ Complete Scripture ◆</p>
        <h2 className="calc-title">4 Adhyayas, 100% Free</h2>
        <p className="calc-subtitle">Koi payment nahi. Bas apna email do, poora report 10 minute mein. More Adhyayas coming soon.</p>
      </div>
      <div className="ornament-divider">✦ ✦ ✦</div>
      <div className="products-grid">
        {products.map(p => (
          <div key={p.id} className="product-card live reveal" onClick={() => openProduct(p.id)}>
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
              <span className="product-price" style={{color: 'var(--green)', borderColor: 'var(--green)', fontWeight: 700}}>FREE</span>
              <span className="product-status status-live">Live</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ProductsGrid;
