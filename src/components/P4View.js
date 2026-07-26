import React, { useState } from 'react';
import { parseNum, formatCurrency, validateEmail } from '../utils/taxCalculator';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://tankhapuraan-backend-432180395696.asia-south1.run.app';
const RAZORPAY_KEY_ID = process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_live_T0o9KcbQlYwweH';

const P4View = ({ goHome, showToast }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', email: '', language: 'hi',
    currentCTC: '', basic: '', hra: '', da: '', special: '',
    regime: 'auto', hikeMode: 'percent', hikeValue: '',
    yearsSinceLastHike: '', contributionsNote: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => { setFormData(prev => ({ ...prev, [field]: value })); setErrors(prev => ({ ...prev, [field]: '' })); };

  const calcTargetCTC = () => {
    const ctc = parseNum(formData.currentCTC);
    const val = parseNum(formData.hikeValue);
    if (formData.hikeMode === 'amount') return val;
    return Math.round(ctc * (1 + val / 100));
  };
  const calcAskAmount = () => Math.max(0, calcTargetCTC() - parseNum(formData.currentCTC));
  const calcAskPercent = () => {
    const ctc = parseNum(formData.currentCTC);
    return ctc > 0 ? Math.round((calcAskAmount() / ctc) * 1000) / 10 : 0;
  };

  const loadRazorpay = () => new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const buildHikePayload = () => ({
    currentCTC: parseNum(formData.currentCTC),
    basic: parseNum(formData.basic), hra: parseNum(formData.hra), da: parseNum(formData.da), special: parseNum(formData.special),
    regime: formData.regime, hikeMode: formData.hikeMode, hikeValue: parseNum(formData.hikeValue),
    yearsSinceLastHike: parseNum(formData.yearsSinceLastHike),
    contributionsNote: formData.contributionsNote,
    deductions: {}
  });

  const handlePayment = async () => {
    setLoading(true);
    try {
      const razorpayReady = await loadRazorpay();
      if (!razorpayReady) {
        showToast('Razorpay load nahi hua. Ad-blocker band karke try karo.', 'error');
        setLoading(false);
        return;
      }

      const orderRes = await fetch(`${BACKEND_URL}/api/p4/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email, language: formData.language })
      });
      const orderData = await orderRes.json();

      if (!orderData.orderId) {
        showToast('Order create nahi hua. Try again.', 'error');
        setLoading(false);
        return;
      }

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: 'INR',
        name: 'Tankha Puraan',
        description: 'Hike Mantra Report',
        order_id: orderData.orderId,
        handler: async function (response) {
          const verifyRes = await fetch(`${BACKEND_URL}/api/p4/verify-payment`, {
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
            const reportRes = await fetch(`${BACKEND_URL}/api/p4/generate-report`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: formData.name,
                email: formData.email,
                language: formData.language,
                paymentId: response.razorpay_payment_id,
                hike: buildHikePayload()
              })
            });
            const reportData = await reportRes.json();

            if (reportData.success) {
              showToast('Hike Mantra generate ho raha hai! Email check karo 10 minute mein.', 'success');
              goHome();
            } else {
              showToast('Report generation failed. Please contact support.', 'error');
            }
          } else {
            showToast('Payment verification failed. Please contact support.', 'error');
          }
        },
        prefill: { name: formData.name, email: formData.email },
        theme: { color: '#7C1316' }
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

  const validateStep = (s) => {
    const errs = {};
    if (s === 1) { if (!formData.name.trim()) errs.name = 'Naam daalo'; if (!formData.email.trim() || !validateEmail(formData.email)) errs.email = 'Sahi email daalo'; }
    if (s === 2) {
      if (!formData.currentCTC || parseNum(formData.currentCTC) <= 0) errs.currentCTC = 'Current CTC daalo';
      if (!formData.basic || parseNum(formData.basic) <= 0) errs.basic = 'Basic salary daalo';
      if (!formData.hikeValue || parseNum(formData.hikeValue) <= 0) errs.hikeValue = (formData.hikeMode === 'amount' ? 'Target CTC daalo' : 'Hike % daalo');
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => { if (validateStep(step)) { setStep(step + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); } };
  const prevStep = () => { setStep(step - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const langOptions = [
    {v:'hi',l:'हिन्दी (Hindi)'},{v:'en',l:'English'},{v:'bn',l:'বাংলা (Bengali)'},{v:'te',l:'తెలుగు (Telugu)'},
    {v:'mr',l:'मराठी (Marathi)'},{v:'ta',l:'தமிழ் (Tamil)'},{v:'gu',l:'ગુજરાતી (Gujarati)'},{v:'kn',l:'ಕನ್ನಡ (Kannada)'},
    {v:'ml',l:'മലയാളം (Malayalam)'},{v:'pa',l:'ਪੰਜਾਬੀ (Punjabi)'},{v:'or',l:'ଓଡ଼ିଆ (Odia)'},{v:'ur',l:'اردو (Urdu)'},
    {v:'as',l:'অসমীয়া (Assamese)'},{v:'mai',l:'मैथिली (Maithili)'},{v:'ne',l:'नेपाली (Nepali)'},{v:'gom',l:'कोंकणी (Konkani)'},
    {v:'doi',l:'डोगरी (Dogri)'},{v:'sa',l:'संस्कृत (Sanskrit)'},{v:'mni',l:'ꯃꯤꯇꯩꯂꯣꯟ (Manipuri)'},{v:'brx',l:'बड़ो (Bodo)'},
    {v:'sat',l:'ᱥᱟᱱᱛᱟᱲᱤ (Santali)'},{v:'ks',l:'کٲشُر (Kashmiri)'},{v:'sd',l:'سنڌي (Sindhi)'}
  ];

  const targetCTC = calcTargetCTC();
  const askAmount = calcAskAmount();
  const askPercent = calcAskPercent();

  return (
    <div className="product-view">
      <div className="product-view-inner">
        <div className="product-view-header">
          <p className="product-view-adhyaya">◆ Adhyaya IV — Samvaad ◆</p>
          <h2 className="product-view-title">Hike Mantra</h2>
          <p className="product-view-tagline">Appraisal se pehle ka hathiyar: tumhari raise ask ka asli take-home reality, transparent anchor math, aur ready-to-say negotiation script.</p>
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
            <h3 className="form-section-title">◆ Basic Information</h3>
            <div className="form-grid">
              <div className="form-group"><label className="form-label">Full Name</label><input type="text" className={`form-input${errors.name ? ' error' : ''}`} value={formData.name} onChange={e => handleChange('name', e.target.value)} placeholder="Aapka naam" /><span className="form-error">{errors.name}</span></div>
              <div className="form-group"><label className="form-label">Email Address</label><input type="email" className={`form-input${errors.email ? ' error' : ''}`} value={formData.email} onChange={e => handleChange('email', e.target.value)} placeholder="your@email.com" /><span className="form-error">{errors.email}</span></div>
              <div className="form-group"><label className="form-label">Tax Regime</label><select className="form-select" value={formData.regime} onChange={e => handleChange('regime', e.target.value)}><option value="auto">Auto (jo bhi behtar ho)</option><option value="old">Old Regime</option><option value="new">New Regime</option></select></div>
              <div className="form-group"><label className="form-label">Years Since Last Hike</label><input type="text" className="form-input" value={formData.yearsSinceLastHike} onChange={e => handleChange('yearsSinceLastHike', e.target.value)} placeholder="e.g. 2" inputMode="numeric" /></div>
              <div className="form-group full-width"><label className="form-label">Report Language</label><select className="form-select" value={formData.language} onChange={e => handleChange('language', e.target.value)}>{langOptions.map(l => <option key={l.v} value={l.v}>{l.l}</option>)}</select></div>
            </div>
            <div className="wizard-nav"><div></div><button className="btn-next" onClick={nextStep}>Next — Salary &amp; Ask <i className="fas fa-arrow-right" style={{marginLeft:'6px'}}></i></button></div>
          </div>
        )}

        {step === 2 && (
          <div className="form-card">
            <h3 className="form-section-title">◆ Tumhari Current Salary &amp; Hike Ask</h3>
            <div className="net-pay-display">
              <p className="net-pay-label">Live Preview</p>
              <p className="net-pay-amount" style={{fontSize:'1.1rem'}}>
                {askAmount > 0 ? `${formatCurrency(askAmount)} (${askPercent}%) — Target CTC: ${formatCurrency(targetCTC)}` : 'Fields bharo neeche'}
              </p>
            </div>
            <div className="form-grid">
              <div className="form-group"><label className="form-label">Current Annual CTC</label><input type="text" className={`form-input${errors.currentCTC ? ' error' : ''}`} value={formData.currentCTC} onChange={e => handleChange('currentCTC', e.target.value)} placeholder="e.g. 1200000" inputMode="numeric" /><span className="form-error">{errors.currentCTC}</span></div>
              <div className="form-group"><label className="form-label">Basic Salary (monthly)</label><input type="text" className={`form-input${errors.basic ? ' error' : ''}`} value={formData.basic} onChange={e => handleChange('basic', e.target.value)} placeholder="0" inputMode="numeric" /><span className="form-error">{errors.basic}</span></div>
              <div className="form-group"><label className="form-label">HRA (monthly)</label><input type="text" className="form-input" value={formData.hra} onChange={e => handleChange('hra', e.target.value)} placeholder="0" inputMode="numeric" /></div>
              <div className="form-group"><label className="form-label">Dearness Allowance (monthly)</label><input type="text" className="form-input" value={formData.da} onChange={e => handleChange('da', e.target.value)} placeholder="0 (most private companies: 0)" inputMode="numeric" /></div>
              <div className="form-group"><label className="form-label">Special / Other Allowance (monthly)</label><input type="text" className="form-input" value={formData.special} onChange={e => handleChange('special', e.target.value)} placeholder="0" inputMode="numeric" /></div>
              <div className="form-group"><label className="form-label">How do you want to specify your ask?</label><select className="form-select" value={formData.hikeMode} onChange={e => handleChange('hikeMode', e.target.value)}><option value="percent">As a % hike</option><option value="amount">As a target CTC amount</option></select></div>
              <div className="form-group full-width"><label className="form-label">{formData.hikeMode === 'amount' ? 'Target Annual CTC' : 'Hike You Want (%)'}</label><input type="text" className={`form-input${errors.hikeValue ? ' error' : ''}`} value={formData.hikeValue} onChange={e => handleChange('hikeValue', e.target.value)} placeholder={formData.hikeMode === 'amount' ? 'e.g. 1500000' : 'e.g. 15'} inputMode="numeric" /><span className="form-error">{errors.hikeValue}</span></div>
              <div className="form-group full-width"><label className="form-label">Tumhare Contributions (optional, negotiation script mein use hoga)</label><textarea className="form-input" rows="3" value={formData.contributionsNote} onChange={e => handleChange('contributionsNote', e.target.value)} placeholder="e.g. Led the migration to the new billing system, reduced support tickets by 30%..."></textarea></div>
            </div>
            <div className="wizard-nav"><button className="btn-prev" onClick={prevStep}><i className="fas fa-arrow-left" style={{marginRight:'6px'}}></i> Back</button><button className="btn-next" onClick={nextStep}>Next — Review &amp; Pay <i className="fas fa-arrow-right" style={{marginLeft:'6px'}}></i></button></div>
          </div>
        )}

        {step === 3 && (
          <div className="form-card">
            <h3 className="form-section-title">◆ Review &amp; Pay</h3>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',fontSize:'0.9rem',marginBottom:'24px'}}>
              <div><span style={{fontFamily:'var(--font-ui)',fontSize:'0.72rem',color:'var(--muted)'}}>Name</span><br/><strong>{formData.name}</strong></div>
              <div><span style={{fontFamily:'var(--font-ui)',fontSize:'0.72rem',color:'var(--muted)'}}>Email</span><br/><strong>{formData.email}</strong></div>
              <div><span style={{fontFamily:'var(--font-ui)',fontSize:'0.72rem',color:'var(--muted)'}}>Current CTC</span><br/><strong>{formatCurrency(parseNum(formData.currentCTC))}</strong></div>
              <div><span style={{fontFamily:'var(--font-ui)',fontSize:'0.72rem',color:'var(--muted)'}}>Target CTC</span><br/><strong>{formatCurrency(targetCTC)}</strong></div>
              <div style={{gridColumn:'1/-1',textAlign:'center',padding:'10px',background:'var(--sindoor-dark)',color:'var(--gold-light)',borderRadius:'6px',border:'1px solid var(--gold)'}}>
                <span style={{fontSize:'0.72rem',letterSpacing:'0.1em',textTransform:'uppercase'}}>Your Ask</span><br/>
                <strong style={{fontSize:'1.2rem'}}>{formatCurrency(askAmount)} ({askPercent}%)</strong>
              </div>
            </div>
            <div style={{textAlign:'center'}}>
              <button className="btn-gold" onClick={handlePayment} disabled={loading}>
                {loading ? (<><i className="fas fa-spinner fa-spin" style={{marginRight:'6px'}}></i> Processing...</>) : (<><i className="fas fa-lock" style={{marginRight:'6px'}}></i> Pay ₹99 via Razorpay</>)}
              </button>
              <p style={{fontFamily:'var(--font-ui)',fontSize:'0.7rem',color:'var(--muted)',marginTop:'10px'}}>Auto-refund if report is not delivered in 10 minutes</p>
            </div>
            <div className="wizard-nav"><button className="btn-prev" onClick={prevStep}><i className="fas fa-arrow-left" style={{marginRight:'6px'}}></i> Back</button><div></div></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default P4View;
