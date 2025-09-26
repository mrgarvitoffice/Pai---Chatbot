'use server';

/**
 * @fileOverview A Genkit flow for generating a concise, spoken summary of a calculation result.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { CalculationResult } from '@/lib/types';

const SummarizeCalculationInputSchema = z.object({
  result: z.custom<CalculationResult>(),
});

const SummarizeCalculationOutputSchema = z.object({
  summary: z.string().describe("A short, human-friendly spoken summary of the calculation result."),
});

export async function summarizeCalculation(input: { result: CalculationResult }): Promise<{ summary: string }> {
  // Convert the complex object to a simpler JSON string for the prompt
  const resultJson = JSON.stringify(input.result, null, 2);
  
  const { output } = await summarizeCalculationPrompt({ resultJson });
  return output!;
}

const summarizeCalculationPrompt = ai.definePrompt({
  name: 'summarizeCalculationPrompt',
  input: { schema: z.object({ resultJson: z.string() }) },
  output: { schema: SummarizeCalculationOutputSchema },
  prompt: `You are Pai, a helpful financial assistant. Your task is to create a very short, one-sentence summary of the following financial calculation result, suitable for being read aloud.

Focus only on the most important numbers. Be conversational and concise.

Example 1:
Input: { "type": "tax", "data": { "total_tax": 156000, "income": 1500000 } }
Output: "For an income of 15 lakhs, the total tax is one lakh fifty-six thousand rupees."

Example 2:
Input: { "type": "sip", "data": { "future_value": 5054471, "monthly_investment": 10000 } }
Output: "Your ten thousand rupee SIP is projected to grow to over fifty lakh rupees."

Example 3:
Input: { "type": "emi", "data": { "emi": 12399 } }
Output: "Your calculated monthly EMI is twelve thousand three hundred ninety-nine rupees."

Now, summarize this result:
{{{resultJson}}}
`,
});
