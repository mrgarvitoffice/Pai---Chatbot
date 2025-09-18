'use server';

/**
 * @fileOverview A Genkit tool for fetching dynamic, time-sensitive data.
 */

import { ai } from '@/ai/genkit';
import { getDocument } from '@/lib/dynamic-data';
import { z } from 'zod';

// Schema for the dynamic data documents
const DynamicDataSchema = z.object({
  source: z.string(),
  slug: z.string(),
  category: z.string(),
  value: z.any().optional(),
  last_updated: z.string(),
  // Add other fields from your schema that might be useful
  details: z.record(z.any()).optional(),
});

export const getDynamicData = ai.defineTool(
  {
    name: 'getDynamicData',
    description: 'Fetches current, time-sensitive data like interest rates, tax slabs, or market values from the dynamic_data collection.',
    inputSchema: z.object({
      slug: z.string().describe('The unique slug for the data point to fetch (e.g., "repo-rate", "income-tax-slabs-fy24-25").'),
    }),
    outputSchema: DynamicDataSchema,
  },
  async (input) => {
    // In a real implementation, this would query Firestore.
    // For now, it uses the local fallback.
    return getDocument(input.slug);
  }
);
