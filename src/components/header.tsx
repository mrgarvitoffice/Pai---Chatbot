"use client";

import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Sun, Moon } from 'lucide-react';
import { PaiLogo } from './icons';

export function Header() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // This component only works with a dark theme as per the new design.
    // We are forcing the dark theme here.
    const savedTheme = 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.add('dark');
  }, []);

  const toggleTheme = () => {
    // Theme toggling is disabled to match the new design.
    // If you want to re-enable it, you can implement the logic here.
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <PaiLogo className="h-8 w-8 text-primary" />
        <h1 className="text-xl font-semibold tracking-tight">Pai Chatbot</h1>
      </div>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
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
                <p className="text-sm font-medium leading-none">Demo User</p>
                <p className="text-xs leading-none text-muted-foreground">
                  demo@example.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Saved Scenarios</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
