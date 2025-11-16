# ChatGPT Clone - AI Chat Application

A production-ready ChatGPT-style web application powered by Together AI with streaming responses, session management, voice input, text-to-speech, and beautiful UI.

![ChatGPT Clone](https://img.shields.io/badge/Status-Production%20Ready-success)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

### Core Features
- ✅ **Real-time Streaming Responses** - Word-by-word AI responses with typing animation
- ✅ **Session Management** - Create, rename, delete, and manage multiple chat sessions
- ✅ **Message Actions** - Copy, download, edit, regenerate, and delete messages
- ✅ **Code Syntax Highlighting** - Beautiful code blocks with copy and download
- ✅ **Light/Dark Theme** - Smooth theme switching with persistent preferences
- ✅ **Voice Input** - Speak to type using Web Speech API
- ✅ **Text-to-Speech** - Listen to AI responses with read-aloud feature
- ✅ **File Upload** - Upload and process text files (.txt, .md, .json)
- ✅ **Export Conversations** - Download entire chats as formatted text files
- ✅ **Responsive Design** - Perfect on mobile, tablet, and desktop
- ✅ **System Prompt Editor** - Customize AI behavior and personality
- ✅ **Temperature Control** - Adjust response creativity (0.0 - 1.2)
- ✅ **Prompt Templates** - Quick-start templates for common tasks
- ✅ **Extensible Model Support** - Easy pattern to add new AI models

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Together AI API key ([Get one here](https://api.together.xyz/))

### Local Development

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd chatgpt-clone
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
TOGETHER_API_KEY=your_together_api_key_here
```

4. **Start the development server**
```bash
npm run dev
```

The app will be available at `http://localhost:5000`

## 📦 Deployment Guide

### Deploying to Render (Recommended for Free Tier)

#### Step 1: Push to GitHub

1. **Initialize Git repository** (if not already done)
```bash
git init
git add .
git commit -m "Initial commit"
```

2. **Create a new repository on GitHub**
   - Go to [GitHub](https://github.com/new)
   - Create a new repository (public or private)
   - Don't initialize with README

3. **Push your code to GitHub**
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

#### Step 2: Deploy to Render

1. **Sign up for Render**
   - Go to [Render.com](https://render.com)
   - Sign up using your GitHub account (recommended)

2. **Create a new Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository you just pushed

3. **Configure the Web Service**
   - **Name**: `chatgpt-clone` (or any name you prefer)
   - **Region**: Choose the closest to your users
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Runtime**: `Node`
   - **Build Command**: 
     ```bash
     npm install
     ```
   - **Start Command**: 
     ```bash
     npm run dev
     ```
   - **Instance Type**: `Free` (or choose paid for better performance)

4. **Add Environment Variables**
   - Click "Advanced" → "Add Environment Variable"
   - Add:
     - **Key**: `TOGETHER_API_KEY`
     - **Value**: Your Together AI API key

5. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your app
   - Wait 3-5 minutes for the first deployment

6. **Access Your App**
   - Your app will be available at: `https://your-app-name.onrender.com`
   - Render provides a free SSL certificate automatically

### Important Notes for Render Free Tier

⚠️ **Free Tier Limitations**:
- Apps sleep after 15 minutes of inactivity
- First request after sleep takes 30-50 seconds (cold start)
- 750 hours/month of runtime (enough for most personal use)
- Automatic HTTPS included

💡 **Tips**:
- Use a paid plan ($7/month) for production apps to avoid cold starts
- Consider using a service like [UptimeRobot](https://uptimerobot.com/) to ping your app every 14 minutes to keep it awake (free tier)

### Alternative Deployment Options

#### Option 2: Vercel (Frontend Only - Not Recommended for This App)
Not recommended because Vercel has limitations with Server-Sent Events (SSE) required for streaming.

#### Option 3: Railway
1. Go to [Railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add environment variable: `TOGETHER_API_KEY`
5. Railway will auto-detect and deploy

#### Option 4: Fly.io
1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Login: `fly auth login`
3. Create app: `fly launch`
4. Set secret: `fly secrets set TOGETHER_API_KEY=your_key`
5. Deploy: `fly deploy`

## 🔧 Adding New AI Models

The application is designed with an extensible pattern to easily add new AI providers. Here's how:

### Step 1: Add Model Configuration

Edit `client/src/lib/models.ts`:

```typescript
export const availableModels: ModelConfig[] = [
  // Existing Together AI model
  {
    id: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
    name: "Meta Llama 3.1 8B",
    description: "Flagship model - Fast and capable",
    provider: "Together AI",
    enabled: true,
    comingSoon: false,
  },
  // ADD YOUR NEW MODEL HERE
  {
    id: "gpt-4-turbo",
    name: "GPT-4 Turbo",
    description: "Advanced reasoning model",
    provider: "OpenAI",
    enabled: true,  // Set to true when ready
    comingSoon: false,  // Set to false when ready
  },
];
```

### Step 2: Create AI Provider Class

Edit `server/ai-service.ts` and add your provider:

```typescript
// Example: Adding OpenAI
class OpenAIProvider implements AIProvider {
  name = "OpenAI";
  private apiKey: string;
  private baseUrl = "https://api.openai.com/v1";

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
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) throw new Error("No response body");

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
            if (content) yield content;
          } catch (e) {
            console.error("Parse error:", e);
          }
        }
      }
    }
  }
}
```

### Step 3: Register Provider in AIService

In the same file (`server/ai-service.ts`), add to constructor:

```typescript
constructor() {
  // Existing Together AI
  const togetherApiKey = process.env.TOGETHER_API_KEY;
  if (togetherApiKey) {
    this.providers.set("together", new TogetherAIProvider(togetherApiKey));
  }

  // ADD YOUR NEW PROVIDER
  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (openaiApiKey) {
    this.providers.set("openai", new OpenAIProvider(openaiApiKey));
  }
}
```

### Step 4: Update Provider Routing

In `getProvider` method:

```typescript
getProvider(modelId: string): AIProvider {
  // Existing Together AI routing
  if (modelId.startsWith("meta-llama") || modelId.startsWith("mistralai")) {
    const provider = this.providers.get("together");
    if (!provider) throw new Error("Together AI not initialized");
    return provider;
  }

  // ADD YOUR MODEL ROUTING
  if (modelId.startsWith("gpt-")) {
    const provider = this.providers.get("openai");
    if (!provider) throw new Error("OpenAI not initialized");
    return provider;
  }

  throw new Error(`No provider for model: ${modelId}`);
}
```

### Step 5: Add Environment Variable

Add to your `.env` file:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

And update Render environment variables with the new API key.

That's it! Your new model will now appear in the model selector dropdown.

## 🏗️ Architecture

```
chatgpt-clone/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities and helpers
│   │   └── pages/         # Page components
│   └── public/            # Static assets
├── server/                # Backend Express server
│   ├── ai-service.ts     # AI provider abstraction layer
│   ├── routes.ts         # API endpoints
│   └── index.ts          # Server entry point
├── shared/                # Shared TypeScript types
│   └── schema.ts         # Zod schemas and types
└── package.json          # Dependencies and scripts
```

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **Shadcn/ui** - UI components
- **React Markdown** - Markdown rendering
- **Highlight.js** - Code syntax highlighting
- **Wouter** - Lightweight routing
- **TanStack Query** - Data fetching

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **Together AI** - AI model provider
- **Server-Sent Events (SSE)** - Real-time streaming
- **Zod** - Schema validation

### Storage
- **LocalStorage** - Client-side session persistence
- No database required for MVP

## 📝 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `TOGETHER_API_KEY` | Yes | Your Together AI API key |
| `OPENAI_API_KEY` | No | Optional: OpenAI API key for GPT models |
| `NODE_ENV` | No | Set to `production` for production builds |

## 🎨 Customization

### Changing Theme Colors

Edit `client/src/index.css` to customize colors:

```css
:root {
  --primary: 217 91% 60%;  /* Change primary color */
  --background: 0 0% 100%; /* Change background */
  /* ... other variables */
}
```

### Adding Custom Prompt Templates

Edit `client/src/lib/prompt-templates.ts`:

```typescript
export const promptTemplates: PromptTemplate[] = [
  {
    id: "my-template",
    title: "My Custom Template",
    description: "Description here",
    icon: "Mail", // Lucide icon name
    prompt: "Your custom prompt: ",
  },
  // ... other templates
];
```

## 🐛 Troubleshooting

### Issue: AI responses not streaming

**Solution**: 
- Check that `TOGETHER_API_KEY` is set correctly
- Verify your Together AI account has credits
- Check browser console for errors

### Issue: Voice input not working

**Solution**:
- Voice input only works in Chrome/Edge (uses Web Speech API)
- Must be served over HTTPS (works on Render automatically)
- Browser will request microphone permission

### Issue: App sleeps on Render Free Tier

**Solution**:
- Use [UptimeRobot](https://uptimerobot.com/) to ping your app every 14 minutes
- Or upgrade to Render's paid plan ($7/month) for always-on service

### Issue: Build fails on Render

**Solution**:
- Ensure `package.json` has all dependencies
- Check build logs for specific errors
- Verify Node.js version compatibility

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📧 Support

For issues or questions:
- Open a GitHub issue
- Check the troubleshooting section above
- Review Together AI documentation

---

**Built with ❤️ using Together AI and React**

Enjoy your ChatGPT-style application! 🚀
