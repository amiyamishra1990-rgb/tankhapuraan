import React from 'react';

const AboutView = ({ goHome }) => (
  <div className="product-view">
    <div className="product-view-inner">
      <div className="product-view-header">
        <p className="product-view-adhyaya">◆ About ◆</p>
        <h2 className="product-view-title">ASPOVO</h2>
        <p className="product-view-tagline">The company behind Tankha Puraan</p>
      </div>

      <div className="form-card">
        <p style={{fontSize:'1.02rem', lineHeight:1.8, color:'var(--ink)', marginBottom:'20px'}}>
          ASPOVO is a technology company focused on building meaningful digital products that improve everyday life. Our mission is to solve real-world problems with thoughtful design, practical innovation, and responsible use of artificial intelligence.
        </p>
        <p style={{fontSize:'1.02rem', lineHeight:1.8, color:'var(--ink)', marginBottom:'20px'}}>
          Rather than building technology for trends, we build products that remain valuable over time. Every ASPOVO product is designed to be simple, reliable, secure, and genuinely useful, helping individuals, families, professionals, and businesses accomplish more with confidence.
        </p>
        <p style={{fontSize:'1.02rem', lineHeight:1.8, color:'var(--ink)', marginBottom:'0'}}>
          Our long-term vision is to create an ecosystem of trusted products powered by a shared foundation of knowledge, engineering excellence, and continuous innovation, while always keeping human values at the center of every decision.
        </p>

        <hr className="ornament-rule" style={{margin:'28px 0'}} />

        <p style={{fontFamily:'var(--font-cinzel)', fontSize:'0.7rem', color:'var(--sindoor-dark)', letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:'14px'}}>◆ Tankha Puraan — An ASPOVO Product</p>
        <p style={{fontSize:'0.95rem', lineHeight:1.75, color:'var(--muted)'}}>
          Tankha Puraan is ASPOVO's flagship product for India's salaried workforce — a digital vakeel, CA, and financial advisor built to decode salary, tax, and labour-law complexity into plain, actionable guidance.
        </p>

        <div className="wizard-nav" style={{marginTop:'32px'}}>
          <button className="btn-prev" onClick={goHome}><i className="fas fa-arrow-left" style={{marginRight:'6px'}}></i> Wapas Home</button>
          <div></div>
        </div>
      </div>
    </div>
  </div>
);

export default AboutView;
