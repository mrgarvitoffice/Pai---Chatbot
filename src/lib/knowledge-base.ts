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
        content: 'A mutual fund is a company that pools money from many investors and invests the money in securities such as stocks, bonds, and short-term debt. The combined holdings of the mutual fund are known as its portfolio. Investors buy shares in mutual funds. Each share represents an investor’s part ownership in the fund and the income it generates.',
        keywords: ['mutual fund', 'investment', 'sip', 'nav', 'portfolio', 'securities', 'stp', 'swp', 'direct', 'regular']
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
        content: 'Term insurance is a pure life insurance product that offers a large amount of coverage at a low premium. It provides a death benefit to the nominee if the insured person dies during the policy term. ULIPs (Unit Linked Insurance Plans) and Endowment plans are investment-cum-insurance products. They offer a death benefit along with a maturity benefit. However, their premiums are much higher and returns are often lower compared to a combination of term insurance and mutual funds.',
        keywords: ['term insurance', 'ulip', 'endowment', 'insurance', 'life insurance', 'investment']
    },
    {
        id: 'tax-on-mf',
        sourceName: 'Income Tax Department of India',
        url: 'https://www.incometax.gov.in/',
        content: 'Gains from mutual funds are taxed under "Capital Gains". For equity funds, if held for more than 12 months, it\'s a Long-Term Capital Gain (LTCG), taxed at 10% on gains above ₹1 lakh. If held for less than 12 months, it\'s a Short-Term Capital Gain (STCG), taxed at 15%. For debt funds, after April 2023, gains are added to your income and taxed at your applicable slab rate, irrespective of the holding period.',
        keywords: ['tax', 'mutual fund', 'ltcg', 'stcg', 'capital gains', 'equity', 'debt']
    },
    {
        id: 'section-80c-80d',
        sourceName: 'Income Tax Department of India',
        url: 'https://www.incometax.gov.in/',
        content: 'Section 80C of the Income Tax Act allows a deduction of up to ₹1.5 lakh from your gross total income. Popular investments under 80C include Employee Provident Fund (EPF), Public Provident Fund (PPF), Equity Linked Savings Scheme (ELSS), National Savings Certificate (NSC), and life insurance premiums. Section 80D provides a tax deduction for health insurance premiums paid for self, spouse, children, and parents.',
        keywords: ['80c', '80d', 'tax', 'deduction', 'epf', 'ppf', 'elss', 'health insurance']
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

    return relevantDocs.map(({ sourceName, url, content }) => ({ sourceName, url, content }));
}

    