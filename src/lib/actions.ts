'use server';

import { explainTaxCalculation } from '@/ai/flows/explain-tax-calculation';
import type { ExplainTaxCalculationInput, ExplainTaxCalculationOutput } from '@/ai/flows/explain-tax-calculation';
import { orchestrate, OrchestratorInput, OrchestratorOutput } from '@/ai/flows/orchestrator';

type TaxExplanationInput = {
    income: number;
    fy: string;
    regime: 'new' | 'old';
    tax_breakdown: Record<string, number>;
    total_tax: number;
}

// A simple mock for sources as we don't have a DB set up
const sources = [
    {
      name: "Income Tax Department of India",
      url: "https://www.incometax.gov.in/",
      last_updated: "2024-04-01"
    }
];

export async function getTaxExplanationAction(input: TaxExplanationInput): Promise<ExplainTaxCalculationOutput> {
  try {
    const aiInput: ExplainTaxCalculationInput = {
        ...input,
        sources: sources
    };
    
    const response = await explainTaxCalculation(aiInput);
    
    // Ensure sources are passed through even if AI omits them
    if (!response.sources || response.sources.length === 0) {
      response.sources = sources;
    }

    return response;
  } catch (error) {
    console.error("Error getting tax explanation:", error);
    return {
      explanation: "I'm sorry, I encountered an error while trying to generate an explanation. Please try again.",
      sources: sources,
    };
  }
}

export async function sendMessageAction(input: OrchestratorInput): Promise<OrchestratorOutput> {
  try {
    return await orchestrate(input);
  } catch (error) {
    console.error("Error in orchestrator:", error);
    return {
      response: "I'm sorry, I encountered an error while processing your request. Please try again.",
    };
  }
}
