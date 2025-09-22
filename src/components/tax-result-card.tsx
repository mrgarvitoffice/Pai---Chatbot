"use client";

import type { TaxCalculationResult, TaxComparisonResult } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

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
                
                <div className="text-sm font-sans">
                     <p className="whitespace-pre-wrap">{explanation}</p>
                     <div className="mt-2">
                        <p>🧾 <span className="font-semibold">Tax Slabs ({regime} Regime):</span></p>
                        <ul className="list-disc pl-8 mt-1 text-muted-foreground">
                            {taxSlabs.map(slab => <li key={slab}>{slab}</li>)}
                        </ul>
                     </div>
                     <Separator className="my-3"/>
                     <p className="text-xs text-muted-foreground">⚠️ Note: This is an illustrative calculation. For personalized advice, please consult a tax professional.</p>
                </div>

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
                <div className="whitespace-pre-wrap text-sm text-foreground">{explanation}</div>
            </div>
        </div>
    );
}
