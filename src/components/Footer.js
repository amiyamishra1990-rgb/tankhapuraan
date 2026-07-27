import React from 'react';

const Footer = ({ onNavigateAbout, onNavigateLegal, onNavigateDashboard }) => (
  <footer className="site-footer">
    <div className="footer-inner">
      <div className="footer-top">
        <div className="footer-brand-col">
          <div className="footer-brand-name">Tankha <span>Puraan</span></div>
          <div className="footer-pronunciation">
            <span className="footer-devanagari">तन्खापुराण</span>
            <span className="footer-pronunciation-sep">·</span>
            <span className="footer-phonetic">Taan-kha Poo-raan</span>
          </div>
          <p className="footer-brand-sub">Scripture of Salary</p>
          <p className="footer-desc">Har Salaried Indian Ka Digital Vakeel, CA, aur Financial Advisor. Ek jagah. Seedhi baat. Koi drama nahi.</p>
        </div>
        <div className="footer-links-col">
          <div className="footer-link-group">
            <h4>Products</h4>
            <a href="#calcSection">Tankha Puraan Patrika</a>
            <a href="#productsSection">Slip Pariksha</a>
            <a href="#productsSection">Naya Wage Code Jaanch</a>
            <a href="#productsSection">Hike Mantra</a>
          </div>
          <div className="footer-link-group">
            <h4>Legal</h4>
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigateLegal && onNavigateLegal('privacy'); }}>Privacy Policy</a>
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigateLegal && onNavigateLegal('terms'); }}>Terms of Service</a>
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigateLegal && onNavigateLegal('refund'); }}>Refund Policy</a>
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigateLegal && onNavigateLegal('disclaimer'); }}>Disclaimer</a>
          </div>
          <div className="footer-link-group">
            <h4>Company</h4>
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigateAbout && onNavigateAbout(); }}>About ASPOVO</a>
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigateDashboard && onNavigateDashboard(); }}>My Reports</a>
            <a href="mailto:help@tankhapuraan.com">Contact</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="footer-disclaimer">Calculations are informational only. For final decisions consult a CA or qualified advisor. Tankha Puraan is not liable for any financial or legal loss. All reports generated using publicly available Indian tax laws, Labour Codes, and EPFO regulations.</p>
        <p className="footer-aspovo-statement">ASPOVO is an AI-first product company dedicated to solving meaningful real-world problems through thoughtfully designed digital products. We build technology that simplifies life, empowers people, and creates lasting value. Every ASPOVO product is guided by long-term thinking, human-centered design, trust, quality, and responsible use of AI.</p>
        <p className="footer-copy">&copy; 2026 A Product of ASPOVO. All rights reserved. | tankhapuraan.com</p>
      </div>
    </div>
  </footer>
);

export default Footer;
