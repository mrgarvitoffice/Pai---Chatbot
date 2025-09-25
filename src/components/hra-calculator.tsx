
"use client";

import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { calculateHRA } from '@/lib/calculators';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Loader2, FileDown } from 'lucide-react';
import type { ChatMessage, HraResult } from '@/lib/types';
import { HraResultCard } from './hra-result-card';
import { generatePdf } from '@/lib/utils';

const formSchema = z.object({
  basicSalary: z.coerce.number().min(1, { message: 'Basic salary must be greater than 0.' }),
  hraReceived: z.coerce.number().min(0, { message: 'HRA cannot be negative.' }),
  rentPaid: z.coerce.number().min(0, { message: 'Rent cannot be negative.' }),
  metroCity: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface HraCalculatorProps {
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  latestReportId: string | null;
}

export function HraCalculator({ setMessages, latestReportId }: HraCalculatorProps) {
  const [result, setResult] = useState<HraResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      basicSalary: 600000,
      hraReceived: 300000,
      rentPaid: 360000,
      metroCity: true,
    },
  });

  const onSubmit = (values: FormValues) => {
    setIsCalculating(true);
    setResult(null);
    const resultId = `hra-result-${uuidv4()}`;
    const calculationResult = { ...calculateHRA(values.basicSalary, values.hraReceived, values.rentPaid, values.metroCity), id: resultId };
    
    setTimeout(() => {
        setResult(calculationResult);
        setIsCalculating(false);
        const userQuery: ChatMessage = {
            id: uuidv4(),
            role: 'user',
            content: `Calculate HRA Exemption for me.`
        };
        const resultMessage: ChatMessage = {
            id: uuidv4(),
            role: 'assistant',
            content: <HraResultCard id={resultId} result={calculationResult} explanation={`Here is your estimated HRA exemption. This is based on standard assumptions and may vary.`} />
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
              name="basicSalary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Annual Basic Salary (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="hraReceived"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Annual HRA Received (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rentPaid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Annual Rent Paid (₹)</FormLabel>
                   <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="metroCity"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Living in a Metro City?</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isCalculating}>
              {isCalculating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isCalculating ? 'Calculating...' : 'Calculate HRA Exemption'}
            </Button>
          </form>
        </Form>
        {result && (
          <div className="mt-8 space-y-4 text-center">
            <Separator />
            <h3 className="text-lg font-semibold">HRA Exemption Amount</h3>
            <p className="font-bold text-2xl text-primary">₹{result.hraExemption.toLocaleString('en-IN')}</p>
          </div>
        )}
      </CardContent>
       {latestReportId && (
        <CardFooter className="p-4 border-t">
          <Button variant="secondary" className="w-full" onClick={() => generatePdf(latestReportId)}>
            <FileDown className="mr-2 h-4 w-4" />
            Download Report as PDF
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
