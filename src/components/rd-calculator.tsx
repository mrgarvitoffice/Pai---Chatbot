"use client";

import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { calculateRd } from '@/lib/calculators';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Loader2, FileDown } from 'lucide-react';
import type { ChatMessage, RdCalculationResult } from '@/lib/types';
import { RdResultCard } from './rd-result-card';
import { generatePdf } from '@/lib/utils';

const formSchema = z.object({
  monthly_deposit: z.coerce.number().min(1, { message: 'Deposit must be greater than 0.' }),
  annual_rate: z.coerce.number().min(0.1, { message: 'Rate must be greater than 0.' }),
  months: z.coerce.number().min(1, { message: 'Months must be at least 1.' }),
});

type RdFormValues = z.infer<typeof formSchema>;

interface RdCalculatorProps {
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  latestReportId: string | null;
  setLatestReportId: Dispatch<SetStateAction<string | null>>;
}

export function RdCalculator({ setMessages, latestReportId, setLatestReportId }: RdCalculatorProps) {
  const [result, setResult] = useState<RdCalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const form = useForm<RdFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      monthly_deposit: 5000,
      annual_rate: 6.5,
      months: 60,
    },
  });

  const onSubmit = (values: RdFormValues) => {
    setIsCalculating(true);
    setResult(null);
    const resultId = `result-${uuidv4()}`;
    setLatestReportId(resultId);
    const calculationResult = { ...calculateRd(values.monthly_deposit, values.annual_rate, values.months), id: resultId };
    
    setTimeout(() => {
        setResult(calculationResult);
        setIsCalculating(false);
        const explanation = `Here is the calculated maturity value for your Recurring Deposit.`;
        const userQuery: ChatMessage = {
            id: uuidv4(),
            role: 'user',
            content: `Calculate RD maturity for ₹${values.monthly_deposit.toLocaleString('en-IN')}/month at ${values.annual_rate}% for ${values.months} months.`
        };
        const resultMessage: ChatMessage = {
            id: uuidv4(),
            role: 'assistant',
            content: <RdResultCard id={resultId} result={calculationResult} explanation={explanation} />,
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
              name="monthly_deposit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Deposit (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 5000" {...field} />
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
                  <FormLabel>Annual Interest Rate (%)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" placeholder="e.g., 6.5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="months"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tenure (Months)</FormLabel>
                   <FormControl>
                    <Input type="number" placeholder="e.g., 60" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isCalculating}>
              {isCalculating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isCalculating ? 'Calculating...' : 'Calculate Maturity'}
            </Button>
          </form>
        </Form>
        {result && (
          <div className="mt-8 space-y-4">
            <Separator />
            <h3 className="text-lg font-semibold text-center">Calculation Results</h3>
            <div className="text-center">
                <p className="text-sm text-muted-foreground">Maturity Value</p>
                <p className="font-semibold text-2xl text-primary">₹{result.future_value.toLocaleString('en-IN')}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Deposited</p>
                <p className="font-semibold text-lg">₹{result.total_deposited.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Interest</p>
                <p className="font-semibold text-lg">₹{result.total_interest.toLocaleString('en-IN')}</p>
              </div>
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
