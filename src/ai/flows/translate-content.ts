'use server';

/**
 * @fileOverview AI flow for translating content to a specified language.
 *
 * - translateContent - A function that translates content.
 * - TranslateContentInput - The input type for the translateContent function.
 * - TranslateContentOutput - The return type for the translateContent function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TranslateContentInputSchema = z.object({
  content: z.string().describe('The text content to be translated.'),
  targetLanguage: z.string().describe('The language to translate the content into (e.g., "Spanish", "Hindi").'),
});
export type TranslateContentInput = z.infer<typeof TranslateContentInputSchema>;

const TranslateContentOutputSchema = z.object({
  translatedContent: z.string().describe('The translated content.'),
});
export type TranslateContentOutput = z.infer<typeof TranslateContentOutputSchema>;

export async function translateContent(
  input: TranslateContentInput
): Promise<TranslateContentOutput> {
  return translateContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateContentPrompt',
  input: { schema: TranslateContentInputSchema },
  output: { schema: TranslateContentOutputSchema },
  prompt: `You are a professional translator. Translate the following text into {{{targetLanguage}}}. Only return the translated text, with no additional commentary or explanations.

Text to translate:
{{{content}}}
`,
});

const translateContentFlow = ai.defineFlow(
  {
    name: 'translateContentFlow',
    inputSchema: TranslateContentInputSchema,
    outputSchema: TranslateContentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
