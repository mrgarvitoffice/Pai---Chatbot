"use client";

import type { TaxCalculationResult, TaxComparisonResult } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import ReactMarkdown from "react-markdown";

interface TaxResultCardProps {
    result?: TaxCalculationResult;
    comparisonResult?: TaxComparisonResult;
    explanation: string;
}

const getTaxSlabs = (regime: 'new' | 'old') => {
    // Note: These slabs are for FY 2024-25. The calculator logic is currently
    // simplified and uses these for any future year as well.
    if (regime === 'new') {
        return [
            "₹0 – ₹3L → Nil",
            "₹3L – ₹6L → 5%",
            "₹6L – ₹9L → 10%",
            "₹9L – ₹12L → 15%",
            "₹12L – ₹15L → 20%",
            "Above ₹15L → 30%",
        ];
    }
    return [
        "₹0 – ₹2.5L → Nil",
        "₹2.5L – ₹5L → 5%",
        "₹5L – ₹10L → 20%",
        "Above ₹10L → 30%",
    ];
};

export function TaxResultCard({ result, comparisonResult, explanation }: TaxResultCardProps) {
    if (comparisonResult) {
        return <TaxComparisonCard result={comparisonResult} explanation={explanation} />;
    }

    if (!result) return null;
    const { income, fy, regime, taxable_income, total_tax, tax_breakdown } = result;
    const taxSlabs = getTaxSlabs(regime);

    return (
        <div className="p-4 bg-background/50 rounded-b-2xl rounded-tr-2xl space-y-4">
            <div className="p-4 rounded-xl bg-background space-y-4">
                <div className="text-center">
                     <p className="text-sm text-muted-foreground">Total Tax Payable (FY {fy})</p>
                     <p className="font-semibold text-3xl text-primary">₹{total_tax.toLocaleString('en-IN')}</p>
                </div>
                
                <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-headings:my-3 prose-ul:my-2">
                     <ReactMarkdown>{explanation}</ReactMarkdown>
                </div>
                 <div className="text-sm">
                        <p className="font-semibold">🧾 Tax Slabs ({regime} Regime):</p>
                        <ul className="list-disc pl-5 mt-1 text-muted-foreground">
                            {taxSlabs.map(slab => <li key={slab}>{slab}</li>)}
                        </ul>
                 </div>
                 <Separator className="my-3"/>
                 <p className="text-xs text-muted-foreground">This is not a financial advice. Please consult a tax professional for personalised guidance.</p>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-t">
                <AccordionTrigger className="font-code text-sm">How we calculated this</AccordionTrigger>
                <AccordionContent>
                    <div className="space-y-2 text-sm font-code text-muted-foreground">
                        {Object.entries(tax_breakdown).map(([key, value]) => (
                             <div key={key} className="flex justify-between">
                                <span>{key}</span>
                                <span>{value < 0 ? '-' : ''}₹{Math.abs(value).toLocaleString('en-IN')}</span>
                            </div>
                        ))}
                        <Separator />
                         <div className="flex justify-between font-semibold text-foreground">
                            <span>Total Tax</span>
                            <span>₹{total_tax.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
        </div>
    );
}


function TaxComparisonCard({ result, explanation }: { result: TaxComparisonResult, explanation: string }) {
    return (
         <div className="p-4 bg-background/50 rounded-b-2xl rounded-tr-2xl">
            <div className="p-4 rounded-xl bg-background">
                 <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-headings:my-3 prose-ul:my-2">
                    <ReactMarkdown>{explanation}</ReactMarkdown>
                </div>
                 <p className="mt-4 text-xs text-muted-foreground">This is not a financial advice. Please consult a tax professional for personalised guidance.</p>
            </div>
        </div>
    );
}
