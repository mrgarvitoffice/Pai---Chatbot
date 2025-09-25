
"use client";

import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { calculateTermInsuranceCover } from '@/lib/calculators';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Loader2, FileDown } from 'lucide-react';
import type { ChatMessage, TermInsuranceResult } from '@/lib/types';
import { TermInsuranceResultCard } from './term-insurance-result-card';
import { generatePdf } from '@/lib/utils';

const formSchema = z.object({
  annualIncome: z.coerce.number().min(1),
});

type FormValues = z.infer<typeof formSchema>;

interface TermInsuranceCalculatorProps {
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
}

export function TermInsuranceCalculator({ setMessages }: TermInsuranceCalculatorProps) {
  const [result, setResult] = useState<TermInsuranceResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [resultCardId, setResultCardId] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      annualIncome: 1000000,
    },
  });

  const onSubmit = (values: FormValues) => {
    setIsCalculating(true);
    setResult(null);
    const calculationResult = calculateTermInsuranceCover(values.annualIncome);
    const newId = `term-insurance-result-${uuidv4()}`;
    setResultCardId(newId);
    
    setTimeout(() => {
        setResult(calculationResult);
        setIsCalculating(false);
        const userQuery: ChatMessage = {
            id: uuidv4(),
            role: 'user',
            content: `Calculate my recommended term insurance cover.`
        };
        const resultMessage: ChatMessage = {
            id: uuidv4(),
            role: 'assistant',
            content: <TermInsuranceResultCard id={newId} result={calculationResult} explanation={`Based on the rule of thumb of having a life cover of at least **10-15 times your annual income**, a suitable term insurance cover has been calculated to secure your family's future.`} />
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
              name="annualIncome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Annual Income (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isCalculating}>
              {isCalculating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isCalculating ? 'Calculating...' : 'Calculate Cover'}
            </Button>
          </form>
        </Form>
        {result && (
          <div className="mt-8 space-y-4 text-center">
            <Separator />
            <h3 className="text-lg font-semibold">Recommended Cover</h3>
            <p className="font-bold text-2xl text-primary">₹{result.recommendedCover.toLocaleString('en-IN')}</p>
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
