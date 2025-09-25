"use client";

import type { BudgetAllocationResult } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PiggyBank, HandCoins, Building } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

interface BudgetAllocationResultCardProps {
    result: BudgetAllocationResult;
    explanation: string;
}

export function BudgetAllocationResultCard({ result, explanation }: BudgetAllocationResultCardProps) {
    return (
        <Card className="bg-background/50 border-0 shadow-none">
            <CardHeader className="text-center pb-4">
                 <CardTitle className="text-xl font-semibold mb-2">💰 Budget Allocation</CardTitle>
                <CardDescription>Suggested split for a monthly income of</CardDescription>
                <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-400 dark:to-teal-300 py-1">
                    ₹{result.monthlyIncome.toLocaleString('en-IN')}
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-background border shadow-inner">
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 text-foreground/90">
                         <ReactMarkdown>{explanation}</ReactMarkdown>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-background">
                        <div className="p-2 rounded-full bg-red-500/20 text-red-500">
                            <Building className="size-5"/>
                        </div>
                        <div>
                            <p className="text-muted-foreground">{result.split.needsPct}% Needs</p>
                            <p className="font-semibold text-red-600 dark:text-red-400">🔴 ₹{result.needs.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-3 p-3 rounded-lg bg-background">
                        <div className="p-2 rounded-full bg-secondary/20 text-secondary">
                            <HandCoins className="size-5"/>
                        </div>
                        <div>
                             <p className="text-muted-foreground">{result.split.wantsPct}% Wants</p>
                            <p className="font-semibold text-blue-600 dark:text-blue-400">🔵 ₹{result.wants.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-background">
                        <div className="p-2 rounded-full bg-green-500/20 text-green-500">
                            <PiggyBank className="size-5"/>
                        </div>
                        <div>
                           <p className="text-muted-foreground">{result.split.savingsPct}% Savings</p>
                           <p className="font-semibold text-green-600 dark:text-green-400">🟢 ₹{result.savings.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 pt-4">
                 <p className="text-xs text-muted-foreground w-full text-center">This is not financial advice. Please consult a financial advisor for personalised guidance.</p>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-t">
                    <AccordionTrigger className="font-code text-xs">What is the 50/30/20 Rule?</AccordionTrigger>
                    <AccordionContent>
                        <p className="text-xs font-code text-muted-foreground">
                            The 50/30/20 rule is a simple budgeting guideline. It suggests allocating 50% of your after-tax income to 'Needs' (essentials like rent, groceries), 30% to 'Wants' (lifestyle expenses like dining out), and 20% to 'Savings' (investments, debt repayment).
                        </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
            </CardFooter>
        </Card>
    );
}
