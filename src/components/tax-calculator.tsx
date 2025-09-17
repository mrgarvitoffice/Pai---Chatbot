"use client";

import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { getTaxExplanationAction } from '@/lib/actions';
import { calculateTax } from '@/lib/calculators';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Loader2, Sparkles, FileDown } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { ChatMessage, TaxCalculationResult } from '@/lib/types';

const formSchema = z.object({
  income: z.coerce.number().min(1, { message: 'Income must be greater than 0.' }),
  fy: z.string().default('2024-25'),
  regime: z.enum(['new', 'old']).default('new'),
});

type TaxFormValues = z.infer<typeof formSchema>;

interface TaxCalculatorProps {
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
}

export function TaxCalculator({ setMessages }: TaxCalculatorProps) {
  const [result, setResult] = useState<TaxCalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);

  const form = useForm<TaxFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      income: 1500000,
      fy: '2024-25',
      regime: 'new',
    },
  });

  const onSubmit = (values: TaxFormValues) => {
    setIsCalculating(true);
    setResult(null);
    const calculationResult = calculateTax(values.income, values.fy, values.regime);
    
    // Simulate calculation time
    setTimeout(() => {
        setResult(calculationResult);
        setIsCalculating(false);
        const resultMessage: ChatMessage = {
            id: uuidv4(),
            role: 'assistant',
            content: `For a salary of ₹${values.income.toLocaleString('en-IN')} under the ${values.regime} regime for FY ${values.fy}, the calculated total tax is ₹${calculationResult.total_tax.toLocaleString('en-IN')}. See the detailed breakdown on the right.`
        }
        const userQuery: ChatMessage = {
            id: uuidv4(),
            role: 'user',
            content: `Calculate tax for ₹${values.income.toLocaleString('en-IN')} (FY ${values.fy}, ${values.regime} regime)`
        }
        setMessages(prev => [...prev, userQuery, resultMessage])

    }, 500);
  };

  const handleExplain = async () => {
    if (!result || !form.getValues().income) return;
    setIsExplaining(true);
    const explanationResult = await getTaxExplanationAction({
      income: form.getValues().income,
      fy: form.getValues().fy,
      tax_breakdown: result.tax_breakdown,
      total_tax: result.total_tax,
    });
    
    const explanationMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: (
            <div>
                <p>{explanationResult.explanation}</p>
                <div className="mt-4 text-xs">
                    <p className="font-semibold">Sources:</p>
                    <ul className="list-disc pl-4">
                        {explanationResult.sources.map(source => (
                            <li key={source.url}>
                                <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                                    {source.name} (Updated: {source.last_updated})
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    };
    setMessages(prev => [...prev, explanationMessage]);
    setIsExplaining(false);
  };

  return (
    <Card className="rounded-2xl shadow-sm h-full flex flex-col">
      <CardHeader>
        <CardTitle>Income Tax Calculator</CardTitle>
        <CardDescription>Calculate your tax for FY 2024-25</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="income"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Annual Income (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 1500000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="regime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax Regime</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a tax regime" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="new">New Regime (Default)</SelectItem>
                      <SelectItem value="old">Old Regime</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isCalculating}>
              {isCalculating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isCalculating ? 'Calculating...' : 'Calculate Tax'}
            </Button>
          </form>
        </Form>
        {result && (
          <div className="mt-8 space-y-4">
            <Separator />
            <h3 className="text-lg font-semibold text-center">Calculation Results</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Taxable Income</p>
                <p className="font-semibold text-lg">₹{result.taxable_income.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Tax</p>
                <p className="font-semibold text-lg text-primary">₹{result.total_tax.toLocaleString('en-IN')}</p>
              </div>
            </div>
             <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="font-code text-sm">How we calculated this</AccordionTrigger>
                <AccordionContent>
                    <div className="space-y-2 text-sm font-code text-muted-foreground">
                        {Object.entries(result.tax_breakdown).map(([key, value]) => (
                             <div key={key} className="flex justify-between">
                                <span>{key}</span>
                                <span>₹{value.toLocaleString('en-IN')}</span>
                            </div>
                        ))}
                        <Separator />
                         <div className="flex justify-between font-semibold text-foreground">
                            <span>Total Tax</span>
                            <span>₹{result.total_tax.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
      </CardContent>
       <CardFooter className="flex-col items-stretch gap-2 !pt-6">
        {result && (
            <Button variant="outline" onClick={handleExplain} disabled={isExplaining} className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                {isExplaining ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                )}
                Explain with AI
            </Button>
        )}
        <Button variant="secondary" disabled>
            <FileDown className="mr-2 h-4 w-4" />
            Download Report as PDF
        </Button>
       </CardFooter>
    </Card>
  );
}
