"use client";

import type { DtiResult } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

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
                <CardTitle className="text-3xl font-bold text-primary">{result.dtiRatio}%</CardTitle>
                <p className={`text-sm font-semibold ${risk.color}`}>{risk.label}</p>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="p-3 rounded-lg bg-background">
                        <p className="text-muted-foreground">Monthly Income</p>
                        <p className="font-semibold">₹{result.monthlyIncome.toLocaleString('en-IN')}</p>
                    </div>
                     <div className="p-3 rounded-lg bg-background">
                        <p className="text-muted-foreground">Total Monthly EMI</p>
                        <p className="font-semibold">₹{result.monthlyEmi.toLocaleString('en-IN')}</p>
                    </div>
                </div>

                <div>
                    <p className="text-xs text-muted-foreground mb-1">Risk Levels: &lt;30% (Safe), 30-40% (Moderate), &gt;40% (High Risk)</p>
                    <Progress value={result.dtiRatio} className="h-2 [&>div]:bg-primary" />
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
