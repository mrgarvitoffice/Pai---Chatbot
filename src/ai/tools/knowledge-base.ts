'use server';

/**
 * @fileOverview A Genkit tool for searching the financial static rulebook.
 */

import { ai } from '@/ai/genkit';
import { searchDocuments } from '@/lib/knowledge-base';
import { z } from 'zod';

// Schema based on the static_rulebook document structure
const RulebookEntrySchema = z.object({
  slug: z.string(),
  title: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
  short_answer: z.string(),
  detailed_markdown: z.string(),
  version: z.string(),
  last_updated: z.string(),
  references: z.array(z.object({ name: z.string(), url: z.string().optional() })),
});

export const searchKnowledgeBase = ai.defineTool(
  {
    name: 'searchKnowledgeBase',
    description: 'Searches the financial static rulebook for relevant entries based on a query.',
    inputSchema: z.object({
      query: z.string().describe('The user query to search for.'),
    }),
    outputSchema: z.array(RulebookEntrySchema),
  },
  async (input) => {
    // In a real implementation, you might classify the intent here first
    // and decide between keyword or semantic search as per the blueprint.
    // For now, we'll use the keyword-based search.
    return searchDocuments(input.query);
  }
);
