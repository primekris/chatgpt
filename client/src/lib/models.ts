import { ModelConfig } from "@shared/schema";

export const availableModels: ModelConfig[] = [
  {
    id: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
    name: "Meta Llama 3.1 8B",
    description: "Flagship model - Fast and capable",
    provider: "Together AI",
    enabled: true,
    comingSoon: false,
  },
 {
  id: "gemini-2.0-flash",
  name: "Gemini 2.0 Flash",
  description: "Google Gemini • Fast and powerful",
  provider: "Google",
  enabled: true,
  comingSoon: false,
},

  {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    description: "Anthropic's most capable model",
    provider: "Anthropic",
    enabled: false,
    comingSoon: true,
  },
  {
    id: "mistral-large",
    name: "Mistral Large",
    description: "Powerful multilingual model",
    provider: "Mistral AI",
    enabled: false,
    comingSoon: true,
  },
];

export function getModelById(id: string): ModelConfig | undefined {
  return availableModels.find(m => m.id === id);
}
