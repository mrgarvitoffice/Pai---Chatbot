import type { SipCalculationResult, FdCalculationResult, RdCalculationResult } from './types';

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
  const round2 = (v: number) => Math.round((v + Number.EPSILON) * 100) / 100;
  
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
    const round2 = (v: number) => Math.round((v + Number.EPSILON) * 100) / 100;

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
    const round2 = (v: number) => Math.round((v + Number.EPSILON) * 100) / 100;

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
