
"use client";

import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { calculateFd } from '@/lib/calculators';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import type { ChatMessage, FdCalculationResult } from '@/lib/types';
import { FdResultCard } from './fd-result-card';

const formSchema = z.object({
  principal: z.coerce.number().min(1, { message: 'Principal must be greater than 0.' }),
  annual_rate: z.coerce.number().min(0.1, { message: 'Rate must be greater than 0.' }),
  years: z.coerce.number().min(1, { message: 'Years must be at least 1.' }),
});

type FdFormValues = z.infer<typeof formSchema>;

interface FdCalculatorProps {
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
}

export function FdCalculator({ setMessages }: FdCalculatorProps) {
  const [result, setResult] = useState<FdCalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const form = useForm<FdFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      principal: 100000,
      annual_rate: 7,
      years: 5,
    },
  });

  const onSubmit = (values: FdFormValues) => {
    setIsCalculating(true);
    setResult(null);
    const calculationResult = calculateFd(values.principal, values.annual_rate, values.years, 4); // Assuming quarterly compounding
    
    setTimeout(() => {
        setResult(calculationResult);
        setIsCalculating(false);
        const userQuery: ChatMessage = {
            id: uuidv4(),
            role: 'user',
            content: `Calculate FD maturity for ₹${values.principal.toLocaleString('en-IN')} at ${values.annual_rate}% for ${values.years} years.`
        };
        const resultMessage: ChatMessage = {
            id: uuidv4(),
            role: 'assistant',
            content: <FdResultCard result={calculationResult} explanation={`Here is the calculated maturity value for your Fixed Deposit.`} />
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
              name="principal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Principal Amount (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 100000" {...field} />
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
                    <Input type="number" step="0.1" placeholder="e.g., 7" {...field} />
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
                  <FormLabel>Tenure (Years)</FormLabel>
                   <FormControl>
                    <Input type="number" placeholder="e.g., 5" {...field} />
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
                <p className="text-sm text-muted-foreground">Principal</p>
                <p className="font-semibold text-lg">₹{result.principal.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Interest</p>
                <p className="font-semibold text-lg">₹{result.total_interest.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
