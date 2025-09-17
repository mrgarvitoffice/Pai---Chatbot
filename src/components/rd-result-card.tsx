"use client";

import type { RdCalculationResult } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TrendingUp, Wallet } from "lucide-react";

interface RdResultCardProps {
    result: RdCalculationResult;
    explanation: string;
}

export function RdResultCard({ result, explanation }: RdResultCardProps) {
    return (
        <div className="p-4 bg-background/50 rounded-b-2xl rounded-tr-2xl space-y-4">
            <div className="text-center p-4 rounded-xl bg-background">
                <p className="text-sm text-muted-foreground">Maturity Value</p>
                <p className="font-semibold text-3xl text-primary">₹{result.future_value.toLocaleString('en-IN')}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-background">
                    <div className="p-2 rounded-md bg-secondary">
                        <Wallet className="size-5 text-secondary-foreground"/>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Total Deposited</p>
                        <p className="font-semibold">₹{result.total_deposited.toLocaleString('en-IN')}</p>
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

            <div className="py-2 whitespace-pre-wrap text-sm text-muted-foreground">
                <p>{explanation}</p>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-t">
                <AccordionTrigger className="font-code text-sm">Assumptions</AccordionTrigger>
                <AccordionContent>
                    <div className="space-y-2 text-sm font-code text-muted-foreground">
                        <div className="flex justify-between">
                            <span>Monthly Deposit</span>
                            <span>₹{result.monthly_deposit.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Investment Period</span>
                            <span>{result.months} Months</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Interest Rate (p.a.)</span>
                            <span>{result.annual_rate}%</span>
                        </div>
                    </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
        </div>
    );
}
