
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy, Check } from "lucide-react";

type Props = {
  title: string;
  content: string;
  className?: string;
};

export default function ResultCard({ title, content, className = "" }: Props) {
  const textRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Copied to clipboard!");
    
    // Reset copy icon after 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Card className={`relative h-full enhanced-card ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg sm:text-xl flex justify-between">
          {title}
          <Button
            size="icon"
            variant="ghost"
            onClick={handleCopy}
            className="copy-btn scale-in"
            title="Copy to clipboard"
          >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div 
          ref={textRef} 
          className="whitespace-pre-wrap text-base"
        >
          {content}
        </div>
      </CardContent>
    </Card>
  );
}
