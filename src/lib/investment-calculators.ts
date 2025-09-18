import type { SipCalculationResult, FdCalculationResult, RdCalculationResult, ReverseSipResult, CompoundInterestResult, RetirementCorpusResult, TermInsuranceResult } from './types';
const round2 = (v: number) => Math.round((v + Number.EPSILON) * 100) / 100;

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
