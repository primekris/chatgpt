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
    id: "gpt-4-turbo",
    name: "GPT-4 Turbo",
    description: "Advanced reasoning model",
    provider: "OpenAI",
    enabled: false,
    comingSoon: true,
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
