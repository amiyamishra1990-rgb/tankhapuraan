import React, { useState } from 'react';
import { validateEmail } from '../utils/taxCalculator';

const Modals = ({ activeModal, setActiveModal, comingSoonProduct, payId, simulatePayment, goHome, showToast, scrollToCalc }) => {
  const [modalName, setModalName] = useState('');
  const [modalEmail, setModalEmail] = useState('');
  const [modalLang, setModalLang] = useState('hi');
  const [modalErrors, setModalErrors] = useState({});

  if (!activeModal) return null;

  const close = () => { if (activeModal !== 'processing') setActiveModal(null); };

  const proceedToPayment = () => {
    const errs = {};
    if (!modalName.trim()) errs.name = 'Naam daalo';
    if (!modalEmail.trim() || !validateEmail(modalEmail)) errs.email = 'Sahi email daalo';
    setModalErrors(errs);
    if (Object.keys(errs).length > 0) return;
    simulatePayment();
  };

  const langOptions = [{v:'hi',l:'हिन्दी (Hindi)'},{v:'en',l:'English'},{v:'bn',l:'বাংলা (Bengali)'},{v:'te',l:'తెలుగు (Telugu)'},{v:'mr',l:'मराठी (Marathi)'},{v:'ta',l:'தமிழ் (Tamil)'},{v:'gu',l:'ગુજરાતી (Gujarati)'},{v:'kn',l:'ಕನ್ನಡ (Kannada)'},{v:'ml',l:'മലയാളം (Malayalam)'},{v:'pa',l:'ਪੰਜਾਬੀ (Punjabi)'}];

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) close(); }}>
      {activeModal === 'nameEmail' && (
        <div className="modal-card">
          <button className="modal-close" onClick={close}>&times;</button>
          <div className="modal-icon info"><i className="fas fa-scroll"></i></div>
          <h3 className="modal-title">Apni Patrika Mango</h3>
          <p className="modal-desc">Pura PDF report — slab breakdown, deduction optimizer, HR declaration letter — email pe 10 minute mein.</p>
          <div className="modal-form">
            <div className="form-group"><label className="form-label">Full Name</label><input type="text" className={`form-input${modalErrors.name ? ' error' : ''}`} value={modalName} onChange={e => { setModalName(e.target.value); setModalErrors(prev => ({...prev, name: ''})); }} placeholder="Aapka naam" /><span className="form-error">{modalErrors.name}</span></div>
            <div className="form-group"><label className="form-label">Email Address</label><input type="email" className={`form-input${modalErrors.email ? ' error' : ''}`} value={modalEmail} onChange={e => { setModalEmail(e.target.value); setModalErrors(prev => ({...prev, email: ''})); }} placeholder="your@email.com" /><span className="form-error">{modalErrors.email}</span></div>
            <div className="form-group"><label className="form-label">Report Language</label><select className="form-select" value={modalLang} onChange={e => setModalLang(e.target.value)}>{langOptions.map(l => <option key={l.v} value={l.v}>{l.l}</option>)}</select></div>
            <button className="btn-gold" style={{width:'100%',marginTop:'8px'}} onClick={proceedToPayment}><i className="fas fa-lock" style={{marginRight:'6px'}}></i> Pay ₹99 via Razorpay</button>
          </div>
        </div>
      )}

      {activeModal === 'comingSoon' && (
        <div className="modal-card">
          <button className="modal-close" onClick={close}>&times;</button>
          <div className="modal-icon wait"><i className="fas fa-hourglass-half"></i></div>
          <h3 className="modal-title">{comingSoonProduct} — Coming Soon</h3>
          <p className="modal-desc">{comingSoonProduct} abhi taiyyari mein hai. Jald hi live hoga. Tab tak free tax calculator use karo!</p>
          <button className="btn-primary" onClick={() => { close(); scrollToCalc(); }}>Use Free Calculator</button>
        </div>
      )}

      {activeModal === 'processing' && (
        <div className="modal-card" style={{padding:'60px 40px'}}>
          <div style={{width:'50px',height:'50px',border:'3px solid var(--border)',borderTopColor:'var(--sindoor-dark)',borderRadius:'50%',animation:'spin 0.8s linear infinite',margin:'0 auto 20px'}}></div>
          <p style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:'1.1rem',color:'var(--ink)'}}>Processing Payment...</p>
          <p style={{fontFamily:'var(--font-body)',fontStyle:'italic',color:'var(--muted)',fontSize:'0.9rem',marginTop:'6px'}}>Razorpay se secure transaction chal rahi hai</p>
        </div>
      )}

      {activeModal === 'success' && (
        <div className="modal-card">
          <button className="modal-close" onClick={close}>&times;</button>
          <div className="modal-icon success"><i className="fas fa-check"></i></div>
          <h3 className="modal-title">Payment Successful!</h3>
          <p className="modal-desc">Tumhari Patrika abhi generate ho rahi hai. 10 minute mein email pe PDF aa jayega. Agar nahi aaya toh auto-refund hoga — koi tension nahi.</p>
          <p style={{fontFamily:'var(--font-ui)',fontSize:'0.75rem',color:'var(--muted)',marginBottom:'16px'}}>Payment ID: TP{payId}</p>
          <button className="btn-green" onClick={() => { close(); goHome(); }}>Wapas Home</button>
        </div>
      )}
    </div>
  );
};

export default Modals;
