'use client';

import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { TaxResult } from '@/utils/taxCalculations';
import { OtherTaxResult } from '@/utils/otherTaxCalculations';

ChartJS.register(ArcElement, Tooltip, Legend);

interface TaxChartProps {
    data: TaxResult;
    otherTaxData?: OtherTaxResult;
}

export default function TaxChart({ data, otherTaxData }: TaxChartProps) {
    const chartData = {
        labels: [
            '手取り (Net Income)',
            '社会保険料 (Social Insurance)',
            '所得税 (Income Tax)',
            '住民税 (Resident Tax)',
            ...(otherTaxData ? [
                '食費等消費税 (Consumption)',
                '光熱費消費税 (Utilities)',
                '通信費消費税 (Internet)',
                'たばこ税 (Tobacco)',
                'ガソリン税 (Gasoline)',
                '固定資産税 (Property)',
                '自動車税 (Car)',
                '相続税積立 (Inheritance)'
            ] : [])
        ],
        datasets: [
            {
                label: '金額 (円)',
                data: [
                    Math.max(0, data.netIncome - (otherTaxData?.totalOtherTax || 0)), // Adjusted Net Income
                    data.socialInsurance,
                    data.incomeTax,
                    data.residentTax,
                    ...(otherTaxData ? [
                        otherTaxData.consumptionTax,
                        otherTaxData.utilitiesTax,
                        otherTaxData.internetTax,
                        otherTaxData.tobaccoTax,
                        otherTaxData.gasolineTax,
                        otherTaxData.propertyTax,
                        otherTaxData.carTax,
                        otherTaxData.inheritanceTaxYearly
                    ] : [])
                ],
                backgroundColor: [
                    '#3b82f6', // Blue-500 (Net Income)
                    '#f59e0b', // Amber-500 (Social)
                    '#ef4444', // Red-500 (Income)
                    '#10b981', // Emerald-500 (Resident)
                    // New Colors
                    '#f97316', // Orange-500 (Consumption)
                    '#facc15', // Yellow-400 (Utilities)
                    '#0ea5e9', // Sky-500 (Internet)
                    '#64748b', // Slate-500 (Tobacco)
                    '#dc2626', // Red-600 (Gasoline)
                    '#8b5cf6', // Violet-500 (Property)
                    '#06b6d4', // Cyan-500 (Car)
                    '#a855f7', // Purple-500 (Inheritance)
                ],
                borderColor: [
                    '#2563eb', // Blue-600
                    '#d97706', // Amber-600
                    '#dc2626', // Red-600
                    '#059669', // Emerald-600
                    '#ea580c',
                    '#eab308',
                    '#0284c7',
                    '#475569',
                    '#b91c1c',
                    '#7c3aed',
                    '#0891b2',
                    '#9333ea',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom' as const,
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        let label = context.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed !== null) {
                            label += new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(context.parsed);
                        }
                        return label;
                    }
                }
            }
        }
    };

    return <Doughnut data={chartData} options={options} />;
}
