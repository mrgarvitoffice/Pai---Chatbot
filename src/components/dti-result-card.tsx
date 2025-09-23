"use client";

import type { DtiResult } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Wallet, Banknote } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface DtiResultCardProps {
    result: DtiResult;
    explanation: string;
}

export function DtiResultCard({ result, explanation }: DtiResultCardProps) {
    const getRiskLevel = (ratio: number) => {
        if (ratio > 40) return { label: "High Risk", color: "text-destructive" };
        if (ratio > 30) return { label: "Moderate", color: "text-yellow-400" };
        return { label: "Safe", color: "text-green-500" };
    }
    const risk = getRiskLevel(result.dtiRatio);

    return (
        <Card className="bg-background/50 border-0 shadow-none">
            <CardHeader className="text-center pb-4">
                <CardDescription>Debt-to-Income (DTI) Ratio</CardDescription>
                <CardTitle className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-400 dark:to-pink-500 py-1">
                    {result.dtiRatio}%
                </CardTitle>
                <p className={`text-sm font-semibold ${risk.color}`}>{risk.label}</p>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="p-4 rounded-xl bg-background border shadow-inner">
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 text-foreground/90">
                         <ReactMarkdown>{explanation}</ReactMarkdown>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-background">
                        <div className="p-2 rounded-full bg-green-500/20 text-green-500">
                            <Wallet className="size-5"/>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Monthly Income</p>
                            <p className="font-semibold">₹{result.monthlyIncome.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-3 p-3 rounded-lg bg-background">
                        <div className="p-2 rounded-full bg-red-500/20 text-red-500">
                            <Banknote className="size-5"/>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Total Monthly EMI</p>
                            <p className="font-semibold">₹{result.monthlyEmi.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                </div>
                <div>
                    <p className="text-xs text-muted-foreground mb-1">Risk Levels: &lt;30% (Safe), 30-40% (Moderate), &gt;40% (High Risk)</p>
                    <Progress value={result.dtiRatio} className="h-2 [&>div]:bg-primary" />
                </div>
            </CardContent>
             <CardFooter className="flex-col items-start gap-2 pt-4">
                <p className="text-xs text-muted-foreground w-full text-center">This is not a financial advice. Please consult a financial advisor for personalised guidance.</p>
            </CardFooter>
        </Card>
    );
}
