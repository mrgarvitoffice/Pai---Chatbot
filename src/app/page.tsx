"use client";

import { useState, useRef, useEffect } from 'react';
import type { FormEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Header } from '@/components/header';
import { ChatMessage } from '@/components/chat-message';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUp, Mic } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '@/lib/types';
import { WelcomeMessage } from '@/components/welcome-message';
import { sendMessageAction } from '@/lib/actions';
import { TaxResultCard } from '@/components/tax-result-card';
import { SipResultCard } from '@/components/sip-result-card';
import { EmiResultCard } from '@/components/emi-result-card';
import { CompoundInterestResultCard } from '@/components/compound-interest-result-card';
import { BudgetAllocationResultCard } from '@/components/budget-allocation-result-card';
import { FdResultCard } from '@/components/fd-result-card';
import { RdResultCard } from '@/components/rd-result-card';
import { SavingsRatioResultCard } from '@/components/savings-ratio-result-card';
import { DtiResultCard } from '@/components/dti-result-card';
import { ReverseSipResultCard } from '@/components/reverse-sip-result-card';
import { RetirementResultCard } from '@/components/retirement-result-card';

const initialMessages: ChatMessageType[] = [];

// Check for SpeechRecognition API
const SpeechRecognition =
  (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition));

export default function Home() {
  const [messages, setMessages] = useState<ChatMessageType[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);


  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

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

      if (result.calculationResult?.type === 'tax') {
        content = <TaxResultCard result={result.calculationResult.data} explanation={result.response} />;
      } else if (result.calculationResult?.type === 'tax_comparison') {
        content = <TaxResultCard comparisonResult={result.calculationResult.data} explanation={result.response} />;
      } else if (result.calculationResult?.type === 'sip') {
        content = <SipResultCard result={result.calculationResult.data} explanation={result.response} />;
      } else if (result.calculationResult?.type === 'emi') {
        content = <EmiResultCard result={result.calculationResult.data} explanation={result.response} />;
      } else if (result.calculationResult?.type === 'compound_interest') {
        content = <CompoundInterestResultCard result={result.calculationResult.data} explanation={result.response} />;
      } else if (result.calculationResult?.type === 'budget') {
        content = <BudgetAllocationResultCard result={result.calculationResult.data} explanation={result.response} />;
      } else if (result.calculationResult?.type === 'fd') {
        content = <FdResultCard result={result.calculationResult.data} explanation={result.response} />;
      } else if (result.calculationResult?.type === 'rd') {
        content = <RdResultCard result={result.calculationResult.data} explanation={result.response} />;
      } else if (result.calculationResult?.type === 'savings_ratio') {
        content = <SavingsRatioResultCard result={result.calculationResult.data} explanation={result.response} />;
      } else if (result.calculationResult?.type === 'dti_ratio') {
        content = <DtiResultCard result={result.calculationResult.data} explanation={result.response} />;
      } else if (result.calculationResult?.type === 'reverse_sip') {
        content = <ReverseSipResultCard result={result.calculationResult.data} explanation={result.response} />;
      } else if (result.calculationResult?.type === 'retirement_corpus') {
        content = <RetirementResultCard result={result.calculationResult.data} explanation={result.response} />;
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

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
       if (!SpeechRecognition) {
          alert("Your browser does not support Speech Recognition. Please try Chrome or Safari.");
          return;
       }
       if (!recognitionRef.current) {
         recognitionRef.current = new SpeechRecognition();
         recognitionRef.current.continuous = false; // Set to false to handle results per utterance
         recognitionRef.current.interimResults = true;
         
         recognitionRef.current.onresult = (event: any) => {
           let finalTranscript = '';
           for (let i = 0; i < event.results.length; i++) {
             const segment = event.results[i];
             if (segment.isFinal) {
               finalTranscript += segment[0].transcript;
             }
           }
           // Use the final transcript after the user finishes speaking
           if (finalTranscript) {
              setInput(prev => prev + (prev ? ' ' : '') + finalTranscript);
           }
         };

         recognitionRef.current.onend = () => {
            setIsRecording(false);
         }
         recognitionRef.current.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setIsRecording(false);
         }
       }
       setInput('');
       recognitionRef.current.start();
       setIsRecording(true);
    }
  };


  return (
    <div className="flex flex-col h-screen bg-background font-body">
      <Header />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto" ref={scrollAreaRef}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-6">
              {messages.length === 0 && !isLoading ? (
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
                    <div className="flex items-center space-x-2 p-4">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground dot1"></div>
                      <div className="w-2 h-2 rounded-full bg-muted-foreground dot2"></div>
                      <div className="w-2 h-2 rounded-full bg-muted-foreground dot3"></div>
                      <span className="text-sm text-muted-foreground">Pai is thinking...</span>
                    </div>
                  }
                />
               )}
            </div>
          </div>
        </div>
        <div className="bg-background/80 backdrop-blur-md border-t">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                 <form onSubmit={handleSendMessage} className="flex items-center gap-2 md:gap-4">
                  <div className="flex-1 flex items-center px-2 bg-muted rounded-full shadow-inner focus-within:ring-2 focus-within:ring-primary/50 transition-all duration-300">
                     <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={isRecording ? 'Listening...' : "Ask Pai anything about finance..."}
                        className="flex-1 h-12 px-3 bg-transparent border-none focus-visible:ring-0 text-base md:text-sm"
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={toggleRecording}
                        className="size-9 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors duration-300"
                        disabled={isLoading}
                      >
                        <Mic className={`size-5 transition-colors ${isRecording ? 'text-primary animate-pulse' : ''}`} />
                      </Button>
                  </div>
                  <Button
                    type="submit"
                    size="icon"
                    className="size-12 rounded-full bg-gradient-to-br from-primary to-pink-400 dark:to-pink-600 flex-shrink-0 shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 ease-out disabled:scale-100 disabled:shadow-lg"
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
