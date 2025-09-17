import type { SipCalculationResult } from './types';

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