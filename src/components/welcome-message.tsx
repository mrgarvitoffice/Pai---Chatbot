"use client";

import type { Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { PaiLogo } from './icons';
import { Zap, Bot, BarChart, Calculator } from 'lucide-react';

const exampleQueries = [
    { icon: <Calculator className="size-4" />, text: "Tax on ₹15L for FY 25–26" },
    { icon: <BarChart className="size-4" />, text: "SIP of 5000 for 10 years" },
    { icon: <Bot className="size-4" />, text: "Explain the new tax regime" },
];

interface WelcomeMessageProps {
    setInput: Dispatch<SetStateAction<string>>;
}

export function WelcomeMessage({ setInput }: WelcomeMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full pt-4 sm:pt-16">
        <div className="relative mb-4">
            <div className="absolute -inset-2 bg-gradient-to-br from-primary to-secondary rounded-full blur-lg opacity-75 animate-pulse"></div>
            <div className="relative bg-background rounded-full p-4 border shadow-lg">
                <PaiLogo className="h-16 w-16 text-primary" />
            </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-2">Hello, I'm Pai.</h1>
        <p className="text-lg text-muted-foreground text-center mb-10 max-w-md">Your Personal AI Financial Assistant. How can I help you today?</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
            {exampleQueries.map((query) => (
                <button
                    key={query.text}
                    onClick={() => setInput(query.text)}
                    className="group p-4 border rounded-xl text-left hover:bg-muted/50 transition-colors duration-300 ease-in-out transform hover:-translate-y-1"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-muted text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            {query.icon}
                        </div>
                        <p className="font-semibold text-sm">{query.text}</p>
                    </div>
                </button>
            ))}
        </div>
    </div>
  );
}
