"use client";

import { useState } from 'react';
import type { FormEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Header } from '@/components/header';
import { ChatMessage } from '@/components/chat-message';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '@/lib/types';
import { WelcomeMessage } from '@/components/welcome-message';
import { sendMessageAction } from '@/lib/actions';
import { TaxResultCard } from '@/components/tax-result-card';

const initialMessages: ChatMessageType[] = [];

export default function Home() {
  const [messages, setMessages] = useState<ChatMessageType[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessageType = {
      id: uuidv4(),
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const result = await sendMessageAction({ query: currentInput });
      
      let content: React.ReactNode;

      if (result.calculationResult) {
        content = <TaxResultCard result={result.calculationResult} explanation={result.response} />;
      } else {
        content = result.response;
      }
      
      const botResponse: ChatMessageType = {
        id: uuidv4(),
        role: 'assistant',
        content: content,
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      const errorResponse: ChatMessageType = {
        id: uuidv4(),
        role: 'assistant',
        content: "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background font-body">
      <Header />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <ScrollArea className="h-full">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="space-y-6">
                {messages.length === 0 ? (
                   <WelcomeMessage setInput={setInput} />
                ) : (
                  messages.map((message) => (
                    <ChatMessage key={message.id} {...message} />
                  ))
                )}
                 {isLoading && (
                    <ChatMessage
                        id="loading"
                        role="assistant"
                        content={
                            <div className="flex items-center space-x-2">
                                <div className="animate-pulse bg-muted rounded-full h-2 w-2"></div>
                                <div className="animate-pulse bg-muted rounded-full h-2 w-2 delay-150"></div>
                                <div className="animate-pulse bg-muted rounded-full h-2 w-2 delay-300"></div>
                            </div>
                        }
                    />
                )}
              </div>
            </div>
          </ScrollArea>
        </div>
        <div className="bg-background border-t">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                 <form onSubmit={handleSendMessage} className="relative">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask Pai — e.g., ‘Tax on ₹15L for FY 25–26’"
                    className="pr-12 h-12 rounded-xl text-base"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg"
                    disabled={!input.trim() || isLoading}
                  >
                    <ArrowUp className="size-5" />
                  </Button>
                </form>
            </div>
             <footer className="text-center pb-4 text-xs text-muted-foreground">
                Not financial advice. For personalized advice, consult a SEBI-registered advisor.
            </footer>
        </div>
      </main>
    </div>
  );
}
