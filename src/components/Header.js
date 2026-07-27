import React, { useState, useEffect } from 'react';

const Header = ({ currentView, goHome, openDashboard }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
      <div className="header-inner">
        <div className="header-brand">
          <img src="/logo192.png" alt="Tankha Puraan" className="header-logo" style={{flexShrink: 0}} />
          <div className="header-title">
            <div className="header-name">Tankha <span>Puraan</span></div>
            <div className="brand-pronunciation">
              <span className="brand-devanagari">तन्खापुराण</span>
              <span className="brand-phonetic">· Taan-kha Poo-raan</span>
            </div>
            <div className="header-subtitle">Scripture of Salary</div>
          </div>
        </div>
        <div className="header-right">
          {currentView !== 'home' && (
            <button className="back-btn" onClick={goHome}>
              <i className="fas fa-arrow-left"></i> Wapas Home
            </button>
          )}
          {currentView === 'home' && (
            <button className="back-btn" onClick={openDashboard}>
              <i className="fas fa-file-invoice"></i> My Reports
            </button>
          )}
          <select className="lang-select" aria-label="Select Language">
            <option value="en">English</option>
            <option value="hi" selected>हिन्दी</option>
            <option value="bn">বাংলা</option>
            <option value="te">తెలుగు</option>
            <option value="mr">मराठी</option>
            <option value="ta">தமிழ்</option>
            <option value="gu">ગુજરાતી</option>
            <option value="kn">ಕನ್ನಡ</option>
            <option value="ml">മലയാളം</option>
            <option value="pa">ਪੰਜਾਬੀ</option>
            <option value="ur">اردو</option>
          </select>
        </div>
      </div>
    </header>
  );
};

export default Header;
