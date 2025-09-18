"use client";

import type { RetirementCorpusResult } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Target, TrendingUp, Wallet } from "lucide-react";

interface RetirementResultCardProps {
    result: RetirementCorpusResult;
    explanation: string;
}

export function RetirementResultCard({ result, explanation }: RetirementResultCardProps) {
    const { assumptions } = result;
    const monthlyIncomeFromCorpus = (result.requiredCorpus * (assumptions.postRetirementReturn / 100)) / 12;

    return (
        <div className="p-4 bg-background/50 rounded-b-2xl rounded-tr-2xl space-y-4">
            <div className="text-center p-4 rounded-xl bg-background">
                <p className="text-sm text-muted-foreground">Required Retirement Corpus</p>
                <p className="font-semibold text-3xl text-primary">₹{result.requiredCorpus.toLocaleString('en-IN')}</p>
            </div>
            
            <div className="grid grid-cols-1 gap-4 text-sm">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-background">
                    <div className="p-2 rounded-md bg-secondary">
                        <Wallet className="size-5 text-secondary-foreground"/>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Est. Monthly Income from Corpus</p>
                        <p className="font-semibold">₹{monthlyIncomeFromCorpus.toLocaleString('en-IN')} / month</p>
                    </div>
                </div>
            </div>

            <div className="py-2 whitespace-pre-wrap text-sm text-muted-foreground">
                <p>{explanation}</p>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-t">
                <AccordionTrigger className="font-code text-sm">Assumptions</AccordionTrigger>
                <AccordionContent>
                    <div className="space-y-2 text-sm font-code text-muted-foreground">
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
        </div>
    );
}
