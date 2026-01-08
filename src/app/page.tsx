'use client';

import { useState, useMemo } from 'react';
import { calculateTaxes } from '@/utils/taxCalculations';
import InputSection from '@/components/InputSection';
import SummaryCards from '@/components/SummaryCards';
import LifePlanSection from '@/components/LifePlanSection';
import TaxChart from '@/components/TaxChart';
import { Calculator } from 'lucide-react';

export default function Home() {
  const [income, setIncome] = useState<number>(5000000);
  const [idecoMonthly, setIdecoMonthly] = useState<number>(0);
  const [furusato, setFurusato] = useState<number>(0);
  const [hasSpouse, setHasSpouse] = useState<boolean>(false);
  const [numDependentsGen, setNumDependentsGen] = useState<number>(0);
  const [numDependentsSpecific, setNumDependentsSpecific] = useState<number>(0);
  const [lifeInsurance, setLifeInsurance] = useState<number>(0);
  const [earthquakeInsurance, setEarthquakeInsurance] = useState<number>(0);
  const [miscIncome, setMiscIncome] = useState<number>(0);
  const [miscExpenses, setMiscExpenses] = useState<number>(0);
  const [loanBalance, setLoanBalance] = useState<number>(0);

  // New States
  const [loanStartPeriod, setLoanStartPeriod] = useState<'2014-2021' | '2022-'>('2022-');
  const [socialInsuranceMode, setSocialInsuranceMode] = useState<'auto' | 'manual'>('auto');
  const [socialInsuranceManualAmount, setSocialInsuranceManualAmount] = useState<number>(0);
  const [medicalExpenses, setMedicalExpenses] = useState<number>(0);

  const idecoYearly = idecoMonthly * 12;

  // Current Scenario
  const result = useMemo(() => {
    return calculateTaxes({
      grossIncome: income,
      idecoAmountYearly: idecoYearly,
      furusatoAmountYearly: furusato,
      hasSpouse,
      numDependentsGen,
      numDependentsSpecific,
      lifeInsurancePremium: lifeInsurance,
      earthquakeInsurancePremium: earthquakeInsurance,
      miscIncome,
      miscExpenses,
      loanBalanceYearEnd: loanBalance,
      // New Inputs
      loanStartPeriod,
      socialInsuranceMode,
      socialInsuranceManualAmount,
      medicalExpenses
    });
  }, [income, idecoYearly, furusato, hasSpouse, numDependentsGen, numDependentsSpecific, lifeInsurance, earthquakeInsurance, miscIncome, miscExpenses, loanBalance, loanStartPeriod, socialInsuranceMode, socialInsuranceManualAmount, medicalExpenses]);

  // Base Scenario (No Tax Saving measures)
  const baseResult = useMemo(() => {
    return calculateTaxes({
      grossIncome: income,
      idecoAmountYearly: 0,
      furusatoAmountYearly: 0,
      hasSpouse,
      numDependentsGen,
      numDependentsSpecific,
      lifeInsurancePremium: lifeInsurance,
      earthquakeInsurancePremium: earthquakeInsurance,
      miscIncome,
      miscExpenses,
      loanBalanceYearEnd: 0,
      loanStartPeriod: '2022-', // Default
      socialInsuranceMode, // Keep same mode to compare apple to apple? Usually 'Savings' means 'Measures we took'. 
      // If we change manual input in base, it's fair.
      socialInsuranceManualAmount,
      medicalExpenses // Keep consistent
    });
  }, [income, hasSpouse, numDependentsGen, numDependentsSpecific, lifeInsurance, earthquakeInsurance, miscIncome, miscExpenses, socialInsuranceMode, socialInsuranceManualAmount, medicalExpenses]);

  const taxSavings = (baseResult.incomeTax + baseResult.residentTax) - (result.incomeTax + result.residentTax);

  return (
    <main className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-3 bg-blue-600 rounded-lg shadow-lg">
            <Calculator className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">日本所得税・住民税シミュレーター (2025年改正対応)</h1>
            <p className="text-slate-500 text-sm">年収・扶養・保険料・住宅ローンなどを入力して手取りと税金を概算</p>
          </div>
        </div>

        {/* Input */}
        <InputSection
          income={income} setIncome={setIncome}
          ideco={idecoMonthly} setIdeco={setIdecoMonthly}
          furusato={furusato} setFurusato={setFurusato}
          hasSpouse={hasSpouse} setHasSpouse={setHasSpouse}
          numDependentsGen={numDependentsGen} setNumDependentsGen={setNumDependentsGen}
          numDependentsSpecific={numDependentsSpecific} setNumDependentsSpecific={setNumDependentsSpecific}
          lifeInsurance={lifeInsurance} setLifeInsurance={setLifeInsurance}
          earthquakeInsurance={earthquakeInsurance} setEarthquakeInsurance={setEarthquakeInsurance}
          miscIncome={miscIncome} setMiscIncome={setMiscIncome}
          miscExpenses={miscExpenses} setMiscExpenses={setMiscExpenses}
          loanBalance={loanBalance} setLoanBalance={setLoanBalance}
          // New Props
          loanStartPeriod={loanStartPeriod} setLoanStartPeriod={setLoanStartPeriod}
          socialInsuranceMode={socialInsuranceMode} setSocialInsuranceMode={setSocialInsuranceMode}
          socialInsuranceManualAmount={socialInsuranceManualAmount} setSocialInsuranceManualAmount={setSocialInsuranceManualAmount}
          medicalExpenses={medicalExpenses} setMedicalExpenses={setMedicalExpenses}
        />

        {/* Tax Saving Alert */}
        {(idecoYearly > 0 || furusato > 0 || loanBalance > 0) && (
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-6 text-white shadow-lg mb-8 animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-lg font-bold mb-2 flex items-center">
              💰 節税効果シミュレーション
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:space-x-8">
              <div>
                <span className="opacity-90 block text-sm">年間税金削減額</span>
                <span className="text-3xl font-extrabold">
                  {new Intl.NumberFormat('ja-JP').format(taxSavings)}
                </span>
                <span className="text-sm ml-1">円</span>
              </div>
              {furusato > 0 && (
                <div className="mt-2 sm:mt-0">
                  <span className="opacity-80 text-xs block">※ふるさと納税の実質負担2,000円を除いた効果</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <SummaryCards data={result} />

        {/* Life Plan Advice Section */}
        <LifePlanSection currentInputs={{
          grossIncome: income,
          idecoAmountYearly: idecoYearly,
          furusatoAmountYearly: furusato,
          hasSpouse,
          numDependentsGen,
          numDependentsSpecific,
          lifeInsurancePremium: lifeInsurance,
          earthquakeInsurancePremium: earthquakeInsurance,
          miscIncome,
          miscExpenses,
          loanBalanceYearEnd: loanBalance,
          loanStartPeriod,
          socialInsuranceMode,
          socialInsuranceManualAmount,
          medicalExpenses
        }} currentResult={result} />

        {/* Grid Layout for Chart and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Section */}
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 self-start">内訳グラフ</h3>
            <div className="w-full max-w-[280px]">
              <TaxChart data={result} />
            </div>
          </div>

          {/* Detailed List */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">計算詳細</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-slate-500">給与所得控除</span>
                <span className="font-medium text-slate-800">-{new Intl.NumberFormat('ja-JP').format(result.employmentDeduction)} 円</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-slate-500">社会保険料 ({socialInsuranceMode === 'auto' ? '概算' : '手入力'})</span>
                <span className="font-medium text-slate-800">-{new Intl.NumberFormat('ja-JP').format(result.socialInsurance)} 円</span>
              </div>

              {result.medicalDeduction > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-slate-500">医療費控除</span>
                  <span className="font-medium text-slate-800">-{new Intl.NumberFormat('ja-JP').format(result.medicalDeduction)} 円</span>
                </div>
              )}

              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-slate-500">基礎控除 (所得税/住民税)</span>
                <span className="font-medium text-slate-800">
                  {new Intl.NumberFormat('ja-JP').format(result.paramBasicExemptionIncome)} / {new Intl.NumberFormat('ja-JP').format(result.paramBasicExemptionResident)} 円
                </span>
              </div>

              {result.adjustmentDeduction > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-slate-500">住民税調整控除</span>
                  <span className="font-medium text-slate-800">-{new Intl.NumberFormat('ja-JP').format(result.adjustmentDeduction)} 円 (住民税額より控除)</span>
                </div>
              )}

              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-slate-500">課税所得 (所得税)</span>
                <span className="font-medium text-slate-800">{new Intl.NumberFormat('ja-JP').format(result.taxableIncome)} 円</span>
              </div>

              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-400 mb-2">※ 本シミュレーションは概算です。正確な税額は自治体や扶養状況により異なります。復興特別所得税を含みます。</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
