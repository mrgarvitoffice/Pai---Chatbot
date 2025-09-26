
"use client";

import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { sendMessageAction } from '@/lib/actions';
import { calculateTax } from '@/lib/calculators';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Loader2, Sparkles, FileDown } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { ChatMessage, TaxCalculationResult } from '@/lib/types';
import { TaxResultCard } from './tax-result-card';
import { compareTaxRegimes } from '@/ai/flows/compare-tax-regimes';
import { generatePdf } from '@/lib/utils';

const formSchema = z.object({
  income: z.coerce.number().min(1, { message: 'Income must be greater than 0.' }),
  fy: z.string().default('2024-25'),
  regime: z.enum(['new', 'old', 'compare']).default('new'),
});

type TaxFormValues = z.infer<typeof formSchema>;

interface TaxCalculatorProps {
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  latestReportId: string | null;
  setLatestReportId: Dispatch<SetStateAction<string | null>>;
}

export function TaxCalculator({ setMessages, latestReportId, setLatestReportId }: TaxCalculatorProps) {
  const [result, setResult] = useState<TaxCalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);

  const form = useForm<TaxFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      income: 1500000,
      fy: '2024-25',
      regime: 'new',
    },
  });

  const onSubmit = async (values: TaxFormValues) => {
    setIsCalculating(true);
    setResult(null);
    const resultId = `result-${uuidv4()}`;
    setLatestReportId(resultId);

    if (values.regime === 'compare') {
      const newRegimeResult = { ...calculateTax(values.income, values.fy, 'new'), id: resultId };
      const oldRegimeResult = { ...calculateTax(values.income, values.fy, 'old'), id: resultId };
      
      const comparisonInput = {
        income: values.income,
        fy: values.fy,
        newRegimeResult,
        oldRegimeResult,
      };

      const comparisonResult = await compareTaxRegimes(comparisonInput);
      
      const userQuery: ChatMessage = {
          id: uuidv4(),
          role: 'user',
          content: `Compare tax regimes for an income of ₹${values.income.toLocaleString('en-IN')}.`
      };
      const resultMessage: ChatMessage = {
          id: uuidv4(),
          role: 'assistant',
          content: <TaxResultCard id={resultId} comparisonResult={{new: newRegimeResult, old: oldRegimeResult}} explanation={comparisonResult.comparison} />,
          rawContent: comparisonResult.comparison,
          calculationResult: { type: 'tax_comparison', data: { new: newRegimeResult, old: oldRegimeResult } }
      };
      setMessages(prev => [...prev, userQuery, resultMessage]);
      setIsCalculating(false);
      return;
    }

    const calculationResult = { ...calculateTax(values.income, values.fy, values.regime), id: resultId };
    
    setTimeout(() => {
        setResult(calculationResult);
        setIsCalculating(false);
        const explanation = `Here is the income tax summary for an income of **₹${values.income.toLocaleString('en-IN')}** for FY ${values.fy} under the **${values.regime} regime**.`;
        const userQuery: ChatMessage = {
            id: uuidv4(),
            role: 'user',
            content: `Calculate tax for ₹${values.income.toLocaleString('en-IN')} (FY ${values.fy}, ${values.regime} regime)`
        };
        const resultMessage: ChatMessage = {
            id: uuidv4(),
            role: 'assistant',
            content: <TaxResultCard id={resultId} result={calculationResult} explanation={explanation} />,
            rawContent: explanation,
            calculationResult: { type: 'tax', data: calculationResult }
        };
        setMessages(prev => [...prev, userQuery, resultMessage]);

    }, 500);
  };

  const handleExplain = async () => {
    if (!result) return;
    setIsExplaining(true);
    
    const query = `Explain the tax calculation for an income of ${result.income} under the ${result.regime} regime for FY ${result.fy}. The total tax is ${result.total_tax}.`;
    
    try {
      const explanationResult = await sendMessageAction({ query });
      
      const explanationMessage: ChatMessage = {
          id: uuidv4(),
          role: 'assistant',
          content: explanationResult.response,
          rawContent: explanationResult.response,
          sources: explanationResult.sources,
      };
      setMessages(prev => [...prev, explanationMessage]);
    } catch (error) {
      console.error("Error getting explanation:", error);
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: "Sorry, I couldn't generate an explanation at this time.",
        rawContent: "Sorry, I couldn't generate an explanation at this time."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsExplaining(false);
    }
  };

  return (
    <Card className="rounded-2xl shadow-sm h-full flex flex-col border-0">
      <CardContent className="flex-1 overflow-y-auto pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="income"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Annual Income (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 1500000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="regime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax Regime</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a tax regime" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="new">New Regime (Default)</SelectItem>
                      <SelectItem value="old">Old Regime</SelectItem>
                      <SelectItem value="compare">Compare Regimes</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isCalculating}>
              {isCalculating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isCalculating ? 'Calculating...' : 'Calculate Tax'}
            </Button>
          </form>
        </Form>
        {result && (
          <div className="mt-8 space-y-4">
            <Separator />
            <h3 className="text-lg font-semibold text-center">Calculation Results</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Taxable Income</p>
                <p className="font-semibold text-lg">₹{result.taxable_income.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Tax</p>
                <p className="font-semibold text-lg text-primary">₹{result.total_tax.toLocaleString('en-IN')}</p>
              </div>
            </div>
             <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="font-code text-sm">How we calculated this</AccordionTrigger>
                <AccordionContent>
                    <div className="space-y-2 text-sm font-code text-muted-foreground">
                        {Object.entries(result.tax_breakdown).map(([key, value]) => (
                             <div key={key} className="flex justify-between">
                                <span>{key}</span>
                                <span>₹{value.toLocaleString('en-IN')}</span>
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
        )}
      </CardContent>
       <CardFooter className="flex flex-col sm:flex-row items-center gap-2 p-4 border-t">
        {result && (
            <Button variant="outline" onClick={handleExplain} disabled={isExplaining} className="w-full bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                {isExplaining ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                )}
                Explain with AI
            </Button>
        )}
        <Button variant="secondary" onClick={() => generatePdf(latestReportId!)} disabled={!latestReportId} className="w-full">
            <FileDown className="mr-2 h-4 w-4" />
            Download Report
        </Button>
       </CardFooter>
    </Card>
  );
}
