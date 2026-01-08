import { OtherTaxInputs, CAR_TAX_RATES } from '@/utils/otherTaxCalculations';
import NumberInput from './NumberInput';
import { HelpCircle, Car, ShoppingCart, Flame, Fuel, Home, Landmark } from 'lucide-react';

interface OtherTaxSectionProps {
    inputs: OtherTaxInputs;
    setInputs: (val: OtherTaxInputs) => void;
}

const Tooltip = ({ text }: { text: string }) => (
    <div className="group relative flex items-center ml-2">
        <HelpCircle className="w-4 h-4 text-slate-400 cursor-help" />
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800"></div>
        </div>
    </div>
);

export default function OtherTaxSection({ inputs, setInputs }: OtherTaxSectionProps) {

    const update = (key: keyof OtherTaxInputs, val: any) => {
        setInputs({ ...inputs, [key]: val });
    };

    return (
        <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                <span className="w-1 h-6 bg-purple-500 rounded-full mr-3"></span>
                その他の税金計算
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* 1. Consumption Tax */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div className="flex items-center mb-3">
                        <ShoppingCart className="w-5 h-5 text-orange-500 mr-2" />
                        <label className="text-sm font-bold text-slate-700">消費税</label>
                        <Tooltip text="実効税率9%で算出します（軽減税率8%と10%の混合想定）" />
                    </div>
                    <div className="mb-1 text-xs text-slate-500">毎月の食費・雑費</div>
                    <div className="relative">
                        <NumberInput
                            value={inputs.monthlyConsumptionSpending}
                            onChange={(v) => update('monthlyConsumptionSpending', v)}
                            className="block w-full px-3 py-2 border-slate-200 rounded-md text-sm"
                            placeholder="例: 100000"
                        />
                        <span className="absolute right-3 top-2 text-xs text-slate-400">円</span>
                    </div>
                </div>

                {/* 2. Tobacco Tax */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div className="flex items-center mb-3">
                        <Flame className="w-5 h-5 text-gray-500 mr-2" />
                        <label className="text-sm font-bold text-slate-700">たばこ税</label>
                        <Tooltip text="1本あたり約15.2円の税金がかかります" />
                    </div>
                    <div className="mb-1 text-xs text-slate-500">1日の喫煙本数</div>
                    <div className="relative">
                        <NumberInput
                            value={inputs.dailyTobaccoSticks}
                            onChange={(v) => update('dailyTobaccoSticks', v)}
                            className="block w-full px-3 py-2 border-slate-200 rounded-md text-sm"
                        />
                        <span className="absolute right-3 top-2 text-xs text-slate-400">本</span>
                    </div>
                </div>

                {/* 3. Gasoline Tax */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div className="flex items-center mb-3">
                        <Fuel className="w-5 h-5 text-red-500 mr-2" />
                        <label className="text-sm font-bold text-slate-700">ガソリン税</label>
                        <Tooltip text="175円/Lのうち約56.6円（32%）が税金です" />
                    </div>
                    <div className="mb-1 text-xs text-slate-500">毎月のガソリン代</div>
                    <div className="relative">
                        <NumberInput
                            value={inputs.monthlyGasolineCost}
                            onChange={(v) => update('monthlyGasolineCost', v)}
                            className="block w-full px-3 py-2 border-slate-200 rounded-md text-sm"
                        />
                        <span className="absolute right-3 top-2 text-xs text-slate-400">円</span>
                    </div>
                </div>

                {/* 4. Car Tax */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div className="flex items-center mb-3">
                        <Car className="w-5 h-5 text-blue-500 mr-2" />
                        <label className="text-sm font-bold text-slate-700">自動車税</label>
                        <Tooltip text="排気量に応じた年額です" />
                    </div>
                    <div className="mb-1 text-xs text-slate-500">車種・排気量</div>
                    <select
                        value={inputs.carCategory}
                        onChange={(e) => update('carCategory', e.target.value)}
                        className="block w-full px-3 py-2 border-slate-200 rounded-md text-sm bg-white"
                    >
                        <option value="none">所有なし</option>
                        <option value="kei">軽自動車 (10,800円)</option>
                        <option value="1.0">1.0L以下 (25,000円)</option>
                        <option value="1.5">1.5L以下 (30,500円)</option>
                        <option value="2.0">2.0L以下 (36,000円)</option>
                        <option value="2.5">2.5L以下 (43,500円)</option>
                        <option value="3.0">3.0L以下 (50,000円)</option>
                        <option value="over6.0">6.0L超 (110,000円)</option>
                    </select>
                </div>

                {/* 5. Property Tax */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div className="flex items-center mb-3">
                        <Home className="w-5 h-5 text-indigo-500 mr-2" />
                        <label className="text-sm font-bold text-slate-700">固定資産税</label>
                        <Tooltip text="土地・家屋に対する年税額" />
                    </div>
                    <div className="mb-1 text-xs text-slate-500">年間の支払い額</div>
                    <div className="relative">
                        <NumberInput
                            value={inputs.yearlyPropertyTax}
                            onChange={(v) => update('yearlyPropertyTax', v)}
                            className="block w-full px-3 py-2 border-slate-200 rounded-md text-sm"
                        />
                        <span className="absolute right-3 top-2 text-xs text-slate-400">円</span>
                    </div>
                </div>

                {/* 6. Inheritance Tax (Reserve) */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div className="flex items-center mb-3">
                        <Landmark className="w-5 h-5 text-emerald-600 mr-2" />
                        <label className="text-sm font-bold text-slate-700">相続税 (積立)</label>
                        <Tooltip text="将来の相続税を30年で割った年換算額です" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <div className="mb-1 text-[10px] text-slate-500">想定資産額</div>
                            <NumberInput
                                value={inputs.inheritanceAssets}
                                onChange={(v) => update('inheritanceAssets', v)}
                                className="block w-full px-2 py-2 border-slate-200 rounded-md text-sm"
                                placeholder="資産"
                            />
                        </div>
                        <div>
                            <div className="mb-1 text-[10px] text-slate-500">法定相続人</div>
                            <div className="flex items-center">
                                <NumberInput
                                    min="1"
                                    value={inputs.inheritanceHeirs}
                                    onChange={(v) => update('inheritanceHeirs', v)}
                                    className="block w-full px-2 py-2 border-slate-200 rounded-md text-sm"
                                    placeholder="人数"
                                />
                                <span className="ml-1 text-xs text-slate-400">人</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
