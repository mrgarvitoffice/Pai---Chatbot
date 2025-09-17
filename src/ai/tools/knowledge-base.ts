'use server';

/**
 * @fileOverview A Genkit tool for searching the financial knowledge base.
 */

import { ai } from '@/ai/genkit';
import { searchDocuments } from '@/lib/knowledge-base';
import { z } from 'zod';

export const searchKnowledgeBase = ai.defineTool(
  {
    name: 'searchKnowledgeBase',
    description: 'Searches the financial knowledge base for relevant documents based on a query.',
    inputSchema: z.object({
      query: z.string().describe('The user query to search for.'),
    }),
    outputSchema: z.array(
        z.object({
            sourceName: z.string(),
            url: z.string(),
            content: z.string(),
        })
    ),
  },
  async (input) => {
    return searchDocuments(input.query);
  }
);

    