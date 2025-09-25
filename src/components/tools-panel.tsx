
"use client";

import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TaxCalculator } from './tax-calculator';
import { EmiCalculator } from './emi-calculator';
import { SipCalculator } from './sip-calculator';
import { FdCalculator } from './fd-calculator';
import type { ChatMessage } from '@/lib/types';

type Tool = 'tax' | 'emi' | 'sip' | 'fd';

interface ToolsPanelProps {
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
}

export function ToolsPanel({ setMessages }: ToolsPanelProps) {
  const [activeTool, setActiveTool] = useState<Tool>('tax');

  const renderActiveTool = () => {
    switch (activeTool) {
      case 'tax':
        return <TaxCalculator setMessages={setMessages} />;
      case 'emi':
        return <EmiCalculator setMessages={setMessages} />;
      case 'sip':
        return <SipCalculator setMessages={setMessages} />;
      case 'fd':
        return <FdCalculator setMessages={setMessages} />;
      default:
        return <TaxCalculator setMessages={setMessages} />;
    }
  };
  
  const getToolName = (tool: Tool) => {
      switch (tool) {
          case 'tax': return 'Income Tax Calculator';
          case 'emi': return 'Loan EMI Calculator';
          case 'sip': return 'SIP Calculator';
          case 'fd': return 'FD Calculator';
          default: return 'Select a Tool';
      }
  }

  return (
    <Card className="rounded-2xl shadow-sm h-full flex flex-col">
      <CardHeader>
        <CardTitle>
          <Select onValueChange={(value: Tool) => setActiveTool(value)} defaultValue={activeTool}>
            <SelectTrigger className="w-full text-lg font-semibold h-auto border-0 focus:ring-0 shadow-none p-0">
              <SelectValue placeholder="Select a calculator" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tax">Income Tax Calculator</SelectItem>
              <SelectItem value="emi">Loan EMI Calculator</SelectItem>
              <SelectItem value="sip">SIP Calculator</SelectItem>
              <SelectItem value="fd">FD Calculator</SelectItem>
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <div className="flex-1 overflow-y-auto">
        {renderActiveTool()}
      </div>
    </Card>
  );
}
