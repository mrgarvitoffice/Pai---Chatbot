"use client";

import type { TaxCalculationResult, TaxComparisonResult } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Banknote, Minus, Plus } from 'lucide-react';

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
    const { total_tax, tax_breakdown } = result;

    return (
        <Card className="bg-background/50 border-0 shadow-none">
            <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-semibold mb-2">🧾 Income Tax Calculation</CardTitle>
                <CardDescription>Total Tax Payable (FY {result.fy})</CardDescription>
                <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-400 dark:to-teal-300 py-1">
                    ₹{total_tax.toLocaleString('en-IN')}
                </p>
            </CardHeader>
            <CardContent>
                 <div className="p-4 rounded-xl bg-background border shadow-inner">
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 text-foreground/90">
                         <ReactMarkdown>{explanation}</ReactMarkdown>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 pt-0">
                <p className="text-xs text-muted-foreground w-full text-center">This is not a financial advice. Please consult a tax professional for personalised guidance.</p>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-t">
                    <AccordionTrigger className="font-code text-xs">How we calculated this</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2 text-sm font-code text-muted-foreground">
                            {Object.entries(tax_breakdown).map(([key, value]) => (
                                <div key={key} className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50">
                                    <div className="flex items-center gap-3">
                                        {value >= 0 ? <Plus className="size-4 text-green-500"/> : <Minus className="size-4 text-red-500"/>}
                                        <span>{key}</span>
                                    </div>
                                    <span className={value < 0 ? 'text-red-500' : ''}>{value < 0 ? '-' : ''}₹{Math.abs(value).toLocaleString('en-IN')}</span>
                                </div>
                            ))}
                            <Separator />
                            <div className="flex justify-between font-semibold text-foreground p-2">
                                <div className="flex items-center gap-3">
                                    <Banknote className="size-4 text-primary"/>
                                    <span>Total Tax</span>
                                </div>
                                <span>₹{total_tax.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
            </CardFooter>
        </Card>
    );
}


function TaxComparisonCard({ result, explanation }: { result: TaxComparisonResult, explanation: string }) {
    return (
         <Card className="bg-background/50 border-0 shadow-none">
             <CardHeader className="pb-4">
                <CardTitle>⚖️ Tax Regime Comparison</CardTitle>
                <CardDescription>FY {result.new.fy} for an income of ₹{result.new.income.toLocaleString('en-IN')}</CardDescription>
             </CardHeader>
            <CardContent className="p-4 pt-0">
                 <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-headings:my-3 prose-ul:my-2">
                    <ReactMarkdown>{explanation}</ReactMarkdown>
                </div>
            </CardContent>
             <CardFooter className="pt-0 px-4 pb-4">
                <p className="text-xs text-muted-foreground w-full text-center">This is not a financial advice. Please consult a tax professional for personalised guidance.</p>
            </CardFooter>
        </Card>
    );
}
