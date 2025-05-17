
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import InputForm from "@/components/InputForm";
import ResultCard from "@/components/ResultCard";
import Footer from "@/components/Footer";
import { generateContent, downloadContent, ContentResult } from "@/services/geminiService";
import { toast } from "sonner";
import { Download } from "lucide-react";

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

      <main className="flex-1">
        <section className="container max-w-5xl py-10 space-y-8">
          <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
          
          {isLoading && (
            <div className="flex justify-center items-center py-12">
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
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <ResultCard 
                  title="YouTube Title" 
                  content={result.title} 
                  className="lg:col-span-4"
                />
                <ResultCard 
                  title="Description" 
                  content={result.description} 
                  className="lg:col-span-3"
                />
                <ResultCard 
                  title="Tags" 
                  content={result.tags} 
                  className="lg:col-span-1"
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
