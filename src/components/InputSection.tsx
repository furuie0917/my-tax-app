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
    // New Prop
    loanBalance: number;
    setLoanBalance: (val: number) => void;
}

export default function InputSection({
    income, setIncome, ideco, setIdeco, furusato, setFurusato,
    hasSpouse, setHasSpouse, numDependentsGen, setNumDependentsGen,
    numDependentsSpecific, setNumDependentsSpecific,
    lifeInsurance, setLifeInsurance, earthquakeInsurance, setEarthquakeInsurance,
    miscIncome, setMiscIncome, miscExpenses, setMiscExpenses,
    loanBalance, setLoanBalance
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
                            <input
                                type="number"
                                value={income}
                                onChange={(e) => setIncome(Number(e.target.value))}
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
                                <span className="text-sm font-medium text-slate-700">配偶者あり (収入103万以下想定)</span>
                            </label>

                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">一般扶養親族 (16-18, 23-69歳)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={numDependentsGen}
                                    onChange={(e) => setNumDependentsGen(Number(e.target.value))}
                                    className="block w-24 pl-3 pr-3 py-2 border-gray-200 rounded-lg text-sm bg-slate-50"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">特定扶養親族 (19-22歳)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={numDependentsSpecific}
                                    onChange={(e) => setNumDependentsSpecific(Number(e.target.value))}
                                    className="block w-24 pl-3 pr-3 py-2 border-gray-200 rounded-lg text-sm bg-slate-50"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Insurance */}
                    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 pb-4 border-b border-slate-50">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">生命保険料 (年間支払額)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={lifeInsurance}
                                    onChange={(e) => setLifeInsurance(Number(e.target.value))}
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
                                <input
                                    type="number"
                                    value={earthquakeInsurance}
                                    onChange={(e) => setEarthquakeInsurance(Number(e.target.value))}
                                    className="block w-full pl-4 pr-12 py-2 border-gray-200 rounded-lg bg-slate-50"
                                />
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <span className="text-gray-500 text-sm">円</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Housing Loan */}
                    <div className="lg:col-span-3 pb-4 border-b border-slate-50">
                        <h3 className="text-sm font-bold text-slate-900 mb-2">住宅ローン控除</h3>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">年末借入残高</label>
                            <div className="relative w-full max-w-sm">
                                <input
                                    type="number"
                                    value={loanBalance}
                                    onChange={(e) => setLoanBalance(Number(e.target.value))}
                                    className="block w-full pl-4 pr-12 py-2 border-gray-200 rounded-lg bg-slate-50"
                                    placeholder="例: 30000000"
                                />
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <span className="text-gray-500 text-sm">円</span>
                                </div>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">※ 借入限度額3,000万円・控除率0.7%で計算します（一般新築等）</p>
                        </div>
                    </div>

                    {/* Tax Saving & Misc */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">iDeCo 掛金 (月額)</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={ideco}
                                onChange={(e) => setIdeco(Number(e.target.value))}
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
                            <input
                                type="number"
                                value={furusato}
                                onChange={(e) => setFurusato(Number(e.target.value))}
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
                                <input
                                    type="number"
                                    value={miscIncome}
                                    onChange={(e) => setMiscIncome(Number(e.target.value))}
                                    className="block w-full px-3 py-2 border-gray-200 rounded-lg bg-slate-50 text-sm"
                                    placeholder="収入"
                                />
                                <p className="text-xs text-slate-400 mt-1">収入金額</p>
                            </div>
                            <div>
                                <input
                                    type="number"
                                    value={miscExpenses}
                                    onChange={(e) => setMiscExpenses(Number(e.target.value))}
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
