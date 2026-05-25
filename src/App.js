import { useMemo, useState } from "react";
import "./App.css";
import { TRANSLATIONS } from "./translations";

const LANGUAGES = [
  { code: "hi", native: "हिन्दी", name: "Hindi", region: "North India" },
  { code: "en", native: "English", name: "English", region: "All India" },
  { code: "ta", native: "தமிழ்", name: "Tamil", region: "Tamil Nadu" },
  { code: "te", native: "తెలుగు", name: "Telugu", region: "Andhra & Telangana" },
  { code: "bn", native: "বাংলা", name: "Bengali", region: "West Bengal" },
  { code: "mr", native: "मराठी", name: "Marathi", region: "Maharashtra" },
  { code: "gu", native: "ગુજરાતી", name: "Gujarati", region: "Gujarat" },
  { code: "kn", native: "ಕನ್ನಡ", name: "Kannada", region: "Karnataka" },
  { code: "ml", native: "മലയാളം", name: "Malayalam", region: "Kerala" },
  { code: "pa", native: "ਪੰਜਾਬੀ", name: "Punjabi", region: "Punjab" },
  { code: "or", native: "ଓଡ଼ିଆ", name: "Odia", region: "Odisha" },
  { code: "as", native: "অসমীয়া", name: "Assamese", region: "Assam" },
  { code: "ur", native: "اردو", name: "Urdu", region: "Pan-India" },
  { code: "ne", native: "नेपाली", name: "Nepali", region: "Sikkim & NE" },
  { code: "kok", native: "कोंकणी", name: "Konkani", region: "Goa" },
  { code: "mai", native: "मैथिली", name: "Maithili", region: "Bihar" },
  { code: "mni", native: "ꯃꯤꯇꯩꯂꯣꯟ", name: "Manipuri", region: "Manipur" },
  { code: "bo", native: "बड़ो", name: "Bodo", region: "Assam & NE" },
  { code: "sat", native: "ᱥᱟᱱᱛᱟᱲᱤ", name: "Santhali", region: "Jharkhand" },
  { code: "doi", native: "डोगरी", name: "Dogri", region: "Jammu" },
  { code: "ks", native: "کٲشُر", name: "Kashmiri", region: "J&K" },
  { code: "sd", native: "سنڌي", name: "Sindhi", region: "Sindh/Rajasthan" },
];

function taxSteps(t) {
  const keys = ["salary", "hra", "rent", "d80c", "d80d", "homeLoan"];
  const placeholders = ["1200000", "240000", "300000", "150000", "25000", "0"];
  return keys.map((key, index) => [key, t.labels[index], t.hints[index], placeholders[index]]);
}

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

const APP_COPY = {
  en: {
    chooseTitle: "Choose your language",
    chooseSub: "Start in the language that feels closest to your salary life.",
    fineprint: "22 scheduled languages. Numbers stay in English digits.",
    menu: ["Home", "Bheed Ki Galti", "Tax Calculator", "Salary Shock Analyzer", "About"],
    menuButton: "Menu",
    understandingTitle: "My understanding",
    seeMyths: "See common money myths",
    noAccount: "No account. No employer name. Calculator only.",
    understanding: "TankhaPuraan is for salaried Indians who want plain-language answers about tax, CTC, in-hand pay, Labour Code salary structure changes, PF, gratuity, offer letters, negotiation, and monthly planning.",
    roadmapTitle: "TankhaPuraan Tool Roadmap",
    verified: "Verified direction",
    shockIntro: "For employees asking: “Why did my salary reduce?”, “Why is PF higher?”, “Did gratuity increase help me or hurt me?” The tool explains possible salary-structure impact without accusing any employer.",
    inputTitle: "Input",
    inputBody: "CTC, old basic, new basic, PF, gratuity, allowances, monthly in-hand.",
    outputTitle: "Output",
    outputBody: "Why in-hand may change, whether long-term PF/gratuity improves, and what neutral questions to ask HR.",
    safeWording: "Safe wording: If allowances or exclusions exceed 50% of remuneration, the excess may be treated as wages for statutory calculations. Avoid saying every employee's basic must directly become 50% of CTC.",
    mythsTitle: "Salary myths that quietly cost money",
    mythsSub: "These cards create the viral learning layer before the calculator. Each myth can become a WhatsApp-shareable insight.",
    myths: [
      ["My colleague chose old regime, so I will too.", "GALAT HAI", "Every tax profile is different. Same CTC does not mean same rent, insurance, deductions, or home loan.", "Possible cost: Rs 8,000-25,000/year"],
      ["My package is 12 LPA, so I earn 1 lakh/month.", "DHOKA HAI", "CTC and take-home are different. PF, gratuity, tax, benefits, and variable pay change the actual in-hand amount.", "Possible gap: Rs 18,000-36,000/year"],
      ["CA will handle everything.", "ADHURA SACH", "A CA may file ITR later. The tax regime decision often needs clarity at the start of the financial year.", "Fix: decide early, not after everything is locked"],
      ["Negotiating salary feels greedy.", "MEHNGI GALTI", "Most offers have room. If the employee does not ask, the buffer usually stays with the company.", "Possible cost: Rs 50,000+/year"],
    ],
    toolStatus: ["Coming soon", "Live prototype", "Next priority", "High demand", "Lead magnet"],
    toolNames: ["Salary Slip Decoder", "Tax Regime Calculator", "Salary Shock Analyzer", "Offer Letter Decoder", "Future Wealth Calculator", "Am I Underpaid?", "Negotiation Script", "Money Planner"],
    emailSub: "Prototype screen for email capture. In the real app this can trigger email delivery and report generation.",
    showResult: "Show my result",
    noSpam: "No spam. Just your result.",
    resultCompare: "Your tax comparison",
    resultBetter: "Regime is better for you",
    savingApprox: "You will save approximately",
    chooseWithHr: "Choose this regime with HR for this financial year.",
    eitherClose: "Both regimes are very close.",
    pdfTitle: "Want a detailed PDF report?",
    pdfBody: "Includes assumptions, deduction breakdown, HRA logic, and a simple HR-ready recommendation.",
    pdfButton: "Get PDF report for Rs 199",
    recalc: "Calculate again",
    paymentBadge: "Secure payment preview",
    paymentTitle: "Detailed PDF Report",
    paymentBody: "A Razorpay-style checkout moment for UPI, card, or net banking. This prototype simulates success.",
    payButton: "Pay Rs 199 and continue",
    notNow: "Not now",
    successTitle: "Payment successful",
    successBody: "Your report is being prepared and will be sent to",
    download: "Download PDF report",
    shockUse: "Use this when an employee's salary structure changes and they want to understand PF, gratuity, and in-hand impact.",
    shockResultBadge: "Possible explanation",
    lessInHand: "less in-hand/month from PF change",
    yearlyShift: "Approx yearly in-hand shift",
    gratuityIncrease: "Monthly gratuity base increase",
    shockUp: "Your in-hand may reduce because PF is calculated on a higher basic salary, but your long-term retirement base may improve.",
    shockFlat: "Your basic salary has not increased in this sample, so the salary shock may be due to tax, variable pay, deductions, or another payroll component.",
    shockLegal: "This is an educational estimate, not legal/payroll advice. Do not enter employer name. Confirm final treatment with HR, payroll, CA, or qualified advisor.",
    aboutTitle: "Built for salaried India",
    aboutBody: "TankhaPuraan belongs under Artha Technologies Pvt Ltd. The promise is simple: explain salary, tax, and money decisions in a language normal employees understand.",
    disclaimer: "Calculations are informational only. For final decisions consult a CA or qualified advisor. TankhaPuraan is not liable for any financial loss. The app must not store sensitive personal data or name specific employers negatively.",
    amount: "Amount",
    back: "Back",
    continue: "Continue",
    skipZero: "Skip / enter zero",
    step: "Step",
    of: "of",
  },
  hi: {
    chooseTitle: "अपनी भाषा चुनें",
    chooseSub: "जिस भाषा में salary की बात साफ़ समझ आए, वही चुनें।",
    fineprint: "22 अनुसूचित भाषाएं। संख्या English digits में रहेगी।",
    menu: ["Home", "भीड़ की गलती", "Tax Calculator", "Salary Shock Analyzer", "About"],
    menuButton: "मेनू",
    understandingTitle: "मेरी समझ",
    seeMyths: "पैसे की आम गलतफहमियां देखें",
    noAccount: "Account नहीं। कंपनी का नाम नहीं। सिर्फ Calculator।",
    understanding: "TankhaPuraan salaried Indians के लिए है, जो Tax, CTC, in-hand pay, Labour Code salary structure, PF, gratuity, offer letter, negotiation और monthly planning को सीधी भाषा में समझना चाहते हैं।",
    roadmapTitle: "TankhaPuraan टूल रोडमैप",
    verified: "जांचा हुआ दिशा",
    shockIntro: "उन कर्मचारियों के लिए जो पूछते हैं: “मेरी salary क्यों कम हुई?”, “PF ज़्यादा क्यों कट रहा है?”, “Gratuity बढ़ी तो फायदा हुआ या नुकसान?” यह tool employer पर आरोप लगाए बिना salary-structure impact समझाता है।",
    inputTitle: "Input",
    inputBody: "CTC, पुराना basic, नया basic, PF, gratuity, allowances, monthly in-hand.",
    outputTitle: "Output",
    outputBody: "In-hand क्यों बदल सकता है, PF/gratuity से long-term फायदा है या नहीं, और HR से कौन से neutral सवाल पूछने हैं।",
    safeWording: "Safe wording: अगर allowances/exclusions remuneration के 50% से ज़्यादा हैं, तो extra हिस्सा statutory calculation में wages माना जा सकता है। यह न कहें कि हर employee का basic सीधे CTC का 50% होना ही चाहिए।",
    mythsTitle: "Salary की गलतफहमियां जो चुपचाप पैसा खा जाती हैं",
    mythsSub: "Calculator से पहले यह learning layer users को अपनी salary सोचने का नया तरीका देती है।",
    myths: [
      ["Colleague ने Old Regime चुना, तो मैं भी वही चुनूंगा।", "गलत है", "हर इंसान का tax profile अलग होता है। Same CTC का मतलब same rent, insurance या deductions नहीं।", "संभावित नुकसान: Rs 8,000-25,000/year"],
      ["12 LPA package है, मतलब Rs 1 lakh/month कमाता हूं।", "धोखा है", "CTC और take-home अलग हैं। PF, gratuity, tax, benefits और variable pay actual in-hand बदलते हैं।", "संभावित gap: Rs 18,000-36,000/year"],
      ["CA सब संभाल लेगा।", "अधूरा सच", "CA बाद में ITR file कर सकता है। Regime decision साल की शुरुआत में साफ़ होना चाहिए।", "Fix: फैसला जल्दी करें"],
      ["Salary negotiate करना greedy लगता है।", "महंगी गलती", "अधिकतर offers में room होता है। Employee नहीं पूछता तो buffer company के पास रह जाता है।", "संभावित नुकसान: Rs 50,000+/year"],
    ],
  },
};
Object.assign(APP_COPY, {
  ta: {
    chooseTitle: "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்",
    chooseSub: "சம்பள விஷயம் தெளிவாக புரியும் மொழியைத் தேர்ந்தெடுக்கவும்.",
    fineprint: "22 அரசியலமைப்பு அட்டவணை மொழிகள். எண்கள் English digits-ல் இருக்கும்.",
    menu: ["முகப்பு", "கூட்டத்தின் தவறு", "Tax Calculator", "Salary Shock Analyzer", "பற்றி"],
    menuButton: "மெனு",
    understandingTitle: "என் புரிதல்",
    seeMyths: "பணத்தைப் பற்றிய பொதுவான தவறான நம்பிக்கைகள்",
    noAccount: "Account இல்லை. நிறுவனப் பெயர் இல்லை. Calculator மட்டும்.",
    understanding: "TankhaPuraan சம்பளமுள்ள இந்தியர்களுக்காக உருவாக்கப்பட்டது. Tax, CTC, in-hand pay, Labour Code சம்பள அமைப்பு மாற்றம், PF, gratuity, offer letter, negotiation, monthly planning ஆகியவற்றை எளிய தமிழில் விளக்குகிறது.",
    roadmapTitle: "TankhaPuraan கருவி திட்டம்",
    verified: "சரிபார்க்கப்பட்ட திசை",
    shockIntro: "“என் salary ஏன் குறைந்தது?”, “PF ஏன் அதிகமாக கழிக்கிறது?”, “gratuity அதிகரித்தது நல்லதா?” என்று கேட்பவர்களுக்கு. எந்த employer-ஐ குற்றம் சொல்லாமல் salary-structure impact-ஐ விளக்குகிறது.",
    inputTitle: "உள்ளீடு", inputBody: "CTC, பழைய basic, புதிய basic, PF, gratuity, allowances, monthly in-hand.",
    outputTitle: "வெளியீடு", outputBody: "In-hand ஏன் மாறலாம், PF/gratuity நீண்டகாலத்தில் உதவுமா, HR-ிடம் கேட்க வேண்டிய நடுநிலை கேள்விகள்.",
    safeWording: "பாதுகாப்பான சொல்: allowances/exclusions remuneration-ன் 50% ஐ மீறினால், அதிக பகுதி statutory calculation-ல் wages ஆக கருதப்படலாம். ஒவ்வொரு employee-யின் basic நேரடியாக CTC-ன் 50% ஆகவே இருக்க வேண்டும் என்று சொல்ல வேண்டாம்.",
    mythsTitle: "அமைதியாக பணத்தை இழக்க வைக்கும் salary தவறான நம்பிக்கைகள்",
    mythsSub: "Calculator-க்கு முன் பயனர் சம்பளத்தைப் புதிய கோணத்தில் பார்க்கும் learning layer.",
    myths: [["Colleague Old Regime எடுத்தார், நானும் அதையே எடுப்பேன்.", "தவறு", "ஒவ்வொருவரின் tax profile வேறு. Same CTC என்றால் same rent அல்லது deductions என்று அர்த்தமில்லை.", "சாத்தியமான இழப்பு: Rs 8,000-25,000/year"], ["12 LPA package என்றால் Rs 1 lakh/month சம்பளம்.", "மாயை", "CTC மற்றும் take-home வேறு. PF, gratuity, tax, benefits, variable pay in-hand-ஐ மாற்றும்.", "சாத்திய gap: Rs 18,000-36,000/year"], ["CA எல்லாம் பார்த்துக்கொள்வார்.", "பாதி உண்மை", "CA பிறகு ITR file செய்யலாம்; regime decision ஆரம்பத்திலேயே தெளிவாக வேண்டும்.", "Fix: முன்கூட்டியே முடிவு செய்யுங்கள்"], ["Salary negotiate செய்வது greedy போல.", "செலவான தவறு", "பல offers-ல் இடம் இருக்கும். Employee கேட்கவில்லை என்றால் buffer company-யிடம் இருக்கும்.", "சாத்திய இழப்பு: Rs 50,000+/year"]],
    toolStatus: ["வருகிறது", "Live prototype", "அடுத்த முன்னுரிமை", "அதிக தேவை", "Lead magnet"],
    toolNames: ["Salary Slip Decoder", "Tax Regime Calculator", "Salary Shock Analyzer", "Offer Letter Decoder", "Future Wealth Calculator", "நான் underpaid-ஆ?", "Negotiation Script", "Money Planner"],
    emailSub: "இது email capture prototype. உண்மையான app-ல் இது email delivery மற்றும் report generation-ஐ தொடங்கும்.",
    resultBetter: "Regime உங்களுக்கு சிறந்தது", savingApprox: "நீங்கள் சுமார் சேமிப்பது", chooseWithHr: "இந்த financial year-க்கு HR-ிடம் இந்த regime-ஐத் தேர்ந்தெடுக்கவும்.", eitherClose: "இரண்டு regimes-மும் மிகவும் அருகில் உள்ளன.",
    pdfTitle: "விரிவான PDF report வேண்டுமா?", pdfBody: "Assumptions, deduction breakdown, HRA logic, HR-க்கு சொல்லும் recommendation சேரும்.", pdfButton: "PDF report Rs 199-க்கு பெறுங்கள்",
    paymentBadge: "பாதுகாப்பான payment preview", paymentTitle: "விரிவான PDF Report", paymentBody: "UPI, card, net banking க்கான Razorpay-style checkout preview.", payButton: "Rs 199 செலுத்தி தொடரவும்", notNow: "இப்போது வேண்டாம்",
    successTitle: "Payment வெற்றிகரமாக முடிந்தது", successBody: "உங்கள் report தயார் செய்யப்படுகிறது; அனுப்பப்படும்:", download: "PDF report download",
    shockUse: "Salary structure மாறும்போது PF, gratuity, in-hand impact புரிந்துகொள்ள இந்த tool.", shockResultBadge: "சாத்திய விளக்கம்", lessInHand: "PF மாற்றத்தால் மாத in-hand குறைவு", yearlyShift: "சுமார் yearly in-hand shift", gratuityIncrease: "Monthly gratuity base increase", shockUp: "Basic salary உயர்ந்ததால் PF அதிகமாகும்; in-hand குறையலாம், ஆனால் long-term retirement base மேம்படலாம்.", shockFlat: "இந்த sample-ல் basic உயரவில்லை; shock tax, variable pay, deductions அல்லது வேறு payroll component காரணமாக இருக்கலாம்.", shockLegal: "இது கல்வி நோக்க estimate; legal/payroll advice அல்ல. Employer பெயர் இட வேண்டாம். HR/payroll/CA/qualified advisor-ிடம் final treatment உறுதி செய்யவும்.",
    aboutTitle: "சம்பளமுள்ள இந்தியாவுக்காக", aboutBody: "TankhaPuraan, Artha Technologies Pvt Ltd-இன் தயாரிப்பு. சாதாரண employees புரியும் மொழியில் salary, tax, money decisions விளக்குவது இதன் வாக்குறுதி.", disclaimer: "Calculations informational only. Final decisions-க்கு CA அல்லது qualified advisor-ஐ அணுகவும். TankhaPuraan எந்த financial loss-க்கும் liable இல்லை. Personal data store செய்யவும், specific employer பெயரை negative-ஆக காட்டவும் கூடாது.",
    amount: "தொகை", back: "பின்", continue: "தொடரவும்", skipZero: "Skip / 0 உள்ளிடவும்", step: "படி", of: "இல்",
    oldBasic: "பழைய monthly basic", newBasic: "புதிய monthly basic",
  },
  te: {
    chooseTitle: "మీ భాషను ఎంచుకోండి", chooseSub: "జీతం విషయం స్పష్టంగా అర్థమయ్యే భాషను ఎంచుకోండి.", fineprint: "22 షెడ్యూల్డ్ భాషలు. సంఖ్యలు English digits‌లో ఉంటాయి.",
    menu: ["హోమ్", "గుంపు తప్పు", "Tax Calculator", "Salary Shock Analyzer", "గురించి"], seeMyths: "డబ్బు గురించి సాధారణ అపోహలు చూడండి", noAccount: "Account లేదు. కంపెనీ పేరు లేదు. Calculator మాత్రమే.",
    menuButton: "మెనూ",
    understandingTitle: "నా అర్థం",
    understanding: "TankhaPuraan జీతభత్యాల ఉద్యోగుల కోసం. Tax, CTC, in-hand pay, Labour Code salary structure changes, PF, gratuity, offer letter, negotiation, monthly planning విషయాలను సులభమైన తెలుగులో వివరిస్తుంది.",
    roadmapTitle: "TankhaPuraan సాధనాల ప్రణాళిక", verified: "ధృవీకరించిన దిశ", shockIntro: "“నా salary ఎందుకు తగ్గింది?”, “PF ఎందుకు ఎక్కువ కట్ అవుతోంది?”, “gratuity పెరగడం లాభమా?” అని అడిగేవారికి. Employer పై ఆరోపణ లేకుండా salary-structure impact వివరిస్తుంది.",
    inputTitle: "ఇన్‌పుట్", inputBody: "CTC, పాత basic, కొత్త basic, PF, gratuity, allowances, monthly in-hand.", outputTitle: "ఫలితం", outputBody: "In-hand ఎందుకు మారవచ్చు, PF/gratuity long-term benefit ఉందా, HR‌ని ఏమి neutral questions అడగాలి.",
    safeWording: "సురక్షిత wording: allowances/exclusions remuneration లో 50% కంటే ఎక్కువైతే, అదనపు భాగం statutory calculation లో wages గా పరిగణించబడవచ్చు. ప్రతి employee basic తప్పనిసరిగా CTC లో 50% అవ్వాలి అని చెప్పవద్దు.",
    mythsTitle: "నిశ్శబ్దంగా డబ్బు ఖర్చు చేసే salary అపోహలు", mythsSub: "Calculator ముందు salary గురించి కొత్తగా ఆలోచించే learning layer.",
    myths: [["Colleague Old Regime ఎంచుకున్నాడు, నేనూ అదే.", "తప్పు", "ప్రతి tax profile వేరు. Same CTC అంటే same rent/deductions కాదు.", "సంభావ్య నష్టం: Rs 8,000-25,000/year"], ["12 LPA package అంటే Rs 1 lakh/month.", "మోసం", "CTC మరియు take-home వేరు. PF, gratuity, tax, benefits, variable pay in-hand మార్చుతాయి.", "సంభావ్య gap: Rs 18,000-36,000/year"], ["CA అన్నీ చూసుకుంటాడు.", "అర్ధసత్యం", "CA తర్వాత ITR file చేయవచ్చు; regime decision ప్రారంభంలోనే స్పష్టంగా ఉండాలి.", "Fix: ముందుగానే నిర్ణయం"], ["Salary negotiate చేయడం greedy.", "ఖరీదైన తప్పు", "చాలా offers లో room ఉంటుంది. Employee అడగకపోతే buffer company దగ్గరే ఉంటుంది.", "సంభావ్య నష్టం: Rs 50,000+/year"]],
    toolStatus: ["త్వరలో", "Live prototype", "తదుపరి ప్రాధాన్యం", "అధిక డిమాండ్", "Lead magnet"], toolNames: ["Salary Slip Decoder", "Tax Regime Calculator", "Salary Shock Analyzer", "Offer Letter Decoder", "Future Wealth Calculator", "నేను underpaid నా?", "Negotiation Script", "Money Planner"],
    emailSub: "ఇది email capture prototype. నిజమైన app లో email delivery/report generation మొదలవుతుంది.", resultBetter: "Regime మీకు మంచిది", savingApprox: "మీరు సుమారు ఆదా చేస్తారు", chooseWithHr: "ఈ financial year కోసం HR వద్ద ఈ regime ఎంచుకోండి.", eitherClose: "రెండు regimes చాలా దగ్గరగా ఉన్నాయి.", pdfTitle: "వివరమైన PDF report కావాలా?", pdfBody: "Assumptions, deduction breakdown, HRA logic, HR-ready recommendation ఉంటాయి.", paymentBadge: "సురక్షిత payment preview", paymentTitle: "వివరమైన PDF Report", paymentBody: "UPI, card, net banking కోసం Razorpay-style checkout preview.", payButton: "Rs 199 చెల్లించి కొనసాగండి", notNow: "ఇప్పుడు కాదు", successTitle: "Payment విజయవంతం", successBody: "మీ report సిద్ధమవుతోంది; పంపబడుతుంది:", download: "PDF report download",
    shockUse: "Salary structure మారినప్పుడు PF, gratuity, in-hand impact అర్థం చేసుకోవడానికి ఈ tool.", shockResultBadge: "సంభావ్య వివరణ", lessInHand: "PF మార్పు వల్ల నెలవారీ in-hand తగ్గుదల", yearlyShift: "సుమారు yearly in-hand shift", gratuityIncrease: "Monthly gratuity base increase", shockUp: "Basic salary పెరిగితే PF ఎక్కువవుతుంది; in-hand తగ్గవచ్చు, కానీ long-term retirement base మెరుగుపడవచ్చు.", shockFlat: "ఈ sample లో basic పెరగలేదు; shock tax, variable pay, deductions లేదా payroll component వల్ల కావచ్చు.", shockLegal: "ఇది educational estimate మాత్రమే; legal/payroll advice కాదు. Employer పేరు ఇవ్వవద్దు. Final treatment HR/payroll/CA/advisor తో confirm చేయండి.",
    aboutTitle: "జీతభత్యాల భారతదేశం కోసం", aboutBody: "TankhaPuraan, Artha Technologies Pvt Ltd ఉత్పత్తి. సాధారణ employees అర్థం చేసుకునే భాషలో salary, tax, money decisions వివరించడం లక్ష్యం.", disclaimer: "Calculations informational only. Final decisions కోసం CA లేదా qualified advisor ని సంప్రదించండి. TankhaPuraan financial loss కు liable కాదు. Personal data store చేయకూడదు, specific employer పేరును negative గా చూపకూడదు.", amount: "మొత్తం", back: "వెనుకకు", continue: "కొనసాగండి", skipZero: "Skip / 0 నమోదు", step: "దశ", of: "లో", oldBasic: "పాత monthly basic", newBasic: "కొత్త monthly basic",
  },
});

function makeRegionalCopy(p) {
  return {
    ...APP_COPY.en,
    chooseTitle: p.chooseTitle,
    chooseSub: p.chooseSub,
    fineprint: p.fineprint,
    menu: p.menu,
    menuButton: p.menuButton || APP_COPY.en.menuButton,
    understandingTitle: p.understandingTitle || p.roadmapTitle,
    seeMyths: p.seeMyths,
    noAccount: p.noAccount,
    understanding: p.understanding,
    roadmapTitle: p.roadmapTitle,
    verified: p.verified,
    shockIntro: p.shockIntro,
    inputTitle: p.inputTitle,
    inputBody: p.inputBody,
    outputTitle: p.outputTitle,
    outputBody: p.outputBody,
    safeWording: p.safeWording,
    mythsTitle: p.mythsTitle,
    mythsSub: p.mythsSub,
    myths: [
      [p.m1, p.wrong, p.m1Body, p.loss],
      [p.m2, p.trap, p.m2Body, p.gap],
      [p.m3, p.half, p.m3Body, p.fix],
      [p.m4, p.costly, p.m4Body, p.bigLoss],
    ],
    toolStatus: p.toolStatus,
    toolNames: p.toolNames,
    emailSub: p.emailSub,
    resultBetter: p.resultBetter,
    savingApprox: p.savingApprox,
    chooseWithHr: p.chooseWithHr,
    eitherClose: p.eitherClose,
    pdfTitle: p.pdfTitle,
    pdfBody: p.pdfBody,
    paymentBadge: p.paymentBadge,
    paymentTitle: p.paymentTitle,
    paymentBody: p.paymentBody,
    payButton: p.payButton,
    notNow: p.notNow,
    successTitle: p.successTitle,
    successBody: p.successBody,
    download: p.download,
    shockUse: p.shockUse,
    shockResultBadge: p.shockResultBadge,
    lessInHand: p.lessInHand,
    yearlyShift: p.yearlyShift,
    gratuityIncrease: p.gratuityIncrease,
    shockUp: p.shockUp,
    shockFlat: p.shockFlat,
    shockLegal: p.shockLegal,
    aboutTitle: p.aboutTitle,
    aboutBody: p.aboutBody,
    disclaimer: p.disclaimer,
    amount: p.amount,
    back: p.back,
    continue: p.continue,
    skipZero: p.skipZero,
    step: p.step,
    of: p.of,
    oldBasic: p.oldBasic,
    newBasic: p.newBasic,
  };
}

const COMMON_PRICE = {
  loss: "Rs 8,000-25,000/year",
  gap: "Rs 18,000-36,000/year",
  bigLoss: "Rs 50,000+/year",
};

Object.assign(APP_COPY, {
  bn: makeRegionalCopy({
    chooseTitle: "আপনার ভাষা বেছে নিন", chooseSub: "যে ভাষায় বেতন পরিষ্কার বোঝা যায়, সেটাই বেছে নিন।", fineprint: "২২টি তফসিলভুক্ত ভাষা। সংখ্যাগুলি English digits-এ থাকবে।",
    menu: ["হোম", "ভিড়ের ভুল", "Tax Calculator", "Salary Shock Analyzer", "সম্পর্কে"], seeMyths: "টাকার সাধারণ ভুল ধারণা দেখুন", noAccount: "Account নেই। কোম্পানির নাম নেই। শুধু Calculator।",
    understanding: "TankhaPuraan বেতনভোগী ভারতীয়দের জন্য। Tax, CTC, in-hand pay, Labour Code salary structure, PF, gratuity, offer letter, negotiation এবং monthly planning সহজ বাংলায় বোঝায়।",
    roadmapTitle: "TankhaPuraan টুল রোডম্যাপ", verified: "যাচাই করা দিক", shockIntro: "“আমার salary কেন কমল?”, “PF বেশি কাটছে কেন?”, “gratuity বাড়লে লাভ না ক্ষতি?” — এমন প্রশ্নের উত্তর employer-কে দোষ না দিয়ে salary-structure impact দিয়ে বোঝায়।",
    inputTitle: "ইনপুট", inputBody: "CTC, পুরনো basic, নতুন basic, PF, gratuity, allowances, monthly in-hand.", outputTitle: "আউটপুট", outputBody: "In-hand কেন বদলাতে পারে, PF/gratuity দীর্ঘমেয়াদে সাহায্য করে কি না, HR-কে কী নিরপেক্ষ প্রশ্ন করবেন।",
    safeWording: "নিরাপদ ভাষা: allowances/exclusions remuneration-এর 50% ছাড়ালে অতিরিক্ত অংশ statutory calculation-এ wages ধরা হতে পারে। প্রত্যেক employee-এর basic সরাসরি CTC-এর 50% হবেই, এমন বলা উচিত নয়।",
    mythsTitle: "Salary নিয়ে ভুল ধারণা যা চুপচাপ টাকা খরচ করায়", mythsSub: "Calculator-এর আগে salary নিয়ে নতুনভাবে ভাবার learning layer।",
    m1: "Colleague Old Regime নিয়েছে, আমিও তাই নেব।", wrong: "ভুল", m1Body: "প্রতিটি tax profile আলাদা। Same CTC মানে same rent বা deductions নয়।", loss: `সম্ভাব্য ক্ষতি: ${COMMON_PRICE.loss}`,
    m2: "12 LPA package মানে Rs 1 lakh/month।", trap: "ধোঁকা", m2Body: "CTC আর take-home আলাদা। PF, gratuity, tax, benefits, variable pay in-hand বদলায়।", gap: `সম্ভাব্য gap: ${COMMON_PRICE.gap}`,
    m3: "CA সব সামলে নেবে।", half: "অর্ধসত্য", m3Body: "CA পরে ITR file করতে পারে; regime decision বছরের শুরুতেই পরিষ্কার হওয়া দরকার।", fix: "Fix: আগে সিদ্ধান্ত নিন",
    m4: "Salary negotiate করা greedy।", costly: "দামী ভুল", m4Body: "অনেক offer-এ room থাকে। Employee না চাইলে buffer company-র কাছেই থাকে।", bigLoss: `সম্ভাব্য ক্ষতি: ${COMMON_PRICE.bigLoss}`,
    toolStatus: ["শীঘ্রই", "Live prototype", "পরবর্তী অগ্রাধিকার", "উচ্চ চাহিদা", "Lead magnet"], toolNames: ["Salary Slip Decoder", "Tax Regime Calculator", "Salary Shock Analyzer", "Offer Letter Decoder", "Future Wealth Calculator", "আমি underpaid?", "Negotiation Script", "Money Planner"],
    emailSub: "এটি email capture prototype। আসল app-এ email delivery ও report generation শুরু হবে।", resultBetter: "Regime আপনার জন্য ভালো", savingApprox: "আপনি আনুমানিক সাশ্রয় করবেন", chooseWithHr: "এই financial year-এর জন্য HR-এ এই regime বেছে নিন।", eitherClose: "দুটি regime খুব কাছাকাছি।",
    pdfTitle: "বিস্তারিত PDF report চান?", pdfBody: "Assumptions, deduction breakdown, HRA logic এবং HR-ready recommendation থাকবে।", paymentBadge: "নিরাপদ payment preview", paymentTitle: "বিস্তারিত PDF Report", paymentBody: "UPI, card, net banking-এর Razorpay-style checkout preview.", payButton: "Rs 199 দিয়ে এগোন", notNow: "এখন নয়", successTitle: "Payment সফল", successBody: "আপনার report তৈরি হচ্ছে; পাঠানো হবে:", download: "PDF report download",
    shockUse: "Salary structure বদলালে PF, gratuity, in-hand impact বোঝার tool.", shockResultBadge: "সম্ভাব্য ব্যাখ্যা", lessInHand: "PF পরিবর্তনে মাসিক in-hand কম", yearlyShift: "আনুমানিক yearly in-hand shift", gratuityIncrease: "Monthly gratuity base increase", shockUp: "Basic salary বাড়লে PF বাড়ে; in-hand কমতে পারে, কিন্তু long-term retirement base ভালো হতে পারে।", shockFlat: "এই sample-এ basic বাড়েনি; shock tax, variable pay, deductions বা payroll component থেকে হতে পারে।", shockLegal: "এটি educational estimate; legal/payroll advice নয়। Employer নাম দেবেন না। HR/payroll/CA/advisor দিয়ে final treatment confirm করুন।",
    aboutTitle: "বেতনভোগী ভারতের জন্য", aboutBody: "TankhaPuraan, Artha Technologies Pvt Ltd-এর product। সাধারণ employee-র ভাষায় salary, tax ও money decisions বোঝানোই লক্ষ্য।", disclaimer: "Calculations informational only. Final decisions-এর জন্য CA বা qualified advisor-এর সঙ্গে কথা বলুন। TankhaPuraan financial loss-এর জন্য liable নয়। Personal data store বা specific employer negative করা যাবে না।",
    amount: "পরিমাণ", back: "ফিরুন", continue: "চালিয়ে যান", skipZero: "Skip / 0 দিন", step: "ধাপ", of: "এর", oldBasic: "পুরনো monthly basic", newBasic: "নতুন monthly basic",
  }),
  mr: makeRegionalCopy({
    chooseTitle: "तुमची भाषा निवडा", chooseSub: "पगार स्पष्ट समजेल ती भाषा निवडा.", fineprint: "22 अनुसूचित भाषा. आकडे English digits मध्ये राहतील.", menu: ["Home", "गर्दीची चूक", "Tax Calculator", "Salary Shock Analyzer", "About"], seeMyths: "पैशाबद्दलच्या सामान्य गैरसमजुती पहा", noAccount: "Account नाही. कंपनीचे नाव नाही. फक्त Calculator.",
    understanding: "TankhaPuraan पगारदार भारतीयांसाठी आहे. Tax, CTC, in-hand pay, Labour Code salary structure, PF, gratuity, offer letter, negotiation आणि monthly planning सोप्या मराठीत समजावते.", roadmapTitle: "TankhaPuraan टूल रोडमॅप", verified: "तपासलेली दिशा", shockIntro: "“माझी salary का कमी झाली?”, “PF जास्त का कापतो?”, “gratuity वाढली म्हणजे फायदा की तोटा?” हे employer वर आरोप न करता समजावते.", inputTitle: "Input", inputBody: "CTC, जुना basic, नवा basic, PF, gratuity, allowances, monthly in-hand.", outputTitle: "Output", outputBody: "In-hand का बदलतो, PF/gratuity long-term फायदेशीर आहे का, HR ला कोणते neutral प्रश्न विचारायचे.", safeWording: "Safe wording: allowances/exclusions remuneration च्या 50% पेक्षा जास्त असतील तर extra भाग statutory calculation मध्ये wages मानला जाऊ शकतो. प्रत्येक employee चा basic थेट CTC च्या 50% असलाच पाहिजे असे म्हणू नका.",
    mythsTitle: "Salary बद्दलच्या गैरसमजुती ज्या शांतपणे पैसा खर्च करतात", mythsSub: "Calculator आधी salary बद्दल नव्याने विचार करायला लावणारा learning layer.", m1: "Colleague ने Old Regime घेतला, मीही तोच.", wrong: "चूक", m1Body: "प्रत्येक tax profile वेगळा असतो. Same CTC म्हणजे same rent/deductions नाही.", loss: `संभाव्य नुकसान: ${COMMON_PRICE.loss}`, m2: "12 LPA package म्हणजे Rs 1 lakh/month.", trap: "भ्रम", m2Body: "CTC आणि take-home वेगळे आहेत. PF, gratuity, tax, benefits, variable pay in-hand बदलतात.", gap: `संभाव्य gap: ${COMMON_PRICE.gap}`, m3: "CA सगळं पाहील.", half: "अर्धसत्य", m3Body: "CA नंतर ITR file करू शकतो; regime decision सुरुवातीलाच स्पष्ट हवा.", fix: "Fix: लवकर निर्णय घ्या", m4: "Salary negotiate करणे greedy आहे.", costly: "महाग चूक", m4Body: "अनेक offers मध्ये room असतो. Employee विचारत नाही तर buffer company कडे राहतो.", bigLoss: `संभाव्य नुकसान: ${COMMON_PRICE.bigLoss}`,
    toolStatus: ["लवकरच", "Live prototype", "पुढची प्राथमिकता", "जास्त मागणी", "Lead magnet"], toolNames: ["Salary Slip Decoder", "Tax Regime Calculator", "Salary Shock Analyzer", "Offer Letter Decoder", "Future Wealth Calculator", "मी underpaid आहे का?", "Negotiation Script", "Money Planner"], emailSub: "हे email capture prototype आहे. खऱ्या app मध्ये email delivery/report generation सुरू होईल.", resultBetter: "Regime तुमच्यासाठी चांगला", savingApprox: "तुमची अंदाजे बचत", chooseWithHr: "या financial year साठी HR कडे हा regime निवडा.", eitherClose: "दोन्ही regimes खूप जवळ आहेत.", pdfTitle: "सविस्तर PDF report हवा?", pdfBody: "Assumptions, deduction breakdown, HRA logic, HR-ready recommendation मिळेल.", paymentBadge: "सुरक्षित payment preview", paymentTitle: "सविस्तर PDF Report", paymentBody: "UPI, card, net banking साठी Razorpay-style checkout preview.", payButton: "Rs 199 भरून पुढे जा", notNow: "आता नाही", successTitle: "Payment यशस्वी", successBody: "तुमचा report तयार होत आहे; पाठवला जाईल:", download: "PDF report download", shockUse: "Salary structure बदलल्यावर PF, gratuity, in-hand impact समजण्यासाठी हे tool.", shockResultBadge: "संभाव्य स्पष्टीकरण", lessInHand: "PF बदलामुळे monthly in-hand कमी", yearlyShift: "अंदाजे yearly in-hand shift", gratuityIncrease: "Monthly gratuity base increase", shockUp: "Basic salary वाढल्यास PF वाढू शकतो; in-hand कमी होऊ शकतो पण long-term retirement base सुधारू शकतो.", shockFlat: "या sample मध्ये basic वाढलेला नाही; shock tax, variable pay, deductions किंवा payroll component मुळे असू शकतो.", shockLegal: "हे educational estimate आहे; legal/payroll advice नाही. Employer नाव देऊ नका. HR/payroll/CA/advisor कडून final treatment confirm करा.", aboutTitle: "पगारदार भारतासाठी", aboutBody: "TankhaPuraan हे Artha Technologies Pvt Ltd चे product आहे. साध्या भाषेत salary, tax आणि money decisions समजावणे हे वचन.", disclaimer: "Calculations informational only. Final decisions साठी CA किंवा qualified advisor शी बोला. TankhaPuraan financial loss साठी liable नाही. Personal data store किंवा specific employer negative करू नये.", amount: "रक्कम", back: "मागे", continue: "पुढे", skipZero: "Skip / 0 भरा", step: "पायरी", of: "पैकी", oldBasic: "जुना monthly basic", newBasic: "नवा monthly basic",
  }),
});

function makeCompactCopy(p) {
  return {
    ...APP_COPY.en,
    chooseTitle: p.chooseTitle,
    chooseSub: p.chooseSub,
    fineprint: p.fineprint,
    menu: p.menu,
    menuButton: p.menuButton || APP_COPY.en.menuButton,
    understandingTitle: p.understandingTitle || p.roadmapTitle,
    seeMyths: p.seeMyths,
    noAccount: p.noAccount,
    understanding: p.understanding,
    roadmapTitle: p.roadmapTitle,
    verified: p.verified,
    shockIntro: p.shockIntro,
    inputTitle: p.inputTitle,
    inputBody: p.inputBody,
    outputTitle: p.outputTitle,
    outputBody: p.outputBody,
    safeWording: p.safeWording,
    mythsTitle: p.mythsTitle,
    mythsSub: p.mythsSub,
    myths: p.myths,
    toolStatus: p.toolStatus,
    toolNames: p.toolNames,
    emailSub: p.emailSub,
    resultBetter: p.resultBetter,
    savingApprox: p.savingApprox,
    chooseWithHr: p.chooseWithHr,
    eitherClose: p.eitherClose,
    pdfTitle: p.pdfTitle,
    pdfBody: p.pdfBody,
    paymentBadge: p.paymentBadge,
    paymentTitle: p.paymentTitle,
    paymentBody: p.paymentBody,
    payButton: p.payButton,
    notNow: p.notNow,
    successTitle: p.successTitle,
    successBody: p.successBody,
    download: p.download,
    shockUse: p.shockUse,
    shockResultBadge: p.shockResultBadge,
    lessInHand: p.lessInHand,
    yearlyShift: p.yearlyShift,
    gratuityIncrease: p.gratuityIncrease,
    shockUp: p.shockUp,
    shockFlat: p.shockFlat,
    shockLegal: p.shockLegal,
    aboutTitle: p.aboutTitle,
    aboutBody: p.aboutBody,
    disclaimer: p.disclaimer,
    amount: p.amount,
    back: p.back,
    continue: p.continue,
    skipZero: p.skipZero,
    step: p.step,
    of: p.of,
    oldBasic: p.oldBasic,
    newBasic: p.newBasic,
  };
}

const BASIC_TOOL_NAMES = {
  gu: ["Salary Slip Decoder", "Tax Regime Calculator", "Salary Shock Analyzer", "Offer Letter Decoder", "Future Wealth Calculator", "હું underpaid છું?", "Negotiation Script", "Money Planner"],
  kn: ["Salary Slip Decoder", "Tax Regime Calculator", "Salary Shock Analyzer", "Offer Letter Decoder", "Future Wealth Calculator", "ನಾನು underpaid ಆಗಿದ್ದೇನಾ?", "Negotiation Script", "Money Planner"],
  ml: ["Salary Slip Decoder", "Tax Regime Calculator", "Salary Shock Analyzer", "Offer Letter Decoder", "Future Wealth Calculator", "ഞാൻ underpaid ആണോ?", "Negotiation Script", "Money Planner"],
  pa: ["Salary Slip Decoder", "Tax Regime Calculator", "Salary Shock Analyzer", "Offer Letter Decoder", "Future Wealth Calculator", "ਕੀ ਮੈਂ underpaid ਹਾਂ?", "Negotiation Script", "Money Planner"],
  or: ["Salary Slip Decoder", "Tax Regime Calculator", "Salary Shock Analyzer", "Offer Letter Decoder", "Future Wealth Calculator", "ମୁଁ underpaid କି?", "Negotiation Script", "Money Planner"],
  as: ["Salary Slip Decoder", "Tax Regime Calculator", "Salary Shock Analyzer", "Offer Letter Decoder", "Future Wealth Calculator", "মই underpaid নেকি?", "Negotiation Script", "Money Planner"],
  ur: ["Salary Slip Decoder", "Tax Regime Calculator", "Salary Shock Analyzer", "Offer Letter Decoder", "Future Wealth Calculator", "کیا میں underpaid ہوں؟", "Negotiation Script", "Money Planner"],
  ne: ["Salary Slip Decoder", "Tax Regime Calculator", "Salary Shock Analyzer", "Offer Letter Decoder", "Future Wealth Calculator", "के म underpaid छु?", "Negotiation Script", "Money Planner"],
  kok: ["Salary Slip Decoder", "Tax Regime Calculator", "Salary Shock Analyzer", "Offer Letter Decoder", "Future Wealth Calculator", "हांव underpaid आसा?", "Negotiation Script", "Money Planner"],
  mai: ["Salary Slip Decoder", "Tax Regime Calculator", "Salary Shock Analyzer", "Offer Letter Decoder", "Future Wealth Calculator", "की हम underpaid छी?", "Negotiation Script", "Money Planner"],
  mni: ["Salary Slip Decoder", "Tax Regime Calculator", "Salary Shock Analyzer", "Offer Letter Decoder", "Future Wealth Calculator", "ꯑꯩ underpaid ꯑꯣꯏꯕ꯭ꯔꯥ?", "Negotiation Script", "Money Planner"],
  bo: ["Salary Slip Decoder", "Tax Regime Calculator", "Salary Shock Analyzer", "Offer Letter Decoder", "Future Wealth Calculator", "आंव underpaid नामा?", "Negotiation Script", "Money Planner"],
  sat: ["Salary Slip Decoder", "Tax Regime Calculator", "Salary Shock Analyzer", "Offer Letter Decoder", "Future Wealth Calculator", "ᱤᱧ underpaid ᱠᱟᱱᱟ?", "Negotiation Script", "Money Planner"],
  doi: ["Salary Slip Decoder", "Tax Regime Calculator", "Salary Shock Analyzer", "Offer Letter Decoder", "Future Wealth Calculator", "क्या मैं underpaid आं?", "Negotiation Script", "Money Planner"],
  ks: ["Salary Slip Decoder", "Tax Regime Calculator", "Salary Shock Analyzer", "Offer Letter Decoder", "Future Wealth Calculator", "کیاہ بہ underpaid چھُس؟", "Negotiation Script", "Money Planner"],
  sd: ["Salary Slip Decoder", "Tax Regime Calculator", "Salary Shock Analyzer", "Offer Letter Decoder", "Future Wealth Calculator", "ڇا مان underpaid آهيان؟", "Negotiation Script", "Money Planner"],
};

Object.assign(APP_COPY, {
  gu: makeCompactCopy({
    chooseTitle: "તમારી ભાષા પસંદ કરો", chooseSub: "જે ભાષામાં પગાર સ્પષ્ટ સમજાય તે પસંદ કરો.", fineprint: "22 અનુસૂચિત ભાષાઓ. આંકડા English digits માં રહેશે.", menu: ["Home", "ભીડની ભૂલ", "Tax Calculator", "Salary Shock Analyzer", "વિશે"], seeMyths: "પૈસા વિશેની સામાન્ય ગેરસમજ જુઓ", noAccount: "Account નહીં. કંપનીનું નામ નહીં. ફક્ત Calculator.", understanding: "TankhaPuraan પગારદાર ભારતીયો માટે છે. Tax, CTC, in-hand pay, Labour Code salary structure, PF, gratuity, offer letter, negotiation અને monthly planning સરળ ગુજરાતીમાં સમજાવે છે.", roadmapTitle: "TankhaPuraan ટૂલ રોડમૅપ", verified: "ચકાસેલી દિશા", shockIntro: "“મારી salary કેમ ઘટી?”, “PF વધારે કેમ કપાય છે?”, “gratuity વધ્યું તો લાભ કે નુકસાન?” આ પ્રશ્નો employer પર આરોપ કર્યા વગર સમજાવે છે.", inputTitle: "Input", inputBody: "CTC, જૂનું basic, નવું basic, PF, gratuity, allowances, monthly in-hand.", outputTitle: "Output", outputBody: "In-hand કેમ બદલાય, PF/gratuity long-term લાભ આપે છે કે નહીં, HR ને શું neutral પ્રશ્નો પૂછવા.", safeWording: "Safe wording: allowances/exclusions remuneration ના 50% થી વધારે હોય તો વધારાનો ભાગ statutory calculation માં wages ગણાઈ શકે. દરેક employee નું basic સીધું CTC ના 50% હોવું જ જોઈએ એવું ન કહો.", mythsTitle: "Salary ની ગેરસમજ જે શાંતિથી પૈસા ખર્ચાવે છે", mythsSub: "Calculator પહેલાં salary વિશે નવા રીતે વિચાર કરાવતો learning layer.", myths: [["Colleague એ Old Regime લીધો એટલે હું પણ.", "ખોટું", "દરેક tax profile અલગ છે. Same CTC એટલે same rent/deductions નથી.", "સંભવિત નુકસાન: Rs 8,000-25,000/year"], ["12 LPA package એટલે Rs 1 lakh/month.", "ભ્રમ", "CTC અને take-home અલગ છે. PF, gratuity, tax, benefits in-hand બદલે છે.", "સંભવિત gap: Rs 18,000-36,000/year"], ["CA બધું સંભાળી લેશે.", "અર્ધસત્ય", "CA પછી ITR file કરી શકે; regime decision શરૂઆતમાં સ્પષ્ટ જોઈએ.", "Fix: વહેલો નિર્ણય લો"], ["Salary negotiate કરવું greedy છે.", "મોંઘી ભૂલ", "ઘણા offers માં room હોય છે. Employee ન પૂછે તો buffer company પાસે રહે છે.", "સંભવિત નુકસાન: Rs 50,000+/year"]], toolStatus: ["ટૂંક સમયમાં", "Live prototype", "આગામી પ્રાથમિકતા", "ઉચ્ચ માંગ", "Lead magnet"], toolNames: BASIC_TOOL_NAMES.gu, emailSub: "આ email capture prototype છે. સાચી app માં email delivery/report generation શરૂ થશે.", resultBetter: "Regime તમારા માટે સારું", savingApprox: "તમે અંદાજે બચાવશો", chooseWithHr: "આ financial year માટે HR પાસે આ regime પસંદ કરો.", eitherClose: "બન્ને regimes ખૂબ નજીક છે.", pdfTitle: "વિગતવાર PDF report જોઈએ?", pdfBody: "Assumptions, deduction breakdown, HRA logic અને HR-ready recommendation મળશે.", paymentBadge: "સુરક્ષિત payment preview", paymentTitle: "વિગતવાર PDF Report", paymentBody: "UPI, card, net banking માટે Razorpay-style checkout preview.", payButton: "Rs 199 ચૂકવી આગળ વધો", notNow: "હમણાં નહીં", successTitle: "Payment સફળ", successBody: "તમારો report તૈયાર થઈ રહ્યો છે; મોકલાશે:", download: "PDF report download", shockUse: "Salary structure બદલાય ત્યારે PF, gratuity, in-hand impact સમજવા માટેનું tool.", shockResultBadge: "સંભવિત સમજણ", lessInHand: "PF બદલાવથી monthly in-hand ઓછું", yearlyShift: "અંદાજિત yearly in-hand shift", gratuityIncrease: "Monthly gratuity base increase", shockUp: "Basic salary વધે તો PF વધે; in-hand ઘટી શકે, પણ long-term retirement base સુધરી શકે.", shockFlat: "આ sample માં basic વધ્યું નથી; shock tax, variable pay, deductions અથવા payroll component થી હોઈ શકે.", shockLegal: "આ educational estimate છે; legal/payroll advice નથી. Employer નામ ન નાખો. Final treatment HR/payroll/CA/advisor સાથે confirm કરો.", aboutTitle: "પગારદાર ભારત માટે", aboutBody: "TankhaPuraan Artha Technologies Pvt Ltd નું product છે. સામાન્ય employee સમજે તેવી ભાષામાં salary, tax અને money decisions સમજાવવાનું વચન.", disclaimer: "Calculations informational only. Final decisions માટે CA અથવા qualified advisor સાથે વાત કરો. TankhaPuraan financial loss માટે liable નથી. Personal data store અથવા specific employer negative ન કરવો.", amount: "રકમ", back: "પાછળ", continue: "આગળ", skipZero: "Skip / 0 દાખલ કરો", step: "પગલું", of: "માંથી", oldBasic: "જૂનું monthly basic", newBasic: "નવું monthly basic",
  }),
});

function money(value) {
  return "Rs " + Math.round(Number(value || 0)).toLocaleString("en-IN");
}

function regionalFromTaxPack(code) {
  const t = TRANSLATIONS[code] || TRANSLATIONS.en;
  return {
    ...APP_COPY.en,
    chooseTitle: "Choose your language",
    chooseSub: t.tag,
    menu: ["Home", "Bheed Ki Galti", t.calc, "Salary Shock Analyzer", "About"],
    menuButton: "Menu",
    understandingTitle: t.tag,
    seeMyths: t.rShare || APP_COPY.en.seeMyths,
    noAccount: t.safe,
    understanding: `${t.tag}. ${t.sub} Tax, CTC, in-hand pay, PF, gratuity, offer letter, monthly planning — regional language support.`,
    roadmapTitle: "TankhaPuraan Tools",
    verified: t.rAI || APP_COPY.en.verified,
    shockIntro: `${t.pains[1]} PF, gratuity, in-hand change — calculation-based explanation without employer accusation.`,
    inputTitle: "Input",
    inputBody: `${t.labels.join(", ")}.`,
    outputTitle: "Output",
    outputBody: `${t.rCompare}. ${t.rInHand}. Neutral HR questions.`,
    safeWording: `${t.eSafe} If allowances or exclusions exceed 50% of remuneration, the excess may be treated as wages for statutory calculations.`,
    mythsTitle: "Bheed Ki Galti",
    mythsSub: t.rShare,
    myths: t.pains.map((pain, index) => [
      pain,
      index === 0 ? "GALAT HAI" : index === 1 ? "DHOKA HAI" : "ADHURA SACH",
      t.hints[index] || t.sub,
      index === 0 ? "Rs 8,000-25,000/year" : index === 1 ? "Rs 18,000-36,000/year" : "Fix: early decision",
    ]),
    toolStatus: ["Coming soon", "Live prototype", "Next priority", "High demand", "Lead magnet"],
    toolNames: APP_COPY.en.toolNames,
    emailSub: t.eHint,
    resultBetter: t.rBetter,
    savingApprox: t.rSaving,
    chooseWithHr: `${t.rBetter}: HR update.`,
    eitherClose: t.rCompare,
    pdfTitle: t.rUTitle,
    pdfButton: t.rUBtn,
    recalc: t.rRecalc,
    shockUse: `${t.labels[0]}, PF, gratuity — salary structure impact.`,
    shockResultBadge: t.rAI,
    lessInHand: t.rInHand,
    yearlyShift: t.rYear,
    gratuityIncrease: "gratuity base",
    shockUp: `${t.rSaving}: higher PF can reduce in-hand, but may improve long-term retirement base.`,
    shockFlat: `${t.rCompare}: salary shock can also come from tax, variable pay, or deductions.`,
    shockLegal: t.eSafe,
    amount: t.labels[0],
    back: t.rRecalc,
    continue: t.next,
    skipZero: t.skip,
    step: "Step",
    of: "/",
  };
}

function copyFor(code) {
  return APP_COPY[code] ? { ...APP_COPY.en, ...APP_COPY[code] } : regionalFromTaxPack(code);
}

const DIGIT_MAP = {
  "٠": "0", "۰": "0", "०": "0", "০": "0", "੦": "0", "૦": "0", "୦": "0", "௦": "0", "౦": "0", "೦": "0", "൦": "0",
  "١": "1", "۱": "1", "१": "1", "১": "1", "੧": "1", "૧": "1", "୧": "1", "௧": "1", "౧": "1", "೧": "1", "൧": "1",
  "٢": "2", "۲": "2", "२": "2", "২": "2", "੨": "2", "૨": "2", "୨": "2", "௨": "2", "౨": "2", "೨": "2", "൨": "2",
  "٣": "3", "۳": "3", "३": "3", "৩": "3", "੩": "3", "૩": "3", "୩": "3", "௩": "3", "౩": "3", "೩": "3", "൩": "3",
  "٤": "4", "۴": "4", "४": "4", "৪": "4", "੪": "4", "૪": "4", "୪": "4", "௪": "4", "౪": "4", "೪": "4", "൪": "4",
  "٥": "5", "۵": "5", "५": "5", "৫": "5", "੫": "5", "૫": "5", "୫": "5", "௫": "5", "౫": "5", "೫": "5", "൫": "5",
  "٦": "6", "۶": "6", "६": "6", "৬": "6", "੬": "6", "૬": "6", "୬": "6", "௬": "6", "౬": "6", "೬": "6", "൬": "6",
  "٧": "7", "۷": "7", "७": "7", "৭": "7", "੭": "7", "૭": "7", "୭": "7", "௭": "7", "౭": "7", "೭": "7", "൭": "7",
  "٨": "8", "۸": "8", "८": "8", "৮": "8", "੮": "8", "૮": "8", "୮": "8", "௮": "8", "౮": "8", "೮": "8", "൮": "8",
  "٩": "9", "۹": "9", "९": "9", "৯": "9", "੯": "9", "૯": "9", "୯": "9", "௯": "9", "౯": "9", "೯": "9", "൯": "9",
};
DIGIT_MAP["꯰"] = "0";
DIGIT_MAP["꯱"] = "1";
DIGIT_MAP["꯲"] = "2";
DIGIT_MAP["꯳"] = "3";
DIGIT_MAP["꯴"] = "4";
DIGIT_MAP["꯵"] = "5";
DIGIT_MAP["꯶"] = "6";
DIGIT_MAP["꯷"] = "7";
DIGIT_MAP["꯸"] = "8";
DIGIT_MAP["꯹"] = "9";

function englishDigits(value) {
  if (typeof value === "string") {
    return Array.from(value).map((digit) => DIGIT_MAP[digit] || digit).join("");
  }
  if (Array.isArray(value)) return value.map(englishDigits);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, englishDigits(item)]));
  }
  return value;
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
    basicIncreased: newBasic > oldBasic,
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
  const t = englishDigits(TRANSLATIONS[language?.code] || TRANSLATIONS.en);
  const x = englishDigits(copyFor(language?.code || "en"));
  const currentTaxSteps = useMemo(() => taxSteps(t), [t]);
  const toolNames = x.toolNames || APP_COPY.en.toolNames;
  const toolStatus = x.toolStatus || APP_COPY.en.toolStatus;
  const tools = TOOLS.map((tool, index) => ({
    ...tool,
    name: toolNames[index],
    status: toolStatus[Math.min(index, toolStatus.length - 1)],
  }));
  const localizedMyths = (x.myths || APP_COPY.en.myths).map(([title, verdict, body, cost]) => ({ title, verdict, body, cost }));

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
    const key = currentTaxSteps[taxStep][0];
    setTaxValues((current) => ({ ...current, [key]: value }));
  }

  function nextTax(value) {
    const nextValues = { ...taxValues, [currentTaxSteps[taxStep][0]]: value };
    setTaxValues(nextValues);
    if (taxStep < currentTaxSteps.length - 1) {
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
          <h2>{APP_COPY.en.chooseTitle}</h2>
          <p className="muted center">{APP_COPY.en.chooseSub}</p>
          <div className="language-grid">
            {LANGUAGES.map((lang) => (
              <button key={lang.code} className="language-option" onClick={() => chooseLanguage(lang)}>
                <strong>{lang.native}</strong>
                <span>{lang.name}</span>
                <small>{lang.region}</small>
              </button>
            ))}
          </div>
          <p className="fineprint center">{APP_COPY.en.fineprint}</p>
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
            <small>{t.tag}</small>
          </span>
        </button>
        <div className="top-actions">
          <button className="pill" onClick={() => setLanguage(null)}>{language.native}</button>
          <button className="pill" onClick={() => setMenuOpen((open) => !open)}>{x.menuButton}</button>
        </div>
        {menuOpen && (
          <nav className="menu">
            <button onClick={() => go("home")}>{x.menu[0]}</button>
            <button onClick={() => go("myths")}>{x.menu[1]}</button>
            <button onClick={startTax}>{x.menu[2]}</button>
            <button onClick={() => go("shock")}>{x.menu[3]}</button>
            <button onClick={() => go("about")}>{x.menu[4]}</button>
          </nav>
        )}
      </header>

      <main className="wrap">
        {screen === "home" && (
          <>
            <section className="hero">
              <div className="panel hero-main">
                <div>
                  <span className="badge">{t.badge}</span>
                  <h1>{t.h1a} <span>{t.h1b}</span></h1>
                  <p>{t.sub}</p>
                </div>
                <div className="hero-actions">
                  <button className="primary" onClick={startTax}>{t.cta}</button>
                  <button className="secondary" onClick={() => go("myths")}>{x.seeMyths}</button>
                  <small>{x.noAccount}</small>
                </div>
              </div>
              <div className="hero-side">
                {t.pains.map((quote, index) => (
                  <div className="quote" key={quote}>
                    <strong>{index + 1}</strong>
                    <span>{quote}</span>
                  </div>
                ))}
                <div className="panel dark">
                  <h2>{x.understandingTitle}</h2>
                  <p>{x.understanding}</p>
                </div>
              </div>
            </section>

            <section className="section">
              <h2>{x.roadmapTitle}</h2>
              <div className="tool-grid">
                {tools.map((tool) => (
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
              <span className="badge">{x.verified}</span>
              <h2>{toolNames[2]}</h2>
              <p>{x.shockIntro}</p>
              <div className="mini-grid">
                <div>
                  <strong>{x.inputTitle}</strong>
                  <p>{x.inputBody}</p>
                </div>
                <div>
                  <strong>{x.outputTitle}</strong>
                  <p>{x.outputBody}</p>
                </div>
              </div>
              <p className="legal">{x.safeWording}</p>
            </section>
          </>
        )}

        {screen === "myths" && (
          <section>
            <div className="panel intro">
              <span className="badge">Bheed Ki Galti</span>
              <h1>{x.mythsTitle}</h1>
              <p>{x.mythsSub}</p>
            </div>
            <div className="myth-grid">
              {localizedMyths.map((myth) => (
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
            steps={currentTaxSteps}
            x={x}
            saveValue={saveTaxValue}
            next={nextTax}
            back={() => (taxStep === 0 ? go("home") : setTaxStep((step) => step - 1))}
          />
        )}

        {screen === "email" && (
          <section className="panel narrow">
            <span className="badge">Almost done</span>
            <h1>{t.eTitle}</h1>
            <p>{x.emailSub}</p>
            <label>{t.eName}<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Amiya" /></label>
            <label>Email address<input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label>
            <button className="primary full" onClick={showTaxResult}>{t.eBtn || x.showResult}</button>
            <small>{t.eSafe || x.noSpam}</small>
          </section>
        )}

        {screen === "result" && taxResult && (
          <section className="result-grid">
            <div className="panel dark result-hero">
              <span className="badge green">TankhaPuraan says</span>
              <h1>{taxResult.winner} {x.resultBetter}</h1>
              <p>{t.rSaving || x.savingApprox}</p>
              <strong>{money(taxResult.saving)}</strong>
              <p>{taxResult.winner === "Either" ? x.eitherClose : x.chooseWithHr}</p>
            </div>
            <div className="panel">
              <h2>{t.rCompare || x.resultCompare}</h2>
              <Metric label="Annual CTC" value={money(taxResult.ctc)} percent={100} />
              <Metric label="New tax" value={money(taxResult.newTax)} percent={taxResult.newTax / Math.max(taxResult.oldTax, taxResult.newTax, 1) * 100} />
              <Metric label="Old tax" value={money(taxResult.oldTax)} percent={taxResult.oldTax / Math.max(taxResult.oldTax, taxResult.newTax, 1) * 100} />
              <Metric label="In-hand/month" value={money(taxResult.inHand)} percent={78} green />
              <div className="upsell">
                <h3>{t.rUTitle || x.pdfTitle}</h3>
                <p>{x.pdfBody}</p>
                <button className="primary full" onClick={() => go("payment")}>{t.rUBtn || x.pdfButton}</button>
              </div>
              <button className="secondary full" onClick={startTax}>{t.rRecalc || x.recalc}</button>
            </div>
          </section>
        )}

        {screen === "payment" && (
          <section className="panel narrow">
            <span className="badge">{x.paymentBadge}</span>
            <h1>{x.paymentTitle}</h1>
            <p>{x.paymentBody}</p>
            <div className="bill-row"><strong>TankhaPuraan PDF Report</strong><strong>Rs 199</strong></div>
            <button className="primary full" onClick={() => go("success")}>{x.payButton}</button>
            <button className="secondary full" onClick={() => go("result")}>{x.notNow}</button>
          </section>
        )}

        {screen === "success" && (
          <section className="panel narrow center">
            <div className="success-mark">OK</div>
            <h1>{x.successTitle}</h1>
            <p>{x.successBody} {email || "your email"}.</p>
            <button className="primary">{x.download}</button>
          </section>
        )}

        {screen === "shock" && (
          <section className="result-grid">
            <div className="panel">
              <span className="badge">Tool 6 - {toolStatus[2]}</span>
              <h1>{toolNames[2]}</h1>
              <p>{x.shockUse}</p>
              <label>Annual CTC<input value={shockValues.ctc} onChange={(event) => setShockValues({ ...shockValues, ctc: event.target.value })} /></label>
              <label>{x.oldBasic || "Old monthly basic"}<input value={shockValues.oldBasic} onChange={(event) => setShockValues({ ...shockValues, oldBasic: event.target.value })} /></label>
              <label>{x.newBasic || "New monthly basic"}<input value={shockValues.newBasic} onChange={(event) => setShockValues({ ...shockValues, newBasic: event.target.value })} /></label>
            </div>
            <div className="panel dark">
              <span className="badge green">{x.shockResultBadge}</span>
              <h2>{money(shockResult.monthlyDrop)} {x.lessInHand}</h2>
              <p>{shockResult.basicIncreased ? x.shockUp : x.shockFlat}</p>
              <div className="mini-grid">
                <div><strong>{money(shockResult.yearlyDrop)}</strong><p>{x.yearlyShift}</p></div>
                <div><strong>{money(shockResult.gratuityBaseIncrease)}</strong><p>{x.gratuityIncrease}</p></div>
              </div>
              <p className="legal dark-legal">{x.shockLegal}</p>
            </div>
          </section>
        )}

        {screen === "about" && (
          <section className="panel intro">
            <span className="badge">About</span>
            <h1>{x.aboutTitle}</h1>
            <p>{x.aboutBody}</p>
            <p className="legal">{x.disclaimer}</p>
          </section>
        )}
      </main>
    </div>
  );
}

function TaxCalculator({ step, setStep, values, steps, x, next, back }) {
  const current = steps[step];
  const [draft, setDraft] = useState(values[current[0]] || "");

  function continueStep() {
    next(draft);
    setDraft("");
  }

  function goBack() {
    back();
    setDraft(values[steps[Math.max(step - 1, 0)][0]] || "");
  }

  return (
    <section className="flow">
      <aside className="steps">
        {steps.map((item, index) => (
          <button key={item[0]} className={index === step ? "active" : ""} onClick={() => setStep(index)}>
            <strong>{index + 1}</strong>
            <span>{item[1]}</span>
          </button>
        ))}
      </aside>
      <div className="panel form-panel">
        <div>
          <span className="badge">{x.step} {step + 1} {x.of} {steps.length}</span>
          <h1>{current[1]}</h1>
          <p>{current[2]}</p>
          <label>
            {x.amount}
            <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={current[3]} inputMode="numeric" />
          </label>
        </div>
        <div className="form-actions">
          <button className="secondary" onClick={goBack}>{x.back}</button>
          <button className="primary" onClick={continueStep}>{x.continue}</button>
          <button className="ghost" onClick={() => { setDraft("0"); next("0"); }}>{x.skipZero}</button>
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

