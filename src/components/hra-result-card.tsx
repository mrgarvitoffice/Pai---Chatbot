
"use client";

import type { HraResult } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Home, PiggyBank, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

interface HraResultCardProps {
    result: HraResult;
    explanation: string;
}

export function HraResultCard({ result, explanation }: HraResultCardProps) {
    return (
        <Card className="bg-background/50 border-0 shadow-none">
            <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-semibold mb-2">🏠 HRA Exemption Calculation</CardTitle>
                <CardDescription>Tax Exempted Amount</CardDescription>
                <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-400 dark:to-teal-300 py-1">
                    ₹{result.hraExemption.toLocaleString('en-IN')}
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="p-4 rounded-xl bg-background border shadow-inner">
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 text-foreground/90">
                         <ReactMarkdown>{explanation}</ReactMarkdown>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-background">
                        <div className="p-2 rounded-full bg-blue-500/20 text-blue-500">
                            <Wallet className="size-5"/>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Basic Salary</p>
                            <p className="font-semibold">₹{result.basicSalary.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-3 p-3 rounded-lg bg-background">
                        <div className="p-2 rounded-full bg-green-500/20 text-green-500">
                            <PiggyBank className="size-5"/>
                        </div>
                        <div>
                            <p className="text-muted-foreground">HRA Received</p>
                            <p className="font-semibold text-green-600 dark:text-green-400">
                                ₹{result.hraReceived.toLocaleString('en-IN')}
                            </p>
                        </div>
                    </div>
                     <div className="flex items-start gap-3 p-3 rounded-lg bg-background">
                        <div className="p-2 rounded-full bg-red-500/20 text-red-500">
                            <Home className="size-5"/>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Rent Paid</p>
                            <p className="font-semibold text-red-600 dark:text-red-400">
                                ₹{result.rentPaid.toLocaleString('en-IN')}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 pt-4">
                 <p className="text-xs text-muted-foreground w-full text-center">This is an estimate. Consult a tax professional for exact figures.</p>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-t">
                    <AccordionTrigger className="font-code text-xs">How HRA exemption is calculated</AccordionTrigger>
                    <AccordionContent>
                        <p className="text-xs font-code text-muted-foreground">
                            The HRA exemption is the minimum of the following three amounts:
                            <ul className="list-disc pl-4 mt-2">
                                <li>Actual HRA received from the employer.</li>
                                <li>For metro cities: 50% of basic salary. For non-metro cities: 40% of basic salary.</li>
                                <li>Actual rent paid minus 10% of basic salary.</li>
                            </ul>
                        </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
            </CardFooter>
        </Card>
    );
}
