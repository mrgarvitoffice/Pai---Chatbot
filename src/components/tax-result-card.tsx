"use client";

import type { TaxCalculationResult, TaxComparisonResult } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Banknote, Minus, Plus, Wallet } from 'lucide-react';

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
    const { total_tax, tax_breakdown, income, taxable_income } = result;

    return (
        <Card className="bg-card/50 border border-border/30 shadow-lg">
            <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-semibold mb-2">🧾 Income Tax Calculation</CardTitle>
                <CardDescription>Total Tax Payable (FY {result.fy})</CardDescription>
                <div className="p-4 mt-2 rounded-xl bg-gradient-to-r from-destructive/80 to-red-500/80 text-white text-center">
                    <p className="text-3xl font-extrabold">₹{total_tax.toLocaleString('en-IN')}</p>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="p-4 rounded-xl bg-background/50 border border-border/20 shadow-inner">
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 text-foreground/90">
                         <ReactMarkdown>{explanation}</ReactMarkdown>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                        <div className="p-2 rounded-full bg-blue-500/10 text-blue-400">
                            <Wallet className="size-5"/>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Gross Income</p>
                            <p className="font-semibold text-blue-400">🔵 ₹{income.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                        <div className="p-2 rounded-full bg-yellow-500/10 text-yellow-400">
                            <Banknote className="size-5"/>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Taxable Income</p>
                            <p className="font-semibold text-yellow-400">🟡 ₹{taxable_income.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 pt-0">
                <p className="text-xs text-muted-foreground w-full text-center">This is not a financial advice. Please consult a tax professional for personalised guidance.</p>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-t border-border/30">
                    <AccordionTrigger className="font-code text-xs">How we calculated this</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2 text-sm font-code text-muted-foreground">
                            {Object.entries(tax_breakdown).map(([key, value]) => (
                                <div key={key} className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50">
                                    <div className="flex items-center gap-3">
                                        {value >= 0 ? <Plus className="size-4 text-green-500"/> : <Minus className="size-4 text-red-500"/>}
                                        <span>{key}</span>
                                    </div>
                                    <span className={value < 0 ? 'text-red-400 font-semibold' : 'text-green-400'}>{value < 0 ? '-' : '+'}₹{Math.abs(value).toLocaleString('en-IN')}</span>
                                </div>
                            ))}
                            <Separator className="bg-border/30" />
                            <div className="flex justify-between font-semibold text-foreground p-2">
                                <div className="flex items-center gap-3">
                                    <Banknote className="size-4 text-primary"/>
                                    <span>Total Tax</span>
                                </div>
                                <span className="text-red-400">₹{total_tax.toLocaleString('en-IN')}</span>
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
         <Card className="bg-card/50 border border-border/30 shadow-lg">
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
