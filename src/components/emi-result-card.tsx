"use client";

import type { EmiCalculationResult } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PiggyBank, HandCoins } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

interface EmiResultCardProps {
    result: EmiCalculationResult;
    explanation: string;
}

export function EmiResultCard({ result, explanation }: EmiResultCardProps) {
    return (
        <Card className="bg-background/50 border-0 shadow-none">
            <CardHeader className="text-center pb-4">
                <CardDescription>Monthly EMI</CardDescription>
                <CardTitle className="text-3xl font-bold text-primary">₹{result.emi.toLocaleString('en-IN')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-background">
                        <div className="p-2 rounded-md bg-secondary">
                            <PiggyBank className="size-5 text-secondary-foreground"/>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Total Interest</p>
                            <p className="font-semibold">₹{result.total_interest.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-3 p-3 rounded-lg bg-background">
                        <div className="p-2 rounded-md bg-secondary">
                            <HandCoins className="size-5 text-secondary-foreground"/>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Total Payment</p>
                            <p className="font-semibold">₹{result.total_payment.toLocaleString('en-IN')}</p>
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
                                <span>Loan Amount</span>
                                <span>₹{result.principal.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Loan Tenure</span>
                                <span>{result.years} Years</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Interest Rate (p.a.)</span>
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
