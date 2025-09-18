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
        id: 'inflation-basics',
        sourceName: 'Reserve Bank of India (RBI)',
        url: 'https://www.rbi.org.in/commonperson/English/Scripts/Notification.aspx?Id=3031',
        content: 'Inflation refers to the rate at which the general level of prices for goods and services is rising, and subsequently, purchasing power of currency is falling. The RBI closely monitors inflation as a key measure of economic stability. The Consumer Price Index (CPI) is a common measure of inflation.',
        keywords: ['inflation', 'cpi', 'rbi', 'economy', 'purchasing power', 'prices']
    },
    {
        id: 'hra-explained',
        sourceName: 'Income Tax Department of India',
        url: 'https://incometaxindia.gov.in/tutorials/14-hra.html',
        content: 'House Rent Allowance (HRA) is a component of salary which is provided by an employer to an employee for meeting the cost of renting a house. An employee can claim exemption for HRA under the Income-tax Act. The exemption is the minimum of: 1) Actual HRA received, 2) 50% of salary for those living in metro cities (40% for non-metros), or 3) Rent paid in excess of 10% of salary.',
        keywords: ['hra', 'house rent allowance', 'tax', 'exemption', 'salary', 'rent']
    },
    {
        id: 'term-insurance-vs-ulip',
        sourceName: 'IRDAI (Insurance Regulatory and Development Authority of India)',
        url: 'https://www.irdai.gov.in/',
        content: 'Term insurance is a pure life insurance product that offers a large amount of coverage at a low premium. It provides a death benefit to the nominee if the insured person dies during the policy term. ULIPs (Unit Linked Insurance Plans) and Endowment plans are investment-cum-insurance products. They offer a death benefit along with a maturity benefit. For most individuals, a combination of term insurance for protection and mutual funds for wealth creation is a more efficient strategy than buying ULIPs or endowment plans. A good term insurance cover is generally 10-15 times your annual income.',
        keywords: ['term insurance', 'ulip', 'endowment', 'insurance', 'life insurance', 'investment', 'cover']
    },
    {
        id: 'tax-on-mf',
        sourceName: 'Income Tax Department of India',
        url: 'https://www.incometax.gov.in/',
        content: 'Gains from mutual funds are taxed under "Capital Gains". For equity funds, if held for more than 12 months, it\'s a Long-Term Capital Gain (LTCG), taxed at 10% on gains above ₹1 lakh. If held for less than 12 months, it\'s a Short-Term Capital Gain (STCG), taxed at 15%. For debt funds, after April 2023, gains are added to your income and taxed at your applicable slab rate, irrespective of the holding period.',
        keywords: ['tax', 'mutual fund', 'ltcg', 'stcg', 'capital gains', 'equity', 'debt', 'taxed']
    },
    {
        id: 'section-80c-80d',
        sourceName: 'Income Tax Department of India',
        url: 'https://www.incometax.gov.in/',
        content: 'Section 80C of the Income Tax Act allows a deduction of up to ₹1.5 lakh from your gross total income. Popular investments under 80C include Employee Provident Fund (EPF), Public Provident Fund (PPF), Equity Linked Savings Scheme (ELSS), National Savings Certificate (NSC), and life insurance premiums. Section 80D provides a tax deduction for health insurance premiums paid for self, spouse, children, and parents.',
        keywords: ['80c', '80d', 'tax', 'deduction', 'epf', 'ppf', 'elss', 'health insurance', 'tax-saving']
    },
    {
        id: 'asset-allocation',
        sourceName: 'SEBI Investor Education',
        url: 'https://investor.sebi.gov.in/clearing-and-settlement/investor-education-and-awareness-initiatives.html',
        content: 'Asset allocation is the strategy of dividing your investment portfolio among different asset categories, such as stocks (equity), bonds (debt), and gold. The ideal allocation depends on your age, financial goals, and risk tolerance. A common rule of thumb is the "100 minus age" rule, which suggests subtracting your age from 100 to determine the percentage of your portfolio that should be in equity. For example, a 30-year-old might have 70% in equity and 30% in debt. Portfolios should be rebalanced periodically, typically once a year, to maintain the desired allocation.',
        keywords: ['asset allocation', 'portfolio', 'rebalance', 'equity', 'debt', 'gold', 'investment', 'real estate']
    },
    {
        id: 'retirement-planning',
        sourceName: 'NPS & PFRDA',
        url: 'https://www.pfrda.org.in/',
        content: 'Retirement planning involves determining your retirement income goals and the actions needed to achieve them. The required corpus depends on your post-retirement expenses, inflation, and life expectancy. A common goal is to build a corpus that allows for a Safe Withdrawal Rate (SWR) of 3-4% per year. For retirement, a mix of investments is recommended. NPS offers tax benefits and market-linked returns. PPF provides guaranteed returns and is tax-free. Equity mutual funds offer the potential for higher long-term growth. FDs are safe but may not beat inflation.',
        keywords: ['retirement', 'corpus', 'nps', 'ppf', 'swr', 'safe withdrawal rate', 'pension', 'withdrawals']
    },
    {
        id: 'emergency-fund',
        sourceName: 'RBI Retail Direct',
        url: 'https://rbiretaildirect.org.in/',
        content: 'An emergency fund is money set aside to cover unexpected financial emergencies. A general rule is to have at least 6 to 12 months\' worth of essential living expenses. This fund should be kept in highly liquid and safe instruments, such as a high-yield savings account, liquid mutual funds, or short-term Fixed Deposits. It should not be invested in volatile assets like stocks.',
        keywords: ['emergency fund', 'contingency', 'liquid', 'savings', 'expenses']
    },
    {
        id: 'health-insurance',
        sourceName: 'IRDAI (Insurance Regulatory and Development Authority of India)',
        url: 'https://www.irdai.gov.in/',
        content: 'It is highly recommended to have a personal health insurance policy even if you are covered by your employer. Employer-provided insurance is tied to your job and may not be sufficient for your family\'s needs. A separate policy ensures continuous coverage. For a family, a family floater plan of at least ₹10-15 lakhs is a good starting point in today\'s healthcare environment.',
        keywords: ['health insurance', 'employer', 'family', 'cover']
    },
    {
        id: 'rent-vs-buy',
        sourceName: 'Internal Financial Principles',
        url: '#',
        content: 'The decision to buy a house or rent depends on financial and emotional factors. Financially, buying makes sense if the annual rent is a significant percentage (e.g., >4-5%) of the property value and you plan to stay for the long term (7+ years). A common guideline is that your home loan EMI should not exceed 30-40% of your take-home income. Renting offers flexibility and frees up capital for other investments that may offer higher returns than real estate.',
        keywords: ['rent', 'buy', 'house', 'emi', 'real estate']
    },
    {
        id: 'wills-and-estate',
        sourceName: 'Indian Succession Act, 1925',
        url: '#',
        content: 'A Will is a legal declaration of a person\'s intention with respect to their property, which they desire to be carried into effect after their death. Having a Will is crucial to ensure your assets are distributed as per your wishes. A nominee is merely a trustee or caretaker of your assets; the legal heir is the one entitled to the property as per the Will or succession laws. A Will can be written on plain paper and does not need to be registered, but it must be signed by the testator in the presence of two witnesses.',
        keywords: ['will', 'estate', 'nominee', 'heir', 'succession', 'lawyer']
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
