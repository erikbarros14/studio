'use client';

import * as React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { Upload, Copy, Loader2, Image as ImageIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { extractText } from '@/ai/flows/extract-text-from-image'; // Import the AI flow

export default function ImageScribe() {
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if file type is an image
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file (e.g., PNG, JPG, GIF).');
        setImageDataUri(null); // Clear any previous image preview
        setExtractedText(''); // Clear extracted text
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // Reset file input
        }
        return;
      }

      setError(null); // Clear previous errors
      setExtractedText(''); // Clear previous text on new image upload
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageDataUri(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExtractText = async () => {
    if (!imageDataUri) {
      setError('Please upload an image first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setExtractedText('');

    try {
      const result = await extractText({ photoDataUri: imageDataUri });
      setExtractedText(result.extractedText);
    } catch (err) {
      console.error('Error extracting text:', err);
      setError('Failed to extract text. Please try again.');
      setExtractedText(''); // Clear any partial results on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = () => {
    if (!extractedText) return;
    navigator.clipboard.writeText(extractedText)
      .then(() => {
        toast({
          title: "Copied!",
          description: "Extracted text copied to clipboard.",
        });
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        toast({
          variant: "destructive",
          title: "Copy Failed",
          description: "Could not copy text to clipboard.",
        });
      });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-background">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-scan-text"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12h10"/><path d="M7 17h6"/><path d="M7 7h6"/></svg>
            ImageScribe
          </CardTitle>
          <CardDescription>Upload an image and extract the text within it.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="image-upload" className="text-lg font-medium">Upload Image</Label>
            <div className="flex flex-col items-center space-y-4 rounded-lg border border-dashed border-border p-6">
              {imageDataUri ? (
                <div className="relative w-full max-w-xs aspect-video">
                  <Image
                    src={imageDataUri}
                    alt="Uploaded preview"
                    layout="fill"
                    objectFit="contain"
                    className="rounded-md"
                    data-ai-hint="uploaded image preview"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center text-center text-muted-foreground">
                   <ImageIcon size={48} className="mb-2"/>
                   <p>Drag & drop an image here, or click to select</p>
                </div>
              )}
               <Input
                  id="image-upload"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden" // Hide default input, use label as trigger
                />
               <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="mr-2 h-4 w-4" /> Select Image
               </Button>

            </div>
             {error && <p className="text-sm text-destructive text-center mt-2">{error}</p>}
          </div>

          <div className="flex justify-center">
            <Button
              onClick={handleExtractText}
              disabled={!imageDataUri || isLoading}
              size="lg"
              className="w-full max-w-xs"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7Z"/><path d="M14 3v4h4"/><path d="M10 13-1 13"/><path d="M10 17H5"/></svg>
              )}
              {isLoading ? 'Extracting...' : 'Extract Text'}
            </Button>
          </div>

          {extractedText && (
            <div className="space-y-2">
              <Label htmlFor="extracted-text" className="text-lg font-medium">Extracted Text</Label>
              <div className="relative">
                <Textarea
                  id="extracted-text"
                  value={extractedText}
                  readOnly
                  rows={8}
                  className="bg-muted/30"
                  placeholder="Extracted text will appear here..."
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopyText}
                  className="absolute top-2 right-2 h-7 w-7"
                  aria-label="Copy text"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
         <CardFooter className="justify-center text-xs text-muted-foreground">
           Powered by AI
        </CardFooter>
      </Card>
    </main>
  );
}
