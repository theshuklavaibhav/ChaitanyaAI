'use server';

/**
 * @fileOverview AI flow for generating an Etsy listing (title and tags).
 *
 * - generateEtsyListing - A function that generates Etsy listing content.
 * - GenerateEtsyListingInput - The input type for the function.
 * - GenerateEtsyListingOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEtsyListingInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productDescription: z.string().describe('The detailed description of the product.'),
});
export type GenerateEtsyListingInput = z.infer<
  typeof GenerateEtsyListingInputSchema
>;

const GenerateEtsyListingOutputSchema = z.object({
  etsyTitle: z
    .string()
    .describe('An SEO-optimized Etsy title for the product, under 140 characters.'),
  etsyTags: z
    .array(z.string())
    .describe(
      'A list of 13 relevant SEO-optimized tags for the Etsy listing, each under 20 characters.'
    ),
});
export type GenerateEtsyListingOutput = z.infer<
  typeof GenerateEtsyListingOutputSchema
>;

export async function generateEtsyListing(
  input: GenerateEtsyListingInput
): Promise<GenerateEtsyListingOutput> {
  return generateEtsyListingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEtsyListingPrompt',
  input: {schema: GenerateEtsyListingInputSchema},
  output: {schema: GenerateEtsyListingOutputSchema},
  prompt: `You are an Etsy search engine optimization (SEO) expert who helps artisans sell their products. Your task is to generate a compelling, keyword-rich title and a set of tags for an Etsy listing.

Product Name: {{{productName}}}
Product Description: {{{productDescription}}}

Based on the product information, provide the following:

1.  **Etsy Title:** Create an SEO-optimized title for the product.
    - It must be engaging and descriptive.
    - It must be 140 characters or less.
    - It should include relevant keywords that a customer would search for.

2.  **Etsy Tags:** Generate a list of exactly 13 tags.
    - Each tag must be 20 characters or less.
    - The tags should cover materials, style, occasion, technique, and who the product is for.
    - Use multi-word phrases for tags where appropriate.
`,
});

const generateEtsyListingFlow = ai.defineFlow(
  {
    name: 'generateEtsyListingFlow',
    inputSchema: GenerateEtsyListingInputSchema,
    outputSchema: GenerateEtsyListingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
