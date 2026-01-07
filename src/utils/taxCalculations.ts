
export interface TaxInputs {
  grossIncome: number;
  idecoAmountYearly: number;
  furusatoAmountYearly: number;
  // New Fields
  hasSpouse: boolean;
  numDependentsGen: number; // 16-18, 23-69
  numDependentsSpecific: number; // 19-22
  lifeInsurancePremium: number;
  earthquakeInsurancePremium: number;
  miscIncome: number;
  miscExpenses: number;
  loanBalanceYearEnd?: number;
  // 2025 Updates
  loanStartPeriod?: '2014-2021' | '2022-';
  socialInsuranceMode?: 'auto' | 'manual';
  socialInsuranceManualAmount?: number;
  medicalExpenses?: number;
}

export const calculateEmploymentIncomeDeduction = (income: number): number => {
  // 2025 Update: Min 650,000
  if (income <= 1625000) {
    return 650000;
  } else if (income <= 1800000) {
    return income * 0.4 - 100000;
  } else if (income <= 3600000) {
    return income * 0.3 + 80000;
  } else if (income <= 6600000) {
    return income * 0.2 + 440000;
  } else if (income <= 8500000) {
    return income * 0.1 + 1100000;
  } else {
    return 1950000;
  }
};

export const calculateSocialInsurance = (inputs: TaxInputs): number => {
  if (inputs.socialInsuranceMode === 'manual' && inputs.socialInsuranceManualAmount !== undefined) {
    return inputs.socialInsuranceManualAmount;
  }
  // Auto approximation (15%)
  return Math.floor(inputs.grossIncome * 0.15);
};

export const calculateLifeInsuranceDeduction = (premium: number): { income: number, resident: number } => {
  // New System Calculation (Simple version)
  // Income Tax
  let dedIncome = 0;
  if (premium <= 20000) dedIncome = premium;
  else if (premium <= 40000) dedIncome = premium * 0.5 + 10000;
  else if (premium <= 80000) dedIncome = premium * 0.25 + 20000;
  else dedIncome = 40000;

  // Resident Tax - 2025 Update: Max 70,000 Total Limit (Simplified per category logic first)
  // Note: The logic below is per "General Life Insurance". There are 3 categories.
  // The user asked to "Limit Total to 70,000".
  // Since we only have ONE input for Life Insurance, we assume it's General.
  // The max for General in Resident Tax is 28,000.
  // If we had 3 inputs, their sum's limit would be 70,000.
  // With single input, max theoretical is still 28,000 (if treated as one category).
  // However, if the user implies "Total Life Insurance Payment" covers all categories,
  // we might need to be generous or strict.
  // Strict: 28,000 max for one category.
  // Generous: If amount is large, assume spread across categories?
  // Let's stick to the formula for one category but acknowledge the global 70k limit request.
  // If premium > 56000, dedResident = 28000. This is < 70000, so it's safe.
  
  let dedResident = 0;
  if (premium <= 12000) dedResident = premium;
  else if (premium <= 32000) dedResident = premium * 0.5 + 6000;
  else if (premium <= 56000) dedResident = premium * 0.25 + 14000;
  else dedResident = 28000;

  return { income: dedIncome, resident: dedResident };
};

export const calculateEarthquakeInsuranceDeduction = (premium: number): { income: number, resident: number } => {
  // Income Tax: Max 50,000
  let dedIncome = Math.min(50000, premium);
  // Resident Tax: Max 25,000 (Standard: premium * 0.5)
  let dedResident = Math.min(25000, premium * 0.5);
  return { income: dedIncome, resident: dedResident };
};

export const calculateIncomeTax = (taxableIncome: number): number => {
  if (taxableIncome <= 0) return 0;

  let tax = 0;
  if (taxableIncome <= 1950000) {
    tax = taxableIncome * 0.05;
  } else if (taxableIncome <= 3300000) {
    tax = taxableIncome * 0.1 - 97500;
  } else if (taxableIncome <= 6950000) {
    tax = taxableIncome * 0.2 - 427500;
  } else if (taxableIncome <= 9000000) {
    tax = taxableIncome * 0.23 - 636000;
  } else if (taxableIncome <= 18000000) {
    tax = taxableIncome * 0.33 - 1536000;
  } else if (taxableIncome <= 40000000) {
    tax = taxableIncome * 0.4 - 2796000;
  } else {
    tax = taxableIncome * 0.45 - 4796000;
  }
  return Math.floor(tax * 1.021);
};

export const calculateResidentTax = (taxableIncomeForResidentTax: number): number => {
  if (taxableIncomeForResidentTax <= 0) return 0;
  const incomeLevy = Math.floor(taxableIncomeForResidentTax * 0.10);
  const perCapitaLevy = 5000;
  return incomeLevy + perCapitaLevy;
};

// 2025 Update: Tiered Basic Deduction for Income Tax
export const calculateBasicDeductionIncome = (totalIncome: number): number => {
  if (totalIncome <= 1320000) return 950000; // was 480k
  if (totalIncome <= 3360000) return 880000;
  if (totalIncome <= 4890000) return 680000;
  if (totalIncome <= 6550000) return 630000;
  if (totalIncome <= 23500000) return 580000;
  if (totalIncome <= 24000000) return 480000;
  if (totalIncome <= 24500000) return 320000;
  return 0;
};

// Medical Expenses Deduction
export const calculateMedicalDeduction = (expenses: number, totalIncome: number): number => {
  if (!expenses || expenses <= 0) return 0;
  const threshold = Math.min(100000, Math.floor(totalIncome * 0.05));
  return Math.max(0, expenses - threshold);
};

export interface TaxResult {
  grossIncome: number;
  employmentDeduction: number;
  socialInsurance: number;
  taxableIncome: number;
  incomeTax: number;
  residentTax: number;
  netIncome: number;
  paramBasicExemptionIncome: number;
  paramBasicExemptionResident: number;
  totalIncomeDeductions: number;
  medicalDeduction: number;
  adjustmentDeduction: number;
}

export const calculateTaxes = (inputs: TaxInputs): TaxResult => {
  const {
    grossIncome, idecoAmountYearly, furusatoAmountYearly,
    hasSpouse, numDependentsGen, numDependentsSpecific,
    lifeInsurancePremium, earthquakeInsurancePremium,
    miscIncome, miscExpenses,
    loanBalanceYearEnd = 0,
    loanStartPeriod = '2022-',
    medicalExpenses = 0
  } = inputs;

  // 1. Calculate Incomes
  const employmentDeduction = calculateEmploymentIncomeDeduction(grossIncome);
  let employmentIncome = Math.max(0, grossIncome - employmentDeduction);

  let miscNetIncome = Math.max(0, miscIncome - miscExpenses);

  const totalGrossIncome = employmentIncome + miscNetIncome; // Sou-Shotoku-Kingaku

  // 2. Deductions
  const socialInsurance = calculateSocialInsurance(inputs);

  // 2025 Update: Tiered Basic Deduction
  const basicExemptionIncome = calculateBasicDeductionIncome(totalGrossIncome);
  const basicExemptionResident = 430000; // Fixed as requested

  // Insurance Deductions
  const lifeInsDed = calculateLifeInsuranceDeduction(lifeInsurancePremium);
  const quakeInsDed = calculateEarthquakeInsuranceDeduction(earthquakeInsurancePremium);
  
  // Medical Deduction
  const medicalDed = calculateMedicalDeduction(medicalExpenses, totalGrossIncome);

  // Dependent Deductions (Simplified for 2024/2025)
  // Spouse (Assuming income < 10M and spouse income low)
  const spouseDedIncome = hasSpouse ? 380000 : 0;
  const spouseDedResident = hasSpouse ? 330000 : 0;

  // General Dependents (16-18, 23-69)
  const genDepDedIncome = numDependentsGen * 380000;
  const genDepDedResident = numDependentsGen * 330000;

  // Specific Dependents (19-22)
  const specDepDedIncome = numDependentsSpecific * 630000;
  const specDepDedResident = numDependentsSpecific * 450000;

  // Total Deductions for Income Tax
  const totalDeductionsIncome =
    socialInsurance +
    basicExemptionIncome +
    idecoAmountYearly +
    lifeInsDed.income +
    quakeInsDed.income +
    spouseDedIncome +
    genDepDedIncome +
    specDepDedIncome +
    medicalDed;

  // Furusato Deduction (Income Tax)
  let charitableDeduction = 0;
  if (furusatoAmountYearly > 2000) {
    charitableDeduction = furusatoAmountYearly - 2000;
  }

  // Taxable Income for Income Tax
  let taxableIncome = Math.max(0, totalGrossIncome - (totalDeductionsIncome + charitableDeduction));
  taxableIncome = Math.floor(taxableIncome / 1000) * 1000;

  let incomeTax = calculateIncomeTax(taxableIncome);

  // --- Housing Loan Deduction Logic ---
  // Limit 30M, Rate 0.7%
  const loanLimit = 30000000;
  const loanCredit = Math.floor(Math.min(loanBalanceYearEnd, loanLimit) * 0.007);

  // Deduct from Income Tax
  let incomeTaxAfterLoan = Math.max(0, incomeTax - loanCredit);
  const loanCreditUsedInIncomeTax = incomeTax - incomeTaxAfterLoan;
  const loanCreditRemaining = loanCredit - loanCreditUsedInIncomeTax;

  // Final Income Tax
  incomeTax = incomeTaxAfterLoan;

  // Resident Tax Logic
  const totalDeductionsResident =
    socialInsurance +
    basicExemptionResident +
    idecoAmountYearly +
    lifeInsDed.resident +
    quakeInsDed.resident +
    spouseDedResident +
    genDepDedResident +
    specDepDedResident +
    medicalDed; // Medical applies to resident too

  let taxableResidentIncome = Math.max(0, totalGrossIncome - totalDeductionsResident);
  taxableResidentIncome = Math.floor(taxableResidentIncome / 1000) * 1000;

  // Adjustment Deduction (Chosei Kojo) - Very Simplified
  // Difference in Basic Exemption is huge now (950k vs 430k).
  // Standard calc: (Human deductions difference) - but usually capped at 2500 for high income.
  // User requested: "min(Diff, 2500) or similar" OR "Taxable * 5%".
  // Let's use the simple 2500 JPY as a placeholder for "Adjustment Deduction" to keep it safe,
  // or 5% of taxable if it's small?
  // Let's fix it to 2500 JPY deduction from the TAX AMOUNT (not income), as usually Chosei Kojo is a tax credit.
  // Actually Chosei Kojo reduces the tax amount.
  const adjustmentDeduction = 2500; 

  let residentTaxBeforeCredits = calculateResidentTax(taxableResidentIncome);
  
  // Apply Adjustment Deduction
  residentTaxBeforeCredits = Math.max(0, residentTaxBeforeCredits - adjustmentDeduction);

  // Apply Remaining Loan Credit to Resident Tax
  let residentTaxAfterLoan = residentTaxBeforeCredits;
  
  if (loanCreditRemaining > 0) {
    // 2025 Update: Branch by move-in date
    let residentDedCap = 97500; // Default (2022-) / 5%
    const limit5Percent = Math.floor(taxableIncome * 0.05);
    
    if (loanStartPeriod === '2014-2021') {
       // 7% or 136500
       const limit7Percent = Math.floor(taxableIncome * 0.07);
       residentDedCap = Math.min(136500, limit7Percent);
       // Wait, the rule is usually "Lesser of (7% of Taxable) or (136,500)".
       // My var name limit7Percent is correct.
    } else {
       // 5% or 97500
       residentDedCap = Math.min(97500, limit5Percent);
    }

    const residentDedAmount = Math.min(loanCreditRemaining, residentDedCap);
    residentTaxAfterLoan = Math.max(0, residentTaxAfterLoan - residentDedAmount);
  }

  let residentTax = residentTaxAfterLoan;

  // Furusato Tax Credit (Resident)
  if (furusatoAmountYearly > 2000) {
    const residentTaxCredit = (furusatoAmountYearly - 2000);
    residentTax = Math.max(0, residentTax - residentTaxCredit);
  }

  // Net Income (Cash Flow)
  // Net = (Salary + MiscIncome) - (Social + IncomeTax + ResidentTax + iDeCo + Furusato + MiscExp + InsurancePremiums)
  // *Insurance Premiums are cash out, but usually paid from post-tax money.
  // Wait, "Net Income" (Tedori) usually means Take-home pay.
  // Should we subtract iDeCo / Furusato / Insurance from "Net Income"?
  // Yes, they are expenses. But usually "Tedori" is Salary - Tax - Social.
  // Let's define "Disposable Income" (Tedori after fixed costs) vs "Take Home Pay".
  // The user asked for "Tedori". Standard is Salary - SS - Tax.
  // "iDeCo" is savings (asset), "Insurance" is expense.
  // Let's subtract Taxes and Social Insurance from (Gross + Misc).
  // Expenses like iDeCo/Insurance are discretionary (somewhat).
  // But to show "Money left in hand", we should probably subtract them if we treat them as inputs to the sim.

  // Let's adhere to: Net = (Gross + MiscIncome) - Social - Tax (Pure take-home potential).
  // (We don't subtract iDeCo/Insurance from "Net Income" visualization usually, as they are "spending/saving" choices).
  // However, the chart shows "Net Income" vs "Tax".
  // If I put 5M income and pay 2M in iDeCo, my tax is low, but my cash is gone.
  // Let's keep Net Income = Gross - Social - Tax (Pure take-home potential).

  const netIncome = (grossIncome + miscIncome) - socialInsurance - incomeTax - residentTax;

  return {
    grossIncome: grossIncome + miscIncome,
    employmentDeduction,
    socialInsurance,
    taxableIncome,
    incomeTax,
    residentTax,
    netIncome,
    paramBasicExemptionIncome: basicExemptionIncome,
    paramBasicExemptionResident: basicExemptionResident,
    totalIncomeDeductions: totalDeductionsIncome + charitableDeduction,
    medicalDeduction: medicalDed,
    adjustmentDeduction
  };
};
