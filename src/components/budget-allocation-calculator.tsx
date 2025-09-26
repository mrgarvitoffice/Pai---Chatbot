"use client";

import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { budgetAllocation } from '@/lib/calculators';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Loader2, FileDown } from 'lucide-react';
import type { ChatMessage, BudgetAllocationResult } from '@/lib/types';
import { BudgetAllocationResultCard } from './budget-allocation-result-card';
import { generatePdf } from '@/lib/utils';

const formSchema = z.object({
  monthlyIncome: z.coerce.number().min(1, { message: 'Income must be greater than 0.' }),
});

type FormValues = z.infer<typeof formSchema>;

interface BudgetAllocationCalculatorProps {
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  latestReportId: string | null;
  setLatestReportId: Dispatch<SetStateAction<string | null>>;
}

export function BudgetAllocationCalculator({ setMessages, latestReportId, setLatestReportId }: BudgetAllocationCalculatorProps) {
  const [result, setResult] = useState<BudgetAllocationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      monthlyIncome: 75000,
    },
  });

  const onSubmit = (values: FormValues) => {
    setIsCalculating(true);
    setResult(null);
    const resultId = `result-${uuidv4()}`;
    setLatestReportId(resultId);
    const calculationResult = { ...budgetAllocation(values.monthlyIncome), id: resultId };
    
    setTimeout(() => {
        setResult(calculationResult);
        setIsCalculating(false);
        const explanation = `Based on the 50/30/20 rule, here is a suggested budget allocation for your monthly income of **₹${values.monthlyIncome.toLocaleString('en-IN')}**.`;
        const userQuery: ChatMessage = {
            id: uuidv4(),
            role: 'user',
            content: `Calculate budget for a monthly income of ₹${values.monthlyIncome.toLocaleString('en-IN')}.`
        };
        const resultMessage: ChatMessage = {
            id: uuidv4(),
            role: 'assistant',
            content: <BudgetAllocationResultCard id={resultId} result={calculationResult} explanation={explanation} />,
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
              name="monthlyIncome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Income (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 75000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isCalculating}>
              {isCalculating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isCalculating ? 'Calculating...' : 'Allocate Budget'}
            </Button>
          </form>
        </Form>
        {result && (
          <div className="mt-8 space-y-4">
            <Separator />
            <h3 className="text-lg font-semibold text-center">50/30/20 Allocation</h3>
            <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                    <p className="text-sm text-muted-foreground">Needs (50%)</p>
                    <p className="font-semibold text-lg">₹{result.needs.toLocaleString('en-IN')}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Wants (30%)</p>
                    <p className="font-semibold text-lg">₹{result.wants.toLocaleString('en-IN')}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Savings (20%)</p>
                    <p className="font-semibold text-lg text-primary">₹{result.savings.toLocaleString('en-IN')}</p>
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
