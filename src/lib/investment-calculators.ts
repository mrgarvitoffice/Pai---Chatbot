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
  const monthly_rate = annual_rate / 12 / 100;
  const n = years * 12; // number of months

  // FV = P * (((1 + i)^n - 1) / i) * (1 + i)
  const future_value = Math.round(
    monthly_investment * ((((1 + monthly_rate) ** n - 1) / monthly_rate) * (1 + monthly_rate))
  );

  const total_invested = monthly_investment * n;
  const total_gain = future_value - total_invested;

  return {
    monthly_investment,
    years,
    annual_rate,
    total_invested,
    total_gain,
    future_value,
  };
}
