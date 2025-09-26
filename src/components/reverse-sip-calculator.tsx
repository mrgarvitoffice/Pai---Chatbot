"use client";

import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { calculateReverseSip } from '@/lib/calculators';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Loader2, FileDown } from 'lucide-react';
import type { ChatMessage, ReverseSipResult } from '@/lib/types';
import { ReverseSipResultCard } from './reverse-sip-result-card';
import { generatePdf } from '@/lib/utils';

const formSchema = z.object({
  future_value: z.coerce.number().min(1, { message: 'Target must be greater than 0.' }),
  annual_rate: z.coerce.number().min(0.1, { message: 'Rate must be greater than 0.' }),
  years: z.coerce.number().min(1, { message: 'Years must be at least 1.' }),
});

type ReverseSipFormValues = z.infer<typeof formSchema>;

interface ReverseSipCalculatorProps {
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  latestReportId: string | null;
  setLatestReportId: Dispatch<SetStateAction<string | null>>;
}

export function ReverseSipCalculator({ setMessages, latestReportId, setLatestReportId }: ReverseSipCalculatorProps) {
  const [result, setResult] = useState<ReverseSipResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const form = useForm<ReverseSipFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      future_value: 10000000,
      annual_rate: 12,
      years: 15,
    },
  });

  const onSubmit = (values: ReverseSipFormValues) => {
    setIsCalculating(true);
    setResult(null);
    const resultId = `result-${uuidv4()}`;
    setLatestReportId(resultId);
    const calculationResult = { ...calculateReverseSip(values.future_value, values.years, values.annual_rate), id: resultId };
    
    setTimeout(() => {
        setResult(calculationResult);
        setIsCalculating(false);
        const explanation = `To reach your goal of **₹${values.future_value.toLocaleString('en-IN')}** in **${values.years} years** with an expected return of **${values.annual_rate}%**, you would need to invest approximately the following amount per month.`;
        const userQuery: ChatMessage = {
            id: uuidv4(),
            role: 'user',
            content: `Calculate monthly SIP to reach ₹${values.future_value.toLocaleString('en-IN')} in ${values.years} years at ${values.annual_rate}%.`
        };
        const resultMessage: ChatMessage = {
            id: uuidv4(),
            role: 'assistant',
            content: <ReverseSipResultCard id={resultId} result={calculationResult} explanation={explanation} />,
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
              name="future_value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Amount (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 10000000" {...field} />
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
              {isCalculating ? 'Calculating...' : 'Calculate Monthly SIP'}
            </Button>
          </form>
        </Form>
        {result && (
          <div className="mt-8 space-y-4">
            <Separator />
            <h3 className="text-lg font-semibold text-center">Calculation Results</h3>
            <div className="text-center">
                <p className="text-sm text-muted-foreground">Required Monthly SIP</p>
                <p className="font-semibold text-2xl text-primary">₹{result.monthly_investment.toLocaleString('en-IN')}</p>
            </div>
          </div>
        )}
      </CardContent>
       {latestReportId && (
        <CardFooter className="flex flex-col gap-2 p-4 border-t">
          <Button variant="secondary" className="w-full" onClick={() => generatePdf(latestReportId)}>
            <FileDown className="mr-2 h-4 w-4" />
            Download Report as PDF
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
