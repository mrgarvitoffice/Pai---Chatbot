"use client";

import { useState } from 'react';
import type { FormEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Header } from '@/components/header';
import { ChatMessage } from '@/components/chat-message';
import { TaxCalculator } from '@/components/tax-calculator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { PaiLogo } from '@/components/icons';

const initialMessages: ChatMessageType[] = [
  {
    id: uuidv4(),
    role: 'assistant',
    content: (
      <div>
        <h2 className="text-lg font-semibold mb-2">Welcome to Pai Chatbot!</h2>
        <p className="text-muted-foreground">
          I can help you with Indian personal finance questions about tax, retirement, SIPs, and insurance.
          Every number is computed, and every fact is sourced.
        </p>
        <p className="mt-4">
          To get started, please use the tax calculator on the right.
        </p>
      </div>
    ),
  },
];

export default function Home() {
  const [messages, setMessages] = useState<ChatMessageType[]>(initialMessages);
  const [input, setInput] = useState('');

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessageType = {
      id: uuidv4(),
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // A simple canned response for any user message for demonstration purposes
    const botResponse: ChatMessageType = {
      id: uuidv4(),
      role: 'assistant',
      content: "Please use the calculator on the right to get specific financial information. I can help explain the results.",
    };
    
    setTimeout(() => {
        setMessages((prev) => [...prev, botResponse]);
    }, 500);

  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      <main className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col md:flex-row gap-6 p-4 md:p-6">
          {/* Chat Column */}
          <div className="flex flex-col h-full flex-1">
            <Card className="flex-1 flex flex-col h-full rounded-2xl shadow-sm overflow-hidden">
              <CardContent className="flex-1 flex flex-col p-6 gap-6 h-0">
                <ScrollArea className="flex-1 -mx-6">
                  <div className="px-6 space-y-6">
                    {messages.map((message) => (
                      <ChatMessage key={message.id} {...message} />
                    ))}
                  </div>
                </ScrollArea>
                <form onSubmit={handleSendMessage} className="relative">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask Pai — e.g., ‘Tax on ₹15L for FY 25–26’"
                    className="pr-12 h-12 rounded-xl"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg"
                    disabled={!input.trim()}
                  >
                    <ArrowUp className="size-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Calculator Column */}
          <div className="w-full md:w-[450px] lg:w-[500px] flex-shrink-0 h-full">
             <TaxCalculator setMessages={setMessages} />
          </div>
        </div>
      </main>
      <footer className="text-center p-2 text-xs text-muted-foreground border-t">
        Not financial advice. For personalized advice, consult a SEBI-registered advisor.
      </footer>
    </div>
  );
}
