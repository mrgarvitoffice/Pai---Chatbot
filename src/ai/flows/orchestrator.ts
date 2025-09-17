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
import { calculateTax, calculateEMI, compoundFutureValue, budgetAllocation, calculateHRA } from '@/lib/calculators';
import { calculateSip, calculateFd, calculateRd } from '@/lib/investment-calculators';
import { explainTaxCalculation } from './explain-tax-calculation';
import type { ExplainTaxCalculationInput } from './explain-tax-calculation';
import type { TaxCalculationResult, SipCalculationResult, EmiCalculationResult, CompoundInterestResult, BudgetAllocationResult, FdCalculationResult, RdCalculationResult, CalculationResult } from '@/lib/types';

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
      url: "https://www.incometax.gov.in/",
      last_updated: "2024-04-01"
    }
];

const intentSchema = z.object({
    intent: z.enum(["TAX", "SIP", "EMI", "COMPOUND_INTEREST", "BUDGET", "FD", "RD", "HRA", "80C_PLANNING", "GENERAL"]).describe("The user's intent."),
    income: z.number().optional().describe("The user's annual income. For example, '15L' or '10 lakhs' becomes 1500000."),
    regime: z.enum(['new', 'old', 'both']).optional().describe("The tax regime. 'both' if the user wants to compare."),
    monthly_rent: z.number().optional().describe("Monthly rent paid for HRA calculation."),
    metro_city: z.boolean().optional().describe("Whether the user lives in a metro city for HRA calculation."),
    basic_salary: z.number().optional().describe("User's basic annual salary for HRA calculation."),
    investment_80c: z.number().optional().describe("Amount to invest under section 80C."),
    sip_monthly: z.number().optional().describe("The monthly investment amount for a SIP."),
    sip_years: z.number().optional().describe("The duration of the SIP in years."),
    sip_rate: z.number().optional().describe("The expected annual rate of return for the SIP."),
    emi_principal: z.number().optional().describe("The principal loan amount for an EMI calculation."),
    emi_years: z.number().optional().describe("The duration of the loan in years."),
    emi_rate: z.number().optional().describe("The annual interest rate for the loan."),
    ci_principal: z.number().optional().describe("The principal amount for compound interest calculation."),
    ci_years: z.number().optional().describe("The duration in years for compound interest calculation."),
    ci_rate: z.number().optional().describe("The annual interest rate for compound interest calculation."),
    ci_frequency: z.number().optional().describe("The compounding frequency per year."),
    fd_principal: z.number().optional().describe("The principal amount for a Fixed Deposit."),
    fd_years: z.number().optional().describe("The duration in years for a Fixed Deposit."),
    fd_rate: z.number().optional().describe("The annual interest rate for a Fixed Deposit."),
    rd_monthly: z.number().optional().describe("The monthly investment amount for a Recurring Deposit."),
    rd_months: z.number().optional().describe("The duration in months for a Recurring Deposit."),
    rd_rate: z.number().optional().describe("The annual interest rate for a Recurring Deposit."),
});


const intentPrompt = ai.definePrompt({
    name: 'intentPrompt',
    input: { schema: z.object({ query: z.string() }) },
    output: { schema: intentSchema },
    prompt: `You are an expert at analyzing user queries about Indian personal finance. Your task is to determine the user's intent and extract relevant entities.

    User Query: {{{query}}}

    Analyze the query and determine the following:
    1.  intent:
        - "TAX": Calculating Indian income tax.
        - "HRA": Calculating HRA exemption.
        - "80C_PLANNING": User wants to know how much to invest in 80C.
        - "SIP": Calculating returns for a Systematic Investment Plan.
        - "EMI": Calculating a loan EMI.
        - "COMPOUND_INTEREST": Calculating compound interest.
        - "BUDGET": Allocating monthly income (e.g., 50/30/20 rule).
        - "FD": Fixed Deposit calculation.
        - "RD": Recurring Deposit calculation.
        - "GENERAL": For anything else.
    2. income: Extract the annual income as a number. 'L' or 'lakh' means 100,000. 'k' means 1000.
    3. regime: If the user mentions 'old', 'new', or wants to 'compare', set to 'old', 'new', or 'both'. Default to 'new' if not specified for a simple tax query.
    4. HRA details (monthly_rent, metro_city, basic_salary): Extract for HRA intent. If basic salary is not given, assume it's 50% of total income.
    5. 80C investment: Extract if the intent is 80C planning.
    
    Examples:
    - "How much tax on ₹15L for FY 25-26?" -> intent: "TAX", income: 1500000, regime: 'new'
    - "income tax on 10 lakh" -> intent: "TAX", income: 1000000, regime: 'new'
    - "tax on 20 lakhs" -> intent: "TAX", income: 2000000, regime: 'new'
    - "compare tax on 12 lakh for old vs new regime" -> intent: "TAX", income: 1200000, regime: 'both'
    - "HRA exemption on 8L salary with 20k monthly rent" -> intent: "HRA", income: 800000, monthly_rent: 20000
    - "How much should I invest in 80C if I earn 10L" -> intent: "80C_PLANNING", income: 1000000
    - "If I invest 5000 a month for 10 years what will I get?" -> intent: "SIP", sip_monthly: 5000, sip_years: 10, sip_rate: 12
    - "SIP of 10000 for 15 years at 10%" -> intent: "SIP", sip_monthly: 10000, sip_years: 15, sip_rate: 10
    - "EMI on 50 lakh home loan for 20 years at 8.5%" -> intent: "EMI", emi_principal: 5000000, emi_years: 20, emi_rate: 8.5
    - "Compound interest on 1 lakh for 10 years at 8%" -> intent: "COMPOUND_INTEREST", ci_principal: 100000, ci_years: 10, ci_rate: 8, ci_frequency: 1
    - "Distribute my 80000 salary with 50-30-20 rule" -> intent: "BUDGET", income: 80000
    - "FD of 1 lakh for 5 years at 7%" -> intent: "FD", fd_principal: 100000, fd_years: 5, fd_rate: 7
    - "RD of 2000 for 24 months at 6.5%" -> intent: "RD", rd_monthly: 2000, rd_months: 24, rd_rate: 6.5
    - "What is a mutual fund?" -> intent: "GENERAL"
    `,
});

export async function orchestrate(input: OrchestratorInput): Promise<OrchestratorOutput> {
    const intentResult = await intentPrompt(input);
    const intent = intentResult.output;

    if (intent?.intent === "TAX" && intent.income) {
        const fy = '2024-25';
        const regime = intent.regime || 'new';

        if (regime === 'both') {
            const newRegimeResult = calculateTax(intent.income, fy, 'new');
            const oldRegimeResult = calculateTax(intent.income, fy, 'old');
            const saving = oldRegimeResult.total_tax - newRegimeResult.total_tax;
            
            let explanation = `Comparing tax regimes for an income of ₹${intent.income.toLocaleString('en-IN')}:\n\n`;
            explanation += `New Regime Tax: ₹${newRegimeResult.total_tax.toLocaleString('en-IN')}\n`;
            explanation += `Old Regime Tax: ₹${oldRegimeResult.total_tax.toLocaleString('en-IN')}\n\n`;
            if (saving > 0) {
                explanation += `You could save ₹${saving.toLocaleString('en-IN')} by choosing the New Regime.`;
            } else if (saving < 0) {
                explanation += `You could save ₹${Math.abs(saving).toLocaleString('en-IN')} by choosing the Old Regime (assuming you have sufficient deductions).`;
            } else {
                explanation += `The tax amount is the same under both regimes.`;
            }

            return {
                response: explanation,
                calculationResult: { type: 'tax_comparison', data: { new: newRegimeResult, old: oldRegimeResult } }
            }
        } else {
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
    }

    if (intent?.intent === "HRA" && intent.income && intent.monthly_rent) {
        const basicSalary = intent.basic_salary || intent.income * 0.5; // Assume 50% if not provided
        const metro = intent.metro_city ?? false; // Assume non-metro if not specified
        const hraExemption = calculateHRA(basicSalary, intent.income, intent.monthly_rent * 12, metro);
        const explanation = `Based on a basic salary of ₹${basicSalary.toLocaleString('en-IN')} and annual rent of ₹${(intent.monthly_rent * 12).toLocaleString('en-IN')}, your estimated HRA exemption is ₹${hraExemption.toLocaleString('en-IN')}.`;
        return {
            response: explanation
        };
    }
    
    if (intent?.intent === "80C_PLANNING" && intent.income) {
        const maxInvestment = 150000;
        const oldRegimeResult = calculateTax(intent.income, '2024-25', 'old', 0);
        const oldRegimeWith80C = calculateTax(intent.income, '2024-25', 'old', maxInvestment);
        const taxSaving = oldRegimeResult.total_tax - oldRegimeWith80C.total_tax;
        const explanation = `By investing the full ₹${maxInvestment.toLocaleString('en-IN')} under Section 80C, you could potentially save up to ₹${taxSaving.toLocaleString('en-IN')} in taxes under the Old Regime. The New Regime does not offer 80C deductions.`;
        return {
            response: explanation
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

    if (intent?.intent === "BUDGET" && intent.income) {
        const budgetResult = budgetAllocation(intent.income);
        
        const explanation = `Here is a suggested budget allocation for your monthly income of ₹${intent.income.toLocaleString('en-IN')} based on the 50/30/20 rule. This is a guideline to help you manage your finances.`;

        return {
            response: explanation,
            calculationResult: { type: 'budget', data: budgetResult }
        };
    }

    if (intent?.intent === "FD" && intent.fd_principal && intent.fd_years && intent.fd_rate) {
        const fdResult = calculateFd(intent.fd_principal, intent.fd_rate, intent.fd_years, 4); // Default quarterly compounding
        
        const explanation = `A Fixed Deposit of ₹${intent.fd_principal.toLocaleString('en-IN')} for ${intent.fd_years} years at an annual rate of ${intent.fd_rate}% would give you a maturity value of ₹${fdResult.future_value.toLocaleString('en-IN')}.`;

        return {
            response: explanation,
            calculationResult: { type: 'fd', data: fdResult }
        };
    }
    
    if (intent?.intent === "RD" && intent.rd_monthly && intent.rd_months && intent.rd_rate) {
        const rdResult = calculateRd(intent.rd_monthly, intent.rd_rate, intent.rd_months);
        
        const explanation = `A monthly Recurring Deposit of ₹${intent.rd_monthly.toLocaleString('en-IN')} for ${intent.rd_months} months at an annual rate of ${intent.rd_rate}% would result in a maturity value of ₹${rdResult.future_value.toLocaleString('en-IN')}.`;

        return {
            response: explanation,
            calculationResult: { type: 'rd', data: rdResult }
        };
    }


    return {
        response: "I can help with Indian income tax, SIP, EMI, compound interest, and budget planning. Please ask me a question like 'How much tax on ₹15L' or 'Distribute 80k income'."
    };
}
