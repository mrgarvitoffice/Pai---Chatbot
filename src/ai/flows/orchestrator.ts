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
import { calculateTax, calculateEMI, budgetAllocation } from '@/lib/calculators';
import { calculateSip, calculateFd, calculateRd, calculateReverseSip, compoundFutureValue } from '@/lib/investment-calculators';
import { explainTaxCalculation } from './explain-tax-calculation';
import type { ExplainTaxCalculationInput } from './explain-tax-calculation';
import { compareTaxRegimes } from './compare-tax-regimes';
import type { CompareTaxRegimesInput } from './compare-tax-regimes';
import type { TaxCalculationResult, SipCalculationResult, EmiCalculationResult, CompoundInterestResult, BudgetAllocationResult, FdCalculationResult, RdCalculationResult, CalculationResult, ReverseSipResult } from '@/lib/types';
import { searchKnowledgeBase } from '../tools/knowledge-base';
import { getDynamicData } from '../tools/dynamic-data';

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
    intent: z.enum([
        "TAX_CALCULATION",
        "SIP_CALCULATION",
        "REVERSE_SIP_CALCULATION",
        "EMI_CALCULATION",
        "COMPOUND_INTEREST_CALCULATION",
        "BUDGET_CALCULATION",
        "FD_CALCULATION",
        "RD_CALCULATION",
        "GENERAL_KNOWLEDGE",
        "DYNAMIC_DATA_QUERY"
    ]).describe("The user's intent."),
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

// Production-ready system prompt based on the user's detailed blueprint.
const generalResponsePrompt = ai.definePrompt({
    name: 'generalResponsePrompt',
    tools: [searchKnowledgeBase, getDynamicData],
    prompt: `SYSTEM:
You are Jarvis, a professional India-first Finance Copilot. Your primary goal is to provide accurate and helpful answers. You have access to two types of information:
1. STATIC_RULEBOOK: A database of evergreen financial rules, principles, and FAQs. Use this for conceptual questions.
2. DYNAMIC_CONTEXT: A database of data that changes over time, like interest rates, tax slabs, and market data. Use this for questions about current numbers.

Rules:
1.  **Analyze the user's query to determine if it's a conceptual question or a request for current data.**
2.  For conceptual/FAQ questions (e.g., "What is SIP?", "How should I choose a mutual fund?"), use the 'searchKnowledgeBase' tool. If the tool returns relevant entries, base your answer on the provided 'short_answer' and 'excerpt'. Always cite the 'slug' and 'version' as a source.
3.  For questions about current figures (e.g., "What is the current repo rate?", "Latest tax slabs?"), use the 'getDynamicData' tool. Always state the value and the 'last_updated' date from the tool's response.
4.  **CRITICAL FALLBACK**: If the tools return no relevant information, you MUST use your own general knowledge to provide the best possible answer. DO NOT MAKE UP NUMBERS OR SPECIFIC RULES. State that you are providing a general answer.
5.  If you use a tool, extract the source information (slug, version, last_updated) and include it in your response.
6.  Maintain a conversational, professional, and helpful tone. You must always provide a text answer and never give a blank or empty reply.

USER:
{{{query}}}
`,
});

const intentPrompt = ai.definePrompt({
    name: 'intentPrompt',
    input: { schema: z.object({ query: z.string() }) },
    output: { schema: intentSchema },
    prompt: `You are an expert at analyzing user queries about Indian personal finance. Your task is to determine the user's intent and extract relevant entities.

    **Intent Hierarchy (Most to Least Specific):**
    1.  **CALCULATOR**: If the user is explicitly asking for a calculation (e.g., "calculate tax on 15L", "how much EMI for 50L", "SIP of 5k for 10 years"), use a specific calculator intent. The query MUST contain numbers and calculation-related keywords.
    2.  **DYNAMIC_DATA_QUERY**: If the user is asking for a specific, current number that changes over time (e.g., "what is the current repo rate?", "latest PPF interest rate", "current NAV of SBI Bluechip").
    3.  **GENERAL_KNOWLEDGE**: **DEFAULT**. Use this for any conceptual or informational question, even if it contains financial terms. (e.g., "What is a mutual fund?", "Explain the new tax regime", "How do I save for retirement?", "How are mutual funds taxed?").

    **Intents:**
    - "TAX_CALCULATION": User wants to **calculate** income tax. Query MUST contain an income figure and words like "tax on".
    - "SIP_CALCULATION": User wants to **calculate** SIP returns. (e.g., "if I invest 5000 a month...").
    - "REVERSE_SIP_CALCULATION": User wants to **calculate** the required monthly SIP for a target.
    - "EMI_CALCULATION": User wants to **calculate** a loan EMI.
    - "COMPOUND_INTEREST_CALCULATION": User wants to **calculate** compound interest.
    - "BUDGET_CALCULATION": User wants to **calculate** a budget allocation.
    - "FD_CALCULATION": User wants to **calculate** Fixed Deposit returns.
    - "RD_CALCULATION": User wants to **calculate** Recurring Deposit returns.
    - "DYNAMIC_DATA_QUERY": User is asking for a specific, current value. (e.g., "current repo rate", "latest tax slabs for FY 24-25", "HDFC FD rates").
    - "GENERAL_KNOWLEDGE": **DEFAULT**. Use for any other question. (e.g., "What is a mutual fund?", "Explain 80C deductions", "Do I need a Will?").
    
    Examples:
    - "How much tax on ₹15L for FY 25-26?" -> intent: "TAX_CALCULATION", income: 1500000
    - "What are the latest tax slabs for the new regime?" -> intent: "DYNAMIC_DATA_QUERY"
    - "Explain the new tax regime" -> intent: "GENERAL_KNOWLEDGE"
    - "What is the current PPF interest rate?" -> intent: "DYNAMIC_DATA_QUERY"
    - "What is PPF?" -> intent: "GENERAL_KNOWLEDGE"
    - "If I invest 5000 a month for 10 years what will I get?" -> intent: "SIP_CALCULATION", sip_monthly: 5000, sip_years: 10, sip_rate: 12
    - "What is a mutual fund?" -> intent: "GENERAL_KNOWLEDGE"
    - "How are mutual funds taxed?" -> intent: "GENERAL_KNOWLEDGE"
    `,
});

export async function orchestrate(input: OrchestratorInput): Promise<OrchestratorOutput> {
    const intentResult = await intentPrompt(input);
    const intent = intentResult.output;

    if (intent?.intent === "TAX_CALCULATION" && intent.income) {
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

    if (intent?.intent === "SIP_CALCULATION" && intent.sip_monthly && intent.sip_years) {
        const rate = intent.sip_rate || 12; // Default rate if not specified
        const sipResult = calculateSip(intent.sip_monthly, intent.sip_years, rate);
        
        const explanation = `Based on your inputs, a monthly SIP of ₹${intent.sip_monthly.toLocaleString('en-IN')} for ${intent.sip_years} years at an expected annual return of ${rate}% could grow to a future value of ₹${sipResult.future_value.toLocaleString('en-IN')}.`;

        return {
            response: explanation,
            calculationResult: { type: 'sip', data: sipResult }
        };
    }

    if (intent?.intent === "REVERSE_SIP_CALCULATION" && intent.sip_target && intent.sip_years) {
        const rate = intent.sip_rate || 12;
        const reverseSipResult = calculateReverseSip(intent.sip_target, intent.sip_years, rate);
        
        const explanation = `To reach your goal of ₹${intent.sip_target.toLocaleString('en-IN')} in ${intent.sip_years} years with an expected return of ${rate}%, you would need to invest approximately ₹${reverseSipResult.monthly_investment.toLocaleString('en-IN')} per month.`;

        return {
            response: explanation,
            calculationResult: { type: 'reverse_sip', data: reverseSipResult }
        };
    }

    if (intent?.intent === "EMI_CALCULATION" && intent.emi_principal && intent.emi_years && intent.emi_rate) {
        const emiResult = calculateEMI(intent.emi_principal, intent.emi_rate, intent.emi_years);
        
        const explanation = `For a loan of ₹${intent.emi_principal.toLocaleString('en-IN')} over ${intent.emi_years} years at ${intent.emi_rate}% interest, your Equated Monthly Installment (EMI) would be ₹${emiResult.emi.toLocaleString('en-IN')}.`;

        return {
            response: explanation,
            calculationResult: { type: 'emi', data: emiResult }
        };
    }

    if (intent?.intent === "COMPOUND_INTEREST_CALCULATION" && intent.ci_principal && intent.ci_years && intent.ci_rate) {
        const frequency = intent.ci_frequency || 1;
        const ciResult = compoundFutureValue(intent.ci_principal, intent.ci_rate, intent.ci_years, frequency);

        const explanation = `Investing ₹${intent.ci_principal.toLocaleString('en-IN')} for ${intent.ci_years} years at an annual rate of ${intent.ci_rate}%, compounded ${frequency === 1 ? 'annually' : (frequency === 4 ? 'quarterly' : 'monthly')}, would result in a future value of ₹${ciResult.future_value.toLocaleString('en-IN')}.`;

        return {
            response: explanation,
            calculationResult: { type: 'compound_interest', data: ciResult }
        };
    }

    if (intent?.intent === "BUDGET_CALCULATION" && intent.income) {
        const budgetResult = budgetAllocation(intent.income);
        
        const explanation = `Here is a suggested budget allocation for your monthly income of ₹${intent.income.toLocaleString('en-IN')} based on the 50/30/20 rule. This is a guideline to help you manage your finances.`;

        return {
            response: explanation,
            calculationResult: { type: 'budget', data: budgetResult }
        };
    }

    if (intent?.intent === "FD_CALCULATION" && intent.fd_principal && intent.fd_years && intent.fd_rate) {
        const fdResult = calculateFd(intent.fd_principal, intent.fd_rate, intent.fd_years, 4); // Default quarterly compounding
        
        const explanation = `A Fixed Deposit of ₹${intent.fd_principal.toLocaleString('en-IN')} for ${intent.fd_years} years at an annual rate of ${intent.fd_rate}% would give you a maturity value of ₹${fdResult.future_value.toLocaleString('en-IN')}.`;

        return {
            response: explanation,
            calculationResult: { type: 'fd', data: fdResult }
        };
    }
    
    if (intent?.intent === "RD_CALCULATION" && intent.rd_monthly && intent.rd_months && intent.rd_rate) {
        const rdResult = calculateRd(intent.rd_monthly, intent.rd_rate, intent.rd_months);
        
        const explanation = `A monthly Recurring Deposit of ₹${intent.rd_monthly.toLocaleString('en-IN')} for ${intent.rd_months} months at an annual rate of ${intent.rd_rate}% would result in a maturity value of ₹${rdResult.future_value.toLocaleString('en-IN')}.`;

        return {
            response: explanation,
            calculationResult: { type: 'rd', data: rdResult }
        };
    }

    try {
        const llmResponse = await generalResponsePrompt.generate(input);
        const outputText = llmResponse.text();

        let responseSources: OrchestratorOutput['sources'] = [];
        const references = llmResponse.references();
        for (const part of references) {
            const toolOutput = part.output;
            if (part.toolRequest.name === 'searchKnowledgeBase' && Array.isArray(toolOutput)) {
                responseSources = toolOutput.map(doc => ({
                    name: `${doc.slug} (v${doc.version})`,
                    url: doc.references?.[0]?.url || '#',
                    last_updated: doc.last_updated,
                }));
                break;
            }
            if (part.toolRequest.name === 'getDynamicData' && toolOutput) {
                responseSources = [{
                    name: `Source: ${toolOutput.source}`,
                    url: '#',
                    last_updated: toolOutput.last_updated,
                }];
                break;
            }
        }

        return {
            response: outputText || "I'm sorry, I couldn't find an answer to that. Could you please rephrase?",
            sources: responseSources.length > 0 ? responseSources : undefined,
        };
    } catch (e) {
        console.error("Error during general response generation:", e);
        return {
            response: "I'm sorry, I encountered an error while trying to find an answer. Please try again later.",
        };
    }
}
