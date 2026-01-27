# AI Live Talk - HSK Chinese Speaking Practice

A real-time AI-powered Chinese speaking practice web application for HSK levels 1-6. Built with Next.js 14, TypeScript, and Google Gemini AI.

![AI Live Talk](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-cyan)
![Gemini AI](https://img.shields.io/badge/Gemini-2.0-purple)

## Features

- 🎤 **Real-time Speech Recognition** - Speak and see your words transcribed live
- 🤖 **AI Tutor** - Practice conversations with an intelligent AI tutor
- 📊 **HSK Levels 1-6** - Content adapted to your proficiency level
- 🎯 **10+ Topics** - Daily life, ordering food, travel, work, and more
- 🔊 **Text-to-Speech** - Hear the AI responses in Chinese
- 💬 **Streaming Responses** - See AI responses appear word by word
- 🎨 **Modern UI** - Beautiful, responsive design inspired by language learning apps

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS
- **AI**: Google Gemini 2.0 Flash
- **Speech**: Web Speech API (Recognition & Synthesis)
- **Icons**: Lucide React
- **Styling**: TailwindCSS with custom animations

## Quick Start

### Prerequisites

- Node.js 18+ 
- A Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

### Installation

1. **Clone and install dependencies:**

```bash
cd hsk-ai
npm install
```

2. **Set up environment variables:**

```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

3. **Run the development server:**

```bash
npm run dev
```

4. **Open your browser:**

Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
hsk-ai/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/                # API routes
│   │   │   ├── gemini/         # Gemini chat streaming
│   │   │   ├── speech-to-text/ # Audio transcription
│   │   │   └── text-to-speech/ # TTS endpoint
│   │   ├── hsk/                # HSK level selection
│   │   │   └── [level]/        # Topic selection
│   │   ├── talk/               # Live speaking page
│   │   │   └── [level]/[topic]/
│   │   ├── flashcard/          # Flashcard (placeholder)
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Global styles
│   ├── components/             # React components
│   │   ├── Header.tsx          # Navigation header
│   │   ├── MicButton.tsx       # Microphone button
│   │   ├── Waveform.tsx        # Audio waveform
│   │   ├── ChatBox.tsx         # Message container
│   │   ├── MessageBubble.tsx   # Individual message
│   │   └── AIAvatar.tsx        # AI character avatar
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAudioRecorder.ts # Audio recording
│   │   ├── useAudioPlayer.ts   # Audio playback
│   │   ├── useSpeechRecognition.ts # Speech-to-text
│   │   └── useSpeechSynthesis.ts   # Text-to-speech
│   ├── data/                   # Static data
│   │   ├── hsk-levels.ts       # HSK level definitions
│   │   └── hsk-topics.ts       # Topic definitions
│   └── lib/                    # Utilities
│       ├── utils.ts            # Helper functions
│       └── gemini-prompts.ts   # AI prompts
├── public/                     # Static assets
├── .env.example                # Environment template
├── package.json                # Dependencies
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── next.config.js              # Next.js configuration
```

## HSK Levels & Topics

### HSK Levels

| Level | Name | Vocabulary | Description |
|-------|------|------------|-------------|
| HSK 1 | 入门 | 150+ words | Basic greetings, introductions |
| HSK 2 | 初级 | 300+ words | Simple daily conversations |
| HSK 3 | 中级 | 600+ words | Daily life topics |
| HSK 4 | 中高级 | 1200+ words | Diverse topics with natives |
| HSK 5 | 高级 | 2500+ words | Complex discussions |
| HSK 6 | 精通 | 5000+ words | Near-native fluency |

### Available Topics

- 🏠 Daily Life (日常生活)
- 🍜 Ordering Food (点餐)
- ✈️ Travel (旅游)
- 💼 Work (工作) - HSK 2+
- 👥 Social Conversation (社交) - HSK 2+
- 🎓 Education (教育) - HSK 2+
- 🛍️ Shopping (购物)
- 🏥 Health (健康) - HSK 2+
- 📈 Business (商务) - HSK 5-6
- 🏮 Culture (文化) - HSK 3+

## How It Works

1. **Select HSK Level** - Choose your current proficiency level
2. **Pick a Topic** - Select a conversation topic to practice
3. **Start Talking** - Click the microphone button and speak in Chinese
4. **Get Feedback** - AI responds with corrections, translations, and follow-up questions
5. **Continue Learning** - Practice as long as you want!

## Browser Support

For the best experience, use:
- **Google Chrome** (recommended)
- **Microsoft Edge**
- **Safari** (limited speech recognition support)

> Note: Speech recognition requires browser support for the Web Speech API.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add the `GEMINI_API_KEY` environment variable
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes |

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## AI Teaching Features

The AI tutor is programmed to:

- ✅ Respond in Chinese appropriate for your HSK level
- ✅ Keep responses short (under 10 seconds when spoken)
- ✅ Gently correct pronunciation and grammar mistakes
- ✅ Provide pinyin for new vocabulary
- ✅ Ask follow-up questions to keep the conversation going
- ✅ Be encouraging and supportive

## License

MIT License - feel free to use this project for learning and personal use.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ for Chinese language learners
