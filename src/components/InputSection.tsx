interface InputSectionProps {
    income: number;
    setIncome: (val: number) => void;
    ideco: number;
    setIdeco: (val: number) => void;
    furusato: number;
    setFurusato: (val: number) => void;
    hasSpouse: boolean;
    setHasSpouse: (val: boolean) => void;
    numDependentsGen: number;
    setNumDependentsGen: (val: number) => void;
    numDependentsSpecific: number;
    setNumDependentsSpecific: (val: number) => void;
    lifeInsurance: number;
    setLifeInsurance: (val: number) => void;
    earthquakeInsurance: number;
    setEarthquakeInsurance: (val: number) => void;
    miscIncome: number;
    setMiscIncome: (val: number) => void;
    miscExpenses: number;
    setMiscExpenses: (val: number) => void;
    loanBalance: number;
    setLoanBalance: (val: number) => void;
    // New Props
    loanStartPeriod: '2014-2021' | '2022-';
    setLoanStartPeriod: (val: '2014-2021' | '2022-') => void;
    socialInsuranceMode: 'auto' | 'manual';
    setSocialInsuranceMode: (val: 'auto' | 'manual') => void;
    socialInsuranceManualAmount: number;
    setSocialInsuranceManualAmount: (val: number) => void;
    medicalExpenses: number;
    setMedicalExpenses: (val: number) => void;
}

import NumberInput from './NumberInput';

export default function InputSection({
    income, setIncome, ideco, setIdeco, furusato, setFurusato,
    hasSpouse, setHasSpouse, numDependentsGen, setNumDependentsGen,
    numDependentsSpecific, setNumDependentsSpecific,
    lifeInsurance, setLifeInsurance, earthquakeInsurance, setEarthquakeInsurance,
    miscIncome, setMiscIncome, miscExpenses, setMiscExpenses,
    loanBalance, setLoanBalance,
    loanStartPeriod, setLoanStartPeriod,
    socialInsuranceMode, setSocialInsuranceMode,
    socialInsuranceManualAmount, setSocialInsuranceManualAmount,
    medicalExpenses, setMedicalExpenses
}: InputSectionProps) {
    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                    <span className="w-1 h-6 bg-blue-500 rounded-full mr-3"></span>
                    基本条件
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">額面年収 (Annual Income)</label>
                        <div className="relative">
                            <NumberInput
                                value={income}
                                onChange={(val) => setIncome(val)}
                                className="block w-full pl-4 pr-12 py-3 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors bg-slate-50 text-lg font-semibold"
                                placeholder="例: 5000000"
                            />
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                <span className="text-gray-500">円</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Advanced Settings */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                    <span className="w-1 h-6 bg-emerald-500 rounded-full mr-3"></span>
                    詳細設定 (扶養・保険・その他)
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Dependents */}
                    <div className="lg:col-span-3 pb-4 border-b border-slate-50">
                        <h3 className="text-sm font-bold text-slate-900 mb-3">家族・扶養</h3>
                        <div className="flex flex-wrap gap-6 items-center">
                            <label className="flex items-center space-x-3 cursor-pointer bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
                                <input
                                    type="checkbox"
                                    checked={hasSpouse}
                                    onChange={(e) => setHasSpouse(e.target.checked)}
                                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-slate-700">配偶者あり (収入160万以下/所得税非課税想定)</span>
                            </label>

                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">一般扶養親族 (16-18, 23-69歳)</label>
                                <NumberInput
                                    min="0"
                                    value={numDependentsGen}
                                    onChange={(val) => setNumDependentsGen(val)}
                                    className="block w-24 pl-3 pr-3 py-2 border-gray-200 rounded-lg text-sm bg-slate-50"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">特定扶養親族 (19-22歳)</label>
                                <NumberInput
                                    min="0"
                                    value={numDependentsSpecific}
                                    onChange={(val) => setNumDependentsSpecific(val)}
                                    className="block w-24 pl-3 pr-3 py-2 border-gray-200 rounded-lg text-sm bg-slate-50"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Social Insurance (New) */}
                    <div className="lg:col-span-3 pb-4 border-b border-slate-50">
                        <h3 className="text-sm font-bold text-slate-900 mb-3">社会保険料</h3>
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-200">
                                <button
                                    onClick={() => setSocialInsuranceMode('auto')}
                                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${socialInsuranceMode === 'auto' ? 'bg-white shadow-sm text-blue-600 font-medium' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    概算 (15%)
                                </button>
                                <button
                                    onClick={() => setSocialInsuranceMode('manual')}
                                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${socialInsuranceMode === 'manual' ? 'bg-white shadow-sm text-blue-600 font-medium' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    手入力
                                </button>
                            </div>

                            {socialInsuranceMode === 'manual' && (
                                <div className="relative animate-in fade-in slide-in-from-left-2">
                                    <NumberInput
                                        value={socialInsuranceManualAmount}
                                        onChange={(val) => setSocialInsuranceManualAmount(val)}
                                        className="block w-40 pl-3 pr-10 py-2 border-gray-200 rounded-lg text-sm bg-slate-50"
                                        placeholder="入力してください"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 text-xs">円</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Insurance & Medical */}
                    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 pb-4 border-b border-slate-50">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">生命保険料 (年間支払額)</label>
                            <div className="relative">
                                <NumberInput
                                    value={lifeInsurance}
                                    onChange={(val) => setLifeInsurance(val)}
                                    className="block w-full pl-4 pr-12 py-2 border-gray-200 rounded-lg bg-slate-50"
                                />
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <span className="text-gray-500 text-sm">円</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">地震保険料 (年間支払額)</label>
                            <div className="relative">
                                <NumberInput
                                    value={earthquakeInsurance}
                                    onChange={(val) => setEarthquakeInsurance(val)}
                                    className="block w-full pl-4 pr-12 py-2 border-gray-200 rounded-lg bg-slate-50"
                                />
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <span className="text-gray-500 text-sm">円</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">医療費 (年間総額)</label>
                            <div className="relative">
                                <NumberInput
                                    value={medicalExpenses}
                                    onChange={(val) => setMedicalExpenses(val)}
                                    className="block w-full pl-4 pr-12 py-2 border-gray-200 rounded-lg bg-slate-50"
                                    placeholder="0"
                                />
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <span className="text-gray-500 text-sm">円</span>
                                </div>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1">※ 10万円または所得の5%を超える分が控除</p>
                        </div>
                    </div>

                    {/* Housing Loan */}
                    <div className="lg:col-span-3 pb-4 border-b border-slate-50">
                        <h3 className="text-sm font-bold text-slate-900 mb-2">住宅ローン控除</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">年末借入残高</label>
                                <div className="relative w-full">
                                    <NumberInput
                                        value={loanBalance}
                                        onChange={(val) => setLoanBalance(val)}
                                        className="block w-full pl-4 pr-12 py-2 border-gray-200 rounded-lg bg-slate-50"
                                        placeholder="例: 30000000"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                        <span className="text-gray-500 text-sm">円</span>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400 mt-1">※ 借入限度額3,000万円・控除率0.7%で計算します</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">入居開始時期</label>
                                <div className="flex flex-col space-y-2">
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="loanStartPeriod"
                                            checked={loanStartPeriod === '2022-'}
                                            onChange={() => setLoanStartPeriod('2022-')}
                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-slate-700">2022年1月以降 (現行・上限9.75万)</span>
                                    </label>
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="loanStartPeriod"
                                            checked={loanStartPeriod === '2014-2021'}
                                            onChange={() => setLoanStartPeriod('2014-2021')}
                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-slate-700">2014年4月〜2021年12月 (旧・上限13.65万)</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tax Saving & Misc */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">iDeCo 掛金 (月額)</label>
                        <div className="relative">
                            <NumberInput
                                value={ideco}
                                onChange={(val) => setIdeco(val)}
                                className="block w-full pl-4 pr-12 py-2 border-gray-200 rounded-lg bg-slate-50"
                            />
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                <span className="text-gray-500 text-sm">円</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">ふるさと納税 (年間)</label>
                        <div className="relative">
                            <NumberInput
                                value={furusato}
                                onChange={(val) => setFurusato(val)}
                                className="block w-full pl-4 pr-12 py-2 border-gray-200 rounded-lg bg-slate-50"
                            />
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                <span className="text-gray-500 text-sm">円</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">雑所得 (副業など)</label>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <NumberInput
                                    value={miscIncome}
                                    onChange={(val) => setMiscIncome(val)}
                                    className="block w-full px-3 py-2 border-gray-200 rounded-lg bg-slate-50 text-sm"
                                    placeholder="収入"
                                />
                                <p className="text-xs text-slate-400 mt-1">収入金額</p>
                            </div>
                            <div>
                                <NumberInput
                                    value={miscExpenses}
                                    onChange={(val) => setMiscExpenses(val)}
                                    className="block w-full px-3 py-2 border-gray-200 rounded-lg bg-slate-50 text-sm"
                                    placeholder="経費"
                                />
                                <p className="text-xs text-slate-400 mt-1">必要経費</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
