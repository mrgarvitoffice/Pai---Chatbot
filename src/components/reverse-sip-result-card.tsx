"use client";

import type { ReverseSipResult } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Target, TrendingUp, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

interface ReverseSipResultCardProps {
    result: ReverseSipResult;
    explanation: string;
}

export function ReverseSipResultCard({ result, explanation }: ReverseSipResultCardProps) {
    return (
        <Card className="bg-background/50 border-0 shadow-none">
            <CardHeader className="text-center pb-4">
                <CardDescription>Required Monthly SIP</CardDescription>
                <CardTitle className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-400 dark:to-pink-500 py-1">
                    ₹{result.monthly_investment.toLocaleString('en-IN')}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-background border shadow-inner">
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 text-foreground/90">
                         <ReactMarkdown>{explanation}</ReactMarkdown>
                    </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-background text-sm">
                    <div className="p-2 rounded-full bg-secondary/20 text-secondary">
                        <Target className="size-5"/>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Your Goal</p>
                        <p className="font-semibold">₹{result.future_value.toLocaleString('en-IN')} in {result.years} years</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                     <div className="flex items-start gap-3 p-3 rounded-lg bg-background">
                        <div className="p-2 rounded-full bg-secondary/20 text-secondary">
                            <Wallet className="size-5"/>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Total Invested</p>
                            <p className="font-semibold">₹{result.total_invested.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-3 p-3 rounded-lg bg-background">
                        <div className="p-2 rounded-full bg-green-500/20 text-green-500">
                            <TrendingUp className="size-5"/>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Est. Gains</p>
                            <p className="font-semibold">₹{result.total_gain.toLocaleString('en-IN')}</p>
                        </div>
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
                                <span>Target Amount</span>
                                <span>₹{result.future_value.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Investment Period</span>
                                <span>{result.years} Years</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Expected Return (p.a.)</span>
                                <span>{result.annual_rate}%</span>
                            </div>
                        </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
            </CardFooter>
        </Card>
    );
}
