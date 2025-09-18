// In a real app, you'd remove the local data and the check.
import { documents as localDocuments } from './knowledge-base-data'; 

/**
 * Searches the document store for content relevant to the query.
 * This is a basic keyword search simulation. A real implementation would use vector embeddings
 * or a more sophisticated search index like Algolia or Firestore's native search.
 * @param query The user's search query.
 * @returns A list of relevant document chunks.
 */
export async function searchDocuments(query: string): Promise<Array<{ sourceName: string; url: string; content: string }>> {
    console.log("Searching for documents related to:", query);
    
    // This is a simple fallback to use local data if Firestore is not configured.
    // In a production app, you would remove this and rely solely on the database.
    try {
        // NOTE: The Firestore implementation is commented out as it requires a real Firebase project.
        // To use it, you would uncomment this section, set up Firestore, and add your data.
        
        // const { db } = await import('./firebase');
        // const { collection, query: firestoreQuery, where, getDocs } = await import('firebase/firestore');
        
        // const keywords = query.toLowerCase().split(/\s+/).filter(k => k.length > 2);
        // if (keywords.length === 0) return [];
        
        // const q = firestoreQuery(
        //     collection(db, "knowledge_base"),
        //     where("keywords", "array-contains-any", keywords)
        // );
        
        // const querySnapshot = await getDocs(q);
        // const results = querySnapshot.docs.map(doc => doc.data());

        // if (results.length > 0) {
        //     console.log(`Found ${results.length} documents in Firestore.`);
        //     return results.map(({ sourceName, url, content }) => ({ sourceName, url, content }));
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
function searchLocalDocuments(query: string): Array<{ sourceName: string; url: string; content: string }> {
    const queryKeywords = query.toLowerCase().split(/\s+/);
    
    const relevantDocs = localDocuments.filter(doc => 
        doc.keywords.some(keyword => queryKeywords.includes(keyword))
    );

    if (relevantDocs.length > 0) {
         console.log(`Found ${relevantDocs.length} documents in local data.`);
        return relevantDocs.map(({ sourceName, url, content }) => ({ sourceName, url, content }));
    }

    // Fallback for partial matches if no direct keyword match is found
    const lowerCaseQuery = query.toLowerCase();
    const allDocsWithScores = localDocuments.map(doc => {
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
        console.log(`Found ${allDocsWithScores.length} documents with partial match in local data.`);
        return [allDocsWithScores[0]].map(({ sourceName, url, content }) => ({ sourceName, url, content }));
    }
    
    console.log("No relevant documents found in local data.");
    return [];
}
