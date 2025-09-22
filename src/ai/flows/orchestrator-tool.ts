'use server';

/**
 * @fileOverview The main orchestrator flow for Pai Chatbot.
 * This flow uses Genkit tools to route user queries to the appropriate
 * calculator or knowledge base.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { taxCalculatorTool, sipCalculatorTool, emiCalculatorTool, budgetCalculatorTool, fdCalculatorTool, rdCalculatorTool, reverseSipCalculatorTool, retirementCalculatorTool, dtiCalculatorTool, savingsRatioCalculatorTool, portfolioAllocatorTool, termInsuranceCalculatorTool, compoundInterestCalculatorTool } from '../tools/calculators';
import { searchKnowledgeBase } from '../tools/knowledge-base';
import { getDynamicData } from '../tools/dynamic-data';
import type { CalculationResult } from '@/lib/types';
import { compareTaxRegimes } from './compare-tax-regimes';
import type { CompareTaxRegimesInput } from './compare-tax-regimes';
import { calculateTax } from '@/lib/calculators';


const OrchestratorInputSchema = z.object({
  query: z.string().describe("The user's message to the chatbot."),
});
export type OrchestratorInput = z.infer<typeof OrchestratorInputSchema>;

const OrchestratorOutputSchema = z.object({
  response: z.string().describe('The final response to be shown to the user.'),
  sources: z.array(
    z.object({
      name: z.string(),
      url: z.string(),
      last_updated: z.string(),
    })
  ).optional().describe('A list of sources used to generate the response.'),
  calculationResult: z.custom<CalculationResult>().optional().describe('The structured result of a calculation, if performed.'),
});
export type OrchestratorOutput = z.infer<typeof OrchestratorOutputSchema>;

const orchestratorPrompt = ai.definePrompt({
    name: 'orchestratorPrompt',
    tools: [
        taxCalculatorTool, 
        sipCalculatorTool, 
        emiCalculatorTool,
        budgetCalculatorTool,
        fdCalculatorTool,
        rdCalculatorTool,
        reverseSipCalculatorTool,
        retirementCalculatorTool,
        dtiCalculatorTool,
        savingsRatioCalculatorTool,
        portfolioAllocatorTool,
        termInsuranceCalculatorTool,
        compoundInterestCalculatorTool,
        searchKnowledgeBase, 
        getDynamicData
    ],
    prompt: `You are Pai, an expert Indian personal finance assistant. Your primary goal is to provide accurate and helpful answers by using the correct tool based on the user's EXACT query.

    **Analyze the user's query and decide which tool to use. Follow these rules precisely:**

    **RULE 1: PRIORITIZE CALCULATORS**
    If the query contains specific numbers and asks for a calculation (e.g., "how much tax on 10 lakh", "calculate SIP for 5000", "what is the EMI for 50 lakh"), you MUST use one of the available calculator tools. Do NOT use the knowledge base for these.

    **RULE 2: TAX CALCULATION LOGIC (Follow this strictly)**
    - If the user asks for a tax calculation **without specifying a regime** (e.g., "tax on 15L"), you MUST call the 'taxCalculatorTool' with **regime='new'**.
    - If the user explicitly asks for the **'old regime'** (e.g., "tax on 15L under old regime"), you MUST call the 'taxCalculatorTool' with **regime='old'**.
    - If the user asks to **compare regimes** or uses words like "vs", "or", "which is better", "comparison" (e.g., "tax on 15L old vs new"), you MUST call the 'taxCalculatorTool' TWICE: once with regime='new' and once with regime='old'. Do NOT compare if the user does not ask for it.

    **RULE 3: OTHER TOOLS**
    - For conceptual questions (e.g., "what is SIP?", "how to save tax?"), use the 'searchKnowledgeBase' tool.
    - For questions about current rates or values (e.g., "latest PPF rate"), use the 'getDynamicData' tool.

    **RULE 4: FALLBACK**
    If no tool is appropriate, provide a helpful answer from your own knowledge. Do not invent numbers or financial data.

    USER QUERY:
    {{{query}}}
    `,
});

export async function orchestrate(input: OrchestratorInput): Promise<OrchestratorOutput> {
  try {
    const llmResponse = await orchestratorPrompt(input);
    const toolCalls = llmResponse.toolRequests;

    if (toolCalls && toolCalls.length > 0) {
        // Handle Tax Comparison case
        if (toolCalls.length === 2 && toolCalls[0].name === 'taxCalculatorTool' && toolCalls[1].name === 'taxCalculatorTool') {
            const newRegimeInput = toolCalls.find(c => c.input.regime === 'new')?.input;
            const oldRegimeInput = toolCalls.find(c => c.input.regime === 'old')?.input;

            if (newRegimeInput && oldRegimeInput) {
                const newRegimeResult = calculateTax(newRegimeInput.income, newRegimeInput.fy, 'new');
                const oldRegimeResult = calculateTax(oldRegimeInput.income, newRegimeInput.fy, 'old');

                const comparisonInput: CompareTaxRegimesInput = {
                    income: newRegimeInput.income,
                    fy: newRegimeInput.fy,
                    newRegimeResult,
                    oldRegimeResult,
                };
                const comparisonResult = await compareTaxRegimes(comparisonInput);
                return {
                    response: comparisonResult.comparison,
                    calculationResult: { type: 'tax_comparison', data: { new: newRegimeResult, old: oldRegimeResult } }
                };
            }
        }
        
        // Handle Single Tool Call
        const toolCall = toolCalls[0];
        const toolOutput = await toolCall.run(); // This calls our local function

        if (toolCall.name.endsWith('CalculatorTool') || toolCall.name.endsWith('AllocatorTool')) {
            let explanation = `Here are the results for your calculation.`;
            const resultType = toolCall.name.replace('Tool', '').replace('calculator', '_').replace('allocator', '_').replace(/_$/, "");
            
            if (toolCall.name === 'taxCalculatorTool') {
                 explanation = `💰 Here's the income tax summary for FY ${toolCall.input.fy} under the ${toolCall.input.regime} regime.`;
                 return {
                    response: explanation,
                    calculationResult: { type: 'tax', data: toolOutput },
                 }
            }
             if (toolCall.name === 'sipCalculatorTool') explanation = `Based on your inputs, here is the projected future value of your SIP investment of ₹${toolCall.input.monthly_investment.toLocaleString('en-IN')}/month for ${toolCall.input.years} years.`;
             if (toolCall.name === 'emiCalculatorTool') explanation = `For a loan of ₹${toolCall.input.principal.toLocaleString('en-IN')} at ${toolCall.input.annual_rate}% for ${toolCall.input.years} years, your Equated Monthly Installment (EMI) has been calculated.`;
             if (toolCall.name === 'portfolioAllocatorTool') explanation = `Based on your age of ${toolCall.input.age} and a '${toolCall.input.riskAppetite}' risk appetite, here is a suggested asset allocation.`;
             if (toolCall.name === 'termInsuranceCalculatorTool') explanation = `Based on the rule of thumb of having a life cover of at least 10-15 times your annual income, a suitable term insurance cover has been calculated.`;
             if (toolCall.name === 'reverseSipCalculatorTool') explanation = `To reach your goal of ₹${toolCall.input.future_value.toLocaleString('en-IN')} in ${toolCall.input.years} years with an expected return of ${toolCall.input.annual_rate}%, you would need to invest approximately the following amount per month.`;
             if (toolCall.name === 'retirementCalculatorTool') explanation = `To meet your estimated retirement expenses, here is the total corpus you would need to accumulate by the age of ${toolCall.input.retirementAge}.`;
             if (toolCall.name === 'budgetCalculatorTool') explanation = `Based on the 50/30/20 rule, here is a suggested budget allocation for your monthly income of ₹${toolCall.input.monthlyIncome.toLocaleString('en-IN')}.`;
             if (toolCall.name === 'fdCalculatorTool') explanation = `Here is the calculated maturity value for your Fixed Deposit.`;
             if (toolCall.name === 'rdCalculatorTool') explanation = `Here is the calculated maturity value for your Recurring Deposit.`;
             if (toolCall.name === 'dtiCalculatorTool') explanation = `Your Debt-to-Income (DTI) ratio has been calculated based on your provided income and EMI details.`;
             if (toolCall.name === 'savingsRatioCalculatorTool') explanation = `Your Savings Ratio has been calculated based on your provided income and savings details.`;
             if (toolCall.name === 'compoundInterestCalculatorTool') explanation = `The future value of your investment has been calculated with compound interest.`;


            return {
                response: explanation,
                calculationResult: { type: resultType as any, data: toolOutput },
            };
        }
        
        if (toolCall.name === 'searchKnowledgeBase' || toolCall.name === 'getDynamicData') {
             const finalResponseText = llmResponse.text;
             let responseSources: OrchestratorOutput['sources'] = [];
              if (toolCall.name === 'searchKnowledgeBase' && Array.isArray(toolOutput)) {
                    responseSources = toolOutput.map(doc => ({
                        name: `${doc.slug} (v${doc.version})`,
                        url: doc.references?.[0]?.url || '#',
                        last_updated: doc.last_updated,
                    }));
                }
                if (toolCall.name === 'getDynamicData' && toolOutput) {
                     responseSources = [{
                        name: `Source: ${toolOutput.source}`,
                        url: '#',
                        last_updated: toolOutput.last_updated,
                    }];
                }
             
             return {
                 response: finalResponseText,
                 sources: responseSources.length > 0 ? responseSources : undefined,
             }
        }
    }

    const fallbackResponseText = llmResponse.text;
    if (!fallbackResponseText) {
        return { response: "I'm sorry, I couldn't find an answer to that. Could you please rephrase?" };
    }
    return { response: fallbackResponseText };
  } catch (error) {
    console.error("Critical error in orchestrator:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      response: `I'm very sorry, but I encountered a critical error while processing your request. Please try again later. \n\n**Error Details:** ${errorMessage}`,
    };
  }
}
