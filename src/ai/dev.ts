import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-policy.ts';
import '@/ai/flows/compare-tax-regimes.ts';
import '@/ai/flows/orchestrator-tool.ts';
import '@/ai/flows/generate-knowledge.ts'; // Import the new flow
import '@/ai/flows/tts-flow.ts'; // Import TTS flow
import '@/ai/tools/knowledge-base.ts';
import '@/ai/tools/dynamic-data.ts';
import '@/ai/tools/calculators.ts';
