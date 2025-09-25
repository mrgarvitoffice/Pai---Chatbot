'use server';

import { orchestrate, OrchestratorInput, OrchestratorOutput } from '@/ai/flows/orchestrator-tool';
import { generateAudio } from '@/ai/flows/tts-flow';

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

export async function textToSpeechAction(text: string): Promise<{ audioUrl: string }> {
    try {
        const { media } = await generateAudio(text);
        return { audioUrl: media };
    } catch (error) {
        console.error("Error in TTS action:", error);
        throw new Error("Failed to generate audio.");
    }
}
