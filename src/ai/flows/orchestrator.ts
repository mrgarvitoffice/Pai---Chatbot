'use server';

/**
 * @fileOverview The main orchestrator flow for Pai Chatbot.
 * This flow analyzes user queries, determines the intent, and routes
 * to the appropriate tool (e.g., tax calculator, SIP calculator).
 *
 * - orchestrate - The main function that handles user queries.
 * - OrchestratorInput - The input type for the orchestrate function.
 * - OrchestratorOutput - The return type for the orchestrate function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { calculateTax, calculateEMI, compoundFutureValue } from '@/lib/calculators';
import { calculateSip } from '@/lib/investment-calculators';
import { explainTaxCalculation } from './explain-tax-calculation';
import type { ExplainTaxCalculationInput } from './explain-tax-calculation';
import type { TaxCalculationResult, SipCalculationResult, EmiCalculationResult, CompoundInterestResult, CalculationResult } from '@/lib/types';

const OrchestratorInputSchema = z.object({
  query: z.string().describe('The user\'s message to the chatbot.'),
});
export type OrchestratorInput = z.infer<typeof OrchestratorInputSchema>;

const OrchestratorOutputSchema = z.object({
  response: z.string().describe('The final response to be shown to the user.'),
  sources: z.array(
    z.object({
      name: z.string(),
      url: z.string(),
      last_updated: z.string(),
    })
  ).optional().describe('A list of sources used to generate the response.'),
  calculationResult: z.custom<CalculationResult>().optional().describe('The structured result of a calculation, if performed.'),
});
export type OrchestratorOutput = z.infer<typeof OrchestratorOutputSchema>;

// A simple mock for sources as we don't have a DB set up
const sources = [
    {
      name: "Income Tax Department of India",
      url: "https://www.incomax.gov.in/",
      last_updated: "2024-04-01"
    }
];

const intentSchema = z.object({
    intent: z.enum(["TAX", "SIP", "EMI", "COMPOUND_INTEREST", "GENERAL"]).describe("The user's intent. Is it about Tax, SIP (Systematic Investment Plan), EMI (Equated Monthly Installment), Compound Interest, or something else?"),
    income: z.number().optional().describe("The user's annual income, for tax queries. For example, '15L' or '10 lakhs' becomes 1500000."),
    sip_monthly: z.number().optional().describe("The monthly investment amount for a SIP."),
    sip_years: z.number().optional().describe("The duration of the SIP in years."),
    sip_rate: z.number().optional().describe("The expected annual rate of return for the SIP."),
    emi_principal: z.number().optional().describe("The principal loan amount for an EMI calculation."),
    emi_years: z.number().optional().describe("The duration of the loan in years."),
    emi_rate: z.number().optional().describe("The annual interest rate for the loan."),
    ci_principal: z.number().optional().describe("The principal amount for compound interest calculation."),
    ci_years: z.number().optional().describe("The duration in years for compound interest calculation."),
    ci_rate: z.number().optional().describe("The annual interest rate for compound interest calculation."),
    ci_frequency: z.number().optional().describe("The compounding frequency per year (e.g., 1 for yearly, 4 for quarterly, 12 for monthly)."),
});

const intentPrompt = ai.definePrompt({
    name: 'intentPrompt',
    input: { schema: z.object({ query: z.string() }) },
    output: { schema: intentSchema },
    prompt: `You are an expert at analyzing user queries about Indian personal finance. Your task is to determine the user's intent and extract relevant entities.

    User Query: {{{query}}}

    Analyze the query and determine the following:
    1.  intent:
        - Set to "TAX" if the query is about calculating Indian income tax.
        - Set to "SIP" if the query is about calculating returns for a Systematic Investment Plan or mutual fund investment.
        - Set to "EMI" if the query is about calculating a loan EMI.
        - Set to "COMPOUND_INTEREST" if the query is about calculating compound interest on a lump sum.
        - Set to "GENERAL" for anything else.
    2.  income: If intent is "TAX", extract the annual income as a number. 'L' or 'lakh' means 100,000.
    3.  sip_monthly: If intent is "SIP", extract the monthly investment amount.
    4.  sip_years: If intent is "SIP", extract the investment duration in years.
    5.  sip_rate: If intent is "SIP", extract the expected annual rate of return. If not mentioned, default to 12.
    6.  emi_principal: If intent is "EMI", extract the loan principal amount.
    7.  emi_years: If intent is "EMI", extract the loan duration in years.
    8.  emi_rate: If intent is "EMI", extract the annual interest rate.
    9.  ci_principal: If intent is "COMPOUND_INTEREST", extract the principal amount.
    10. ci_years: If intent is "COMPOUND_INTEREST", extract the duration in years.
    11. ci_rate: If intent is "COMPOUND_INTEREST", extract the annual interest rate.
    12. ci_frequency: If intent is "COMPOUND_INTEREST", extract compounding frequency. Default to 1 (yearly) if not specified.

    Examples:
    - "How much tax on ₹15L for FY 25-26?" -> intent: "TAX", income: 1500000
    - "income tax on 10 lakh" -> intent: "TAX", income: 1000000
    - "tax on 20 lakhs" -> intent: "TAX", income: 2000000
    - "If I invest 5000 a month for 10 years what will I get?" -> intent: "SIP", sip_monthly: 5000, sip_years: 10, sip_rate: 12
    - "SIP of 10000 for 15 years at 10%" -> intent: "SIP", sip_monthly: 10000, sip_years: 15, sip_rate: 10
    - "EMI on 50 lakh home loan for 20 years at 8.5%" -> intent: "EMI", emi_principal: 5000000, emi_years: 20, emi_rate: 8.5
    - "Compound interest on 1 lakh for 10 years at 8%" -> intent: "COMPOUND_INTEREST", ci_principal: 100000, ci_years: 10, ci_rate: 8, ci_frequency: 1
    - "What is a mutual fund?" -> intent: "GENERAL"
    `,
});

export async function orchestrate(input: OrchestratorInput): Promise<OrchestratorOutput> {
    const intentResult = await intentPrompt(input);
    const intent = intentResult.output;

    if (intent?.intent === "TAX" && intent.income) {
        const fy = '2024-25'; // Defaulting FY for now
        const regime = 'new';
        
        const calculationResult = calculateTax(intent.income, fy, regime);

        const explanationInput: ExplainTaxCalculationInput = {
            income: intent.income,
            fy,
            tax_breakdown: calculationResult.tax_breakdown,
            total_tax: calculationResult.total_tax,
            sources: sources
        };

        const explanationResult = await explainTaxCalculation(explanationInput);
        
        return {
            response: explanationResult.explanation,
            sources: explanationResult.sources,
            calculationResult: { type: 'tax', data: calculationResult }
        };
    }

    if (intent?.intent === "SIP" && intent.sip_monthly && intent.sip_years) {
        const rate = intent.sip_rate || 12; // Default rate if not specified
        const sipResult = calculateSip(intent.sip_monthly, intent.sip_years, rate);
        
        const explanation = `Based on your inputs, a monthly SIP of ₹${intent.sip_monthly.toLocaleString('en-IN')} for ${intent.sip_years} years at an expected annual return of ${rate}% could grow to a future value of ₹${sipResult.future_value.toLocaleString('en-IN')}.`;

        return {
            response: explanation,
            calculationResult: { type: 'sip', data: sipResult }
        };
    }

    if (intent?.intent === "EMI" && intent.emi_principal && intent.emi_years && intent.emi_rate) {
        const months = intent.emi_years * 12;
        const emi = calculateEMI(intent.emi_principal, intent.emi_rate, months);
        const total_payment = emi * months;
        const total_interest = total_payment - intent.emi_principal;

        const emiResult: EmiCalculationResult = {
            principal: intent.emi_principal,
            annual_rate: intent.emi_rate,
            years: intent.emi_years,
            emi: emi,
            total_interest: total_interest,
            total_payment: total_payment
        };

        const explanation = `For a loan of ₹${intent.emi_principal.toLocaleString('en-IN')} over ${intent.emi_years} years at ${intent.emi_rate}% interest, your Equated Monthly Installment (EMI) would be ₹${emi.toLocaleString('en-IN')}.`;

        return {
            response: explanation,
            calculationResult: { type: 'emi', data: emiResult }
        };
    }

    if (intent?.intent === "COMPOUND_INTEREST" && intent.ci_principal && intent.ci_years && intent.ci_rate) {
        const frequency = intent.ci_frequency || 1;
        const futureValue = compoundFutureValue(intent.ci_principal, intent.ci_rate, intent.ci_years, frequency);
        const totalInterest = futureValue - intent.ci_principal;

        const ciResult: CompoundInterestResult = {
            principal: intent.ci_principal,
            annual_rate: intent.ci_rate,
            years: intent.ci_years,
            compounding_frequency: frequency,
            future_value: futureValue,
            total_interest: totalInterest
        };

        const explanation = `Investing ₹${intent.ci_principal.toLocaleString('en-IN')} for ${intent.ci_years} years at an annual rate of ${intent.ci_rate}%, compounded ${frequency === 1 ? 'annually' : (frequency === 4 ? 'quarterly' : 'monthly')}, would result in a future value of ₹${futureValue.toLocaleString('en-IN')}.`;

        return {
            response: explanation,
            calculationResult: { type: 'compound_interest', data: ciResult }
        };
    }

    return {
        response: "I can help with Indian income tax, SIP, EMI, and compound interest calculations. Please ask me a question like 'How much tax on ₹15L' or 'SIP of 5000 for 10 years'."
    };
}
