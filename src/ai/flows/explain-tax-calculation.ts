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
  prompt: `You are Pai, an expert Indian personal finance assistant. You are provided with a tax calculation breakdown, total tax amount, and sources. Your task is to provide a human-friendly explanation of the tax calculation, citing the sources used.

Tax Calculation for Fiscal Year: {{{fy}}}
Income: ₹{{{income}}}
Tax Breakdown: {{#each tax_breakdown}}{{{@key}}}: ₹{{{this}}} {{/each}}
Total Tax: ₹{{{total_tax}}}
Sources: {{#each sources}}{{{name}}} - {{{url}}} (Last updated: {{{last_updated}}}) {{/each}}

Provide a clear and concise explanation of how the tax was calculated. Use Markdown for formatting. Structure your response as follows:

- Start with a clear heading for the tax regime used.
- Use bullet points or a simple list to show the applicable tax slabs.
- Provide a summary of the final tax calculation, showing how the total tax was derived.
- Include a "Rule of Thumb" or a brief comparative note if relevant.
- Do not wrap the entire response in a code block.

Example Format:
### New Regime (Default)

*   **₹0 – ₹3L:** Nil
*   **₹3L – ₹6L:** 5%
*   ...and so on for other slabs.

**Calculation Summary:**
For an income of ₹{{{income}}}, your tax is calculated to be **₹{{{total_tax}}}** (including cess).

This is not financial advice.

Return JSON:
{
  "explanation": "human friendly explanation in markdown format",
  "sources": [{"name": "...", "url": "...", "date": "..."}]
}
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
