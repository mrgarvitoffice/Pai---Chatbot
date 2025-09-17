"use client";

import type { Dispatch, SetStateAction } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PaiLogo } from './icons';
import { Zap } from 'lucide-react';

const exampleQueries = [
    "Tax on ₹15L for FY 25–26",
    "How much can I invest in an SIP?",
    "Explain the new tax regime",
];

interface WelcomeMessageProps {
    setInput: Dispatch<SetStateAction<string>>;
}

export function WelcomeMessage({ setInput }: WelcomeMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full pt-16">
        <PaiLogo className="h-16 w-16 text-primary mb-4" />
        <h1 className="text-3xl font-bold tracking-tight mb-2">Hello, I'm Pai.</h1>
        <p className="text-lg text-muted-foreground mb-10">How can I help you today?</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
            {exampleQueries.map((query) => (
                <button
                    key={query}
                    onClick={() => setInput(query)}
                    className="p-4 border rounded-lg text-left hover:bg-secondary transition-colors"
                >
                    <p className="font-semibold">{query}</p>
                    <p className="text-sm text-muted-foreground mt-1">Get an immediate answer</p>
                </button>
            ))}
        </div>
    </div>
  );
}
