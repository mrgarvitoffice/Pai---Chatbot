import type { ReactNode } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: ReactNode;
}

export interface TaxCalculationResult {
  income: number;
  fy: string;
  regime: 'new' | 'old';
  total_tax: number;
  taxable_income: number;
  tax_breakdown: Record<string, number>;
}

export interface TaxComparisonResult {
    new: TaxCalculationResult;
    old: TaxCalculationResult;
}

export interface SipCalculationResult {
  monthly_investment: number;
  years: number;
  annual_rate: number;
  total_invested: number;
  total_gain: number;
  future_value: number;
}

export interface ReverseSipResult {
  future_value: number;
  years: number;
  annual_rate: number;
  monthly_investment: number;
  total_invested: number;
  total_gain: number;
}

export interface EmiCalculationResult {
    principal: number;
    annual_rate: number;
    years: number;
    emi: number;
    total_interest: number;
    total_payment: number;
}

export interface CompoundInterestResult {
    principal: number;
    annual_rate: number;
    years: number;
    compounding_frequency: number;
    future_value: number;
    total_interest: number;
}

export interface BudgetAllocationResult {
    monthlyIncome: number;
    split: {
        needsPct: number;
        wantsPct: number;
        savingsPct: number;
    };
    needs: number;
    wants: number;
    savings: number;
}

export interface FdCalculationResult {
    principal: number;
    annual_rate: number;
    years: number;
    future_value: number;
    total_interest: number;
}

export interface RdCalculationResult {
    monthly_deposit: number;
    annual_rate: number;
    months: number;
    future_value: number;
    total_deposited: number;
    total_interest: number;
}

export interface SavingsRatioResult {
    monthlyIncome: number;
    monthlySavings: number;
    savingsRatio: number;
}

export interface DtiResult {
    monthlyIncome: number;
    monthlyEmi: number;
    dtiRatio: number;
}

export type CalculationResult = 
  | { type: 'tax'; data: TaxCalculationResult }
  | { type: 'tax_comparison', data: TaxComparisonResult }
  | { type: 'sip'; data: SipCalculationResult }
  | { type: 'reverse_sip', data: ReverseSipResult }
  | { type: 'emi'; data: EmiCalculationResult }
  | { type: 'compound_interest', data: CompoundInterestResult }
  | { type: 'budget', data: BudgetAllocationResult }
  | { type: 'fd', data: FdCalculationResult }
  | { type: 'rd', data: RdCalculationResult }
  | { type: 'savings_ratio', data: SavingsRatioResult }
  | { type: 'dti_ratio', data: DtiResult };
