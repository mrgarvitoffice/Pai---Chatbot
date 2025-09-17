"use client";

import type { TaxCalculationResult } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TrendingUp } from "lucide-react";

interface TaxResultCardProps {
    result: TaxCalculationResult;
    explanation: string;
}

export function TaxResultCard({ result, explanation }: TaxResultCardProps) {
    return (
        <div className="p-4 bg-background/50 rounded-b-2xl rounded-tr-2xl">
            <div className="grid grid-cols-2 gap-4 text-center p-4 rounded-xl bg-background">
                <div>
                    <p className="text-sm text-muted-foreground">Total Tax</p>
                    <p className="font-semibold text-2xl text-primary">₹{result.total_tax.toLocaleString('en-IN')}</p>
                </div>
                 <div>
                    <p className="text-sm text-muted-foreground">Taxable Income</p>
                    <p className="font-semibold text-2xl">₹{result.taxable_income.toLocaleString('en-IN')}</p>
                </div>
            </div>

            <div className="py-4 whitespace-pre-wrap text-sm">
                <p className="text-muted-foreground mb-2">Based on the information you provided for <span className="font-semibold text-foreground">Fiscal Year {result.fy}</span> under the <span className="font-semibold text-foreground">{result.regime} regime</span>, here is your tax breakdown:</p>
                <div className="whitespace-pre-wrap">{explanation}</div>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-t">
                <AccordionTrigger className="font-code text-sm">How we calculated this</AccordionTrigger>
                <AccordionContent>
                    <div className="space-y-2 text-sm font-code text-muted-foreground">
                        {Object.entries(result.tax_breakdown).map(([key, value]) => (
                             <div key={key} className="flex justify-between">
                                <span>{key}</span>
                                <span>{value < 0 ? '-' : ''}₹{Math.abs(value).toLocaleString('en-IN')}</span>
                            </div>
                        ))}
                        <Separator />
                         <div className="flex justify-between font-semibold text-foreground">
                            <span>Total Tax</span>
                            <span>₹{result.total_tax.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
        </div>
    );
}
