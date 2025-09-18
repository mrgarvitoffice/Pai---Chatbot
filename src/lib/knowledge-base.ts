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
    
    // This is a simple fallback to use local data if Firestore is not configured.
    // In a production app, you would remove this and rely solely on the database.
    try {
        // NOTE: The Firestore implementation is commented out as it requires a real Firebase project.
        // To use it, you would uncomment this section, set up Firestore, and add your data.
        
        // const { db } = await import('./firebase');
        // const { collection, query: firestoreQuery, where, getDocs, limit } = await import('firebase/firestore');
        
        // const keywords = query.toLowerCase().split(/\s+/).filter(k => k.length > 2);
        // if (keywords.length === 0) return [];
        
        // const q = firestoreQuery(
        //     collection(db, "static_rulebook"),
        //     where("tags", "array-contains-any", keywords),
        //     limit(3) // Only retrieve top 3 as per the blueprint
        // );
        
        // const querySnapshot = await getDocs(q);
        // const results = querySnapshot.docs.map(doc => doc.data());

        // if (results.length > 0) {
        //     console.log(`Found ${results.length} documents in Firestore.`);
        //     return results;
        // }

        throw new Error("Firestore not configured or no results found, using local fallback.");

    } catch (error) {
        console.warn("Firestore search failed, falling back to local data:", (error as Error).message);
        return searchLocalDocuments(query);
    }
}


/**
 * Local fallback search function.
 */
function searchLocalDocuments(query: string) {
    const queryKeywords = query.toLowerCase().split(/\s+/);
    
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
