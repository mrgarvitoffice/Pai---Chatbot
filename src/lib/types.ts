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
