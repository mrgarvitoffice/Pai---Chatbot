
"use client";

import type { DtiResult } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Wallet, Banknote } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface DtiResultCardProps {
    id: string;
    result: DtiResult;
    explanation: string;
}

export function DtiResultCard({ id, result, explanation }: DtiResultCardProps) {
    const getRiskLevel = (ratio: number) => {
        if (ratio > 40) return { label: "High Risk", color: "text-destructive" };
        if (ratio > 30) return { label: "Moderate", color: "text-yellow-400" };
        return { label: "Safe", color: "text-green-500" };
    }
    const risk = getRiskLevel(result.dtiRatio);

    return (
        <Card id={id} className="bg-card/50 border border-border/30 shadow-lg">
            <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-semibold mb-2">⚖️ Debt-to-Income Ratio</CardTitle>
                <CardDescription>DTI Ratio</CardDescription>
                <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary py-1">
                    {result.dtiRatio}%
                </p>
                <p className={`text-sm font-semibold ${risk.color}`}>{risk.label}</p>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="p-4 rounded-xl bg-background/50 border border-border/20 shadow-inner">
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 text-foreground/90">
                         <ReactMarkdown>{explanation}</ReactMarkdown>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                        <div className="p-2 rounded-full bg-green-500/10 text-green-500">
                            <Wallet className="size-5"/>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Monthly Income</p>
                            <p className="font-semibold">₹{result.monthlyIncome.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                        <div className="p-2 rounded-full bg-red-500/10 text-red-500">
                            <Banknote className="size-5"/>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Total Monthly EMI</p>
                            <p className="font-semibold text-red-400">🔴 ₹{result.monthlyEmi.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                </div>
                <div>
                    <p className="text-xs text-muted-foreground mb-1">Risk Levels: &lt;30% (Safe), 30-40% (Moderate), &gt;40% (High Risk)</p>
                    <Progress value={result.dtiRatio} className="h-2 [&>div]:bg-primary" />
                </div>
            </CardContent>
             <CardFooter className="flex-col items-start gap-2 pt-4 border-t border-border/30">
                <p className="text-xs text-muted-foreground w-full text-center">This is not financial advice. Please consult a financial advisor for personalised guidance.</p>
            </CardFooter>
        </Card>
    );
}
