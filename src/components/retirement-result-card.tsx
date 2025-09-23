"use client";

import type { RetirementCorpusResult } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Wallet, PiggyBank } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

interface RetirementResultCardProps {
    result: RetirementCorpusResult;
    explanation: string;
}

export function RetirementResultCard({ result, explanation }: RetirementResultCardProps) {
    const { assumptions } = result;
    const monthlyIncomeFromCorpus = (result.requiredCorpus * (assumptions.postRetirementReturn / 100)) / 12;

    return (
        <Card className="bg-background/50 border-0 shadow-none">
            <CardHeader className="text-center pb-4">
                <CardDescription>Required Retirement Corpus</CardDescription>
                <CardTitle className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-400 dark:to-pink-500 py-1">
                    ₹{result.requiredCorpus.toLocaleString('en-IN')}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-background border shadow-inner">
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 text-foreground/90">
                         <ReactMarkdown>{explanation}</ReactMarkdown>
                    </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-background text-sm">
                    <div className="p-2 rounded-full bg-green-500/20 text-green-500">
                        <PiggyBank className="size-5"/>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Est. Monthly Income from Corpus</p>
                        <p className="font-semibold">₹{monthlyIncomeFromCorpus.toLocaleString('en-IN')} / month</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 pt-4">
                <p className="text-xs text-muted-foreground w-full text-center">This is not a financial advice. Please consult a financial advisor for personalised guidance.</p>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-t">
                    <AccordionTrigger className="font-code text-xs">How we calculated this</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2 text-xs font-code text-muted-foreground">
                            <div className="flex justify-between">
                                <span>Current Age</span>
                                <span>{assumptions.currentAge} Years</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Retirement Age</span>
                                <span>{assumptions.retirementAge} Years</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Monthly Expenses</span>
                                <span>₹{assumptions.monthlyExpenses.toLocaleString('en-IN')}</span>
                            </div>
                             <div className="flex justify-between">
                                <span>Inflation Rate</span>
                                <span>{assumptions.inflationRate}%</span>
                            </div>
                             <div className="flex justify-between">
                                <span>Life Expectancy</span>
                                <span>{assumptions.lifeExpectancy} Years</span>
                            </div>
                             <div className="flex justify-between">
                                <span>Pre-Retirement Return</span>
                                <span>{assumptions.preRetirementReturn}% p.a.</span>
                            </div>
                             <div className="flex justify-between">
                                <span>Post-Retirement Return</span>
                                <span>{assumptions.postRetirementReturn}% p.a.</span>
                            </div>
                        </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
            </CardFooter>
        </Card>
    );
}
