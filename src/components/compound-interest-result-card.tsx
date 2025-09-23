"use client";

import type { CompoundInterestResult } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PiggyBank, TrendingUp } from "lucide-react";

interface CompoundInterestResultCardProps {
    result: CompoundInterestResult;
    explanation: string;
}

export function CompoundInterestResultCard({ result, explanation }: CompoundInterestResultCardProps) {
    const getFrequencyText = (freq: number) => {
        if (freq === 1) return 'Annually';
        if (freq === 4) return 'Quarterly';
        if (freq === 12) return 'Monthly';
        return `${freq} times a year`;
    }

    return (
        <div className="p-4 bg-background/50 rounded-b-2xl rounded-tr-2xl space-y-4">
            <div className="text-center p-4 rounded-xl bg-background">
                <p className="text-sm text-muted-foreground">Maturity Value</p>
                <p className="font-semibold text-3xl text-primary">₹{result.future_value.toLocaleString('en-IN')}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-background">
                    <div className="p-2 rounded-md bg-secondary">
                        <PiggyBank className="size-5 text-secondary-foreground"/>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Principal</p>
                        <p className="font-semibold">₹{result.principal.toLocaleString('en-IN')}</p>
                    </div>
                </div>
                 <div className="flex items-start gap-3 p-3 rounded-lg bg-background">
                    <div className="p-2 rounded-md bg-secondary">
                        <TrendingUp className="size-5 text-secondary-foreground"/>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Total Interest</p>
                        <p className="font-semibold">₹{result.total_interest.toLocaleString('en-IN')}</p>
                    </div>
                </div>
            </div>

            <div className="py-2 whitespace-pre-wrap text-sm text-muted-foreground prose prose-sm dark:prose-invert max-w-none">
                <p>{explanation}</p>
                 <p className="mt-4 text-xs">This is not a financial advice. Please consult a financial advisor for personalised guidance.</p>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-t">
                <AccordionTrigger className="font-code text-sm">How we calculated this</AccordionTrigger>
                <AccordionContent>
                    <div className="space-y-2 text-sm font-code text-muted-foreground">
                        <div className="flex justify-between">
                            <span>Principal Amount</span>
                            <span>₹{result.principal.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Investment Period</span>
                            <span>{result.years} Years</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Interest Rate (p.a.)</span>
                            <span>{result.annual_rate}%</span>
                        </div>
                         <div className="flex justify-between">
                            <span>Compounding</span>
                            <span>{getFrequencyText(result.compounding_frequency)}</span>
                        </div>
                    </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
        </div>
    );
}
