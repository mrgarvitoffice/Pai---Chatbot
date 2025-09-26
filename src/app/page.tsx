
"use client";

import { useState, useRef, useEffect, useCallback, type FormEvent, type Dispatch, type SetStateAction, type MutableRefObject } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/components/chat-message';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUp, Mic } from 'lucide-react';
import type { ChatMessage as ChatMessageType, HistoryMessage } from '@/lib/types';
import { WelcomeMessage } from '@/components/welcome-message';
import { sendMessageAction } from '@/lib/actions';
import { ToolsPanel } from '@/components/tools-panel';
import { Header } from '@/components/header';
import { useIsMobile } from '@/hooks/use-mobile';
import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const initialMessages: ChatMessageType[] = [];

const SpeechRecognition = (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition));

type MobileView = 'chat' | 'tools';


// Moved ChatInterface outside of Home to prevent re-renders on input change
const ChatInterface = ({
  messages,
  isLoading,
  chatScrollAreaRef,
  input,
  setInput,
  isRecording,
  handleSendMessage,
  toggleRecording,
  handleFeedback,
  processAndSetMessage,
}: {
  messages: ChatMessageType[];
  isLoading: boolean;
  chatScrollAreaRef: MutableRefObject<HTMLDivElement | null>;
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  isRecording: boolean;
  handleSendMessage: (e: FormEvent) => Promise<void>;
  toggleRecording: () => void;
  handleFeedback: (messageId: string, feedback: 'like' | 'dislike') => void;
  processAndSetMessage: (query: string) => Promise<void>;
}) => (
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
         <p className="text-xs text-center text-muted-foreground mt-2 px-4">
          Pai is an AI assistant and may produce inaccurate information. This is not financial advice.
        </p>
      </div>
    </div>
  </div>
);

// Moved ToolsInterface outside of Home to prevent re-renders
const ToolsInterface = ({ setMessages, latestReportId, setLatestReportId }: { 
  setMessages: Dispatch<SetStateAction<ChatMessageType[]>>;
  latestReportId: string | null;
  setLatestReportId: Dispatch<SetStateAction<string | null>>;
}) => (
  <div className="h-full overflow-y-auto thin-scrollbar lg:p-0">
    <ToolsPanel 
      setMessages={setMessages} 
      latestReportId={latestReportId} 
      setLatestReportId={setLatestReportId} 
    />
  </div>
);


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
  const chatScrollAreaRef = useRef<HTMLDivElement | null>(null);

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
    // In a real app, you would send this feedback to a server
    console.log(`Feedback for message ${messageId}: ${feedback}`);
  };

  const processAndSetMessage = useCallback(async (query: string) => {
    if (!query.trim() || isLoading) return;

    if (isMobile) {
      handleMobileNav('chat');
    }

    const userMessage: ChatMessageType = { id: uuidv4(), role: 'user', content: query };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const history: HistoryMessage[] = newMessages.slice(0, -1).map(msg => {
          let content = '';
          if (msg.role === 'user' && typeof msg.content === 'string') {
            content = msg.content;
          } else if (msg.role === 'assistant' && msg.rawContent) {
              // Use the raw text content for the assistant's history
              content = msg.rawContent;
          }
          return {
              role: msg.role === 'user' ? 'user' : 'model',
              content: content,
          };
      });

      const result = await sendMessageAction({ query, history });
      
      const botResponse: ChatMessageType = { 
        id: uuidv4(), 
        role: 'assistant', 
        content: result.response, 
        rawContent: result.response, 
        sources: result.sources,
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error(error);
      const errorMessage = "Sorry, I encountered an error. Please try again.";
      const errorResponse: ChatMessageType = { id: uuidv4(), role: 'assistant', content: errorMessage, rawContent: errorMessage };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages, isMobile]);

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
          processAndSetMessage(finalTranscript); // Automatically send after transcription
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
                             <ChatInterface 
                                messages={messages} 
                                isLoading={isLoading} 
                                chatScrollAreaRef={chatScrollAreaRef}
                                input={input}
                                setInput={setInput}
                                isRecording={isRecording}
                                handleSendMessage={handleSendMessage}
                                toggleRecording={toggleRecording}
                                handleFeedback={handleFeedback}
                                processAndSetMessage={processAndSetMessage}
                             />
                         </div>
                    </CarouselItem>
                    <CarouselItem>
                         <div className="h-[calc(100vh-112px)] overflow-y-auto thin-scrollbar">
                            <ToolsInterface 
                                setMessages={setMessages} 
                                latestReportId={latestReportId} 
                                setLatestReportId={setLatestReportId} 
                            />
                         </div>
                    </CarouselItem>
                </CarouselContent>
            </Carousel>
        </div>

        {/* Desktop View */}
        <div className="hidden lg:flex flex-1 overflow-hidden">
          <div className="flex-[60%] flex flex-col">
              <ChatInterface 
                messages={messages} 
                isLoading={isLoading} 
                chatScrollAreaRef={chatScrollAreaRef}
                input={input}
                setInput={setInput}
                isRecording={isRecording}
                handleSendMessage={handleSendMessage}
                toggleRecording={toggleRecording}
                handleFeedback={handleFeedback}
                processAndSetMessage={processAndSetMessage}
              />
          </div>
          <aside className="flex-[40%] h-full border-l border-border/50">
              <ToolsInterface 
                setMessages={setMessages} 
                latestReportId={latestReportId} 
                setLatestReportId={setLatestReportId} 
              />
          </aside>
        </div>
      </main>
    </div>
  );
}
