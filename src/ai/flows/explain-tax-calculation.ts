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
import type {TaxCalculationResult} from '@/lib/types';

const ExplainTaxCalculationInputSchema = z.object({
  income: z.number().describe('The income for which to calculate tax.'),
  fy: z.string().describe('The fiscal year for the tax calculation (e.g., 2025-26).'),
  regime: z.enum(['new', 'old']).describe('The tax regime used for the calculation.'),
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
Regime: {{{regime}}}
Total Tax: ₹{{{total_tax}}}

Provide a clear and concise explanation. Structure your response EXACTLY as follows, using the provided emojis and formatting. Do NOT add any extra text, hashtags, or asterisks.
Based on the provided regime ('{{regime}}'), include the correct tax slab information.

💰 Income Tax Summary — FY {{{fy}}} ({{regime}} Regime)

🧮 Your Income
₹{{{income}}}

🧾 Tax Slabs
Based on the '{{regime}}' regime, here are the applicable tax slabs for FY {{{fy}}}:
[Dynamically insert the correct slabs here. For 'new' regime: ₹0–₹3L → Nil, ₹3L–₹6L → 5%, etc. For 'old' regime: ₹0–₹2.5L → Nil, ₹2.5L–₹5L → 5%, etc.]

👉 Tax Payable
₹{{{total_tax}}} (Inclusive of 4% Health & Education Cess)

---
⚠️ Note: This is an illustrative calculation based on the {{regime}} Tax Regime for FY {{{fy}}}. It is not financial advice — please consult a tax professional for personalised guidance.
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
