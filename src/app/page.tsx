'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Sparkles, Bot, ImageIcon, Pencil, BookUser, Lightbulb, Tag, Palette, TrendingUp, Languages, Copy, Check } from 'lucide-react';
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
import { GoogleCloudLogo } from '@/components/google-cloud-logo';

const tones = ['Persuasive', 'Creative', 'Professional'] as const;
type Tone = (typeof tones)[number];
const languages = ['Hindi', 'Spanish', 'French'];

export default function Home() {
  const { toast } = useToast();
  const [productName, setProductName] = useState('');
  const [brandName, setBrandName] = useState('');
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

  const mainContentRef = useRef<HTMLDivElement>(null);

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

  const scrollToContent = () => {
    mainContentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const onGenerateDescription = async () => {
    if (!productName) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Please enter a product or service name.',
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
        description: 'Please enter a product or service name.',
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
        description: 'Please enter a product or service name.',
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
    if (!brandName || !productName) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Please enter a brand/founder name and a product/service.',
      });
      return;
    }
    setIsStoryLoading(true);
    setStory(null);
    const result = await handleGenerateStory(brandName, productName);
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
            description: 'Please enter a product, service, or industry.',
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
        description: 'Please enter a product or service name.',
      });
      return;
    }
    onGenerateDescription();
    onGenerateCaptions();
  }


  const isLoading = isDescriptionLoading || isCaptionsLoading || isImageLoading || isStoryLoading || isTrendsLoading || isTranslating || isEtsyLoading || isShopifyLoading;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
       <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center">
            <div className="flex items-center gap-3">
              <Logo className="w-8 h-8 text-cyan-400" />
              <h1 className="text-2xl font-bold text-white">
                ChaitanyaAI
              </h1>
            </div>
        </div>
      </header>
      
      <main className="flex-grow">
        <section 
          className="container mx-auto px-4 py-20 lg:py-32 text-center relative"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500/10 to-cyan-400/10 blur-3xl"></div>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight relative">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">ChaitanyaAi</span>
          </h1>
          <p className="mt-4 text-lg md:text-2xl text-white/80 max-w-3xl mx-auto relative font-light">
              Your Strategic AI Partner
          </p>
          <button
              onClick={scrollToContent}
              className="mt-10 relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            >
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#70D5F3_0%,#3B82F6_50%,#70D5F3_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-8 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                Schedule a Discovery Meeting
              </span>
            </button>
        </section>

          <div ref={mainContentRef} className="container mx-auto px-4 pb-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-4 space-y-8 sticky top-24">
                <Card className="bg-slate-900/50 border-cyan-400/20">
                  <CardHeader>
                    <CardTitle className="font-bold text-2xl text-white">Generate Your Content</CardTitle>
                    <CardDescription className="text-white/60">
                      Enter your business details and let our AI generate marketing content for you.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                  <div className="space-y-2">
                      <Label htmlFor="brand-name" className="text-white/80">Brand / Founder Name</Label>
                      <Input
                        id="brand-name"
                        placeholder="e.g., Priya's Kitchen"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        disabled={isLoading}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product-name" className="text-white/80">Product / Service / Industry</Label>
                      <Input
                        id="product-name"
                        placeholder="e.g., Homemade Pickles"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        disabled={isLoading}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="caption-tone" className="text-white/80">Social Media Caption Tone</Label>
                      <Select value={captionTone} onValueChange={(value: Tone) => setCaptionTone(value)} disabled={isLoading}>
                        <SelectTrigger id="caption-tone" className="bg-slate-800 border-slate-700 text-white">
                          <SelectValue placeholder="Select a tone" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-700 text-white">
                          {tones.map((tone) => (
                            <SelectItem key={tone} value={tone} className="focus:bg-slate-800">
                              {tone}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                          <Button onClick={onGenerateContent} disabled={isLoading || !productName} className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold">
                              <Pencil className="mr-2 h-4 w-4" />
                              Description & Captions
                          </Button>
                          <Button onClick={onGenerateStory} disabled={isLoading || !productName || !brandName} className="w-full bg-slate-800 hover:bg-slate-700 text-white" variant="secondary">
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

                 <Card className="overflow-hidden bg-slate-900/50 border-cyan-400/20">
                    <CardHeader className="flex flex-row items-start justify-between">
                      <div className="flex items-center gap-3">
                          <ImageIcon className="w-6 h-6 text-muted-foreground" />
                          <CardTitle className="font-bold text-2xl text-white">Product Preview</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                        <div className="aspect-video w-full relative rounded-lg overflow-hidden border border-cyan-400/20">
                          {isImageLoading ? (
                            <div className="h-full w-full flex items-center justify-center bg-slate-900">
                               <div className="text-center text-cyan-400/80">
                                 <p>Generating your image...</p>
                                 <p className="text-xs">This may take a moment.</p>
                               </div>
                            </div>
                          ) : (
                            <Image 
                                src={displayImageUrl}
                                alt={productName || 'Product or service'}
                                fill
                                className="object-cover"
                                data-ai-hint={defaultImage.imageHint}
                            />
                          )}
                        </div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={onGenerateImage} disabled={isImageLoading || !productName} className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold">
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate Image
                      </Button>
                    </CardFooter>
                </Card>
              </div>
              
              <div className="lg:col-span-8">
                <div className="space-y-8">
                    {(isTrendsLoading || trends) && (
                      <Card className="bg-slate-900/50 border-cyan-400/20">
                        <CardHeader>
                          <CardTitle className="font-bold text-2xl flex items-center gap-2 text-white">
                            <Lightbulb className="w-6 h-6 text-cyan-400" />
                            Market Trend Analysis
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {isTrendsLoading ? (
                            <div className="space-y-4">
                                <Skeleton className="h-8 w-1/3 bg-slate-800" />
                                <div className="flex flex-wrap gap-2">
                                    <Skeleton className="h-6 w-20 bg-slate-800" />
                                    <Skeleton className="h-6 w-24 bg-slate-800" />
                                    <Skeleton className="h-6 w-16 bg-slate-800" />
                                </div>
                                <Skeleton className="h-8 w-1/3 mt-4 bg-slate-800" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-10 w-10 rounded-full bg-slate-800" />
                                    <Skeleton className="h-10 w-10 rounded-full bg-slate-800" />
                                    <Skeleton className="h-10 w-10 rounded-full bg-slate-800" />
                                </div>
                            </div>
                          ) : (
                            trends && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold flex items-center gap-2 mb-2 text-white/90">
                                            <Tag className="w-5 h-5 text-muted-foreground"/>
                                            Popular Keywords
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {trends.keywords.map(keyword => <Badge key={keyword} variant="secondary" className="bg-slate-800 text-white/80">{keyword}</Badge>)}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold flex items-center gap-2 mb-2 text-white/90">
                                            <Palette className="w-5 h-5 text-muted-foreground"/>
                                            Trending Color Palette
                                        </h3>
                                        <div className="flex flex-wrap gap-4">
                                            {trends.colorPalette.map(color => (
                                                <div key={color.hex} className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full border-2 border-slate-700" style={{ backgroundColor: color.hex }} />
                                                    <span className="text-sm font-medium text-white/80">{color.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                     <div>
                                        <h3 className="text-lg font-semibold flex items-center gap-2 mb-2 text-white/90">
                                            <TrendingUp className="w-5 h-5 text-muted-foreground"/>
                                            Style Suggestions
                                        </h3>
                                        <ul className="list-disc list-inside space-y-2 text-white/80">
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
                      <Card className="bg-slate-900/50 border-cyan-400/20">
                        <CardHeader>
                          <CardTitle className="font-bold text-2xl flex items-center gap-2 text-white">
                            <BookUser className="w-6 h-6 text-cyan-400" />
                            AI-Generated Brand Story
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {isStoryLoading ? (
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-full bg-slate-800" />
                              <Skeleton className="h-4 w-full bg-slate-800" />
                              <Skeleton className="h-4 w-5/6 bg-slate-800" />
                              <Skeleton className="h-4 w-3/4 bg-slate-800" />
                              <Skeleton className="h-4 w-full bg-slate-800" />
                              <Skeleton className="h-4 w-4/6 bg-slate-800" />
                            </div>
                          ) : (
                            <p className="text-white/80 whitespace-pre-wrap leading-relaxed">{story}</p>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {(isDescriptionLoading || description || isTranslating) && (
                      <Card className="bg-slate-900/50 border-cyan-400/20">
                        <CardHeader>
                          <div className="flex justify-between items-start gap-4 flex-wrap">
                            <CardTitle className="font-bold text-2xl flex items-center gap-2 text-white">
                               <Pencil className="w-6 h-6 text-cyan-400" />
                               AI-Generated Product Description
                            </CardTitle>
                            <div className="flex-shrink-0 flex gap-2 flex-wrap">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" disabled={!description || isTranslating} className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-white">
                                      <Languages className="mr-2 h-4 w-4" />
                                      Translate
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent className="bg-slate-900 border-slate-700 text-white">
                                    {languages.map(lang => (
                                      <DropdownMenuItem key={lang} onSelect={() => onTranslateDescription(lang)} className="focus:bg-slate-800">
                                        {lang}
                                      </DropdownMenuItem>
                                    ))}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                                 <Button variant="outline" size="sm" disabled={!description || isEtsyLoading} onClick={onGenerateEtsy} className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-white">
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Etsy
                                </Button>
                                 <Button variant="outline" size="sm" disabled={!description || isShopifyLoading} onClick={onGenerateShopify} className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-white">
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Shopify
                                </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {isDescriptionLoading || isTranslating ? (
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-full bg-slate-800" />
                              <Skeleton className="h-4 w-full bg-slate-800" />
                              <Skeleton className="h-4 w-5/6 bg-slate-800" />
                              <Skeleton className="h-4 w-3/4 bg-slate-800" />
                            </div>
                          ) : (
                            <p className="text-white/80 whitespace-pre-wrap leading-relaxed">{description}</p>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {(isEtsyLoading || etsyListing) && (
                        <Card className="bg-slate-900/50 border-cyan-400/20">
                            <CardHeader>
                                <CardTitle className="font-bold text-2xl flex items-center gap-2 text-white">
                                    <Sparkles className="w-6 h-6 text-cyan-400" />
                                    Etsy Listing Optimization
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isEtsyLoading ? (
                                   <div className="space-y-4">
                                        <Skeleton className="h-8 w-1/3 bg-slate-800" />
                                        <Skeleton className="h-6 w-full bg-slate-800" />
                                        <Skeleton className="h-8 w-1/3 mt-4 bg-slate-800" />
                                        <div className="flex flex-wrap gap-2">
                                            <Skeleton className="h-6 w-20 bg-slate-800" />
                                            <Skeleton className="h-6 w-24 bg-slate-800" />
                                            <Skeleton className="h-6 w-16 bg-slate-800" />
                                            <Skeleton className="h-6 w-20 bg-slate-800" />
                                            <Skeleton className="h-6 w-24 bg-slate-800" />
                                        </div>
                                    </div>
                                ) : (
                                    etsyListing && (
                                        <TooltipProvider>
                                            <div className="space-y-6">
                                                <div>
                                                    <Label className="text-base font-semibold flex items-center gap-2 mb-2 text-white/90">
                                                        Etsy Title
                                                    </Label>
                                                    <div className="relative">
                                                        <Input readOnly value={etsyListing.etsyTitle} className="pr-10 bg-slate-800 border-slate-700 text-white" />
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
                                                    <h3 className="text-base font-semibold flex items-center gap-2 mb-2 text-white/90">
                                                        <Tag className="w-5 h-5 text-muted-foreground"/>
                                                        Etsy Tags
                                                    </h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {etsyListing.etsyTags.map(tag => (
                                                            <Badge key={tag} variant="secondary" className="cursor-pointer bg-slate-800 text-white/80" onClick={() => copyToClipboard(tag, `etsy-tag-${tag}`)}>
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
                      <Card className="bg-slate-900/50 border-cyan-400/20">
                        <CardHeader>
                          <CardTitle className="font-bold text-2xl flex items-center gap-2 text-white">
                            <Sparkles className="w-6 h-6 text-cyan-400" />
                            Shopify Listing Optimization
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {isShopifyLoading ? (
                            <div className="space-y-4">
                                <Skeleton className="h-8 w-1/3 bg-slate-800" />
                                <Skeleton className="h-6 w-full bg-slate-800" />
                                <Skeleton className="h-8 w-1/3 mt-4 bg-slate-800" />
                                <Skeleton className="h-10 w-full bg-slate-800" />
                                <Skeleton className="h-8 w-1_3 mt-4 bg-slate-800" />
                                <div className="flex flex-wrap gap-2">
                                    <Skeleton className="h-6 w-20 bg-slate-800" />
                                    <Skeleton className="h-6 w-24 bg-slate-800" />
                                    <Skeleton className="h-6 w-16 bg-slate-800" />
                                </div>
                            </div>
                          ) : (
                            shopifyListing && (
                              <TooltipProvider>
                                <div className="space-y-6">
                                  <div>
                                    <Label className="text-base font-semibold flex items-center gap-2 mb-2 text-white/90">
                                      Shopify Title
                                    </Label>
                                    <div className="relative">
                                      <Input readOnly value={shopifyListing.shopifyTitle} className="pr-10 bg-slate-800 border-slate-700 text-white" />
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
                                    <Label className="text-base font-semibold flex items-center gap-2 mb-2 text-white/90">
                                      Shopify Meta Description
                                    </Label>
                                    <div className="relative">
                                      <Textarea readOnly value={shopifyListing.shopifyMetaDescription} className="pr-10 bg-slate-800 border-slate-700 text-white" rows={3} />
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
                                    <h3 className="text-base font-semibold flex items-center gap-2 mb-2 text-white/90">
                                      <Tag className="w-5 h-5 text-muted-foreground" />
                                      Shopify Tags
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                      {shopifyListing.shopifyTags.map(tag => (
                                        <Badge key={tag} variant="secondary" className="cursor-pointer bg-slate-800 text-white/80" onClick={() => copyToClipboard(tag, `shopify-tag-${tag}`)}>
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
                      <Card className="bg-slate-900/50 border-cyan-400/20">
                        <CardHeader>
                          <CardTitle className="font-bold text-2xl flex items-center gap-2 text-white">
                            <Bot className="w-6 h-6 text-cyan-400" />
                            AI-Generated Social Media Captions
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {isCaptionsLoading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                              <div key={i} className="flex items-start gap-4">
                                <Skeleton className="h-8 w-8 rounded-full bg-slate-800" />
                                <div className="flex-1 space-y-2">
                                  <Skeleton className="h-4 w-full bg-slate-800" />
                                  <Skeleton className="h-4 w-4/5 bg-slate-800" />
                                </div>
                              </div>
                            ))
                          ) : (
                            captions?.map((caption, index) => (
                              <div key={index} className="flex items-start gap-4 p-4 border border-cyan-400/20 rounded-lg bg-slate-900">
                                <div className="p-2 bg-cyan-500 rounded-full">
                                   <Bot className="w-5 h-5 text-slate-900" />
                                </div>
                                <p className="flex-1 text-white/80">{caption}</p>
                              </div>
                            ))
                          )}
                        </CardContent>
                      </Card>
                    )}
                </div>
              </div>
            </div>
          </div>
      </main>
      <footer className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground">
            <p>Powered by</p>
            <GoogleCloudLogo className="w-28" />
        </div>
      </footer>
    </div>
  );

    