'use server';

/**
 * @fileOverview An AI agent for comparing Indian tax regimes with Gemini.
 *
 * - compareTaxRegimes - A function that handles the tax regime comparison process.
 * - CompareTaxRegimesInput - The input type for the compareTaxRegimes function.
 * - CompareTaxRegimesOutput - The return type for the compareTaxRegimes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type {TaxCalculationResult} from '@/lib/types';

const CompareTaxRegimesInputSchema = z.object({
  income: z.number().describe('The income for which to calculate tax.'),
  fy: z.string().describe('The fiscal year for the tax calculation (e.g., 2024-25).'),
  newRegimeResult: z.custom<TaxCalculationResult>(),
  oldRegimeResult: z.custom<TaxCalculationResult>(),
});
export type CompareTaxRegimesInput = z.infer<typeof CompareTaxRegimesInputSchema>;

const CompareTaxRegimesOutputSchema = z.object({
  comparison: z.string().describe('A detailed, human-friendly comparison of the two tax regimes, formatted with Markdown.'),
});
export type CompareTaxRegimesOutput = z.infer<typeof CompareTaxRegimesOutputSchema>;

export async function compareTaxRegimes(input: CompareTaxRegimesInput): Promise<CompareTaxRegimesOutput> {
  return compareTaxRegimesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'compareTaxRegimesPrompt',
  input: {schema: CompareTaxRegimesInputSchema},
  output: {schema: CompareTaxRegimesOutputSchema},
  prompt: `You are Pai, an expert Indian personal finance assistant. Your task is to provide a detailed, human-friendly comparison between the Old and New tax regimes based on the provided calculation results.

**Income Details:**
- Gross Income: ₹{{{income}}}
- Fiscal Year: {{{fy}}}

**Calculation Results:**
- **New Regime Tax:** ₹{{{newRegimeResult.total_tax}}}
- **Old Regime Tax (without deductions):** ₹{{{oldRegimeResult.total_tax}}}

**Instructions:**
Generate a comparison in Markdown. Structure your response EXACTLY as follows. Do NOT add any extra text before or after this structure.

#### ⚖️ Tax Regime Comparison — FY {{{fy}}}

Here’s a comparison for a gross income of **₹{{income}}**.

---

**🧾 New Regime (Default)**
The New Regime offers lower tax rates but does not allow for most common deductions.

- **Your Tax Payable:** **₹{{{newRegimeResult.total_tax}}}**

*This is generally simpler if you don't have significant investments or expenses to claim.*

---

**🧾 Old Regime (With Deductions)**
The Old Regime has higher tax rates but allows you to reduce your taxable income through various deductions.

- **Tax Before Deductions:** ₹{{{oldRegimeResult.total_tax}}}

👉 **Potential Savings:**
You can lower this tax by claiming deductions like:
- **₹1.5 Lakh** under Section 80C (PPF, ELSS, EPF)
- **₹50,000** under Section 80CCD(1B) (NPS)
- **₹25,000+** under Section 80D (Health Insurance)
- **₹2 Lakh** on Home Loan Interest

---

**✅ Key Takeaway:**

The **New Regime** is better for you, saving you **₹${
  '{{#if (gt oldRegimeResult.total_tax newRegimeResult.total_tax)}}'
}{{subtract oldRegimeResult.total_tax newRegimeResult.total_tax}}{{#else}}0{{/if}}** upfront.

However, if you can claim deductions of **more than ~₹2.5 Lakhs**, the **Old Regime** would likely become more beneficial.

*⚠️ Note: This is an illustrative calculation. For personalized advice, please consult a tax professional.*
`,
});

const compareTaxRegimesFlow = ai.defineFlow(
  {
    name: 'compareTaxRegimesFlow',
    inputSchema: CompareTaxRegimesInputSchema,
    outputSchema: CompareTaxRegimesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
