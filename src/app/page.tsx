'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Sparkles, Bot, ImageIcon, Pencil, BookUser, Lightbulb, Tag, Palette, TrendingUp, Languages, Copy, Check, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { handleGenerateDescription, handleGenerateCaptions, handleGenerateImage, handleGenerateStory, handleAnalyzeTrends, handleTranslate, handleGenerateEtsyListing, handleGenerateShopifyListing } from '@/app/actions';
import { Logo } from '@/components/icons';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { AnalyzeMarketTrendsOutput } from '@/ai/flows/analyze-market-trends';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { GenerateEtsyListingOutput } from '@/ai/flows/generate-etsy-listing';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { GenerateShopifyListingOutput } from '@/ai/flows/generate-shopify-listing';
import { Textarea } from '@/components/ui/textarea';

const tones = ['Persuasive', 'Creative', 'Professional'] as const;
type Tone = (typeof tones)[number];
const languages = ['Hindi', 'Spanish', 'French'];

export default function Home() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [productName, setProductName] = useState('');
  const [artisanName, setArtisanName] = useState('');
  const [description, setDescription] = useState<string | null>(null);
  const [captions, setCaptions] = useState<string[] | null>(null);
  const [story, setStory] = useState<string | null>(null);
  const [trends, setTrends] = useState<AnalyzeMarketTrendsOutput | null>(null);
  const [etsyListing, setEtsyListing] = useState<GenerateEtsyListingOutput | null>(null);
  const [shopifyListing, setShopifyListing] = useState<GenerateShopifyListingOutput | null>(null);
  const [isDescriptionLoading, setIsDescriptionLoading] = useState(false);
  const [isCaptionsLoading, setIsCaptionsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isStoryLoading, setIsStoryLoading] = useState(false);
  const [isTrendsLoading, setIsTrendsLoading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isEtsyLoading, setIsEtsyLoading] = useState(false);
  const [isShopifyLoading, setIsShopifyLoading] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [captionTone, setCaptionTone] = useState<Tone>('Creative');

  const defaultImage = PlaceHolderImages[0];
  const [displayImageUrl, setDisplayImageUrl] = useState<string>(defaultImage.imageUrl);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (generatedImageUrl) {
      setDisplayImageUrl(generatedImageUrl);
    } else {
      setDisplayImageUrl(defaultImage.imageUrl);
    }
  }, [generatedImageUrl, defaultImage.imageUrl]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  }

  const onGenerateDescription = async () => {
    if (!productName) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Please enter a product name.',
      });
      return;
    }

    setIsDescriptionLoading(true);
    setDescription(null);
    setEtsyListing(null);
    setShopifyListing(null);
    const result = await handleGenerateDescription(productName);
    setIsDescriptionLoading(false);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    } else {
      setDescription(result.data ?? null);
    }
  };

  const onGenerateCaptions = async () => {
    if (!productName) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Please enter a product name.',
      });
      return;
    }

    setIsCaptionsLoading(true);
    setCaptions(null);
    const result = await handleGenerateCaptions(productName, captionTone);
    setIsCaptionsLoading(false);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    } else {
      setCaptions(result.data ?? null);
    }
  };

  const onGenerateImage = async () => {
    if (!productName) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Please enter a product name.',
      });
      return;
    }
    setIsImageLoading(true);
    setGeneratedImageUrl(null);
    const result = await handleGenerateImage(productName);
    setIsImageLoading(false);
    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    } else if (result.data) {
      setGeneratedImageUrl(result.data);
    }
  }

  const onGenerateStory = async () => {
    if (!artisanName || !productName) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Please enter both an artisan and product name.',
      });
      return;
    }
    setIsStoryLoading(true);
    setStory(null);
    const result = await handleGenerateStory(artisanName, productName);
    setIsStoryLoading(false);
    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    } else if (result.data) {
      setStory(result.data);
    }
  }

  const onAnalyzeTrends = async () => {
    if (!productName) {
        toast({
            variant: 'destructive',
            title: 'Uh oh! Something went wrong.',
            description: 'Please enter a product name or craft type.',
        });
        return;
    }
    setIsTrendsLoading(true);
    setTrends(null);
    const result = await handleAnalyzeTrends(productName);
    setIsTrendsLoading(false);
    if (result.error) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: result.error,
        });
    } else if (result.data) {
        setTrends(result.data);
    }
  }

  const onTranslateDescription = async (language: string) => {
    if (!description) {
      toast({
        variant: 'destructive',
        title: 'Nothing to translate',
        description: 'Please generate a description first.',
      });
      return;
    }
    setIsTranslating(true);
    const result = await handleTranslate(description, language);
    setIsTranslating(false);
    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    } else if (result.data) {
      setDescription(result.data);
      toast({
        title: 'Success',
        description: `Description translated to ${language}.`,
      });
    }
  };

  const onGenerateEtsy = async () => {
    if (!productName || !description) {
      toast({
        variant: 'destructive',
        title: 'Missing Content',
        description: 'Please generate a product description first.',
      });
      return;
    }
    setIsEtsyLoading(true);
    setEtsyListing(null);
    const result = await handleGenerateEtsyListing(productName, description);
    setIsEtsyLoading(false);
    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    } else if (result.data) {
      setEtsyListing(result.data);
    }
  }

  const onGenerateShopify = async () => {
    if (!productName || !description) {
      toast({
        variant: 'destructive',
        title: 'Missing Content',
        description: 'Please generate a product description first.',
      });
      return;
    }
    setIsShopifyLoading(true);
    setShopifyListing(null);
    const result = await handleGenerateShopifyListing(productName, description);
    setIsShopifyLoading(false);
    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    } else if (result.data) {
      setShopifyListing(result.data);
    }
  }


  const onGenerateContent = () => {
    if (!productName) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Please enter a product name.',
      });
      return;
    }
    onGenerateDescription();
    onGenerateCaptions();
  }


  const isLoading = isDescriptionLoading || isCaptionsLoading || isImageLoading || isStoryLoading || isTrendsLoading || isTranslating || isEtsyLoading || isShopifyLoading;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Logo className="w-10 h-10 text-primary" />
              <h1 className="text-4xl font-headline font-bold text-foreground">
                CraftAI
              </h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
        </div>
        <p className="text-muted-foreground mt-2 text-lg">
          Your AI-powered marketplace assistant for showcasing Indian artisanship.
        </p>
      </header>

      <main className="flex-grow container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Create Your Listing</CardTitle>
                <CardDescription>
                  Enter your product and artisan name, and let our AI generate content for you.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
              <div className="space-y-2">
                  <Label htmlFor="artisan-name">Artisan Name</Label>
                  <Input
                    id="artisan-name"
                    placeholder="e.g., Priya Singh"
                    value={artisanName}
                    onChange={(e) => setArtisanName(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-name">Product Name / Craft Type</Label>
                  <Input
                    id="product-name"
                    placeholder="e.g., Handwoven Pashmina Scarf"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="caption-tone">Social Media Caption Tone</Label>
                  <Select value={captionTone} onValueChange={(value: Tone) => setCaptionTone(value)} disabled={isLoading}>
                    <SelectTrigger id="caption-tone">
                      <SelectValue placeholder="Select a tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {tones.map((tone) => (
                        <SelectItem key={tone} value={tone}>
                          {tone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                      <Button onClick={onGenerateContent} disabled={isLoading || !productName} className="w-full">
                          <Pencil className="mr-2 h-4 w-4" />
                          Description & Captions
                      </Button>
                      <Button onClick={onGenerateStory} disabled={isLoading || !productName || !artisanName} className="w-full" variant="secondary">
                          <BookUser className="mr-2 h-4 w-4" />
                          Generate Story
                      </Button>
                  </div>
                   <Button onClick={onAnalyzeTrends} disabled={isLoading || !productName} className="w-full" variant="outline">
                      <Lightbulb className="mr-2 h-4 w-4" />
                      Analyze Market Trends
                  </Button>
              </CardFooter>
            </Card>

             <Card className="overflow-hidden">
                <CardHeader className="flex flex-row items-start justify-between">
                  <div className="flex items-center gap-3">
                      <ImageIcon className="w-6 h-6 text-muted-foreground" />
                      <CardTitle className="font-headline text-2xl">Product Preview</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                    <div className="aspect-video w-full relative rounded-lg overflow-hidden border">
                      {isImageLoading ? (
                        <div className="h-full w-full flex items-center justify-center bg-muted">
                           <div className="text-center text-muted-foreground">
                             <p>Generating your image...</p>
                             <p className="text-xs">This may take a moment. If it fails, please check your API key.</p>
                           </div>
                        </div>
                      ) : (
                        <Image 
                            src={displayImageUrl}
                            alt={productName || 'Artisan product'}
                            fill
                            className="object-cover"
                            data-ai-hint={defaultImage.imageHint}
                        />
                      )}
                    </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={onGenerateImage} disabled={isImageLoading || !productName} className="w-full">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Image
                  </Button>
                </CardFooter>
            </Card>
          </div>
          
          <div className="lg:col-span-8 space-y-8">
            {(isTrendsLoading || trends) && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <Lightbulb className="w-6 h-6 text-primary" />
                    Market Trend Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isTrendsLoading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-1/3" />
                        <div className="flex flex-wrap gap-2">
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-6 w-16" />
                        </div>
                        <Skeleton className="h-8 w-1/3 mt-4" />
                        <div className="flex gap-2">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <Skeleton className="h-10 w-10 rounded-full" />
                        </div>
                    </div>
                  ) : (
                    trends && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                                    <Tag className="w-5 h-5 text-muted-foreground"/>
                                    Popular Keywords
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {trends.keywords.map(keyword => <Badge key={keyword} variant="secondary">{keyword}</Badge>)}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                                    <Palette className="w-5 h-5 text-muted-foreground"/>
                                    Trending Color Palette
                                </h3>
                                <div className="flex flex-wrap gap-4">
                                    {trends.colorPalette.map(color => (
                                        <div key={color.hex} className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full border-2 border-border" style={{ backgroundColor: color.hex }} />
                                            <span className="text-sm font-medium">{color.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                             <div>
                                <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                                    <TrendingUp className="w-5 h-5 text-muted-foreground"/>
                                    Style Suggestions
                                </h3>
                                <ul className="list-disc list-inside space-y-2 text-foreground/90">
                                   {trends.styleSuggestions.map((suggestion, i) => <li key={i}>{suggestion}</li>)}
                                </ul>
                            </div>
                        </div>
                    )
                  )}
                </CardContent>
              </Card>
            )}

            {(isStoryLoading || story) && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">AI-Generated Brand Story</CardTitle>
                </CardHeader>
                <CardContent>
                  {isStoryLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-4/6" />
                    </div>
                  ) : (
                    <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed">{story}</p>
                  )}
                </CardContent>
              </Card>
            )}

            {(isDescriptionLoading || description || isTranslating) && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start gap-4 flex-wrap">
                    <CardTitle className="font-headline text-2xl">AI-Generated Product Description</CardTitle>
                    <div className="flex-shrink-0 flex gap-2 flex-wrap">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" disabled={!description || isTranslating}>
                              <Languages className="mr-2 h-4 w-4" />
                              Translate
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {languages.map(lang => (
                              <DropdownMenuItem key={lang} onSelect={() => onTranslateDescription(lang)}>
                                {lang}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                         <Button variant="outline" size="sm" disabled={!description || isEtsyLoading} onClick={onGenerateEtsy}>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Etsy
                        </Button>
                         <Button variant="outline" size="sm" disabled={!description || isShopifyLoading} onClick={onGenerateShopify}>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Shopify
                        </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isDescriptionLoading || isTranslating ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ) : (
                    <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed">{description}</p>
                  )}
                </CardContent>
              </Card>
            )}

            {(isEtsyLoading || etsyListing) && (
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-primary" />
                            Etsy Listing Optimization
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isEtsyLoading ? (
                           <div className="space-y-4">
                                <Skeleton className="h-8 w-1/3" />
                                <Skeleton className="h-6 w-full" />
                                <Skeleton className="h-8 w-1/3 mt-4" />
                                <div className="flex flex-wrap gap-2">
                                    <Skeleton className="h-6 w-20" />
                                    <Skeleton className="h-6 w-24" />
                                    <Skeleton className="h-6 w-16" />
                                    <Skeleton className="h-6 w-20" />
                                    <Skeleton className="h-6 w-24" />
                                </div>
                            </div>
                        ) : (
                            etsyListing && (
                                <TooltipProvider>
                                    <div className="space-y-6">
                                        <div>
                                            <Label className="text-base font-semibold flex items-center gap-2 mb-2">
                                                Etsy Title
                                            </Label>
                                            <div className="relative">
                                                <Input readOnly value={etsyListing.etsyTitle} className="pr-10 bg-muted" />
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="absolute top-1/2 right-1 -translate-y-1/2 h-8 w-8" onClick={() => copyToClipboard(etsyListing.etsyTitle, 'etsy-title')}>
                                                            {copied === 'etsy-title' ? <Check className="w-4 h-4 text-green-500"/> : <Copy className="w-4 h-4" />}
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Copy Title</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-base font-semibold flex items-center gap-2 mb-2">
                                                <Tag className="w-5 h-5 text-muted-foreground"/>
                                                Etsy Tags
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {etsyListing.etsyTags.map(tag => (
                                                    <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => copyToClipboard(tag, `etsy-tag-${tag}`)}>
                                                        {tag}
                                                        {copied === `etsy-tag-${tag}` ? <Check className="w-3 h-3 ml-1 text-green-500"/> : <Copy className="w-3 h-3 ml-1 opacity-50"/> }
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </TooltipProvider>
                            )
                        )}
                    </CardContent>
                </Card>
            )}

            {(isShopifyLoading || shopifyListing) && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-primary" />
                    Shopify Listing Optimization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isShopifyLoading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-1/3" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-8 w-1/3 mt-4" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-8 w-1/3 mt-4" />
                        <div className="flex flex-wrap gap-2">
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-6 w-16" />
                        </div>
                    </div>
                  ) : (
                    shopifyListing && (
                      <TooltipProvider>
                        <div className="space-y-6">
                          <div>
                            <Label className="text-base font-semibold flex items-center gap-2 mb-2">
                              Shopify Title
                            </Label>
                            <div className="relative">
                              <Input readOnly value={shopifyListing.shopifyTitle} className="pr-10 bg-muted" />
                              <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="absolute top-1/2 right-1 -translate-y-1/2 h-8 w-8" onClick={() => copyToClipboard(shopifyListing.shopifyTitle, 'shopify-title')}>
                                        {copied === 'shopify-title' ? <Check className="w-4 h-4 text-green-500"/> : <Copy className="w-4 h-4" />}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>Copy Title</p></TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
                          <div>
                            <Label className="text-base font-semibold flex items-center gap-2 mb-2">
                              Shopify Meta Description
                            </Label>
                            <div className="relative">
                              <Textarea readOnly value={shopifyListing.shopifyMetaDescription} className="pr-10 bg-muted" rows={3} />
                               <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="absolute top-2 right-1 h-8 w-8" onClick={() => copyToClipboard(shopifyListing.shopifyMetaDescription, 'shopify-desc')}>
                                        {copied === 'shopify-desc' ? <Check className="w-4 h-4 text-green-500"/> : <Copy className="w-4 h-4" />}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>Copy Description</p></TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-base font-semibold flex items-center gap-2 mb-2">
                              <Tag className="w-5 h-5 text-muted-foreground" />
                              Shopify Tags
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {shopifyListing.shopifyTags.map(tag => (
                                <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => copyToClipboard(tag, `shopify-tag-${tag}`)}>
                                  {tag}
                                  {copied === `shopify-tag-${tag}` ? <Check className="w-3 h-3 ml-1 text-green-500"/> : <Copy className="w-3 h-3 ml-1 opacity-50"/> }
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </TooltipProvider>
                    )
                  )}
                </CardContent>
              </Card>
            )}

            {(isCaptionsLoading || captions) && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">AI-Generated Social Media Captions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isCaptionsLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-4/5" />
                        </div>
                      </div>
                    ))
                  ) : (
                    captions?.map((caption, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 border rounded-lg bg-card-foreground/5">
                        <div className="p-2 bg-primary rounded-full">
                           <Bot className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <p className="flex-1 text-foreground/90">{caption}</p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
