import { LucideIcon, Wallet, Landmark, Building2, HeartPulse } from 'lucide-react';

interface SummaryCardProps {
    title: string;
    amount: number;
    icon: LucideIcon;
    color: string;
    subtext?: string;
}

const SummaryCard = ({ title, amount, icon: Icon, color, subtext }: SummaryCardProps) => (
    <div className={`bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start space-x-4 hover:shadow-md transition-shadow`}>
        <div className={`p-3 rounded-lg ${color} text-white`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-slate-800">
                {new Intl.NumberFormat('ja-JP').format(amount)}
                <span className="text-sm font-normal text-slate-400 ml-1">円</span>
            </h3>
            {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
        </div>
    </div>
);

interface SummaryCardsProps {
    data: {
        netIncome: number;
        incomeTax: number;
        residentTax: number;
        socialInsurance: number;
        totalOtherTax?: number;
    }
}

export default function SummaryCards({ data }: SummaryCardsProps) {
    const totalOther = data.totalOtherTax || 0;
    const totalTax = data.incomeTax + data.residentTax + totalOther; // Excluding Social Insurance from "Tax" label usually, but commonly "Tax & Social" is burden. 
    // "Total Annual Tax" usually implies taxes. Social Insurance is technically premium but acts like tax.
    // Let's explicitly show "Total Tax (Inc + Res + Other)".

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <SummaryCard
                title="手取り年収"
                amount={data.netIncome - totalOther}
                icon={Wallet}
                color="bg-blue-500"
                subtext="全ての税金を引いた額"
            />
            <SummaryCard
                title="社会保険料"
                amount={data.socialInsurance}
                icon={HeartPulse}
                color="bg-amber-500"
                subtext="健康保険・厚生年金など"
            />
            <SummaryCard
                title="税金総額 (年)"
                amount={totalTax}
                icon={Landmark}
                color="bg-purple-600"
                subtext={`所得・住民税 + その他 ${new Intl.NumberFormat('ja-JP').format(totalOther)}円`}
            />
            <SummaryCard
                title="所得税"
                amount={data.incomeTax}
                icon={Landmark}
                color="bg-red-500"
                subtext="国に納める税金"
            />
            <SummaryCard
                title="住民税"
                amount={data.residentTax}
                icon={Building2}
                color="bg-emerald-500"
                subtext="自治体に納める税金"
            />
        </div>
    );
}
