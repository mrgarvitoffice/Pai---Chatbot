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
  prompt: `You are Pai, an expert Indian personal finance assistant. Your task is to provide a detailed, professional, and human-friendly comparison between the Old and New tax regimes based on the provided calculation results for FY {{{fy}}}.

**Income Details:**
- Gross Income: ₹{{{income}}}

**Calculation Results:**
- **New Regime Tax:** ₹{{{newRegimeResult.total_tax}}}
- **Old Regime Tax (without deductions):** ₹{{{oldRegimeResult.total_tax}}}

**Instructions:**
Generate a comparison in Markdown. Structure your response EXACTLY as follows. Do NOT add any extra text, hashtags, or asterisks. Use the emojis provided.

⚖️ Tax Regime Comparison (FY {{{fy}}})

Here’s a comparison for a gross income of **₹{{income}}**.

---

🧾 New Regime (Default)
Offers lower tax rates but removes most deductions. Simpler for those with fewer investments to claim.

Tax Slabs:
₹0 – ₹3L → Nil
₹3L – ₹6L → 5%
₹6L – ₹9L → 10%
₹9L – ₹12L → 15%
₹12L – ₹15L → 20%
Above ₹15L → 30%

👉 Your Tax Payable: ₹{{{newRegimeResult.total_tax}}}

---

🧾 Old Regime (With Deductions)
Has higher tax slabs but allows you to reduce your taxable income through various deductions.

Tax Slabs:
₹0 – ₹2.5L → Nil
₹2.5L – ₹5L → 5%
₹5L – ₹10L → 20%
Above ₹10L → 30%

👉 Tax Before Deductions: ₹{{{oldRegimeResult.total_tax}}}

You can lower this tax by claiming deductions like:
- **₹1.5 Lakh** under Section 80C (PPF, ELSS, EPF, etc.)
- **₹50,000** under Section 80CCD(1B) (NPS)
- **₹25,000+** under Section 80D (Health Insurance)
- **Home Loan Interest** and others.

---

✅ Key Takeaway:

- The **New Regime** is better for you if you have minimal deductions, saving you **₹${
  '{{#if (gt oldRegimeResult.total_tax newRegimeResult.total_tax)}}'
}{{subtract oldRegimeResult.total_tax newRegimeResult.total_tax}}{{#else}}0{{/if}}** upfront.
- The **Old Regime** becomes more beneficial if your total claimed deductions significantly exceed **~₹2.5 Lakhs**.

This is an illustrative calculation. For personalized advice, please consult a tax professional.
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
