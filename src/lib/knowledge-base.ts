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
        keywords: ['mutual fund', 'investment', 'sip', 'nav', 'portfolio', 'securities']
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

    