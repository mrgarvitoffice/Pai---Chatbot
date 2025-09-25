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
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { SettingsSheet } from './settings-sheet';
import type { ChatMessage } from '@/lib/types';

interface HeaderProps {
  setMessages: (messages: ChatMessage[]) => void;
  messages: ChatMessage[];
}

export function Header({ setMessages, messages }: HeaderProps) {
  const router = useRouter();

  const handleNewChat = () => {
    setMessages([]);
  }

  return (
    <header className="flex h-16 items-center justify-between bg-card/50 backdrop-blur-md px-4 md:px-6 sticky top-0 z-10 border-b border-border">
      <div className="flex items-center gap-3">
        <Image src="/icon.png" alt="Pai Logo" width={32} height={32} />
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
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/login')}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
