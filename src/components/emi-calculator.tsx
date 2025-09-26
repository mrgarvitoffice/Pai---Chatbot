
"use client";

import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { calculateEMI } from '@/lib/calculators';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, FileDown } from 'lucide-react';
import type { ChatMessage, EmiCalculationResult } from '@/lib/types';
import { EmiResultCard } from './emi-result-card';
import { generatePdf } from '@/lib/utils';

const formSchema = z.object({
  principal: z.coerce.number().min(1, { message: 'Loan amount must be greater than 0.' }),
  annual_rate: z.coerce.number().min(0.1, { message: 'Rate must be greater than 0.' }),
  years: z.coerce.number().min(1, { message: 'Years must be at least 1.' }),
});

type EmiFormValues = z.infer<typeof formSchema>;

interface EmiCalculatorProps {
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  latestReportId: string | null;
  setLatestReportId: Dispatch<SetStateAction<string | null>>;
}

export function EmiCalculator({ setMessages, latestReportId, setLatestReportId }: EmiCalculatorProps) {
  const [result, setResult] = useState<EmiCalculationResult | null>(null);
  const [explanation, setExplanation] = useState<string>('');
  const [isCalculating, setIsCalculating] = useState(false);

  const form = useForm<EmiFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      principal: 1000000,
      annual_rate: 8.5,
      years: 10,
    },
  });

  const onSubmit = (values: EmiFormValues) => {
    setIsCalculating(true);
    setResult(null);
    const resultId = `result-${uuidv4()}`;
    setLatestReportId(resultId);
    
    setTimeout(() => {
        const calculationResult = { ...calculateEMI(values.principal, values.annual_rate, values.years), id: resultId };
        setResult(calculationResult);
        setExplanation(`For a loan of **₹${values.principal.toLocaleString('en-IN')}** at **${values.annual_rate}%** for **${values.years} years**, your Equated Monthly Installment (EMI) has been calculated.`);
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
              name="principal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Amount (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 1000000" {...field} />
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
                    <Input type="number" step="0.1" placeholder="e.g., 8.5" {...field} />
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
                  <FormLabel>Loan Tenure (Years)</FormLabel>
                   <FormControl>
                    <Input type="number" placeholder="e.g., 10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isCalculating}>
              {isCalculating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isCalculating ? 'Calculating...' : 'Calculate EMI'}
            </Button>
          </form>
        </Form>
        {result && (
          <div className="mt-6">
            <EmiResultCard id={latestReportId!} result={result} explanation={explanation} />
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
