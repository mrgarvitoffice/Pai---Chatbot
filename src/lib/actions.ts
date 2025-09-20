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
    sources: {
        name: string;
        url: string;
        last_updated: string;
    }[];
}

export async function getTaxExplanationAction(input: TaxExplanationInput): Promise<ExplainTaxCalculationOutput> {
  try {
    const response = await explainTaxCalculation(input);
    
    // Ensure sources are passed through even if AI omits them
    if (!response.sources || response.sources.length === 0) {
      response.sources = input.sources;
    }

    return response;
  } catch (error) {
    console.error("Error getting tax explanation:", error);
    return {
      explanation: "I'm sorry, I encountered an error while trying to generate an explanation. Please try again.",
      sources: input.sources,
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
