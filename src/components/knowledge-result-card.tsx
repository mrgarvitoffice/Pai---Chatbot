"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Info } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface KnowledgeResultCardProps {
    response: string;
    query: string;
}

export function KnowledgeResultCard({ response, query }: KnowledgeResultCardProps) {
    return (
        <Card className="bg-card/50 border border-border/30 shadow-lg">
            <CardHeader className="pb-4">
                 <CardTitle className="text-xl font-semibold mb-2 flex items-center gap-2">
                    <Info className="size-5 text-primary" />
                    Information Center
                </CardTitle>
                <CardDescription>Answering your question about: "{query}"</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="p-4 rounded-xl bg-background/50 border border-border/20 shadow-inner">
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 text-foreground/90">
                         <ReactMarkdown>{response}</ReactMarkdown>
                    </div>
                </div>
            </CardContent>
             <CardFooter className="pt-4 border-t border-border/30">
                 <p className="text-xs text-muted-foreground w-full text-center">This is not financial advice. All information is for educational purposes only. Please consult a financial advisor for personalised guidance.</p>
            </CardFooter>
        </Card>
    );
}
