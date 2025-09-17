# Pai - Your Personal AI Financial Assistant

Pai is a modern, AI-powered chatbot designed to provide accurate answers to questions about Indian personal finance. It combines a conversational interface with powerful financial calculators to help users with topics like income tax, investments (SIP, FD), and loan EMIs.

![Pai Chatbot Screenshot](https://storage.googleapis.com/aifire.dev/Pai-Screenshot.png)

---

## ✨ Key Features

- **Conversational AI**: Ask complex financial questions in plain English, Hindi, or Hinglish.
- **Financial Calculators**: Built-in tools for calculating Income Tax, SIP returns, EMI, and more.
- **Responsive Design**: A clean, modern UI that works seamlessly on both desktop and mobile devices.
- **Light & Dark Themes**: Switch between themes for your viewing comfort.
- **Voice Input**: Use your microphone to ask questions.
- **Source-Backed Answers**: The AI can cite its sources for general financial knowledge questions.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **AI**: [Google Gemini](https://ai.google/discover/gemini/) via [Genkit](https://firebase.google.com/docs/genkit)
- **UI**: [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [ShadCN UI](https://ui.shadcn.com/)
- **State Management**: React Hooks

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation & Running

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/pai-chatbot.git
   ```

2. **Install NPM packages:**
   ```sh
   npm install
   ```
   
3. **Set up environment variables:**
   Create a `.env` file in the root directory and add your Google AI API key:
   ```env
   GEMINI_API_KEY=YOUR_API_KEY
   ```

4. **Run the development server:**
   ```sh
   npm run dev
   ```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.
