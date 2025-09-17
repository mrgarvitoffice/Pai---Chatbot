import type { ReactNode } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: ReactNode;
}

export interface TaxCalculationResult {
  total_tax: number;
  taxable_income: number;
  tax_breakdown: Record<string, number>;
}
