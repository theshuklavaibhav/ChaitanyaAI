'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Sparkles, Bot, Image as ImageIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { handleGenerateDescription, handleGenerateCaptions, handleGenerateImage } from '@/app/actions';
import { Logo } from '@/components/icons';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const { toast } = useToast();
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState<string | null>(null);
  const [captions, setCaptions] = useState<string[] | null>(null);
  const [isDescriptionLoading, setIsDescriptionLoading] = useState(false);
  const [isCaptionsLoading, setIsCaptionsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  const defaultImage = PlaceHolderImages[0];
  const displayImageUrl = generatedImageUrl || defaultImage.imageUrl;

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
    const result = await handleGenerateCaptions(productName);
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
      // The toast is already shown in onGenerateAll
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

  const onGenerateAll = () => {
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
    onGenerateImage();
  };


  const isLoading = isDescriptionLoading || isCaptionsLoading || isImageLoading;

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
          <Card className="sticky top-8 shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Create Your Listing</CardTitle>
              <CardDescription>
                Enter your product details and let our AI do the writing and image creation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="product-name">Product Name</Label>
                <Input
                  id="product-name"
                  placeholder="e.g., Handwoven Pashmina Scarf"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4">
              <Button onClick={onGenerateAll} disabled={isLoading || !productName} className="w-full" variant="default">
                <Sparkles className="mr-2 h-4 w-4" />
                Generate All
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
                            <p className="text-xs">This may take a moment.</p>
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
            </Card>

            {(isDescriptionLoading || description) && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">AI-Generated Description</CardTitle>
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
