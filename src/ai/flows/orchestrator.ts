'use server';

/**
 * @fileOverview The main orchestrator flow for Pai Chatbot.
 * This flow analyzes user queries, determines the intent, and routes
 * to the appropriate tool (e.g., tax calculator, SIP calculator, or knowledge base).
 *
 * - orchestrate - The main function that handles user queries.
 * - OrchestratorInput - The input type for the orchestrate function.
 * - OrchestratorOutput - The return type for the orchestrate function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { calculateTax, calculateEMI, compoundFutureValue, budgetAllocation } from '@/lib/calculators';
import { calculateSip, calculateFd, calculateRd, calculateReverseSip } from '@/lib/investment-calculators';
import { explainTaxCalculation } from './explain-tax-calculation';
import type { ExplainTaxCalculationInput } from './explain-tax-calculation';
import { compareTaxRegimes } from './compare-tax-regimes';
import type { CompareTaxRegimesInput } from './compare-tax-regimes';
import type { TaxCalculationResult, SipCalculationResult, EmiCalculationResult, CompoundInterestResult, BudgetAllocationResult, FdCalculationResult, RdCalculationResult, CalculationResult, ReverseSipResult } from '@/lib/types';
import { searchKnowledgeBase } from '../tools/knowledge-base';

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
    intent: z.enum(["TAX", "SIP", "REVERSE_SIP", "EMI", "COMPOUND_INTEREST", "BUDGET", "FD", "RD", "GENERAL"]).describe("The user's intent."),
    income: z.number().optional().describe("The user's annual or monthly income. For example, '15L' or '10 lakhs' becomes 1500000. '80k salary' becomes 80000."),
    regime: z.enum(['new', 'old', 'both']).optional().describe("The tax regime. 'both' if the user wants to compare."),
    sip_monthly: z.number().optional().describe("The monthly investment amount for a SIP."),
    sip_years: z.number().optional().describe("The duration of the SIP in years."),
    sip_rate: z.number().optional().describe("The expected annual rate of return for the SIP."),
    sip_target: z.number().optional().describe("The target corpus for a reverse SIP calculation."),
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

const generalResponsePrompt = ai.definePrompt({
    name: 'generalResponsePrompt',
    tools: [searchKnowledgeBase],
    prompt: `You are Pai, an expert Indian personal finance assistant. Your primary goal is to provide accurate, helpful answers based on the information provided by the searchKnowledgeBase tool.

    User Query: {{{query}}}

    Instructions:
    1.  Use the searchKnowledgeBase tool to find relevant information about the user's query.
    2.  If the tool returns relevant information, synthesize it to construct a clear and concise answer.
    3.  Crucially, you MUST cite your sources. At the end of your response, add a "Source: [Source Name]" line, using the source name from the tool's output.
    4.  If the tool returns no relevant information or you cannot answer based on the provided context, politely state that you don't have enough information to answer that specific question. Do NOT invent answers.
    5.  Keep the response conversational and easy to understand.
    `
});

const intentPrompt = ai.definePrompt({
    name: 'intentPrompt',
    input: { schema: z.object({ query: z.string() }) },
    output: { schema: intentSchema },
    prompt: `You are an expert at analyzing user queries about Indian personal finance, including queries in English, Hindi, and Hinglish. Your task is to determine the user's intent and extract relevant entities.

    User Query: {{{query}}}

    Analyze the query and determine the following:
    1.  intent:
        - "TAX": Calculating Indian income tax. Also for questions about tax regimes, deductions (80C, 80D), HRA, and how investments are taxed.
        - "SIP": Calculating returns for a Systematic Investment Plan.
        - "REVERSE_SIP": User has a target amount and wants to know the required monthly SIP.
        - "EMI": Calculating a loan EMI.
        - "COMPOUND_INTEREST": Calculating compound interest or lump sum growth.
        - "BUDGET": Allocating monthly income (e.g., 50/30/20 rule).
        - "FD": Fixed Deposit calculation.
        - "RD": Recurring Deposit calculation.
        - "GENERAL": For anything else (e.g., "What is a mutual fund?", "Explain inflation", "म्यूचुअल फंड क्या है?", "Is term insurance better than ULIP?").
    2. income: Extract the annual income as a number. 'L' or 'lakh' means 100,000. 'k' means 1000. 'cr' or 'crore' means 10,000,000.
    3. regime: If the user mentions 'old', 'new', 'purani', 'naya', or wants to 'compare' or 'tulna', set to 'old', 'new', or 'both'. Default to 'new' if not specified for a simple tax query.
    
    Examples:
    - "How much tax on ₹15L for FY 25-26?" -> intent: "TAX", income: 1500000, regime: 'new'
    - "15L pe kitna tax lagega?" -> intent: "TAX", income: 1500000, regime: 'new'
    - "compare tax on 12 lakh for old vs new regime" -> intent: "TAX", income: 1200000, regime: 'both'
    - "How are mutual fund gains taxed?" -> intent: "GENERAL"
    - "What deductions can I claim under Section 80C?" -> intent: "GENERAL"
    - "If I invest 5000 a month for 10 years what will I get?" -> intent: "SIP", sip_monthly: 5000, sip_years: 10, sip_rate: 12
    - "How much should I invest monthly to get ₹1 crore in 25 years at 10%?" -> intent: "REVERSE_SIP", sip_target: 10000000, sip_years: 25, sip_rate: 10
    - "EMI on 50 lakh home loan for 20 years at 8.5%" -> intent: "EMI", emi_principal: 5000000, emi_years: 20, emi_rate: 8.5
    - "Compound interest on 1 lakh for 10 years at 8%" -> intent: "COMPOUND_INTEREST", ci_principal: 100000, ci_years: 10, ci_rate: 8, ci_frequency: 1
    - "FD of 50000 for 5 years at 7%" -> intent: "FD", fd_principal: 50000, fd_years: 5, fd_rate: 7
    - "What is a mutual fund?" -> intent: "GENERAL"
    - "म्यूचुअल फंड क्या है?" -> intent: "GENERAL"
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
            
            const comparisonInput: CompareTaxRegimesInput = {
                income: intent.income,
                fy,
                newRegimeResult,
                oldRegimeResult
            };
            const comparisonResult = await compareTaxRegimes(comparisonInput);

            return {
                response: comparisonResult.comparison,
                calculationResult: { type: 'tax_comparison', data: { new: newRegimeResult, old: oldRegimeResult } }
            }
        } else {
            const calculationResult = calculateTax(intent.income, fy, regime);
            const explanationInput: ExplainTaxCalculationInput = {
                income: intent.income,
                fy,
                regime: calculationResult.regime,
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

    if (intent?.intent === "SIP" && intent.sip_monthly && intent.sip_years) {
        const rate = intent.sip_rate || 12; // Default rate if not specified
        const sipResult = calculateSip(intent.sip_monthly, intent.sip_years, rate);
        
        const explanation = `Based on your inputs, a monthly SIP of ₹${intent.sip_monthly.toLocaleString('en-IN')} for ${intent.sip_years} years at an expected annual return of ${rate}% could grow to a future value of ₹${sipResult.future_value.toLocaleString('en-IN')}.`;

        return {
            response: explanation,
            calculationResult: { type: 'sip', data: sipResult }
        };
    }

    if (intent?.intent === "REVERSE_SIP" && intent.sip_target && intent.sip_years) {
        const rate = intent.sip_rate || 12;
        const reverseSipResult = calculateReverseSip(intent.sip_target, intent.sip_years, rate);
        
        const explanation = `To reach your goal of ₹${intent.sip_target.toLocaleString('en-IN')} in ${intent.sip_years} years with an expected return of ${rate}%, you would need to invest approximately ₹${reverseSipResult.monthly_investment.toLocaleString('en-IN')} per month.`;

        return {
            response: explanation,
            calculationResult: { type: 'reverse_sip', data: reverseSipResult }
        };
    }

    if (intent?.intent === "EMI" && intent.emi_principal && intent.emi_years && intent.emi_rate) {
        const emiResult = calculateEMI(intent.emi_principal, intent.emi_rate, intent.emi_years);
        
        const explanation = `For a loan of ₹${intent.emi_principal.toLocaleString('en-IN')} over ${intent.emi_years} years at ${intent.emi_rate}% interest, your Equated Monthly Installment (EMI) would be ₹${emiResult.emi.toLocaleString('en-IN')}.`;

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

    if (intent?.intent === 'GENERAL') {
        const result = await generalResponsePrompt({ query: input.query });
        return {
            response: result.output as string,
        };
    }

    return {
        response: "I can help with Indian income tax, SIP, EMI, compound interest, and budget planning. Please ask me a question like 'How much tax on ₹15L' or 'What is a mutual fund?'."
    };
}
