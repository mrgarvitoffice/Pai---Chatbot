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

export interface SipCalculationResult {
  monthly_investment: number;
  years: number;
  annual_rate: number;
  total_invested: number;
  total_gain: number;
  future_value: number;
}

export interface EmiCalculationResult {
    principal: number;
    annual_rate: number;
    years: number;
    emi: number;
    total_interest: number;
    total_payment: number;
}

export type CalculationResult = 
  | { type: 'tax'; data: TaxCalculationResult }
  | { type: 'sip'; data: SipCalculationResult }
  | { type: 'emi'; data: EmiCalculationResult };
