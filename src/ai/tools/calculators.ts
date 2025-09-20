'use server';

/**
 * @fileOverview Genkit tools for all financial calculators.
 * Each calculator is defined as a tool that the AI can call.
 */

import { ai } from '@/ai/genkit';
import { calculateTax, calculateEMI, budgetAllocation, debtToIncomeRatio, savingsRatio, calculatePortfolioAllocation, calculateSip, calculateFd, calculateRd, calculateReverseSip, compoundFutureValue, calculateRetirementCorpus, calculateTermInsuranceCover } from '@/lib/calculators';
import { z } from 'zod';

// Tax Calculator Tool
export const taxCalculatorTool = ai.defineTool(
  {
    name: 'taxCalculatorTool',
    description: 'Calculates income tax for a given income, fiscal year, and tax regime in India.',
    inputSchema: z.object({
      income: z.number().describe('Annual income in INR.'),
      fy: z.string().describe("Fiscal year (e.g., '2024-25'). Default to current if not specified."),
      regime: z.enum(['new', 'old']).describe('The tax regime to use.'),
    }),
    outputSchema: z.any(),
  },
  async (input) => calculateTax(input.income, input.fy, input.regime)
);

// SIP Calculator Tool
export const sipCalculatorTool = ai.defineTool(
  {
    name: 'sipCalculatorTool',
    description: 'Calculates the future value of a Systematic Investment Plan (SIP).',
    inputSchema: z.object({
      monthly_investment: z.number().describe('Monthly investment amount.'),
      years: z.number().describe('Investment duration in years.'),
      annual_rate: z.number().describe('Expected annual rate of return (default to 12% if not specified).'),
    }),
    outputSchema: z.any(),
  },
  async (input) => calculateSip(input.monthly_investment, input.years, input.annual_rate)
);

// EMI Calculator Tool
export const emiCalculatorTool = ai.defineTool(
  {
    name: 'emiCalculatorTool',
    description: 'Calculates the Equated Monthly Installment (EMI) for a loan.',
    inputSchema: z.object({
      principal: z.number().describe('The principal loan amount.'),
      annual_rate: z.number().describe('Annual interest rate.'),
      years: z.number().describe('Loan duration in years.'),
    }),
    outputSchema: z.any(),
  },
  async (input) => calculateEMI(input.principal, input.annual_rate, input.years)
);

// Budget Calculator Tool
export const budgetCalculatorTool = ai.defineTool(
  {
    name: 'budgetCalculatorTool',
    description: 'Calculates a budget allocation based on the 50/30/20 rule.',
    inputSchema: z.object({
      monthlyIncome: z.number().describe('Total monthly income.'),
    }),
    outputSchema: z.any(),
  },
  async (input) => budgetAllocation(input.monthlyIncome)
);

// FD Calculator Tool
export const fdCalculatorTool = ai.defineTool(
    {
        name: 'fdCalculatorTool',
        description: 'Calculates maturity value of a Fixed Deposit (FD).',
        inputSchema: z.object({
            principal: z.number(),
            annual_rate: z.number(),
            years: z.number(),
        }),
        outputSchema: z.any(),
    },
    async (input) => calculateFd(input.principal, input.annual_rate, input.years, 4)
);

// RD Calculator Tool
export const rdCalculatorTool = ai.defineTool(
    {
        name: 'rdCalculatorTool',
        description: 'Calculates maturity value of a Recurring Deposit (RD).',
        inputSchema: z.object({
            monthly_deposit: z.number(),
            annual_rate: z.number(),
            months: z.number(),
        }),
        outputSchema: z.any(),
    },
    async (input) => calculateRd(input.monthly_deposit, input.annual_rate, input.months)
);

// Reverse SIP Calculator Tool
export const reverseSipCalculatorTool = ai.defineTool(
    {
        name: 'reverseSipCalculatorTool',
        description: 'Calculates monthly SIP needed to reach a target corpus.',
        inputSchema: z.object({
            future_value: z.number(),
            years: z.number(),
            annual_rate: z.number().default(12),
        }),
        outputSchema: z.any(),
    },
    async (input) => calculateReverseSip(input.future_value, input.years, input.annual_rate)
);

// Retirement Calculator Tool
export const retirementCalculatorTool = ai.defineTool(
    {
        name: 'retirementCalculatorTool',
        description: 'Calculates the required retirement corpus.',
        inputSchema: z.object({
            currentAge: z.number(),
            retirementAge: z.number(),
            monthlyExpenses: z.number(),
        }),
        outputSchema: z.any(),
    },
    async (input) => calculateRetirementCorpus(input)
);

// DTI Calculator Tool
export const dtiCalculatorTool = ai.defineTool(
    {
        name: 'dtiCalculatorTool',
        description: 'Calculates Debt-to-Income (DTI) ratio.',
        inputSchema: z.object({
            monthlyIncome: z.number(),
            monthlyEmi: z.number(),
        }),
        outputSchema: z.any(),
    },
    async (input) => debtToIncomeRatio(input.monthlyIncome, input.monthlyEmi)
);

// Savings Ratio Calculator Tool
export const savingsRatioCalculatorTool = ai.defineTool(
    {
        name: 'savingsRatioCalculatorTool',
        description: 'Calculates the personal savings ratio.',
        inputSchema: z.object({
            monthlyIncome: z.number(),
            monthlySavings: z.number(),
        }),
        outputSchema: z.any(),
    },
    async (input) => savingsRatio(input.monthlyIncome, input.monthlySavings)
);

// Portfolio Allocator Tool
export const portfolioAllocatorTool = ai.defineTool(
    {
        name: 'portfolioAllocatorTool',
        description: 'Recommends a portfolio allocation based on age and risk.',
        inputSchema: z.object({
            age: z.number(),
            riskAppetite: z.enum(['low', 'medium', 'high']),
        }),
        outputSchema: z.any(),
    },
    async (input) => calculatePortfolioAllocation(input.age, input.riskAppetite)
);

// Term Insurance Calculator Tool
export const termInsuranceCalculatorTool = ai.defineTool(
    {
        name: 'termInsuranceCalculatorTool',
        description: 'Calculates recommended term insurance cover.',
        inputSchema: z.object({
            annualIncome: z.number(),
        }),
        outputSchema: z.any(),
    },
    async (input) => calculateTermInsuranceCover(input.annualIncome)
);
