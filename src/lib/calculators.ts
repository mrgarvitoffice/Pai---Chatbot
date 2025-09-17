import type { TaxCalculationResult } from './types';

export function calculateTax(
  income: number,
  fy: string, // Currently unused, for future expansion
  regime: 'new' | 'old' // Currently only 'new' is implemented
): TaxCalculationResult {
  const breakdown: Record<string, number> = {};

  const standardDeduction = 50000;
  const taxable_income = Math.max(0, income - standardDeduction);
  breakdown['Gross Income'] = income;
  breakdown['Standard Deduction'] = -standardDeduction;

  let tax = 0;

  if (taxable_income > 1500000) {
    tax += (taxable_income - 1500000) * 0.30;
  }
  if (taxable_income > 1200000) {
    tax += (Math.min(taxable_income, 1500000) - 1200000) * 0.20;
  }
  if (taxable_income > 900000) {
    tax += (Math.min(taxable_income, 1200000) - 900000) * 0.15;
  }
  if (taxable_income > 600000) {
    tax += (Math.min(taxable_income, 900000) - 600000) * 0.10;
  }
  if (taxable_income > 300000) {
    tax += (Math.min(taxable_income, 600000) - 300000) * 0.05;
  }

  // Rebate under Section 87A
  if (taxable_income <= 700000) {
    tax = 0;
  }
  
  breakdown['Tax Before Cess'] = tax;
  
  const cess = tax * 0.04;
  breakdown['Health & Edu Cess (4%)'] = cess;
  
  const total_tax = Math.round(tax + cess);

  return {
    total_tax,
    taxable_income,
    tax_breakdown: breakdown,
  };
}
