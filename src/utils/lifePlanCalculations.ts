
import { calculateTaxes, TaxInputs, TaxResult } from './taxCalculations';

// --- Furusato Nozei Limit Calculator ---

/**
 * Calculates the maximum Furusato Nozei donation amount effectively (2000 yen burden).
 * Uses a binary search approach finding the point where:
 * TaxReduction(amount) = amount - 2000
 */
export const calculateFurusatoLimit = (baseInputs: TaxInputs): number => {
    // We need to find `amount` such that:
    // (BaseTax - TaxWithAmount) >= amount - 2000
    // If (BaseTax - TaxWithAmount) < amount - 2000, we are "losing" money (limit exceeded).

    // Clean inputs: set furusato to 0 for baseline
    const inputs0 = { ...baseInputs, furusatoAmountYearly: 0 };
    const res0 = calculateTaxes(inputs0);
    const totalTax0 = res0.incomeTax + res0.residentTax;

    let low = 0;
    let high = 1000000; // Cap search at 1M yen for safety/performance
    let limit = 0;

    // Binary search for the highest amount where Benefit >= Cost
    // Precision: 1000 yen
    while (high - low > 1000) {
        const mid = Math.floor((low + high) / 2);
        const inputsMid = { ...baseInputs, furusatoAmountYearly: mid };
        const resMid = calculateTaxes(inputsMid);
        const totalTaxMid = resMid.incomeTax + resMid.residentTax;

        const taxReduction = totalTax0 - totalTaxMid;
        const cost = mid - 2000;

        if (cost <= 0) {
            // Should not happen if mid > 2000. If mid <= 2000, technically limit is infinite? 
            // No, if mid <= 2000, cost is 0 or neg (gain). But we want max limit.
            // If mid is small, tax reduction is small.
            low = mid;
            continue;
        }

        if (taxReduction >= cost) {
            // It's worth it, try higher
            limit = mid;
            low = mid;
        } else {
            // Not worth it, too high
            high = mid;
        }
    }

    // Round down to nearest 1000
    return Math.floor(limit / 1000) * 1000;
};


// --- Child Growth Simulator ---

export interface ChildGrowthPoint {
    age: number;
    yearOffset: number;
    taxReduction: number; // vs Current Year (or vs Base Year with 0 kids?) User asked "years later... tax becomes X cheaper"
    isHighSchool: boolean; // 16-18
    isCollege: boolean; // 19-22
}

/**
 * Calculates tax changes for a child growing up from `currentAge` to 23.
 */
export const calculateChildGrowthSimulation = (baseInputs: TaxInputs, childAge: number): ChildGrowthPoint[] => {
    // Baseline: Calculate tax with *current* inputs but *excluding* the target child from existing dependent counts?
    // The prompt implies we add *one* child's trajectory.
    // "User inputs child's current age... visualize future deduction changes."
    // We assume the user *has* this child. 
    // If `baseInputs` already includes this child (e.g. they put numDependentsGen=1 for their 17yo), 
    // then "Current" is already cheap.
    // We want to show "When they become X, it gets cheaper". 
    // If they are 8, they are not deductible. 
    // So we simulate: Base = Tax with (Gen=0, Spec=0) (assuming this child is the only one, or we keep others constant).
    // Actually, simpler: 
    // Keep `baseInputs` static for *other* factors. 
    // Vary the *target child's* deduction status year by year.
    // We need to know if the user included this child in `baseInputs.numDependents...` to subtract them first?
    // Let's assume the "Child Growth Timer" is an *additional* analysis or we ask user "Age of Youngest Child".
    // If the user entered "Dependents: 0" in the main form, and "Child Age: 8" in the Life Plan, it's consistent.
    // If they entered "Dependents: 1" (for 17yo) and "Child Age: 17", it's consistent.
    // Strategy:
    // 1. Calculate a "No Target Child" Baseline.
    //    But we don't know if `baseInputs` includes them.
    //    Let's assume `baseInputs` reflects *current* reality.
    //    We will project *future* reality.
    //    Future Year X: Child Age = Current + X.
    //    Determine Child's Category (None, Gen, Spec).
    //    Determine Current Child's Category.
    //    Delta Dependents = FutureCat - CurrentCat.
    //    Apply Delta to `baseInputs`.

    const simulation: ChildGrowthPoint[] = [];
    const startTax = calculateTaxes(baseInputs).incomeTax + calculateTaxes(baseInputs).residentTax;

    // Determine Current Child Status to compute Delta
    const getCat = (age: number) => {
        if (age >= 16 && age <= 18) return 'gen';
        if (age >= 19 && age <= 22) return 'spec';
        // Note: 23+ is technically 'gen' again until independent, but usually "Timer" stops or highlights the Peak (Uni).
        // Prompt says: 16-18 (Gen), 19-22 (Spec).
        // It implies focus on these bands.
        return 'none';
    };

    const currentCat = getCat(childAge);

    // We simulate up to age 23 (End of Spec)
    const maxAge = 23;
    const yearsToSimulate = maxAge - childAge;

    if (yearsToSimulate <= 0) return []; // Already grown

    for (let year = 1; year <= yearsToSimulate; year++) {
        const age = childAge + year;
        const cat = getCat(age);

        // Create new inputs with adjusted dependents
        const newInputs = { ...baseInputs };

        // Adjust from "Current State"
        // If current was 'gen', and new is 'spec', we need -1 Gen, +1 Spec.
        if (currentCat === 'gen') newInputs.numDependentsGen = Math.max(0, newInputs.numDependentsGen - 1);
        else if (currentCat === 'spec') newInputs.numDependentsSpecific = Math.max(0, newInputs.numDependentsSpecific - 1);

        if (cat === 'gen') newInputs.numDependentsGen += 1;
        else if (cat === 'spec') newInputs.numDependentsSpecific += 1;

        const res = calculateTaxes(newInputs);
        const totalTax = res.incomeTax + res.residentTax;

        // Saving vs NOW
        const saved = startTax - totalTax;

        if (saved !== 0 || cat !== 'none') {
            simulation.push({
                age,
                yearOffset: year,
                taxReduction: saved,
                isHighSchool: cat === 'gen',
                isCollege: cat === 'spec'
            });
        }
    }

    return simulation;
};


// --- Loan vs NISA Simulator ---

export interface LoanVsNisaResult {
    loanSavings: number; // Interest saved by prepaying
    nisaGains: number;   // Gains from investing
    difference: number;  // NISA - Loan
    recommendation: 'NISA' | 'LOAN' | 'EVEN';
}

export const compareLoanVsNisa = (
    loanBalance: number,
    monthlySurplus: number,
    loanRatePercent: number = 0.7, // Fixed 0.7% default assumption
    nisaRatePercent: number, // User input (3-5%)
    years: number = 10
): LoanVsNisaResult => {
    // Scenario 1: Prepay Loan
    // Simple calc: Putting `monthlySurplus` into loan reduces principal.
    // Interest saved ~ PrincipalReduction * Rate * Time?
    // Accurate: 
    //   The surplus effectively earns "LoanRate" return compounded? 
    //   Yes, avoiding 0.7% interest is like earning 0.7% (tax free).
    //   So FV of Prepayments @ 0.7%

    const monthlyRateLoan = (loanRatePercent / 100) / 12;
    const monthlyRateNisa = (nisaRatePercent / 100) / 12;
    const months = years * 12;

    // FV of Annuity (Savings from Loan)
    // FV = P * [ (1+r)^n - 1 ] / r
    // P = monthlySurplus
    let fvLoanSav = 0;
    if (monthlyRateLoan === 0) {
        fvLoanSav = monthlySurplus * months;
    } else {
        fvLoanSav = monthlySurplus * (Math.pow(1 + monthlyRateLoan, months) - 1) / monthlyRateLoan;
    }
    // The "Gain" is FV - TotalPrincipalPaid
    const totalPrincipal = monthlySurplus * months;
    const loanInterestSaved = fvLoanSav - totalPrincipal;
    // Wait, "Total Benefit" of paying loan is not just interest saved.
    // It's the fact that you own equity.
    // Comparable:
    // Option A: Pay Loan. After 10 years, Asset = (Principal Paid + Interest Avoided).
    // Option B: NISA. After 10 years, Asset = (Principal Invested + Investment Returns).
    // Principal Paid == Principal Invested.
    // So we just compare Interest Avoided vs Investment Returns.
    // Yes.

    // FV of Annuity (NISA)
    let fvNisa = 0;
    if (monthlyRateNisa === 0) {
        fvNisa = monthlySurplus * months;
    } else {
        fvNisa = monthlySurplus * (Math.pow(1 + monthlyRateNisa, months) - 1) / monthlyRateNisa;
    }
    const nisaGains = fvNisa - totalPrincipal;

    return {
        loanSavings: Math.floor(loanInterestSaved),
        nisaGains: Math.floor(nisaGains),
        difference: Math.floor(nisaGains - loanInterestSaved),
        recommendation: nisaGains > loanInterestSaved ? 'NISA' : (nisaGains < loanInterestSaved ? 'LOAN' : 'EVEN')
    };
};
