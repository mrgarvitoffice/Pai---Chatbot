"use client";

import type { TaxCalculationResult, TaxComparisonResult } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

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
            <CardHeader className="text-center">
                <CardDescription>Total Tax Payable (FY {result.fy})</CardDescription>
                <CardTitle className="text-3xl text-primary">₹{total_tax.toLocaleString('en-IN')}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-headings:my-3 prose-ul:my-2">
                     <ReactMarkdown>{explanation}</ReactMarkdown>
                </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 pt-4">
                 <p className="text-xs text-muted-foreground">This is not a financial advice. Please consult a tax professional for personalised guidance.</p>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-t">
                    <AccordionTrigger className="font-code text-xs">How we calculated this</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2 text-xs font-code text-muted-foreground">
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
            </CardFooter>
        </Card>
    );
}


function TaxComparisonCard({ result, explanation }: { result: TaxComparisonResult, explanation: string }) {
    return (
         <Card className="p-4 bg-background/50 rounded-b-2xl rounded-tr-2xl border-0 shadow-none">
            <CardContent className="p-0">
                 <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-headings:my-3 prose-ul:my-2">
                    <ReactMarkdown>{explanation}</ReactMarkdown>
                </div>
            </CardContent>
             <CardFooter className="pt-4 px-0 pb-0">
                <p className="text-xs text-muted-foreground">This is not a financial advice. Please consult a tax professional for personalised guidance.</p>
            </CardFooter>
        </Card>
    );
}
