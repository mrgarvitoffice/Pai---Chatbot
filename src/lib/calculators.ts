import type { BudgetAllocationResult, CompoundInterestResult, EmiCalculationResult, TaxCalculationResult } from './types';

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
  const standardDeduction = 50000;

  if (regime === 'new') {
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


// All functions use numbers (floating) and return values rounded to 2 decimals where appropriate.
// Keep numeric precision in mind for money — outputs are rounded for display but internal calculations use JS numbers.

export type AmortRow = {
  period: number;             // 1-indexed month number
  paymentDate?: string;       // optional ISO date string
  beginningBalance: number;
  emi: number;
  interest: number;
  principal: number;
  endingBalance: number;
  totalPaidToDate?: number;
};

export type AmortizationResult = {
  schedule: AmortRow[];
  totalInterest: number;
  totalPayment: number;
  monthlyEMI: number;
  originalPrincipal: number;
  originalMonths: number;
};

export type PrepaymentImpactResult = {
  original: AmortizationResult;
  adjusted: AmortizationResult;
  interestSaved: number;
  monthsSaved?: number;
};

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


/**
 * Generate amortization table (monthly)
 * @param principal principal amount
 * @param annualRate annual rate %
 * @param months total months
 * @param startDate optional ISO date string for first payment (month 1) — used to populate paymentDate
 */
export function amortizationTable(principal: number, annualRate: number, months: number, startDate?: string): AmortizationResult {
  if (months <= 0) throw new Error("months must be > 0");
  const emi = calculateEMI(principal, annualRate, months / 12).emi;
  const r = annualRate / 12 / 100;
  let outstanding = principal;
  const schedule: AmortRow[] = [];
  let totalInterest = 0;
  let totalPaid = 0;
  for (let i = 1; i <= months; i++) {
    const interest = round2(outstanding * r);
    let principalPaid = round2(emi - interest);
    // handle last payment rounding to fully close loan
    if (i === months) {
      principalPaid = round2(outstanding);
    }
    const payment = round2(principalPaid + interest);
    const ending = round2(outstanding - principalPaid);
    totalInterest += interest;
    totalPaid += payment;
    const row: AmortRow = {
      period: i,
      paymentDate: startDate ? new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() + (i - 1))).toISOString().slice(0,10) : undefined,
      beginningBalance: round2(outstanding),
      emi: payment,
      interest,
      principal: principalPaid,
      endingBalance: ending,
      totalPaidToDate: round2(totalPaid)
    };
    schedule.push(row);
    outstanding = ending;
    if (outstanding <= 0.005) { // safety break for floating precision
      break;
    }
  }
  const result: AmortizationResult = {
    schedule,
    totalInterest: round2(totalInterest),
    totalPayment: round2(totalPaid),
    monthlyEMI: emi,
    originalPrincipal: principal,
    originalMonths: months
  };
  return result;
}

/**
 * Prepayment impact calculator
 * Supports single prepayment event or multiple (prepayments array).
 * keepEmi: if true, keeps EMI same and reduces tenure; if false, keeps tenure same and reduces EMI.
 * Returns original vs adjusted amortization, interest saved and months saved (if applicable).
 */
export function prepaymentImpact(principal: number, annualRate: number, months: number, prepayments: {month: number; amount: number;}[], keepEmi: boolean = true, startDate?: string): PrepaymentImpactResult {
  // Validate prepayments: months must be within 1..months
  const original = amortizationTable(principal, annualRate, months, startDate);
  // We'll simulate month-by-month, applying prepayment at start of month after interest calc (common approach)
  const r = annualRate / 12 / 100;

  // Robust simulation:
  function simulateWithRecalc(keepEmiFlag: boolean) : AmortizationResult {
    let schedule: AmortRow[] = [];
    let out = principal;
    let currentEmi = calculateEMI(out, annualRate, months / 12).emi;
    let month = 1;
    let totalInt = 0;
    let totalP = 0;
    const premap = new Map<number, number>();
    for (const p of prepayments) {
      premap.set(p.month, (premap.get(p.month) || 0) + p.amount);
    }
    while (out > 0.005 && month < 10000) {
      const interest = round2(out * r);
      let principalComp = round2(currentEmi - interest);
      if (principalComp <= 0) {
        // EMI too small to cover interest; borrower would need to revise terms
        principalComp = 0;
      }
      if (principalComp >= out) {
        // last payment
        principalComp = round2(out);
      }
      const payment = round2(interest + principalComp);
      const beginning = round2(out);
      out = round2(out - principalComp);
      // apply prepayment after paying EMI
      if (premap.has(month)) {
        const amt = premap.get(month) || 0;
        const applied = Math.min(out, amt);
        out = round2(Math.max(0, out - applied));
      }
      totalInt += interest;
      totalP += payment;
      schedule.push({
        period: month,
        paymentDate: startDate ? new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() + (month - 1))).toISOString().slice(0,10) : undefined,
        beginningBalance: beginning,
        emi: payment,
        interest,
        principal: principalComp,
        endingBalance: round2(out),
        totalPaidToDate: round2(totalP)
      });
      // if keeping EMI false (i.e., keep tenure same), after prepayment recalc EMI for remaining months
      if (!keepEmiFlag) {
        const remainingMonths = Math.max(1, months - month);
        if (out > 0 && remainingMonths > 0) {
          currentEmi = calculateEMI(out, annualRate, remainingMonths / 12).emi;
        }
      } else {
        // if keepEmi true, EMI remains same; loan will finish earlier.
      }
      month++;
    }
    return {
      schedule,
      totalInterest: round2(totalInt),
      totalPayment: round2(totalP),
      monthlyEMI: round2(calculateEMI(principal, annualRate, months/12).emi),
      originalPrincipal: principal,
      originalMonths: months
    };
  }

  const adjusted = simulateWithRecalc(keepEmi);
  const interestSaved = round2(original.totalInterest - adjusted.totalInterest);
  const monthsSaved = (original.schedule.length - adjusted.schedule.length) || undefined;

  return {
    original,
    adjusted,
    interestSaved,
    monthsSaved
  };
}

/** --------------- WEALTH & GROWTH --------------- **/

/**
 * Compound interest general calculator (compounding frequency m per year)
 * FV = P * (1 + r/m)^(m*t)
 */
export function compoundFutureValue(principal: number, annualRate: number, years: number, compoundingFreq: number = 1): number {
  if (years <= 0) return round2(principal);
  const r = annualRate / 100;
  const m = compoundingFreq;
  const fv = principal * Math.pow(1 + r / m, m * years);
  return round2(fv);
}

/**
 * Lump sum future value
 */
export function lumpSumFutureValue(principal: number, annualRate: number, years: number): number {
  return compoundFutureValue(principal, annualRate, years, 1);
}

/**
 * Inflation-adjusted (real) return percentage
 * real = ((1+nominal)/(1+inflation) - 1) * 100
 */
export function inflationAdjustedReturn(nominalAnnualPct: number, inflationPct: number): number {
  const real = ( (1 + nominalAnnualPct/100) / (1 + inflationPct/100) - 1) * 100;
  return round2(real);
}

/**
 * Present Value of future amount FV at rate r for n years
 */
export function presentValue(futureValue: number, annualRate: number, years: number): number {
  const pv = futureValue / Math.pow(1 + annualRate/100, years);
  return round2(pv);
}

/**
 * Future Value of PV at rate r for n years (compounding annually)
 */
export function futureValue(pv: number, annualRate: number, years: number): number {
  return lumpSumFutureValue(pv, annualRate, years);
}

/**
 * Retirement corpus estimation.
 * Two methods:
 * 1) Safe Withdrawal Rate (SWR) method: corpus = desired_annual_expenses / SWR
 *    - desired_annual_expenses = desired_monthly_income * 12 * (1 + inflation)^(years_to_retirement)
 * 2) Capitalization / perpetuity-adjusted method:
 *    corpus = desired_annual_expenses / (expected_return_post_retirement - inflation)  [if numerator positive]
 *
 * Returns both methods and suggested monthly SIP if user provides years_to_retirement and expected pre-retirement return.
 */
export function retirementCorpusEstimate(params: {
  desiredMonthlyIncomeToday: number;
  yearsToRetirement: number;
  inflationPct: number;
  swrPct?: number; // default 4%
  expectedReturnPostRetirementPct?: number; // e.g., 6%
  currentSavings?: number;
  expectedReturnPreRetirementPct?: number;
}): {
  desiredAnnualExpenseAtRetirement: number;
  corpusBySWR: number;
  corpusByPerpetuity?: number;
  monthlySipNeeded?: number;
  assumptions: any;
} {
  const {
    desiredMonthlyIncomeToday,
    yearsToRetirement,
    inflationPct,
    swrPct = 4,
    expectedReturnPostRetirementPct = 6,
    currentSavings = 0,
    expectedReturnPreRetirementPct = 8
  } = params;

  const desiredAnnualToday = desiredMonthlyIncomeToday * 12;
  // inflate to retirement
  const desiredAnnualAtRetirement = desiredAnnualToday * Math.pow(1 + inflationPct/100, yearsToRetirement);
  // SWR method
  const corpusBySWR = desiredAnnualAtRetirement / (swrPct/100);

  // Perpetuity-ish method (expectedReturnPostRetirement - inflation)
  const denom = (expectedReturnPostRetirementPct/100) - (inflationPct/100);
  let corpusByPerpetuity: number | undefined = undefined;
  if (denom > 0) {
    corpusByPerpetuity = desiredAnnualAtRetirement / denom;
  }

  // Monthly SIP needed (assuming expectedReturnPreRetirementPct compounding monthly)
  const r = expectedReturnPreRetirementPct / 12 / 100;
  const n = yearsToRetirement * 12;
  let monthlySip = undefined;
  if (n > 0) {
    // Use FV target = corpusBySWR (prefer safe withdrawal method as target). Solve for monthly.
    const target = corpusBySWR - currentSavings * Math.pow(1 + expectedReturnPreRetirementPct/100, yearsToRetirement);
    if (r === 0) {
      monthlySip = target / n;
    } else {
      monthlySip = target * r / (Math.pow(1 + r, n) - 1) / (1 + r);
    }
    monthlySip = round2(Math.max(0, monthlySip));
  }

  return {
    desiredAnnualExpenseAtRetirement: round2(desiredAnnualAtRetirement),
    corpusBySWR: round2(corpusBySWR),
    corpusByPerpetuity: corpusByPerpetuity ? round2(corpusByPerpetuity) : undefined,
    monthlySipNeeded: monthlySip,
    assumptions: {
      swrPct,
      expectedReturnPostRetirementPct,
      expectedReturnPreRetirementPct,
      inflationPct
    }
  };
}

/** --------------- PERSONAL FINANCE UTILITIES --------------- **/

/**
 * Savings ratio
 * monthlySavings / monthlyIncome
 */
export function savingsRatio(monthlyIncome: number, monthlySavings: number): number {
  if (monthlyIncome <= 0) return 0;
  return round2(monthlySavings / monthlyIncome * 100);
}

/**
 * Debt to Income Ratio (DTI)
 * totalMonthlyDebtPayments / grossMonthlyIncome
 */
export function debtToIncomeRatio(grossMonthlyIncome: number, totalMonthlyDebtPayments: number): number {
  if (grossMonthlyIncome <= 0) return 0;
  return round2(totalMonthlyDebtPayments / grossMonthlyIncome * 100);
}

/**
 * Net worth
 * sum(assets) - sum(liabilities)
 */
export function netWorth(assets: number[], liabilities: number[]): number {
  const a = assets.reduce((s, v) => s + v, 0);
  const l = liabilities.reduce((s, v) => s + v, 0);
  return round2(a - l);
}

/**
 * Budget allocation planner (default 50-30-20)
 * Accept custom splits optionally (object with needs,wants,savings percentages that sum to 100)
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
