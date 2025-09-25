
"use client";

import type { CompoundInterestResult } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TrendingUp, Landmark } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

interface CompoundInterestResultCardProps {
    id: string;
    result: CompoundInterestResult;
    explanation: string;
}

export function CompoundInterestResultCard({ id, result, explanation }: CompoundInterestResultCardProps) {
    const getFrequencyText = (freq: number) => {
        if (freq === 1) return 'Annually';
        if (freq === 4) return 'Quarterly';
        if (freq === 12) return 'Monthly';
        return `${freq} times a year`;
    }

    return (
        <Card id={id} className="bg-card/50 border border-border/30 shadow-lg">
            <CardHeader className="text-center pb-4">
                 <CardTitle className="text-xl font-semibold mb-2">💹 Investment Growth Calculation</CardTitle>
                <CardDescription>Maturity Value</CardDescription>
                <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary py-1">
                    ₹{result.future_value.toLocaleString('en-IN')}
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="p-4 rounded-xl bg-background/50 border border-border/20 shadow-inner">
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 text-foreground/90">
                         <ReactMarkdown>{explanation}</ReactMarkdown>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                        <div className="p-2 rounded-full bg-blue-500/10 text-blue-400">
                            <Landmark className="size-5"/>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Principal</p>
                            <p className="font-semibold text-blue-400">🔵 ₹{result.principal.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                        <div className="p-2 rounded-full bg-green-500/10 text-green-400">
                            <TrendingUp className="size-5"/>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Total Interest</p>
                            <p className="font-semibold text-green-400">
                                +₹{result.total_interest.toLocaleString('en-IN')} (🟢 Gain)
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 pt-4 border-t border-border/30">
                 <p className="text-xs text-muted-foreground w-full text-center">This is not financial advice. Please consult a financial advisor for personalised guidance.</p>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-b-0">
                    <AccordionTrigger className="font-code text-xs pt-2">How we calculated this</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2 text-xs font-code text-muted-foreground">
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
                             <div className="border-t border-border/30 pt-2 mt-2 flex justify-between font-semibold text-foreground">
                                <span>✨ Final Value</span>
                                <span>₹{result.future_value.toLocaleString('en-IN')} ✅</span>
                            </div>
                        </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
            </CardFooter>
        </Card>
    );
}
