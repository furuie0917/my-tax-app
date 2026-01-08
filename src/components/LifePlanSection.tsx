
import { useState, useMemo } from 'react';
import { TaxInputs, TaxResult } from '@/utils/taxCalculations';
import { calculateChildGrowthSimulation, compareLoanVsNisa } from '@/utils/lifePlanCalculations';
import { TrendingUp, School, PiggyBank, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import NumberInput from './NumberInput';

interface LifePlanSectionProps {
    currentInputs: TaxInputs;
    currentResult: TaxResult;
}

export default function LifePlanSection({ currentInputs, currentResult }: LifePlanSectionProps) {
    // --- States ---
    const [childAge, setChildAge] = useState<number>(0);
    const [nisaRate, setNisaRate] = useState<number>(4); // Default 4%
    const [monthlySurplus, setMonthlySurplus] = useState<number>(30000); // 30,000 yen default

    // --- Calculations ---

    // 2. Child Growth
    const childGrowthData = useMemo(() => {
        if (childAge === 0) return []; // Assume 0 means "Not set" or newborn who is 0? 0 is valid age. 
        // Let's assume input is required. 
        return calculateChildGrowthSimulation(currentInputs, childAge);
    }, [currentInputs, childAge]);

    // 3. Loan vs NISA
    const loanVsNisa = useMemo(() => {
        // Only run if loan exists
        if (!currentInputs.loanBalanceYearEnd || currentInputs.loanBalanceYearEnd <= 0) return null;

        return compareLoanVsNisa(
            currentInputs.loanBalanceYearEnd,
            monthlySurplus,
            0.7, // Assume 0.7% loan rate
            nisaRate,
            10 // 10 years comparison
        );
    }, [currentInputs.loanBalanceYearEnd, monthlySurplus, nisaRate]);


    return (
        <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">

            <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-indigo-600 rounded-lg shadow-md">
                    <TrendingUp className="text-white w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">ライフプラン・アドバイス</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* 2. Loan vs NISA Card */}
                {currentInputs.loanBalanceYearEnd && currentInputs.loanBalanceYearEnd > 0 ? (
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col lg:col-span-2">
                        <h3 className="text-md font-bold text-slate-700 mb-4 flex items-center">
                            <span className="text-blue-500 mr-2">⚖️</span>
                            繰り上げ返済 vs 新NISA
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
                            {/* Inputs */}
                            <div className="space-y-4 bg-slate-50 p-4 rounded-lg">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">毎月の余剰資金</label>
                                    <div className="relative">
                                        <NumberInput
                                            value={monthlySurplus}
                                            onChange={(val) => setMonthlySurplus(val)}
                                            className="block w-full px-3 py-2 border-slate-200 rounded-md text-sm"
                                        />
                                        <span className="absolute right-3 top-2 text-xs text-slate-400">円</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">NISA想定利回り (%)</label>
                                    <input
                                        type="range"
                                        min="1" max="10" step="0.5"
                                        value={nisaRate}
                                        onChange={(e) => setNisaRate(Number(e.target.value))}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-xs text-slate-500">
                                        <span>1%</span>
                                        <span className="font-bold text-blue-600">{nisaRate}%</span>
                                        <span>10%</span>
                                    </div>
                                </div>
                                <div className="text-xs text-slate-400 mt-2">
                                    <p>・住宅ローン金利: 0.7% (固定)</p>
                                    <p>・期間: 10年後で比較</p>
                                </div>
                            </div>

                            {/* Result */}
                            {loanVsNisa && (
                                <div className="flex flex-col justify-center items-center text-center space-y-3">
                                    <div className={`text-lg font-bold flex items-center ${loanVsNisa.recommendation === 'NISA' ? 'text-emerald-600' : 'text-blue-600'}`}>
                                        {loanVsNisa.recommendation === 'NISA' ? (
                                            <>
                                                <TrendingUp className="w-5 h-5 mr-2" />
                                                NISA運用が有利
                                            </>
                                        ) : (
                                            <>
                                                <PiggyBank className="w-5 h-5 mr-2" />
                                                繰り上げ返済が堅実
                                            </>
                                        )}
                                    </div>

                                    <div className="text-sm text-slate-600">
                                        10年間の差額:
                                        <span className="font-bold text-lg ml-2">
                                            {new Intl.NumberFormat('ja-JP').format(Math.abs(loanVsNisa.difference))}
                                        </span>
                                        <span className="text-xs ml-1">円</span>
                                    </div>

                                    <div className="text-xs text-slate-400 bg-slate-50 p-2 rounded w-full">
                                        {loanVsNisa.recommendation === 'NISA' ?
                                            "ローン金利(0.7%)よりも高い運用益が見込めるため、資産形成にはNISAが適しています。" :
                                            "運用益よりも利息軽減効果が上回る、またはリスクを抑えた確実な返済が優先されます。"
                                        }
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 border-dashed flex items-center justify-center lg:col-span-2 text-slate-400 text-sm">
                        住宅ローン残高を入力すると、比較シミュレーションが表示されます。
                    </div>
                )}
            </div>

            {/* 3. Child Growth Timeline */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-md font-bold text-slate-700 mb-6 flex items-center">
                    <span className="text-orange-500 mr-2">👶</span>
                    お子様の成長と税金
                </h3>

                <div className="flex items-center space-x-4 mb-6 bg-orange-50 p-4 rounded-lg inline-block">
                    <label className="text-sm font-bold text-slate-700">お子様の現在の年齢:</label>
                    <div className="flex items-center">
                        <NumberInput
                            min="0" max="18"
                            value={childAge}
                            onChange={(val) => setChildAge(val)}
                            className="w-16 px-2 py-1 border border-orange-200 rounded text-center font-bold text-slate-700"
                        />
                        <span className="ml-2 text-sm text-slate-600">歳</span>
                    </div>
                </div>

                <div className="space-y-4">
                    {childGrowthData.length === 0 ? (
                        <p className="text-sm text-slate-500 text-center py-8">
                            年齢を入力すると、将来の減税タイミングが表示されます。
                        </p>
                    ) : (
                        childGrowthData.filter(d => d.isHighSchool || d.isCollege).length > 0 ? (
                            childGrowthData
                                .filter(d => d.isHighSchool || d.isCollege)
                                // Group by category roughly or just show next milestones
                                .reduce((acc, curr) => {
                                    // Deduplicate consecutive years of same category? 
                                    // User wants "Timeline". 
                                    // Let's show: "Start of High School (16yo)" and "Start of College (19yo)" and "Peak".
                                    // Actually, just showing the distinct periods is better.
                                    // Let's show the *First Year* of High School and *First Year* of College.
                                    const last = acc[acc.length - 1];
                                    if (!last) return [curr];

                                    // If same category (HS or College) as last, skip unless we want to show all years?
                                    // Let's show only the start of each phase.
                                    const lastType = last.isHighSchool ? 'HS' : (last.isCollege ? 'Univ' : 'None');
                                    const currType = curr.isHighSchool ? 'HS' : (curr.isCollege ? 'Univ' : 'None');

                                    if (lastType !== currType) acc.push(curr);
                                    return acc;
                                }, [] as typeof childGrowthData)
                                .map((point, idx) => (
                                    <div key={idx} className="relative pl-8 pb-8 border-l-2 border-slate-200 last:border-0 last:pb-0">
                                        <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${point.isCollege ? 'bg-orange-500 border-orange-100' : 'bg-green-500 border-green-100'}`}></div>

                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-800 flex items-center">
                                                    あと <span className="text-lg mx-1 text-slate-900">{point.yearOffset}</span> 年後
                                                    <span className={`ml-3 text-xs px-2 py-0.5 rounded-full ${point.isCollege ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                                                        {point.isCollege ? '特定扶養 (大学生など)' : '一般扶養 (高校生)'}
                                                    </span>
                                                </h4>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    {childAge + point.yearOffset}歳 〜
                                                    {point.isCollege && " (年収103万以下/バイト150万特例想定)"}
                                                </p>
                                            </div>
                                            <div className="mt-2 sm:mt-0 text-right">
                                                <span className="block text-xs text-slate-500">年間手取り増</span>
                                                <span className="text-xl font-bold text-emerald-600">
                                                    +{new Intl.NumberFormat('ja-JP').format(point.taxReduction)}
                                                </span>
                                                <span className="text-xs text-emerald-600 ml-1">円</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                        ) : (
                            <div key="none" className="p-4 bg-slate-50 rounded text-center text-sm text-slate-500">
                                まだ扶養控除の対象期間ではありません（16歳から適用開始）
                            </div>
                        )
                    )}
                </div>
            </div>

        </div>
    );
}
