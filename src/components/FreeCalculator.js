import React, { useState } from 'react';
import { calcOldRegimeTax, calcNewRegimeTax, formatCurrency, parseNum, getEmotionalHook } from '../utils/taxCalculator';

const FreeCalculator = ({ setCalcResult, calcResult, openProduct, setActiveModal }) => {
  const [ctc, setCtc] = useState('');
  const [deductions, setDeductions] = useState({ sec80c: '', hra: '', nps: '', homeLoan: '', med80d: '', other: '' });

  const handleDedChange = (field, value) => setDeductions(prev => ({ ...prev, [field]: value }));

  const calculate = () => {
    const ctcNum = parseNum(ctc);
    if (!ctcNum || ctcNum < 100000) { alert('CTC ₹1 Lakh se zyada daalo'); return; }
    const dedNums = { sec80c: parseNum(deductions.sec80c), hra: parseNum(deductions.hra), nps: parseNum(deductions.nps), homeLoan: parseNum(deductions.homeLoan), med80d: parseNum(deductions.med80d), other: parseNum(deductions.other) };
    const oldTax = calcOldRegimeTax(ctcNum, dedNums);
    const newTax = calcNewRegimeTax(ctcNum);
    const savings = Math.abs(oldTax - newTax);
    const winner = oldTax <= newTax ? 'old' : 'new';
    setCalcResult({ ctc: ctcNum, oldTax, newTax, savings, winner, deductions: dedNums });
  };

  const monthlyCTC = calcResult ? Math.round(calcResult.ctc / 12) : 0;

  return (
    <section className="calc-section" id="calcSection">
      <div className="container">
        <div className="calc-header reveal">
          <p className="calc-label">◆ Adhyaya 1 — Kar Vyavastha ◆</p>
          <h2 className="calc-title">Free Tax Calculator</h2>
          <p className="calc-subtitle">Old vs New regime — kaun sa bachata hai zyada paisa? Abhi jaano, muft.</p>
        </div>
        <div className="calc-card reveal">
          <div className="ctc-input-group">
            <label className="ctc-label" htmlFor="ctcInput">Annual CTC (Gross Salary)</label>
            <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'8px'}}>
              <span style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:'1.8rem',color:'var(--muted)'}}>₹</span>
              <input type="text" id="ctcInput" className="ctc-input" placeholder="e.g. 12,00,000" inputMode="numeric" value={ctc} onChange={e => setCtc(e.target.value)} />
            </div>
          </div>
          <p style={{textAlign:'center',fontFamily:'var(--font-cinzel)',fontSize:'0.7rem',color:'var(--sindoor-dark)',letterSpacing:'0.2em',textTransform:'uppercase',marginBottom:'16px'}}>◆ Deductions (Old Regime) ◆</p>
          <div className="deductions-grid">
            <div className="deduction-item"><label className="deduction-label">80C Investments <span>(max ₹1.5L)</span></label><input type="text" className="deduction-input" placeholder="e.g. 1,50,000" inputMode="numeric" value={deductions.sec80c} onChange={e => handleDedChange('sec80c', e.target.value)} /></div>
            <div className="deduction-item"><label className="deduction-label">HRA Exemption <span>(pre-calculated)</span></label><input type="text" className="deduction-input" placeholder="e.g. 60,000" inputMode="numeric" value={deductions.hra} onChange={e => handleDedChange('hra', e.target.value)} /></div>
            <div className="deduction-item"><label className="deduction-label">NPS 80CCD <span>(1B up to ₹50K)</span></label><input type="text" className="deduction-input" placeholder="e.g. 50,000" inputMode="numeric" value={deductions.nps} onChange={e => handleDedChange('nps', e.target.value)} /></div>
            <div className="deduction-item"><label className="deduction-label">Home Loan Interest <span>(24b up to ₹2L)</span></label><input type="text" className="deduction-input" placeholder="e.g. 1,80,000" inputMode="numeric" value={deductions.homeLoan} onChange={e => handleDedChange('homeLoan', e.target.value)} /></div>
            <div className="deduction-item"><label className="deduction-label">Medical Insurance 80D</label><input type="text" className="deduction-input" placeholder="e.g. 25,000" inputMode="numeric" value={deductions.med80d} onChange={e => handleDedChange('med80d', e.target.value)} /></div>
            <div className="deduction-item"><label className="deduction-label">Other Deductions</label><input type="text" className="deduction-input" placeholder="e.g. 0" inputMode="numeric" value={deductions.other} onChange={e => handleDedChange('other', e.target.value)} /></div>
          </div>
          <div className="calc-btn-wrap"><button className="btn-calculate" onClick={calculate}>◆ Calculate Tax ◆</button></div>

          {calcResult && (
            <div className="verdict-section">
              <div className="ornament-divider">✦ ✦ ✦</div>
              <div className={`verdict-banner ${calcResult.winner === 'old' ? 'old-wins' : 'new-wins'}`}>
                <p className="verdict-text">{calcResult.winner === 'old' ? 'OLD REGIME WINS' : 'NEW REGIME WINS'}</p>
                <p className="verdict-sub">{calcResult.winner === 'old' ? 'Old regime mein tum' : 'New regime mein tum'} ₹{Math.round(calcResult.savings).toLocaleString('en-IN')} kam tax doge</p>
              </div>
              <div className="regime-cards">
                <div className={`regime-card${calcResult.winner === 'old' ? ' winner-old' : ''}`}>
                  {calcResult.winner === 'old' && <span className="winner-badge old-badge">WINNER</span>}
                  <p className="regime-card-label">Old Regime</p>
                  <p className="regime-card-name">Old Tax Regime</p>
                  <p className="regime-card-amount">{formatCurrency(calcResult.oldTax)}</p>
                  <p className="regime-card-monthly">Monthly take-home: <strong>{formatCurrency(monthlyCTC - Math.round(calcResult.oldTax / 12))}</strong></p>
                </div>
                <div className={`regime-card${calcResult.winner === 'new' ? ' winner' : ''}`}>
                  {calcResult.winner === 'new' && <span className="winner-badge">WINNER</span>}
                  <p className="regime-card-label">New Regime</p>
                  <p className="regime-card-name">New Tax Regime</p>
                  <p className="regime-card-amount">{formatCurrency(calcResult.newTax)}</p>
                  <p className="regime-card-monthly">Monthly take-home: <strong>{formatCurrency(monthlyCTC - Math.round(calcResult.newTax / 12))}</strong></p>
                </div>
              </div>
              <div className="savings-banner">
                <p className="savings-label">You Save With The Winning Regime</p>
                <p className="savings-amount">{formatCurrency(calcResult.savings)}</p>
                <p className="savings-sub">Saal mein ₹{Math.round(calcResult.savings).toLocaleString('en-IN')} — mahine mein ₹{Math.round(calcResult.savings / 12).toLocaleString('en-IN')}</p>
              </div>
              <div className="emotional-hook"><p>{getEmotionalHook(calcResult.savings)}</p></div>
              <div className="verdict-cta">
                <p>Yeh toh bas trailer hai. Puri Patrika lelo — slab-by-slab breakdown, deduction optimizer, HR declaration letter, sab kuch.</p>
                <button className="btn-gold" onClick={() => openProduct('p1')}>Get Your Free Tankha Puraan Patrika</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FreeCalculator;
