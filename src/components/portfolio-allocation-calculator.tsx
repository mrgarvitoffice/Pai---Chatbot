
"use client";

import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { calculatePortfolioAllocation } from '@/lib/calculators';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, FileDown } from 'lucide-react';
import type { ChatMessage, PortfolioAllocationResult } from '@/lib/types';
import { PortfolioAllocationResultCard } from './portfolio-allocation-result-card';
import { generatePdf } from '@/lib/utils';

const formSchema = z.object({
  age: z.coerce.number().min(18).max(100),
  riskAppetite: z.enum(['low', 'medium', 'high']),
});

type FormValues = z.infer<typeof formSchema>;

interface PortfolioAllocationCalculatorProps {
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  latestReportId: string | null;
  setLatestReportId: Dispatch<SetStateAction<string | null>>;
}

export function PortfolioAllocationCalculator({ setMessages, latestReportId, setLatestReportId }: PortfolioAllocationCalculatorProps) {
  const [result, setResult] = useState<PortfolioAllocationResult | null>(null);
  const [explanation, setExplanation] = useState<string>('');
  const [isCalculating, setIsCalculating] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 35,
      riskAppetite: 'medium',
    },
  });

  const onSubmit = (values: FormValues) => {
    setIsCalculating(true);
    setResult(null);
    const resultId = `result-${uuidv4()}`;
    setLatestReportId(resultId);
    
    setTimeout(() => {
        const calculationResult = { ...calculatePortfolioAllocation(values.age, values.riskAppetite), id: resultId };
        setResult(calculationResult);
        setExplanation(`Based on your age of **${values.age}** and a **'${values.riskAppetite}'** risk appetite, here is a suggested asset allocation. This is a general guideline.`);
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
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Age</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="riskAppetite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Risk Appetite</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your risk appetite" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isCalculating}>
              {isCalculating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isCalculating ? 'Calculating...' : 'Get Allocation'}
            </Button>
          </form>
        </Form>
        {result && (
          <div className="mt-6">
            <PortfolioAllocationResultCard id={latestReportId!} result={result} explanation={explanation} />
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
