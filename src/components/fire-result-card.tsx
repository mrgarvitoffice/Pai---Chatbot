"use client";

import type { FireCalculationResult } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Flame, Target, TrendingUp, Wallet, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

interface FireResultCardProps {
    result: FireCalculationResult;
    explanation: string;
}

export function FireResultCard({ result, explanation }: FireResultCardProps) {
    return (
        <Card className="bg-background/50 border-0 shadow-none">
            <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-semibold mb-2 flex items-center justify-center gap-2">
                    <Flame className="text-orange-500"/>
                    FIRE Projection
                </CardTitle>
                <CardDescription>Financial Independence, Retire Early</CardDescription>
                {result.canRetire ? (
                     <p className="text-2xl font-bold text-green-500 flex items-center justify-center gap-2 pt-2">
                        <CheckCircle2 /> On Track to FIRE!
                    </p>
                ) : (
                    <p className="text-2xl font-bold text-destructive flex items-center justify-center gap-2 pt-2">
                        <XCircle /> Goal Not Met
                    </p>
                )}
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-background border shadow-inner">
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 text-foreground/90">
                         <ReactMarkdown>{explanation}</ReactMarkdown>
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-background">
                        <div className="p-2 rounded-full bg-red-500/20 text-red-500">
                            <Target className="size-5"/>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Target Corpus</p>
                            <p className="font-semibold text-red-600 dark:text-red-400">🔴 ₹{result.targetCorpus.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-3 p-3 rounded-lg bg-background">
                        <div className="p-2 rounded-full bg-green-500/20 text-green-500">
                            <TrendingUp className="size-5"/>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Projected Corpus</p>
                            <p className="font-semibold text-green-600 dark:text-green-400">
                               🟢 ₹{result.projectedCorpus.toLocaleString('en-IN')}
                            </p>
                        </div>
                    </div>
                </div>
                 {!result.canRetire && (
                    <div className="text-center p-3 bg-background rounded-lg">
                        <p className="text-sm text-muted-foreground">Estimated years to reach your goal with current investment:</p>
                        <p className="font-bold text-lg text-primary">{result.yearsToGoal.toFixed(1)} years</p>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 pt-4">
                 <p className="text-xs text-muted-foreground w-full text-center">This is a projection, not financial advice. Consult a financial advisor for personalised guidance.</p>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-t">
                    <AccordionTrigger className="font-code text-xs">How we calculated this</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2 text-xs font-code text-muted-foreground">
                             <div className="flex justify-between">
                                <span>Current Age</span>
                                <span>{result.currentAge}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Target Retirement Age</span>
                                <span>{result.retirementAge}</span>
                            </div>
                             <div className="flex justify-between">
                                <span>Monthly Expenses</span>
                                <span>₹{result.monthlyExpenses.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Monthly Investment</span>
                                <span>₹{result.monthlyInvestment.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Expected Return (p.a.)</span>
                                <span>{result.expectedReturn}%</span>
                            </div>
                             <div className="border-t pt-2 mt-2 flex justify-between font-semibold text-foreground">
                                <span>Target Corpus</span>
                                <span>₹{result.targetCorpus.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
            </CardFooter>
        </Card>
    );
}
