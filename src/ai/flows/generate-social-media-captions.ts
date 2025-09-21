'use server';
/**
 * @fileOverview Generates social media captions for a given product name.
 *
 * - generateSocialMediaCaptions - A function that generates social media captions for a given product name.
 * - GenerateSocialMediaCaptionsInput - The input type for the generateSocialMediaCaptions function.
 * - GenerateSocialMediaCaptionsOutput - The return type for the generateSocialMediaCaptions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TonesEnum = z.enum(['Persuasive', 'Creative', 'Professional']);

const GenerateSocialMediaCaptionsInputSchema = z.object({
  productName: z.string().describe('The name of the product to generate captions for.'),
  tone: TonesEnum.describe('The tone of the captions.'),
});
export type GenerateSocialMediaCaptionsInput = z.infer<typeof GenerateSocialMediaCaptionsInputSchema>;

const GenerateSocialMediaCaptionsOutputSchema = z.object({
  captions: z.array(z.string()).describe('An array of three social media captions for the product, each under 70 words.'),
});
export type GenerateSocialMediaCaptionsOutput = z.infer<typeof GenerateSocialMediaCaptionsOutputSchema>;

export async function generateSocialMediaCaptions(input: GenerateSocialMediaCaptionsInput): Promise<GenerateSocialMediaCaptionsOutput> {
  return generateSocialMediaCaptionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSocialMediaCaptionsPrompt',
  input: {schema: GenerateSocialMediaCaptionsInputSchema},
  output: {schema: GenerateSocialMediaCaptionsOutputSchema},
  prompt: `You are a social media marketing expert. Generate three short, engaging social media captions (under 70 words each) to promote a product.

Use a {{{tone}}} tone.

Product Name: {{{productName}}}
`,
  config: {
    temperature: 0.7,
    maxOutputTokens: 500,
  },
});

const generateSocialMediaCaptionsFlow = ai.defineFlow(
  {
    name: 'generateSocialMediaCaptionsFlow',
    inputSchema: GenerateSocialMediaCaptionsInputSchema,
    outputSchema: GenerateSocialMediaCaptionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
