
"use client";

import type { TaxCalculationResult, TaxComparisonResult } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Banknote, Minus, Plus, Wallet, Trophy } from 'lucide-react';

interface TaxResultCardProps {
    id: string;
    result?: TaxCalculationResult;
    comparisonResult?: TaxComparisonResult;
    explanation: string;
}

export function TaxResultCard({ id, result, comparisonResult, explanation }: TaxResultCardProps) {
    if (comparisonResult) {
        return <TaxComparisonCard id={id} result={comparisonResult} explanation={explanation} />;
    }

    if (!result) return null;
    const { total_tax, tax_breakdown, income, taxable_income } = result;

    return (
        <Card id={id} className="bg-card/50 border-border/30 shadow-lg">
            <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-semibold mb-2">🧾 Income Tax Calculation</CardTitle>
                <CardDescription>Total Tax Payable (FY {result.fy})</CardDescription>
                <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-destructive to-red-500 py-1">
                    ₹{total_tax.toLocaleString('en-IN')}
                </p>
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
                <p className="text-xs text-muted-foreground w-full text-center">This is not financial advice. Please consult a tax professional for personalised guidance.</p>
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


function TaxComparisonCard({ id, result, explanation }: { id: string, result: TaxComparisonResult, explanation: string }) {
    const { new: newRegimeResult, old: oldRegimeResult } = result;
    const savings = Math.abs(newRegimeResult.total_tax - oldRegimeResult.total_tax);
    const betterRegime = newRegimeResult.total_tax <= oldRegimeResult.total_tax ? 'New' : 'Old';

    return (
         <Card id={id} className="bg-card/50 border border-border/30 shadow-lg">
             <CardHeader className="pb-4">
                <CardTitle className="text-xl">⚖️ Tax Regime Comparison</CardTitle>
                <CardDescription>FY {newRegimeResult.fy} for an income of ₹{newRegimeResult.income.toLocaleString('en-IN')}</CardDescription>
             </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-border shadow-inner">
                    <div className="flex items-center justify-center gap-3 text-center">
                        <Trophy className="size-8 text-yellow-400" />
                        <div>
                            <p className="font-semibold text-lg text-foreground">The {betterRegime} Regime is better</p>
                            <p className="text-sm text-primary">You save ₹{savings.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    {/* New Regime Card */}
                    <div className="p-4 rounded-lg bg-background/50">
                        <h3 className="font-semibold text-center mb-2">New Regime</h3>
                        <Separator />
                        <div className="mt-2 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Taxable Income</span>
                                <span>₹{newRegimeResult.taxable_income.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between font-bold">
                                <span className="text-foreground">Total Tax</span>
                                <span className={betterRegime === 'New' ? 'text-green-400' : 'text-red-400'}>
                                    ₹{newRegimeResult.total_tax.toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Old Regime Card */}
                    <div className="p-4 rounded-lg bg-background/50">
                        <h3 className="font-semibold text-center mb-2">Old Regime</h3>
                         <Separator />
                         <div className="mt-2 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Taxable Income</span>
                                <span>₹{oldRegimeResult.taxable_income.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between font-bold">
                                <span className="text-foreground">Total Tax</span>
                                <span className={betterRegime === 'Old' ? 'text-green-400' : 'text-red-400'}>
                                    ₹{oldRegimeResult.total_tax.toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>
                    </div>
                 </div>
                 <div className="p-4 rounded-xl bg-background/50 border border-border/20 shadow-inner">
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 text-foreground/90">
                         <ReactMarkdown>{explanation}</ReactMarkdown>
                    </div>
                </div>
            </CardContent>
             <CardFooter className="pt-0 px-4 pb-4">
                <p className="text-xs text-muted-foreground w-full text-center">This is not a financial advice. Please consult a tax professional for personalised guidance.</p>
            </CardFooter>
        </Card>
    );
}
