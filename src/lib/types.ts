import type { ReactNode } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: ReactNode;
  rawContent?: string; // Add raw string content for TTS and download
  feedback?: 'like' | 'dislike';
  sources?: {
      name: string;
      url:string;
      last_updated: string;
  }[];
}

// Add a simple type for passing history to the AI
export interface HistoryMessage {
    role: 'user' | 'model'; // Genkit uses 'model' for the assistant
    content: string;
}

export interface TaxCalculationResult {
  id: string; // Ensure ID is part of the type
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
  id: string;
  monthly_investment: number;
  years: number;
  annual_rate: number;
  total_invested: number;
  total_gain: number;
  future_value: number;
}

export interface ReverseSipResult {
  id: string;
  future_value: number;
  years: number;
  annual_rate: number;
  monthly_investment: number;
  total_invested: number;
  total_gain: number;
}

export interface EmiCalculationResult {
    id: string;
    principal: number;
    annual_rate: number;
    years: number;
    emi: number;
    total_interest: number;
    total_payment: number;
}

export interface CompoundInterestResult {
    id: string;
    principal: number;
    annual_rate: number;
    years: number;
    compounding_frequency: number;
    future_value: number;
    total_interest: number;
}

export interface BudgetAllocationResult {
    id: string;
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
    id: string;
    principal: number;
    annual_rate: number;
    years: number;
    future_value: number;
    total_interest: number;
}

export interface RdCalculationResult {
    id: string;
    monthly_deposit: number;
    annual_rate: number;
    months: number;
    future_value: number;
    total_deposited: number;
    total_interest: number;
}

export interface RetirementCorpusResult {
    id: string;
    requiredCorpus: number;
    assumptions: {
        currentAge: number;
        retirementAge: number;
        monthlyExpenses: number;
        inflationRate: number;
        lifeExpectancy: number;
        preRetirementReturn: number;
        postRetirementReturn: number;
    };
}

export interface FireCalculationResult {
    id: string;
    currentAge: number;
    retirementAge: number;
    monthlyExpenses: number;
    monthlyInvestment: number;
    expectedReturn: number;
    targetCorpus: number;
    projectedCorpus: number;
    yearsToGoal: number;
    canRetire: boolean;
}

export interface DtiResult {
    id: string;
    monthlyIncome: number;
    monthlyEmi: number;
    dtiRatio: number;
}

export interface SavingsRatioResult {
    id: string;
    monthlyIncome: number;
    monthlySavings: number;
    savingsRatio: number;
}

export interface TermInsuranceResult {
    id: string;
    annualIncome: number;
    recommendedCover: number;
}

export interface PortfolioAllocationResult {
    id: string;
    age: number;
    riskAppetite: 'low' | 'medium' | 'high';
    equity: number;
    debt: number;
    gold: number;
}

export interface HraResult {
    id: string;
    basicSalary: number;
    hraReceived: number;
    rentPaid: number;
    metroCity: boolean;
    hraExemption: number;
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
  | { type: 'retirement', data: RetirementCorpusResult }
  | { type: 'fire', data: FireCalculationResult }
  | { type: 'dti', data: DtiResult }
  | { type: 'savings_ratio', data: SavingsRatioResult }
  | { type: 'term_insurance', data: TermInsuranceResult }
  | { type: 'portfolio_allocation', data: PortfolioAllocationResult }
  | { type: 'hra', data: HraResult };
