// src/ai/flows/empathetic-chatbot.ts
'use server';

/**
 * @fileOverview An empathetic chatbot that provides supportive responses based on CBT principles.
 *
 * - empatheticChatbot - A function that handles the empathetic chatbot process.
 * - EmpatheticChatbotInput - The input type for the empatheticChatbot function.
 * - EmpatheticChatbotOutput - The return type for the empatheticChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EmpatheticChatbotInputSchema = z.object({
  message: z.string().describe('The user message to respond to.'),
  mood: z.string().optional().describe('The current mood of the user.'),
});
export type EmpatheticChatbotInput = z.infer<typeof EmpatheticChatbotInputSchema>;

const EmpatheticChatbotOutputSchema = z.object({
  response: z.string().describe('The empathetic response from the chatbot.'),
});
export type EmpatheticChatbotOutput = z.infer<typeof EmpatheticChatbotOutputSchema>;

export async function empatheticChatbot(input: EmpatheticChatbotInput): Promise<EmpatheticChatbotOutput> {
  return empatheticChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'empatheticChatbotPrompt',
  input: {schema: EmpatheticChatbotInputSchema},
  output: {schema: EmpatheticChatbotOutputSchema},
  prompt: `You are an empathetic chatbot designed to provide supportive responses based on Cognitive Behavioral Therapy (CBT) principles.

  The user will provide a message, and optionally their current mood. Generate a response that is empathetic and supportive.

  Message: {{{message}}}
  Mood: {{{mood}}}

  Response:`,
});

const empatheticChatbotFlow = ai.defineFlow(
  {
    name: 'empatheticChatbotFlow',
    inputSchema: EmpatheticChatbotInputSchema,
    outputSchema: EmpatheticChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
