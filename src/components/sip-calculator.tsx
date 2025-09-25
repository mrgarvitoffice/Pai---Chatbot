"use client";

import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { calculateSip } from '@/lib/calculators';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Loader2, FileDown } from 'lucide-react';
import type { ChatMessage, SipCalculationResult } from '@/lib/types';
import { SipResultCard } from './sip-result-card';
import { generatePdf } from '@/lib/utils';

const formSchema = z.object({
  monthly_investment: z.coerce.number().min(1, { message: 'Investment must be greater than 0.' }),
  annual_rate: z.coerce.number().min(0.1, { message: 'Rate must be greater than 0.' }),
  years: z.coerce.number().min(1, { message: 'Years must be at least 1.' }),
});

type SipFormValues = z.infer<typeof formSchema>;

interface SipCalculatorProps {
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  latestReportId: string | null;
  setLatestReportId: Dispatch<SetStateAction<string | null>>;
}

export function SipCalculator({ setMessages, latestReportId, setLatestReportId }: SipCalculatorProps) {
  const [result, setResult] = useState<SipCalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const form = useForm<SipFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      monthly_investment: 10000,
      annual_rate: 12,
      years: 15,
    },
  });

  const onSubmit = (values: SipFormValues) => {
    setIsCalculating(true);
    setResult(null);
    const resultId = `result-${uuidv4()}`;
    setLatestReportId(resultId);
    const calculationResult = { ...calculateSip(values.monthly_investment, values.years, values.annual_rate), id: resultId };
    
    setTimeout(() => {
        setResult(calculationResult);
        setIsCalculating(false);
        const explanation = `Based on your inputs, here is the projected future value of your SIP investment of **₹${values.monthly_investment.toLocaleString('en-IN')}/month** for **${values.years} years**.`;
        const userQuery: ChatMessage = {
            id: uuidv4(),
            role: 'user',
            content: `Calculate SIP for ₹${values.monthly_investment.toLocaleString('en-IN')}/month at ${values.annual_rate}% for ${values.years} years.`
        };
        const resultMessage: ChatMessage = {
            id: uuidv4(),
            role: 'assistant',
            content: <SipResultCard id={resultId} result={calculationResult} explanation={explanation} />,
            rawContent: explanation,
        };
        setMessages(prev => [...prev, userQuery, resultMessage]);
    }, 500);
  };

  return (
    <Card className="rounded-2xl shadow-sm h-full flex flex-col border-0">
      <CardContent className="flex-1 overflow-y-auto pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="monthly_investment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Investment (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 10000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="annual_rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Return Rate (% p.a.)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" placeholder="e.g., 12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="years"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Investment Period (Years)</FormLabel>
                   <FormControl>
                    <Input type="number" placeholder="e.g., 15" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isCalculating}>
              {isCalculating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isCalculating ? 'Calculating...' : 'Calculate Future Value'}
            </Button>
          </form>
        </Form>
        {result && (
          <div className="mt-8 space-y-4">
            <Separator />
            <h3 className="text-lg font-semibold text-center">Calculation Results</h3>
            <div className="text-center">
                <p className="text-sm text-muted-foreground">Projected Value</p>
                <p className="font-semibold text-2xl text-primary">₹{result.future_value.toLocaleString('en-IN')}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Invested</p>
                <p className="font-semibold text-lg">₹{result.total_invested.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Est. Gains</p>
                <p className="font-semibold text-lg">₹{result.total_gain.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
       {latestReportId && (
        <CardFooter className="p-4 border-t">
          <Button variant="secondary" className="w-full" onClick={() => generatePdf(latestReportId)}>
            <FileDown className="mr-2 h-4 w-4" />
            Download Report as PDF
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
