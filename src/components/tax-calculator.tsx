
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
import { Loader2, Sparkles, FileDown } from 'lucide-react';
import type { ChatMessage, TaxCalculationResult, TaxComparisonResult } from '@/lib/types';
import { TaxResultCard } from './tax-result-card';
import { compareTaxRegimes } from '@/ai/flows/compare-tax-regimes';
import { generatePdf } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

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
  const [comparisonResult, setComparisonResult] = useState<TaxComparisonResult | null>(null);
  const [explanation, setExplanation] = useState<string>('');
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
    setComparisonResult(null);
    setExplanation('');
    const resultId = `result-${uuidv4()}`;
    setLatestReportId(resultId);

    if (values.regime === 'compare') {
      const newRegimeResult = { ...calculateTax(values.income, values.fy, 'new'), id: resultId };
      const oldRegimeResult = { ...calculateTax(values.income, values.fy, 'old'), id: resultId };
      const comparisonData = { new: newRegimeResult, old: oldRegimeResult };
      
      const comparisonInput = {
        income: values.income,
        fy: values.fy,
        newRegimeResult,
        oldRegimeResult,
      };

      const comparisonExplanation = await compareTaxRegimes(comparisonInput);
      setComparisonResult(comparisonData);
      setExplanation(comparisonExplanation.comparison);
      
    } else {
      const calculationResult = { ...calculateTax(values.income, values.fy, values.regime), id: resultId };
      setResult(calculationResult);
      setExplanation(`Here is the income tax summary for an income of **₹${values.income.toLocaleString('en-IN')}** for FY ${values.fy} under the **${values.regime} regime**.`);
    }

    setIsCalculating(false);
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
          content: <ReactMarkdown>{explanationResult.response}</ReactMarkdown>,
          rawContent: explanationResult.response,
          sources: explanationResult.sources,
      };
      setMessages(prev => [...prev, explanationMessage]);
    } catch (error) {
      console.error("Error getting explanation:", error);
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
        {(result || comparisonResult) && (
          <div className="mt-6">
            {result && <TaxResultCard id={latestReportId!} result={result} explanation={explanation} />}
            {comparisonResult && <TaxResultCard id={latestReportId!} comparisonResult={comparisonResult} explanation={explanation} />}
          </div>
        )}
      </CardContent>
       <CardFooter className="flex flex-col gap-2 p-4 border-t">
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
            Download Report as PDF
        </Button>
       </CardFooter>
    </Card>
  );
}
