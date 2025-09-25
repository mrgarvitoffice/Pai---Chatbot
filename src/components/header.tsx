"use client";

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
import { User, Bell, Settings } from 'lucide-react';
import { PaiLogo } from './icons';
import { SidebarTrigger } from './ui/sidebar';

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between bg-card/50 backdrop-blur-md px-4 md:px-6 sticky top-0 z-10 border-b border-border">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <div className="flex items-center gap-3">
            <PaiLogo className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-semibold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Pai</h1>
        </div>
      </div>
      <div className="flex items-center gap-2">
         <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="size-5" />
         </Button>
         <Button variant="ghost" size="icon" className="rounded-full">
            <Settings className="size-5" />
         </Button>
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
