'use server';

/**
 * @fileOverview An AI agent for explaining tax calculations with Gemini.
 *
 * - explainTaxCalculation - A function that handles the tax calculation explanation process.
 * - ExplainTaxCalculationInput - The input type for the explainTaxCalculation function.
 * - ExplainTaxCalculationOutput - The return type for the explainTaxCalculation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainTaxCalculationInputSchema = z.object({
  income: z.number().describe('The income for which to calculate tax.'),
  fy: z.string().describe('The fiscal year for the tax calculation (e.g., 2025-26).'),
  tax_breakdown: z.record(z.string(), z.number()).describe('A breakdown of the tax calculation.'),
  total_tax: z.number().describe('The total tax amount.'),
  sources: z.array(
    z.object({
      name: z.string().describe('The name of the source.'),
      url: z.string().describe('The URL of the source.'),
      last_updated: z.string().describe('The last updated date of the source.'),
    })
  ).describe('The sources used for the tax calculation.'),
});
export type ExplainTaxCalculationInput = z.infer<typeof ExplainTaxCalculationInputSchema>;

const ExplainTaxCalculationOutputSchema = z.object({
  explanation: z.string().describe('A human-friendly explanation of the tax calculation, formatted with Markdown.'),
  sources: z.array(
    z.object({
      name: z.string().describe('The name of the source.'),
      url: z.string().describe('The URL of the source.'),
      last_updated: z.string().describe('The last updated date of the source.'),
    })
  ).describe('The sources used for the tax calculation explanation.'),
});
export type ExplainTaxCalculationOutput = z.infer<typeof ExplainTaxCalculationOutputSchema>;

export async function explainTaxCalculation(input: ExplainTaxCalculationInput): Promise<ExplainTaxCalculationOutput> {
  return explainTaxCalculationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainTaxCalculationPrompt',
  input: {schema: ExplainTaxCalculationInputSchema},
  output: {schema: ExplainTaxCalculationOutputSchema},
  prompt: `You are Pai, an expert Indian personal finance assistant. You are provided with a tax calculation breakdown and total tax amount. Your task is to provide a human-friendly and CONCISE explanation of the tax calculation.

Tax Calculation for Fiscal Year: {{{fy}}}
Income: ₹{{{income}}}
Total Tax: ₹{{{total_tax}}}

Provide a clear and concise explanation. Structure your response EXACTLY as follows, using the provided emojis and formatting. Do NOT add any extra text before or after this structure.

Example Format:
💰 Income Tax Summary — FY {{{fy}}} (New Regime)
📊 Tax Slabs
*   **₹0 – ₹3,00,000:** Nil
*   **₹3,00,001 – ₹6,00,000:** 5%
*   **₹6,00,001 – ₹9,00,000:** 10%
*   **₹9,00,001 – ₹12,00,000:** 15%
*   **₹12,00,001 – ₹15,00,000:** 20%
*   **Above ₹15,00,000:** 30%

🧮 Your Income
₹{{{income}}}

🧾 Tax Payable
₹{{{total_tax}}} (Inclusive of 4% Health & Education Cess)

⚠️ Note: This is an illustrative calculation based on the New Tax Regime for FY {{{fy}}}. It is not financial advice — please consult a tax professional for personalised guidance.
`,
});

const explainTaxCalculationFlow = ai.defineFlow(
  {
    name: 'explainTaxCalculationFlow',
    inputSchema: ExplainTaxCalculationInputSchema,
    outputSchema: ExplainTaxCalculationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
