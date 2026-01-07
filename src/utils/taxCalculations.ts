
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
}

export const calculateEmploymentIncomeDeduction = (income: number): number => {
  if (income <= 1625000) {
    return 550000;
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

export const calculateSocialInsurance = (income: number): number => {
  return Math.floor(income * 0.15);
};

export const calculateLifeInsuranceDeduction = (premium: number): { income: number, resident: number } => {
  // New System Calculation (Simple version)
  // Income Tax
  let dedIncome = 0;
  if (premium <= 20000) dedIncome = premium;
  else if (premium <= 40000) dedIncome = premium * 0.5 + 10000;
  else if (premium <= 80000) dedIncome = premium * 0.25 + 20000;
  else dedIncome = 40000;

  // Resident Tax
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
  totalIncomeDeductions: number; // Added for detailed view
}

export const calculateTaxes = (inputs: TaxInputs): TaxResult => {
  const {
    grossIncome, idecoAmountYearly, furusatoAmountYearly,
    hasSpouse, numDependentsGen, numDependentsSpecific,
    lifeInsurancePremium, earthquakeInsurancePremium,
    miscIncome, miscExpenses,
    loanBalanceYearEnd = 0 // New Input
  } = inputs;

  // 1. Calculate Incomes
  const employmentDeduction = calculateEmploymentIncomeDeduction(grossIncome);
  let employmentIncome = Math.max(0, grossIncome - employmentDeduction);

  let miscNetIncome = Math.max(0, miscIncome - miscExpenses);

  const totalGrossIncome = employmentIncome + miscNetIncome; // Sou-Shotoku-Kingaku

  // 2. Deductions
  const socialInsurance = calculateSocialInsurance(grossIncome); // Approximation based on Salary only usually

  const basicExemptionIncome = 480000;
  const basicExemptionResident = 430000;

  // Insurance Deductions
  const lifeInsDed = calculateLifeInsuranceDeduction(lifeInsurancePremium);
  const quakeInsDed = calculateEarthquakeInsuranceDeduction(earthquakeInsurancePremium);

  // Dependent Deductions (Simplified for 2024/2025)
  // Spouse (Assuming income < 10M and spouse income low)
  const spouseDedIncome = hasSpouse ? 380000 : 0;
  const spouseDedResident = hasSpouse ? 330000 : 0;

  // General Dependents (16-18, 23-69)
  const genDepDedIncome = numDependentsGen * 380000;
  const genDepDedResident = numDependentsGen * 330000;

  // Specific Dependents (19-22)
  const specDepDedIncome = numDependentsSpecific * 630000; // Expanded amount
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
    specDepDedIncome;

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
    specDepDedResident;

  let taxableResidentIncome = Math.max(0, totalGrossIncome - totalDeductionsResident);
  taxableResidentIncome = Math.floor(taxableResidentIncome / 1000) * 1000;

  let residentTax = calculateResidentTax(taxableResidentIncome);

  // Apply Remaining Loan Credit to Resident Tax
  // Cap: 97,500 JPY
  if (loanCreditRemaining > 0) {
    const residentDedCap = 97500;
    const residentDedAmount = Math.min(loanCreditRemaining, residentDedCap);
    residentTax = Math.max(0, residentTax - residentDedAmount);
  }

  // Furusato Tax Credit (Resident)
  if (furusatoAmountYearly > 2000) {
    const residentTaxCredit = (furusatoAmountYearly - 2000);
    // Simplified Credit application (Re-calc fake original income tax for precise diff is hard, using simplified)
    // Note: Furusato credit is applied AFTER loan deduction usually? No, Loan deduction is Zeigaku Koujo. Furusato is also Zeigaku Koujo.
    // Order: Usually Housing Loan -> Furusato
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
    totalIncomeDeductions: totalDeductionsIncome + charitableDeduction
  };
};
