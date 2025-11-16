import { ChatRequest } from "@shared/schema";

export interface AIProvider {
  name: string;
  streamChat(request: ChatRequest): AsyncGenerator<string, void, unknown>;
}

class TogetherAIProvider implements AIProvider {
  name = "Together AI";
  private apiKey: string;
  private baseUrl = "https://api.together.xyz/v1";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async *streamChat(request: ChatRequest): AsyncGenerator<string, void, unknown> {
    const messages = [
      ...(request.systemPrompt ? [{ role: "system", content: request.systemPrompt }] : []),
      ...request.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: request.model,
        messages,
        temperature: request.temperature,
        stream: true,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Together AI API error: ${response.status} - ${error}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error("No response body");
    }

    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              yield content;
            }
          } catch (e) {
            console.error("Failed to parse SSE data:", e);
          }
        }
      }
    }
  }
}

// Extensible pattern for adding new AI providers
// To add a new model provider:
// 1. Create a new class implementing AIProvider interface
// 2. Add it to the providers map with a unique key
// 3. Update the frontend models.ts to include the new model
// 4. Set the appropriate API key in environment variables

export class AIService {
  private providers: Map<string, AIProvider> = new Map();

  constructor() {
    // Initialize Together AI provider
    const togetherApiKey = process.env.TOGETHER_API_KEY;
    if (togetherApiKey) {
      this.providers.set("together", new TogetherAIProvider(togetherApiKey));
    }

    // Add more providers here following the same pattern:
    // const openaiApiKey = process.env.OPENAI_API_KEY;
    // if (openaiApiKey) {
    //   this.providers.set("openai", new OpenAIProvider(openaiApiKey));
    // }
  }

  getProvider(modelId: string): AIProvider {
    // Route to appropriate provider based on model ID
    if (modelId.startsWith("meta-llama") || modelId.startsWith("mistralai")) {
      const provider = this.providers.get("together");
      if (!provider) {
        throw new Error("Together AI provider not initialized. Check TOGETHER_API_KEY environment variable.");
      }
      return provider;
    }

    // Add routing for other providers:
    // if (modelId.startsWith("gpt-")) {
    //   const provider = this.providers.get("openai");
    //   if (!provider) throw new Error("OpenAI provider not initialized");
    //   return provider;
    // }

    throw new Error(`No provider found for model: ${modelId}`);
  }

  async *streamChat(request: ChatRequest): AsyncGenerator<string, void, unknown> {
    const provider = this.getProvider(request.model);
    yield* provider.streamChat(request);
  }
}

export const aiService = new AIService();
