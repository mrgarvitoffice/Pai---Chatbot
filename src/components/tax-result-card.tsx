"use client";

import type { TaxCalculationResult, TaxComparisonResult } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TrendingUp } from "lucide-react";

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
        <div className="p-4 bg-background/50 rounded-b-2xl rounded-tr-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center p-4 rounded-xl bg-background">
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


function TaxComparisonCard({ result, explanation }: { result: TaxComparisonResult, explanation: string }) {
    const { new: newRegime, old: oldRegime } = result;
    const savings = oldRegime.total_tax - newRegime.total_tax;

    return (
        <div className="p-4 bg-background/50 rounded-b-2xl rounded-tr-2xl space-y-4">
            <div className="text-center">
                <p className="font-semibold text-lg">Tax Regime Comparison</p>
                <p className="text-sm text-muted-foreground">For Income of ₹{newRegime.income.toLocaleString('en-IN')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-background text-center">
                    <p className="font-semibold text-primary">New Regime</p>
                    <p className="text-xl font-bold">₹{newRegime.total_tax.toLocaleString('en-IN')}</p>
                </div>
                <div className="p-4 rounded-lg bg-background text-center">
                    <p className="font-semibold">Old Regime</p>
                    <p className="text-xl font-bold">₹{oldRegime.total_tax.toLocaleString('en-IN')}</p>
                </div>
            </div>
             <div className="text-center p-3 rounded-lg bg-green-500/10 text-green-500">
                {savings > 0 ? (
                    <p>Choosing the <span className="font-bold">New Regime</span> could save you <span className="font-bold">₹{savings.toLocaleString('en-IN')}</span>.</p>
                ) : (
                    <p>Choosing the <span className="font-bold">Old Regime</span> could save you <span className="font-bold">₹{Math.abs(savings).toLocaleString('en-IN')}</span>.</p>
                )}
                <p className="text-xs mt-1">(Assuming max deductions for Old Regime)</p>
            </div>
             <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-t">
                <AccordionTrigger className="font-code text-sm">View Details</AccordionTrigger>
                <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="font-semibold mb-2 text-center">New Regime</p>
                             <div className="space-y-1 text-xs font-code text-muted-foreground">
                                {Object.entries(newRegime.tax_breakdown).map(([key, value]) => (
                                    <div key={key} className="flex justify-between">
                                        <span>{key}</span>
                                        <span>{value < 0 ? '-' : ''}₹{Math.abs(value).toLocaleString('en-IN')}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                         <div>
                            <p className="font-semibold mb-2 text-center">Old Regime</p>
                              <div className="space-y-1 text-xs font-code text-muted-foreground">
                                {Object.entries(oldRegime.tax_breakdown).map(([key, value]) => (
                                    <div key={key} className="flex justify-between">
                                        <span>{key}</span>
                                        <span>{value < 0 ? '-' : ''}₹{Math.abs(value).toLocaleString('en-IN')}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
        </div>
    );
}
