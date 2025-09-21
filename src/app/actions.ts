'use server';

import { z } from 'zod';
import { generateProductDescription } from '@/ai/flows/generate-product-description';
import { generateSocialMediaCaptions, type GenerateSocialMediaCaptionsInput } from '@/ai/flows/generate-social-media-captions';
import { generateImage } from '@/ai/flows/generate-image';
import { generateBrandStory } from '@/ai/flows/generate-brand-story';
import { analyzeMarketTrends } from '@/ai/flows/analyze-market-trends';

const productSchema = z.object({
  productName: z.string().min(2, { message: 'Product name must be at least 2 characters.' }),
});

const storySchema = z.object({
    artisanName: z.string().min(2, { message: 'Artisan name must be at least 2 characters.' }),
    craftType: z.string().min(2, { message: 'Product name must be at least 2 characters to infer craft type.' }),
});

export async function handleGenerateDescription(productName: string) {
  const validation = productSchema.safeParse({ productName });

  if (!validation.success) {
    return { error: validation.error.errors[0].message };
  }

  try {
    const result = await generateProductDescription({ productName: validation.data.productName });
    return { data: result.productDescription };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to generate description. Please try again.' };
  }
}

export async function handleGenerateCaptions(productName: string, tone: GenerateSocialMediaCaptionsInput['tone']) {
  const validation = productSchema.safeParse({ productName });

  if (!validation.success) {
    return { error: validation.error.errors[0].message };
  }

  try {
    const result = await generateSocialMediaCaptions({ productName: validation.data.productName, tone });
    return { data: result.captions };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to generate captions. Please try again.' };
  }
}

export async function handleGenerateImage(productName: string) {
    const validation = productSchema.safeParse({ productName });
  
    if (!validation.success) {
      return { error: validation.error.errors[0].message };
    }
  
    try {
      const result = await generateImage({ productName: validation.data.productName });
      if (!result.imageUrl) {
        return { error: 'Failed to generate image. Please try a different product name.' };
      }
      return { data: result.imageUrl };
    } catch (e) {
      console.error(e);
      return { error: 'Failed to generate image. Please try again.' };
    }
}

export async function handleGenerateStory(artisanName: string, craftType: string) {
    const validation = storySchema.safeParse({ artisanName, craftType });
  
    if (!validation.success) {
      return { error: validation.error.errors[0].message };
    }
  
    try {
      const result = await generateBrandStory({ artisanName: validation.data.artisanName, craftType: validation.data.craftType });
      return { data: result.brandStory };
    } catch (e) {
      console.error(e);
      return { error: 'Failed to generate story. Please try again.' };
    }
}

export async function handleAnalyzeTrends(craftType: string) {
    const validation = productSchema.safeParse({ productName: craftType });

    if (!validation.success) {
      return { error: validation.error.errors[0].message };
    }

    try {
      const result = await analyzeMarketTrends({ craftType: validation.data.productName });
      return { data: result };
    } catch (e) {
        console.error(e);
        return { error: 'Failed to analyze trends. Please try again.' };
    }
}
