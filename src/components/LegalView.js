import React from 'react';

const SECTIONS = {
  privacy: {
    title: 'Privacy Policy',
    updated: 'Last updated: July 2026',
    body: [
      ['What We Collect', 'When you use Tankha Puraan, we collect: your name and email address, the financial figures you enter into a report wizard (such as CTC, salary components, or deduction amounts), and your chosen report language. All Tankha Puraan reports are free — we do not collect any payment or card information.'],
      ['Why We Collect It', 'This information exists to generate the specific report you requested and email it to you, and to add you as a contact so we can occasionally share genuinely useful updates — new reports, relevant law changes, or other ASPOVO products. We do not use it for third-party advertising, and we do not sell your data to anyone. You can unsubscribe from any email at any time.'],
      ['How Your Data Flows', 'The financial figures you enter are sent to our AI provider (built on Anthropic\'s Claude models) to generate the narrative portions of your report, to our PDF and email delivery systems (Brevo) to produce and send the final document, and stored as a contact in Brevo for the communications described above. These are processing steps, not data-sharing for their own purposes.'],
      ['What We Retain', 'We retain your name and email (for delivering reports and future updates) after your report is delivered. We do not retain the detailed salary/financial figures you entered beyond what is needed to generate and deliver your report.'],
      ['Your Rights', 'You can request a copy of what we hold about you, or request deletion of your data, by emailing help@tankhapuraan.com. We will respond within a reasonable time.'],
      ['Children', 'Tankha Puraan is intended for salaried adults in India. We do not knowingly collect data from anyone under 18.'],
      ['Changes', 'We may update this policy as our products evolve. Material changes will be reflected here with an updated date.'],
      ['Contact', 'Questions about this policy: help@tankhapuraan.com']
    ]
  },
  terms: {
    title: 'Terms of Service',
    updated: 'Last updated: July 2026',
    body: [
      ['What Tankha Puraan Is', 'Tankha Puraan (a product of ASPOVO) provides AI-generated, informational reports for salaried individuals in India — covering topics like income tax regime comparison, salary slip verification, and labour law compliance. Reports are generated based on the figures you provide and publicly available Indian tax laws, labour codes, and EPFO/ESIC regulations.'],
      ['Not Professional Advice', 'Our reports are informational only and do not constitute tax, legal, or financial advice. For decisions with real financial or legal consequences, consult a qualified Chartered Accountant, lawyer, or financial advisor. Tankha Puraan and ASPOVO are not liable for any financial or legal loss arising from use of our reports.'],
      ['Accuracy of Inputs', 'Our calculations are only as accurate as the information you provide. You are responsible for entering correct figures.'],
      ['Our Reports Are Free', 'Every report on Tankha Puraan is currently free of charge. We only ask for your name, email, and the figures needed to generate your report — no payment or card details are required.'],
      ['Eligibility', 'Our services are intended for individuals aged 18 and above, primarily salaried employees in India.'],
      ['Acceptable Use', 'You agree not to misuse the platform — including attempting to access other users\' data, submitting deliberately false information to abuse our free reports, or using the service for any unlawful purpose.'],
      ['Intellectual Property', 'The Tankha Puraan brand, design, and report templates are the property of ASPOVO. The report generated for you is yours to use personally.'],
      ['Changes to Service', 'We may update, modify, or discontinue features of Tankha Puraan at any time. We will make reasonable efforts to notify users of material changes.'],
      ['Governing Law', 'These terms are governed by the laws of India. Any disputes will be subject to the jurisdiction of Indian courts.'],
      ['Contact', 'Questions about these terms: help@tankhapuraan.com']
    ]
  },
  refund: {
    title: 'Free Reports Policy',
    updated: 'Last updated: July 2026',
    body: [
      ['Our Reports Are Free', 'All Tankha Puraan reports are currently provided completely free of charge. There is no payment, no card, and therefore nothing to refund — this page previously covered our refund policy from when reports were paid, and now explains what to do if something goes wrong instead.'],
      ['If Your Report Doesn\'t Arrive', 'Reports are typically delivered within 10 minutes. If yours hasn\'t arrived, first check your spam/promotions folder. If it\'s genuinely missing, email help@tankhapuraan.com with the email address you used and which report you requested, and we\'ll regenerate it for you.'],
      ['Fair Use', 'Because reports are free, we apply a light limit — the same email can request the same report once every 24 hours — to keep the service sustainable for everyone. If you have a genuine need to regenerate a report sooner, email help@tankhapuraan.com.'],
      ['Incorrect Information Entered', 'If a report reflects inaccurate figures because of information you entered incorrectly, simply generate a new report with the corrected figures. If you believe there\'s a genuine error in our calculations (not your input), contact us and we will investigate.'],
      ['Contact', 'For any issue with a report: help@tankhapuraan.com']
    ]
  },
  disclaimer: {
    title: 'Disclaimer',
    updated: 'Last updated: July 2026',
    body: [
      ['Informational Purpose Only', 'All calculations, reports, and content provided by Tankha Puraan are for informational and educational purposes only. They do not constitute tax, legal, financial, or professional advice of any kind.'],
      ['Consult a Professional', 'For any decision with real financial, tax, or legal consequences — including but not limited to income tax filing, salary structuring, or labour law compliance — please consult a qualified Chartered Accountant, lawyer, or financial advisor before acting.'],
      ['Based on Public Information', 'Our reports are generated using publicly available Indian tax laws, Labour Codes, and EPFO/ESIC regulations as understood at the time of report generation. These laws and their interpretations can change, and state-level rules may vary or still be under notification.'],
      ['AI-Generated Content', 'Portions of our reports are generated using artificial intelligence. While we design our systems to keep all calculations deterministic and separate from AI-generated narrative text, AI-generated content can occasionally contain errors or imprecise phrasing. Always verify important figures independently.'],
      ['No Guarantee of Outcomes', 'We do not guarantee any specific financial outcome, tax saving, or legal result from using our reports.'],
      ['Limitation of Liability', 'Tankha Puraan and ASPOVO are not liable for any financial or legal loss, damage, or consequence arising from the use of, or reliance on, our reports or services.'],
      ['Contact', 'Questions: help@tankhapuraan.com']
    ]
  }
};

const LegalView = ({ page, goHome }) => {
  const data = SECTIONS[page] || SECTIONS.disclaimer;

  return (
    <div className="product-view">
      <div className="product-view-inner">
        <div className="product-view-header">
          <p className="product-view-adhyaya">◆ Legal ◆</p>
          <h2 className="product-view-title">{data.title}</h2>
          <p className="product-view-tagline">{data.updated}</p>
        </div>

        <div className="form-card">
          {data.body.map(([heading, text], i) => (
            <div key={i} style={{marginBottom: i < data.body.length - 1 ? '22px' : 0}}>
              <p style={{fontFamily:'var(--font-cinzel)', fontSize:'0.72rem', color:'var(--sindoor-dark)', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'8px'}}>{heading}</p>
              <p style={{fontSize:'0.95rem', lineHeight:1.75, color:'var(--ink)', margin:0}}>{text}</p>
            </div>
          ))}

          <div className="wizard-nav" style={{marginTop:'32px'}}>
            <button className="btn-prev" onClick={goHome}><i className="fas fa-arrow-left" style={{marginRight:'6px'}}></i> Wapas Home</button>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalView;
