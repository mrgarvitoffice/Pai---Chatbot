
"use client";

import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { calculateFire } from '@/lib/calculators';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Loader2, FileDown } from 'lucide-react';
import type { ChatMessage, FireCalculationResult } from '@/lib/types';
import { FireResultCard } from './fire-result-card';
import { generatePdf } from '@/lib/utils';

const formSchema = z.object({
  currentAge: z.coerce.number().min(18),
  retirementAge: z.coerce.number().min(19),
  monthlyExpenses: z.coerce.number().min(1),
  monthlyInvestment: z.coerce.number().min(1),
  expectedReturn: z.coerce.number().default(12),
}).refine(data => data.retirementAge > data.currentAge, {
  message: "Retirement age must be after current age.",
  path: ["retirementAge"],
});

type FormValues = z.infer<typeof formSchema>;

interface FireCalculatorProps {
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  latestReportId: string | null;
}

export function FireCalculator({ setMessages, latestReportId }: FireCalculatorProps) {
  const [result, setResult] = useState<FireCalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentAge: 30,
      retirementAge: 45,
      monthlyExpenses: 75000,
      monthlyInvestment: 100000,
      expectedReturn: 12,
    },
  });

  const onSubmit = (values: FormValues) => {
    setIsCalculating(true);
    setResult(null);
    const resultId = `fire-result-${uuidv4()}`;
    const calculationResult = { ...calculateFire(values), id: resultId };
    
    setTimeout(() => {
        setResult(calculationResult);
        setIsCalculating(false);
        const userQuery: ChatMessage = {
            id: uuidv4(),
            role: 'user',
            content: `Calculate my FIRE projection.`
        };
        const resultMessage: ChatMessage = {
            id: uuidv4(),
            role: 'assistant',
            content: <FireResultCard id={resultId} result={calculationResult} explanation={`Here are your FIRE (Financial Independence, Retire Early) projections based on your current investment plan.`} />
        };
        setMessages(prev => [...prev, userQuery, resultMessage]);
    }, 500);
  };

  return (
    <Card className="rounded-2xl shadow-sm h-full flex flex-col border-0">
      <CardContent className="flex-1 overflow-y-auto pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField control={form.control} name="currentAge" render={({ field }) => ( 
              <FormItem> 
                <FormLabel>Current Age</FormLabel> 
                <FormControl> 
                  <Input type="number" {...field} /> 
                </FormControl> 
                <FormMessage /> 
              </FormItem> 
            )}/>
            <FormField control={form.control} name="retirementAge" render={({ field }) => ( 
              <FormItem> 
                <FormLabel>Target Retirement Age</FormLabel> 
                <FormControl> 
                  <Input type="number" {...field} /> 
                </FormControl> 
                <FormMessage /> 
              </FormItem> 
            )}/>
            <FormField control={form.control} name="monthlyExpenses" render={({ field }) => ( 
              <FormItem> 
                <FormLabel>Current Monthly Expenses (₹)</FormLabel> 
                <FormControl> 
                  <Input type="number" {...field} /> 
                </FormControl> 
                <FormMessage /> 
              </FormItem> 
            )}/>
            <FormField control={form.control} name="monthlyInvestment" render={({ field }) => ( 
              <FormItem> 
                <FormLabel>Current Monthly Investment (₹)</FormLabel> 
                <FormControl> 
                  <Input type="number" {...field} /> 
                </FormControl> 
                <FormMessage /> 
              </FormItem> 
            )}/>
            <FormField control={form.control} name="expectedReturn" render={({ field }) => ( 
              <FormItem> 
                <FormLabel>Expected Return (% p.a.)</FormLabel> 
                <FormControl> 
                  <Input type="number" step="0.5" {...field} /> 
                </FormControl> 
                <FormMessage /> 
              </FormItem> 
            )}/>
            
            <Button type="submit" className="w-full" disabled={isCalculating}>
              {isCalculating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isCalculating ? 'Calculating...' : 'Calculate FIRE'}
            </Button>
          </form>
        </Form>
        {result && (
          <div className="mt-8 space-y-4 text-center">
            <Separator />
            <h3 className="text-lg font-semibold">FIRE Projection</h3>
            <p className={`font-bold ${result.canRetire ? 'text-green-500' : 'text-destructive'}`}>
                {result.canRetire ? "🎉 On Track to FIRE!" : "⚠️ Goal Not Met"}
            </p>
             <div>
                <p className="text-sm text-muted-foreground">Target Corpus</p>
                <p className="font-semibold">₹{result.targetCorpus.toLocaleString('en-IN')}</p>
            </div>
             <div>
                <p className="text-sm text-muted-foreground">Projected Corpus</p>
                <p className="font-semibold">₹{result.projectedCorpus.toLocaleString('en-IN')}</p>
            </div>
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
