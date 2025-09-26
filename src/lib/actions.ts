'use server';

import { orchestrate, OrchestratorInput, OrchestratorOutput } from '@/ai/flows/orchestrator-tool';
import { generateAudio } from '@/ai/flows/tts-flow';
import { summarizeCalculation } from '@/ai/flows/summarize-calculation-flow';
import type { CalculationResult } from './types';


export async function sendMessageAction(input: OrchestratorInput): Promise<OrchestratorOutput> {
  try {
    return await orchestrate(input);
  } catch (error) {
    console.error("Error in orchestrator:", error);
    // Ensure a serializable error object is returned that matches the expected OrchestratorOutput type
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      response: `I'm sorry, I encountered an error while processing your request. Please try again. \n\n**Error Details:** ${errorMessage}`,
      sources: [],
      calculationResult: undefined,
    };
  }
}

export async function textToSpeechAction(text: string): Promise<{ audioUrl: string }> {
    try {
        const { media } = await generateAudio(text);
        return { audioUrl: media };
    } catch (error) {
        console.error("Error in TTS action:", error);
        throw new Error("Failed to generate audio.");
    }
}


export async function summarizeResultAction(result: CalculationResult): Promise<string> {
    try {
        const { summary } = await summarizeCalculation({ result });
        return summary;
    } catch (error) {
        console.error("Error in summary action:", error);
        // Fallback to a simple string representation if the AI summary fails
        return "Here are your calculation results.";
    }
}
