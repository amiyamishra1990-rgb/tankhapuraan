import React from 'react';

const Footer = () => (
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
            <a href="#productsSection">Bazaar Bhav</a>
            <a href="#productsSection">Hike Mantra</a>
          </div>
          <div className="footer-link-group">
            <h4>Legal</h4>
            <a href="#">Privacy Policy</a><a href="#">Terms of Service</a><a href="#">Refund Policy</a><a href="#">Disclaimer</a>
          </div>
          <div className="footer-link-group">
            <h4>Company</h4>
            <a href="#">About ASPOVO</a><a href="#">Contact</a><a href="#">Careers</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="footer-disclaimer">Calculations are informational only. For final decisions consult a CA or qualified advisor. Tankha Puraan is not liable for any financial or legal loss. All reports generated using publicly available Indian tax laws, Labour Codes, and EPFO regulations.</p>
        <p className="footer-copy">&copy; 2026 A Product of ASPOVO. All rights reserved. | tankhapuraan.com</p>
      </div>
    </div>
  </footer>
);

export default Footer;
