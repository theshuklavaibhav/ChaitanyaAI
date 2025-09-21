'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Sparkles, Bot, ImageIcon, Pencil, BookUser, Lightbulb, Tag, Palette, TrendingUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { handleGenerateDescription, handleGenerateCaptions, handleGenerateImage, handleGenerateStory, handleAnalyzeTrends } from '@/app/actions';
import { Logo } from '@/components/icons';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { AnalyzeMarketTrendsOutput } from '@/ai/flows/analyze-market-trends';

const tones = ['Persuasive', 'Creative', 'Professional'] as const;
type Tone = (typeof tones)[number];

export default function Home() {
  const { toast } = useToast();
  const [productName, setProductName] = useState('');
  const [artisanName, setArtisanName] = useState('');
  const [description, setDescription] = useState<string | null>(null);
  const [captions, setCaptions] = useState<string[] | null>(null);
  const [story, setStory] = useState<string | null>(null);
  const [trends, setTrends] = useState<AnalyzeMarketTrendsOutput | null>(null);
  const [isDescriptionLoading, setIsDescriptionLoading] = useState(false);
  const [isCaptionsLoading, setIsCaptionsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isStoryLoading, setIsStoryLoading] = useState(false);
  const [isTrendsLoading, setIsTrendsLoading] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [captionTone, setCaptionTone] = useState<Tone>('Creative');

  const defaultImage = PlaceHolderImages[0];
  const [displayImageUrl, setDisplayImageUrl] = useState<string>(defaultImage.imageUrl);

  useEffect(() => {
    if (generatedImageUrl) {
      setDisplayImageUrl(generatedImageUrl);
    } else {
      setDisplayImageUrl(defaultImage.imageUrl);
    }
  }, [generatedImageUrl, defaultImage.imageUrl]);


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


  const isLoading = isDescriptionLoading || isCaptionsLoading || isImageLoading || isStoryLoading || isTrendsLoading;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3">
          <Logo className="w-10 h-10 text-primary" />
          <h1 className="text-4xl font-headline font-bold text-foreground">
            CraftAI
          </h1>
        </div>
        <p className="text-muted-foreground mt-2">
          Your AI-powered marketplace assistant for showcasing Indian artisanship.
        </p>
      </header>

      <main className="flex-grow container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <Card className="shadow-lg">
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
                    <Button onClick={onGenerateStory} disabled={isLoading || !productName || !artisanName} className="w-full">
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
          
          <div className="space-y-8">
            <Card className="overflow-hidden shadow-lg">
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
                  <Button onClick={onGenerateImage} disabled={isImageLoading || !productName} className="w-full" variant="secondary">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Image
                  </Button>
                </CardFooter>
            </Card>

            {(isTrendsLoading || trends) && (
              <Card className="shadow-lg">
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
                                            <div className="w-8 h-8 rounded-full border-2" style={{ backgroundColor: color.hex }} />
                                            <span className="text-sm">{color.name}</span>
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
              <Card className="shadow-lg">
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

            {(isDescriptionLoading || description) && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">AI-Generated Product Description</CardTitle>
                </CardHeader>
                <CardContent>
                  {isDescriptionLoading ? (
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

            {(isCaptionsLoading || captions) && (
              <Card className="shadow-lg">
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
                        <div className="p-2 bg-accent rounded-full">
                           <Bot className="w-5 h-5 text-accent-foreground" />
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
