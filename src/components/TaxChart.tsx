'use client';

import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { TaxResult } from '@/utils/taxCalculations';

ChartJS.register(ArcElement, Tooltip, Legend);

interface TaxChartProps {
    data: TaxResult;
}

export default function TaxChart({ data }: TaxChartProps) {
    const chartData = {
        labels: ['手取り (Net Income)', '社会保険料 (Social Insurance)', '所得税 (Income Tax)', '住民税 (Resident Tax)'],
        datasets: [
            {
                label: '金額 (円)',
                data: [
                    data.netIncome,
                    data.socialInsurance,
                    data.incomeTax,
                    data.residentTax
                ],
                backgroundColor: [
                    '#3b82f6', // Blue-500
                    '#f59e0b', // Amber-500
                    '#ef4444', // Red-500
                    '#10b981', // Emerald-500
                ],
                borderColor: [
                    '#2563eb',
                    '#d97706',
                    '#dc2626',
                    '#059669',
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
