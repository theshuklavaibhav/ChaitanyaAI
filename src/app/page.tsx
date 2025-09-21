'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Sparkles, Bot, ImageIcon, Pencil, BookUser, Lightbulb, Tag, Palette, TrendingUp, Languages, Copy, Check, Sun, Moon, Github, Menu } from 'lucide-react';
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
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import type { SVGProps } from 'react';
import { cn } from '@/lib/utils';

const tones = ['Persuasive', 'Creative', 'Professional'] as const;
type Tone = (typeof tones)[number];
const languages = ['Hindi', 'Spanish', 'French'];

function GoogleCloudLogo(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 108 20"
            role="img"
            aria-label="Google Cloud"
            className={cn("fill-foreground", props.className)}
            {...props}
        >
            <path d="M100.3 4.2v11.6h-2.1V4.2h2.1zm-8.2 11.4c-1.8 0-3.3-1.5-3.3-3.4s1.5-3.4 3.3-3.4c1.8 0 3.3 1.5 3.3 3.4s-1.4 3.4-3.3 3.4zm0-1.4c1 0 1.6-.8 1.6-2s-.6-2-1.6-2c-1 0-1.6.8-1.6 2s.6 2 1.6 2zM83.4 15.6c-1.8 0-3.3-1.5-3.3-3.4s1.5-3.4 3.3-3.4c1.8 0 3.3 1.5 3.3 3.4s-1.5 3.4-3.3 3.4zm0-1.4c1 0 1.6-.8 1.6-2s-.6-2-1.6-2c-1 0-1.6.8-1.6 2s.6 2 1.6 2zM74.8 15.6c-1.8 0-3.3-1.5-3.3-3.4s1.5-3.4 3.3-3.4c1.8 0 3.3 1.5 3.3 3.4s-1.5 3.4-3.3 3.4zm0-1.4c1 0 1.6-.8 1.6-2s-.6-2-1.6-2c-1 0-1.6.8-1.6 2s.6 2 1.6 2zM67.3 12.3c0-1.2.8-2 1.8-2 .9 0 1.5.5 1.7.9l-1.3.8c-.1-.2-.4-.4-.6-.4s-.5.2-.5.5v2.8h-1.1v-3.6zM62.6 15.6c-.4 0-.8-.1-1.1-.3L62 13v-3h-1.9v3.4c0 1.6 1 2.6 2.5 2.6.4 0 .8-.1 1.1-.2l-.2-1.2c-.2.1-.5.2-.7.2z" />
            <path d="M46.6 12.1c0-1.5 1.1-2.4 2.5-2.4s2.5.9 2.5 2.4c0 1.5-1.1 2.4-2.5 2.4s-2.5-1-2.5-2.4zm4 .1c0-1-.6-1.5-1.5-1.5s-1.5.5-1.5 1.5.6 1.5 1.5 1.5 1.5-.5 1.5-1.5zM53.3 10.8h1.8v1.3c.4-.9 1-1.5 1.9-1.5.2 0 .4 0 .6.1l-.3 1.8c-.1-.1-.3-.1-.5-.1-1 0-1.6.8-1.6 1.9v3.5h-1.9v-6z" />
            <path d="M37.8 12.1c0-1.5 1.1-2.4 2.5-2.4s2.5.9 2.5 2.4c0 1.5-1.1 2.4-2.5 2.4s-2.5-.9-2.5-2.4zm4 .1c0-1-.6-1.5-1.5-1.5s-1.5.5-1.5 1.5.6 1.5 1.5 1.5 1.5-.5 1.5-1.5zM29.5 12.1c0-1.5 1.1-2.4 2.5-2.4s2.5.9 2.5 2.4c0 1.5-1.1 2.4-2.5 2.4s-2.5-.9-2.5-2.4zm4 .1c0-1-.6-1.5-1.5-1.5s-1.5.5-1.5 1.5.6 1.5 1.5 1.5 1.5-.5 1.5-1.5zM24.7 15.6c-.9 0-1.6-.3-2-1l1.5-1c.2.4.6.6 1 .6.5 0 .9-.2.9-.6V0h1.9v14c0 1.7-1.1 2.6-2.9 2.6-.6 0-1.2-.1-1.7-.4l.3-1.6zM18.8 15.4h-6v-1.4h6v1.4zm-.2-2.7h-5.6v-1.4h5.6v1.4zm-.2-2.7h-5.6V8.6h5.6v1.4z" />
            <path d="M10.1 4.2h1.9v11.6h-1.9V4.2zM0 15.8h1.9v-1c.4.6 1.2 1.2 2.2 1.2 1.8 0 3.3-1.5 3.3-3.4s-1.5-3.4-3.3-3.4c-1.1 0-1.8.5-2.2 1.1V4.2H0v11.6zm4.1-3.6c1 0 1.6.8 1.6 2s-.6 2-1.6 2c-1 0-1.6-.8-1.6-2s.6-2 1.6-2z" />
        </svg>
    )
}

function GeminiLogo(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            role="img"
            aria-label="Gemini"
            className={cn("fill-foreground", props.className)}
            {...props}
        >
            <path d="M12,2.6L9.4,7.4H4.2l4.2,3-1.6,4.8L11,12.2V21.4h2V12.2l4.2,3-1.6-4.8L20,7.4H14.6Z"/>
        </svg>
    )
}

function FirebaseLogo(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 145 40"
            role="img"
            aria-label="Firebase"
            className={cn("fill-foreground", props.className)}
            {...props}
        >
            <path d="M3.57908 39.8801L0 35.084V0.598633H31.968V5.09383H5.43708V16.8328H28.3891V21.328H5.43708V35.3849H32.0911V39.8801H3.57908Z" />
            <path d="M42.2358 39.8801V0.598633H47.6729V39.8801H42.2358Z" />
            <path d="M51.849 39.8801V0.598633H74.5776C79.8837 0.598633 83.1558 2.62706 83.1558 7.3703C83.1558 10.893 81.3997 13.111 78.4476 14.1593L84.8199 22.062V22.4566L78.2046 39.8801H72.3729L77.411 22.8512H57.2861V39.8801H51.849ZM57.2861 18.3558H72.4959C76.2239 18.3558 77.8999 16.7192 77.8999 13.0319C77.8999 9.30513 76.1439 7.78034 72.4959 7.78034H57.2861V18.3558Z" />
            <path d="M91.9059 39.8801V5.09383H86.4689V0.598633H108.972V5.09383H103.535V39.8801H98.0979V5.09383H97.3429V39.8801H91.9059Z" />
            <path d="M117.844 32.5539C116.512 33.728 114.656 34.4069 112.557 34.4069C108.23 34.4069 105.511 31.7275 105.511 27.5121C105.511 23.4085 108.067 20.6173 112.605 20.6173C114.499 20.6173 116.294 21.2568 117.489 22.4308L120.972 19.0205C118.625 16.7225 115.834 15.6348 112.362 15.6348C105.268 15.6348 100.076 20.4705 100.076 27.5516C100.076 34.5208 105.229 39.4683 112.485 39.4683C115.834 39.4683 118.664 38.3043 121.087 35.8937L117.844 32.5539Z" />
            <path d="M129.569 39.8801C135.237 39.8801 139.736 36.3179 139.736 30.5786V30.224C139.573 35.163 135.523 37.9937 130.65 37.9937C127.354 37.9937 124.634 36.6322 122.958 34.1593L122.564 34.7183V39.8801H117.281V16.1481H122.718V26.2483C122.718 28.5857 124.24 29.9867 126.231 29.9867C127.868 29.9867 129.122 29.1136 129.988 27.8273V16.1481H135.425V26.6029C135.425 28.1772 135.984 30.154 137.98 30.9271L137.94 30.8876C138.806 28.9502 139.05 27.2934 139.05 25.5606C139.05 20.9715 135.912 17.636 130.364 17.636C124.24 17.636 119.534 22.319 119.534 28.5463C119.534 35.0112 123.822 39.8801 129.569 39.8801Z" />
            <path d="M144.331 0.598633V39.8801H138.894V0.598633H144.331Z" />
        </svg>
    )
}

function VertexAiLogo(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            role="img"
            aria-label="Vertex AI"
            className={cn("fill-foreground", props.className)}
            {...props}
        >
            <path d="M16.94 6.33a.8.8 0 0 0-.8-.8h-1.6a.8.8 0 0 0-.8.8v3.12a.8.8 0 0 0 .8.8h1.6a.8.8 0 0 0 .8-.8zM12.8 3.93a.8.8 0 0 0-.8-.8h-1.6a.8.8 0 0 0-.8.8v7.92a.8.8 0 0 0 .8.8h1.6a.8.8 0 0 0 .8-.8zM8.66 8.73a.8.8 0 0 0-.8-.8H6.26a.8.8 0 0 0-.8.8v5.32a.8.8 0 0 0 .8.8h1.6a.8.8 0 0 0 .8-.8z" opacity=".6"></path><path d="M12.8 14.85a.8.8 0 0 0-.8-.8h-1.6a.8.8 0 0 0-.8.8v1.52a.8.8 0 0 0 .8.8h1.6a.8.8 0 0 0 .8-.8zM8.66 14.85a.8.8 0 0 0-.8-.8H6.26a.8.8 0 0 0-.8.8v1.52a.8.8 0 0 0 .8.8h1.6a.8.8 0 0 0 .8-.8zM16.94 10.25a.8.8 0 0 0-.8-.8h-1.6a.8.8 0 0 0-.8.8v6.12a.8.8 0 0 0 .8.8h1.6a.8.8 0 0 0 .8-.8z" opacity=".8"></path><path d="m11.5 21.5-5-5a.47.47 0 0 1 0-.7l.9-.9a.47.447 0 0 1 .7 0L12 18.8l3.9-3.9a.47.47 0 0 1 .7 0l.9.9a.47.47 0 0 1 0 .7l-5 5a.47.47 0 0 1-.7 0Z"></path>
        </svg>
    )
}

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
  const footerRef = useRef<HTMLElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="font-bold text-2xl">Generate Your Content</CardTitle>
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

                 <Card className="overflow-hidden bg-card border-border">
                    <CardHeader className="flex flex-row items-start justify-between">
                      <div className="flex items-center gap-3">
                          <ImageIcon className="w-6 h-6 text-muted-foreground" />
                          <CardTitle className="font-bold text-2xl">Product Preview</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                        <div className="aspect-video w-full relative rounded-lg overflow-hidden border border-border">
                          {isImageLoading ? (
                            <div className="h-full w-full flex flex-col items-center justify-center bg-muted/50">
                               <Sparkles className="w-8 h-8 text-primary animate-spin" />
                               <div className="text-center text-primary/80 mt-4">
                                 <p className="font-semibold">Generating your image...</p>
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
                      <Button onClick={onGenerateImage} disabled={isImageLoading || !productName} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate Image
                      </Button>
                    </CardFooter>
                </Card>
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
                    <GoogleCloudLogo className="w-32" />
                </a>
                <a href="https://deepmind.google/technologies/gemini/" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
                   <GeminiLogo className="w-24" />
                </a>
                <a href="https://firebase.google.com/" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
                   <FirebaseLogo className="w-28" />
                </a>
                <a href="https://cloud.google.com/vertex-ai" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
                    <VertexAiLogo className="w-28" />
                </a>
            </div>
        </div>
      </footer>
    </div>
  );
}
