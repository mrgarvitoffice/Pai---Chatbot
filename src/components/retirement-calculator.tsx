
"use client";

import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { calculateRetirementCorpus } from '@/lib/calculators';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Loader2, FileDown } from 'lucide-react';
import type { ChatMessage, RetirementCorpusResult } from '@/lib/types';
import { RetirementResultCard } from './retirement-result-card';
import { generatePdf } from '@/lib/utils';

const formSchema = z.object({
  currentAge: z.coerce.number().min(18, { message: 'Age must be at least 18.' }),
  retirementAge: z.coerce.number().min(19, { message: 'Must be older than current age.' }),
  monthlyExpenses: z.coerce.number().min(1, { message: 'Expenses must be greater than 0.' }),
}).refine(data => data.retirementAge > data.currentAge, {
  message: "Retirement age must be after current age.",
  path: ["retirementAge"],
});

type FormValues = z.infer<typeof formSchema>;

interface RetirementCalculatorProps {
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
}

export function RetirementCalculator({ setMessages }: RetirementCalculatorProps) {
  const [result, setResult] = useState<RetirementCorpusResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [resultCardId, setResultCardId] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentAge: 30,
      retirementAge: 60,
      monthlyExpenses: 50000,
    },
  });

  const onSubmit = (values: FormValues) => {
    setIsCalculating(true);
    setResult(null);
    const calculationResult = calculateRetirementCorpus(values);
    const newId = `retirement-result-${uuidv4()}`;
    setResultCardId(newId);
    
    setTimeout(() => {
        setResult(calculationResult);
        setIsCalculating(false);
        const userQuery: ChatMessage = {
            id: uuidv4(),
            role: 'user',
            content: `Calculate my retirement corpus.`
        };
        const resultMessage: ChatMessage = {
            id: uuidv4(),
            role: 'assistant',
            content: <RetirementResultCard id={newId} result={calculationResult} explanation={`To meet your estimated retirement expenses, here is the total corpus you would need to accumulate by the age of **${values.retirementAge}**. This is based on standard financial planning assumptions.`} />
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
              name="currentAge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Age</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 30" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="retirementAge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Desired Retirement Age</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 60" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="monthlyExpenses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Monthly Expenses (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 50000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isCalculating}>
              {isCalculating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isCalculating ? 'Calculating...' : 'Calculate Corpus'}
            </Button>
          </form>
        </Form>
        {result && (
          <div className="mt-8 space-y-4">
            <Separator />
            <h3 className="text-lg font-semibold text-center">Calculation Results</h3>
             <div className="text-center">
                <p className="text-sm text-muted-foreground">Required Corpus</p>
                <p className="font-semibold text-2xl text-primary">₹{result.requiredCorpus.toLocaleString('en-IN')}</p>
            </div>
          </div>
        )}
      </CardContent>
      {result && resultCardId && (
        <CardFooter className="p-4 border-t">
          <Button variant="secondary" className="w-full" onClick={() => generatePdf(resultCardId)}>
            <FileDown className="mr-2 h-4 w-4" />
            Download Report as PDF
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
