// App.js — TankhaPuraan Production Frontend v7
// Artha Technologies Pvt Ltd
// "The Holy Scripture of Your Salary"
// v7: New dashboard, 8 products, Name+Email modal, Orders API, Bundle section, 22 languages

import { useState, useMemo } from "react";
import { LANGS, t, isRTL } from "./translations";

// ─── COLORS ───────────────────────────────────────────────────────────────────
const C = {
  ink:          "#1A0A0B",
  inkLight:     "#3D1A1C",
  paper:        "#F5EDD8",
  paperDeep:    "#EDE0C4",
  paperLight:   "#FAF6EE",
  cream:        "#FFFDF7",
  sindoor:      "#A41E22",
  sindoorDark:  "#7C1316",
  sindoorLight: "#C4383D",
  gold:         "#C9A84C",
  goldSoft:     "#E8C97A",
  goldLight:    "#F0D080",
  green:        "#1F6E43",
  greenLight:   "#2A9158",
  muted:        "#7A6A5A",
  border:       "#E0CDA8",
};

const BACKEND_URL = "https://tankhapuraan-backend-production.up.railway.app";
const BACKEND_SECRET = "TPbackend2026";
const RAZORPAY_KEY = "rzp_live_T0o9KcbQlYwweH";

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
  if (taxable <= 700000) tax = 0;
  const cess = tax * 0.04;
  return Math.round(tax + cess);
}

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────
const PRODUCTS = [
  { id: 1, name: "TankhaPuraan Patrika", hindi: "कर व्यवस्था विश्लेषण", category: "Tax",         price: "₹199", priceNote: "/ report", live: true,  sub: false, desc: "Old vs New regime — kaun sa bachata hai zyada paisa? Full breakdown, HR declaration, aur next year ki planning." },
  { id: 2, name: "Slip Pariksha",        hindi: "वेतन पर्ची परीक्षा",    category: "Salary",     price: "₹251", priceNote: "/ report", live: false, sub: false, desc: "Tumhari salary slip sahi hai ya galat? Har line decode, Slip Health Score, aur restructure letter." },
  { id: 3, name: "Bazaar Bhav",          hindi: "बाज़ार भाव",             category: "Market",     price: "₹299", priceNote: "/ report", live: false, sub: false, desc: "Tumhari salary market mein kahin hai? Percentile rank, skill gap, aur job switch suggestions." },
  { id: 4, name: "Hike Mantra",          hindi: "वेतन वृद्धि मंत्र",     category: "Negotiation",price: "₹251", priceNote: "/ report", live: false, sub: false, desc: "Appraisal mein kya bolein? Complete negotiation script — opening se closing tak, sab ready." },
  { id: 5, name: "Khata Puraan",         hindi: "खाता पुराण",             category: "Finance",    price: "₹199", priceNote: "/ month",  live: false, sub: true,  desc: "Tumhara personal AI financial advisor. Investment suggestions, monthly plan, SIP targets — har mahine." },
  { id: 6, name: "IT Notice Nivaran",    hindi: "आयकर नोटिस निवारण",    category: "Tax-Legal",  price: "₹599", priceNote: "/ report", live: false, sub: false, desc: "Income Tax ka notice aaya? Ghabrao mat. Notice identify, reply letter, aur filing instructions." },
  { id: 7, name: "PF Nyaya",             hindi: "पीएफ न्याय",             category: "EPFO",       price: "₹399", priceNote: "/ report", live: false, sub: false, desc: "PF mein gadbad hai? Screenshot upload karo, exact complaint letter aur step-by-step resolution pao." },
  { id: 8, name: "Adhikar Patra",        hindi: "अधिकार पत्र",            category: "Legal",      price: "₹499", priceNote: "/ report", live: false, sub: false, desc: "Salary roki? Galat nikalaya? Harassment? Labour Act ke hisaab se formal legal notice. Apna haq lo." },
];

const BUNDLE_PRODUCTS = PRODUCTS.filter(p => !p.sub);
const BUNDLE_ORIGINAL = BUNDLE_PRODUCTS.reduce((sum, p) => sum + parseInt(p.price.replace('₹','')), 0);

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Inter:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'EB Garamond', Georgia, serif; background: ${C.paperLight}; color: ${C.ink}; line-height: 1.7; }
  .app { min-height: 100vh; }

  .header { background: ${C.ink}; border-bottom: 2px solid ${C.gold}; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; height: 64px; position: sticky; top: 0; z-index: 100; }
  .brand { display: flex; align-items: center; gap: 12px; text-decoration: none; }
  .brand-logo { height: 38px; width: 38px; object-fit: contain; border-radius: 6px; border: 1px solid ${C.gold}; }
  .brand-text { display: flex; flex-direction: column; }
  .brand-name { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: ${C.paper}; letter-spacing: 0.3px; line-height: 1.1; }
  .brand-name span { color: ${C.gold}; }
  .brand-sub { font-family: 'EB Garamond', serif; font-size: 9px; color: ${C.goldSoft}; letter-spacing: 2.5px; text-transform: uppercase; }
  .lang-select { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2); color: ${C.paper}; padding: 6px 10px; font-size: 13px; cursor: pointer; outline: none; font-family: 'EB Garamond', serif; max-width: 150px; }
  .lang-select option { background: ${C.ink}; color: #fff; }

  .hero { background: ${C.ink}; background-image: radial-gradient(ellipse at 20% 50%, rgba(124,19,22,0.35) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(124,19,22,0.2) 0%, transparent 60%); padding: 64px 24px 72px; text-align: center; position: relative; overflow: hidden; }
  .hero-devanagari { font-size: 11px; letter-spacing: 5px; color: ${C.gold}; opacity: 0.8; margin-bottom: 18px; display: flex; align-items: center; justify-content: center; gap: 12px; font-family: 'EB Garamond', serif; text-transform: uppercase; }
  .hero-devanagari::before, .hero-devanagari::after { content: ''; width: 36px; height: 1px; background: ${C.gold}; opacity: 0.5; }
  .hero-title { font-family: 'Playfair Display', serif; font-size: clamp(28px, 5.5vw, 52px); font-weight: 700; color: ${C.paper}; line-height: 1.2; margin-bottom: 8px; }
  .hero-title em { font-style: italic; color: ${C.gold}; }
  .hero-tagline { font-family: 'EB Garamond', serif; font-size: clamp(15px, 2.5vw, 20px); color: rgba(245,237,216,0.75); font-style: italic; margin: 14px auto 32px; max-width: 540px; }
  .hero-cta-group { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
  .btn-gold { background: ${C.sindoorDark}; border: 1.5px solid ${C.gold}; color: ${C.goldLight}; font-family: 'EB Garamond', serif; font-size: 17px; padding: 13px 28px; cursor: pointer; letter-spacing: 0.3px; transition: all 0.2s; text-decoration: none; display: inline-block; }
  .btn-gold:hover { background: ${C.sindoor}; color: ${C.gold}; }
  .btn-outline { background: transparent; border: 1.5px solid rgba(245,237,216,0.25); color: rgba(245,237,216,0.75); font-family: 'EB Garamond', serif; font-size: 17px; padding: 13px 28px; cursor: pointer; letter-spacing: 0.3px; transition: all 0.2s; text-decoration: none; display: inline-block; }
  .btn-outline:hover { border-color: ${C.gold}; color: ${C.gold}; }

  .trust-bar { background: ${C.paperDeep}; border-top: 1px solid rgba(124,19,22,0.15); border-bottom: 1px solid rgba(124,19,22,0.15); padding: 14px 24px; display: flex; align-items: center; justify-content: center; gap: 32px; flex-wrap: wrap; }
  .trust-item { font-size: 13px; color: ${C.inkLight}; display: flex; align-items: center; gap: 6px; font-family: 'EB Garamond', serif; }

  .section-wrap { padding: 56px 20px 40px; text-align: center; }
  .eyebrow { font-size: 10px; letter-spacing: 4px; text-transform: uppercase; color: ${C.sindoor}; margin-bottom: 10px; font-family: 'EB Garamond', serif; }
  .section-title { font-family: 'Playfair Display', serif; font-size: clamp(24px, 4vw, 36px); font-weight: 700; color: ${C.ink}; line-height: 1.25; }
  .section-title em { color: ${C.sindoor}; font-style: italic; }
  .section-sub { font-size: 16px; color: ${C.muted}; font-style: italic; margin-top: 8px; }

  .calc-section { background: ${C.paper}; padding: 0 20px 56px; border-top: 1px solid ${C.paperDeep}; border-bottom: 1px solid ${C.paperDeep}; }
  .calc-card { max-width: 640px; margin: 0 auto; background: ${C.cream}; border: 1px solid ${C.border}; border-top: 3px solid ${C.sindoor}; padding: 32px; }
  .form-group { margin-bottom: 18px; }
  .form-group label { display: block; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${C.muted}; margin-bottom: 6px; font-family: 'Inter', sans-serif; }
  .form-group input { width: 100%; padding: 12px 16px; border: 1.5px solid ${C.border}; background: ${C.paper}; font-size: 16px; color: ${C.ink}; outline: none; font-family: 'EB Garamond', serif; transition: border-color 0.2s; }
  .form-group input:focus { border-color: ${C.sindoor}; background: #fff; }
  .deductions-box { background: ${C.paperDeep}; border: 1px solid ${C.border}; padding: 20px; margin-bottom: 20px; }
  .deductions-label { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: ${C.muted}; margin-bottom: 16px; display: block; font-family: 'Inter', sans-serif; }
  .deductions-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; }
  .ded-item label { font-size: 11px; color: ${C.muted}; display: block; margin-bottom: 4px; font-family: 'Inter', sans-serif; font-weight: 600; letter-spacing: 0.5px; }
  .ded-item input { width: 100%; padding: 10px 12px; border: 1px solid ${C.border}; background: #fff; font-size: 15px; color: ${C.ink}; outline: none; font-family: 'EB Garamond', serif; transition: border-color 0.2s; }
  .ded-item input:focus { border-color: ${C.sindoor}; }
  .calc-btn { width: 100%; padding: 16px; background: ${C.sindoorDark}; border: 1.5px solid ${C.sindoor}; color: ${C.goldLight}; font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; cursor: pointer; letter-spacing: 0.5px; transition: all 0.2s; }
  .calc-btn:hover { background: ${C.sindoor}; }

  .verdict { margin-top: 28px; border-top: 1px solid ${C.border}; padding-top: 28px; animation: fadeIn 0.4s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
  .verdict-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: ${C.ink}; margin-bottom: 20px; text-align: center; }
  .regime-compare { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px; }
  .regime-card { background: ${C.paperDeep}; border: 2px solid ${C.border}; padding: 20px; text-align: center; position: relative; transition: all 0.2s; }
  .regime-card.winner { background: linear-gradient(135deg, rgba(124,19,22,0.07), rgba(124,19,22,0.03)); border-color: ${C.sindoor}; }
  .winner-badge { position: absolute; top: -11px; left: 50%; transform: translateX(-50%); background: ${C.sindoor}; color: #fff; font-size: 10px; font-weight: 700; padding: 3px 14px; letter-spacing: 1px; text-transform: uppercase; white-space: nowrap; font-family: 'Inter', sans-serif; }
  .regime-name { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${C.muted}; margin-bottom: 8px; font-family: 'Inter', sans-serif; }
  .regime-tax { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 900; color: ${C.ink}; }
  .regime-label { font-size: 12px; color: ${C.muted}; margin-top: 4px; font-family: 'Inter', sans-serif; }
  .savings-banner { background: linear-gradient(135deg, ${C.green}, ${C.greenLight}); color: #fff; padding: 18px 24px; text-align: center; margin-bottom: 24px; }
  .savings-amount { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 900; display: block; }
  .savings-label { font-size: 13px; opacity: 0.9; margin-top: 2px; font-family: 'Inter', sans-serif; }

  .pdf-cta { background: linear-gradient(135deg, ${C.sindoorDark} 0%, ${C.sindoor} 100%); padding: 28px 24px; margin-top: 24px; text-align: center; position: relative; overflow: hidden; }
  .pdf-cta::before { content: '📜'; position: absolute; top: -16px; right: -16px; font-size: 90px; opacity: 0.07; transform: rotate(15deg); pointer-events: none; }
  .pdf-badge { display: inline-block; background: rgba(255,255,255,0.12); color: ${C.goldLight}; font-size: 10px; font-weight: 700; letter-spacing: 2px; padding: 4px 14px; margin-bottom: 12px; text-transform: uppercase; font-family: 'Inter', sans-serif; }
  .pdf-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: #fff; margin-bottom: 8px; line-height: 1.3; }
  .pdf-sub { font-size: 14px; color: rgba(255,255,255,0.8); margin-bottom: 18px; line-height: 1.6; font-family: 'EB Garamond', serif; font-style: italic; }
  .pdf-features { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-bottom: 22px; list-style: none; }
  .pdf-features li { font-size: 12px; color: rgba(255,255,255,0.9); background: rgba(255,255,255,0.1); padding: 4px 12px; display: flex; align-items: center; gap: 5px; font-family: 'Inter', sans-serif; }
  .pdf-btn { width: 100%; padding: 17px; background: ${C.goldLight}; color: ${C.sindoorDark}; border: none; font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; cursor: pointer; transition: all 0.2s; letter-spacing: 0.3px; }
  .pdf-btn:hover { background: ${C.gold}; }
  .pdf-btn:disabled { opacity: 0.7; cursor: not-allowed; }
  .pdf-trust { font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 12px; font-family: 'Inter', sans-serif; }
  .disclaimer { margin-top: 14px; font-size: 12px; color: ${C.muted}; font-style: italic; line-height: 1.6; }

  .modal-overlay { position: fixed; inset: 0; background: rgba(26,10,11,0.75); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.2s ease; }
  .modal-card { background: ${C.cream}; border: 1.5px solid ${C.gold}; border-top: 4px solid ${C.sindoor}; padding: 36px 32px; max-width: 420px; width: 100%; position: relative; }
  .modal-close { position: absolute; top: 12px; right: 16px; background: none; border: none; font-size: 20px; cursor: pointer; color: ${C.muted}; line-height: 1; }
  .modal-eyebrow { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: ${C.sindoor}; margin-bottom: 8px; font-family: 'Inter', sans-serif; }
  .modal-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: ${C.ink}; margin-bottom: 6px; line-height: 1.3; }
  .modal-sub { font-size: 14px; color: ${C.muted}; font-style: italic; margin-bottom: 24px; font-family: 'EB Garamond', serif; }
  .modal-field { margin-bottom: 16px; }
  .modal-field label { display: block; font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${C.muted}; margin-bottom: 6px; font-family: 'Inter', sans-serif; }
  .modal-field input { width: 100%; padding: 12px 14px; border: 1.5px solid ${C.border}; background: ${C.paper}; font-size: 16px; color: ${C.ink}; outline: none; font-family: 'EB Garamond', serif; transition: border-color 0.2s; }
  .modal-field input:focus { border-color: ${C.sindoor}; background: #fff; }
  .modal-btn { width: 100%; padding: 15px; background: ${C.sindoorDark}; border: 1.5px solid ${C.gold}; color: ${C.goldLight}; font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; cursor: pointer; margin-top: 8px; transition: all 0.2s; letter-spacing: 0.3px; }
  .modal-btn:hover { background: ${C.sindoor}; }
  .modal-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .modal-note { font-size: 11px; color: ${C.muted}; text-align: center; margin-top: 12px; font-family: 'Inter', sans-serif; }
  .modal-loading { text-align: center; padding: 12px; font-size: 14px; color: ${C.sindoor}; font-family: 'EB Garamond', serif; font-style: italic; }

  .products-section { background: ${C.paper}; padding: 0 20px 64px; border-top: 1px solid ${C.paperDeep}; border-bottom: 1px solid ${C.paperDeep}; }
  .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; max-width: 1100px; margin: 0 auto; }
  .product-card { background: ${C.cream}; border: 1px solid ${C.border}; border-top: 3px solid ${C.sindoor}; padding: 24px; transition: box-shadow 0.2s, transform 0.2s; }
  .product-card:hover { box-shadow: 0 8px 32px rgba(124,19,22,0.1); transform: translateY(-2px); }
  .product-card.featured { border-top-color: ${C.gold}; }
  .product-number { font-size: 10px; letter-spacing: 3px; color: ${C.sindoor}; text-transform: uppercase; opacity: 0.7; margin-bottom: 6px; font-family: 'Inter', sans-serif; }
  .product-name { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: ${C.ink}; margin-bottom: 3px; line-height: 1.2; }
  .product-hindi { font-size: 13px; color: ${C.sindoor}; margin-bottom: 12px; opacity: 0.8; }
  .product-desc { font-size: 14px; color: ${C.muted}; font-style: italic; line-height: 1.6; margin-bottom: 20px; }
  .product-footer { display: flex; align-items: center; justify-content: space-between; }
  .product-price { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 700; color: ${C.sindoor}; }
  .product-price-note { font-size: 13px; color: ${C.muted}; font-family: 'EB Garamond', serif; font-weight: 400; margin-left: 2px; }
  .badge { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; padding: 4px 10px; font-family: 'Inter', sans-serif; font-weight: 600; }
  .badge-live { background: ${C.sindoorDark}; color: ${C.goldLight}; border: 1px solid ${C.gold}; }
  .badge-soon { background: transparent; color: ${C.muted}; border: 1px solid ${C.border}; }
  .badge-sub  { background: ${C.ink}; color: ${C.goldLight}; border: 1px solid ${C.gold}; }

  .bundle-section { background: ${C.ink}; padding: 64px 24px; text-align: center; position: relative; overflow: hidden; }
  .bundle-section::before { content: '॥'; font-size: 200px; color: ${C.gold}; opacity: 0.03; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); pointer-events: none; line-height: 1; }
  .bundle-card { max-width: 580px; margin: 0 auto; border: 1.5px solid ${C.gold}; padding: 40px 32px; position: relative; background: rgba(124,19,22,0.12); }
  .bundle-crown { position: absolute; top: -13px; left: 50%; transform: translateX(-50%); background: ${C.ink}; padding: 0 16px; font-size: 10px; letter-spacing: 4px; text-transform: uppercase; color: ${C.gold}; font-family: 'EB Garamond', serif; white-space: nowrap; }
  .bundle-title { font-family: 'Playfair Display', serif; font-size: 28px; color: ${C.paper}; margin-bottom: 6px; }
  .bundle-sub { font-style: italic; color: rgba(245,237,216,0.6); font-size: 15px; margin-bottom: 28px; font-family: 'EB Garamond', serif; }
  .bundle-chips { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-bottom: 28px; }
  .bundle-chip { background: rgba(245,237,216,0.07); border: 1px solid rgba(201,168,76,0.25); color: rgba(245,237,216,0.8); font-size: 12px; padding: 5px 12px; font-family: 'EB Garamond', serif; }
  .bundle-original { font-size: 16px; color: rgba(245,237,216,0.4); text-decoration: line-through; margin-bottom: 4px; font-family: 'Inter', sans-serif; }
  .bundle-price { font-family: 'Playfair Display', serif; font-size: 56px; color: ${C.gold}; line-height: 1; margin-bottom: 6px; }
  .bundle-save { font-size: 13px; color: ${C.goldSoft}; opacity: 0.8; margin-bottom: 28px; font-family: 'Inter', sans-serif; letter-spacing: 0.5px; }

  .how-section { background: ${C.paperLight}; padding: 64px 24px; }
  .steps { display: flex; gap: 0; max-width: 720px; margin: 0 auto; flex-wrap: wrap; justify-content: center; }
  .step { flex: 1; min-width: 180px; text-align: center; padding: 20px 16px; position: relative; }
  .step:not(:last-child)::after { content: '—'; position: absolute; right: -6px; top: 32px; color: ${C.gold}; opacity: 0.4; font-size: 18px; }
  .step-num { width: 44px; height: 44px; background: ${C.sindoorDark}; border: 1.5px solid ${C.gold}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', serif; font-size: 18px; color: ${C.gold}; margin: 0 auto 14px; }
  .step-title { font-family: 'Playfair Display', serif; font-size: 17px; color: ${C.ink}; margin-bottom: 6px; }
  .step-desc { font-size: 13px; color: ${C.muted}; font-style: italic; }

  .footer { background: ${C.ink}; padding: 40px 24px 24px; text-align: center; border-top: 2px solid ${C.sindoor}; }
  .footer-brand { font-family: 'Playfair Display', serif; font-size: 22px; color: ${C.paper}; margin-bottom: 4px; }
  .footer-brand span { color: ${C.gold}; }
  .footer-tagline { font-style: italic; color: rgba(245,237,216,0.4); font-size: 13px; margin-bottom: 20px; }
  .footer-links { display: flex; gap: 24px; justify-content: center; flex-wrap: wrap; margin-bottom: 20px; }
  .footer-links a { color: rgba(245,237,216,0.4); font-size: 11px; text-decoration: none; letter-spacing: 1.5px; text-transform: uppercase; font-family: 'Inter', sans-serif; transition: color 0.2s; }
  .footer-links a:hover { color: ${C.gold}; }
  .footer-disclaimer { font-size: 11px; color: rgba(245,237,216,0.25); max-width: 600px; margin: 0 auto; line-height: 1.7; font-family: 'Inter', sans-serif; }

  .rtl { direction: rtl; text-align: right; }

  @media (max-width: 600px) {
    .hero { padding: 48px 16px 56px; }
    .calc-card { padding: 20px 16px; }
    .regime-compare { grid-template-columns: 1fr; }
    .products-grid { grid-template-columns: 1fr; }
    .deductions-grid { grid-template-columns: 1fr; }
    .trust-bar { gap: 16px; }
    .bundle-card { padding: 32px 20px; }
    .modal-card { padding: 28px 20px; }
    .step:not(:last-child)::after { display: none; }
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
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName]   = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading]     = useState(false);

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
    const saving = Math.abs(oldTax - newTax);
    setResult({ oldTax, newTax, winner, saving, gross });
  };

  const handlePDFClick = () => {
    setShowModal(true);
  };

  const handleModalSubmit = async () => {
    if (!userName.trim() || !userEmail.trim()) return;
    setLoading(true);

    try {
      // Step 1 — Create Razorpay Order via Railway backend
      const orderRes = await fetch(`${BACKEND_URL}/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name:        userName,
          email:            userEmail,
          annual_ctc:       income     || "0",
          hra_received:     hra        || "0",
          rent_paid:        String(Math.round(parseFloat(hra || 0) * 1.33)),
          metro_city:       "no",
          section_80c:      ded80c     || "0",
          section_80d:      med80d     || "0",
          other_deductions: otherDed   || "0",
          language:         lang,
        }),
      });

      if (!orderRes.ok) {
        const err = await orderRes.text();
        throw new Error("Order creation failed: " + err);
      }

      const { order_id, amount, currency } = await orderRes.json();
      setLoading(false);
      setShowModal(false);

      // Step 2 — Open Razorpay Checkout with order_id
      const options = {
        key:         RAZORPAY_KEY,
        amount:      amount,
        currency:    currency,
        order_id:    order_id,
        name:        "TankhaPuraan",
        description: "TankhaPuraan Patrika — Tax Regime Report",
        image:       "/logo.png",
        handler: function(response) {
          alert(
            "Payment successful! Aapki TankhaPuraan Patrika " +
            userEmail +
            " par 10 minutes mein pahunch jaayegi. Payment ID: " +
            response.razorpay_payment_id
          );
        },
        prefill: {
          name:    userName,
          email:   userEmail,
        },
        theme: { color: "#7C1316" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      setLoading(false);
      alert("Something went wrong: " + err.message + ". Please try again.");
      console.error(err);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className={`app ${rtl ? "rtl" : ""}`}>

        {/* HEADER */}
        <header className="header">
          <div className="brand">
            <img src="/logo.png" alt="TankhaPuraan" className="brand-logo" onError={e => { e.target.style.display = "none"; }} />
            <div className="brand-text">
              <div className="brand-name">Tankha<span>Puraan</span></div>
              <div className="brand-sub">Scripture of Salary</div>
            </div>
          </div>
          <select className="lang-select" value={lang} onChange={e => { setLang(e.target.value); setResult(null); }}>
            {LANGS.map(l => (<option key={l.c} value={l.c}>{l.n}</option>))}
          </select>
        </header>

        {/* HERO */}
        <section className="hero">
          <div className="hero-devanagari">॥ Artha Satyam ॥</div>
          <h1 className="hero-title">Har Salaried Indian Ka<br /><em>Digital Vakeel, CA & Advisor</em></h1>
          <p className="hero-tagline">Jo tumhara HR nahi batata. Jo tumhara CA chhupaata hai.<br />Woh sirf TankhaPuraan batata hai.</p>
          <div className="hero-cta-group">
            <a href="#calculator" className="btn-gold">📜 Free Tax Calculator</a>
            <a href="#products" className="btn-outline">Explore All Tools</a>
          </div>
        </section>

        {/* TRUST BAR */}
        <div className="trust-bar">
          <div className="trust-item">🔒 Secured by Razorpay</div>
          <div className="trust-item">⚡ Report in 10 minutes</div>
          <div className="trust-item">📜 As per Govt. Laws & Labour Code</div>
          <div className="trust-item">↩️ Auto-refund if pipeline fails</div>
        </div>

        {/* CALCULATOR */}
        <section className="calc-section" id="calculator">
          <div className="section-wrap">
            <div className="eyebrow">Adhyaya 1 · Tax · Live Now</div>
            <div className="section-title">TankhaPuraan Patrika</div>
            <div className="section-sub">Old vs New regime — kaun sa bachata hai zyada paisa? Abhi jaano, bilkul muft.</div>
          </div>

          <div className="calc-card">
            <div className="form-group">
              <label>Annual Income (CTC)</label>
              <input type="number" placeholder="Apna annual CTC daalo" value={income} onChange={e => { setIncome(e.target.value); setResult(null); }} />
            </div>

            <div className="deductions-box">
              <span className="deductions-label">Total Deductions (80C, HRA, etc.)</span>
              <div className="deductions-grid">
                {[
                  { label: "80C Investment",        val: ded80c,   set: setDed80c   },
                  { label: "HRA Exemption",          val: hra,      set: setHra      },
                  { label: "NPS (80CCD)",             val: nps,      set: setNps      },
                  { label: "Home Loan Interest",     val: homeLoan, set: setHomeLoan },
                  { label: "Medical Insurance (80D)",val: med80d,   set: setMed80d   },
                  { label: "Other Deductions",       val: otherDed, set: setOtherDed },
                ].map((item, i) => (
                  <div className="ded-item" key={i}>
                    <label>{item.label}</label>
                    <input type="number" placeholder="₹0" value={item.val} onChange={e => { item.set(e.target.value); setResult(null); }} />
                  </div>
                ))}
              </div>
            </div>

            <button className="calc-btn" onClick={handleCalculate}>Calculate Karo →</button>

            {result && (
              <div className="verdict">
                <h3 className="verdict-title">📿 Aapka TankhaPuraan Verdict</h3>
                <div className="regime-compare">
                  <div className={`regime-card ${result.winner === "old" ? "winner" : ""}`}>
                    {result.winner === "old" && <span className="winner-badge">✓ Bachtu</span>}
                    <div className="regime-name">Puraana Regime</div>
                    <div className="regime-tax">{inr(result.oldTax)}</div>
                    <div className="regime-label">Dey Tax</div>
                  </div>
                  <div className={`regime-card ${result.winner === "new" ? "winner" : ""}`}>
                    {result.winner === "new" && <span className="winner-badge">✓ Bachtu</span>}
                    <div className="regime-name">Naya Regime</div>
                    <div className="regime-tax">{inr(result.newTax)}</div>
                    <div className="regime-label">Dey Tax</div>
                  </div>
                </div>

                {result.saving > 0 && (
                  <div className="savings-banner">
                    <span className="savings-amount">{inr(result.saving)}</span>
                    <div className="savings-label">Aapki Bachat | {inr(result.saving / 12)} maas priti bachat</div>
                  </div>
                )}

                <div className="pdf-cta">
                  <div className="pdf-badge">📜 TankhaPuraan Patrika</div>
                  <div className="pdf-title">What's in your ₹199 PDF Report?</div>
                  <p className="pdf-sub">8-page personalized report — delivered to your email in 10 minutes. Valid for FY 2025-26 | AY 2026-27</p>
                  <ul className="pdf-features">
                    <li>Full slab-by-slab tax breakdown</li>
                    <li>Exact verdict — which regime saves more & by how much</li>
                    <li>Monthly take-home impact calculation</li>
                    <li>Deduction Optimizer — 3 legal moves to reduce tax</li>
                    <li>Copy-paste declaration for your HR to switch regime</li>
                    <li>Next year tax planning recommendations</li>
                  </ul>
                  <button className="pdf-btn" onClick={handlePDFClick}>
                    📥 PDF Report Lein — ₹199
                  </button>
                  <p className="pdf-trust">🔒 Secure payment via Razorpay &nbsp;•&nbsp; Email in 10 mins &nbsp;•&nbsp; Auto-refund if failed</p>
                </div>

                <p className="disclaimer">⚠ Yeh calculation sirf information ke liye hai. Final decision ke liye CA se milo. TankhaPuraan kisi bhi financial loss ke liye zimmedaar nahi.</p>
              </div>
            )}
          </div>
        </section>

        {/* PRODUCTS */}
        <section className="products-section" id="products">
          <div className="section-wrap">
            <div className="eyebrow">Ashtadasha Adhyaya — आठ अध्याय</div>
            <div className="section-title">8 Tools. Every <em>Salary Problem</em> Solved.</div>
            <div className="section-sub">Ek jagah. Seedhi baat. Koi drama nahi.</div>
          </div>
          <div className="products-grid">
            {PRODUCTS.map((p, i) => (
              <div className={`product-card ${p.live || p.sub ? "featured" : ""}`} key={p.id}>
                <div className="product-number">Adhyaya {i + 1} · {p.category}</div>
                <div className="product-name">{p.name}</div>
                <div className="product-hindi">{p.hindi}</div>
                <div className="product-desc">{p.desc}</div>
                <div className="product-footer">
                  <div>
                    <span className="product-price">{p.price}</span>
                    <span className="product-price-note">{p.priceNote}</span>
                  </div>
                  {p.live ? <span className="badge badge-live">● Live</span>
                   : p.sub ? <span className="badge badge-sub">Subscription</span>
                   : <span className="badge badge-soon">Coming Soon</span>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* BUNDLE */}
        <section className="bundle-section" id="bundle">
          <div className="bundle-card">
            <div className="bundle-crown">॥ Sampurna TankhaPuraan ॥</div>
            <div className="bundle-title">The Complete Bundle</div>
            <div className="bundle-sub">Saaton tools. Ek daam. Poori suraksha.</div>
            <div className="bundle-chips">
              {BUNDLE_PRODUCTS.map(p => (<span className="bundle-chip" key={p.id}>{p.name} {p.price}</span>))}
            </div>
            <div className="bundle-original">Total value: {inr(BUNDLE_ORIGINAL)}</div>
            <div className="bundle-price">₹2,001</div>
            <div className="bundle-save">↑ Save {inr(BUNDLE_ORIGINAL - 2001)} · Khata Puraan subscription alag</div>
            <a href="#calculator" className="btn-gold" style={{fontSize:"17px", padding:"15px 36px"}}>📜 Get the Complete Bundle →</a>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="how-section" id="how">
          <div className="section-wrap">
            <div className="eyebrow">Vidhi — विधि</div>
            <div className="section-title">Kaise Kaam Karta Hai</div>
          </div>
          <div className="steps">
            <div className="step"><div className="step-num">१</div><div className="step-title">Apna Data Daalo</div><div className="step-desc">Salary, deductions, aur situation ke hisaab se inputs fill karo</div></div>
            <div className="step"><div className="step-num">२</div><div className="step-title">Securely Pay Karo</div><div className="step-desc">Razorpay se UPI, card, net banking — sab accepted</div></div>
            <div className="step"><div className="step-num">३</div><div className="step-title">Patrika Pao</div><div className="step-desc">10 minute mein personalized report tumhare email par</div></div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div className="footer-brand">Tankha<span>Puraan</span></div>
          <p className="footer-tagline">Scripture of Salary · A Proud Indian</p>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
            <a href="#">Refund Policy</a>
            <a href="mailto:help@tankhapuraan.com">Contact</a>
          </div>
          <p className="footer-disclaimer">
            Calculations are informational only. For final decisions consult a CA or qualified advisor. TankhaPuraan is not liable for any financial or legal loss. We do not promote or advertise for any third party. All reports generated using publicly available Indian tax laws, Labour Codes, and EPFO regulations. © 2026 Artha Technologies Pvt Ltd.
          </p>
        </footer>

        {/* MODAL */}
        {showModal && (
          <div className="modal-overlay" onClick={e => { if (e.target.className === "modal-overlay") setShowModal(false); }}>
            <div className="modal-card">
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
              <div className="modal-eyebrow">Almost there</div>
              <div className="modal-title">Aapki Patrika Tayaar Ho Rahi Hai</div>
              <p className="modal-sub">Aapka naam aur email daalo — report personally address hogi aur seedha inbox mein aayegi.</p>
              <div className="modal-field">
                <label>Your Full Name</label>
                <input type="text" placeholder="e.g. Amiya Kumar Mishra" value={userName} onChange={e => setUserName(e.target.value)} autoFocus />
              </div>
              <div className="modal-field">
                <label>Email Address</label>
                <input type="email" placeholder="e.g. amiya@example.com" value={userEmail} onChange={e => setUserEmail(e.target.value)} />
              </div>
              {loading && <div className="modal-loading">⏳ Order tayaar ho raha hai...</div>}
              <button
                className="modal-btn"
                onClick={handleModalSubmit}
                disabled={!userName.trim() || !userEmail.trim() || loading}
                style={{ opacity: (!userName.trim() || !userEmail.trim() || loading) ? 0.6 : 1 }}
              >
                {loading ? "Please wait..." : "Aage Badho — ₹199 Pay Karo →"}
              </button>
              <p className="modal-note">🔒 Your data is safe. Used only for your report.</p>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
