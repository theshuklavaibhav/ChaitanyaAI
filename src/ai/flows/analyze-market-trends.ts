'use server';

/**
 * @fileOverview AI flow for analyzing market trends for a given product or industry.
 *
 * - analyzeMarketTrends - A function that returns trend analysis.
 * - AnalyzeMarketTrendsInput - The input type for the function.
 * - AnalyzeMarketTrendsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeMarketTrendsInputSchema = z.object({
  productOrIndustry: z.string().describe('The product, service, or industry to analyze market trends for.'),
});
export type AnalyzeMarketTrendsInput = z.infer<
  typeof AnalyzeMarketTrendsInputSchema
>;

const AnalyzeMarketTrendsOutputSchema = z.object({
  keywords: z
    .array(z.string())
    .describe('A list of 5-7 popular SEO keywords for this product/industry.'),
  colorPalette: z
    .array(z.object({ name: z.string(), hex: z.string() }))
    .describe(
      'A trending color palette of 4 colors, including color names and hex codes (e.g., "#RRGGBB").'
    ),
  styleSuggestions: z
    .array(z.string())
    .describe(
      'Two or three brief suggestions for product/service styles or variations that are currently popular.'
    ),
});
export type AnalyzeMarketTrendsOutput = z.infer<
  typeof AnalyzeMarketTrendsOutputSchema
>;

export async function analyzeMarketTrends(
  input: AnalyzeMarketTrendsInput
): Promise<AnalyzeMarketTrendsOutput> {
  return analyzeMarketTrendsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeMarketTrendsPrompt',
  input: {schema: AnalyzeMarketTrendsInputSchema},
  output: {schema: AnalyzeMarketTrendsOutputSchema},
  prompt: `You are a digital marketing and e-commerce trend analyst. Your goal is to provide actionable insights to help small businesses appeal to modern digital audiences.

  Analyze the market trends for the following product, service, or industry: {{{productOrIndustry}}}

  Provide the following insights:
  - **Keywords:** A list of 5-7 popular SEO keywords that customers are likely to use when searching for this online.
  - **Color Palette:** A trending color palette of 4 colors that would be appealing for this business's branding. Provide both a name and a hex code for each color.
  - **Style Suggestions:** Two or three brief, actionable suggestions for product or service variations that are currently popular with online shoppers.
  `,
});

const analyzeMarketTrendsFlow = ai.defineFlow(
  {
    name: 'analyzeMarketTrendsFlow',
    inputSchema: AnalyzeMarketTrendsInputSchema,
    outputSchema: AnalyzeMarketTrendsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
