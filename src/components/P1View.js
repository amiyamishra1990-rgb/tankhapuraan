import React, { useState } from 'react';
import { parseNum, formatCurrency, formatNum, validateEmail } from '../utils/taxCalculator';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://tankhapuraan-backend-production.up.railway.app';
const RAZORPAY_KEY_ID = process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_live_T0o9KcbQlYwweH';

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
  const [loading, setLoading] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderId, setOrderId] = useState(null);

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

  // ===== RAZORPAY INTEGRATION =====
  
  const handlePayment = async () => {
    setLoading(true);
    
    try {
      // Step 1: Create Razorpay Order
      const orderRes = await fetch(`${BACKEND_URL}/api/p1/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ctc: parseNum(formData.ctc),
          deductions: {
            sec80c: parseNum(formData.sec80c),
            hra: parseNum(formData.hra),
            nps: parseNum(formData.nps),
            homeLoan: parseNum(formData.homeLoan),
            med80d: parseNum(formData.med80d),
            other: parseNum(formData.other)
          },
          name: formData.name,
          email: formData.email,
          language: formData.language
        })
      });
      
      const orderData = await orderRes.json();
      setOrderId(orderData.orderId);
      setOrderCreated(true);
      
      // Step 2: Open Razorpay Checkout
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: 'INR',
        name: 'Tankha Puraan',
        description: 'Tax Comparison Patrika',
        order_id: orderData.orderId,
        handler: async function (response) {
          // Step 3: Verify Payment
          const verifyRes = await fetch(`${BACKEND_URL}/api/p1/verify-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          });
          
          const verifyData = await verifyRes.json();
          
          if (verifyData.verified) {
            // Step 4: Generate Report
            const reportRes = await fetch(`${BACKEND_URL}/api/p1/generate-report`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ctc: parseNum(formData.ctc),
                deductions: {
                  sec80c: parseNum(formData.sec80c),
                  hra: parseNum(formData.hra),
                  nps: parseNum(formData.nps),
                  homeLoan: parseNum(formData.homeLoan),
                  med80d: parseNum(formData.med80d),
                  other: parseNum(formData.other)
                },
                name: formData.name,
                email: formData.email,
                language: formData.language,
                paymentId: response.razorpay_payment_id
              })
            });
            
            const reportData = await reportRes.json();
            
            if (reportData.success) {
              showToast('Patrika generate ho rahi hai! Email check karo 10 minute mein.', 'success');
              goHome();
            } else {
              showToast('Report generation failed. Please contact support.', 'error');
            }
          } else {
            showToast('Payment verification failed. Please contact support.', 'error');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email
        },
        theme: {
          color: '#7C1316'
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();
      
    } catch (err) {
      console.error('Payment error:', err);
      showToast('Payment initiation failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const langOptions = [
    { value: 'hi', label: 'हिन्दी (Hindi)' },
    { value: 'en', label: 'English' },
    { value: 'bn', label: 'বাংলা (Bengali)' },
    { value: 'te', label: 'తెలుగు (Telugu)' },
    { value: 'mr', label: 'मराठी (Marathi)' },
    { value: 'ta', label: 'தமிழ் (Tamil)' },
    { value: 'gu', label: 'ગુજરાતી (Gujarati)' },
    { value: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
    { value: 'ml', label: 'മലയാളം (Malayalam)' },
    { value: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' },
    { value: 'or', label: 'ଓଡ଼ିଆ (Odia)' },
    { value: 'ur', label: 'اردو (Urdu)' },
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
              <div className="form-group full-width">
                <label className="form-label">Annual CTC (Gross Salary)</label>
                <input 
                  type="text" 
                  className={`form-input${errors.ctc ? ' error' : ''}`}
                  value={formData.ctc}
                  onChange={e => handleChange('ctc', e.target.value)}
                  placeholder="e.g. 12,00,000"
                  inputMode="numeric"
                />
                <span className="form-error">{errors.ctc}</span>
              </div>
              
              <div className="form-group">
                <label className="form-label">80C Investments <span className="hint">(max ₹1.5L)</span></label>
                <input type="text" className="form-input" value={formData.sec80c} onChange={e => handleChange('sec80c', e.target.value)} placeholder="0" inputMode="numeric" />
              </div>
              
              <div className="form-group">
                <label className="form-label">HRA Exemption</label>
                <input type="text" className="form-input" value={formData.hra} onChange={e => handleChange('hra', e.target.value)} placeholder="0" inputMode="numeric" />
              </div>
              
              <div className="form-group">
                <label className="form-label">NPS 80CCD <span className="hint">(up to ₹50K)</span></label>
                <input type="text" className="form-input" value={formData.nps} onChange={e => handleChange('nps', e.target.value)} placeholder="0" inputMode="numeric" />
              </div>
              
              <div className="form-group">
                <label className="form-label">Home Loan Interest <span className="hint">(24b)</span></label>
                <input type="text" className="form-input" value={formData.homeLoan} onChange={e => handleChange('homeLoan', e.target.value)} placeholder="0" inputMode="numeric" />
              </div>
              
              <div className="form-group">
                <label className="form-label">Medical Insurance 80D</label>
                <input type="text" className="form-input" value={formData.med80d} onChange={e => handleChange('med80d', e.target.value)} placeholder="0" inputMode="numeric" />
              </div>
              
              <div className="form-group">
                <label className="form-label">Other Deductions</label>
                <input type="text" className="form-input" value={formData.other} onChange={e => handleChange('other', e.target.value)} placeholder="0" inputMode="numeric" />
              </div>
            </div>
            
            <div className="wizard-nav">
              <div></div>
              <button className="btn-next" onClick={nextStep}>
                Next — Personal Details <i className="fas fa-arrow-right" style={{marginLeft:'6px'}}></i>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-card">
            <h3 className="form-section-title">◆ Personal Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className={`form-input${errors.name ? ' error' : ''}`} value={formData.name} onChange={e => handleChange('name', e.target.value)} placeholder="Aapka naam" />
                <span className="form-error">{errors.name}</span>
              </div>
              
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className={`form-input${errors.email ? ' error' : ''}`} value={formData.email} onChange={e => handleChange('email', e.target.value)} placeholder="your@email.com" />
                <span className="form-error">{errors.email}</span>
              </div>
              
              <div className="form-group full-width">
                <label className="form-label">Report Language</label>
                <select className="form-select" value={formData.language} onChange={e => handleChange('language', e.target.value)}>
                  {langOptions.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                </select>
              </div>
            </div>
            
            <div className="wizard-nav">
              <button className="btn-prev" onClick={prevStep}>
                <i className="fas fa-arrow-left" style={{marginRight:'6px'}}></i> Back
              </button>
              <button className="btn-next" onClick={nextStep}>
                Next — Review & Pay <i className="fas fa-arrow-right" style={{marginLeft:'6px'}}></i>
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-card">
            <h3 className="form-section-title">◆ Review & Pay</h3>
            
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',fontSize:'0.9rem',marginBottom:'24px'}}>
              <div>
                <span style={{fontFamily:'var(--font-ui)',fontSize:'0.72rem',color:'var(--muted)'}}>Name</span><br/>
                <strong>{formData.name}</strong>
              </div>
              <div>
                <span style={{fontFamily:'var(--font-ui)',fontSize:'0.72rem',color:'var(--muted)'}}>Email</span><br/>
                <strong>{formData.email}</strong>
              </div>
              <div>
                <span style={{fontFamily:'var(--font-ui)',fontSize:'0.72rem',color:'var(--muted)'}}>Annual CTC</span><br/>
                <strong>{formatCurrency(parseNum(formData.ctc))}</strong>
              </div>
              <div>
                <span style={{fontFamily:'var(--font-ui)',fontSize:'0.72rem',color:'var(--muted)'}}>Language</span><br/>
                <strong>{langOptions.find(l => l.value === formData.language)?.label}</strong>
              </div>
            </div>
            
            <div style={{textAlign:'center',padding:'20px',background:'var(--parchment-deep)',borderRadius:'8px',border:'1px dashed var(--gold)',marginBottom:'20px'}}>
              <p style={{fontFamily:'var(--font-cinzel)',fontSize:'0.7rem',color:'var(--sindoor-dark)',letterSpacing:'0.2em',textTransform:'uppercase',marginBottom:'8px'}}>Total Amount</p>
              <p style={{fontFamily:'var(--font-display)',fontWeight:900,fontSize:'2.2rem',color:'var(--sindoor-dark)'}}>₹99</p>
              <p style={{fontFamily:'var(--font-ui)',fontSize:'0.75rem',color:'var(--muted)'}}>inclusive of all taxes | Secured by Razorpay</p>
            </div>
            
            <div style={{textAlign:'center'}}>
              <button className="btn-gold" onClick={handlePayment} disabled={loading}>
                {loading ? (
                  <span><i className="fas fa-spinner fa-spin" style={{marginRight:'8px'}}></i> Processing...</span>
                ) : (
                  <span><i className="fas fa-lock" style={{marginRight:'6px'}}></i> Pay ₹99 via Razorpay</span>
                )}
              </button>
              <p style={{fontFamily:'var(--font-ui)',fontSize:'0.7rem',color:'var(--muted)',marginTop:'10px'}}>
                Secured by Razorpay | Report delivered to email in 10 minutes
              </p>
            </div>
            
            <div className="wizard-nav">
              <button className="btn-prev" onClick={prevStep}>
                <i className="fas fa-arrow-left" style={{marginRight:'6px'}}></i> Back
              </button>
              <div></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default P1View;
