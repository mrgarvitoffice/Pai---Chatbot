
"use client";

import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { savingsRatio } from '@/lib/calculators';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, FileDown } from 'lucide-react';
import type { ChatMessage, SavingsRatioResult } from '@/lib/types';
import { SavingsRatioResultCard } from './savings-ratio-result-card';
import { generatePdf } from '@/lib/utils';

const formSchema = z.object({
  monthlyIncome: z.coerce.number().min(1),
  monthlySavings: z.coerce.number().min(0),
});

type FormValues = z.infer<typeof formSchema>;

interface SavingsRatioCalculatorProps {
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  latestReportId: string | null;
  setLatestReportId: Dispatch<SetStateAction<string | null>>;
}

export function SavingsRatioCalculator({ setMessages, latestReportId, setLatestReportId }: SavingsRatioCalculatorProps) {
  const [result, setResult] = useState<SavingsRatioResult | null>(null);
  const [explanation, setExplanation] = useState<string>('');
  const [isCalculating, setIsCalculating] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      monthlyIncome: 100000,
      monthlySavings: 25000,
    },
  });

  const onSubmit = (values: FormValues) => {
    setIsCalculating(true);
    setResult(null);
    const resultId = `result-${uuidv4()}`;
    setLatestReportId(resultId);
    
    setTimeout(() => {
        const calculationResult = { ...savingsRatio(values.monthlyIncome, values.monthlySavings), id: resultId };
        setResult(calculationResult);
        setExplanation(`Your Savings Ratio has been calculated. A ratio above 20% is generally considered healthy.`);
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
              name="monthlyIncome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Take-Home Monthly Income (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="monthlySavings"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Monthly Savings & Investments (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isCalculating}>
              {isCalculating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isCalculating ? 'Calculating...' : 'Calculate Savings Ratio'}
            </Button>
          </form>
        </Form>
        {result && (
          <div className="mt-6">
            <SavingsRatioResultCard id={latestReportId!} result={result} explanation={explanation} />
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
