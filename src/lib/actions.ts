'use server';

import { orchestrate, OrchestratorInput, OrchestratorOutput } from '@/ai/flows/orchestrator-tool';

export async function sendMessageAction(input: OrchestratorInput): Promise<OrchestratorOutput> {
  try {
    return await orchestrate(input);
  } catch (error) {
    console.error("Error in orchestrator:", error);
    // Ensure a serializable error object is returned
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      response: `I'm sorry, I encountered an error while processing your request. Please try again. \n\n**Error Details:** ${errorMessage}`,
    };
  }
}
