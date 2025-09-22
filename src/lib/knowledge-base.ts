// In a real app, you'd remove the local data and the check.
import { documents as localDocuments, RulebookDocument } from './static-rulebook-data'; 

// This will act as our in-memory database, starting with the static data.
let documentStore: RulebookDocument[] = [...localDocuments];

/**
 * Searches the document store for content relevant to the query.
 * @param query The user's search query.
 * @returns A list of relevant document chunks.
 */
export async function searchDocuments(query: string): Promise<RulebookDocument[]> {
    console.log("Searching for rulebook entries related to:", query);
    const queryKeywords = query.toLowerCase().split(/\s+/).filter(k => k.length > 2);
    
    const relevantDocs = documentStore.filter(doc => 
        doc.tags.some(tag => queryKeywords.some(queryWord => tag.includes(queryWord))) ||
        queryKeywords.some(queryWord => doc.title.toLowerCase().includes(queryWord))
    );

    if (relevantDocs.length > 0) {
        console.log(`Found ${relevantDocs.length} documents in the store.`);
        return relevantDocs.slice(0, 3);
    }
    
    console.log("No relevant documents found in the store.");
    return [];
}

/**
 * Adds a new document to our in-memory store.
 * In a real app, this would write to a Firestore collection.
 * @param newDoc The new document to add.
 */
export async function addDocument(newDoc: RulebookDocument): Promise<void> {
    console.log(`Adding new document to store with slug: ${newDoc.slug}`);
    
    // Prevent duplicates by checking slug
    const exists = documentStore.some(doc => doc.slug === newDoc.slug);
    if (!exists) {
        documentStore.unshift(newDoc); // Add to the beginning of the array
        console.log(`Document added. Store size is now ${documentStore.length}`);
    } else {
        console.log(`Document with slug ${newDoc.slug} already exists. Not adding.`);
    }
}


export type { RulebookDocument };
