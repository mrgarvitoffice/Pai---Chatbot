"use client";

import type { TermInsuranceResult } from "@/lib/types";
import { Wallet, ShieldCheck } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

interface TermInsuranceResultCardProps {
    result: TermInsuranceResult;
    explanation: string;
}

export function TermInsuranceResultCard({ result, explanation }: TermInsuranceResultCardProps) {
    return (
        <Card className="bg-background/50 border-0 shadow-none">
            <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-semibold mb-2">🛡️ Term Insurance Cover</CardTitle>
                <CardDescription>Recommended Life Cover</CardDescription>
                <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-400 dark:to-teal-300 py-1">
                    ₹{result.recommendedCover.toLocaleString('en-IN')}
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-background border shadow-inner">
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 text-foreground/90">
                         <ReactMarkdown>{explanation}</ReactMarkdown>
                    </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-background text-sm">
                    <div className="p-2 rounded-full bg-secondary/20 text-secondary">
                        <Wallet className="size-5"/>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Based on Annual Income</p>
                        <p className="font-semibold">₹{result.annualIncome.toLocaleString('en-IN')}</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 pt-4">
                <p className="text-xs text-muted-foreground w-full text-center">This is not a financial advice. Please consult a financial advisor for personalised guidance.</p>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-t">
                    <AccordionTrigger className="font-code text-xs">How we calculated this</AccordionTrigger>
                    <AccordionContent>
                        <p className="text-xs font-code text-muted-foreground">
                            This is a general guideline suggesting a life cover of 10-15 times your annual income. It ensures your family can maintain their lifestyle and meet future goals. It's recommended to add any outstanding loans (like a home loan) to this amount for complete protection.
                        </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
            </CardFooter>
        </Card>
    );
}
