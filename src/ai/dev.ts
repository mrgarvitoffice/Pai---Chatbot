import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-policy.ts';
import '@/ai/flows/explain-tax-calculation.ts';
import '@/ai/flows/orchestrator.ts';
