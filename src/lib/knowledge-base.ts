// This is a simplified, in-memory simulation of a vector database / knowledge base.
// In a production app, this would be replaced with a real vector DB like Pinecone or Milvus.

interface Document {
    id: string;
    sourceName: string;
    url: string;
    content: string;
    keywords: string[];
}

const documents: Document[] = [
    {
        id: 'tax-regimes-explained',
        sourceName: 'Income Tax Department of India',
        url: 'https://incometaxindia.gov.in/',
        content: 'India offers two tax regimes for individuals: the Old Regime and the New Regime. The New Regime is the default option but you can opt for the Old Regime. The New Regime offers lower, simplified tax slabs but disallows most common deductions and exemptions like those under Section 80C (PPF, ELSS), 80D (health insurance), and HRA. It includes a standard deduction of ₹50,000. The Old Regime has higher tax slabs but allows you to claim over 70 deductions and exemptions to reduce your taxable income. The choice depends on your financial profile. If you have significant investments in tax-saving instruments and claim deductions like HRA, the Old Regime may be more beneficial. If you have minimal deductions, the New Regime\'s lower rates might save you more tax.',
        keywords: ['tax regime', 'new regime', 'old regime', 'compare', 'deductions', 'slabs', '80c', '80d', 'hra']
    },
    {
        id: 'mutual-funds-101',
        sourceName: 'AMFI (Association of Mutual Funds in India)',
        url: 'https://www.amfiindia.com/investor-corner/knowledge-center/what-are-mutual-funds',
        content: 'A mutual fund is a company that pools money from many investors and invests the money in securities such as stocks, bonds, and short-term debt. The combined holdings of the mutual fund are known as its portfolio. Investors buy shares in mutual funds. Each share represents an investor’s part ownership in the fund and the income it generates. Direct plans have lower expense ratios than Regular plans, leading to higher returns. For beginners, a good starting point is an Index Fund, such as one that tracks the Nifty 50 or Sensex. SIP (Systematic Investment Plan), STP (Systematic Transfer Plan), and SWP (Systematic Withdrawal Plan) are different methods for investing in or redeeming from mutual funds.',
        keywords: ['mutual fund', 'investment', 'sip', 'nav', 'portfolio', 'securities', 'stp', 'swp', 'direct', 'regular', 'beginner', 'index', 'nifty', 's&p 500']
    },
    {
        id: 'goal-based-investing',
        sourceName: 'SEBI Investor Education',
        url: 'https://investor.sebi.gov.in/',
        content: 'Goal-based investing is a strategy where you invest for specific financial goals, such as buying a house, funding a child\'s education, or retirement. Each goal has a target amount and a time horizon. This is better than random investing because it provides a clear purpose and discipline. You should ideally have separate portfolios or SIPs for each major goal to track progress effectively. Common mistakes include not accounting for inflation, choosing overly conservative or aggressive investments for the goal\'s timeframe, and not increasing SIPs with income growth. The priority of goals is personal, but a widely accepted hierarchy is: 1) Emergency Fund, 2) Retirement, 3) Other long-term goals (e.g., child\'s education), and 4) Short-term goals (e.g., car, vacation).',
        keywords: ['goal-based', 'goal', 'investing', 'sip', 'mistakes', 'priority', 'retirement', 'child', 'house']
    }
];

/**
 * Searches the document store for content relevant to the query.
 * This is a basic keyword search simulation. A real implementation would use vector embeddings.
 * @param query The user's search query.
 * @returns A list of relevant document chunks.
 */
export async function searchDocuments(query: string): Promise<Array<{ sourceName: string; url: string; content: string }>> {
    const queryKeywords = query.toLowerCase().split(/\s+/);
    
    const relevantDocs = documents.filter(doc => 
        doc.keywords.some(keyword => queryKeywords.includes(keyword))
    );

    if (relevantDocs.length === 0) {
        // Fallback for partial matches
        const lowerCaseQuery = query.toLowerCase();
        const allDocsWithScores = documents.map(doc => {
            const score = doc.keywords.reduce((acc, keyword) => {
                if (lowerCaseQuery.includes(keyword)) {
                    return acc + 1;
                }
                return acc;
            }, 0);
            return { ...doc, score };
        }).filter(doc => doc.score > 0);

        if (allDocsWithScores.length > 0) {
            allDocsWithScores.sort((a, b) => b.score - a.score);
            return [allDocsWithScores[0]].map(({ sourceName, url, content }) => ({ sourceName, url, content }));
        }
    }

    return relevantDocs.map(({ sourceName, url, content }) => ({ sourceName, url, content }));
}
