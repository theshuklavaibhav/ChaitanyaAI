'use server';

/**
 * @fileOverview AI flow for generating a compelling brand story for a business.
 *
 * - generateBrandStory - A function that generates a brand story.
 * - GenerateBrandStoryInput - The input type for the generateBrandStory function.
 * - GenerateBrandStoryOutput - The return type for the generateBrandStory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBrandStoryInputSchema = z.object({
  brandName: z.string().describe('The name of the brand or founder.'),
  businessType: z.string().describe('The type of business, product, or service (e.g., Local Cafe, Online Marketing Consultant).'),
});
export type GenerateBrandStoryInput = z.infer<
  typeof GenerateBrandStoryInputSchema
>;

const GenerateBrandStoryOutputSchema = z.object({
  brandStory: z
    .string()
    .describe(
      'A 250-300 word compelling brand story that introduces the business, its mission, the founder\'s passion, and the value it provides to customers. It should be written in a personal, narrative style.'
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
  prompt: `You are a master storyteller who helps entrepreneurs and small businesses share their vision. You write in an evocative, personal, and heartfelt tone that makes readers feel a deep connection to the creator behind the brand.

  Write a 250-300 word brand story for a business. The story should weave together the following elements:
  - An introduction to the brand or founder, {{{brandName}}}.
  - The history and mission of their business, which is a {{{businessType}}}.
  - Their personal journey and passion for their work.
  - The unique value their products or services provide to customers.
  - A concluding sentence that leaves a lasting impression on the reader.
  
  Focus on narrative, not just facts. Make the reader feel like they understand the 'why' behind the business.
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
