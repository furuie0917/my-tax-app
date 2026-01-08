export interface OtherTaxInputs {
    monthlyConsumptionSpending: number; // Consumption Tax Base
    dailyTobaccoSticks: number;        // Tobacco Tax Base
    monthlyGasolineCost: number;       // Gasoline Tax Base
    yearlyPropertyTax: number;         // Property Tax (Direct Input)
    carCategory: string;               // Car Tax Category Key

    // Inheritance
    inheritanceAssets: number;         // Total Assets
    inheritanceHeirs: number;          // Number of Heirs
}

export interface OtherTaxResult {
    consumptionTax: number;
    tobaccoTax: number;
    gasolineTax: number;
    propertyTax: number;
    carTax: number;
    inheritanceTaxYearly: number; // Provision
    totalOtherTax: number;
}

export const CAR_TAX_RATES: Record<string, number> = {
    'none': 0,
    'kei': 10800,
    '1.0': 25000,
    '1.5': 30500,
    '2.0': 36000,
    '2.5': 43500,
    '3.0': 50000, // Estimation
    '3.5': 57000, // Estimation
    '4.0': 65500, // Estimation
    '4.5': 75500, // Estimation
    '6.0': 87000, // Estimation
    'over6.0': 110000 // Estimation
};

export const calculateOtherTaxes = (inputs: OtherTaxInputs): OtherTaxResult => {
    // 1. Consumption Tax
    // Assumed effective rate 9% on the spending amount
    const consumptionTax = (inputs.monthlyConsumptionSpending * 12) * 0.09;

    // 2. Tobacco Tax
    // 15.2 yen per stick
    const tobaccoTax = inputs.dailyTobaccoSticks * 365 * 15.2;

    // 3. Gasoline Tax
    // Cost / 175 * 56.6 * 12
    // 53.8 (Gasoline) + 2.8 (Oil/Coal) = 56.6
    const yearlyGasCost = inputs.monthlyGasolineCost * 12;
    // Avoid division by zero
    const gasolineTax = yearlyGasCost > 0 ? (yearlyGasCost / 175) * 56.6 : 0;

    // 4. Property Tax
    const propertyTax = inputs.yearlyPropertyTax;

    // 5. Car Tax
    const carTax = CAR_TAX_RATES[inputs.carCategory] || 0;

    // 6. Inheritance Tax (Provision)
    // Basic Deduction: 30M + 6M * Heirs
    const basicDeduction = 30000000 + (6000000 * Math.max(1, inputs.inheritanceHeirs));
    const taxableAssets = Math.max(0, inputs.inheritanceAssets - basicDeduction);

    // Simplified Tax Calculation (Aggregated)
    // Usually, we split by statutory share, apply rates, then sum up.
    // For "Simplified Estimate", let's apply a progressive rate on the total taxable (very rough).
    // Or better, assume 1 heir (worst case) or average division?
    // Let's assume standard division among heirs, calculate tax for one, multiply by heirs.
    // Statutory share: Children/Spouse... let's assume "Heirs" are children. Division 1/N.

    let totalInheritanceTax = 0;
    if (taxableAssets > 0) {
        // Calculate per heir share
        const perHeirShare = taxableAssets / Math.max(1, inputs.inheritanceHeirs);

        // Rate Table (Simplified)
        // 10M: 10%
        // 30M: 15% - 500k
        // 50M: 20% - 2M
        // 100M: 30% - 7M
        // 200M: 40% - 17M
        // 300M: 45% - 27M
        // 600M: 50% - 42M
        // Over: 55% - 72M

        const calcTaxForShare = (share: number) => {
            if (share <= 10000000) return share * 0.10;
            if (share <= 30000000) return share * 0.15 - 500000;
            if (share <= 50000000) return share * 0.20 - 2000000;
            if (share <= 100000000) return share * 0.30 - 7000000;
            if (share <= 200000000) return share * 0.40 - 17000000;
            if (share <= 300000000) return share * 0.45 - 27000000;
            if (share <= 600000000) return share * 0.50 - 42000000;
            return share * 0.55 - 72000000;
        };

        const taxPerHeir = calcTaxForShare(perHeirShare);
        totalInheritanceTax = taxPerHeir * inputs.inheritanceHeirs;
    }

    const inheritanceTaxYearly = totalInheritanceTax / 30; // Spread over 30 years

    const totalOtherTax = consumptionTax + tobaccoTax + gasolineTax + propertyTax + carTax + inheritanceTaxYearly;

    return {
        consumptionTax: Math.floor(consumptionTax),
        tobaccoTax: Math.floor(tobaccoTax),
        gasolineTax: Math.floor(gasolineTax),
        propertyTax: Math.floor(propertyTax),
        carTax: Math.floor(carTax),
        inheritanceTaxYearly: Math.floor(inheritanceTaxYearly),
        totalOtherTax: Math.floor(totalOtherTax)
    };
};
