
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-6 md:py-0 md:px-8 w-full">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built with{" "}
          <Heart className="inline-block h-4 w-4 text-red-500" />{" "}
          using{" "}
          <a 
            href="https://generativeai.google/products/gemini/"
            target="_blank" 
            rel="noreferrer" 
            className="font-medium underline underline-offset-4 hover:text-primary transition-colors"
          >
            Gemini API
          </a>
        </p>
        <p className="text-center text-sm text-muted-foreground md:text-left">
          {new Date().getFullYear()} &copy; YouTube Content Generator
        </p>
      </div>
    </footer>
  );
}
