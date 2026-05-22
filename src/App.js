import { TRANSLATIONS } from './translations';
import { useState } from "react";
const T = TRANSLATIONS;

// ─────────────────────────────────────────────────────────────
// TANKHAPURAAN — COMPLETE APP
// A product of Artha Technologies Pvt Ltd 🇮🇳
// Built by a Proud Indian
//
// SCREEN FLOW:
// lang_select → home → [myth_breaker | tool2] → result → payment → success
// ─────────────────────────────────────────────────────────────

// ── LANGUAGES ────────────────────────────────────────────────
const LANGUAGES = [
  { code:"hi", name:"Hindi",     native:"हिन्दी",    region:"North India",         color:"#E07B39" },
  { code:"en", name:"English",   native:"English",   region:"All India",            color:"#2471A3" },
  { code:"bn", name:"Bengali",   native:"বাংলা",      region:"West Bengal",          color:"#2D9B6F" },
  { code:"ta", name:"Tamil",     native:"தமிழ்",      region:"Tamil Nadu",           color:"#C0392B" },
  { code:"te", name:"Telugu",    native:"తెలుగు",     region:"Andhra & Telangana",   color:"#7C5CBF" },
  { code:"mr", name:"Marathi",   native:"मराठी",      region:"Maharashtra",          color:"#E07B39" },
  { code:"gu", name:"Gujarati",  native:"ગુજરાતી",    region:"Gujarat",              color:"#2471A3" },
  { code:"kn", name:"Kannada",   native:"ಕನ್ನಡ",      region:"Karnataka",            color:"#C0392B" },
  { code:"ml", name:"Malayalam", native:"മലയാളം",     region:"Kerala",               color:"#2D9B6F" },
  { code:"pa", name:"Punjabi",   native:"ਪੰਜਾਬੀ",     region:"Punjab",               color:"#E07B39" },
  { code:"or", name:"Odia",      native:"ଓଡ଼ିଆ",      region:"Odisha",               color:"#7C5CBF" },
  { code:"as", name:"Assamese",  native:"অসমীয়া",    region:"Assam",                color:"#2471A3" },
  { code:"ur", name:"Urdu",      native:"اردو",       region:"Pan-India",            color:"#2D9B6F" },
  { code:"ne", name:"Nepali",    native:"नेपाली",     region:"Sikkim & NE",          color:"#E07B39" },
  { code:"kok",name:"Konkani",   native:"कोंकणी",     region:"Goa",                  color:"#2471A3" },
  { code:"mai",name:"Maithili",  native:"मैथिली",     region:"Bihar",                color:"#C0392B" },
  { code:"mni",name:"Manipuri",  native:"মৈতৈলোন্",   region:"Manipur",              color:"#2D9B6F" },
  { code:"bo", name:"Bodo",      native:"बड़ो",        region:"Assam & NE",           color:"#7C5CBF" },
  { code:"sat",name:"Santhali",  native:"ᱥᱟᱱᱛᱟᱲᱤ",  region:"Jharkhand",            color:"#E07B39" },
  { code:"doi",name:"Dogri",     native:"डोगरी",      region:"Jammu",                color:"#2471A3" },
  { code:"ks", name:"Kashmiri",  native:"کٲشُر",      region:"J&K",                  color:"#C0392B" },
  { code:"sd", name:"Sindhi",    native:"سنڌي",       region:"Rajasthan",            color:"#7C5CBF" },
];



// ── MYTHS (10) ────────────────────────────────────────────────
const MYTHS = [
  { id:1, icon:"👥", cat:"TAX",         verdict:"GALAT HAI",          color:"#E07B39", crowd:"\"Mere colleague ne old regime rakha, toh main bhi.\"",         cost:"₹8,000–₹25,000/yr",  truth:"Har insaan ka tax profile alag hota hai. Colleague ka decision tumhare liye kabhi kaam nahi karega.",          fix:"Apna khud ka tax calculate karo.", share:"\"Mere colleague ne old regime rakha toh main bhi\" — yeh soch mujhe ₹18,000 mehnga pad rahi thi. tankhapuraan.com" },
  { id:2, icon:"💼", cat:"CTC",         verdict:"DHOKA HAI",          color:"#C0392B", crowd:"\"Mera package 12 LPA hai.\"",                                    cost:"₹18,000–₹36,000/yr",  truth:"CTC aur take-home ALAG hain. 12 LPA ka matlab typically ₹75,000–₹82,000 in-hand — NOT ₹1 lakh.",          fix:"Apni actual in-hand salary pata karo.",  share:"\"12 LPA package hai\" — lekin haath mein ₹75,000 aate hain. CTC aur salary ALAG cheez hain. tankhapuraan.com" },
  { id:3, icon:"📋", cat:"TAX",         verdict:"ADHURA SACH",        color:"#7C5CBF", crowd:"\"CA hai mera, woh dekh lega.\"",                                 cost:"₹3,000–₹8,000/yr",   truth:"CA ITR file karta hai — March ke baad. April mein regime decision tumhe khud karna hota hai. Tab CA bahut der ho chuki hoti hai.", fix:"April mein khud decide karo.", share:"\"CA hai, woh dekh lega\" — CA ITR file karta hai, planning tumhe karni padti hai. tankhapuraan.com" },
  { id:4, icon:"📈", cat:"HIKE",        verdict:"HALF PICTURE",       color:"#2471A3", crowd:"\"20% hike mili! Bahut achha hua.\"",                             cost:"Always less than you think", truth:"Tax bracket bhi change hota hai. Actual in-hand difference kaafi kam hota hai jo tumne soch rakha tha.", fix:"Hike ke baad actual in-hand pata karo.", share:"\"20% hike mili!\" — lekin tax ke baad actual in-hand kitna badha? tankhapuraan.com" },
  { id:5, icon:"🗣️", cat:"NEGOTIATION", verdict:"SABSE MEHNGI GALTI", color:"#2D9B6F", crowd:"\"Negotiate karna greedy lagta hai.\"",                          cost:"₹50,000–₹3,00,000/yr",truth:"Company offer mein buffer rakha hota hai. Jo nahi karta, company woh buffer apne paas rakh leti hai.",       fix:"Negotiation script lo.", share:"\"Negotiate karna greedy lagta hai\" — yeh soch ₹1L+/year ka nuksaan karti thi. tankhapuraan.com" },
  { id:6, icon:"💰", cat:"PF",          verdict:"ULTA SOCH HAI",      color:"#E07B39", crowd:"\"PF toh salary se kat jaata hai. Loss hai.\"",                  cost:"₹50,000+ employer match missed", truth:"PF mein tumhara paisa jaata hai — aur employer bhi utna hi match karta hai. Yeh forced saving hai.", fix:"Apna PF corpus dekho.", share:"\"PF salary se kat jaata hai\" — NAHI. Employer bhi match karta hai. tankhapuraan.com" },
  { id:7, icon:"📊", cat:"TAX",         verdict:"REGIME BHOOL GAYE",  color:"#C0392B", crowd:"\"80C mein ₹1.5L invest kar diya — tax bach gaya!\"",             cost:"₹15,000–₹46,800/yr", truth:"80C sirf old regime mein kaam karta hai. New regime mein yeh investment tax pe koi farak nahi dalega.", fix:"Pehle regime check karo.", share:"80C ka faida sirf old regime mein milta hai. New regime mein invest kiya aur benefit nahi mila. tankhapuraan.com" },
  { id:8, icon:"🏢", cat:"SALARY",      verdict:"BRAND KA BHOOT",     color:"#7C5CBF", crowd:"\"Badi company hai, toh package achha hi hoga.\"",                cost:"₹2,00,000–₹6,00,000/yr", truth:"MNC brand ke naam pe ₹8L offer karte hain jahan funded startup ₹14L deta hai. Apni market value jaano.", fix:"Market value check karo.", share:"Brand ke naam pe ₹4L+ chhod deta tha. tankhapuraan.com" },
  { id:9, icon:"📅", cat:"TAX",         verdict:"BAHUT DER HO JAATI", color:"#2471A3", crowd:"\"March mein ITR file kar denge, sab sort ho jaayega.\"",          cost:"₹10,000–₹40,000/yr", truth:"Tax planning April mein hoti hai — saal ke shuru mein. March mein sab lock ho chuka hota hai.", fix:"April mein plan karo.", share:"Tax planning March mein nahi — April mein hoti hai. tankhapuraan.com" },
  { id:10,icon:"🏛️", cat:"SALARY",      verdict:"HR TUMHARA DOST NAHI",color:"#2D9B6F",crowd:"\"HR ne bola standard structure hai — sab ka aisa hi hota hai.\"",cost:"₹24,000–₹1,20,000/yr",truth:"HR company ki taraf se negotiate karta hai — tumhari taraf se nahi. Salary structure negotiable hai.",      fix:"Salary slip decode karo.", share:"\"HR ne bola standard hai\" — HR company ke liye kaam karta hai, tumhare liye nahi. tankhapuraan.com" },
];

// ── TAX MATH ──────────────────────────────────────────────────
const SLAB_NEW=[{min:0,max:400000,rate:0},{min:400000,max:800000,rate:.05},{min:800000,max:1200000,rate:.10},{min:1200000,max:1600000,rate:.15},{min:1600000,max:2000000,rate:.20},{min:2000000,max:2400000,rate:.25},{min:2400000,max:Infinity,rate:.30}];
const SLAB_OLD=[{min:0,max:250000,rate:0},{min:250000,max:500000,rate:.05},{min:500000,max:1000000,rate:.20},{min:1000000,max:Infinity,rate:.30}];
function calcTax(inc,slabs){let t=0;for(const s of slabs){if(inc<=s.min)break;t+=(Math.min(inc,s.max)-s.min)*s.rate;}return Math.round(t*1.04);}
function compute(v){
  const ctc=Number(v.salary)||0,hra=Number(v.hra)||0,rent=Number(v.rent)||0;
  const d80c=Math.min(Number(v.d80c)||0,150000),d80d=Math.min(Number(v.d80d)||0,25000),hl=Math.min(Number(v.hl)||0,200000);
  const nT=Math.max(0,ctc-75000),newTax=nT<=1200000?0:calcTax(nT,SLAB_NEW);
  const hraX=Math.max(0,Math.min(hra,rent-.1*ctc,.5*ctc));
  const oT=Math.max(0,ctc-50000-hraX-d80c-d80d-hl),oldTax=oT<=500000?0:calcTax(oT,SLAB_OLD);
  const sav=oldTax-newTax;
  return{ctc,newTax,oldTax,saving:Math.abs(sav),winner:sav>0?"new":sav<0?"old":"equal",hraX,d80c,d80d,hl,takeNew:Math.round((ctc-newTax)/12),takeOld:Math.round((ctc-oldTax)/12)};
}
const ff=n=>"₹"+Number(n).toLocaleString("en-IN");
const fs=n=>n>=100000?`₹${(n/100000).toFixed(1)}L`:n>=1000?`₹${(n/1000).toFixed(0)}K`:`₹${n}`;
const STEP_IDS=["salary","hra","rent","d80c","d80d","hl"];
const EMOJIS=["💼","🏠","🔑","📊","🏥","🏡"];

// ═════════════════════════════════════════════════════════════
// MAIN APP
// ═════════════════════════════════════════════════════════════
export default function TankhaPuraan() {
  const [lang, setLang]         = useState(null);
  const [screen, setScreen]     = useState("home");
  const [step, setStep]         = useState(0);
  const [vals, setVals]         = useState({});
  const [emailStep, setES]      = useState(false);
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [result, setResult]     = useState(null);
  const [ldx, setLdx]           = useState(0);
  const [ai, setAi]             = useState("");
  const [mythOpen, setMythOpen] = useState(null);
  const [mythsDone, setMythsDone] = useState(new Set());
  const [paying, setPaying]     = useState(false);
  const [copied, setCopied]     = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const t   = T[lang] || T.hi;
  const lg  = LANGUAGES.find(l=>l.code===lang) || LANGUAGES[0];
  const isRTL = ["ur","ks","sd"].includes(lang);

  // ── Claude AI insight ──────────────────────────────────────
  async function getAI(r){
    const lname=LANGUAGES.find(l=>l.code===lang)?.name||"Hindi";
    try{
      const resp=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-haiku-4-5",max_tokens:1000,messages:[{role:"user",content:`You are TankhaPuraan AI. User: ${name||"friend"}. CTC ₹${r.ctc.toLocaleString("en-IN")}, New tax ₹${r.newTax.toLocaleString("en-IN")}, Old tax ₹${r.oldTax.toLocaleString("en-IN")}, Better: ${r.winner}, Saving: ₹${r.saving.toLocaleString("en-IN")}. Write 3 sentences in ${lname}${lang==="hi"?" (Hinglish — casual mix)":""}. Warm, specific, like a friend. Tell exactly what to do. No disclaimers.`}]})});
      const d=await resp.json();return d.content?.[0]?.text||"";
    }catch{return"";}
  }

  // ── Submit form ────────────────────────────────────────────
  async function submit(){
    if(!name||!email)return;
    setScreen("loading");
    [0,900,1800,2700,3500].forEach((d,i)=>setTimeout(()=>setLdx(i),d));
    const r=compute(vals);
    const insight=await getAI(r);
    setResult(r);setAi(insight);setScreen("result");
  }

  // ── Razorpay payment (demo) ────────────────────────────────
  async function pay(){
    setPaying(true);
    setTimeout(()=>{setPaying(false);setScreen("success");},2000);
  }

  const prog=((step+1)/STEP_IDS.length)*100;

  // ── SHARED NAV ─────────────────────────────────────────────
  function Nav({showMenu=true}){
    return(
      <div style={S.nav}>
        <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>setScreen("home")}>
          <div style={S.logoIco}>📜</div>
          <div>
            <div style={S.logoT}>TankhaPuraan</div>
            <div style={S.logoS}>{t.tag}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {lang&&<button style={S.langBtn} onClick={()=>setLang(null)}>{lg.native} ▾</button>}
          {showMenu&&(
            <button style={S.menuBtn} onClick={()=>setMenuOpen(p=>!p)}>☰</button>
          )}
        </div>
        {menuOpen&&(
          <div style={S.menuDrop}>
            {[{label:"🏠 Home",sc:"home"},{label:"⚖️ Tax Calculator",sc:"form"},{label:"⚡ Myth Breaker",sc:"myths"},{label:"📜 About",sc:"about"}].map(m=>(
              <button key={m.sc} style={S.menuItem} onClick={()=>{setScreen(m.sc);setMenuOpen(false);}}>{m.label}</button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════
  // SCREEN: LANGUAGE SELECT
  // ══════════════════════════════════════════════════════════
  if(!lang) return(
    <div style={S.root}><style>{CSS}</style>
      <div style={S.langPage}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:52,marginBottom:10}}>📜</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:24,fontWeight:700,color:"#2C2416"}}>TankhaPuraan</div>
          <div style={{fontSize:10,color:"#B8A990",letterSpacing:2,textTransform:"uppercase",marginTop:2}}>The Holy Scripture of Your Salary</div>
        </div>
        <h2 style={{fontFamily:"Georgia,serif",fontSize:19,color:"#2C2416",textAlign:"center",marginBottom:6}}>अपनी भाषा चुनो · Choose Your Language</h2>
        <p style={{fontSize:13,color:"#8B7355",textAlign:"center",marginBottom:24,lineHeight:1.6}}>जो भाषा दिल के करीब हो — वही चुनो</p>
        <div style={S.langGrid}>
          {LANGUAGES.map(l=>(
            <button key={l.code} className="lang-btn" onClick={()=>{setLang(l.code);setScreen("home");}} style={{borderColor:l.color+"44",direction:["ur","ks","sd"].includes(l.code)?"rtl":"ltr"}}>
              <div style={{fontSize:19,fontWeight:700,color:"#2C2416",marginBottom:2}}>{l.native}</div>
              <div style={{fontSize:11,color:"#8B7355"}}>{l.name}</div>
              <div style={{fontSize:10,color:l.color,fontWeight:600,marginTop:2}}>{l.region}</div>
            </button>
          ))}
        </div>
        <p style={{textAlign:"center",fontSize:11,color:"#B8A990",marginTop:12}}>🇮🇳 22 Scheduled Languages · 8th Schedule of Constitution of India</p>
        <p style={{textAlign:"center",fontSize:10,color:"#D4C4A8",marginTop:8}}>A product of Artha Technologies Pvt Ltd 🇮🇳</p>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════
  // SCREEN: HOME
  // ══════════════════════════════════════════════════════════
  if(screen==="home") return(
    <div style={{...S.root,direction:isRTL?"rtl":"ltr"}}><style>{CSS}</style>
      <Nav/>
      <div style={S.wrap}>
        {/* Hero */}
        <div className="anim-1" style={{...S.heroBox,borderTopColor:lg.color}}>
          <div style={{...S.badge,color:lg.color,background:lg.color+"15",borderColor:lg.color+"33"}}>{t.badge}</div>
          <h1 style={S.h1}>{t.h1a}<br/><span style={{color:lg.color}}>{t.h1b}</span></h1>
          <p style={S.sub}>{t.sub}</p>
        </div>

        {/* Pain cards */}
        <div className="anim-2">
          {t.pains.map((p,i)=>(
            <div key={i} style={{...S.painCard,borderLeftColor:lg.color}}>
              <span style={{fontSize:20,flexShrink:0}}>{["😮‍💨","😤","🤔"][i]}</span>
              <p style={S.painTxt}>{p}</p>
            </div>
          ))}
        </div>

        {/* Myth teaser */}
        <div className="anim-2" style={S.mythTeaser} onClick={()=>setScreen("myths")}>
          <span style={{fontSize:22}}>⚡</span>
          <div style={{flex:1}}>
            <div style={{fontSize:12,fontWeight:700,color:"#E07B39",letterSpacing:1,marginBottom:3}}>BHEED KI GALTI</div>
            <div style={{fontSize:14,color:"#2C2416",fontWeight:600}}>10 myths salaried India blindly follow — kya tum bhi?</div>
          </div>
          <span style={{color:"#E07B39",fontWeight:700}}>→</span>
        </div>

        {/* CTA */}
        <button className="anim-3 btn-p" style={{background:lg.color}} onClick={()=>{setStep(0);setVals({});setES(false);setScreen("form");}}>
          {t.cta}
        </button>
        <p style={S.safeNote}>{t.safe}</p>

        {/* Tools grid */}
        <div style={{marginTop:28}}>
          <div style={S.secT}>5 Tools — Salaried India Ke Liye</div>
          {[
            {e:"⚖️",n:"Tax Regime Calculator",p:"FREE",c:"#2D9B6F",sc:"form"},
            {e:"📄",n:"Salary Slip Decoder",p:"₹99",c:"#E07B39",sc:"coming"},
            {e:"🔍",n:"Am I Underpaid?",p:"₹149",c:"#7C5CBF",sc:"coming"},
            {e:"🗣️",n:"Negotiation Script",p:"₹199",c:"#C0392B",sc:"coming"},
            {e:"📅",n:"Monthly Money Planner",p:"₹199/mo",c:"#2471A3",sc:"coming"},
          ].map((tool,i)=>(
            <div key={i} style={S.toolRow} onClick={()=>{if(tool.sc!=="coming")setScreen(tool.sc);}}>
              <span style={{fontSize:22}}>{tool.e}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:700,color:"#2C2416"}}>{tool.n}</div>
                {tool.sc==="coming"&&<div style={{fontSize:11,color:"#B8A990"}}>Coming soon</div>}
              </div>
              <div style={{fontSize:13,fontWeight:700,color:tool.c,background:tool.c+"15",padding:"4px 10px",borderRadius:20}}>{tool.p}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={S.footer}>
          <div style={{fontSize:12,color:"#B8A990"}}>A product of Artha Technologies Pvt Ltd</div>
          <div style={{fontSize:11,color:"#D4C4A8",marginTop:2}}>Built by a Proud Indian 🇮🇳</div>
          <div style={{fontSize:11,color:"#D4C4A8",marginTop:2}}>hello@tankhapuraan.com</div>
        </div>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════
  // SCREEN: MYTH BREAKER
  // ══════════════════════════════════════════════════════════
  if(screen==="myths"){
  const t = T[lang] || T.hi;
  return(
    <div style={S.root}><style>{CSS}</style>
      <Nav/>
      <div style={S.wrap}>
        <div style={{textAlign:"center",padding:"20px 0 16px"}}>
          <div style={{fontSize:36,marginBottom:8}}>⚡</div>
          <h2 style={{fontFamily:"Georgia,serif",fontSize:24,color:"#2C2416",marginBottom:6}}>Bheed ki Galti</h2>
          <p style={{fontSize:13,color:"#8B7355",lineHeight:1.6,marginBottom:4}}>10 myths. Sab galat hain. Har ek ke neeche paisa doob raha hai.</p>
          {/* Temple story */}
          <div style={{background:"#FFF8F3",border:"1px solid #F5D5BA",borderRadius:12,padding:"14px 16px",marginTop:12,textAlign:"left"}}>
            <span style={{fontSize:16}}>🛕</span>
            <p style={{fontSize:13,color:"#6B5740",lineHeight:1.65,fontStyle:"italic",marginTop:6}}>
              "Maine Shani temple mein pooja ki — rituals pata nahi the. Toh jo aage wala kar raha tha, wahi kiya. Blindly. Yahi karte hain hum apni salary ke saath bhi."
            </p>
            <p style={{fontSize:11,color:"#B8A990",marginTop:6}}>— Founder, TankhaPuraan · A Proud Indian 🇮🇳</p>
          </div>
        </div>

        {/* Progress */}
        <div style={{background:"white",border:"1px solid #EEE5D6",borderRadius:12,padding:"12px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:12}}>
          <div style={{flex:1}}>
            <div style={{height:6,background:"#EEE5D6",borderRadius:3,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${(mythsDone.size/MYTHS.length)*100}%`,background:"#E07B39",transition:"width 0.4s"}}/>
            </div>
          </div>
          <div style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700,color:"#E07B39",flexShrink:0}}>{mythsDone.size}/{MYTHS.length}</div>
        </div>

        {/* Myth cards */}
        {MYTHS.map(myth=>(
          <div key={myth.id} style={{background:mythOpen===myth.id?myth.color+"0A":"white",border:`2px solid ${mythOpen===myth.id?myth.color:"#EEE5D6"}`,borderRadius:16,marginBottom:12,overflow:"hidden",cursor:"pointer",transition:"all 0.25s"}}
            onClick={()=>{setMythOpen(p=>p===myth.id?null:myth.id);setMythsDone(p=>new Set([...p,myth.id]));}}>
            <div style={{height:3,background:myth.color,opacity:mythOpen===myth.id?1:0,transition:"opacity 0.2s"}}/>
            <div style={{padding:"16px 18px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                    <span style={{fontSize:22}}>{myth.icon}</span>
                    <span style={{fontSize:10,fontWeight:700,color:myth.color,background:myth.color+"15",border:`1px solid ${myth.color}33`,padding:"2px 8px",borderRadius:20,letterSpacing:1}}>{myth.verdict} ✗</span>
                  </div>
                  <p style={{fontFamily:"Georgia,serif",fontSize:14,fontStyle:"italic",color:"#8B7355",borderLeft:`3px solid ${myth.color}`,paddingLeft:10,lineHeight:1.6}}>{myth.crowd}</p>
                </div>
                <div style={{background:"#FFF5F5",border:"1px solid #F5C6C0",borderRadius:8,padding:"6px 10px",textAlign:"center",flexShrink:0}}>
                  <div style={{fontSize:8,color:"#C0392B",fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>COST</div>
                  <div style={{fontFamily:"Georgia,serif",fontSize:12,fontWeight:700,color:"#C0392B"}}>{myth.cost}</div>
                </div>
              </div>
            </div>
            {mythOpen===myth.id&&(
              <div style={{padding:"0 18px 18px"}}>
                <div style={{borderTop:`1px solid ${myth.color}22`,paddingTop:14}}>
                  <div style={{background:"white",border:`1px solid ${myth.color}33`,borderLeft:`3px solid ${myth.color}`,borderRadius:10,padding:"12px 14px",marginBottom:10}}>
                    <div style={{fontSize:9,fontWeight:700,color:myth.color,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>SACHAI</div>
                    <p style={{fontSize:13,color:"#4A3728",lineHeight:1.7}}>{myth.truth}</p>
                  </div>
                  <div style={{background:"#2C2416",borderRadius:10,padding:"10px 14px",marginBottom:12}}>
                    <p style={{fontSize:12,color:"#D4C4A8"}}>💡 {myth.fix}</p>
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <button className="btn-p" style={{flex:1,background:myth.color,fontSize:13,padding:"10px"}} onClick={e=>{e.stopPropagation();setScreen("form");}}>
                      {myth.id===2?"Free Mein Check Karo →":"Tool Use Karo →"}
                    </button>
                    <button style={{background:"white",border:"1.5px solid #D4C4A8",borderRadius:10,padding:"10px 12px",fontSize:12,fontWeight:700,color:"#6B5740",cursor:"pointer",flexShrink:0}} onClick={e=>{e.stopPropagation();navigator.clipboard?.writeText(myth.share+" #TankhaPuraan #BheedKiGalti");setCopied(myth.id);setTimeout(()=>setCopied(null),2000);}}>
                      {copied===myth.id?"✅":"📲"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        <button className="btn-p" onClick={()=>setScreen("form")}>Tax Regime Free Mein Check Karo →</button>
        <div style={S.footer}><div style={{fontSize:11,color:"#B8A990"}}>Artha Technologies Pvt Ltd · Built by a Proud Indian 🇮🇳</div></div>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════
  // SCREEN: FORM (Tax Calculator)
  // ══════════════════════════════════════════════════════════
  if(screen==="form") return(
    <div style={{...S.root,direction:isRTL?"rtl":"ltr"}}><style>{CSS}</style>
      <div style={{height:4,background:"#EEE5D6",position:"sticky",top:0,zIndex:10}}>
        <div style={{height:"100%",width:`${prog}%`,background:lg.color,transition:"width 0.4s",borderRadius:2}}/>
      </div>
      <div style={S.wrap}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,paddingTop:8}}>
          <button style={S.backBtn} onClick={()=>step===0?setScreen("home"):emailStep?setES(false):setStep(s=>s-1)}>← Back</button>
          <button style={{...S.langBtn,color:lg.color}} onClick={()=>setLang(null)}>{lg.native} ▾</button>
        </div>

        {!emailStep?(
          <>
            <div style={{marginBottom:22}}>
              <div style={{fontSize:36,marginBottom:10}}>{EMOJIS[step]}</div>
              <h2 style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,color:"#2C2416",marginBottom:5}}>{t.labels[step]}</h2>
              <p style={{fontSize:13,color:"#8B7355",lineHeight:1.6}}>{t.hints[step]}</p>
            </div>
            <div style={S.inpRow}>
              <span style={{...S.pre,color:lg.color}}>₹</span>
              <input style={S.inp} type="number" placeholder={t.ph[step]} value={vals[STEP_IDS[step]]||""} onChange={e=>setVals(v=>({...v,[STEP_IDS[step]]:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&(step<STEP_IDS.length-1?setStep(s=>s+1):setES(true))} autoFocus/>
            </div>
            {STEP_IDS[step]==="salary"&&(
              <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:12}}>
                {[400000,600000,800000,1200000,1800000].map(v=>(
                  <button key={v} className="btn-q" style={{background:vals.salary===v?lg.color:"#F5EDE0",color:vals.salary===v?"white":"#6B5740"}} onClick={()=>setVals(p=>({...p,salary:v}))}>{fs(v)}</button>
                ))}
              </div>
            )}
            {STEP_IDS[step]!=="salary"&&(
              <button style={S.skipB} onClick={()=>{setVals(v=>({...v,[STEP_IDS[step]]:0}));step<STEP_IDS.length-1?setStep(s=>s+1):setES(true);}}>
                {t.skip}
              </button>
            )}
            <button className="btn-p" style={{background:lg.color,opacity:vals[STEP_IDS[step]]?1:0.5}} onClick={()=>step<STEP_IDS.length-1?setStep(s=>s+1):setES(true)}>
              {step===STEP_IDS.length-1?t.calc:t.next}
            </button>
            <div style={{display:"flex",gap:6,justifyContent:"center",marginTop:20}}>
              {STEP_IDS.map((_,i)=><div key={i} style={{width:7,height:7,borderRadius:4,background:i<=step?lg.color:"#EEE5D6",transition:"background 0.3s"}}/>)}
            </div>
          </>
        ):(
          <>
            <div style={{marginBottom:22}}>
              <div style={{fontSize:36,marginBottom:10}}>📬</div>
              <h2 style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,color:"#2C2416",marginBottom:5}}>{t.eTitle}</h2>
              <p style={{fontSize:13,color:"#8B7355"}}>{t.eHint}</p>
            </div>
            <input style={{...S.inp,paddingLeft:14,marginBottom:10,border:"2px solid #D4C4A8",borderRadius:12}} type="text" placeholder={t.eName} value={name} onChange={e=>setName(e.target.value)}/>
            <input style={{...S.inp,paddingLeft:14,marginBottom:18,border:"2px solid #D4C4A8",borderRadius:12}} type="email" placeholder={t.eEmail} value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()}/>
            <button className="btn-p" style={{background:lg.color,opacity:name&&email?1:0.5}} onClick={submit}>{t.eBtn}</button>
            <p style={{fontSize:11,color:"#B8A990",textAlign:"center",marginTop:10}}>{t.eSafe}</p>
          </>
        )}
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════
  // SCREEN: LOADING
  // ══════════════════════════════════════════════════════════
  if(screen==="loading") return(
    <div style={S.root}><style>{CSS}</style>
      <div style={{maxWidth:480,margin:"0 auto",padding:"80px 20px",textAlign:"center"}}>
        <div style={{fontSize:52,marginBottom:20,display:"inline-block",animation:"spin 2s linear infinite"}}>📜</div>
        <h2 style={{fontFamily:"Georgia,serif",fontSize:20,color:"#2C2416",marginBottom:14}}>{t.lTitle}</h2>
        <p style={{fontSize:14,color:"#8B7355",marginBottom:20,minHeight:22}}>{t.lLines[ldx]}</p>
        <div style={{height:5,background:"#EEE5D6",borderRadius:3,overflow:"hidden",maxWidth:260,margin:"0 auto"}}>
          <div style={{height:"100%",background:lg.color,borderRadius:3}} className="loading-fill"/>
        </div>
        <p style={{fontSize:12,color:"#B8A990",marginTop:16}}>{t.lSub}</p>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════
  // SCREEN: RESULT
  // ══════════════════════════════════════════════════════════
  if(screen==="result"&&result){
    const t = T[lang] || T.hi;
    const{winner,saving,newTax,oldTax,takeNew,takeOld,ctc}=result;
    const wc=winner==="new"?"#2D9B6F":winner==="old"?"#2471A3":"#8B7355";
    const wLabel=winner==="new"?t.rNew:winner==="old"?t.rOld:"Equal";
    return(
      <div style={{...S.root,direction:isRTL?"rtl":"ltr"}}><style>{CSS}</style>
        <Nav/>
        <div style={S.wrap}>
          {/* Winner */}
          <div style={{background:wc+"0D",border:`2px solid ${wc}`,borderRadius:18,padding:22,marginBottom:14,textAlign:"center"}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:2,color:wc,marginBottom:6}}>{t.rBetter}</div>
            <div style={{fontFamily:"Georgia,serif",fontSize:26,fontWeight:700,color:wc,marginBottom:10}}>{wLabel} ✅</div>
            {saving>0&&(
              <div style={{background:"#F0FBF6",border:"1px solid #B8E8D0",borderRadius:10,padding:"10px 14px",fontSize:14}}>
                {t.rSaving} <strong style={{color:"#2D9B6F"}}>{ff(saving)}{t.rYear}</strong>
                {" = "}<span style={{color:"#2D9B6F"}}>{ff(Math.round(saving/12))}{t.rMonth}</span>
              </div>
            )}
          </div>

          {/* AI insight */}
          {ai&&(
            <div style={{background:"#FFF8F3",border:"1.5px solid #F5D5BA",borderRadius:14,padding:18,marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <span style={{fontSize:18}}>🤖</span>
                <span style={{fontSize:10,fontWeight:700,color:lg.color,letterSpacing:1}}>{t.rAI}</span>
              </div>
              <p style={{fontSize:14,color:"#4A3728",lineHeight:1.75}}>{ai}</p>
            </div>
          )}

          {/* Which myth were you living? */}
          <div style={{background:"#2C2416",borderRadius:14,padding:18,marginBottom:14,cursor:"pointer"}} onClick={()=>setScreen("myths")}>
            <div style={{fontSize:10,fontWeight:700,color:"#E07B39",letterSpacing:2,marginBottom:8}}>BHEED KI GALTI — KYA YAHI SOCH THE TUM?</div>
            <p style={{fontFamily:"Georgia,serif",fontStyle:"italic",fontSize:14,color:"#D4C4A8",lineHeight:1.65}}>
              {winner==="new"
                ?"\"Mere colleague ne old regime rakha toh main bhi.\" — Aap shayad yeh soch rahe the. TankhaPuraan ne pakda."
                :"\"CA hai, woh dekh lega.\" — April mein tum khud decide karte ho. Ab pata chal gaya."}
            </p>
            <div style={{fontSize:12,color:"#E07B39",marginTop:8}}>Baaki 10 myths dekho → ⚡</div>
          </div>

          {/* Compare */}
          <div style={{background:"white",border:"1.5px solid #EEE5D6",borderRadius:14,padding:18,marginBottom:14}}>
            <div style={S.secT}>{t.rCompare}</div>
            <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #F5EDE0",marginBottom:14}}>
              <span style={{fontSize:13,color:"#8B7355"}}>{t.rCTC}</span>
              <span style={{fontSize:13,fontWeight:700}}>{ff(ctc)}</span>
            </div>
            <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:12}}>
              {[{lbl:t.rNew,tax:newTax,take:takeNew,isW:winner==="new",c:"#2D9B6F"},{lbl:t.rOld,tax:oldTax,take:takeOld,isW:winner==="old",c:"#2471A3"}].map((rg,i)=>(
                <div key={i} style={{flex:1,textAlign:"center"}}>
                  <div style={{background:rg.isW?rg.c:"#F5EDE0",color:rg.isW?"white":"#8B7355",fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:20,marginBottom:6,display:"inline-block"}}>{rg.lbl}{rg.isW?" ✅":""}</div>
                  <div style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700}}>{ff(rg.tax)}</div>
                  <div style={{fontSize:10,color:"#B8A990",marginBottom:4}}>{t.rTax}</div>
                  <div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700,color:"#2D9B6F"}}>{ff(rg.take)}</div>
                  <div style={{fontSize:10,color:"#B8A990"}}>{t.rInHand}</div>
                </div>
              ))}
            </div>
            {saving>0&&<div style={{background:"#F0FBF6",border:"1px solid #B8E8D0",borderRadius:8,padding:10,fontSize:12}}>💰 {t.rSaving}: <strong>{ff(saving)}{t.rYear}</strong></div>}
          </div>

          {/* PDF Upsell */}
          <div style={{background:"#2C2416",borderRadius:18,padding:22,marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700,color:"#FBF7F0",flex:1}}>{t.rUTitle}</div>
              <div style={{fontFamily:"Georgia,serif",fontSize:24,fontWeight:700,color:lg.color,marginLeft:10}}>₹199</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:14}}>
              {["✅ Full breakdown","✅ Action steps","✅ HR portal guide","✅ PDF to share"].map((f,i)=><div key={i} style={{fontSize:12,color:"#D4C4A8"}}>{f}</div>)}
            </div>
            <button className="btn-p" style={{background:lg.color,marginBottom:4}} onClick={()=>setScreen("payment")}>{t.rUBtn}</button>
            <p style={{fontSize:10,color:"#6B5740",textAlign:"center"}}>Razorpay · UPI / Card / Net Banking</p>
          </div>

          {/* Share */}
          <div style={{background:"white",border:"1.5px solid #EEE5D6",borderRadius:14,padding:18,marginBottom:14,textAlign:"center"}}>
            <p style={{fontSize:13,color:"#6B5740",marginBottom:10}}>{t.rShare}</p>
            <button className="btn-g" onClick={()=>{navigator.clipboard?.writeText(`Maine TankhaPuraan pe tax regime check kiya — ${wLabel} mujhare liye better hai${saving>0?`, aur ${ff(saving)} bachaunga`:""} is saal. Free mein check karo: tankhapuraan.com 🙏`);setCopied("share");setTimeout(()=>setCopied(null),2000);}}>
              {copied==="share"?"✅ Copied!":t.rShareBtn}
            </button>
          </div>

          <button style={{background:"none",border:"none",fontSize:12,color:"#B8A990",cursor:"pointer",display:"block",margin:"0 auto",textDecoration:"underline"}}
            onClick={()=>{setScreen("home");setVals({});setStep(0);setES(false);setResult(null);}}>
            {t.rRecalc}
          </button>
          <div style={S.footer}><div style={{fontSize:11,color:"#B8A990"}}>Artha Technologies Pvt Ltd · Built by a Proud Indian 🇮🇳</div></div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════
  // SCREEN: PAYMENT
  // ══════════════════════════════════════════════════════════
  if(screen==="payment"){
  const t = T[lang] || T.hi;
  return(
    <div style={S.root}><style>{CSS}</style>
      <div style={S.nav}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={S.logoIco}>📜</div>
          <div style={S.logoT}>TankhaPuraan</div>
        </div>
        <div style={{fontSize:12,fontWeight:600,color:"#2D9B6F",background:"#F0FBF6",border:"1px solid #B8E8D0",borderRadius:20,padding:"4px 12px"}}>🔒 Secure Checkout</div>
      </div>
      <div style={S.wrap}>
        {/* Result recap */}
        {result&&(
          <div style={{background:"#2C2416",borderRadius:14,padding:18,marginBottom:20}}>
            <div style={{fontSize:10,fontWeight:700,color:"#E07B39",letterSpacing:2,marginBottom:12}}>AAPKA FREE RESULT</div>
            <div style={{display:"flex",gap:0}}>
              {[{l:"Better Regime",v:(result.winner==="new"?t.rNew:t.rOld)+" ✅"},{l:"Annual Saving",v:ff(result.saving),c:"#2D9B6F"},{l:"In-Hand/Month",v:ff(result.winner==="new"?result.takeNew:result.takeOld)}].map((s,i)=>(
                <div key={i} style={{flex:1,textAlign:"center",borderRight:i<2?"1px solid #3A3025":"none",padding:"0 6px"}}>
                  <div style={{fontSize:9,color:"#8B7355",marginBottom:3}}>{s.l}</div>
                  <div style={{fontFamily:"Georgia,serif",fontSize:14,fontWeight:700,color:s.c||"#FBF7F0"}}>{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* What you get */}
        <div style={S.secT}>PDF Report Mein Kya Milega?</div>
        {[{e:"📊",t:"Complete Regime Breakdown",d:"Old vs New — every rupee explained"},{e:"✅",t:"3 Action Steps for This FY",d:"Exactly what to tell your HR"},{e:"🏢",t:"HR Portal Guide",d:"Step-by-step switch instructions"},{e:"💡",t:"Tax Saving Tips",d:"What to do before March 31"},{e:"📅",t:"Next Year Planning",d:"FY 2026-27 investment roadmap"},{e:"🔏",t:"Professional Format",d:"Shareable with CA or HR"}].map((f,i)=>(
          <div key={i} style={{background:"white",border:"1px solid #EEE5D6",borderRadius:12,padding:"12px 14px",marginBottom:8,display:"flex",gap:10,alignItems:"flex-start"}}>
            <span style={{fontSize:20,flexShrink:0}}>{f.e}</span>
            <div><div style={{fontSize:13,fontWeight:700,color:"#2C2416",marginBottom:2}}>{f.t}</div><div style={{fontSize:12,color:"#8B7355"}}>{f.d}</div></div>
          </div>
        ))}

        {/* Price */}
        <div style={{background:"white",border:`2px solid ${lg.color}`,borderRadius:14,padding:18,marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:12,color:"#B8A990",textDecoration:"line-through",marginBottom:3}}>CA fee: ₹2,000–₹5,000</div>
            <div style={{fontSize:16,fontWeight:700,color:"#2C2416"}}>TankhaPuraan PDF Report</div>
            <div style={{fontSize:11,color:"#8B7355"}}>One-time · Instant · No subscription</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontFamily:"Georgia,serif",fontSize:34,fontWeight:700,color:lg.color}}>₹199</div>
            <div style={{fontSize:10,color:"#B8A990"}}>incl. GST</div>
          </div>
        </div>

        {/* ROI nudge */}
        {result?.saving>0&&(
          <div style={{background:"#F0FBF6",border:"1px solid #B8E8D0",borderRadius:10,padding:"12px 14px",marginBottom:16,display:"flex",gap:10,alignItems:"flex-start"}}>
            <span style={{fontSize:18}}>💡</span>
            <p style={{fontSize:13,color:"#2C2416",lineHeight:1.6}}>Aap iss report se <strong style={{color:"#2D9B6F"}}>{ff(result.saving)}</strong> bachayenge. Report ki cost <strong>pehli week mein wapas.</strong></p>
          </div>
        )}

        {/* Pay button */}
        <button className="btn-p" style={{background:paying?"#B8A990":lg.color,boxShadow:`0 4px 20px ${lg.color}30`}} onClick={pay} disabled={paying}>
          {paying?(
            <span style={{display:"flex",alignItems:"center",gap:10,justifyContent:"center"}}>
              <span className="spinner"/>Payment process ho rahi hai...
            </span>
          ):"₹199 Mein PDF Report Lo → UPI / Card / Net Banking"}
        </button>

        {/* Payment methods */}
        <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"center",margin:"10px 0"}}>
          {["UPI","GPay","PhonePe","Paytm","Card","Net Banking"].map(m=>(
            <div key={m} style={{background:"white",border:"1px solid #EEE5D6",borderRadius:8,padding:"3px 8px",fontSize:11,color:"#6B5740"}}>{m}</div>
          ))}
        </div>

        {/* Trust */}
        <div style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center",marginBottom:16}}>
          {["🔒 256-bit SSL","✅ Razorpay","📧 Instant Email","↩️ 7-day Refund"].map(t=>(
            <div key={t} style={{fontSize:11,color:"#8B7355"}}>{t}</div>
          ))}
        </div>

        <button style={{background:"none",border:"none",fontSize:12,color:"#B8A990",cursor:"pointer",display:"block",margin:"0 auto",textDecoration:"underline"}} onClick={()=>setScreen("result")}>
          Abhi nahi, result pe wapas jao
        </button>
        <div style={S.footer}><div style={{fontSize:11,color:"#B8A990"}}>Artha Technologies Pvt Ltd · Built by a Proud Indian 🇮🇳</div></div>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════
  // SCREEN: SUCCESS
  // ══════════════════════════════════════════════════════════
  }

  // ══════════════════════════════════════════════════════════
  // SCREEN: SUCCESS
  if(screen==="success"){
  const t = T[lang] || T.hi;
  return(
    <div style={S.root}><style>{CSS}</style>
      <Nav showMenu={false}/>
      <div style={S.wrap}>
        <div style={{textAlign:"center",padding:"28px 0 20px"}}>
          <div style={{fontSize:60,marginBottom:14}} className="tick-anim">✅</div>
          <h1 style={{fontFamily:"Georgia,serif",fontSize:26,fontWeight:700,color:"#2D9B6F",marginBottom:8}}>Payment Ho Gayi!</h1>
          <p style={{fontSize:15,color:"#6B5740",lineHeight:1.65}}>{name}, aapki report tayyar ho rahi hai.<br/>2 minute mein {email} pe aa jaayegi.</p>
        </div>

        {/* Next steps */}
        <div style={{background:"white",border:"1.5px solid #EEE5D6",borderRadius:14,padding:18,marginBottom:14}}>
          <div style={S.secT}>Aage Kya Hoga?</div>
          {[{e:"📧",t:"2 minutes mein",d:`PDF ${email} pe bhej di jaayegi`},{e:"📄",t:"Abhi",d:"Download button neeche hai"},{e:"🏢",t:"Kal tak",d:`HR ko batao — ${result?.winner==="new"?t.rNew:t.rOld} choose karo`},{e:"💰",t:"Is saal",d:`${result?.saving>0?ff(result.saving)+" bachao":"Smart decision liya"}`,}].map((s,i)=>(
            <div key={i} style={{display:"flex",gap:12,alignItems:"center",padding:"10px 0",borderBottom:"1px solid #F5EDE0"}}>
              <span style={{fontSize:20,flexShrink:0}}>{s.e}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:10,fontWeight:700,color:lg.color,textTransform:"uppercase",letterSpacing:1,marginBottom:2}}>{s.t}</div>
                <div style={{fontSize:13,color:"#4A3728"}}>{s.d}</div>
              </div>
              <span style={{color:"#2D9B6F",fontWeight:700}}>✓</span>
            </div>
          ))}
        </div>

        {/* Download */}
        <button className="btn-p" style={{background:"#2D9B6F",marginBottom:14}}>📥 PDF Report Download Karo</button>

        {/* Share nudge — viral moment */}
        <div style={{background:"#2C2416",borderRadius:16,padding:20,marginBottom:14}}>
          <div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700,color:"#FBF7F0",marginBottom:8}}>🎉 Kisi dost ko bhi batao?</div>
          <p style={{fontSize:13,color:"#8B7355",lineHeight:1.6,marginBottom:12}}>Ek message se kisi ka ₹20,000+ bach sakta hai.</p>
          <div style={{background:"#3A3025",borderRadius:10,padding:"12px 14px",marginBottom:10,display:"flex",gap:10,alignItems:"flex-start"}}>
            <p style={{fontSize:12,color:"#D4C4A8",lineHeight:1.6,flex:1,fontStyle:"italic"}}>"Yaar maine TankhaPuraan use kiya — bata diya ki old regime ya new regime mere liye kaun sa better hai. Bilkul free hai. Tu bhi try kar: tankhapuraan.com 🙏"</p>
            <button style={{background:"#E07B39",color:"white",border:"none",borderRadius:8,padding:"6px 10px",fontSize:11,fontWeight:700,cursor:"pointer",flexShrink:0}} onClick={()=>{navigator.clipboard?.writeText("Yaar maine TankhaPuraan use kiya — bata diya ki old regime ya new regime mere liye kaun sa better hai. Bilkul free hai. Tu bhi try kar: tankhapuraan.com 🙏");setCopied("viral");setTimeout(()=>setCopied(null),2000);}}>
              {copied==="viral"?"✅":"📋"}
            </button>
          </div>
          <button className="whatsapp-btn">📲 WhatsApp Pe Share Karo</button>
        </div>

        {/* Other tools */}
        <div style={S.secT}>Aur Kya Jaanna Chahoge?</div>
        {[{e:"📄",n:"Salary Slip Decoder",d:"Har line ka matlab samjho",p:"₹99"},{e:"🔍",n:"Am I Underpaid?",d:"Market mein teri value kya hai",p:"₹149"},{e:"🗣️",n:"Negotiation Script",d:"Appraisal mein sahi bolo",p:"₹199"}].map((tool,i)=>(
          <div key={i} style={{...S.toolRow,cursor:"default"}}>
            <span style={{fontSize:22}}>{tool.e}</span>
            <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700,color:"#2C2416"}}>{tool.n}</div><div style={{fontSize:12,color:"#8B7355"}}>{tool.d}</div></div>
            <div style={{fontSize:12,fontWeight:700,color:"#E07B39",background:"#FFF4EC",padding:"4px 10px",borderRadius:20}}>{tool.p}</div>
          </div>
        ))}

        <div style={S.footer}><div style={{fontSize:11,color:"#B8A990"}}>Artha Technologies Pvt Ltd · Built by a Proud Indian 🇮🇳</div></div>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════
  // SCREEN: ABOUT
  // ══════════════════════════════════════════════════════════
  if(screen==="about"){
  const t = T[lang] || T.hi;
  return(
    <div style={S.root}><style>{CSS}</style>
      <Nav/>
      <div style={S.wrap}>
        <div style={{textAlign:"center",padding:"24px 0 20px"}}>
          <div style={{fontSize:52,marginBottom:12}}>📜</div>
          <h1 style={{fontFamily:"Georgia,serif",fontSize:26,fontWeight:700,color:"#2C2416",marginBottom:6}}>TankhaPuraan</h1>
          <div style={{fontSize:12,color:"#B8A990",letterSpacing:2,textTransform:"uppercase"}}>The Holy Scripture of Your Salary</div>
        </div>

        <div style={{background:"#FFF8F3",border:"1.5px solid #F5D5BA",borderTop:"4px solid #E07B39",borderRadius:16,padding:"22px",marginBottom:16}}>
          <div style={S.secT}>Our Story</div>
          <p style={{fontSize:14,color:"#4A3728",lineHeight:1.85}}>
            TankhaPuraan was built by a salaried Indian who spent years watching colleagues confuse their CTC with take-home, blindly follow tax decisions, and never negotiate a single offer.
            <br/><br/>
            Like visiting a temple without knowing the rituals — just following the crowd. That's how most salaried Indians handle their own money.
            <br/><br/>
            <strong>TankhaPuraan is the myth-breaker.</strong> The one tool that stands firmly on the employee's side — always.
          </p>
        </div>

        <div style={{background:"#2C2416",borderRadius:16,padding:"22px",marginBottom:16,textAlign:"center"}}>
          <div style={{fontFamily:"Georgia,serif",fontSize:20,color:"#FBF7F0",marginBottom:6}}>Built by a Proud Indian</div>
          <div style={{fontSize:40,marginBottom:8}}>🇮🇳</div>
          <div style={{fontSize:13,color:"#8B7355",lineHeight:1.7}}>No founder name. No personal brand.<br/>Just the work. Just the truth.</div>
        </div>

        <div style={{background:"white",border:"1.5px solid #EEE5D6",borderRadius:16,padding:"22px",marginBottom:16}}>
          <div style={S.secT}>Our Values</div>
          {[{e:"⚖️",t:"Legal & Legitimate",d:"Everything we build follows the law. No shortcuts. No grey areas."},
            {e:"❤️",t:"Employee First. Always.",d:"We stand on the employee's side. Every feature. Every word. Every time."},
            {e:"🔍",t:"Solve What Others Escape",d:"The problems that are too uncomfortable for others — that's our territory."},
            {e:"🌱",t:"Ethical by Design",d:"No dark patterns. No misleading copy. No hidden charges. Ever."}].map((v,i)=>(
            <div key={i} style={{display:"flex",gap:12,padding:"12px 0",borderBottom:"1px solid #F5EDE0",alignItems:"flex-start"}}>
              <span style={{fontSize:22,flexShrink:0}}>{v.e}</span>
              <div><div style={{fontSize:14,fontWeight:700,color:"#2C2416",marginBottom:3}}>{v.t}</div><div style={{fontSize:13,color:"#6B5740",lineHeight:1.6}}>{v.d}</div></div>
            </div>
          ))}
        </div>

        <div style={{background:"#FBF7F0",border:"1px solid #EEE5D6",borderRadius:14,padding:"18px",marginBottom:16,textAlign:"center"}}>
          <div style={S.secT}>A Product of</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,color:"#2C2416",marginBottom:4}}>Artha Technologies Pvt Ltd</div>
          <div style={{fontSize:13,color:"#8B7355",marginBottom:4}}>अर्थ — Meaning + Prosperity</div>
          <div style={{fontSize:12,color:"#B8A990"}}>hello@tankhapuraan.com</div>
        </div>

        <div style={S.footer}><div style={{fontSize:11,color:"#B8A990"}}>© 2026 Artha Technologies Pvt Ltd · Built by a Proud Indian 🇮🇳</div></div>
      </div>
    </div>
  );

  return null;
}

// ── STYLES ────────────────────────────────────────────────────
const S={
  root:    {fontFamily:"'Hind','Segoe UI',sans-serif",background:"#FBF7F0",minHeight:"100vh",color:"#2C2416"},
  langPage:{maxWidth:520,margin:"0 auto",padding:"36px 20px 52px"},
  langGrid:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14},
  nav:     {background:"white",borderBottom:"1px solid #EEE5D6",padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",top:0,zIndex:100,position:"sticky"},
  logoIco: {width:36,height:36,background:"linear-gradient(135deg,#E07B39,#C86A2A)",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18},
  logoT:   {fontFamily:"Georgia,serif",fontSize:17,fontWeight:700,color:"#2C2416"},
  logoS:   {fontSize:9,color:"#B8A990",letterSpacing:1.5,textTransform:"uppercase"},
  langBtn: {background:"#F5EDE0",border:"1px solid #D4C4A8",borderRadius:20,padding:"5px 12px",fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:600},
  menuBtn: {background:"none",border:"1px solid #D4C4A8",borderRadius:8,padding:"5px 10px",fontSize:16,cursor:"pointer"},
  menuDrop:{position:"absolute",top:"100%",right:20,background:"white",border:"1.5px solid #EEE5D6",borderRadius:12,padding:8,zIndex:200,boxShadow:"0 8px 24px rgba(0,0,0,0.12)",minWidth:180},
  menuItem:{display:"block",width:"100%",background:"none",border:"none",padding:"10px 14px",fontSize:14,color:"#2C2416",cursor:"pointer",textAlign:"left",borderRadius:8,fontFamily:"inherit",fontWeight:500},
  wrap:    {maxWidth:480,margin:"0 auto",padding:"20px 20px 48px"},
  heroBox: {background:"white",border:"1.5px solid #EEE5D6",borderTop:"4px solid",borderRadius:16,padding:"20px",marginBottom:14},
  badge:   {fontSize:11,fontWeight:600,border:"1px solid",borderRadius:20,padding:"3px 12px",display:"inline-block",marginBottom:10},
  h1:      {fontFamily:"Georgia,serif",fontSize:26,fontWeight:700,lineHeight:1.25,marginBottom:8,color:"#2C2416"},
  sub:     {fontSize:14,color:"#6B5740",lineHeight:1.7,whiteSpace:"pre-line"},
  painCard:{background:"white",border:"1px solid #EEE5D6",borderLeft:"3px solid",borderRadius:12,padding:"11px 14px",marginBottom:9,display:"flex",gap:10,alignItems:"flex-start"},
  painTxt: {fontSize:13,color:"#6B5740",lineHeight:1.55,fontStyle:"italic"},
  mythTeaser:{background:"#FFF8F3",border:"1.5px solid #F5D5BA",borderRadius:12,padding:"14px 16px",marginBottom:14,display:"flex",alignItems:"center",gap:12,cursor:"pointer"},
  safeNote:{fontSize:11,color:"#B8A990",textAlign:"center",marginTop:10},
  toolRow: {background:"white",border:"1px solid #EEE5D6",borderRadius:12,padding:"13px 14px",marginBottom:9,display:"flex",alignItems:"center",gap:12,cursor:"pointer"},
  secT:    {fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"#8B7355",marginBottom:12},
  footer:  {textAlign:"center",marginTop:28,paddingTop:16,borderTop:"1px solid #EEE5D6"},
  backBtn: {background:"none",border:"none",fontSize:13,color:"#8B7355",cursor:"pointer",padding:0},
  inpRow:  {display:"flex",alignItems:"center",background:"white",border:"2px solid #D4C4A8",borderRadius:13,padding:"3px 3px 3px 14px",marginBottom:13},
  pre:     {fontSize:19,fontWeight:700,marginRight:3},
  inp:     {flex:1,border:"none",background:"none",fontSize:20,fontWeight:600,color:"#2C2416",padding:"11px 10px 11px 3px",outline:"none",width:"100%"},
  skipB:   {background:"none",border:"none",fontSize:12,color:"#B8A990",cursor:"pointer",textDecoration:"underline",marginBottom:10,display:"block"},
};

const CSS=`
  @import url('https://fonts.googleapis.com/css2?family=Hind:wght@400;500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}

  .lang-btn{background:white;border:2px solid #EEE5D6;border-radius:14px;padding:14px 12px;cursor:pointer;text-align:left;font-family:inherit;transition:all 0.2s}
  .lang-btn:hover{border-color:currentColor;background:#FFF8F3;transform:translateY(-2px);box-shadow:0 4px 14px rgba(0,0,0,0.08)}

  .btn-p{display:block;width:100%;color:white;border:none;padding:15px 20px;border-radius:13px;font-family:'Hind',sans-serif;font-size:16px;font-weight:700;cursor:pointer;transition:all 0.2s;text-align:center;background:#E07B39;margin-bottom:8px}
  .btn-p:hover:not(:disabled){opacity:0.9;transform:translateY(-1px)}
  .btn-p:disabled{opacity:0.6;cursor:not-allowed}

  .btn-g{display:block;width:100%;background:transparent;color:#2C2416;border:1.5px solid #D4C4A8;padding:13px 20px;border-radius:12px;font-family:'Hind',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:all 0.2s}
  .btn-g:hover{background:#F5EDE0;border-color:#8B7355}

  .btn-q{padding:5px 12px;border-radius:20px;border:none;font-family:'Hind',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.15s}

  .whatsapp-btn{display:block;width:100%;background:#25D366;color:white;border:none;padding:13px 20px;border-radius:12px;font-family:'Hind',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:all 0.2s;text-align:center}
  .whatsapp-btn:hover{background:#1aab54}

  .spinner{width:16px;height:16px;border:2px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;display:inline-block;animation:spin 0.8s linear infinite}

  @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  .anim-1{animation:fadeUp 0.5s 0.1s ease both}
  .anim-2{animation:fadeUp 0.5s 0.2s ease both}
  .anim-3{animation:fadeUp 0.5s 0.35s ease both}

  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes loadbar{from{width:0%}to{width:100%}}
  .loading-fill{height:100%;border-radius:3px;animation:loadbar 4.5s ease forwards}

  @keyframes tickPop{from{transform:scale(0) rotate(-20deg);opacity:0}to{transform:scale(1) rotate(0);opacity:1}}
  .tick-anim{animation:tickPop 0.5s cubic-bezier(0.175,0.885,0.32,1.275) both;display:inline-block}

  input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{-webkit-appearance:none}
  input[type=number]{-moz-appearance:textfield}

  ::-webkit-scrollbar{width:4px}
  ::-webkit-scrollbar-track{background:#FBF7F0}
  ::-webkit-scrollbar-thumb{background:#D4C4A8;border-radius:4px}
`;
