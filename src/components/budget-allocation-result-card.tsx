"use client";

import type { BudgetAllocationResult } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PiggyBank, HandCoins, Building } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

interface BudgetAllocationResultCardProps {
    result: BudgetAllocationResult;
    explanation: string;
}

export function BudgetAllocationResultCard({ result, explanation }: BudgetAllocationResultCardProps) {
    return (
        <Card className="bg-background/50 border-0 shadow-none">
            <CardHeader className="text-center">
                <CardDescription>Monthly Income</CardDescription>
                <CardTitle className="text-3xl text-primary">₹{result.monthlyIncome.toLocaleString('en-IN')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg bg-background">
                        <div className="p-2 rounded-md bg-secondary flex items-center gap-2">
                            <Building className="size-5 text-secondary-foreground"/>
                            <span className="font-semibold">{result.split.needsPct}% Needs</span>
                        </div>
                        <p className="font-semibold text-lg">₹{result.needs.toLocaleString('en-IN')}</p>
                    </div>
                     <div className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg bg-background">
                        <div className="p-2 rounded-md bg-secondary flex items-center gap-2">
                            <HandCoins className="size-5 text-secondary-foreground"/>
                            <span className="font-semibold">{result.split.wantsPct}% Wants</span>
                        </div>
                        <p className="font-semibold text-lg">₹{result.wants.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg bg-background">
                        <div className="p-2 rounded-md bg-secondary flex items-center gap-2">
                            <PiggyBank className="size-5 text-secondary-foreground"/>
                            <span className="font-semibold">{result.split.savingsPct}% Savings</span>
                        </div>
                        <p className="font-semibold text-lg">₹{result.savings.toLocaleString('en-IN')}</p>
                    </div>
                </div>

                <div className="py-2 whitespace-pre-wrap text-sm text-muted-foreground prose prose-sm dark:prose-invert max-w-none">
                    <p>{explanation}</p>
                </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 pt-4">
                 <p className="text-xs text-muted-foreground">This is not a financial advice. Please consult a financial advisor for personalised guidance.</p>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-t">
                    <AccordionTrigger className="font-code text-xs">How we calculated this</AccordionTrigger>
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
