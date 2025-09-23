"use client";

import type { PortfolioAllocationResult } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TrendingUp, ShieldCheck, Gem } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
import { Pie, PieChart as RechartsPieChart, Cell } from "recharts";


interface PortfolioAllocationResultCardProps {
    result: PortfolioAllocationResult;
    explanation: string;
}

const chartData = (result: PortfolioAllocationResult) => [
  { name: "Equity", value: result.equity, fill: "hsl(var(--primary))" },
  { name: "Debt", value: result.debt, fill: "hsl(var(--secondary))" },
  { name: "Gold", value: result.gold, fill: "hsl(var(--accent))" },
];

const chartConfig = {
  equity: { label: "Equity", color: "hsl(var(--primary))" },
  debt: { label: "Debt", color: "hsl(var(--secondary))" },
  gold: { label: "Gold", color: "hsl(var(--accent))" },
};


export function PortfolioAllocationResultCard({ result, explanation }: PortfolioAllocationResultCardProps) {
    const data = chartData(result);

    return (
        <Card className="bg-background/50 border-0 shadow-none">
             <CardHeader className="text-center pb-4">
                <CardDescription>Recommended Asset Allocation</CardDescription>
                <CardTitle className="text-xl font-bold">For a {result.age}-year-old with '{result.riskAppetite}' risk</CardTitle>
            </CardHeader>
             <CardContent className="space-y-4">
                 <div className="h-[200px] w-full">
                    <ChartContainer config={chartConfig} className="mx-auto aspect-square h-full">
                        <RechartsPieChart>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={60}
                            strokeWidth={5}
                            >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                            </Pie>
                            <ChartLegend
                                content={<ChartLegendContent nameKey="name" />}
                                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                            />
                        </RechartsPieChart>
                    </ChartContainer>
                </div>
                <div className="py-2 whitespace-pre-wrap text-sm text-muted-foreground prose prose-sm dark:prose-invert max-w-none">
                    <p>{explanation}</p>
                </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 pt-4">
                <p className="text-xs text-muted-foreground">This is not a financial advice. Please consult a financial advisor for personalised guidance.</p>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-t">
                    <AccordionTrigger className="font-code text-xs">How we calculated this</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-3 text-xs font-code text-muted-foreground">
                            <div className="flex items-start gap-2">
                                <TrendingUp className="size-4 mt-1 text-primary shrink-0"/>
                                <p><strong>Equity ({result.equity}%):</strong> Aims for long-term growth by investing in stocks. Higher risk, higher potential reward.</p>
                            </div>
                             <div className="flex items-start gap-2">
                                <ShieldCheck className="size-4 mt-1 text-secondary shrink-0"/>
                                <p><strong>Debt ({result.debt}%):</strong> Provides stability and regular income through bonds and fixed-income securities. Lower risk.</p>
                            </div>
                             <div className="flex items-start gap-2">
                                <Gem className="size-4 mt-1 text-yellow-400 shrink-0"/>
                                <p><strong>Gold ({result.gold}%):</strong> Acts as a hedge against inflation and market volatility. Provides portfolio diversification.</p>
                            </div>
                        </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
            </CardFooter>
        </Card>
    );
}
