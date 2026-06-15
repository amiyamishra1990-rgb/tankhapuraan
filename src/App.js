// App-v6.js — TankhaPuraan Production Frontend
// Artha Technologies Pvt Ltd
// "The Holy Scripture of Your Salary"
// v6: 24 languages, RTL support, Tax Calculator LIVE, 9 tools Coming Soon

import { useState, useMemo } from "react";
import { LANGS, t, isRTL } from "./translations";

// ─── COLORS ───────────────────────────────────────────────────────────────────
const C = {
  ink:          "#241511",
  paper:        "#FBF3E4",
  paperDeep:    "#F3E6CC",
  paperLight:   "#FFFDF7",
  sindoor:      "#A41E22",
  sindoorDark:  "#7C1316",
  sindoorLight: "#C8373C",
  gold:         "#B8860B",
  goldSoft:     "#D9B45B",
  goldLight:    "#F0D080",
  green:        "#1F6E43",
  greenLight:   "#2A9158",
  muted:        "#7A6A5A",
  border:       "#E0CDA8",
};

// ─── TAX MATH ─────────────────────────────────────────────────────────────────
const inr = (n) => "₹" + Math.abs(Math.round(n)).toLocaleString("en-IN");

function calcOldRegime(gross, deductions) {
  const sd = 50000;
  const taxable = Math.max(0, gross - sd - deductions);
  let tax = 0;
  if (taxable <= 250000) tax = 0;
  else if (taxable <= 500000) tax = (taxable - 250000) * 0.05;
  else if (taxable <= 1000000) tax = 12500 + (taxable - 500000) * 0.20;
  else tax = 112500 + (taxable - 1000000) * 0.30;
  // Rebate 87A: if taxable ≤ 5L, tax = 0
  if (taxable <= 500000) tax = 0;
  const cess = tax * 0.04;
  return Math.round(tax + cess);
}

function calcNewRegime(gross) {
  const sd = 75000;
  const taxable = Math.max(0, gross - sd);
  let tax = 0;
  if (taxable <= 300000) tax = 0;
  else if (taxable <= 700000) tax = (taxable - 300000) * 0.05;
  else if (taxable <= 1000000) tax = 20000 + (taxable - 700000) * 0.10;
  else if (taxable <= 1200000) tax = 50000 + (taxable - 1000000) * 0.15;
  else if (taxable <= 1500000) tax = 80000 + (taxable - 1200000) * 0.20;
  else tax = 140000 + (taxable - 1500000) * 0.30;
  // Rebate 87A: if taxable ≤ 7L, tax = 0
  if (taxable <= 700000) tax = 0;
  const cess = tax * 0.04;
  return Math.round(tax + cess);
}

// ─── TOOL DATA ────────────────────────────────────────────────────────────────
const TOOLS = [
  { id: 1,  keyName: "tool1",  live: true,  price: "free+paid" },
  { id: 2,  keyName: "tool2",  live: false, price: "₹99–299"   },
  { id: 3,  keyName: "tool3",  live: false, price: "₹149–299"  },
  { id: 4,  keyName: "tool4",  live: false, price: "₹199–499"  },
  { id: 5,  keyName: "tool5",  live: false, price: "₹199/mo"   },
  { id: 6,  keyName: "tool6",  live: false, price: "₹199–499"  },
  { id: 7,  keyName: "tool7",  live: false, price: "₹99–199"   },
  { id: 8,  keyName: "tool8",  live: false, price: "₹149"      },
  { id: 9,  keyName: "tool9",  live: false, price: "₹99"       },
  { id: 10, keyName: "tool10", live: false, price: "₹299–499"  },
];

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Inter', sans-serif;
    background: ${C.paper};
    color: ${C.ink};
    line-height: 1.6;
  }

  .app { min-height: 100vh; }

  /* HEADER */
  .header {
    background: ${C.ink};
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    min-height: 64px;
    position: sticky;
    top: 0;
    z-index: 100;
    border-bottom: 3px solid ${C.sindoor};
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
  }

  .brand-icon {
    width: 36px;
    height: 36px;
    background: ${C.sindoor};
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
  }

  .brand-name {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 900;
    color: #fff;
    letter-spacing: -0.3px;
  }

  .brand-name span { color: ${C.goldSoft}; }

  .lang-select {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.25);
    color: #fff;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 13px;
    cursor: pointer;
    outline: none;
    max-width: 160px;
  }

  .lang-select:hover { background: rgba(255,255,255,0.18); }
  .lang-select option { background: ${C.ink}; color: #fff; }

  /* HERO */
  .hero {
    background: linear-gradient(135deg, ${C.ink} 0%, #3D1F18 60%, ${C.sindoorDark} 100%);
    padding: 72px 24px 80px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .hero::before {
    content: '';
    position: absolute;
    top: -60px; left: -60px; right: -60px;
    height: 200px;
    background: radial-gradient(ellipse, rgba(184,134,11,0.15) 0%, transparent 70%);
    pointer-events: none;
  }

  .hero-om {
    font-size: 40px;
    margin-bottom: 16px;
    opacity: 0.9;
    display: block;
  }

  .hero-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(28px, 6vw, 52px);
    font-weight: 900;
    color: #fff;
    line-height: 1.15;
    margin-bottom: 8px;
  }

  .hero-title span { color: ${C.goldSoft}; }

  .hero-tagline {
    font-size: clamp(13px, 2.5vw, 17px);
    color: rgba(255,255,255,0.7);
    font-style: italic;
    margin-bottom: 20px;
  }

  .hero-sub {
    font-size: clamp(13px, 2vw, 15px);
    color: rgba(255,255,255,0.6);
    max-width: 560px;
    margin: 0 auto 32px;
    line-height: 1.7;
  }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(184,134,11,0.2);
    border: 1px solid rgba(184,134,11,0.4);
    color: ${C.goldSoft};
    padding: 8px 20px;
    border-radius: 100px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  /* MAIN CONTENT */
  .main { max-width: 1100px; margin: 0 auto; padding: 48px 20px 80px; }

  /* SECTION HEADER */
  .section-header {
    text-align: center;
    margin-bottom: 36px;
  }

  .section-eyebrow {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: ${C.sindoor};
    margin-bottom: 8px;
  }

  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(22px, 4vw, 32px);
    font-weight: 700;
    color: ${C.ink};
    line-height: 1.25;
  }

  /* CALCULATOR CARD */
  .calc-card {
    background: #fff;
    border: 1.5px solid ${C.border};
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 48px;
    box-shadow: 0 4px 24px rgba(36,21,17,0.06);
  }

  .calc-header {
    background: linear-gradient(135deg, ${C.sindoor}, ${C.sindoorDark});
    padding: 20px 28px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .calc-header-icon {
    width: 40px; height: 40px;
    background: rgba(255,255,255,0.15);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
  }

  .calc-header-text h2 {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    color: #fff;
    font-weight: 700;
  }

  .calc-header-text p {
    font-size: 12px;
    color: rgba(255,255,255,0.75);
    margin-top: 2px;
  }

  .free-badge {
    margin-left: auto;
    background: ${C.goldSoft};
    color: ${C.ink};
    font-size: 11px;
    font-weight: 700;
    padding: 4px 12px;
    border-radius: 100px;
    letter-spacing: 0.5px;
  }

  .calc-body { padding: 28px; }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
    margin-bottom: 24px;
  }

  .form-group label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: ${C.muted};
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-bottom: 6px;
  }

  .form-group input {
    width: 100%;
    padding: 12px 16px;
    border: 1.5px solid ${C.border};
    border-radius: 10px;
    font-size: 15px;
    color: ${C.ink};
    background: ${C.paperLight};
    outline: none;
    transition: border-color 0.2s;
    font-family: 'Inter', sans-serif;
  }

  .form-group input:focus { border-color: ${C.sindoor}; background: #fff; }

  .deductions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    background: ${C.paperDeep};
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 24px;
    border: 1px solid ${C.border};
  }

  .deductions-label {
    grid-column: 1 / -1;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: ${C.muted};
    margin-bottom: -4px;
  }

  .deduction-item label {
    font-size: 11px;
    font-weight: 600;
    color: ${C.muted};
    display: block;
    margin-bottom: 4px;
  }

  .deduction-item input {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid ${C.border};
    border-radius: 8px;
    font-size: 14px;
    color: ${C.ink};
    background: #fff;
    outline: none;
    transition: border-color 0.2s;
    font-family: 'Inter', sans-serif;
  }

  .deduction-item input:focus { border-color: ${C.sindoor}; }

  .calc-btn {
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, ${C.sindoor}, ${C.sindoorDark});
    color: #fff;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
    font-family: 'Inter', sans-serif;
    letter-spacing: 0.3px;
  }

  .calc-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(164,30,34,0.3); }
  .calc-btn:active { transform: translateY(0); }

  /* VERDICT */
  .verdict {
    margin-top: 28px;
    border-top: 1.5px solid ${C.border};
    padding-top: 28px;
    animation: fadeIn 0.4s ease;
  }

  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

  .verdict-title {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 700;
    color: ${C.ink};
    margin-bottom: 20px;
    text-align: center;
  }

  .regime-compare {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 24px;
  }

  .regime-card {
    background: ${C.paperDeep};
    border: 2px solid ${C.border};
    border-radius: 14px;
    padding: 20px;
    text-align: center;
    transition: all 0.2s;
  }

  .regime-card.winner {
    background: linear-gradient(135deg, ${C.sindoor}12, ${C.sindoor}06);
    border-color: ${C.sindoor};
    position: relative;
  }

  .winner-badge {
    position: absolute;
    top: -11px;
    left: 50%;
    transform: translateX(-50%);
    background: ${C.sindoor};
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    padding: 3px 14px;
    border-radius: 100px;
    letter-spacing: 1px;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .regime-name {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: ${C.muted};
    margin-bottom: 8px;
  }

  .regime-tax {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 900;
    color: ${C.ink};
  }

  .regime-label { font-size: 12px; color: ${C.muted}; margin-top: 4px; }

  .savings-banner {
    background: linear-gradient(135deg, ${C.green}, ${C.greenLight});
    color: #fff;
    border-radius: 12px;
    padding: 18px 24px;
    text-align: center;
    margin-bottom: 24px;
  }

  .savings-amount {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    font-weight: 900;
    display: block;
  }

  .savings-label { font-size: 13px; opacity: 0.9; margin-top: 2px; }

  /* PDF CTA */
  .pdf-cta {
    background: linear-gradient(135deg, ${C.sindoorDark} 0%, ${C.sindoor} 100%);
    border-radius: 16px;
    padding: 28px 24px;
    margin-top: 24px;
    text-align: center;
    position: relative;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(124,19,22,0.25);
  }

  .pdf-cta::before {
    content: '📜';
    position: absolute;
    top: -16px; right: -16px;
    font-size: 90px;
    opacity: 0.07;
    transform: rotate(15deg);
    pointer-events: none;
  }

  .pdf-cta-badge {
    display: inline-block;
    background: rgba(255,255,255,0.15);
    color: ${C.goldLight};
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.5px;
    padding: 4px 14px;
    border-radius: 20px;
    margin-bottom: 12px;
    text-transform: uppercase;
  }

  .pdf-cta-title {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 800;
    color: #fff;
    margin-bottom: 8px;
    line-height: 1.3;
  }

  .pdf-cta-sub {
    font-size: 13px;
    color: rgba(255,255,255,0.8);
    margin-bottom: 18px;
    line-height: 1.6;
  }

  .pdf-features {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    margin-bottom: 22px;
    list-style: none;
  }

  .pdf-features li {
    font-size: 12px;
    color: rgba(255,255,255,0.9);
    background: rgba(255,255,255,0.12);
    padding: 4px 12px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .pdf-features li::before {
    content: '✅';
    flex-shrink: 0;
    font-size: 11px;
  }

  .pdf-btn {
    width: 100%;
    padding: 17px;
    background: ${C.goldLight};
    color: ${C.sindoorDark};
    border: none;
    border-radius: 12px;
    font-size: 17px;
    font-weight: 800;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
    font-family: 'Inter', sans-serif;
    letter-spacing: 0.3px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  }

  .pdf-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.3); }
  .pdf-btn:active { transform: translateY(0); }

  .pdf-trust {
    font-size: 11px;
    color: rgba(255,255,255,0.55);
    margin-top: 12px;
  }

  .disclaimer {
    margin-top: 14px;
    font-size: 11px;
    color: ${C.muted};
    line-height: 1.6;
    font-style: italic;
  }

  /* TOOLS GRID */
  .tools-section { margin-top: 48px; }

  .tools-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
  }

  .tool-card {
    background: #fff;
    border: 1.5px solid ${C.border};
    border-radius: 14px;
    padding: 22px;
    transition: transform 0.15s, box-shadow 0.15s;
    position: relative;
    overflow: hidden;
  }

  .tool-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, ${C.sindoor}, ${C.sindoorLight});
    opacity: 0;
    transition: opacity 0.2s;
  }

  .tool-card:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(36,21,17,0.08); }
  .tool-card:hover::before { opacity: 1; }

  .tool-card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 10px;
    gap: 10px;
  }

  .tool-name {
    font-family: 'Playfair Display', serif;
    font-size: 16px;
    font-weight: 700;
    color: ${C.ink};
    line-height: 1.3;
  }

  .tool-tag {
    flex-shrink: 0;
    font-size: 11px;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 100px;
    white-space: nowrap;
  }

  .tag-free { background: ${C.green}20; color: ${C.green}; border: 1px solid ${C.green}40; }
  .tag-paid { background: ${C.sindoor}15; color: ${C.sindoor}; border: 1px solid ${C.sindoor}40; }
  .tag-soon { background: ${C.gold}20; color: ${C.gold}; border: 1px solid ${C.gold}40; }

  .tool-desc {
    font-size: 13px;
    color: ${C.muted};
    line-height: 1.6;
    margin-bottom: 14px;
  }

  .tool-price {
    font-size: 13px;
    font-weight: 600;
    color: ${C.ink};
  }

  /* FOOTER */
  .footer {
    background: ${C.ink};
    color: rgba(255,255,255,0.5);
    text-align: center;
    padding: 40px 24px;
    border-top: 3px solid ${C.sindoor};
  }

  .footer-brand {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    color: #fff;
    margin-bottom: 6px;
  }

  .footer-brand span { color: ${C.goldSoft}; }
  .footer-tagline { font-size: 13px; font-style: italic; margin-bottom: 8px; }
  .footer-sub { font-size: 11px; opacity: 0.5; }

  /* RTL */
  .rtl { direction: rtl; text-align: right; }
  .rtl .form-grid, .rtl .deductions-grid { direction: rtl; }

  /* RESPONSIVE */
  @media (max-width: 600px) {
    .hero { padding: 48px 16px 56px; }
    .calc-body { padding: 20px 16px; }
    .regime-compare { grid-template-columns: 1fr; }
    .tools-grid { grid-template-columns: 1fr; }
    .form-grid { grid-template-columns: 1fr; }
  }
`;

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang]           = useState("hl");
  const [income, setIncome]       = useState("");
  const [ded80c, setDed80c]       = useState("");
  const [hra, setHra]             = useState("");
  const [nps, setNps]             = useState("");
  const [homeLoan, setHomeLoan]   = useState("");
  const [med80d, setMed80d]       = useState("");
  const [otherDed, setOtherDed]   = useState("");
  const [result, setResult]       = useState(null);

  const rtl = isRTL(lang);
  const s   = (key) => t(lang, key);

  const totalDeductions = useMemo(() => {
    return [ded80c, hra, nps, homeLoan, med80d, otherDed]
      .map(v => parseFloat(v) || 0)
      .reduce((a, b) => a + b, 0);
  }, [ded80c, hra, nps, homeLoan, med80d, otherDed]);

  const handleCalculate = () => {
    const gross = parseFloat(income) || 0;
    if (gross <= 0) return;
    const oldTax = calcOldRegime(gross, totalDeductions);
    const newTax = calcNewRegime(gross);
    const winner = oldTax <= newTax ? "old" : "new";
    const saving  = Math.abs(oldTax - newTax);
    setResult({ oldTax, newTax, winner, saving, gross });
  };

  const handlePDFClick = () => {
    const base = "https://rzp.io/rzp/QRzNrdB0";
    const params = new URLSearchParams({
      "notes[annual_ctc]":        income || "0",
      "notes[hra_received]":      hra || "0",
      "notes[rent_paid]":         String(Math.round(parseFloat(hra || 0) * 1.33)),
      "notes[metro_city]":        "no",
      "notes[section_80c]":       ded80c || "0",
      "notes[section_80d]":       med80d || "0",
      "notes[other_deductions]":  otherDed || "0",
    });
    window.open(base + "?" + params.toString(), "_blank");
  };

  return (
    <>
      <style>{styles}</style>
      <div className={`app ${rtl ? "rtl" : ""}`}>

        {/* HEADER */}
        <header className="header">
          <div className="brand">
            <img
              src="/logo.png"
              alt="TankhaPuraan"
              style={{ height: 38, width: 38, objectFit: "contain", borderRadius: 8 }}
              onError={e => { e.target.style.display='none'; }}
            />
            <div className="brand-name">Tankha<span>Puraan</span></div>
          </div>
          <select
            className="lang-select"
            value={lang}
            onChange={e => { setLang(e.target.value); setResult(null); }}
          >
            {LANGS.map(l => (
              <option key={l.c} value={l.c}>{l.n}</option>
            ))}
          </select>
        </header>

        {/* HERO */}
        <section className="hero">
          <span className="hero-om">🕉</span>
          <h1 className="hero-title">
            Consult the <span>TankhaPuraan</span>
          </h1>
          <p className="hero-tagline">"{s("tagline")}"</p>
          <p className="hero-sub">{s("sub")}</p>
          <div className="hero-badge">
            <span>⚡</span>
            <span>{s("heroSub") || "Before any job offer. Before tax season. Before negotiation."}</span>
          </div>
        </section>

        {/* MAIN */}
        <main className="main">

          {/* TAX CALCULATOR */}
          <div className="section-header">
            <p className="section-eyebrow">Tool #1 — Live Now</p>
            <h2 className="section-title">{s("tool1")}</h2>
          </div>

          <div className="calc-card">
            <div className="calc-header">
              <div className="calc-header-icon">🧮</div>
              <div className="calc-header-text">
                <h2>{s("tool1")}</h2>
                <p>{s("tool1desc")}</p>
              </div>
              <span className="free-badge">{s("free")}</span>
            </div>

            <div className="calc-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>{s("annualIncome")}</label>
                  <input
                    type="number"
                    placeholder={s("enterIncome")}
                    value={income}
                    onChange={e => { setIncome(e.target.value); setResult(null); }}
                  />
                </div>
              </div>

              <div className="deductions-grid">
                <span className="deductions-label">
                  {s("deductions") || "Deductions (Optional)"}
                </span>
                {[
                  { label: s("sd80c") || "80C Investment",    val: ded80c,  set: setDed80c  },
                  { label: s("hra")   || "HRA Exemption",     val: hra,     set: setHra     },
                  { label: s("nps")   || "NPS (80CCD)",        val: nps,     set: setNps     },
                  { label: s("homeLoan") || "Home Loan Int.", val: homeLoan,set: setHomeLoan },
                  { label: s("calculate80D") || "Mediclaim (80D)", val: med80d, set: setMed80d },
                  { label: s("otherDeductions") || "Other",   val: otherDed,set: setOtherDed },
                ].map((item, i) => (
                  <div className="deduction-item" key={i}>
                    <label>{item.label}</label>
                    <input
                      type="number"
                      placeholder="₹0"
                      value={item.val}
                      onChange={e => { item.set(e.target.value); setResult(null); }}
                    />
                  </div>
                ))}
              </div>

              <button className="calc-btn" onClick={handleCalculate}>
                {s("calculate")} →
              </button>

              {/* VERDICT */}
              {result && (
                <div className="verdict">
                  <h3 className="verdict-title">📿 {s("yourVerdict")}</h3>

                  <div className="regime-compare">
                    <div className={`regime-card ${result.winner === "old" ? "winner" : ""}`}>
                      {result.winner === "old" && (
                        <span className="winner-badge">✓ {s("goWith")}</span>
                      )}
                      <div className="regime-name">{s("oldRegime")}</div>
                      <div className="regime-tax">{inr(result.oldTax)}</div>
                      <div className="regime-label">{s("taxPayable")}</div>
                    </div>
                    <div className={`regime-card ${result.winner === "new" ? "winner" : ""}`}>
                      {result.winner === "new" && (
                        <span className="winner-badge">✓ {s("goWith")}</span>
                      )}
                      <div className="regime-name">{s("newRegime")}</div>
                      <div className="regime-tax">{inr(result.newTax)}</div>
                      <div className="regime-label">{s("taxPayable")}</div>
                    </div>
                  </div>

                  {result.saving > 0 && (
                    <div className="savings-banner">
                      <span className="savings-amount">{inr(result.saving)}</span>
                      <div className="savings-label">
                        {s("youSave")} | {inr(result.saving / 12)} {s("monthly")}
                      </div>
                    </div>
                  )}

                  {/* PDF CTA */}
                  <div className="pdf-cta">
                    <div className="pdf-cta-badge">📜 TankhaPuraan Report</div>
                    <div className="pdf-cta-title">
                      {s("pdfReportTitle") || "Apni Full Tax Report PDF Mein Chahiye?"}
                    </div>
                    <p className="pdf-cta-sub">
                      8-page personalized report — delivered to your email in 10 minutes.
                    </p>
                    <ul className="pdf-features">
                      <li>{s("pdfSection1") || "Slab-by-slab breakdown"}</li>
                      <li>{s("pdfSection2") || "Old vs New verdict"}</li>
                      <li>{s("pdfSection3") || "Monthly take-home impact"}</li>
                      <li>{s("pdfSection4") || "Deduction Optimizer"}</li>
                      <li>{s("pdfSection5") || "HR declaration (copy-paste ready)"}</li>
                      <li>{s("pdfSection6") || "Next year planner"}</li>
                      <li>{s("pdfSection7") || "FY 2025-26 | AY 2026-27"}</li>
                    </ul>
                    <button className="pdf-btn" onClick={handlePDFClick}>
                      📥 {s("getReport") || "PDF Report Lein — ₹199"}
                    </button>
                    <p className="pdf-trust">
                      🔒 Secure payment via Razorpay &nbsp;•&nbsp; Email in 10 mins &nbsp;•&nbsp; Auto-refund if failed
                    </p>
                  </div>

                  <p className="disclaimer">⚠ {s("disclaimer")}</p>
                </div>
              )}
            </div>
          </div>

          {/* ALL TOOLS */}
          <section className="tools-section">
            <div className="section-header">
              <p className="section-eyebrow">Your Complete Arsenal</p>
              <h2 className="section-title">10 Tools. Every Salary Problem Solved.</h2>
            </div>

            <div className="tools-grid">
              {TOOLS.map(tool => (
                <div className="tool-card" key={tool.id}>
                  <div className="tool-card-top">
                    <div className="tool-name">{s(tool.keyName)}</div>
                    {tool.live ? (
                      <span className="tool-tag tag-free">{s("free")}</span>
                    ) : (
                      <span className="tool-tag tag-soon">{s("comingSoon")}</span>
                    )}
                  </div>
                  <p className="tool-desc">{s(tool.keyName + "desc")}</p>
                  <div className="tool-price">
                    {tool.live ? (
                      <span>{s("free")} + <span style={{color: C.sindoor}}>{s("paid")}</span></span>
                    ) : (
                      <span style={{color: C.muted}}>{tool.price}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

        </main>

        {/* FOOTER */}
        <footer className="footer">
          <div className="footer-brand">Tankha<span>Puraan</span></div>
          <p className="footer-tagline">"{s("tagline")}"</p>
          <p className="footer-sub">{s("footerBuilt") || "Built by A Proud Indian | Artha Technologies Pvt Ltd"}</p>
        </footer>

      </div>
    </>
  );
}
