export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  icon: string;
  prompt: string;
}

export const promptTemplates: PromptTemplate[] = [
  {
    id: "email-writer",
    title: "Email Writer",
    description: "Compose professional emails",
    icon: "Mail",
    prompt: "Write a professional email about: ",
  },
  {
    id: "code-explainer",
    title: "Code Explainer",
    description: "Explain code in simple terms",
    icon: "Code",
    prompt: "Explain the following code in detail:\n\n",
  },
  {
    id: "summarizer",
    title: "Text Summarizer",
    description: "Create concise summaries",
    icon: "FileText",
    prompt: "Summarize the following text:\n\n",
  },
  {
    id: "seo-content",
    title: "SEO Content",
    description: "Generate SEO-optimized content",
    icon: "TrendingUp",
    prompt: "Create SEO-optimized content for: ",
  },
  {
    id: "real-estate",
    title: "Real Estate Listing",
    description: "Create property descriptions",
    icon: "Home",
    prompt: "Write an engaging real estate listing for: ",
  },
  {
    id: "translator",
    title: "Language Translator",
    description: "Translate between languages",
    icon: "Languages",
    prompt: "Translate the following text to ",
  },
];
