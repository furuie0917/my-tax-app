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
    }
}

export default function SummaryCards({ data }: SummaryCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <SummaryCard
                title="手取り年収"
                amount={data.netIncome}
                icon={Wallet}
                color="bg-blue-500"
                subtext="実際に使える金額"
            />
            <SummaryCard
                title="社会保険料"
                amount={data.socialInsurance}
                icon={HeartPulse}
                color="bg-amber-500"
                subtext="健康保険・厚生年金など"
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
