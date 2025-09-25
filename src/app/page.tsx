
"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import type { FormEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/components/chat-message';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUp, Mic } from 'lucide-react';
import type { ChatMessage as ChatMessageType, HistoryMessage } from '@/lib/types';
import { WelcomeMessage } from '@/components/welcome-message';
import { sendMessageAction } from '@/lib/actions';
import { TaxResultCard } from '@/components/tax-result-card';
import { SipResultCard } from '@/components/sip-result-card';
import { EmiResultCard } from '@/components/emi-result-card';
import { CompoundInterestResultCard } from '@/components/compound-interest-result-card';
import { BudgetAllocationResultCard } from '@/components/budget-allocation-result-card';
import { FdResultCard } from '@/components/fd-result-card';
import { RdResultCard } from '@/components/rd-result-card';
import { ReverseSipResultCard } from '@/components/reverse-sip-result-card';
import { RetirementResultCard } from '@/components/retirement-result-card';
import { DtiResultCard } from '@/components/dti-result-card';
import { SavingsRatioResultCard } from '@/components/savings-ratio-result-card';
import { PortfolioAllocationResultCard } from '@/components/portfolio-allocation-result-card';
import { TermInsuranceResultCard } from '@/components/term-insurance-result-card';
import { FireResultCard } from '@/components/fire-result-card';
import { HraResultCard } from '@/components/hra-result-card';
import { ToolsPanel } from '@/components/tools-panel';
import { KnowledgeResultCard } from '@/components/knowledge-result-card';
import { Header } from '@/components/header';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const initialMessages: ChatMessageType[] = [];

const SpeechRecognition = (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition));

type MobileView = 'chat' | 'tools';

export default function Home() {
  const [messages, setMessages] = useState<ChatMessageType[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [latestReportId, setLatestReportId] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const isMobile = useIsMobile();
  
  const [api, setApi] = useState<CarouselApi>()
  const [activeMobileView, setActiveMobileView] = useState<MobileView>('chat');
  const chatScrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!api) {
      return
    }
    api.on("select", () => {
      setActiveMobileView(api.selectedScrollSnap() === 0 ? 'chat' : 'tools')
    })
  }, [api])

  const handleMobileNav = (view: MobileView) => {
    setActiveMobileView(view);
    api?.scrollTo(view === 'chat' ? 0 : 1);
  }

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatHistory-active');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error("Failed to parse chat history:", e);
        setMessages([]);
      }
    }
  }, []);

  const saveCurrentChat = useCallback(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatHistory-active', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    saveCurrentChat();
  }, [saveCurrentChat]);


  const scrollToBottom = () => {
    if (chatScrollAreaRef.current) {
      chatScrollAreaRef.current.scrollTo({ top: chatScrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);
  
  const handleFeedback = (messageId: string, feedback: 'like' | 'dislike') => {
    setMessages(prevMessages => 
        prevMessages.map(msg => 
            msg.id === messageId ? { ...msg, feedback } : msg
        )
    );
    console.log(`Feedback for message ${messageId}: ${feedback}`);
  };

  const processAndSetMessage = useCallback(async (query: string) => {
    if (!query.trim() || isLoading) return;

    if (isMobile) {
      handleMobileNav('chat');
    }

    const userMessage: ChatMessageType = { id: uuidv4(), role: 'user', content: query };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history: HistoryMessage[] = [...messages, userMessage].slice(0, -1).map(msg => {
          let content = '';
          if (msg.role === 'user') {
            content = msg.content as string;
          } else if (msg.role === 'assistant') {
              content = msg.rawContent || 'Previous calculation result displayed.';
              if (msg.feedback) {
                  content += `\n[User feedback: ${msg.feedback}]`;
              }
          }
          return {
              role: msg.role === 'user' ? 'user' : 'model',
              content: content,
          };
      });

      const result = await sendMessageAction({ query, history });
      
      let content: React.ReactNode;
      const resultId = result.calculationResult?.data.id;

      if (resultId) {
        setLatestReportId(resultId);
      } else {
        setLatestReportId(null);
      }

      const resultCardId = resultId || `knowledge-${uuidv4()}`;

      if (result.calculationResult?.type === 'tax') content = <TaxResultCard id={resultCardId} result={result.calculationResult.data} explanation={result.response} />;
      else if (result.calculationResult?.type === 'tax_comparison') content = <TaxResultCard id={resultCardId} comparisonResult={result.calculationResult.data} explanation={result.response} />;
      else if (result.calculationResult?.type === 'sip') content = <SipResultCard id={resultCardId} result={result.calculationResult.data} explanation={result.response} />;
      else if (result.calculationResult?.type === 'emi') content = <EmiResultCard id={resultCardId} result={result.calculationResult.data} explanation={result.response} />;
      else if (result.calculationResult?.type === 'compound_interest') content = <CompoundInterestResultCard id={resultCardId} result={result.calculationResult.data} explanation={result.response} />;
      else if (result.calculationResult?.type === 'budget') content = <BudgetAllocationResultCard id={resultCardId} result={result.calculationResult.data} explanation={result.response} />;
      else if (result.calculationResult?.type === 'fd') content = <FdResultCard id={resultCardId} result={result.calculationResult.data} explanation={result.response} />;
      else if (result.calculationResult?.type === 'rd') content = <RdResultCard id={resultCardId} result={result.calculationResult.data} explanation={result.response} />;
      else if (result.calculationResult?.type === 'reverse_sip') content = <ReverseSipResultCard id={resultCardId} result={result.calculationResult.data} explanation={result.response} />;
      else if (result.calculationResult?.type === 'retirement') content = <RetirementResultCard id={resultCardId} result={result.calculationResult.data} explanation={result.response} />;
      else if (result.calculationResult?.type === 'dti') content = <DtiResultCard id={resultCardId} result={result.calculationResult.data} explanation={result.response} />;
      else if (result.calculationResult?.type === 'savings_ratio') content = <SavingsRatioResultCard id={resultCardId} result={result.calculationResult.data} explanation={result.response} />;
      else if (result.calculationResult?.type === 'portfolio_allocation') content = <PortfolioAllocationResultCard id={resultCardId} result={result.calculationResult.data} explanation={result.response} />;
      else if (result.calculationResult?.type === 'term_insurance') content = <TermInsuranceResultCard id={resultCardId} result={result.calculationResult.data} explanation={result.response} />;
      else if (result.calculationResult?.type === 'fire') content = <FireResultCard id={resultCardId} result={result.calculationResult.data} explanation={result.response} />;
      else if (result.calculationResult?.type === 'hra') content = <HraResultCard id={resultCardId} result={result.calculationResult.data} explanation={result.response} />;
      else content = <KnowledgeResultCard id={resultCardId} query={query} response={result.response} />;
      
      const botResponse: ChatMessageType = { 
        id: uuidv4(), 
        role: 'assistant', 
        content, 
        rawContent: result.response, 
        sources: result.sources 
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error(error);
      const errorResponse: ChatMessageType = { id: uuidv4(), role: 'assistant', content: "Sorry, I encountered an error. Please try again.", rawContent: "Sorry, I encountered an error. Please try again." };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages, isMobile, api]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    processAndSetMessage(input);
  };

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      if (!SpeechRecognition) {
        alert("Your browser does not support Speech Recognition.");
        return;
      }
      if (!recognitionRef.current) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.onresult = (event: any) => {
          const finalTranscript = event.results[0][0].transcript;
          setInput(finalTranscript);
          processAndSetMessage(finalTranscript);
        };
        recognitionRef.current.onend = () => setIsRecording(false);
        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
        };
      }
      setInput('');
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };
  
  const ChatInterface = () => (
    <div className="flex-1 flex flex-col overflow-hidden h-full">
        <div className="flex-1 overflow-y-auto thin-scrollbar" ref={chatScrollAreaRef}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-6">
              {messages.length === 0 && !isLoading ? <WelcomeMessage setInput={setInput} onSendMessage={processAndSetMessage} /> : messages.map((message) => <ChatMessage key={message.id} onFeedback={handleFeedback} {...message} />)}
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
        <div className="bg-background/80 backdrop-blur-md border-t border-border/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 md:gap-4">
              <div className="flex-1 flex items-center px-2 bg-card border border-input rounded-full shadow-inner focus-within:ring-2 focus-within:ring-primary/50 transition-all duration-300">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isRecording ? 'Listening...' : "Ask Pai anything about finance..."}
                  className="flex-1 h-12 px-3 bg-transparent border-none focus-visible:ring-0 text-base md:text-sm"
                  disabled={isLoading}
                />
                <Button type="button" variant="ghost" size="icon" onClick={toggleRecording} className="size-9 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10" disabled={isLoading}>
                  <Mic className={`size-5 transition-colors ${isRecording ? 'text-primary animate-pulse' : ''}`} />
                </Button>
              </div>
              <Button type="submit" size="icon" className="size-12 rounded-full bg-gradient-to-br from-primary to-secondary flex-shrink-0" disabled={!input.trim() || isLoading}>
                <ArrowUp className="size-5" />
              </Button>
            </form>
          </div>
        </div>
    </div>
  );

  const ToolsInterface = () => (
    <div className="h-full overflow-y-auto thin-scrollbar lg:p-0">
      <ToolsPanel
          setMessages={setMessages}
          latestReportId={latestReportId}
          setLatestReportId={setLatestReportId}
      />
    </div>
  );

  return (
    <div className="flex h-screen bg-background font-body">
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header setMessages={setMessages} messages={messages} />
        
        {/* Mobile View with Swiping Carousel */}
        <div className="lg:hidden flex-1 flex flex-col overflow-hidden">
            <div className="px-4 pt-2 bg-background/95 backdrop-blur-sm sticky top-0 z-10 border-b">
                <Tabs value={activeMobileView} onValueChange={(value) => handleMobileNav(value as MobileView)} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="chat">Chat</TabsTrigger>
                        <TabsTrigger value="tools">Calculators</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
             <Carousel setApi={setApi} className="flex-1">
                <CarouselContent>
                    <CarouselItem>
                         <div className="h-[calc(100vh-112px)]">
                             <ChatInterface />
                         </div>
                    </CarouselItem>
                    <CarouselItem>
                         <div className="h-[calc(100vh-112px)] overflow-y-auto thin-scrollbar">
                            <ToolsInterface />
                         </div>
                    </CarouselItem>
                </CarouselContent>
            </Carousel>
        </div>

        {/* Desktop View */}
        <div className="hidden lg:flex flex-1 overflow-hidden">
          <div className="flex-1 flex flex-col">
              <ChatInterface />
          </div>
          <aside className="w-[400px] h-full border-l border-border/50">
              <ToolsInterface />
          </aside>
        </div>
      </main>
    </div>
  );
}
