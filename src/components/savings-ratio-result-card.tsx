"use client";

import type { SavingsRatioResult } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
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
        <Card className="bg-background/50 border-0 shadow-none">
            <CardHeader className="text-center">
                <CardDescription>Your Savings Ratio</CardDescription>
                <CardTitle className="text-3xl text-primary">{result.savingsRatio}%</CardTitle>
                <p className={`text-sm font-semibold ${benchmark.color}`}>{benchmark.label}</p>
            </CardHeader>
            <CardContent className="space-y-4">
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
                </div>
            </CardContent>
             <CardFooter className="flex-col items-start gap-2 pt-4">
                <p className="text-xs text-muted-foreground">This is not a financial advice. Please consult a financial advisor for personalised guidance.</p>
            </CardFooter>
        </Card>
    );
}
