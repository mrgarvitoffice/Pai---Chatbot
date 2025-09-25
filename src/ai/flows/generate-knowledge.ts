'use server';

/**
 * @fileOverview A Genkit flow for generating new knowledge base articles.
 * This flow takes a user query, generates a detailed answer, and structures it
 * like a knowledge base document.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateKnowledgeInputSchema = z.object({
  query: z.string().describe("The user's query for which to generate knowledge."),
});
export type GenerateKnowledgeInput = z.infer<typeof GenerateKnowledgeInputSchema>;

const GenerateKnowledgeOutputSchema = z.object({
    slug: z.string().describe("A URL-friendly slug for the article (e.g., 'what-is-sip')."),
    title: z.string().describe("A clear and concise title for the article."),
    category: z.string().describe("The most relevant financial category (e.g., 'Mutual Funds', 'Tax Planning')."),
    tags: z.array(z.string()).describe("An array of relevant keywords or tags."),
    short_answer: z.string().describe("A one-sentence summary of the answer."),
    detailed_markdown: z.string().describe("A detailed, well-structured answer in Markdown format."),
});
export type GenerateKnowledgeOutput = z.infer<typeof GenerateKnowledgeOutputSchema>;

export async function generateKnowledge(input: GenerateKnowledgeInput): Promise<GenerateKnowledgeOutput> {
  return generateKnowledgeFlow(input);
}

const generateKnowledgePrompt = ai.definePrompt({
  name: 'generateKnowledgePrompt',
  input: { schema: GenerateKnowledgeInputSchema },
  output: { schema: GenerateKnowledgeOutputSchema },
  prompt: `You are an expert Indian personal finance content creator. Your task is to generate a new knowledge base article in response to a user's query. The article must be accurate, well-structured, and formatted according to the output schema.

User Query: "{{{query}}}"

**CRITICAL INSTRUCTIONS:**
1.  **Analyze the Query**: Understand the user's intent and the core financial concept.
2.  **Generate Content**: Create a comprehensive and accurate answer.
3.  **Format**: The 'detailed_markdown' MUST be concise and point-wise. Use bullet points (e.g., '-') or numbered lists for clarity. Do not use long paragraphs. The entire answer should be short and easy to read while being fully informative.
4.  **Extract Metadata**:
    *   **slug**: Create a simple, URL-friendly slug from the title (e.g., "how-to-save-tax").
    *   **title**: Write a clear, question-based title (e.g., "How Can I Save Tax in India?").
    *   **category**: Assign one of the following: 'Asset Allocation & Portfolio', 'Goal-Based Investing', 'Retirement', 'Emergency Fund', 'Mutual Funds', 'Insurance', 'Real Estate', 'Debt & Fixed Income', 'Tax Planning', 'Estate & Wills', 'General Finance'.
    *   **tags**: Provide 3-5 relevant lowercase keywords (e.g., ["tax", "80c", "deductions"]).
    *   **short_answer**: Write a single, concise sentence that directly answers the user's query.

Make sure the tone is helpful, educational, and professional. The content is for an Indian audience.`,
});


const generateKnowledgeFlow = ai.defineFlow(
  {
    name: 'generateKnowledgeFlow',
    inputSchema: GenerateKnowledgeInputSchema,
    outputSchema: GenerateKnowledgeOutputSchema,
  },
  async (input) => {
    const { output } = await generateKnowledgePrompt(input);
    return output!;
  }
);
