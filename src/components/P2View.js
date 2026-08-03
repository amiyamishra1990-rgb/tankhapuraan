import React, { useState } from 'react';
import ReportGenerating from './ReportGenerating';
import { parseNum, formatCurrency, validateEmail } from '../utils/taxCalculator';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://tankhapuraan-backend-432180395696.asia-south1.run.app';

const P2View = ({ goHome, showToast }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', month: '7', empType: 'permanent', state: 'MH', language: 'hi', basic: '', hra: '', da: '', conveyance: '', medical: '', special: '', otherEarn: '', pf: '', esi: '', pt: '', tds: '', otherDed: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [genStage, setGenStage] = useState(null);

  const handleChange = (field, value) => { setFormData(prev => ({ ...prev, [field]: value })); setErrors(prev => ({ ...prev, [field]: '' })); };

  const calcNetPay = () => {
    const earnings = ['basic','hra','da','conveyance','medical','special','otherEarn'].reduce((sum, f) => sum + parseNum(formData[f]), 0);
    const deductions = ['pf','esi','pt','tds','otherDed'].reduce((sum, f) => sum + parseNum(formData[f]), 0);
    return earnings - deductions;
  };

  const buildSlipPayload = () => ({
    basic: parseNum(formData.basic), hra: parseNum(formData.hra), da: parseNum(formData.da),
    conveyance: parseNum(formData.conveyance), medical: parseNum(formData.medical),
    special: parseNum(formData.special), otherEarn: parseNum(formData.otherEarn),
    pf: parseNum(formData.pf), esi: parseNum(formData.esi), pt: parseNum(formData.pt),
    tds: parseNum(formData.tds), otherDed: parseNum(formData.otherDed),
    state: formData.state, empType: formData.empType, month: formData.month
  });

  const handleGetReport = async () => {
    setLoading(true);
    try {
      setGenStage(0);
      const reportPromise = fetch(`${BACKEND_URL}/api/p2/generate-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          language: formData.language,
          slip: buildSlipPayload()
        })
      });
      await new Promise(r => setTimeout(r, 900));
      setGenStage(1);
      const reportRes = await reportPromise;
      const reportData = await reportRes.json();
      setGenStage(2);
      await new Promise(r => setTimeout(r, 700));

      if (reportData.success) {
        showToast('Slip Pariksha generate ho rahi hai! Email check karo 10 minute mein.', 'success');
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
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => { if (validateStep(step)) { setStep(step + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); } };
  const prevStep = () => { setStep(step - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const netPay = calcNetPay();
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const states = [
    {v:'AP',l:'Andhra Pradesh'},{v:'AR',l:'Arunachal Pradesh'},{v:'AS',l:'Assam'},{v:'BR',l:'Bihar'},
    {v:'CG',l:'Chhattisgarh'},{v:'DL',l:'Delhi'},{v:'GA',l:'Goa'},{v:'GJ',l:'Gujarat'},{v:'HR',l:'Haryana'},
    {v:'HP',l:'Himachal Pradesh'},{v:'JH',l:'Jharkhand'},{v:'KA',l:'Karnataka'},{v:'KL',l:'Kerala'},
    {v:'MP',l:'Madhya Pradesh'},{v:'MH',l:'Maharashtra'},{v:'MN',l:'Manipur'},{v:'ML',l:'Meghalaya'},
    {v:'MZ',l:'Mizoram'},{v:'NL',l:'Nagaland'},{v:'OR',l:'Odisha'},{v:'PB',l:'Punjab'},{v:'RJ',l:'Rajasthan'},
    {v:'SK',l:'Sikkim'},{v:'TN',l:'Tamil Nadu'},{v:'TG',l:'Telangana'},{v:'TR',l:'Tripura'},
    {v:'UP',l:'Uttar Pradesh'},{v:'UK',l:'Uttarakhand'},{v:'WB',l:'West Bengal'},
    {v:'AN',l:'Andaman & Nicobar'},{v:'CH',l:'Chandigarh'},{v:'JK',l:'Jammu & Kashmir'},{v:'LA',l:'Ladakh'},
    {v:'PY',l:'Puducherry'},{v:'Other',l:'Other'}
  ];
  const langOptions = [
    {v:'hi',l:'हिन्दी (Hindi)'},{v:'en',l:'English'},{v:'bn',l:'বাংলা (Bengali)'},{v:'te',l:'తెలుగు (Telugu)'},
    {v:'mr',l:'मराठी (Marathi)'},{v:'ta',l:'தமிழ் (Tamil)'},{v:'gu',l:'ગુજરાતી (Gujarati)'},{v:'kn',l:'ಕನ್ನಡ (Kannada)'},
    {v:'ml',l:'മലയാളം (Malayalam)'},{v:'pa',l:'ਪੰਜਾਬੀ (Punjabi)'},{v:'or',l:'ଓଡ଼ିଆ (Odia)'},{v:'ur',l:'اردو (Urdu)'},
    {v:'as',l:'অসমীয়া (Assamese)'},{v:'mai',l:'मैथिली (Maithili)'},{v:'ne',l:'नेपाली (Nepali)'},{v:'gom',l:'कोंकणी (Konkani)'},
    {v:'doi',l:'डोगरी (Dogri)'},{v:'sa',l:'संस्कृत (Sanskrit)'},{v:'mni',l:'ꯃꯤꯇꯩꯂꯣꯟ (Manipuri)'},{v:'brx',l:'बड़ो (Bodo)'},
    {v:'sat',l:'ᱥᱟᱱᱛᱟᱲᱤ (Santali)'},{v:'ks',l:'کٲشُر (Kashmiri)'},{v:'sd',l:'سنڌي (Sindhi)'}
  ];

  const totalEarnings = ['basic','hra','da','conveyance','medical','special','otherEarn'].reduce((s,f) => s + parseNum(formData[f]), 0);
  const totalDeductions = ['pf','esi','pt','tds','otherDed'].reduce((s,f) => s + parseNum(formData[f]), 0);

  return (
    <div className="product-view">
      <div className="product-view-inner">
        <div className="product-view-header">
          <p className="product-view-adhyaya">◆ Adhyaya II — Vetan Pariksha ◆</p>
          <h2 className="product-view-title">Slip Pariksha</h2>
          <p className="product-view-tagline">Tumhari salary slip sahi hai ya galat? Har line decode, Slip Health Score, aur restructure letter.</p>
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
              <div className="form-group"><label className="form-label">Slip Month</label><select className="form-select" value={formData.month} onChange={e => handleChange('month', e.target.value)}>{monthNames.map((m,i) => <option key={i} value={i+1}>{m}</option>)}</select></div>
              <div className="form-group"><label className="form-label">Employment Type</label><select className="form-select" value={formData.empType} onChange={e => handleChange('empType', e.target.value)}><option value="permanent">Permanent</option><option value="probation">Probation</option><option value="contract">Contract</option></select></div>
              <div className="form-group"><label className="form-label">State</label><select className="form-select" value={formData.state} onChange={e => handleChange('state', e.target.value)}>{states.map(s => <option key={s.v} value={s.v}>{s.l}</option>)}</select></div>
              <div className="form-group"><label className="form-label">Report Language</label><select className="form-select" value={formData.language} onChange={e => handleChange('language', e.target.value)}>{langOptions.map(l => <option key={l.v} value={l.v}>{l.l}</option>)}</select></div>
            </div>
            <div className="wizard-nav"><div></div><button className="btn-next" onClick={nextStep}>Next — Salary Slip Details <i className="fas fa-arrow-right" style={{marginLeft:'6px'}}></i></button></div>
          </div>
        )}

        {step === 2 && (
          <div className="form-card">
            <h3 className="form-section-title">◆ Earnings & Deductions</h3>
            <div className="net-pay-display"><p className="net-pay-label">Calculated Net Pay</p><p className="net-pay-amount" style={{color: netPay < 0 ? '#ff6b6b' : undefined}}>{formatCurrency(Math.max(0, netPay))}</p></div>
            <p style={{fontFamily:'var(--font-cinzel)',fontSize:'0.68rem',color:'var(--sindoor-dark)',letterSpacing:'0.15em',textTransform:'uppercase',marginBottom:'14px'}}>◆ Earnings</p>
            <div className="form-grid">
              <div className="form-group"><label className="form-label">Basic Salary</label><input type="text" className="form-input" value={formData.basic} onChange={e => handleChange('basic', e.target.value)} placeholder="0" inputMode="numeric" /></div>
              <div className="form-group"><label className="form-label">HRA</label><input type="text" className="form-input" value={formData.hra} onChange={e => handleChange('hra', e.target.value)} placeholder="0" inputMode="numeric" /></div>
              <div className="form-group"><label className="form-label">Dearness Allowance</label><input type="text" className="form-input" value={formData.da} onChange={e => handleChange('da', e.target.value)} placeholder="0" inputMode="numeric" /></div>
              <div className="form-group"><label className="form-label">Conveyance Allowance</label><input type="text" className="form-input" value={formData.conveyance} onChange={e => handleChange('conveyance', e.target.value)} placeholder="0" inputMode="numeric" /></div>
              <div className="form-group"><label className="form-label">Medical Allowance</label><input type="text" className="form-input" value={formData.medical} onChange={e => handleChange('medical', e.target.value)} placeholder="0" inputMode="numeric" /></div>
              <div className="form-group"><label className="form-label">Special Allowance</label><input type="text" className="form-input" value={formData.special} onChange={e => handleChange('special', e.target.value)} placeholder="0" inputMode="numeric" /></div>
              <div className="form-group full-width"><label className="form-label">Other Earnings</label><input type="text" className="form-input" value={formData.otherEarn} onChange={e => handleChange('otherEarn', e.target.value)} placeholder="0" inputMode="numeric" /></div>
            </div>
            <hr className="ornament-rule" style={{margin:'20px 0'}} />
            <p style={{fontFamily:'var(--font-cinzel)',fontSize:'0.68rem',color:'var(--sindoor-dark)',letterSpacing:'0.15em',textTransform:'uppercase',marginBottom:'14px'}}>◆ Deductions</p>
            <div className="form-grid">
              <div className="form-group"><label className="form-label">PF (Employee)</label><input type="text" className="form-input" value={formData.pf} onChange={e => handleChange('pf', e.target.value)} placeholder="0" inputMode="numeric" /></div>
              <div className="form-group"><label className="form-label">ESI</label><input type="text" className="form-input" value={formData.esi} onChange={e => handleChange('esi', e.target.value)} placeholder="0" inputMode="numeric" /></div>
              <div className="form-group"><label className="form-label">Professional Tax</label><input type="text" className="form-input" value={formData.pt} onChange={e => handleChange('pt', e.target.value)} placeholder="0" inputMode="numeric" /></div>
              <div className="form-group"><label className="form-label">TDS</label><input type="text" className="form-input" value={formData.tds} onChange={e => handleChange('tds', e.target.value)} placeholder="0" inputMode="numeric" /></div>
              <div className="form-group full-width"><label className="form-label">Other Deductions</label><input type="text" className="form-input" value={formData.otherDed} onChange={e => handleChange('otherDed', e.target.value)} placeholder="0" inputMode="numeric" /></div>
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
              <div><span style={{fontFamily:'var(--font-ui)',fontSize:'0.72rem',color:'var(--muted)'}}>Gross Earnings</span><br/><strong>{formatCurrency(totalEarnings)}</strong></div>
              <div><span style={{fontFamily:'var(--font-ui)',fontSize:'0.72rem',color:'var(--muted)'}}>Total Deductions</span><br/><strong>{formatCurrency(totalDeductions)}</strong></div>
              <div style={{gridColumn:'1/-1',textAlign:'center',padding:'10px',background:'var(--sindoor-dark)',color:'var(--gold-light)',borderRadius:'6px',border:'1px solid var(--gold)'}}>
                <span style={{fontSize:'0.72rem',letterSpacing:'0.1em',textTransform:'uppercase'}}>Net Pay</span><br/>
                <strong style={{fontSize:'1.4rem'}}>{formatCurrency(totalEarnings - totalDeductions)}</strong>
              </div>
            </div>
            <div style={{textAlign:'center',padding:'20px',background:'var(--parchment-deep)',borderRadius:'8px',border:'1px dashed var(--gold)',marginBottom:'20px'}}>
              <p style={{fontFamily:'var(--font-cinzel)',fontSize:'0.7rem',color:'var(--sindoor-dark)',letterSpacing:'0.2em',textTransform:'uppercase',marginBottom:'8px'}}>Your Report</p>
              <p style={{fontFamily:'var(--font-display)',fontWeight:900,fontSize:'2.2rem',color:'var(--green)'}}>FREE</p>
              <p style={{fontFamily:'var(--font-ui)',fontSize:'0.75rem',color:'var(--muted)'}}>No card, no payment — just your email</p>
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
      {genStage !== null && <ReportGenerating stage={genStage} productName="Slip Pariksha" />}
    </div>
  );
};

export default P2View;
