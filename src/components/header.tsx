"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Settings, Check } from 'lucide-react';
import { SettingsSheet } from './settings-sheet';
import type { ChatMessage } from '@/lib/types';

interface HeaderProps {
  setMessages: (messages: ChatMessage[]) => void;
  messages: ChatMessage[];
}

export function Header({ setMessages, messages }: HeaderProps) {
  const router = useRouter();
  const [chatHistory, setChatHistory] = useState<Record<string, ChatMessage[]>>({});

  useEffect(() => {
    const allKeys = Object.keys(localStorage);
    const historyKeys = allKeys.filter(key => key.startsWith('chatHistory-'));
    const history: Record<string, ChatMessage[]> = {};
    historyKeys.forEach(key => {
      const saved = localStorage.getItem(key);
      if (saved) {
        history[key] = JSON.parse(saved);
      }
    });
    setChatHistory(history);
  }, [messages.length]); 

  const handleSaveScenario = () => {
    const slotNumber = Object.keys(chatHistory).filter(k => k.startsWith('chatHistory-slot')).length + 1;
    const key = `chatHistory-slot-${slotNumber}`;
    localStorage.setItem(key, JSON.stringify(messages));
    localStorage.setItem('chatHistory-active', '[]');
    setMessages([]);
    alert(`Chat saved to Slot ${slotNumber}`);
  };

  const handleLoadScenario = (key: string) => {
    const saved = localStorage.getItem(key);
    if (saved) {
      localStorage.setItem('chatHistory-active', saved);
      setMessages(JSON.parse(saved));
    }
  };

  const handleNewChat = () => {
    localStorage.setItem('chatHistory-active', '[]');
    setMessages([]);
  }

  return (
    <header className="flex h-16 items-center justify-between bg-card/50 backdrop-blur-md px-4 md:px-6 sticky top-0 z-10 border-b border-border">
      <div className="flex items-center gap-3">
        <Image src="/logo.png" alt="Pai Logo" width={32} height={32} />
        <h1 className="text-xl font-semibold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Pai Chatbot</h1>
      </div>
      <div className="flex items-center gap-1">
        <SettingsSheet />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
             <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 border-2 border-primary/50">
                <AvatarImage src="https://picsum.photos/seed/user-avatar/100/100" data-ai-hint="person" alt="User Avatar" />
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Guest User</p>
                <p className="text-xs leading-none text-muted-foreground">
                  guest@example.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleNewChat}>New Chat</DropdownMenuItem>
            <DropdownMenuItem onClick={handleSaveScenario} disabled={messages.length === 0}>Save Scenario</DropdownMenuItem>
             <DropdownMenuSub>
                <DropdownMenuSubTrigger>Load Scenario</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {Object.keys(chatHistory).filter(k => k.startsWith('chatHistory-slot')).map((key, index) => (
                      <DropdownMenuItem key={key} onClick={() => handleLoadScenario(key)}>
                        Slot {index + 1}
                      </DropdownMenuItem>
                    ))}
                     {Object.keys(chatHistory).filter(k => k.startsWith('chatHistory-slot')).length === 0 && <DropdownMenuLabel>No saved scenarios</DropdownMenuLabel>}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/login')}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
