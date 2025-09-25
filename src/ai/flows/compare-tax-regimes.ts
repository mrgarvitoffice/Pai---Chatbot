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

// This internal schema includes the pre-calculated values for the prompt
const PromptInputSchema = CompareTaxRegimesInputSchema.extend({
    savings: z.number(),
    betterRegime: z.string(),
    keyTakeaway: z.string(),
});

const CompareTaxRegimesOutputSchema = z.object({
  comparison: z.string().describe('A detailed, human-friendly comparison of the two tax regimes, formatted with Markdown.'),
});
export type CompareTaxRegimesOutput = z.infer<typeof CompareTaxRegimesOutputSchema>;

export async function compareTaxRegimes(input: CompareTaxRegimesInput): Promise<CompareTaxRegimesOutput> {
  return compareTaxRegimesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'compareTaxRegimesPrompt',
  input: {schema: PromptInputSchema},
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
{{{keyTakeaway}}}
This is an illustrative calculation. For personalized advice, please consult a tax professional.
`,
});

const compareTaxRegimesFlow = ai.defineFlow(
  {
    name: 'compareTaxRegimesFlow',
    inputSchema: CompareTaxRegimesInputSchema,
    outputSchema: CompareTaxRegimesOutputSchema,
  },
  async (input) => {
    // Perform all logic here, before calling the prompt.
    const { newRegimeResult, oldRegimeResult } = input;
    let savings = 0;
    let betterRegime = 'New Regime';
    let keyTakeaway = '';

    if (oldRegimeResult.total_tax > newRegimeResult.total_tax) {
        savings = oldRegimeResult.total_tax - newRegimeResult.total_tax;
        betterRegime = 'New Regime';
        keyTakeaway = `- The **New Regime** is better for you if you have minimal deductions, saving you **₹${savings}** upfront.
- The **Old Regime** becomes more beneficial if your total claimed deductions significantly exceed **~₹2.5 Lakhs**.`;
    } else if (newRegimeResult.total_tax > oldRegimeResult.total_tax) {
        savings = newRegimeResult.total_tax - oldRegimeResult.total_tax;
        betterRegime = 'Old Regime (without deductions)';
        keyTakeaway = `- The **Old Regime** is cheaper by **₹${savings}** even before you claim any deductions.
- Claiming deductions like 80C will further increase your savings in the Old Regime.`;
    } else {
        keyTakeaway = `- Both regimes result in the **same tax liability** before deductions.
- The **Old Regime** will be more beneficial if you can claim any deductions.`;
    }

    const promptInput = {
      ...input,
      savings,
      betterRegime,
      keyTakeaway,
    };
    
    const {output} = await prompt(promptInput);
    return output!;
  }
);
