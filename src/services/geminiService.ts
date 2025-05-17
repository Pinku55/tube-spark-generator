
export type ContentResult = {
  title: string;
  description: string;
  tags: string;
};

export const generateContent = async (
  topic: string,
  videoLength: string,
  description: string
): Promise<ContentResult> => {
  try {
    const apiKey = "AIzaSyDbbQE4VBmCO06V5RJ9YPk9vQOBcc26G1s";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    
    const prompt = `
      I need you to generate complete YouTube content details based on the following input. 
      Structure your response exactly as shown below with these sections:
      
      VIDEO TITLE: Create a compelling, SEO-optimized YouTube title under 70 characters
      
      DESCRIPTION:
      (Write an engaging introduction paragraph of 100-150 words)
      
      TIMESTAMPS:
      (Create timestamps based on a ${videoLength}-minute video. Include 5-10 sections with timecodes like "00:00 - Introduction")
      
      SEARCH TERMS:
      (List 5-10 relevant search queries people might use to find this content)
      
      HASHTAGS:
      (Provide 15-20 relevant hashtags including the # symbol)
      
      CALL TO ACTION:
      (Write a short paragraph with subscribe/like/comment CTAs)
      
      TAGS:
      (Provide a comma-separated list of 15-20 SEO-friendly tags WITHOUT hashtags, just the words/phrases)
      
      Here are the details about my video:
      Topic/Title Idea: ${topic}
      Video Length: ${videoLength} minutes
      Content Description: ${description}
      
      Only respond with the formatted content as specified above. Do not include any explanations or notes.
    `;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "API request failed");
    }

    const data = await response.json();
    const generatedText = data.candidates[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error("No content was generated");
    }

    // Parse the response into sections
    const sections = parseGeminiResponse(generatedText);

    return {
      title: sections.title || "No title generated",
      description: formatDescription(sections),
      tags: sections.tags || "No tags generated",
    };
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
};

const parseGeminiResponse = (text: string) => {
  const sections: Record<string, string> = {};
  
  // Extract title
  const titleMatch = text.match(/VIDEO TITLE:\s*([^\n]+)/);
  if (titleMatch) sections.title = titleMatch[1].trim();
  
  // Extract description intro
  const descMatch = text.match(/DESCRIPTION:\s*([^]*?)(?=TIMESTAMPS:|$)/);
  if (descMatch) sections.description = descMatch[1].trim();
  
  // Extract timestamps
  const timestampsMatch = text.match(/TIMESTAMPS:\s*([^]*?)(?=SEARCH TERMS:|$)/);
  if (timestampsMatch) sections.timestamps = timestampsMatch[1].trim();
  
  // Extract search terms
  const searchTermsMatch = text.match(/SEARCH TERMS:\s*([^]*?)(?=HASHTAGS:|$)/);
  if (searchTermsMatch) sections.searchTerms = searchTermsMatch[1].trim();
  
  // Extract hashtags
  const hashtagsMatch = text.match(/HASHTAGS:\s*([^]*?)(?=CALL TO ACTION:|$)/);
  if (hashtagsMatch) sections.hashtags = hashtagsMatch[1].trim();
  
  // Extract call to action
  const ctaMatch = text.match(/CALL TO ACTION:\s*([^]*?)(?=TAGS:|$)/);
  if (ctaMatch) sections.cta = ctaMatch[1].trim();
  
  // Extract tags
  const tagsMatch = text.match(/TAGS:\s*([^]*?)(?=$)/);
  if (tagsMatch) sections.tags = tagsMatch[1].trim();
  
  return sections;
};

const formatDescription = (sections: Record<string, string>) => {
  // Combine all the sections for the description
  return `${sections.description || ""}

${sections.timestamps || ""}

${sections.searchTerms || ""}

${sections.hashtags || ""}

${sections.cta || ""}`;
};

export const downloadContent = (result: ContentResult) => {
  const content = `
TITLE:
${result.title}

DESCRIPTION:
${result.description}

TAGS:
${result.tags}
`.trim();

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "youtube_content.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
