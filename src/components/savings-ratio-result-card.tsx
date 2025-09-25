"use client";

import type { SavingsRatioResult } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Wallet, PiggyBank } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface SavingsRatioResultCardProps {
    result: SavingsRatioResult;
    explanation: string;
}

export function SavingsRatioResultCard({ result, explanation }: SavingsRatioResultCardProps) {
    const getBenchmark = (ratio: number) => {
        if (ratio < 10) return { label: "Needs Improvement", color: "text-red-500" };
        if (ratio < 20) return { label: "Good Start", color: "text-yellow-500" };
        return { label: "Healthy", color: "text-green-500" };
    }
    const benchmark = getBenchmark(result.savingsRatio);

    return (
        <Card className="bg-background/50 border-0 shadow-none">
            <CardHeader className="text-center pb-4">
                 <CardTitle className="text-xl font-semibold mb-2">🐖 Savings Ratio</CardTitle>
                <CardDescription>Your Savings Ratio</CardDescription>
                <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-400 dark:to-teal-300 py-1">
                    {result.savingsRatio}%
                </p>
                <p className={`text-sm font-semibold ${benchmark.color}`}>{benchmark.label}</p>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-background border shadow-inner">
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 text-foreground/90">
                         <ReactMarkdown>{explanation}</ReactMarkdown>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-background">
                        <div className="p-2 rounded-full bg-secondary/20 text-secondary">
                            <Wallet className="size-5"/>
                        </div>
                        <div>
                             <p className="text-muted-foreground">Monthly Income</p>
                            <p className="font-semibold text-blue-600 dark:text-blue-400">🔵 ₹{result.monthlyIncome.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-3 p-3 rounded-lg bg-background">
                         <div className="p-2 rounded-full bg-green-500/20 text-green-500">
                            <PiggyBank className="size-5"/>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Monthly Savings</p>
                            <p className="font-semibold text-green-600 dark:text-green-400">🟢 ₹{result.monthlySavings.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                </div>
                <div>
                    <p className="text-xs text-muted-foreground mb-1">Benchmark: 20% is considered healthy.</p>
                    <Progress value={result.savingsRatio} className="h-2" />
                </div>
            </CardContent>
             <CardFooter className="flex-col items-start gap-2 pt-4">
                <p className="text-xs text-muted-foreground w-full text-center">This is not a financial advice. Please consult a financial advisor for personalised guidance.</p>
            </CardFooter>
        </Card>
    );
}
