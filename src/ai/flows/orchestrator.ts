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
import { calculateTax, calculateEMI, budgetAllocation, debtToIncomeRatio, savingsRatio, calculatePortfolioAllocation, calculateSip, calculateFd, calculateRd, calculateReverseSip, compoundFutureValue, calculateRetirementCorpus, calculateTermInsuranceCover } from '@/lib/calculators';
import { explainTaxCalculation } from './explain-tax-calculation';
import type { ExplainTaxCalculationInput } from './explain-tax-calculation';
import { compareTaxRegimes } from './compare-tax-regimes';
import type { CompareTaxRegimesInput } from './compare-tax-regimes';
import type { CalculationResult } from '@/lib/types';
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
        "RETIREMENT_CORPUS_CALCULATION",
        "DTI_CALCULATION",
        "SAVINGS_RATIO_CALCULATION",
        "TERM_INSURANCE_CALCULATION",
        "PORTFOLIO_ALLOCATION",
        "GENERAL_KNOWLEDGE",
        "DYNAMIC_DATA_QUERY"
    ]).describe("The user's primary intent."),
    income: z.number().optional().describe("Annual income for tax/insurance, or monthly for budget/DTI/savings. Extracted from user query (e.g., '15L', '10 lakhs' -> 1500000; '80k salary' -> 80000)."),
    regime: z.enum(['new', 'old', 'both']).optional().describe("Tax regime. 'both' if the user wants a comparison."),
    fy: z.string().optional().describe("Fiscal year for tax calculations (e.g., 'FY 25-26' -> '2024-25'). Default to current FY if not specified."),
    sip_monthly: z.number().optional().describe("Monthly SIP investment amount."),
    sip_years: z.number().optional().describe("Duration of SIP in years."),
    sip_rate: z.number().optional().describe("Expected annual rate of return for SIP (default to 12% if not specified)."),
    sip_target: z.number().optional().describe("Target corpus for a reverse SIP calculation."),
    emi_principal: z.number().optional().describe("The principal loan amount for EMI (e.g., '50L loan' -> 5000000)."),
    emi_years: z.number().optional().describe("Loan duration in years."),
    emi_rate: z.number().optional().describe("Annual interest rate for the loan."),
    ci_principal: z.number().optional().describe("Principal for compound interest."),
    ci_years: z.number().optional().describe("Duration for compound interest."),
    ci_rate: z.number().optional().describe("Annual rate for compound interest."),
    ci_frequency: z.number().optional().describe("Compounding frequency per year."),
    fd_principal: z.number().optional().describe("Principal for Fixed Deposit."),
    fd_years: z.number().optional().describe("Duration for Fixed Deposit."),
    fd_rate: z.number().optional().describe("Annual rate for Fixed Deposit."),
    rd_monthly: z.number().optional().describe("Monthly amount for Recurring Deposit."),
    rd_months: z.number().optional().describe("Duration in months for Recurring Deposit."),
    rd_rate: z.number().optional().describe("Annual rate for Recurring Deposit."),
    retire_age: z.number().optional().describe("Current age for retirement calculation."),
    retire_target_age: z.number().optional().describe("Target retirement age."),
    retire_monthly_expenses: z.number().optional().describe("Current monthly expenses for retirement."),
    dti_monthly_emi: z.number().optional().describe("Total monthly EMI for DTI calculation."),
    savings_monthly: z.number().optional().describe("Total monthly savings for savings ratio."),
    age: z.number().optional().describe("User's current age for portfolio allocation."),
    risk_appetite: z.enum(['low', 'medium', 'high']).optional().describe("User's risk appetite (low, medium, or high)."),
});


// Production-ready system prompt based on the user's detailed blueprint.
const generalResponsePrompt = ai.definePrompt({
    name: 'generalResponsePrompt',
    tools: [searchKnowledgeBase, getDynamicData],
    input: { schema: OrchestratorInputSchema },
    output: { schema: OrchestratorOutputSchema },
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
    prompt: `You are an expert at analyzing user queries about Indian personal finance. Your task is to determine the user's intent and extract relevant entities with high accuracy.

    **INTENT DETECTION RULES:**
    1.  **PRIORITIZE CALCULATORS:** If the query contains specific numbers and asks for a calculation (e.g., "how much", "calculate", "what if"), you MUST choose a specific calculator intent.
    2.  **KEYWORDS & SYNONYMS:** Pay close attention to keywords.
        - "tax", "salary", "income" -> TAX_CALCULATION. Do not confuse with insurance.
        - "insurance", "life cover", "term plan" -> TERM_INSURANCE_CALCULATION.
        - "SIP", "monthly investment" -> SIP_CALCULATION
        - "EMI", "loan", "installment" -> EMI_CALCULATION
        - "FD", "fixed deposit" -> FD_CALCULATION
        - "RD", "recurring deposit" -> RD_CALCULATION
    3.  **GENERAL_KNOWLEDGE is the FALLBACK:** Only use "GENERAL_KNOWLEDGE" if the query is conceptual and DOES NOT contain numbers for a calculation (e.g., "what is the best way...", "explain...", "how does... work?").
    
    **ENTITY EXTRACTION RULES:**
    - Convert amounts in "lakh" or "crore" to numbers (e.g., "15 lakh" -> 1500000, "2 cr" -> 20000000).
    - If a rate of return is not provided for SIP, default to 12.

    **INTENTS:**
    - "TAX_CALCULATION": User wants to calculate income tax. Query must contain an income figure and keywords like 'tax', 'salary', 'income'.
    - "TERM_INSURANCE_CALCULATION": User wants to know how much term insurance they need. Triggered by 'insurance', 'life cover'.
    - "SIP_CALCULATION": User wants to calculate SIP returns.
    - "REVERSE_SIP_CALCULATION": User wants to calculate the required monthly SIP for a target amount.
    - "EMI_CALCULATION": User wants to calculate a loan EMI. Synonyms: "installment", "loan payment".
    - "COMPOUND_INTEREST_CALCULATION": User wants to calculate compound interest.
    - "BUDGET_CALCULATION": User wants a budget allocation.
    - "FD_CALCULATION": User wants to calculate Fixed Deposit returns.
    - "RD_CALCULATION": User wants to calculate Recurring Deposit returns.
    - "RETIREMENT_CORPUS_CALCULATION": User wants to calculate their retirement corpus.
    - "DTI_CALCULATION": User wants to calculate their debt-to-income ratio.
    - "SAVINGS_RATIO_CALCULATION": User wants to calculate their savings ratio.
    - "PORTFOLIO_ALLOCATION": User wants a recommended portfolio/asset allocation based on age and risk.
    - "DYNAMIC_DATA_QUERY": User is asking for a specific, current value (e.g., "what is the current repo rate?").
    - "GENERAL_KNOWLEDGE": **FALLBACK ONLY**. Use for conceptual questions without specific numbers for calculation.
    
    **EXAMPLES:**
    - "How much tax on ₹15L for FY 25-26?" -> intent: "TAX_CALCULATION", income: 1500000, fy: "2024-25"
    - "calculate my tax if my salary is 20 lakhs" -> intent: "TAX_CALCULATION", income: 2000000
    - "how much term insurance for 15 lakhs annual income" -> intent: "TERM_INSURANCE_CALCULATION", income: 1500000
    - "If I invest 5000 a month for 10 years what will I get?" -> intent: "SIP_CALCULATION", sip_monthly: 5000, sip_years: 10, sip_rate: 12
    - "What is the EMI for a 50 lakh home loan for 20 years at 8.5%?" -> intent: "EMI_CALCULATION", emi_principal: 5000000, emi_years: 20, emi_rate: 8.5
    - "What is a mutual fund?" -> intent: "GENERAL_KNOWLEDGE"
    - "Calculate a portfolio for a 30 year old with high risk appetite" -> intent: "PORTFOLIO_ALLOCATION", age: 30, risk_appetite: "high"
    - "Tax on ₹15L for FY 25–26" -> intent: "TAX_CALCULATION", income: 1500000, fy: "2024-25"
    `,
});

export async function orchestrate(input: OrchestratorInput): Promise<OrchestratorOutput> {
    const intentResult = await intentPrompt(input);
    const intent = intentResult.output;

    if (intent?.intent === "TAX_CALCULATION" && intent.income) {
        const fy = intent.fy || '2024-25'; // Default to current FY
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
    
    if (intent?.intent === "PORTFOLIO_ALLOCATION" && intent.age && intent.risk_appetite) {
        const allocationResult = calculatePortfolioAllocation(intent.age, intent.risk_appetite);
        const explanation = `Based on your age of ${intent.age} and a '${intent.risk_appetite}' risk appetite, here is a suggested asset allocation. This is a guideline based on standard financial principles.`;
        return {
            response: explanation,
            calculationResult: { type: 'portfolio_allocation', data: allocationResult }
        };
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

    if (intent?.intent === "RETIREMENT_CORPUS_CALCULATION" && intent.retire_age && intent.retire_target_age && intent.retire_monthly_expenses) {
        const result = calculateRetirementCorpus({
            currentAge: intent.retire_age,
            retirementAge: intent.retire_target_age,
            monthlyExpenses: intent.retire_monthly_expenses,
        });
        const explanation = `To maintain your current lifestyle in retirement, you will need a corpus of approximately ₹${result.requiredCorpus.toLocaleString('en-IN')}. This is based on a set of standard assumptions about inflation and investment returns.`;
        return {
            response: explanation,
            calculationResult: { type: 'retirement', data: result }
        };
    }

    if (intent?.intent === "DTI_CALCULATION" && intent.income && intent.dti_monthly_emi) {
        const result = debtToIncomeRatio(intent.income, intent.dti_monthly_emi);
        const explanation = `Your Debt-to-Income (DTI) ratio is ${result.dtiRatio}%. Lenders generally prefer a DTI ratio below 36-40%.`;
        return {
            response: explanation,
            calculationResult: { type: 'dti', data: result }
        };
    }

    if (intent?.intent === "SAVINGS_RATIO_CALCULATION" && intent.income && intent.savings_monthly) {
        const result = savingsRatio(intent.income, intent.savings_monthly);
        const explanation = `Your current savings ratio is ${result.savingsRatio}%. A healthy savings ratio is typically considered to be 20% or higher.`;
        return {
            response: explanation,
            calculationResult: { type: 'savings_ratio', data: result }
        };
    }

    if (intent?.intent === "TERM_INSURANCE_CALCULATION" && intent.income) {
        const result = calculateTermInsuranceCover(intent.income);
        const explanation = `Based on the rule of thumb of having a life cover of at least 10-15 times your annual income, a suitable term insurance cover for you would be around ₹${result.recommendedCover.toLocaleString('en-IN')}.`;
        return {
            response: explanation,
            calculationResult: { type: 'term_insurance', data: result }
        };
    }

    // Fallback to general response prompt if no calculator intent is matched
    try {
        const llmResponse = await generalResponsePrompt(input);
        const response = llmResponse.output;

        if (!response || !response.response) {
            // Fallback if the model returns an empty response
            return {
                response: "I'm sorry, I couldn't find an answer to that. Could you please rephrase?",
            };
        }

        let responseSources: OrchestratorOutput['sources'] = [];
        const references = llmResponse.references;
        if (references) {
            for (const part of references) {
                const toolOutput = part.output;
                if (part.toolRequest.name === 'searchKnowledgeBase' && Array.isArray(toolOutput)) {
                    responseSources = toolOutput.map(doc => ({
                        name: `${doc.slug} (v${doc.version})`,
                        url: doc.references?.[0]?.url || '#',
                        last_updated: doc.last_updated,
                    }));
                }
                if (part.toolRequest.name === 'getDynamicData' && toolOutput) {
                     responseSources = [{
                        name: `Source: ${toolOutput.source}`,
                        url: '#',
                        last_updated: toolOutput.last_updated,
                    }];
                }
            }
        }
        
        return {
            response: response.response,
            sources: responseSources.length > 0 ? responseSources : undefined,
        };
    } catch (e) {
        console.error("Error during general response generation:", e);
        return {
            response: "I'm sorry, I encountered an error while trying to find an answer. Please try again.",
        };
    }
}
