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
        keywords: ['tax regime', 'new regime', 'old regime', 'compare', 'deductions', 'slabs', '80c', '80d', 'hra', 'tax']
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
    },
    {
        id: 'emergency-fund-guide',
        sourceName: 'RBI (Reserve Bank of India)',
        url: 'https://www.rbi.org.in/commonperson/English/Scripts/Notification.aspx?Id=3150',
        content: 'An emergency fund is a pool of money set aside to cover unexpected financial shocks, such as job loss, medical emergencies, or urgent home repairs. The ideal size for an emergency fund is 3 to 6 months\' worth of your essential monthly expenses (rent, utilities, groceries, EMIs). This fund should be kept in highly liquid, low-risk instruments. Good options include a high-yield savings account, liquid mutual funds, or short-term Fixed Deposits. Do not invest your emergency fund in volatile assets like stocks, as you may be forced to sell at a loss. It\'s wise to split the fund between two different instruments (e.g., savings account and a liquid fund) for diversification. If you use the fund, your top financial priority should be to replenish it back to its target amount as quickly as possible.',
        keywords: ['emergency fund', 'contingency', 'liquid', 'savings', 'expenses', 'replenish', 'liquid funds', 'fd']
    },
    {
        id: 'insurance-basics',
        sourceName: 'IRDAI (Insurance Regulatory and Development Authority of India)',
        url: 'https://www.irdai.gov.in/ADMINCMS/cms/Uploadedfiles/Poilcyholders_handbook_26052022.pdf',
        content: 'Insurance is a contract where an insurer indemnifies another against losses from specific contingencies. For individuals, Term Insurance and Health Insurance are crucial. A term insurance plan provides a large sum assured to your family in case of your untimely demise, securing their financial future. A good rule of thumb is to have a cover of at least 10-15 times your annual income. Term insurance is pure protection and is much cheaper than ULIPs or endowment plans, which mix insurance and investment, often providing low returns and inadequate cover. Health insurance covers hospitalization costs. It is essential to have a personal health insurance policy even if you have one from your employer, as the employer-provided cover is lost upon job change and may not be sufficient for your family\'s needs. A family floater plan of at least ₹10-15 lakhs is a good starting point for a family of four in a metro city.',
        keywords: ['insurance', 'term plan', 'health insurance', 'ulip', 'endowment', 'cover', 'sum assured', 'employer']
    },
    {
        id: 'real-estate-investing',
        sourceName: 'National Housing Bank (NHB)',
        url: 'https://nhb.org.in/en/',
        content: 'The decision to buy a house versus renting is both a financial and emotional one. Financially, it\'s not always true that rent is "wasted money." Consider the down payment, registration costs, maintenance, and property taxes versus the potential for capital appreciation and tax benefits on a home loan. A common rule of thumb is that your home loan EMI should not exceed 30-40% of your net monthly income. Real estate in India has historically been a good investment, but its returns can be illiquid and are not guaranteed to beat equity over the long term. For investment purposes, REITs (Real Estate Investment Trusts) can offer exposure to real estate with higher liquidity and smaller ticket sizes.',
        keywords: ['real estate', 'house', 'buy', 'rent', 'emi', 'property', 'loan', 'reit']
    },
    {
        id: 'estate-planning-wills',
        sourceName: 'Ministry of Law and Justice, India',
        url: 'https://legalaffairs.gov.in/documents/indian-succession-act-1925',
        content: 'A Will is a legal declaration of a person\'s intention with respect to their property, which they desire to be carried into effect after their death. Having a Will is crucial for smooth transfer of assets and to avoid family disputes. A nominee is merely a trustee or custodian of the asset; they are legally bound to transfer the asset to the legal heir. The legal heir is the person entitled to the property as per the Will or succession laws. If there is a Will, the legal heir is the person named in it. If there is no Will, succession laws of the person\'s religion apply. A Will can be written on plain paper, and registration is not mandatory, though it is advisable to have it witnessed by two individuals who are not beneficiaries. You do not necessarily need a lawyer to draft a simple Will.',
        keywords: ['will', 'estate', 'nominee', 'heir', 'succession', 'assets', 'lawyer', 'registration']
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
