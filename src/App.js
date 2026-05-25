import { useMemo, useState } from "react";
import "./App.css";

const LANGUAGES = [
  { code: "hi", native: "Hindi", name: "Hindi", region: "North India" },
  { code: "en", native: "English", name: "English", region: "All India" },
  { code: "ta", native: "Tamil", name: "Tamil", region: "Tamil Nadu" },
  { code: "te", native: "Telugu", name: "Telugu", region: "Andhra & Telangana" },
  { code: "bn", native: "Bengali", name: "Bengali", region: "West Bengal" },
  { code: "mr", native: "Marathi", name: "Marathi", region: "Maharashtra" },
  { code: "gu", native: "Gujarati", name: "Gujarati", region: "Gujarat" },
  { code: "kn", native: "Kannada", name: "Kannada", region: "Karnataka" },
  { code: "ml", native: "Malayalam", name: "Malayalam", region: "Kerala" },
  { code: "pa", native: "Punjabi", name: "Punjabi", region: "Punjab" },
  { code: "ur", native: "Urdu", name: "Urdu", region: "Pan-India" },
  { code: "or", native: "Odia", name: "Odia", region: "Odisha" },
];

const TAX_STEPS = [
  ["salary", "Annual CTC", "Your full yearly salary package before tax.", "1200000"],
  ["hra", "HRA Received", "House Rent Allowance from your salary slip.", "240000"],
  ["rent", "Rent Paid", "Actual yearly rent paid. Enter 0 if own home.", "300000"],
  ["d80c", "80C Investments", "PF, ELSS, LIC, PPF and similar investments.", "150000"],
  ["d80d", "80D Health Insurance", "Medical insurance premium.", "25000"],
  ["homeLoan", "Home Loan Interest", "Interest paid on home loan this year.", "0"],
];

const TOOLS = [
  { icon: "SS", name: "Salary Slip Decoder", price: "Rs 99-299", status: "Coming soon" },
  { icon: "TR", name: "Tax Regime Calculator", price: "Free + Rs 199 PDF", status: "Live prototype", screen: "tax" },
  { icon: "SA", name: "Salary Shock Analyzer", price: "Rs 149", status: "Next priority", screen: "shock" },
  { icon: "OL", name: "Offer Letter Decoder", price: "Rs 99", status: "High demand" },
  { icon: "FW", name: "Future Wealth Calculator", price: "Free", status: "Lead magnet" },
  { icon: "AU", name: "Am I Underpaid?", price: "Rs 149-299", status: "Coming soon" },
  { icon: "NS", name: "Negotiation Script", price: "Rs 199-499", status: "Coming soon" },
  { icon: "MP", name: "Money Planner", price: "Rs 199/month", status: "Coming soon" },
];

const MYTHS = [
  {
    title: "My colleague chose old regime, so I will too.",
    verdict: "GALAT HAI",
    body: "Every tax profile is different. Same CTC does not mean same rent, insurance, deductions, or home loan.",
    cost: "Possible cost: Rs 8,000-25,000/year",
  },
  {
    title: "My package is 12 LPA, so I earn 1 lakh/month.",
    verdict: "DHOKA HAI",
    body: "CTC and take-home are different. PF, gratuity, tax, benefits, and variable pay change the actual in-hand amount.",
    cost: "Possible gap: Rs 18,000-36,000/year",
  },
  {
    title: "CA will handle everything.",
    verdict: "ADHURA SACH",
    body: "A CA may file ITR later. The tax regime decision often needs clarity at the start of the financial year.",
    cost: "Fix: decide early, not after everything is locked",
  },
  {
    title: "Negotiating salary feels greedy.",
    verdict: "MEHNGI GALTI",
    body: "Most offers have room. If the employee does not ask, the buffer usually stays with the company.",
    cost: "Possible cost: Rs 50,000+/year",
  },
];

function money(value) {
  return "Rs " + Math.round(Number(value || 0)).toLocaleString("en-IN");
}

function calcTax(income, slabs) {
  let tax = 0;
  for (const slab of slabs) {
    if (income <= slab.min) break;
    tax += (Math.min(income, slab.max) - slab.min) * slab.rate;
  }
  return Math.round(tax * 1.04);
}

function computeTax(values) {
  const ctc = Number(values.salary) || 0;
  const hra = Number(values.hra) || 0;
  const rent = Number(values.rent) || 0;
  const d80c = Math.min(Number(values.d80c) || 0, 150000);
  const d80d = Math.min(Number(values.d80d) || 0, 25000);
  const homeLoan = Math.min(Number(values.homeLoan) || 0, 200000);
  const newSlabs = [
    { min: 0, max: 400000, rate: 0 },
    { min: 400000, max: 800000, rate: 0.05 },
    { min: 800000, max: 1200000, rate: 0.1 },
    { min: 1200000, max: 1600000, rate: 0.15 },
    { min: 1600000, max: 2000000, rate: 0.2 },
    { min: 2000000, max: 2400000, rate: 0.25 },
    { min: 2400000, max: Infinity, rate: 0.3 },
  ];
  const oldSlabs = [
    { min: 0, max: 250000, rate: 0 },
    { min: 250000, max: 500000, rate: 0.05 },
    { min: 500000, max: 1000000, rate: 0.2 },
    { min: 1000000, max: Infinity, rate: 0.3 },
  ];
  const newTaxable = Math.max(0, ctc - 75000);
  const newTax = newTaxable <= 1200000 ? 0 : calcTax(newTaxable, newSlabs);
  const hraExempt = Math.max(0, Math.min(hra, rent - 0.1 * ctc, 0.5 * ctc));
  const oldTaxable = Math.max(0, ctc - 50000 - hraExempt - d80c - d80d - homeLoan);
  const oldTax = oldTaxable <= 500000 ? 0 : calcTax(oldTaxable, oldSlabs);
  const winner = oldTax > newTax ? "New" : oldTax < newTax ? "Old" : "Either";
  const betterTax = Math.min(newTax, oldTax);

  return {
    ctc,
    newTax,
    oldTax,
    winner,
    saving: Math.abs(oldTax - newTax),
    inHand: Math.round((ctc - betterTax) / 12),
  };
}

function computeShock(values) {
  const ctc = Number(values.ctc) || 0;
  const oldBasic = Number(values.oldBasic) || 0;
  const newBasic = Number(values.newBasic) || 0;
  const oldPf = Math.round(oldBasic * 0.12);
  const newPf = Math.round(newBasic * 0.12);
  const monthlyDrop = Math.max(0, newPf - oldPf);
  const yearlyDrop = monthlyDrop * 12;
  const likelyWageFloor = Math.round(ctc * 0.5);
  const gratuityBaseIncrease = Math.max(0, newBasic - oldBasic);

  return {
    monthlyDrop,
    yearlyDrop,
    likelyWageFloor,
    gratuityBaseIncrease,
    message:
      newBasic > oldBasic
        ? "Your in-hand may reduce because PF is calculated on a higher basic salary, but your long-term retirement base may improve."
        : "Your basic salary has not increased in this sample, so the salary shock may be due to tax, variable pay, deductions, or another payroll component.",
  };
}

export default function App() {
  const [language, setLanguage] = useState(null);
  const [screen, setScreen] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [taxStep, setTaxStep] = useState(0);
  const [taxValues, setTaxValues] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [taxResult, setTaxResult] = useState(null);
  const [shockValues, setShockValues] = useState({ ctc: "1200000", oldBasic: "35000", newBasic: "50000" });

  const shockResult = useMemo(() => computeShock(shockValues), [shockValues]);

  function chooseLanguage(lang) {
    setLanguage(lang);
    setScreen("home");
  }

  function go(nextScreen) {
    setScreen(nextScreen);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startTax() {
    setTaxStep(0);
    setTaxValues({});
    setTaxResult(null);
    go("tax");
  }

  function saveTaxValue(value) {
    const key = TAX_STEPS[taxStep][0];
    setTaxValues((current) => ({ ...current, [key]: value }));
  }

  function nextTax(value) {
    const nextValues = { ...taxValues, [TAX_STEPS[taxStep][0]]: value };
    setTaxValues(nextValues);
    if (taxStep < TAX_STEPS.length - 1) {
      setTaxStep((step) => step + 1);
      return;
    }
    go("email");
  }

  function showTaxResult() {
    setTaxResult(computeTax(taxValues));
    go("result");
  }

  if (!language) {
    return (
      <main className="language-page">
        <section className="language-card">
          <div className="brand-block center">
            <div className="logo-mark">T</div>
            <h1>TankhaPuraan</h1>
            <p>The Holy Scripture of Your Salary</p>
          </div>
          <h2>Choose your language</h2>
          <p className="muted center">Start in the language that feels closest to your salary life.</p>
          <div className="language-grid">
            {LANGUAGES.map((lang) => (
              <button key={lang.code} className="language-option" onClick={() => chooseLanguage(lang)}>
                <strong>{lang.native}</strong>
                <span>{lang.name}</span>
                <small>{lang.region}</small>
              </button>
            ))}
          </div>
          <p className="fineprint center">22 scheduled languages planned. Prototype copy is currently English/Hinglish.</p>
        </section>
      </main>
    );
  }

  return (
    <div className="app">
      <header className="topbar">
        <button className="brand-button" onClick={() => go("home")}>
          <span className="logo-mark small">T</span>
          <span>
            <strong>TankhaPuraan</strong>
            <small>The Holy Scripture of Your Salary</small>
          </span>
        </button>
        <div className="top-actions">
          <button className="pill" onClick={() => setLanguage(null)}>{language.native}</button>
          <button className="pill" onClick={() => setMenuOpen((open) => !open)}>Menu</button>
        </div>
        {menuOpen && (
          <nav className="menu">
            <button onClick={() => go("home")}>Home</button>
            <button onClick={() => go("myths")}>Bheed Ki Galti</button>
            <button onClick={startTax}>Tax Calculator</button>
            <button onClick={() => go("shock")}>Salary Shock Analyzer</button>
            <button onClick={() => go("about")}>About</button>
          </nav>
        )}
      </header>

      <main className="wrap">
        {screen === "home" && (
          <>
            <section className="hero">
              <div className="panel hero-main">
                <div>
                  <span className="badge">Tool 2 - Completely free</span>
                  <h1>Old Regime or <span>New Regime?</span></h1>
                  <p>Every April, the same confusion. Get a clear answer in 2 minutes, rupee by rupee, without saving personal data.</p>
                </div>
                <div className="hero-actions">
                  <button className="primary" onClick={startTax}>Check my tax for free</button>
                  <button className="secondary" onClick={() => go("myths")}>See common money myths</button>
                  <small>No account. No employer name. Calculator only.</small>
                </div>
              </div>
              <div className="hero-side">
                {[
                  "Paid CA Rs 3,000. Said new regime is better. Why? No idea.",
                  "Got 20% hike. More tax deducted. In-hand stayed almost same.",
                  "Form 16 arrived. Should I claim HRA or not?",
                ].map((quote, index) => (
                  <div className="quote" key={quote}>
                    <strong>{index + 1}</strong>
                    <span>"{quote}"</span>
                  </div>
                ))}
                <div className="panel dark">
                  <h2>My understanding</h2>
                  <p>TankhaPuraan is for salaried Indians who want plain-language answers about tax, CTC, in-hand pay, Labour Code salary structure changes, PF, gratuity, offer letters, negotiation, and monthly planning.</p>
                </div>
              </div>
            </section>

            <section className="section">
              <h2>TankhaPuraan Tool Roadmap</h2>
              <div className="tool-grid">
                {TOOLS.map((tool) => (
                  <button
                    key={tool.name}
                    className="tool-card"
                    onClick={() => (tool.screen === "tax" ? startTax() : tool.screen ? go(tool.screen) : null)}
                  >
                    <span>{tool.icon}</span>
                    <strong>{tool.name}</strong>
                    <b>{tool.price}</b>
                    <small>{tool.status}</small>
                  </button>
                ))}
              </div>
            </section>

            <section className="panel section">
              <span className="badge">Verified direction</span>
              <h2>Salary Shock Analyzer</h2>
              <p>For employees asking: "Meri salary kyon kam hui?", "PF zyada kyon kat raha hai?", "Gratuity badhi to fayda hua ya nuksaan?" The tool explains possible salary-structure impact without accusing any employer.</p>
              <div className="mini-grid">
                <div>
                  <strong>Input</strong>
                  <p>CTC, old basic, new basic, PF, gratuity, allowances, monthly in-hand.</p>
                </div>
                <div>
                  <strong>Output</strong>
                  <p>Why in-hand may change, whether long-term PF/gratuity improves, and what neutral questions to ask HR.</p>
                </div>
              </div>
              <p className="legal">Safe wording: If allowances or exclusions exceed 50% of remuneration, the excess may be treated as wages for statutory calculations. Avoid saying every employee's basic must directly become 50% of CTC.</p>
            </section>
          </>
        )}

        {screen === "myths" && (
          <section>
            <div className="panel intro">
              <span className="badge">Bheed Ki Galti</span>
              <h1>Salary myths that quietly cost money</h1>
              <p>These cards create the viral learning layer before the calculator. Each myth can become a WhatsApp-shareable insight.</p>
            </div>
            <div className="myth-grid">
              {MYTHS.map((myth) => (
                <article className="myth-card" key={myth.title}>
                  <div>
                    <strong>{myth.title}</strong>
                    <span>{myth.verdict}</span>
                  </div>
                  <p>{myth.body}</p>
                  <b>{myth.cost}</b>
                </article>
              ))}
            </div>
          </section>
        )}

        {screen === "tax" && (
          <TaxCalculator
            step={taxStep}
            setStep={setTaxStep}
            values={taxValues}
            saveValue={saveTaxValue}
            next={nextTax}
            back={() => (taxStep === 0 ? go("home") : setTaxStep((step) => step - 1))}
          />
        )}

        {screen === "email" && (
          <section className="panel narrow">
            <span className="badge">Almost done</span>
            <h1>Where should we show your result?</h1>
            <p>Prototype screen for email capture. In the real app this can trigger email delivery and report generation.</p>
            <label>Your name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Amiya" /></label>
            <label>Email address<input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label>
            <button className="primary full" onClick={showTaxResult}>Show my result</button>
            <small>No spam. Just your result.</small>
          </section>
        )}

        {screen === "result" && taxResult && (
          <section className="result-grid">
            <div className="panel dark result-hero">
              <span className="badge green">TankhaPuraan says</span>
              <h1>{taxResult.winner} Regime is better for you</h1>
              <p>You will save approximately</p>
              <strong>{money(taxResult.saving)}</strong>
              <p>{taxResult.winner === "Either" ? "Both regimes are very close." : `Choose ${taxResult.winner} Regime with HR for this financial year.`}</p>
            </div>
            <div className="panel">
              <h2>Your tax comparison</h2>
              <Metric label="Annual CTC" value={money(taxResult.ctc)} percent={100} />
              <Metric label="New tax" value={money(taxResult.newTax)} percent={taxResult.newTax / Math.max(taxResult.oldTax, taxResult.newTax, 1) * 100} />
              <Metric label="Old tax" value={money(taxResult.oldTax)} percent={taxResult.oldTax / Math.max(taxResult.oldTax, taxResult.newTax, 1) * 100} />
              <Metric label="In-hand/month" value={money(taxResult.inHand)} percent={78} green />
              <div className="upsell">
                <h3>Want a detailed PDF report?</h3>
                <p>Includes assumptions, deduction breakdown, HRA logic, and a simple HR-ready recommendation.</p>
                <button className="primary full" onClick={() => go("payment")}>Get PDF report for Rs 199</button>
              </div>
              <button className="secondary full" onClick={startTax}>Calculate again</button>
            </div>
          </section>
        )}

        {screen === "payment" && (
          <section className="panel narrow">
            <span className="badge">Secure payment preview</span>
            <h1>Detailed PDF Report</h1>
            <p>A Razorpay-style checkout moment for UPI, card, or net banking. This prototype simulates success.</p>
            <div className="bill-row"><strong>TankhaPuraan PDF Report</strong><strong>Rs 199</strong></div>
            <button className="primary full" onClick={() => go("success")}>Pay Rs 199 and continue</button>
            <button className="secondary full" onClick={() => go("result")}>Not now</button>
          </section>
        )}

        {screen === "success" && (
          <section className="panel narrow center">
            <div className="success-mark">OK</div>
            <h1>Payment successful</h1>
            <p>Your report is being prepared and will be sent to {email || "your email"}.</p>
            <button className="primary">Download PDF report</button>
          </section>
        )}

        {screen === "shock" && (
          <section className="result-grid">
            <div className="panel">
              <span className="badge">Tool 6 - Next priority</span>
              <h1>Salary Shock Analyzer</h1>
              <p>Use this when an employee's salary structure changes and they want to understand PF, gratuity, and in-hand impact.</p>
              <label>Annual CTC<input value={shockValues.ctc} onChange={(event) => setShockValues({ ...shockValues, ctc: event.target.value })} /></label>
              <label>Old monthly basic<input value={shockValues.oldBasic} onChange={(event) => setShockValues({ ...shockValues, oldBasic: event.target.value })} /></label>
              <label>New monthly basic<input value={shockValues.newBasic} onChange={(event) => setShockValues({ ...shockValues, newBasic: event.target.value })} /></label>
            </div>
            <div className="panel dark">
              <span className="badge green">Possible explanation</span>
              <h2>{money(shockResult.monthlyDrop)} less in-hand/month from PF change</h2>
              <p>{shockResult.message}</p>
              <div className="mini-grid">
                <div><strong>{money(shockResult.yearlyDrop)}</strong><p>Approx yearly in-hand shift</p></div>
                <div><strong>{money(shockResult.gratuityBaseIncrease)}</strong><p>Monthly gratuity base increase</p></div>
              </div>
              <p className="legal dark-legal">This is an educational estimate, not legal/payroll advice. Do not enter employer name. Confirm final treatment with HR, payroll, CA, or qualified advisor.</p>
            </div>
          </section>
        )}

        {screen === "about" && (
          <section className="panel intro">
            <span className="badge">About</span>
            <h1>Built for salaried India</h1>
            <p>TankhaPuraan belongs under Artha Technologies Pvt Ltd. The promise is simple: explain salary, tax, and money decisions in a language normal employees understand.</p>
            <p className="legal">Calculations are informational only. For final decisions consult a CA or qualified advisor. TankhaPuraan is not liable for any financial loss. The app must not store sensitive personal data or name specific employers negatively.</p>
          </section>
        )}
      </main>
    </div>
  );
}

function TaxCalculator({ step, setStep, values, next, back }) {
  const current = TAX_STEPS[step];
  const [draft, setDraft] = useState(values[current[0]] || "");

  function continueStep() {
    next(draft);
    setDraft("");
  }

  function goBack() {
    back();
    setDraft(values[TAX_STEPS[Math.max(step - 1, 0)][0]] || "");
  }

  return (
    <section className="flow">
      <aside className="steps">
        {TAX_STEPS.map((item, index) => (
          <button key={item[0]} className={index === step ? "active" : ""} onClick={() => setStep(index)}>
            <strong>{index + 1}</strong>
            <span>{item[1]}</span>
          </button>
        ))}
      </aside>
      <div className="panel form-panel">
        <div>
          <span className="badge">Step {step + 1} of {TAX_STEPS.length}</span>
          <h1>{current[1]}</h1>
          <p>{current[2]}</p>
          <label>
            Amount
            <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={current[3]} inputMode="numeric" />
          </label>
        </div>
        <div className="form-actions">
          <button className="secondary" onClick={goBack}>Back</button>
          <button className="primary" onClick={continueStep}>Continue</button>
          <button className="ghost" onClick={() => { setDraft("0"); next("0"); }}>Skip / enter zero</button>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value, percent, green }) {
  return (
    <div className="metric">
      <strong>{label}</strong>
      <div><span className={green ? "green" : ""} style={{ width: `${Math.max(4, Math.min(percent, 100))}%` }} /></div>
      <b>{value}</b>
    </div>
  );
}
