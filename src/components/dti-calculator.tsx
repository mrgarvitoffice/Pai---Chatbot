
"use client";

import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { debtToIncomeRatio } from '@/lib/calculators';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import type { ChatMessage, DtiResult } from '@/lib/types';
import { DtiResultCard } from './dti-result-card';

const formSchema = z.object({
  monthlyIncome: z.coerce.number().min(1),
  monthlyEmi: z.coerce.number().min(0),
});

type FormValues = z.infer<typeof formSchema>;

interface DtiCalculatorProps {
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
}

export function DtiCalculator({ setMessages }: DtiCalculatorProps) {
  const [result, setResult] = useState<DtiResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      monthlyIncome: 100000,
      monthlyEmi: 25000,
    },
  });

  const onSubmit = (values: FormValues) => {
    setIsCalculating(true);
    setResult(null);
    const calculationResult = debtToIncomeRatio(values.monthlyIncome, values.monthlyEmi);
    
    setTimeout(() => {
        setResult(calculationResult);
        setIsCalculating(false);
        const userQuery: ChatMessage = {
            id: uuidv4(),
            role: 'user',
            content: `Calculate my DTI ratio.`
        };
        const resultMessage: ChatMessage = {
            id: uuidv4(),
            role: 'assistant',
            content: <DtiResultCard result={calculationResult} explanation={`Your Debt-to-Income (DTI) ratio has been calculated. Lenders generally prefer a DTI ratio below 40%.`} />
        };
        setMessages(prev => [...prev, userQuery, resultMessage]);
    }, 500);
  };

  return (
    <Card className="rounded-2xl shadow-sm h-full flex flex-col border-0">
      <CardContent className="flex-1 overflow-y-auto pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField control={form.control} name="monthlyIncome" render={({ field }) => ( <FormItem> <FormLabel>Gross Monthly Income (₹)</FormLabel> <FormControl> <Input type="number" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
            <FormField control={form.control} name="monthlyEmi" render={({ field }) => ( <FormItem> <FormLabel>Total Monthly EMI Payments (₹)</FormLabel> <FormControl> <Input type="number" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
            <Button type="submit" className="w-full" disabled={isCalculating}>
              {isCalculating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isCalculating ? 'Calculating...' : 'Calculate DTI Ratio'}
            </Button>
          </form>
        </Form>
        {result && (
          <div className="mt-8 space-y-4 text-center">
            <Separator />
            <h3 className="text-lg font-semibold">DTI Ratio</h3>
            <p className="font-bold text-2xl text-primary">{result.dtiRatio}%</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
