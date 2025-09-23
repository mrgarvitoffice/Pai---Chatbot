"use client";

import type { SavingsRatioResult } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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
        <div className="p-4 bg-background/50 rounded-b-2xl rounded-tr-2xl space-y-4">
            <div className="text-center p-4 rounded-xl bg-background">
                <p className="text-sm text-muted-foreground">Your Savings Ratio</p>
                <p className="font-semibold text-3xl text-primary">{result.savingsRatio}%</p>
                <p className={`text-sm font-semibold ${benchmark.color}`}>{benchmark.label}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="p-3 rounded-lg bg-background">
                    <p className="text-muted-foreground">Monthly Income</p>
                    <p className="font-semibold">₹{result.monthlyIncome.toLocaleString('en-IN')}</p>
                </div>
                 <div className="p-3 rounded-lg bg-background">
                    <p className="text-muted-foreground">Monthly Savings</p>
                    <p className="font-semibold">₹{result.monthlySavings.toLocaleString('en-IN')}</p>
                </div>
            </div>

            <div>
                <p className="text-xs text-muted-foreground mb-1">Benchmark: 20% is considered healthy.</p>
                <Progress value={result.savingsRatio} className="h-2" />
            </div>

            <div className="py-2 whitespace-pre-wrap text-sm text-muted-foreground prose prose-sm dark:prose-invert max-w-none">
                <p>{explanation}</p>
                 <p className="mt-4 text-xs">This is not a financial advice. Please consult a financial advisor for personalised guidance.</p>
            </div>
        </div>
    );
}
