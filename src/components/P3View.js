import React, { useState } from 'react';
import ReportGenerating from './ReportGenerating';
import { parseNum, formatCurrency, validateEmail } from '../utils/taxCalculator';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://tankhapuraan-backend-432180395696.asia-south1.run.app';

const P3View = ({ goHome, showToast }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', language: 'hi', ctc: '', basic: '', hra: '', da: '', special: '', currentPF: '', empType: 'permanent', yearsOfService: '', annualEmployerPfNps: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [genStage, setGenStage] = useState(null);

  const handleChange = (field, value) => { setFormData(prev => ({ ...prev, [field]: value })); setErrors(prev => ({ ...prev, [field]: '' })); };

  const calcGrossMonthly = () => ['basic','hra','da','special'].reduce((sum, f) => sum + parseNum(formData[f]), 0);
  const calcWageBase = () => parseNum(formData.basic) + parseNum(formData.da);
  const calcRequiredMin = () => Math.round(calcGrossMonthly() * 0.5);
  const isCompliant = () => calcWageBase() >= calcRequiredMin() - 50;

  const buildWagePayload = () => ({
    ctc: parseNum(formData.ctc), basic: parseNum(formData.basic), hra: parseNum(formData.hra),
    da: parseNum(formData.da), special: parseNum(formData.special),
    currentPF: parseNum(formData.currentPF), empType: formData.empType,
    yearsOfService: parseNum(formData.yearsOfService), annualEmployerPfNps: parseNum(formData.annualEmployerPfNps)
  });

  const handleGetReport = async () => {
    setLoading(true);
    try {
      setGenStage(0);
      const reportPromise = fetch(`${BACKEND_URL}/api/p3/generate-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          language: formData.language,
          wage: buildWagePayload()
        })
      });
      await new Promise(r => setTimeout(r, 900));
      setGenStage(1);
      const reportRes = await reportPromise;
      const reportData = await reportRes.json();
      setGenStage(2);
      await new Promise(r => setTimeout(r, 700));

      if (reportData.success) {
        showToast('Wage Code Jaanch generate ho rahi hai! Email check karo 10 minute mein.', 'success');
        setGenStage(null);
        goHome();
      } else {
        setGenStage(null);
        showToast(reportData.error || 'Report generation failed. Please try again.', 'error');
      }
    } catch (err) {
      console.error('Report error:', err);
      setGenStage(null);
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const validateStep = (s) => {
    const errs = {};
    if (s === 1) { if (!formData.name.trim()) errs.name = 'Naam daalo'; if (!formData.email.trim() || !validateEmail(formData.email)) errs.email = 'Sahi email daalo'; }
    if (s === 2) {
      if (!formData.basic || parseNum(formData.basic) <= 0) errs.basic = 'Basic salary daalo';
      if (!formData.currentPF && formData.currentPF !== '0') errs.currentPF = 'PF deduction daalo (0 bhi likh sakte ho)';
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

  const grossMonthly = calcGrossMonthly();
  const wageBase = calcWageBase();
  const requiredMin = calcRequiredMin();
  const compliant = isCompliant();

  return (
    <div className="product-view">
      <div className="product-view-inner">
        <div className="product-view-header">
          <p className="product-view-adhyaya">◆ Adhyaya III — Vetan Sanhita ◆</p>
          <h2 className="product-view-title">Naya Wage Code Jaanch</h2>
          <p className="product-view-tagline">Naye Labour Codes ne tumhari salary structure badal di? 50% wage rule compliance check, chhupa hua take-home impact, aur gratuity growth — sab ek report mein.</p>
          <span className="product-view-price-tag">FREE Report</span>
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
              <div className="form-group"><label className="form-label">Employment Type</label><select className="form-select" value={formData.empType} onChange={e => handleChange('empType', e.target.value)}><option value="permanent">Permanent</option><option value="fixed-term">Fixed-Term Contract</option><option value="contract">Contract / Vendor Staff</option></select></div>
              <div className="form-group"><label className="form-label">Years of Service (is company mein)</label><input type="text" className="form-input" value={formData.yearsOfService} onChange={e => handleChange('yearsOfService', e.target.value)} placeholder="e.g. 2" inputMode="numeric" /></div>
              <div className="form-group full-width"><label className="form-label">Report Language</label><select className="form-select" value={formData.language} onChange={e => handleChange('language', e.target.value)}>{langOptions.map(l => <option key={l.v} value={l.v}>{l.l}</option>)}</select></div>
            </div>
            <div className="wizard-nav"><div></div><button className="btn-next" onClick={nextStep}>Next — Salary Structure <i className="fas fa-arrow-right" style={{marginLeft:'6px'}}></i></button></div>
          </div>
        )}

        {step === 2 && (
          <div className="form-card">
            <h3 className="form-section-title">◆ Tumhari Current Salary Structure</h3>
            <div className="net-pay-display">
              <p className="net-pay-label">50% Wage Rule Check (live preview)</p>
              <p className="net-pay-amount" style={{color: grossMonthly > 0 ? (compliant ? '#1F6E43' : '#A32D2D') : undefined, fontSize: '1.1rem'}}>
                {grossMonthly > 0 ? (compliant ? '✓ Compliant' : `✗ Basic+DA ${formatCurrency(wageBase)} vs required ${formatCurrency(requiredMin)}`) : 'Fields bharo neeche'}
              </p>
            </div>
            <div className="form-grid">
              <div className="form-group"><label className="form-label">Annual CTC</label><input type="text" className="form-input" value={formData.ctc} onChange={e => handleChange('ctc', e.target.value)} placeholder="e.g. 1200000" inputMode="numeric" /></div>
              <div className="form-group"><label className="form-label">Basic Salary (monthly)</label><input type="text" className={`form-input${errors.basic ? ' error' : ''}`} value={formData.basic} onChange={e => handleChange('basic', e.target.value)} placeholder="0" inputMode="numeric" /><span className="form-error">{errors.basic}</span></div>
              <div className="form-group"><label className="form-label">HRA (monthly)</label><input type="text" className="form-input" value={formData.hra} onChange={e => handleChange('hra', e.target.value)} placeholder="0" inputMode="numeric" /></div>
              <div className="form-group"><label className="form-label">Dearness Allowance (monthly)</label><input type="text" className="form-input" value={formData.da} onChange={e => handleChange('da', e.target.value)} placeholder="0 (most private companies: 0)" inputMode="numeric" /></div>
              <div className="form-group"><label className="form-label">Special / Other Allowance (monthly)</label><input type="text" className="form-input" value={formData.special} onChange={e => handleChange('special', e.target.value)} placeholder="0" inputMode="numeric" /></div>
              <div className="form-group"><label className="form-label">Current Monthly PF Deduction</label><input type="text" className={`form-input${errors.currentPF ? ' error' : ''}`} value={formData.currentPF} onChange={e => handleChange('currentPF', e.target.value)} placeholder="0" inputMode="numeric" /><span className="form-error">{errors.currentPF}</span></div>
              <div className="form-group full-width"><label className="form-label">Employer's Annual PF+NPS Contribution (agar pata ho, optional)</label><input type="text" className="form-input" value={formData.annualEmployerPfNps} onChange={e => handleChange('annualEmployerPfNps', e.target.value)} placeholder="e.g. 250000 (skip if not sure)" inputMode="numeric" /></div>
            </div>
            <div className="wizard-nav"><button className="btn-prev" onClick={prevStep}><i className="fas fa-arrow-left" style={{marginRight:'6px'}}></i> Back</button><button className="btn-next" onClick={nextStep}>Next — Review & Get Report <i className="fas fa-arrow-right" style={{marginLeft:'6px'}}></i></button></div>
          </div>
        )}

        {step === 3 && (
          <div className="form-card">
            <h3 className="form-section-title">◆ Review & Get Your Report</h3>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',fontSize:'0.9rem',marginBottom:'24px'}}>
              <div><span style={{fontFamily:'var(--font-ui)',fontSize:'0.72rem',color:'var(--muted)'}}>Name</span><br/><strong>{formData.name}</strong></div>
              <div><span style={{fontFamily:'var(--font-ui)',fontSize:'0.72rem',color:'var(--muted)'}}>Email</span><br/><strong>{formData.email}</strong></div>
              <div><span style={{fontFamily:'var(--font-ui)',fontSize:'0.72rem',color:'var(--muted)'}}>Gross Monthly</span><br/><strong>{formatCurrency(grossMonthly)}</strong></div>
              <div><span style={{fontFamily:'var(--font-ui)',fontSize:'0.72rem',color:'var(--muted)'}}>Wage Base (Basic+DA)</span><br/><strong>{formatCurrency(wageBase)}</strong></div>
              <div style={{gridColumn:'1/-1',textAlign:'center',padding:'10px',background: compliant ? '#1F6E43' : 'var(--sindoor-dark)',color:'var(--gold-light)',borderRadius:'6px',border:'1px solid var(--gold)'}}>
                <span style={{fontSize:'0.72rem',letterSpacing:'0.1em',textTransform:'uppercase'}}>50% Wage Rule Verdict</span><br/>
                <strong style={{fontSize:'1.2rem'}}>{compliant ? 'Compliant' : 'Not Yet Compliant'}</strong>
              </div>
            </div>
            <div style={{textAlign:'center'}}>
              <button className="btn-gold" onClick={handleGetReport} disabled={loading}>
                {loading ? (<><i className="fas fa-spinner fa-spin" style={{marginRight:'6px'}}></i> Generating...</>) : (<><i className="fas fa-scroll" style={{marginRight:'6px'}}></i> Get My Free Report</>)}
              </button>
              <p style={{fontFamily:'var(--font-ui)',fontSize:'0.7rem',color:'var(--muted)',marginTop:'10px'}}>Auto-refund if report is not delivered in 10 minutes</p>
            </div>
            <div className="wizard-nav"><button className="btn-prev" onClick={prevStep}><i className="fas fa-arrow-left" style={{marginRight:'6px'}}></i> Back</button><div></div></div>
          </div>
        )}
      </div>
      {genStage !== null && <ReportGenerating stage={genStage} productName="Naya Wage Code Jaanch" />}
    </div>
  );
};

export default P3View;
