'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Sparkles, Bot, Pencil, BookUser, Lightbulb, Tag, Palette, TrendingUp, Languages, Copy, Check, Sun, Moon, Github, Menu, Mail } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { handleGenerateDescription, handleGenerateCaptions, handleGenerateStory, handleAnalyzeTrends, handleTranslate, handleGenerateEtsyListing, handleGenerateShopifyListing, handleGenerateEmail } from '@/app/actions';
import { Logo } from '@/components/icons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { AnalyzeMarketTrendsOutput } from '@/ai/flows/analyze-market-trends';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { GenerateEtsyListingOutput } from '@/ai/flows/generate-etsy-listing';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { GenerateShopifyListingOutput } from '@/ai/flows/generate-shopify-listing';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const tones = ['Persuasive', 'Creative', 'Professional'] as const;
type Tone = (typeof tones)[number];
const languages = ['Hindi', 'Spanish', 'French'];
const emailTones = ['Formal', 'Friendly', 'Direct'] as const;
type EmailTone = (typeof emailTones)[number];

export default function Home() {
  const { toast } = useToast();
  const { setTheme } = useTheme()
  const [productName, setProductName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [description, setDescription] = useState<string | null>(null);
  const [captions, setCaptions] = useState<string[] | null>(null);
  const [story, setStory] = useState<string | null>(null);
  const [trends, setTrends] = useState<AnalyzeMarketTrendsOutput | null>(null);
  const [etsyListing, setEtsyListing] = useState<GenerateEtsyListingOutput | null>(null);
  const [shopifyListing, setShopifyListing] = useState<GenerateShopifyListingOutput | null>(null);
  const [emailTopic, setEmailTopic] = useState('');
  const [emailTone, setEmailTone] = useState<EmailTone>('Friendly');
  const [generatedEmail, setGeneratedEmail] = useState<string | null>(null);

  const [isDescriptionLoading, setIsDescriptionLoading] = useState(false);
  const [isCaptionsLoading, setIsCaptionsLoading] = useState(false);
  const [isStoryLoading, setIsStoryLoading] = useState(false);
  const [isTrendsLoading, setIsTrendsLoading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isEtsyLoading, setIsEtsyLoading] = useState(false);
  const [isShopifyLoading, setIsShopifyLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);

  const [captionTone, setCaptionTone] = useState<Tone>('Creative');

  const mainContentRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  }

  const scrollToContent = () => {
    mainContentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const scrollToFooter = () => {
    footerRef.current?.scrollIntoView({ behavior: 'smooth' });
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

  const onGenerateEmail = async () => {
    if (!emailTopic) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Please enter an email topic.',
      });
      return;
    }
    setIsEmailLoading(true);
    setGeneratedEmail(null);
    const result = await handleGenerateEmail(emailTopic, emailTone);
    setIsEmailLoading(false);
    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    } else if (result.data) {
      setGeneratedEmail(result.data);
    }
  };


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


  const isLoading = isDescriptionLoading || isCaptionsLoading || isStoryLoading || isTrendsLoading || isTranslating || isEtsyLoading || isShopifyLoading || isEmailLoading;

  const navLinks = (
    <>
      <Button variant="link" onClick={() => { scrollToContent(); setIsMobileMenuOpen(false); }} className="text-foreground/80 hover:text-foreground">Features</Button>
      <Button variant="link" onClick={() => { scrollToFooter(); setIsMobileMenuOpen(false); }} className="text-foreground/80 hover:text-foreground">About</Button>
    </>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
       <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
            <div className="mr-4 flex items-center">
              <a className="mr-6 flex items-center space-x-2" href="/">
                <Logo className="w-8 h-8 text-primary" />
                <span className="hidden font-bold sm:inline-block">
                  ChaitanyaAI
                </span>
              </a>
              <nav className="hidden items-center space-x-2 md:flex">
                {navLinks}
              </nav>
            </div>
            
            <div className="flex flex-1 items-center justify-end space-x-2">
              <a href="https://github.com/GoogleCloudPlatform/firebase-studio-templates" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon">
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </Button>
              </a>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover border-border text-popover-foreground">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="md:hidden">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-6 w-6" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[240px] bg-background">
                     <div className="mt-8 flex flex-col space-y-4">
                      {navLinks}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
        </div>
      </header>
      
      <main className="flex-grow">
        <section 
          className="container mx-auto px-4 py-16 md:py-20 lg:py-32 text-center relative"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500/10 to-cyan-400/10 blur-3xl dark:from-blue-500/10 dark:to-cyan-400/10"></div>
          <h1 suppressHydrationWarning className="text-4xl md:text-6xl font-bold leading-tight relative bg-clip-text text-transparent bg-gradient-to-b from-foreground/80 to-foreground">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">ChaitanyaAI</span>
          </h1>
          <div suppressHydrationWarning className="mt-4 text-lg md:text-2xl text-foreground/60 max-w-3xl mx-auto relative font-light">
             AI-powered content generation for small businesses, MSMEs, and entrepreneurs.
          </div>
          <button
              onClick={scrollToContent}
              className="mt-10 relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            >
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#70D5F3_0%,#3B82F6_50%,#70D5F3_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-card px-8 py-1 text-sm font-medium text-foreground backdrop-blur-3xl">
                Get Started
              </span>
            </button>
        </section>

          <div ref={mainContentRef} className="container mx-auto px-4 pb-24">
            <div className="flex flex-col items-center gap-8">
              <div className="w-full max-w-xl space-y-8">
                <Tabs defaultValue="marketing" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="marketing">Marketing Content</TabsTrigger>
                    <TabsTrigger value="email">Email Responder</TabsTrigger>
                  </TabsList>
                  <TabsContent value="marketing">
                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle className="font-bold text-2xl">Generate Marketing Content</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          Enter your business details and let our AI generate marketing content for you.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                      <div className="space-y-2">
                          <Label htmlFor="brand-name">Brand / Founder Name</Label>
                          <Input
                            id="brand-name"
                            placeholder="e.g., Priya's Kitchen"
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                            disabled={isLoading}
                            className="bg-background border-input"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="product-name">Product / Service / Industry</Label>
                          <Input
                            id="product-name"
                            placeholder="e.g., Homemade Pickles"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            disabled={isLoading}
                            className="bg-background border-input"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="caption-tone">Social Media Caption Tone</Label>
                          <Select value={captionTone} onValueChange={(value: Tone) => setCaptionTone(value)} disabled={isLoading}>
                            <SelectTrigger id="caption-tone" className="bg-background border-input">
                              <SelectValue placeholder="Select a tone" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border text-popover-foreground">
                              {tones.map((tone) => (
                                <SelectItem key={tone} value={tone} className="focus:bg-accent">
                                  {tone}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-col gap-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                              <Button onClick={onGenerateContent} disabled={isLoading || !productName} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Description & Captions
                              </Button>
                              <Button onClick={onGenerateStory} disabled={isLoading || !productName || !brandName} className="w-full" variant="secondary">
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
                  </TabsContent>
                  <TabsContent value="email">
                    <Card>
                      <CardHeader>
                        <CardTitle className="font-bold text-2xl">AI Email Responder</CardTitle>
                        <CardDescription>
                          Draft professional emails in seconds. Just provide the topic and tone.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email-topic">Email Topic</Label>
                          <Input
                            id="email-topic"
                            placeholder="e.g., Follow up on invoice #123"
                            value={emailTopic}
                            onChange={(e) => setEmailTopic(e.target.value)}
                            disabled={isLoading}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email-tone">Tone</Label>
                          <Select value={emailTone} onValueChange={(value: EmailTone) => setEmailTone(value)} disabled={isLoading}>
                            <SelectTrigger id="email-tone">
                              <SelectValue placeholder="Select a tone" />
                            </SelectTrigger>
                            <SelectContent>
                              {emailTones.map((tone) => (
                                <SelectItem key={tone} value={tone}>{tone}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button onClick={onGenerateEmail} disabled={isLoading || !emailTopic} className="w-full">
                          <Mail className="mr-2 h-4 w-4" />
                          Generate Email
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="w-full max-w-4xl">
                <div className="space-y-8">
                    {(isTrendsLoading || trends) && (
                      <Card className="bg-card border-border">
                        <CardHeader>
                          <CardTitle className="font-bold text-2xl flex items-center gap-2">
                            <Lightbulb className="w-6 h-6 text-primary" />
                            Market Trend Analysis
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {isTrendsLoading ? (
                            <div className="space-y-4">
                                <Skeleton className="h-8 w-1/3 bg-muted" />
                                <div className="flex flex-wrap gap-2">
                                    <Skeleton className="h-6 w-20 bg-muted" />
                                    <Skeleton className="h-6 w-24 bg-muted" />
                                    <Skeleton className="h-6 w-16 bg-muted" />
                                </div>
                                <Skeleton className="h-8 w-1/3 mt-4 bg-muted" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-10 w-10 rounded-full bg-muted" />
                                    <Skeleton className="h-10 w-10 rounded-full bg-muted" />
                                    <Skeleton className="h-10 w-10 rounded-full bg-muted" />
                                </div>
                            </div>
                          ) : (
                            trends && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold flex items-center gap-2 mb-2 text-foreground/90">
                                            <Tag className="w-5 h-5 text-muted-foreground"/>
                                            Popular Keywords
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {trends.keywords.map(keyword => <Badge key={keyword} variant="secondary">{keyword}</Badge>)}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold flex items-center gap-2 mb-2 text-foreground/90">
                                            <Palette className="w-5 h-5 text-muted-foreground"/>
                                            Trending Color Palette
                                        </h3>
                                        <div className="flex flex-wrap gap-4">
                                            {trends.colorPalette.map(color => (
                                                <div key={color.hex} className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full border-2 border-border" style={{ backgroundColor: color.hex }} />
                                                    <span className="text-sm font-medium text-foreground/80">{color.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                     <div>
                                        <h3 className="text-lg font-semibold flex items-center gap-2 mb-2 text-foreground/90">
                                            <TrendingUp className="w-5 h-5 text-muted-foreground"/>
                                            Style Suggestions
                                        </h3>
                                        <ul className="list-disc list-inside space-y-2 text-foreground/80">
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
                      <Card className="bg-card border-border">
                        <CardHeader>
                          <CardTitle className="font-bold text-2xl flex items-center gap-2">
                            <BookUser className="w-6 h-6 text-primary" />
                            AI-Generated Brand Story
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {isStoryLoading ? (
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-full bg-muted" />
                              <Skeleton className="h-4 w-full bg-muted" />
                              <Skeleton className="h-4 w-5/6 bg-muted" />
                              <Skeleton className="h-4 w-3/4 bg-muted" />
                              <Skeleton className="h-4 w-full bg-muted" />
                              <Skeleton className="h-4 w-4/6 bg-muted" />
                            </div>
                          ) : (
                            <p className="text-foreground/80 whitespace-pre-wrap leading-relaxed">{story}</p>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {(isEmailLoading || generatedEmail) && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-bold text-2xl flex items-center gap-2">
                                    <Mail className="w-6 h-6 text-primary" />
                                    Generated Email Draft
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isEmailLoading ? (
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-1/4" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-3/4" />
                                    </div>
                                ) : (
                                    generatedEmail && (
                                        <div className="relative">
                                            <Textarea readOnly value={generatedEmail} className="pr-10 bg-background border-input" rows={10} />
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="absolute top-2 right-1 h-8 w-8" onClick={() => copyToClipboard(generatedEmail, 'email')}>
                                                            {copied === 'email' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent><p>Copy Email</p></TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    )
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {(isDescriptionLoading || description || isTranslating) && (
                      <Card className="bg-card border-border">
                        <CardHeader>
                          <div className="flex justify-between items-start gap-4 flex-wrap">
                            <CardTitle className="font-bold text-2xl flex items-center gap-2">
                               <Pencil className="w-6 h-6 text-primary" />
                               AI-Generated Product Description
                            </CardTitle>
                            <div className="flex-shrink-0 flex gap-2 flex-wrap">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" disabled={!description || isTranslating}>
                                      <Languages className="mr-2 h-4 w-4" />
                                      Translate
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent className="bg-popover border-border text-popover-foreground">
                                    {languages.map(lang => (
                                      <DropdownMenuItem key={lang} onSelect={() => onTranslateDescription(lang)} className="focus:bg-accent">
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
                              <Skeleton className="h-4 w-full bg-muted" />
                              <Skeleton className="h-4 w-full bg-muted" />
                              <Skeleton className="h-4 w-5/6 bg-muted" />
                              <Skeleton className="h-4 w-3/4 bg-muted" />
                            </div>
                          ) : (
                            <p className="text-foreground/80 whitespace-pre-wrap leading-relaxed">{description}</p>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {(isEtsyLoading || etsyListing) && (
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="font-bold text-2xl flex items-center gap-2">
                                    <Sparkles className="w-6 h-6 text-primary" />
                                    Etsy Listing Optimization
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isEtsyLoading ? (
                                   <div className="space-y-4">
                                        <Skeleton className="h-8 w-1/3 bg-muted" />
                                        <Skeleton className="h-6 w-full bg-muted" />
                                        <Skeleton className="h-8 w-1/3 mt-4 bg-muted" />
                                        <div className="flex flex-wrap gap-2">
                                            <Skeleton className="h-6 w-20 bg-muted" />
                                            <Skeleton className="h-6 w-24 bg-muted" />
                                            <Skeleton className="h-6 w-16 bg-muted" />
                                            <Skeleton className="h-6 w-20 bg-muted" />
                                            <Skeleton className="h-6 w-24 bg-muted" />
                                        </div>
                                    </div>
                                ) : (
                                    etsyListing && (
                                        <TooltipProvider>
                                            <div className="space-y-6">
                                                <div>
                                                    <Label className="text-base font-semibold flex items-center gap-2 mb-2 text-foreground/90">
                                                        Etsy Title
                                                    </Label>
                                                    <div className="relative">
                                                        <Input readOnly value={etsyListing.etsyTitle} className="pr-10 bg-background border-input" />
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
                                                    <h3 className="text-base font-semibold flex items-center gap-2 mb-2 text-foreground/90">
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
                      <Card className="bg-card border-border">
                        <CardHeader>
                          <CardTitle className="font-bold text-2xl flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-primary" />
                            Shopify Listing Optimization
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {isShopifyLoading ? (
                            <div className="space-y-4">
                                <Skeleton className="h-8 w-1/3 bg-muted" />
                                <Skeleton className="h-6 w-full bg-muted" />
                                <Skeleton className="h-8 w-1/3 mt-4 bg-muted" />
                                <Skeleton className="h-10 w-full bg-muted" />
                                <Skeleton className="h-8 w_3 mt-4 bg-muted" />
                                <div className="flex flex-wrap gap-2">
                                    <Skeleton className="h-6 w-20 bg-muted" />
                                    <Skeleton className="h-6 w-24 bg-muted" />
                                    <Skeleton className="h-6 w-16 bg-muted" />
                                </div>
                            </div>
                          ) : (
                            shopifyListing && (
                              <TooltipProvider>
                                <div className="space-y-6">
                                  <div>
                                    <Label className="text-base font-semibold flex items-center gap-2 mb-2 text-foreground/90">
                                      Shopify Title
                                    </Label>
                                    <div className="relative">
                                      <Input readOnly value={shopifyListing.shopifyTitle} className="pr-10 bg-background border-input" />
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
                                    <Label className="text-base font-semibold flex items-center gap-2 mb-2 text-foreground/90">
                                      Shopify Meta Description
                                    </Label>
                                    <div className="relative">
                                      <Textarea readOnly value={shopifyListing.shopifyMetaDescription} className="pr-10 bg-background border-input" rows={3} />
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
                                    <h3 className="text-base font-semibold flex items-center gap-2 mb-2 text-foreground/90">
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
                      <Card className="bg-card border-border">
                        <CardHeader>
                          <CardTitle className="font-bold text-2xl flex items-center gap-2">
                            <Bot className="w-6 h-6 text-primary" />
                            AI-Generated Social Media Captions
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {isCaptionsLoading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                              <div key={i} className="flex items-start gap-4">
                                <Skeleton className="h-8 w-8 rounded-full bg-muted" />
                                <div className="flex-1 space-y-2">
                                  <Skeleton className="h-4 w-full bg-muted" />
                                  <Skeleton className="h-4 w-4/5 bg-muted" />
                                </div>
                              </div>
                            ))
                          ) : (
                            captions?.map((caption, index) => (
                              <div key={index} className="flex items-start gap-4 p-4 border border-border rounded-lg bg-background">
                                <div className="p-2 bg-primary rounded-full">
                                   <Bot className="w-5 h-5 text-primary-foreground" />
                                </div>
                                <p className="flex-1 text-foreground/80">{caption}</p>
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
      <footer ref={footerRef} className="border-t border-border/40">
        <div className="container mx-auto px-4 py-12 text-center">
            <h3 className="text-xl font-bold text-foreground/90 mb-4">About ChaitanyaAI</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                ChaitanyaAI is dedicated to helping artisans and small businesses grow their digital presence with the power of AI. We provide easy-to-use tools to generate beautiful product descriptions, engaging social media content, and effective SEO keywords.
            </p>
            <Separator className="my-8 bg-border/40" />
            <p className="text-sm text-muted-foreground mb-6">Powered by Google Cloud's cutting-edge AI technology</p>
            <div className="flex justify-center items-center gap-8 flex-wrap">
                <a href="https://cloud.google.com/" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
                    <Image src="https://res.cloudinary.com/dnhx7xyz2/image/upload/v1758454710/Google_Cloud_logo.svg_sfwwbj.png" alt="Google Cloud Logo" width={128} height={20} className="dark:invert"/>
                </a>
                <a href="https://deepmind.google/technologies/gemini/" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
                   <Image src="https://res.cloudinary.com/dnhx7xyz2/image/upload/v1758509825/gemini-logo_wbmj4m.png" alt="Gemini Logo" width={96} height={32}/>
                </a>
                <a href="https://firebase.google.com/" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
                   <Image src="https://res.cloudinary.com/dnhx7xyz2/image/upload/v1758454709/firebase_logo_daipos.svg" alt="Firebase Logo" width={112} height={40} className="dark:invert" />
                </a>
                <a href="https://cloud.google.com/vertex-ai" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
                    <Image src="https://res.cloudinary.com/dnhx7xyz2/image/upload/v1758454709/VertexAI_Logo_ewd9oo.png" alt="Vertex AI Logo" width={112} height={40} className="dark:invert"/>
                </a>
            </div>
        </div>
      </footer>
    </div>
  );
}

    