'use server';

import { z } from 'zod';
import { generateProductDescription } from '@/ai/flows/generate-product-description';
import { generateSocialMediaCaptions, type GenerateSocialMediaCaptionsInput } from '@/ai/flows/generate-social-media-captions';
import { generateBrandStory } from '@/ai/flows/generate-brand-story';
import { analyzeMarketTrends } from '@/ai/flows/analyze-market-trends';
import { translateContent } from '@/ai/flows/translate-content';
import { generateEtsyListing } from '@/ai/flows/generate-etsy-listing';
import { generateShopifyListing } from '@/ai/flows/generate-shopify-listing';
import { generateEmailReply, type GenerateEmailReplyInput } from '@/ai/flows/generate-email-reply';

const productSchema = z.object({
  productName: z.string().min(2, { message: 'Product/service name must be at least 2 characters.' }),
});

const captionsSchema = z.object({
    productName: z.string().min(2, { message: 'Product/service name must be at least 2 characters.' }),
    tone: z.enum(['Persuasive', 'Creative', 'Professional']),
    platform: z.enum(['General', 'Instagram', 'X (Twitter)', 'LinkedIn']),
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

const emailSchema = z.object({
  emailTopic: z.string().min(5, { message: 'Email topic must be at least 5 characters.' }),
  tone: z.enum(['Formal', 'Friendly', 'Direct']),
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

export async function handleGenerateCaptions(
    productName: string, 
    tone: GenerateSocialMediaCaptionsInput['tone'],
    platform: GenerateSocialMediaCaptionsInput['platform']
) {
  const validation = captionsSchema.safeParse({ productName, tone, platform });

  if (!validation.success) {
    return { error: validation.error.errors[0].message };
  }

  try {
    const result = await generateSocialMediaCaptions(validation.data);
    return { data: result.captions };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to generate captions. Please try again.' };
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

export async function handleGenerateEmail(emailTopic: string, tone: GenerateEmailReplyInput['tone']) {
  const validation = emailSchema.safeParse({ emailTopic, tone });

  if (!validation.success) {
    return { error: validation.error.errors[0].message };
  }

  try {
    const result = await generateEmailReply({ emailTopic: validation.data.emailTopic, tone });
    return { data: result.emailBody };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to generate email. Please try again.' };
  }
}
