"use client";

import type { TaxCalculationResult, TaxComparisonResult } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

interface TaxResultCardProps {
    result?: TaxCalculationResult;
    comparisonResult?: TaxComparisonResult;
    explanation: string;
}

export function TaxResultCard({ result, comparisonResult, explanation }: TaxResultCardProps) {
    if (comparisonResult) {
        return <TaxComparisonCard result={comparisonResult} explanation={explanation} />;
    }

    if (!result) return null;

    return (
        <div className="p-4 bg-transparent rounded-b-2xl rounded-tr-2xl">
            <div className="p-4 rounded-xl bg-background/50">
                <div className="whitespace-pre-wrap text-sm text-foreground">{explanation}</div>
            </div>
            
            <Accordion type="single" collapsible className="w-full mt-2">
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


function TaxComparisonCard({ result, explanation }: { result: TaxComparisonResult, explanation: string }) {
    const { new: newRegime, old: oldRegime } = result;
    
    return (
         <div className="p-4 bg-transparent rounded-b-2xl rounded-tr-2xl">
            <div className="p-4 rounded-xl bg-background/50">
                <div className="whitespace-pre-wrap text-sm text-foreground">{explanation}</div>
            </div>
        </div>
    );
}
