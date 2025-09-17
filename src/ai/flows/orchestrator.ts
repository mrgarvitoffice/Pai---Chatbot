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
});
export type OrchestratorOutput = z.infer<typeof OrchestratorOutputSchema>;

// A simple mock for sources as we don't have a DB set up
const sources = [
    {
      name: "Income Tax Department of India",
      url: "https://www.incomtax.gov.in/",
      last_updated: "2024-04-01"
    }
];

const taxIntentSchema = z.object({
    isTaxQuery: z.boolean().describe("Is the user asking a question about calculating income tax?"),
    income: z.number().optional().describe("The user's income, if mentioned."),
    fy: z.string().optional().describe("The fiscal year, if mentioned."),
});

const intentPrompt = ai.definePrompt({
    name: 'intentPrompt',
    input: { schema: z.object({ query: z.string() }) },
    output: { schema: taxIntentSchema },
    prompt: `Analyze the user query to determine if it is about income tax calculation. Extract the income and fiscal year if present.

    User Query: {{{query}}}
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
        
        let response = `Based on the information you provided for Fiscal Year ${fy} under the new regime:\n\n`
        response += `For a gross income of ₹${intent.income.toLocaleString('en-IN')}, your total tax liability is **₹${calculationResult.total_tax.toLocaleString('en-IN')}**.\n\n`
        response += `**AI-Generated Explanation:**\n${explanationResult.explanation}`;

        return {
            response,
            sources: explanationResult.sources
        };
    }

    return {
        response: "I can help with Indian income tax calculations. Please ask me a question like 'How much tax on ₹15L for FY 25-26?'"
    };
}
