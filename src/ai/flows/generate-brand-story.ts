'use server';

/**
 * @fileOverview AI flow for generating a compelling brand story for an artisan.
 *
 * - generateBrandStory - A function that generates a brand story.
 * - GenerateBrandStoryInput - The input type for the generateBrandStory function.
 * - GenerateBrandStoryOutput - The return type for the generateBrandStory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBrandStoryInputSchema = z.object({
  artisanName: z.string().describe('The name of the artisan.'),
  craftType: z.string().describe('The type of craft the artisan specializes in (e.g., Handwoven Pashmina Scarves).'),
});
export type GenerateBrandStoryInput = z.infer<
  typeof GenerateBrandStoryInputSchema
>;

const GenerateBrandStoryOutputSchema = z.object({
  brandStory: z
    .string()
    .describe(
      'A 250-300 word compelling brand story that introduces the artisan, their heritage, their passion, and the cultural value of their craft. It should be written in a personal, narrative style.'
    ),
});
export type GenerateBrandStoryOutput = z.infer<
  typeof GenerateBrandStoryOutputSchema
>;

export async function generateBrandStory(
  input: GenerateBrandStoryInput
): Promise<GenerateBrandStoryOutput> {
  return generateBrandStoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBrandStoryPrompt',
  input: {schema: GenerateBrandStoryInputSchema},
  output: {schema: GenerateBrandStoryOutputSchema},
  prompt: `You are a master storyteller who helps artisans share their legacy. You write in an evocative, personal, and heartfelt tone that makes readers feel a deep connection to the creator behind the craft.

  Write a 250-300 word brand story for an artisan. The story should weave together the following elements:
  - An introduction to the artisan, {{{artisanName}}}.
  - The history and heritage of their craft, {{{craftType}}}.
  - Their personal journey and passion for their work.
  - The cultural significance and unique value of their creations.
  - A concluding sentence that leaves a lasting impression on the reader.
  
  Focus on narrative, not just facts. Make the reader feel like they are visiting the artisan's workshop and hearing their story firsthand.
  `,
});

const generateBrandStoryFlow = ai.defineFlow(
  {
    name: 'generateBrandStoryFlow',
    inputSchema: GenerateBrandStoryInputSchema,
    outputSchema: GenerateBrandStoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
