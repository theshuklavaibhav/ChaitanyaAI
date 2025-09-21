'use server';

import { z } from 'zod';
import { generateProductDescription } from '@/ai/flows/generate-product-description';
import { generateSocialMediaCaptions } from '@/ai/flows/generate-social-media-captions';
import { generateImage } from '@/ai/flows/generate-image';

const productSchema = z.object({
  productName: z.string().min(2, { message: 'Product name must be at least 2 characters.' }),
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

const tones = ['Persuasive', 'Creative', 'Professional'] as const;
export type Tone = (typeof tones)[number];

export async function handleGenerateCaptions(productName: string, tone: Tone) {
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
