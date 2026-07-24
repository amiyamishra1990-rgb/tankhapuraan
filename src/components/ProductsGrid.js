import React from 'react';

const products = [
  { id: 'p1', adhyaya: 'Adhyaya I — Kar', icon: 'fa-scroll', name: 'Tankha Puraan Patrika', hindi: 'कर व्यवस्था विश्लेषण', tagline: 'Old vs New regime — kaun sa bachata hai zyada paisa? Slab breakdown, deduction optimizer, HR declaration letter.', price: '₹99', period: '/report', status: 'live', statusClass: 'status-live' },
  { id: 'p2', adhyaya: 'Adhyaya II — Vetan', icon: 'fa-file-invoice-dollar', name: 'Slip Pariksha', hindi: 'वेतन पर्ची परीक्षा', tagline: 'Tumhari salary slip sahi hai ya galat? Har line decode, Slip Health Score, aur restructure letter.', price: '₹99', period: '/report', status: 'live', statusClass: 'status-live' },
  { id: 'p3', adhyaya: 'Adhyaya III — Bazaar', icon: 'fa-chart-line', name: 'Bazaar Bhav', hindi: 'बाज़ार भाव', tagline: 'Tumhari salary market mein kahin hai? Percentile rank, skill gap, aur job switch suggestions.', price: '₹151', period: '/report', status: 'coming-soon', statusClass: 'status-soon' },
  { id: 'p4', adhyaya: 'Adhyaya IV — Samvaad', icon: 'fa-handshake', name: 'Hike Mantra', hindi: 'वेतन वृद्धि मंत्र', tagline: 'Appraisal mein kya bolein? Complete negotiation script — opening se closing tak, sab ready.', price: '₹151', period: '/report', status: 'coming-soon', statusClass: 'status-soon' },
  { id: 'p5', adhyaya: 'Adhyaya V — Vit', icon: 'fa-piggy-bank', name: 'Khata Puraan', hindi: 'खाता पुराण', tagline: 'Tumhara personal AI financial advisor. Investment suggestions, monthly plan, SIP targets — har mahine.', price: '₹199', period: '/month', status: 'coming-soon', statusClass: 'status-soon' },
  { id: 'p6', adhyaya: 'Adhyaya VI — Kar-Legal', icon: 'fa-gavel', name: 'IT Notice Nivaran', hindi: 'आयकर नोटिस निवारण', tagline: 'Income Tax ka notice aaya? Ghabrao mat. Notice identify, reply letter, aur filing instructions.', price: '₹299', period: '/report', status: 'coming-soon', statusClass: 'status-soon' },
  { id: 'p7', adhyaya: 'Adhyaya VII — EPFO', icon: 'fa-balance-scale', name: 'PF Nyaya', hindi: 'पीएफ न्याय', tagline: 'PF mein gadbad hai? Screenshot upload karo, exact complaint letter aur step-by-step resolution pao.', price: '₹299', period: '/report', status: 'coming-soon', statusClass: 'status-soon' },
  { id: 'p8', adhyaya: 'Adhyaya VIII — Legal', icon: 'fa-shield-halved', name: 'Adhikar Patra', hindi: 'अधिकार पत्र', tagline: 'Salary roki? Galat nikalaya? Harassment? Labour Act ke hisaab se formal legal notice. Apna haq lo.', price: '₹299', period: '/report', status: 'coming-soon', statusClass: 'status-soon' }
];

const ProductsGrid = ({ openProduct, showComingSoon }) => (
  <section className="products-section" id="productsSection">
    <div className="container">
      <div className="products-header reveal">
        <p className="calc-label">◆ Complete Scripture ◆</p>
        <h2 className="calc-title">8 Adhyayas of Tankha Puraan</h2>
        <p className="calc-subtitle">Har salary problem ka ek adhyaya. Har adhyaya ka ek solution.</p>
      </div>
      <div className="ornament-divider">✦ ✦ ✦</div>
      <div className="products-grid">
        {products.map(p => (
          <div key={p.id} className={`product-card ${p.status} reveal`} onClick={() => p.status === 'coming-soon' ? showComingSoon(p.name) : openProduct(p.id)}>
            <p className="product-adhyaya">{p.adhyaya}</p>
            <div className="product-icon"><i className={`fas ${p.icon}`}></i></div>
            <h3 className="product-name">{p.name}</h3>
            <p className="product-hindi">{p.hindi}</p>
            <p className="product-tagline">{p.tagline}</p>
            <p className="product-price">{p.price} <span className="period">{p.period}</span></p>
            <span className={`product-status ${p.statusClass}`}>{p.status === 'live' ? 'Live' : p.status === 'building' ? 'Building' : 'Coming Soon'}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ProductsGrid;
