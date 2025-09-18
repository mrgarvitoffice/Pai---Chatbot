import type { BudgetAllocationResult, DtiResult, EmiCalculationResult, PortfolioAllocationResult, SavingsRatioResult, TaxCalculationResult } from './types';

export function calculateTax(
  income: number,
  fy: string,
  regime: 'new' | 'old',
  deductions80C: number = 0,
): TaxCalculationResult {
  const breakdown: Record<string, number> = {};
  breakdown['Gross Income'] = income;

  let taxable_income = income;
  let tax = 0;
  
  if (regime === 'new') {
    const standardDeduction = 50000; // As per FY 2024-25 for new regime
    taxable_income = Math.max(0, income - standardDeduction);
    breakdown['Standard Deduction'] = -standardDeduction;
    
    if (taxable_income <= 700000) {
      tax = 0; // Tax rebate u/s 87A
    } else {
        let tempTax = 0;
        if (taxable_income > 300000)  tempTax += Math.min(300000, taxable_income - 300000) * 0.05;
        if (taxable_income > 600000)  tempTax += Math.min(300000, taxable_income - 600000) * 0.10;
        if (taxable_income > 900000)  tempTax += Math.min(300000, taxable_income - 900000) * 0.15;
        if (taxable_income > 1200000) tempTax += Math.min(300000, taxable_income - 1200000) * 0.20;
        if (taxable_income > 1500000) tempTax += (taxable_income - 1500000) * 0.30;
        tax = tempTax;
    }

  } else { // Old Regime
    const standardDeduction = 50000;
    const totalDeductions = standardDeduction + deductions80C;
    taxable_income = Math.max(0, income - totalDeductions);
    breakdown['Standard Deduction'] = -standardDeduction;
    if (deductions80C > 0) breakdown['80C Deductions'] = -deductions80C;
    
    const taxBeforeRebate = (() => {
        let tempTax = 0;
        if (taxable_income > 1000000) tempTax += (taxable_income - 1000000) * 0.30;
        if (taxable_income > 500000) tempTax += (Math.min(taxable_income, 1000000) - 500000) * 0.20;
        if (taxable_income > 250000) tempTax += (Math.min(taxable_income, 500000) - 250000) * 0.05;
        return tempTax;
    })();

    if (taxable_income <= 500000) {
        tax = 0; // Rebate makes it zero
    } else {
        tax = taxBeforeRebate;
    }
  }
  
  breakdown['Tax Before Cess'] = tax;
  const cess = tax * 0.04;
  breakdown['Health & Edu Cess (4%)'] = cess;
  const total_tax = Math.round(tax + cess);

  return {
    income,
    fy,
    regime,
    total_tax,
    taxable_income: round2(taxable_income),
    tax_breakdown: breakdown,
  };
}


/**
 * Calculates House Rent Allowance (HRA) exemption.
 * @param basicSalary Annual basic salary.
 * @param totalSalary Annual total salary (for DA assumption).
 * @param rentPaid Annual rent paid.
 * @param metroCity Lives in a metro city (true) or not (false).
 * @returns The amount of HRA exemption.
 */
export function calculateHRA(
  basicSalary: number,
  totalSalary: number,
  rentPaid: number,
  metroCity: boolean
): number {
  // Assuming DA is 40% of basic, a common scenario. HRA is calculated on Basic+DA.
  // This is an estimation; actual DA can vary.
  const dearnessAllowance = basicSalary * 0.40;
  const salaryForHRA = basicSalary + dearnessAllowance;

  const hraReceived = salaryForHRA * 0.50; // Assuming HRA component is 50% of basic+DA
  
  const condition1 = hraReceived;
  const condition2 = rentPaid - (salaryForHRA * 0.10);
  const condition3 = metroCity ? (salaryForHRA * 0.50) : (salaryForHRA * 0.40);

  return round2(Math.max(0, Math.min(condition1, condition2, condition3)));
}

/** helpers **/
const round2 = (v: number) => Math.round((v + Number.EPSILON) * 100) / 100;

/** --------------- LOANS & CREDIT --------------- **/

/**
 * Calculate EMI and other loan details.
 * @param principal principal amount (P)
 * @param annualRate annual nominal rate in percent (e.g., 8.5)
 * @param years total years for the loan
 * @returns An object with EMI, total interest, and total payment.
 */
export function calculateEMI(principal: number, annualRate: number, years: number): EmiCalculationResult {
  const months = years * 12;
  if (months <= 0) throw new Error("Loan duration must be positive.");
  if (principal <= 0) return { principal, annual_rate: annualRate, years, emi: 0, total_interest: 0, total_payment: 0 };
  
  const monthlyRate = annualRate / 12 / 100;
  
  let emi: number;
  if (monthlyRate === 0) {
    emi = principal / months;
  } else {
    const r = monthlyRate;
    const n = months;
    emi = principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  }
  
  const roundedEmi = round2(emi);
  const total_payment = round2(roundedEmi * months);
  const total_interest = round2(total_payment - principal);

  return {
    principal,
    annual_rate: annualRate,
    years,
    emi: roundedEmi,
    total_interest,
    total_payment,
  };
}


/** --------------- PERSONAL FINANCE UTILITIES --------------- **/

/**
 * Savings ratio: monthlySavings / monthlyIncome
 */
export function savingsRatio(monthlyIncome: number, monthlySavings: number): SavingsRatioResult {
  if (monthlyIncome <= 0) return { monthlyIncome, monthlySavings, savingsRatio: 0 };
  const ratio = round2((monthlySavings / monthlyIncome) * 100);
  return { monthlyIncome, monthlySavings, savingsRatio: ratio };
}

/**
 * Debt to Income Ratio (DTI): totalMonthlyDebtPayments / grossMonthlyIncome
 */
export function debtToIncomeRatio(monthlyIncome: number, monthlyEmi: number): DtiResult {
  if (monthlyIncome <= 0) return { monthlyIncome, monthlyEmi, dtiRatio: 0 };
  const ratio = round2((monthlyEmi / monthlyIncome) * 100);
  return { monthlyIncome, monthlyEmi, dtiRatio: ratio };
}

/**
 * Budget allocation planner (default 50-30-20)
 */
export function budgetAllocation(monthlyIncome: number, custom?: {needsPct?: number; wantsPct?: number; savingsPct?: number}): BudgetAllocationResult {
  const defaultSplit = {needsPct: 50, wantsPct: 30, savingsPct: 20};
  const split = {...defaultSplit, ...(custom || {})};
  const totalPct = (split.needsPct || 0) + (split.wantsPct || 0) + (split.savingsPct || 0);
  if (Math.abs(totalPct - 100) > 0.001) {
    throw new Error("Custom split must sum to 100");
  }
  const needs = round2(monthlyIncome * (split.needsPct! / 100));
  const wants = round2(monthlyIncome * (split.wantsPct! / 100));
  const savings = round2(monthlyIncome * (split.savingsPct! / 100));
  return {
    monthlyIncome: round2(monthlyIncome),
    split,
    needs,
    wants,
    savings
  };
}

/**
 * Calculates a recommended portfolio allocation based on age and risk appetite.
 * @param age The user's current age.
 * @param riskAppetite The user's risk appetite ('low', 'medium', 'high').
 * @returns An object with the recommended allocation percentages.
 */
export function calculatePortfolioAllocation(age: number, riskAppetite: 'low' | 'medium' | 'high'): PortfolioAllocationResult {
  // Start with the '100 - age' rule for a baseline equity allocation
  let baseEquity = Math.max(20, 100 - age);

  // Adjust equity based on risk appetite
  let equityPct: number;
  switch (riskAppetite) {
    case 'low':
      equityPct = Math.max(20, baseEquity - 20);
      break;
    case 'high':
      equityPct = Math.min(90, baseEquity + 15);
      break;
    case 'medium':
    default:
      equityPct = baseEquity;
      break;
  }
  
  // Ensure equity is within a sane range (e.g., 20% to 90%)
  equityPct = Math.min(90, Math.max(20, equityPct));
  
  // Allocate to gold
  const goldPct = 10;
  
  // The rest goes to debt
  const debtPct = 100 - equityPct - goldPct;

  return {
    age,
    riskAppetite,
    equity: Math.round(equityPct),
    debt: Math.round(debtPct),
    gold: Math.round(goldPct)
  };
}
