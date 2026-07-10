import React, { useState } from 'react';
import { parseNum, formatCurrency, formatNum, validateEmail } from '../utils/taxCalculator';

const P1View = ({ goHome, calcResult, simulatePayment, showToast }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    ctc: calcResult?.ctc ? formatNum(calcResult.ctc) : '',
    sec80c: calcResult?.deductions?.sec80c ? formatNum(calcResult.deductions.sec80c) : '',
    hra: calcResult?.deductions?.hra ? formatNum(calcResult.deductions.hra) : '',
    nps: calcResult?.deductions?.nps ? formatNum(calcResult.deductions.nps) : '',
    homeLoan: calcResult?.deductions?.homeLoan ? formatNum(calcResult.deductions.homeLoan) : '',
    med80d: calcResult?.deductions?.med80d ? formatNum(calcResult.deductions.med80d) : '',
    other: calcResult?.deductions?.other ? formatNum(calcResult.deductions.other) : '',
    name: '', email: '', language: 'hi'
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => { setFormData(prev => ({ ...prev, [field]: value })); setErrors(prev => ({ ...prev, [field]: '' })); };

  const validateStep = (s) => {
    const errs = {};
    if (s === 1 && (!formData.ctc || parseNum(formData.ctc) < 100000)) errs.ctc = 'CTC ₹1 Lakh se zyada daalo';
    if (s === 2) {
      if (!formData.name.trim()) errs.name = 'Naam daalo';
      if (!formData.email.trim() || !validateEmail(formData.email)) errs.email = 'Sahi email daalo';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => { if (validateStep(step)) setStep(step + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const prevStep = () => { setStep(step - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const langOptions = [
    { value: 'hi', label: 'हिन्दी (Hindi)' }, { value: 'en', label: 'English' }, { value: 'bn', label: 'বাংলা (Bengali)' },
    { value: 'te', label: 'తెలుగు (Telugu)' }, { value: 'mr', label: 'मराठी (Marathi)' }, { value: 'ta', label: 'தமிழ் (Tamil)' },
    { value: 'gu', label: 'ગુજરાતી (Gujarati)' }, { value: 'kn', label: 'ಕನ್ನಡ (Kannada)' }, { value: 'ml', label: 'മലയാളം (Malayalam)' },
    { value: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' }, { value: 'or', label: 'ଓଡ଼ିଆ (Odia)' }, { value: 'ur', label: 'اردو (Urdu)' },
    { value: 'as', label: 'অসমীয়া (Assamese)' }
  ];

  return (
    <div className="product-view">
      <div className="product-view-inner">
        <div className="product-view-header">
          <p className="product-view-adhyaya">◆ Adhyaya I — Kar Vyavastha Vishleshan ◆</p>
          <h2 className="product-view-title">Tankha Puraan Patrika</h2>
          <p className="product-view-tagline">Old vs New regime — kaun sa bachata hai zyada paisa?</p>
          <span className="product-view-price-tag">₹99 / report</span>
        </div>
        <div className="wizard-steps">
          {[1,2,3].map(i => (
            <React.Fragment key={i}>
              {i > 1 && <div className={`wizard-step-connector${step > i - 1 ? ' active' : ''}`}></div>}
              <div className={`wizard-step-dot${step === i ? ' active' : step > i ? ' completed' : ''}`}>{i}</div>
            </React.Fragment>
          ))}
        </div>

        {step === 1 && (
          <div className="form-card">
            <h3 className="form-section-title">◆ Salary & Deduction Details</h3>
            <div className="form-grid">
              <div className="form-group full-width"><label className="form-label">Annual CTC (Gross Salary)</label><input type="text" className={`form-input${errors.ctc ? ' error' : ''}`} value={formData.ctc} onChange={e => handleChange('ctc', e.target.value)} placeholder="e.g. 12,00,000" inputMode="numeric" /><span className="form-error">{errors.ctc}</span></div>
              <div className="form-group"><label className="form-label">80C Investments <span className="hint">(max ₹1.5L)</span></label><input type="text" className="form-input" value={formData.sec80c} onChange={e => handleChange('sec80c', e.target.value)} placeholder="0" inputMode="numeric" /></div>
              <div className="form-group"><label className="form-label">HRA Exemption</label><input type="text" className="form-input" value={formData.hra} onChange={e => handleChange('hra', e.target.value)} placeholder="0" inputMode="numeric" /></div>
              <div className="form-group"><label className="form-label">NPS 80CCD <span className="hint">(up to ₹50K)</span></label><input type="text" className="form-input" value={formData.nps} onChange={e => handleChange('nps', e.target.value)} placeholder="0" inputMode="numeric" /></div>
              <div className="form-group"><label className="form-label">Home Loan Interest <span className="hint">(24b)</span></label><input type="text" className="form-input" value={formData.homeLoan} onChange={e => handleChange('homeLoan', e.target.value)} placeholder="0" inputMode="numeric" /></div>
              <div className="form-group"><label className="form-label">Medical Insurance 80D</label><input type="text" className="form-input" value={formData.med80d} onChange={e => handleChange('med80d', e.target.value)} placeholder="0" inputMode="numeric" /></div>
              <div className="form-group"><label className="form-label">Other Deductions</label><input type="text" className="form-input" value={formData.other} onChange={e => handleChange('other', e.target.value)} placeholder="0" inputMode="numeric" /></div>
            </div>
            <div className="wizard-nav"><div></div><button className="btn-next" onClick={nextStep}>Next — Personal Details <i className="fas fa-arrow-right" style={{marginLeft:'6px'}}></i></button></div>
          </div>
        )}

        {step === 2 && (
          <div className="form-card">
            <h3 className="form-section-title">◆ Personal Details</h3>
            <div className="form-grid">
              <div className="form-group"><label className="form-label">Full Name</label><input type="text" className={`form-input${errors.name ? ' error' : ''}`} value={formData.name} onChange={e => handleChange('name', e.target.value)} placeholder="Aapka naam" /><span className="form-error">{errors.name}</span></div>
              <div className="form-group"><label className="form-label">Email Address</label><input type="email" className={`form-input${errors.email ? ' error' : ''}`} value={formData.email} onChange={e => handleChange('email', e.target.value)} placeholder="your@email.com" /><span className="form-error">{errors.email}</span></div>
              <div className="form-group full-width"><label className="form-label">Report Language</label><select className="form-select" value={formData.language} onChange={e => handleChange('language', e.target.value)}>{langOptions.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}</select></div>
            </div>
            <div className="wizard-nav"><button className="btn-prev" onClick={prevStep}><i className="fas fa-arrow-left" style={{marginRight:'6px'}}></i> Back</button><button className="btn-next" onClick={nextStep}>Next — Review & Pay <i className="fas fa-arrow-right" style={{marginLeft:'6px'}}></i></button></div>
          </div>
        )}

        {step === 3 && (
          <div className="form-card">
            <h3 className="form-section-title">◆ Review & Pay</h3>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',fontSize:'0.9rem',marginBottom:'24px'}}>
              <div><span style={{fontFamily:'var(--font-ui)',fontSize:'0.72rem',color:'var(--muted)'}}>Name</span><br/><strong>{formData.name}</strong></div>
              <div><span style={{fontFamily:'var(--font-ui)',fontSize:'0.72rem',color:'var(--muted)'}}>Email</span><br/><strong>{formData.email}</strong></div>
              <div><span style={{fontFamily:'var(--font-ui)',fontSize:'0.72rem',color:'var(--muted)'}}>Annual CTC</span><br/><strong>{formatCurrency(parseNum(formData.ctc))}</strong></div>
              <div><span style={{fontFamily:'var(--font-ui)',fontSize:'0.72rem',color:'var(--muted)'}}>Language</span><br/><strong>{langOptions.find(l => l.value === formData.language)?.label}</strong></div>
            </div>
            <div style={{textAlign:'center',padding:'20px',background:'var(--parchment-deep)',borderRadius:'8px',border:'1px dashed var(--gold)',marginBottom:'20px'}}>
              <p style={{fontFamily:'var(--font-cinzel)',fontSize:'0.7rem',color:'var(--sindoor-dark)',letterSpacing:'0.2em',textTransform:'uppercase',marginBottom:'8px'}}>Total Amount</p>
              <p style={{fontFamily:'var(--font-display)',fontWeight:900,fontSize:'2.2rem',color:'var(--sindoor-dark)'}}>₹99</p>
              <p style={{fontFamily:'var(--font-ui)',fontSize:'0.75rem',color:'var(--muted)'}}>inclusive of all taxes | Secured by Razorpay</p>
            </div>
            <div style={{textAlign:'center'}}>
              <button className="btn-gold" onClick={simulatePayment}><i className="fas fa-lock" style={{marginRight:'6px'}}></i> Pay ₹99 & Get Patrika</button>
              <p style={{fontFamily:'var(--font-ui)',fontSize:'0.7rem',color:'var(--muted)',marginTop:'10px'}}>Auto-refund if report is not delivered in 10 minutes</p>
            </div>
            <div className="wizard-nav"><button className="btn-prev" onClick={prevStep}><i className="fas fa-arrow-left" style={{marginRight:'6px'}}></i> Back</button><div></div></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default P1View;
