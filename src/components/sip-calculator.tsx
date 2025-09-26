
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
  const [explanation, setExplanation] = useState<string>('');
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
    
    setTimeout(() => {
        const calculationResult = { ...calculateSip(values.monthly_investment, values.years, values.annual_rate), id: resultId };
        setResult(calculationResult);
        setExplanation(`Based on your inputs, here is the projected future value of your SIP investment of **₹${values.monthly_investment.toLocaleString('en-IN')}/month** for **${values.years} years**.`);
        setIsCalculating(false);
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
          <div className="mt-6">
            <SipResultCard id={latestReportId!} result={result} explanation={explanation} />
          </div>
        )}
      </CardContent>
       {latestReportId && result && (
        <CardFooter className="flex flex-col gap-2 p-4 border-t">
          <Button variant="secondary" className="w-full" onClick={() => generatePdf(latestReportId!)}>
            <FileDown className="mr-2 h-4 w-4" />
            Download Report as PDF
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
