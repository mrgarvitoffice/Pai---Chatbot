"use client";

import type { ReverseSipResult } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Target, TrendingUp, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

interface ReverseSipResultCardProps {
    result: ReverseSipResult;
    explanation: string;
}

export function ReverseSipResultCard({ result, explanation }: ReverseSipResultCardProps) {
    return (
        <Card className="bg-background/50 border-0 shadow-none">
            <CardHeader className="text-center">
                <CardDescription>Required Monthly SIP</CardDescription>
                <CardTitle className="text-3xl text-primary">₹{result.monthly_investment.toLocaleString('en-IN')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 text-sm">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-background">
                        <div className="p-2 rounded-md bg-secondary">
                            <Target className="size-5 text-secondary-foreground"/>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Your Goal</p>
                            <p className="font-semibold">₹{result.future_value.toLocaleString('en-IN')} in {result.years} years</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                     <div className="flex items-start gap-3 p-3 rounded-lg bg-background">
                        <div className="p-2 rounded-md bg-secondary">
                            <Wallet className="size-5 text-secondary-foreground"/>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Total Invested</p>
                            <p className="font-semibold">₹{result.total_invested.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-3 p-3 rounded-lg bg-background">
                        <div className="p-2 rounded-md bg-secondary">
                            <TrendingUp className="size-5 text-secondary-foreground"/>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Est. Gains</p>
                            <p className="font-semibold">₹{result.total_gain.toLocaleString('en-IN')}</p>
                        </div>
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
