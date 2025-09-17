'use server';

/**
 * @fileOverview The main orchestrator flow for Pai Chatbot.
 * This flow analyzes user queries, determines the intent, and routes
 * to the appropriate tool (e.g., tax calculator).
 *
 * - orchestrate - The main function that handles user queries.
 * - OrchestratorInput - The input type for the orchestrate function.
 * - OrchestratorOutput - The return type for the orchestrate function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { calculateTax } from '@/lib/calculators';
import { explainTaxCalculation } from './explain-tax-calculation';
import type { ExplainTaxCalculationInput } from './explain-tax-calculation';
import type { TaxCalculationResult } from '@/lib/types';

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
  calculationResult: z.custom<TaxCalculationResult>().optional().describe('The structured result of a calculation, if performed.'),
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

const taxIntentSchema = z.object({
    isTaxQuery: z.boolean().describe("Set to true if the user's query is about calculating income tax in India. This is true even for simple statements like 'income tax on 10 lakh'."),
    income: z.number().optional().describe("The user's annual income, extracted from the query. Must be a number. For example, '15L' or '10 lakhs' becomes 1500000."),
    fy: z.string().optional().describe("The fiscal year, if mentioned (e.g., 'FY 25-26'). If not mentioned, this can be null."),
});

const intentPrompt = ai.definePrompt({
    name: 'intentPrompt',
    input: { schema: z.object({ query: z.string() }) },
    output: { schema: taxIntentSchema },
    prompt: `You are an expert at analyzing user queries about Indian personal finance. Your task is to determine if the query is about income tax calculation and extract the relevant entities. The user may not ask a direct question, but their intent might still be to get a tax calculation.

    User Query: {{{query}}}

    Analyze the query and determine the following:
    1.  isTaxQuery: Set to true ONLY if the query is about calculating Indian income tax. It should be true for direct questions and for simple statements of income like "tax on 15L".
    2.  income: Extract the annual income as a number. Be flexible with formats like 'L' for lakh (100,000) and 'crore' (10,000,000). If no income is found, this MUST be null.
    3.  fy: Extract the fiscal year if mentioned, like "FY 2025-26".

    IMPORTANT: If the query is NOT about tax calculation, set isTaxQuery to false and income to null.

    Examples:
    - "How much tax on ₹15L for FY 25-26?" -> isTaxQuery: true, income: 1500000, fy: "25-26"
    - "income tax on 10 lakh" -> isTaxQuery: true, income: 1000000, fy: null
    - "what is my tax liability on 25,00,000" -> isTaxQuery: true, income: 2500000, fy: null
    - "tax for 1 crore" -> isTaxQuery: true, income: 10000000, fy: null
    - "income tax on 20 lakh" -> isTaxQuery: true, income: 2000000, fy: null
    - "What is a mutual fund?" -> isTaxQuery: false, income: null, fy: null
    - "hello" -> isTaxQuery: false, income: null, fy: null
    `,
});

export async function orchestrate(input: OrchestratorInput): Promise<OrchestratorOutput> {
    const intentResult = await intentPrompt(input);
    const intent = intentResult.output;

    if (intent?.isTaxQuery && intent.income) {
        const fy = intent.fy || '2024-25'; // Defaulting FY if not provided
        const regime = 'new'; // For now, we'll default to the new regime.
        
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
            calculationResult: calculationResult
        };
    }

    return {
        response: "I can help with Indian income tax calculations. Please ask me a question like 'How much tax on ₹15L for FY 25-26?'"
    };
}
