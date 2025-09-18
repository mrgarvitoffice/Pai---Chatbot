// In a real app, you'd remove the local data and the check.
import { documents as localDocuments } from './static-rulebook-data'; 

/**
 * Searches the document store for content relevant to the query.
 * This is a basic keyword search simulation based on tags. A real implementation 
 * would use Firestore's native capabilities or semantic vector search as per the blueprint.
 * @param query The user's search query.
 * @returns A list of relevant document chunks.
 */
export async function searchDocuments(query: string) {
    console.log("Searching for rulebook entries related to:", query);
    
    // This is a simple fallback to use local data as we cannot connect to a real DB.
    // In a production app, you would replace the call to `searchLocalDocuments`
    // with your actual Firestore query logic.
    try {
        // NOTE: The Firestore implementation would go here.
        // const { db } = await import('./firebase');
        // ... Firestore query logic ...
        
        // Simulating a "not found" scenario to rely on the local fallback
        if (false) {
            // This block is intentionally unreachable to demonstrate the fallback.
            // In a real app, you'd have your Firestore logic here.
            return []; 
        }

        return searchLocalDocuments(query);

    } catch (error) {
        console.warn("Firestore search failed, falling back to local data:", (error as Error).message);
        return searchLocalDocuments(query);
    }
}


/**
 * Local fallback search function.
 */
function searchLocalDocuments(query: string) {
    const queryKeywords = query.toLowerCase().split(/\s+/).filter(k => k.length > 2);
    
    // Find documents where at least one tag matches a keyword in the query.
    const relevantDocs = localDocuments.filter(doc => 
        doc.tags.some(tag => queryKeywords.some(queryWord => tag.includes(queryWord)))
    );

    if (relevantDocs.length > 0) {
        console.log(`Found ${relevantDocs.length} documents in local data.`);
        // Return top 3 matches as per blueprint
        return relevantDocs.slice(0, 3);
    }
    
    console.log("No relevant documents found in local data.");
    return [];
}

