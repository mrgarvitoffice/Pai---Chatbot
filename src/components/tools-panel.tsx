
"use client";

import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TaxCalculator } from './tax-calculator';
import { EmiCalculator } from './emi-calculator';
import { SipCalculator } from './sip-calculator';
import { FdCalculator } from './fd-calculator';
import { RdCalculator } from './rd-calculator';
import { ReverseSipCalculator } from './reverse-sip-calculator';
import { CompoundInterestCalculator } from './compound-interest-calculator';
import { BudgetAllocationCalculator } from './budget-allocation-calculator';
import { RetirementCalculator } from './retirement-calculator';
import { FireCalculator } from './fire-calculator';
import { DtiCalculator } from './dti-calculator';
import { SavingsRatioCalculator } from './savings-ratio-calculator';
import { PortfolioAllocationCalculator } from './portfolio-allocation-calculator';
import { TermInsuranceCalculator } from './term-insurance-calculator';
import { HraCalculator } from './hra-calculator';
import type { ChatMessage } from '@/lib/types';

type Tool = 'tax' | 'emi' | 'sip' | 'fd' | 'rd' | 'reverse_sip' | 'compound_interest' | 'budget' | 'retirement' | 'fire' | 'dti' | 'savings_ratio' | 'portfolio_allocation' | 'term_insurance' | 'hra';

interface ToolsPanelProps {
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  latestReportId: string | null;
}

const toolComponents: Record<Tool, React.ComponentType<{ setMessages: Dispatch<SetStateAction<ChatMessage[]>>, latestReportId: string | null }>> = {
  tax: TaxCalculator,
  emi: EmiCalculator,
  sip: SipCalculator,
  fd: FdCalculator,
  rd: RdCalculator,
  reverse_sip: ReverseSipCalculator,
  compound_interest: CompoundInterestCalculator,
  budget: BudgetAllocationCalculator,
  retirement: RetirementCalculator,
  fire: FireCalculator,
  dti: DtiCalculator,
  savings_ratio: SavingsRatioCalculator,
  portfolio_allocation: PortfolioAllocationCalculator,
  term_insurance: TermInsuranceCalculator,
  hra: HraCalculator,
};

const toolNames: Record<Tool, string> = {
  tax: 'Income Tax Calculator',
  emi: 'Loan EMI Calculator',
  sip: 'SIP Calculator',
  fd: 'FD Calculator',
  rd: 'RD Calculator',
  reverse_sip: 'Reverse SIP Calculator',
  compound_interest: 'Compound Interest Calculator',
  budget: 'Budget Allocator',
  retirement: 'Retirement Planner',
  fire: 'FIRE Calculator',
  dti: 'Debt-to-Income (DTI) Calculator',
  savings_ratio: 'Savings Ratio Calculator',
  portfolio_allocation: 'Portfolio Allocator',
  term_insurance: 'Term Insurance Calculator',
  hra: 'HRA Exemption Calculator',
};

export function ToolsPanel({ setMessages, latestReportId }: ToolsPanelProps) {
  const [activeTool, setActiveTool] = useState<Tool>('tax');

  const ActiveToolComponent = toolComponents[activeTool];
  
  return (
    <Card className="rounded-2xl shadow-sm h-full flex flex-col">
      <CardHeader>
        <CardTitle>
          <Select onValueChange={(value: Tool) => setActiveTool(value)} defaultValue={activeTool}>
            <SelectTrigger className="w-full text-lg font-semibold h-auto border-0 focus:ring-0 shadow-none p-0">
              <SelectValue placeholder="Select a calculator" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(toolNames).map(([key, name]) => (
                <SelectItem key={key} value={key}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <div className="flex-1 overflow-y-auto">
        <ActiveToolComponent setMessages={setMessages} latestReportId={latestReportId} />
      </div>
    </Card>
  );
}
