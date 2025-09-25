"use client";

import type { EmiCalculationResult } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HandCoins, Banknote, Landmark } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

interface EmiResultCardProps {
    id: string;
    result: EmiCalculationResult;
    explanation: string;
}

export function EmiResultCard({ id, result, explanation }: EmiResultCardProps) {
    return (
        <Card id={id} className="bg-card/50 border border-border/30 shadow-lg">
            <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-semibold mb-2">🧾 Loan EMI Calculation</CardTitle>
                <CardDescription>Monthly EMI</CardDescription>
                <div className="p-4 mt-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-foreground text-center">
                     <p className="text-3xl font-extrabold">₹{result.emi.toLocaleString('en-IN')}</p>
                </div>
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
                            <p className="text-muted-foreground">Loan Amount</p>
                            <p className="font-semibold text-blue-400">🔵 ₹{result.principal.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                        <div className="p-2 rounded-full bg-red-500/10 text-red-400">
                            <Banknote className="size-5"/>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Total Interest</p>
                            <p className="font-semibold text-red-400">🔴 ₹{result.total_interest.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 col-span-1 md:col-span-2">
                        <div className="p-2 rounded-full bg-purple-500/10 text-purple-400">
                            <HandCoins className="size-5"/>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Total Payment (Principal + Interest)</p>
                            <p className="font-semibold">₹{result.total_payment.toLocaleString('en-IN')}</p>
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
