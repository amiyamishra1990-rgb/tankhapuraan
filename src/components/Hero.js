import React, { useEffect, useRef } from 'react';

const Hero = () => {
  const particlesRef = useRef(null);

  useEffect(() => {
    const container = particlesRef.current;
    if (!container) return;
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'hero-particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.top = (60 + Math.random() * 40) + '%';
      p.style.animationDelay = (Math.random() * 6) + 's';
      p.style.animationDuration = (4 + Math.random() * 4) + 's';
      const size = (2 + Math.random() * 3) + 'px';
      p.style.width = size;
      p.style.height = size;
      container.appendChild(p);
    }
  }, []);

  const scrollToCalc = () => document.getElementById('calcSection')?.scrollIntoView({ behavior: 'smooth' });
  const scrollToProducts = () => document.getElementById('productsSection')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="hero">
      <div className="hero-particles" ref={particlesRef}></div>
      <div className="hero-content">
        <p className="hero-sanskrit">॥ Artha Satyam ॥</p>
        <div className="hero-pronunciation-line">
          <span className="hero-devanagari-text">तन्खापुराण</span>
          <span className="hero-pronunciation-sep">·</span>
          <span className="hero-phonetic-text">Taan-kha Poo-raan</span>
        </div>
        <h1 className="hero-title">Har Salaried Indian Ka<br/><em>Digital Vakeel, CA,</em><br/>aur Financial Advisor</h1>
        <p className="hero-tagline">Ek jagah. Seedhi baat. Koi drama nahi.</p>
        <p className="hero-viral">Consult the Tankha Puraan before accepting any job offer</p>
        <div className="hero-ctas">
          <button className="btn-primary" onClick={scrollToCalc}>
            <i className="fas fa-calculator" style={{marginRight:'6px'}}></i> Free Tax Calculator
          </button>
          <button className="btn-secondary" onClick={scrollToProducts}>
            See All Reports <i className="fas fa-arrow-down" style={{marginLeft:'6px'}}></i>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
