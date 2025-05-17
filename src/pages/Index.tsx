
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import InputForm from "@/components/InputForm";
import ResultCard from "@/components/ResultCard";
import Footer from "@/components/Footer";
import { generateContent, downloadContent, ContentResult } from "@/services/geminiService";
import { toast } from "sonner";
import { Download, Sparkles } from "lucide-react";

const Index = () => {
  const [result, setResult] = useState<ContentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: { topic: string; videoLength: string; description: string }) => {
    try {
      setIsLoading(true);
      const contentResult = await generateContent(
        data.topic,
        data.videoLength,
        data.description
      );
      setResult(contentResult);
      toast.success("Content generated successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to generate content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (result) {
      downloadContent(result);
      toast.success("Content downloaded successfully!");
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-xl font-bold sm:text-2xl">YouTube Content Generator</h1>
          <ThemeToggle />
        </div>
      </header>

      <div className="hero-section w-full py-12 px-4 hero-gradient subtle-pattern">
        <div className="container max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-block p-2 bg-primary/10 rounded-full mb-2">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Generate AI-Powered YouTube Content</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create SEO-optimized titles, descriptions, and tags for your videos in seconds using advanced AI.
          </p>
        </div>
      </div>

      <main className="flex-1 py-8">
        <section className="container max-w-5xl space-y-10">
          <div className="fade-in">
            <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
          
          {isLoading && (
            <div className="flex justify-center items-center py-12 fade-in">
              <div className="loading-spinner">
                <svg className="animate-spin h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </div>
          )}

          {result && !isLoading && (
            <div className="space-y-6 fade-in">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Generated Content</h2>
                <Button 
                  onClick={handleDownload} 
                  variant="outline"
                  className="gap-2 scale-in"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <ResultCard 
                  title="YouTube Title" 
                  content={result.title} 
                  className="lg:col-span-4 staggered-item slide-in"
                />
                <ResultCard 
                  title="Description" 
                  content={result.description} 
                  className="lg:col-span-3 staggered-item slide-in"
                />
                <ResultCard 
                  title="Tags" 
                  content={result.tags} 
                  className="lg:col-span-1 staggered-item slide-in"
                />
              </div>
            </div>
          )}
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
