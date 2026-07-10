export const calcNewRegimeTax = (income) => {
  const slabs = [
    { limit: 400000, rate: 0 },
    { limit: 800000, rate: 0.05 },
    { limit: 1200000, rate: 0.10 },
    { limit: 1600000, rate: 0.15 },
    { limit: 2000000, rate: 0.20 },
    { limit: 2400000, rate: 0.25 },
    { limit: Infinity, rate: 0.30 }
  ];

  const adjustedIncome = Math.max(0, income - 75000);
  let tax = 0, prev = 0;

  for (let i = 0; i < slabs.length; i++) {
    if (adjustedIncome > prev) {
      const taxable = Math.min(adjustedIncome, slabs[i].limit) - prev;
      tax += taxable * slabs[i].rate;
    }
    prev = slabs[i].limit;
  }

  if (adjustedIncome <= 1200000) tax = 0;

  let surchargeRate = 0;
  if (income > 20000000) surchargeRate = 0.25;
  else if (income > 10000000) surchargeRate = 0.15;
  else if (income > 5000000) surchargeRate = 0.10;
  tax = tax + (tax * surchargeRate);

  return Math.round(tax * 1.04);
};

export const calcOldRegimeTax = (income, deductions) => {
  let totalDeductions = 50000;
  totalDeductions += Math.min(deductions.sec80c, 150000);
  totalDeductions += deductions.hra;
  totalDeductions += Math.min(deductions.nps, 50000);
  totalDeductions += Math.min(deductions.homeLoan, 200000);
  totalDeductions += deductions.med80d;
  totalDeductions += deductions.other;

  const taxableIncome = Math.max(0, income - totalDeductions);
  const slabs = [
    { limit: 250000, rate: 0 },
    { limit: 500000, rate: 0.05 },
    { limit: 1000000, rate: 0.20 },
    { limit: Infinity, rate: 0.30 }
  ];

  let tax = 0, prev = 0;
  for (let i = 0; i < slabs.length; i++) {
    if (taxableIncome > prev) {
      const taxable = Math.min(taxableIncome, slabs[i].limit) - prev;
      tax += taxable * slabs[i].rate;
    }
    prev = slabs[i].limit;
  }

  if (taxableIncome <= 500000) tax = 0;

  let surchargeRate = 0;
  if (income > 20000000) surchargeRate = 0.37;
  else if (income > 10000000) surchargeRate = 0.15;
  else if (income > 5000000) surchargeRate = 0.10;
  tax = tax + (tax * surchargeRate);

  return Math.round(tax * 1.04);
};

export const formatCurrency = (n) => '₹' + Math.round(n).toLocaleString('en-IN');

export const parseNum = (str) => {
  if (!str) return 0;
  return parseInt(String(str).replace(/,/g, ''), 10) || 0;
};

export const formatNum = (n) => Math.round(n).toLocaleString('en-IN');

export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const getEmotionalHook = (savings) => {
  const monthly = Math.round(savings / 12);
  if (monthly >= 10000) return 'Yeh ₹' + formatNum(monthly) + ' har mahine — ek achhi EMI, ya bachhon ka future fund, ya woh vacation jo kabhi plan nahi hui. Choice tumhara.';
  if (monthly >= 5000) return '₹' + formatNum(monthly) + ' mahine ka — saal bhar mein ek premium gym, ya 3 family dinners, ya emergency fund ka seed. Socho.';
  if (monthly >= 2000) return '₹' + formatNum(monthly) + ' har mahine bachao — saal mein ₹' + formatNum(savings) + '. Choti amount, bada farq. SIP shuru karo.';
  if (monthly >= 500) return '₹' + formatNum(monthly) + ' mahine ka — saal mein ₹' + formatNum(savings) + '. Ek din ka grocery, ya ek chota investment — sab count hota hai.';
  return 'Har rupay count hota hai. ₹' + formatNum(savings) + ' saal mein — free Patrika se zyada pata chalega kaise aur bachaye.';
};
