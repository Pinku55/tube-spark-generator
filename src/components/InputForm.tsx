
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type FormData = {
  topic: string;
  videoLength: string;
  description: string;
};

type InputFormProps = {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
};

export default function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const [formData, setFormData] = useState<FormData>({
    topic: "",
    videoLength: "10",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, videoLength: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const videoLengthOptions = [
    "3", "5", "7", "10", "15", "20", "30", "45", "60"
  ];

  return (
    <Card className="w-full enhanced-card">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl">Generate YouTube Content</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic">Video Topic / Title Idea</Label>
            <Input
              id="topic"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              placeholder="Enter your video topic or title idea"
              required
              className="text-base"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="videoLength">Video Length (minutes)</Label>
            <Select 
              value={formData.videoLength} 
              onValueChange={handleSelectChange}
            >
              <SelectTrigger id="videoLength" className="text-base">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {videoLengthOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option} minutes
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Brief Description of Content</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what your video will be about..."
              className="min-h-[100px] text-base resize-y"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full scale-in" 
            disabled={isLoading}
            size="lg"
          >
            {isLoading ? (
              <>
                <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              "Generate Content"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
