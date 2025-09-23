"use client";

import type { TermInsuranceResult } from "@/lib/types";
import { ShieldCheck, TrendingUp, Wallet } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface TermInsuranceResultCardProps {
    result: TermInsuranceResult;
    explanation: string;
}

export function TermInsuranceResultCard({ result, explanation }: TermInsuranceResultCardProps) {
    return (
        <div className="p-4 bg-background/50 rounded-b-2xl rounded-tr-2xl space-y-4">
            <div className="text-center p-4 rounded-xl bg-background">
                <p className="text-sm text-muted-foreground">Recommended Term Insurance Cover</p>
                <p className="font-semibold text-3xl text-primary">₹{result.recommendedCover.toLocaleString('en-IN')}</p>
            </div>
            
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
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-t">
                <AccordionTrigger className="font-code text-sm">How is this calculated?</AccordionTrigger>
                <AccordionContent>
                    <p className="text-sm font-code text-muted-foreground">
                        This is a general guideline suggesting a life cover of 10-15 times your annual income. It ensures your family can maintain their lifestyle and meet future goals. It's recommended to add any outstanding loans (like a home loan) to this amount for complete protection.
                    </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
        </div>
    );
}
