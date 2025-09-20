'use server';

import { orchestrate, OrchestratorInput, OrchestratorOutput } from '@/ai/flows/orchestrator-tool';

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
