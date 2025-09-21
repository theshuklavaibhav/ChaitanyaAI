'use server';

/**
 * @fileOverview AI flow for generating a Shopify listing (title, meta description, and tags).
 *
 * - generateShopifyListing - A function that generates Shopify listing content.
 * - GenerateShopifyListingInput - The input type for the function.
 * - GenerateShopifyListingOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateShopifyListingInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productDescription: z.string().describe('The detailed description of the product.'),
});
export type GenerateShopifyListingInput = z.infer<
  typeof GenerateShopifyListingInputSchema
>;

const GenerateShopifyListingOutputSchema = z.object({
  shopifyTitle: z
    .string()
    .describe('An SEO-optimized Shopify product title, ideally under 70 characters.'),
  shopifyMetaDescription: z
    .string()
    .describe(
      'An SEO-optimized meta description for the product page, under 160 characters.'
    ),
  shopifyTags: z
    .array(z.string())
    .describe(
      'A list of 5-10 relevant, comma-separated tags for Shopify organization and filtering.'
    ),
});
export type GenerateShopifyListingOutput = z.infer<
  typeof GenerateShopifyListingOutputSchema
>;

export async function generateShopifyListing(
  input: GenerateShopifyListingInput
): Promise<GenerateShopifyListingOutput> {
  return generateShopifyListingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateShopifyListingPrompt',
  input: {schema: GenerateShopifyListingInputSchema},
  output: {schema: GenerateShopifyListingOutputSchema},
  prompt: `You are a Shopify search engine optimization (SEO) expert. Your task is to generate an SEO-friendly title, meta description, and tags for a product based on its name and description.

Product Name: {{{productName}}}
Product Description: {{{productDescription}}}

Based on the product information, provide the following:

1.  **Shopify Title:** Create an SEO-optimized product title.
    - It must be clear, descriptive, and engaging.
    - Keep it under 70 characters for best results on search engines.

2.  **Shopify Meta Description:** Write a compelling meta description.
    - It should summarize the product and encourage clicks from search results.
    - Keep it under 160 characters.

3.  **Shopify Tags:** Generate a list of 5-10 comma-separated tags.
    - These tags should be used for filtering and organizing products within a Shopify store.
    - Include tags for product type, materials, style, color, and target audience.
`,
});

const generateShopifyListingFlow = ai.defineFlow(
  {
    name: 'generateShopifyListingFlow',
    inputSchema: GenerateShopifyListingInputSchema,
    outputSchema: GenerateShopifyListingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
