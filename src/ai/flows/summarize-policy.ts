'use server';

/**
 * @fileOverview Summarizes a fund fact sheet and extracts key information
 *   like expense ratio, AUM, and risk category using Gemini.
 *
 * - summarizePolicy - A function that handles the policy summarization process.
 * - SummarizePolicyInput - The input type for the summarizePolicy function.
 * - SummarizePolicyOutput - The return type for the summarizePolicy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizePolicyInputSchema = z.object({
  factSheetText: z
    .string()
    .describe('The text content of the fund fact sheet to summarize.'),
});
export type SummarizePolicyInput = z.infer<typeof SummarizePolicyInputSchema>;

const SummarizePolicyOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the fund fact sheet.'),
  expenseRatio: z.string().describe('The expense ratio of the fund.'),
  aum: z.string().describe('The Assets Under Management (AUM) of the fund.'),
  riskCategory: z.string().describe('The risk category of the fund.'),
  sourceName: z.string().describe('The name of the source document.'),
  sourceUrl: z.string().describe('The URL of the source document.'),
  lastUpdated: z.string().describe('The date when the fact sheet was last updated.'),
});
export type SummarizePolicyOutput = z.infer<typeof SummarizePolicyOutputSchema>;

export async function summarizePolicy(input: SummarizePolicyInput): Promise<SummarizePolicyOutput> {
  return summarizePolicyFlow(input);
}

const summarizePolicyPrompt = ai.definePrompt({
  name: 'summarizePolicyPrompt',
  input: {schema: SummarizePolicyInputSchema},
  output: {schema: SummarizePolicyOutputSchema},
  prompt: `You are Pai, an expert Indian personal finance assistant. Your task is to summarize a fund fact sheet and extract key information.

  Analyze the following fact sheet text:
  {{factSheetText}}

  Extract the following information:
  - A concise summary of the fund.
  - The expense ratio of the fund.
  - The Assets Under Management (AUM) of the fund.
  - The risk category of the fund.
  - The name of the source document.
  - The URL of the source document.
  - The date when the fact sheet was last updated.

  Provide the output in the following JSON format:
  {
    "summary": "summary",
    "expenseRatio": "expense ratio",
    "aum": "AUM",
    "riskCategory": "risk category",
    "sourceName": "source name",
    "sourceUrl": "source URL",
    "lastUpdated": "last updated date"
  }

  Remember to cite the source for each piece of information and include the last updated date. Ensure the summary is human-friendly and easy to understand.
`,
});

const summarizePolicyFlow = ai.defineFlow(
  {
    name: 'summarizePolicyFlow',
    inputSchema: SummarizePolicyInputSchema,
    outputSchema: SummarizePolicyOutputSchema,
  },
  async input => {
    const {output} = await summarizePolicyPrompt(input);
    return output!;
  }
);
