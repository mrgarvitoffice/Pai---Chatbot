// In a real app, this file would not exist. The data would be ingested into Firestore
// by your scheduled jobs (Cloud Functions, etc.). This file serves as a local mock
// and a reference for the data structure you should use in your `dynamic_data` collection.

interface DynamicDocument {
    source: string;
    slug: string;
    category: string;
    [key: string]: any; // Allows for flexible document structures
    last_updated: string;
}

const documents: DynamicDocument[] = [
    // CBDT - Tax Slabs
    {
        "source": "CBDT",
        "slug": "income-tax-slabs-fy24-25-new",
        "category": "tax",
        "fy": "2024-25",
        "regime": "new",
        "slabs": [
            { "min": 0, "max": 300000, "rate": 0 },
            { "min": 300001, "max": 600000, "rate": 0.05 },
            { "min": 600001, "max": 900000, "rate": 0.10 },
            { "min": 900001, "max": 1200000, "rate": 0.15 },
            { "min": 1200001, "max": 1500000, "rate": 0.20 },
            { "min": 1500001, "max": null, "rate": 0.30 }
        ],
        "details": {
             "rebate_limit": 700000,
             "standard_deduction": 50000,
             "cess": 0.04
        },
        "last_updated": "2024-04-01T00:00:00Z"
    },
    // RBI - Repo Rate
    {
        "source": "RBI",
        "slug": "repo-rate",
        "category": "rates",
        "value": 6.50,
        "unit": "%",
        "last_updated": "2024-08-08T10:00:00Z"
    },
    // RBI - PPF Rate
     {
        "source": "RBI",
        "slug": "ppf-interest-rate",
        "category": "rates",
        "value": 7.1,
        "unit": "%",
        "last_updated": "2024-07-01T00:00:00Z"
    },
    // FD Aggregator - Sample
    {
        "source": "FD_AGGREGATOR",
        "slug": "sbi-fd-1y",
        "category": "fd-rates",
        "details": {
            "bank": "State Bank of India",
            "tenor_days": 365,
            "rate_general": 6.8,
            "rate_senior": 7.3,
        },
        "last_updated": "2024-09-01T00:00:00Z"
    }
];


/**
 * Simulates fetching a single document from the `dynamic_data` collection in Firestore.
 * @param slug The document ID to fetch.
 * @returns The document data or throws an error if not found.
 */
export async function getDocument(slug: string) {
    console.log("Searching for dynamic data with slug:", slug);
    const doc = documents.find(d => d.slug === slug);

    if (!doc) {
        console.error(`Dynamic data with slug '${slug}' not found.`);
        throw new Error(`Dynamic data with slug '${slug}' not found.`);
    }
    
    console.log("Found dynamic data:", doc);
    return doc;
}
