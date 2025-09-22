import type { BudgetAllocationResult, DtiResult, EmiCalculationResult, PortfolioAllocationResult, SavingsRatioResult, TaxCalculationResult, SipCalculationResult, FdCalculationResult, RdCalculationResult, ReverseSipResult, CompoundInterestResult, RetirementCorpusResult, TermInsuranceResult } from './types';

const round2 = (v: number) => Math.round((v + Number.EPSILON) * 100) / 100;

export function calculateTax(
  income: number,
  fy: string,
  regime: 'new' | 'old',
  deductions80C: number = 0,
): TaxCalculationResult {
  // NOTE: This function currently uses FY 2024-25 tax rules for all calculations.
  // A production system would need a rules engine to handle different fiscal years.
  const rules = {
      new: {
          slabs: [
              { from: 0, to: 300000, rate: 0 },
              { from: 300001, to: 600000, rate: 0.05 },
              { from: 600001, to: 900000, rate: 0.10 },
              { from: 900001, to: 1200000, rate: 0.15 },
              { from: 1200001, to: 1500000, rate: 0.20 },
              { from: 1500001, to: Infinity, rate: 0.30 },
          ],
          standardDeduction: 50000,
          rebateLimit: 700000,
      },
      old: {
          slabs: [
              { from: 0, to: 250000, rate: 0 },
              { from: 250001, to: 500000, rate: 0.05 },
              { from: 500001, to: 1000000, rate: 0.20 },
              { from: 1000001, to: Infinity, rate: 0.30 },
          ],
          standardDeduction: 50000,
          rebateLimit: 500000,
      }
  };

  const selectedRules = rules[regime];
  const breakdown: Record<string, number> = {};
  breakdown['Gross Income'] = income;

  let taxable_income = income;
  let tax = 0;

  if (regime === 'new') {
    taxable_income = Math.max(0, income - selectedRules.standardDeduction);
    breakdown['Standard Deduction'] = -selectedRules.standardDeduction;
    
    if (taxable_income <= selectedRules.rebateLimit) {
      tax = 0; // Tax rebate u/s 87A
    } else {
        let tempTax = 0;
        selectedRules.slabs.forEach(slab => {
            if (taxable_income > slab.from) {
                const taxableInSlab = Math.min(slab.to, taxable_income) - slab.from;
                tempTax += taxableInSlab * slab.rate;
            }
        });
        tax = tempTax;
    }

  } else { // Old Regime
    const totalDeductions = selectedRules.standardDeduction + deductions80C;
    taxable_income = Math.max(0, income - totalDeductions);
    breakdown['Standard Deduction'] = -selectedRules.standardDeduction;
    if (deductions80C > 0) breakdown['80C Deductions'] = -deductions80C;
    
    if (taxable_income <= selectedRules.rebateLimit) {
        tax = 0; // Rebate makes it zero
    } else {
        let tempTax = 0;
        selectedRules.slabs.forEach(slab => {
            if (taxable_income > slab.from) {
                const taxableInSlab = Math.min(slab.to, taxable_income) - slab.from;
                tempTax += taxableInSlab * slab.rate;
            }
        });
        tax = tempTax;
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


/** --------------- INVESTMENTS --------------- **/


/**
 * Calculates the future value of a Systematic Investment Plan (SIP).
 * @param monthly_investment The amount invested each month.
 * @param years The total number of years for the investment.
 * @param annual_rate The expected annual rate of return (in percent, e.g., 12 for 12%).
 * @returns An object containing the SIP calculation results.
 */
export function calculateSip(
  monthly_investment: number,
  years: number,
  annual_rate: number
): SipCalculationResult {
  if (monthly_investment <= 0 || years <= 0) {
    return {
      monthly_investment,
      years,
      annual_rate,
      total_invested: 0,
      total_gain: 0,
      future_value: 0,
    };
  }
  
  const r = annual_rate / 12 / 100;
  const n = Math.round(years * 12);

  if (r === 0) {
    const invested = round2(monthly_investment * n);
    return {
      monthly_investment,
      years,
      annual_rate,
      total_invested: invested,
      total_gain: 0,
      future_value: invested,
    };
  }

  const fv = monthly_investment * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  const invested = round2(monthly_investment * n);
  
  return {
    monthly_investment,
    years,
    annual_rate,
    future_value: round2(fv),
    total_invested: invested,
    total_gain: round2(fv - invested),
  };
}

/**
 * Calculates the required monthly SIP to reach a target future value.
 * @param future_value The target corpus amount.
 * @param years The total number of years for the investment.
 * @param annual_rate The expected annual rate of return (in percent).
 * @returns An object containing the reverse SIP calculation results.
 */
export function calculateReverseSip(
  future_value: number,
  years: number,
  annual_rate: number
): ReverseSipResult {
  if (future_value <= 0 || years <= 0) {
    return { future_value, years, annual_rate, monthly_investment: 0, total_invested: 0, total_gain: 0 };
  }

  const r = annual_rate / 12 / 100;
  const n = Math.round(years * 12);

  if (r === 0) {
    const monthly_investment = round2(future_value / n);
    return {
      future_value,
      years,
      annual_rate,
      monthly_investment,
      total_invested: future_value,
      total_gain: 0
    };
  }
  
  const monthly_investment = future_value / (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
  const total_invested = round2(monthly_investment * n);

  return {
    future_value,
    years,
    annual_rate,
    monthly_investment: round2(monthly_investment),
    total_invested: total_invested,
    total_gain: round2(future_value - total_invested)
  };
}


/**
 * Calculates the future value of a Fixed Deposit (FD).
 * @param principal The initial amount invested.
 * @param annual_rate The annual interest rate.
 * @param years The investment duration in years.
 * @param compounding_frequency The number of times interest is compounded per year.
 * @returns An object containing the FD calculation results.
 */
export function calculateFd(
    principal: number,
    annual_rate: number,
    years: number,
    compounding_frequency: number,
): FdCalculationResult {
    if (principal <= 0 || years <= 0) {
        return { principal, annual_rate, years, total_interest: 0, future_value: principal };
    }

    const rate = annual_rate / 100;
    const fv = principal * Math.pow(1 + rate / compounding_frequency, compounding_frequency * years);
    const interest = fv - principal;

    return {
        principal,
        annual_rate,
        years,
        future_value: round2(fv),
        total_interest: round2(interest)
    };
}


/**
 * Calculates the future value of a Recurring Deposit (RD).
 * @param monthly_deposit The amount deposited each month.
 * @param annual_rate The annual interest rate.
 * @param months The investment duration in months.
 * @returns An object containing the RD calculation results.
 */
export function calculateRd(
    monthly_deposit: number,
    annual_rate: number,
    months: number
): RdCalculationResult {
    if (monthly_deposit <= 0 || months <= 0) {
        return { monthly_deposit, annual_rate, months, total_deposited: 0, total_interest: 0, future_value: 0 };
    }

    const n = months;
    const i = annual_rate / 100;
    let maturityValue = 0;

    // RD maturity is calculated quarterly on principal. Simplified formula:
    // M = R * [(1+i/4)^n*4 - 1] / (1-(1+i/4)^(-1/3)) where i is annual rate, n is years.
    // For simplicity, we use a monthly iterative approach.
    const monthly_rate = annual_rate / 12 / 100;
    const fv = monthly_deposit * ((Math.pow(1 + monthly_rate, n) - 1) / monthly_rate) * (1 + monthly_rate);

    const total_deposited = monthly_deposit * months;
    const total_interest = fv - total_deposited;

    return {
        monthly_deposit,
        annual_rate,
        months,
        future_value: round2(fv),
        total_deposited: round2(total_deposited),
        total_interest: round2(total_interest)
    };
}

/**
 * Compound interest general calculator (compounding frequency m per year)
 */
export function compoundFutureValue(principal: number, annualRate: number, years: number, compoundingFreq: number = 1): CompoundInterestResult {
  if (years <= 0) {
    const fv = round2(principal);
    return { principal, annual_rate: annualRate, years, compounding_frequency: compoundingFreq, future_value: fv, total_interest: 0 };
  }
  const r = annualRate / 100;
  const m = compoundingFreq;
  const fv = principal * Math.pow(1 + r / m, m * years);
  const roundedFv = round2(fv);
  
  return {
    principal,
    annual_rate: annualRate,
    years,
    compounding_frequency: compoundingFreq,
    future_value: roundedFv,
    total_interest: round2(roundedFv - principal)
  };
}

/**
 * Calculates the required retirement corpus.
 */
export function calculateRetirementCorpus(
    { currentAge, retirementAge, monthlyExpenses, inflationRate = 6, lifeExpectancy = 85, preRetirementReturn = 12, postRetirementReturn = 7 } : 
    { currentAge: number; retirementAge: number; monthlyExpenses: number; inflationRate?: number; lifeExpectancy?: number; preRetirementReturn?: number; postRetirementReturn?: number }
): RetirementCorpusResult {

    const yearsToRetire = retirementAge - currentAge;
    const annualExpenses = monthlyExpenses * 12;
    
    const futureAnnualExpenses = annualExpenses * Math.pow(1 + inflationRate / 100, yearsToRetire);
    
    // Using perpetuity formula adjusted for inflation
    const requiredCorpus = (futureAnnualExpenses * (1 + inflationRate/100)) / ((postRetirementReturn/100) - (inflationRate/100));

    return {
        requiredCorpus: round2(requiredCorpus),
        assumptions: {
            currentAge,
            retirementAge,
            monthlyExpenses,
            inflationRate,
            lifeExpectancy,
            preRetirementReturn,
            postRetirementReturn
        }
    };
}

/**
 * Calculates a recommended term insurance cover.
 */
export function calculateTermInsuranceCover(annualIncome: number): TermInsuranceResult {
    const recommendedCover = annualIncome * 15; // 15x is a common recommendation
    return {
        annualIncome,
        recommendedCover: round2(recommendedCover)
    };
}
