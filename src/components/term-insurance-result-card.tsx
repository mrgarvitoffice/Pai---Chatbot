"use client";

import type { TermInsuranceResult } from "@/lib/types";
import { Wallet } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

interface TermInsuranceResultCardProps {
    result: TermInsuranceResult;
    explanation: string;
}

export function TermInsuranceResultCard({ result, explanation }: TermInsuranceResultCardProps) {
    return (
        <Card className="bg-background/50 border-0 shadow-none">
            <CardHeader className="text-center pb-4">
                <CardDescription>Recommended Term Insurance Cover</CardDescription>
                <CardTitle className="text-3xl font-bold text-primary">₹{result.recommendedCover.toLocaleString('en-IN')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 text-sm">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-background">
                        <div className="p-2 rounded-md bg-secondary">
                            <Wallet className="size-5 text-secondary-foreground"/>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Based on Annual Income</p>
                            <p className="font-semibold">₹{result.annualIncome.toLocaleString('en-IN')}</p>
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
