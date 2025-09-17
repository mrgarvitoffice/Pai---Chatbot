"use client";

import type { DtiResult } from "@/lib/types";
import { Progress } from "@/components/ui/progress";

interface DtiResultCardProps {
    result: DtiResult;
    explanation: string;
}

export function DtiResultCard({ result, explanation }: DtiResultCardProps) {
    const getRiskLevel = (ratio: number) => {
        if (ratio > 40) return { label: "High Risk", color: "text-red-500", progressColor: "bg-red-500" };
        if (ratio > 30) return { label: "Moderate", color: "text-yellow-500", progressColor: "bg-yellow-500" };
        return { label: "Safe", color: "text-green-500", progressColor: "bg-green-500" };
    }
    const risk = getRiskLevel(result.dtiRatio);

    return (
        <div className="p-4 bg-background/50 rounded-b-2xl rounded-tr-2xl space-y-4">
            <div className="text-center p-4 rounded-xl bg-background">
                <p className="text-sm text-muted-foreground">Debt-to-Income (DTI) Ratio</p>
                <p className="font-semibold text-3xl text-primary">{result.dtiRatio}%</p>
                <p className={`text-sm font-semibold ${risk.color}`}>{risk.label}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
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
                <p className="text-xs text-muted-foreground mb-1">Risk Levels: <30% (Safe), 30-40% (Moderate), >40% (High Risk)</p>
                <Progress value={result.dtiRatio} className="h-2 [&>div]:bg-primary" />
            </div>

            <div className="py-2 whitespace-pre-wrap text-sm text-muted-foreground">
                <p>{explanation}</p>
            </div>
        </div>
    );
}
