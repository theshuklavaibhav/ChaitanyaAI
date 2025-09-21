'use server';

import { z } from 'zod';
import { generateProductDescription } from '@/ai/flows/generate-product-description';
import { generateSocialMediaCaptions, type GenerateSocialMediaCaptionsInput } from '@/ai/flows/generate-social-media-captions';
import { generateImage } from '@/ai/flows/generate-image';
import { generateBrandStory } from '@/ai/flows/generate-brand-story';
import { analyzeMarketTrends } from '@/ai/flows/analyze-market-trends';
import { translateContent } from '@/ai/flows/translate-content';
import { generateEtsyListing } from '@/ai/flows/generate-etsy-listing';
import { generateShopifyListing } from '@/ai/flows/generate-shopify-listing';

const productSchema = z.object({
  productName: z.string().min(2, { message: 'Product/service name must be at least 2 characters.' }),
});

const storySchema = z.object({
    brandName: z.string().min(2, { message: 'Brand/founder name must be at least 2 characters.' }),
    businessType: z.string().min(2, { message: 'Product/service name must be at least 2 characters.' }),
});

const translateSchema = z.object({
  content: z.string().min(1, { message: 'Content to translate cannot be empty.' }),
  targetLanguage: z.string().min(2, { message: 'Target language must be specified.' }),
});

const listingSchema = z.object({
  productName: z.string().min(2, { message: 'Product name must be at least 2 characters.' }),
  productDescription: z.string().min(10, { message: 'Product description must be at least 10 characters.' }),
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

export async function handleGenerateStory(brandName: string, businessType: string) {
    const validation = storySchema.safeParse({ brandName, businessType });
  
    if (!validation.success) {
      return { error: validation.error.errors[0].message };
    }
  
    try {
      const result = await generateBrandStory({ brandName: validation.data.brandName, businessType: validation.data.businessType });
      return { data: result.brandStory };
    } catch (e) {
      console.error(e);
      return { error: 'Failed to generate story. Please try again.' };
    }
}

export async function handleAnalyzeTrends(productOrIndustry: string) {
    const validation = productSchema.safeParse({ productName: productOrIndustry });

    if (!validation.success) {
      return { error: validation.error.errors[0].message };
    }

    try {
      const result = await analyzeMarketTrends({ productOrIndustry: validation.data.productName });
      return { data: result };
    } catch (e) {
        console.error(e);
        return { error: 'Failed to analyze trends. Please try again.' };
    }
}

export async function handleTranslate(content: string, targetLanguage: string) {
  const validation = translateSchema.safeParse({ content, targetLanguage });

  if (!validation.success) {
    return { error: validation.error.errors[0].message };
  }

  try {
    const result = await translateContent(validation.data);
    return { data: result.translatedContent };
  } catch (e) {
    console.error(e);
    return { error: `Failed to translate content to ${targetLanguage}. Please try again.` };
  }
}

export async function handleGenerateEtsyListing(productName: string, productDescription: string) {
  const validation = listingSchema.safeParse({ productName, productDescription });

  if (!validation.success) {
    return { error: validation.error.errors[0].message };
  }

  try {
    const result = await generateEtsyListing(validation.data);
    return { data: result };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to generate Etsy listing. Please try again.' };
  }
}

export async function handleGenerateShopifyListing(productName: string, productDescription: string) {
  const validation = listingSchema.safeParse({ productName, productDescription });

  if (!validation.success) {
    return { error: validation.error.errors[0].message };
  }

  try {
    const result = await generateShopifyListing(validation.data);
    return { data: result };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to generate Shopify listing. Please try again.' };
  }
}
