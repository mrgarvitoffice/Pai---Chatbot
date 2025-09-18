// This file contains the data that you should upload to your Firestore "static_rulebook" collection.
// This data structure and content are based on the user's detailed production-ready guide.

interface RulebookDocument {
    slug: string;
    title: string;
    category: string;
    tags: string[];
    short_answer: string;
    detailed_markdown: string;
    formulas?: { name: string; expr: string; notes: string }[];
    constants?: Record<string, any>;
    examples?: { input: string; output: string }[];
    author: string;
    approver: string;
    version: string;
    status: 'published' | 'draft';
    created_at: string;
    last_updated: string;
    references: { name: string; url?: string }[];
    locale: 'en-IN';
    read_time_seconds: number;
}

export const documents: RulebookDocument[] = [
    {
        "slug": "asset-allocation-by-age",
        "title": "Asset allocation by age (100 − age rule)",
        "category": "Asset Allocation & Portfolio",
        "tags": ["asset-allocation", "age-rule", "equity", "debt", "gold", "portfolio", "rebalance"],
        "short_answer": "A common guideline is 100 − age = % in equity (adjust to risk profile).",
        "detailed_markdown": "# Asset allocation by age (100 − age rule)\n\n*Short rule:* Use 100 − age as a starting guideline for % in equity. For conservative planning use 90 − age or 110 − age for more growth.\n\n*Why it matters:* Younger investors have longer time horizons and can tolerate volatility; allocation should match goals and risk tolerance.\n\n*Steps to apply:*\n1. Calculate base equity = 100 − age.\n2. Adjust by ±10–15% based on risk tolerance.\n3. Decide debt vs gold split for remaining allocation.\n4. Rebalance annually or when allocation drifts >5%.\n\n*Examples:*\n- Age 25 → Equity ≈ 75% (100−25), Debt+Gold ≈ 25%.\n- Age 45 → Equity ≈ 55%, Debt+Gold ≈ 45%.\n\n*Caveats:* This is a guideline, not personalized advice. For near-term goals (<3 years) reduce equity exposure.",
        "author": "System",
        "approver": "System",
        "version": "1.0",
        "status": "published",
        "created_at": "2024-01-01T10:00:00Z",
        "last_updated": "2024-01-01T10:00:00Z",
        "references": [{ "name": "Internal investment guidelines" }],
        "locale": "en-IN",
        "read_time_seconds": 120
    },
    {
        "slug": "emergency-fund-size",
        "title": "Emergency Fund Size and Allocation",
        "category": "Emergency Fund",
        "tags": ["emergency-fund", "contingency", "savings", "liquid-funds", "fd"],
        "short_answer": "Keep 6–12 months of essential expenses as an emergency fund; prefer liquid instruments.",
        "detailed_markdown": "## Emergency fund guidelines\n- *Rule of thumb:* 6–12 months of essential monthly expenses (6 for salaried with high job security, 12 for variable income or multiple dependents).\n- *Where to keep:* Liquid or near-liquid instruments: savings account, ultra-short debt funds, liquid funds, or short-term FDs (staggered).\n- *Don't invest the emergency fund in equity* due to volatility.\n- *How to replenish:* Rebuild within 3–6 months using dedicated monthly transfers (e.g., 20% of surplus).",
        "author": "System",
        "approver": "System",
        "version": "1.0",
        "status": "published",
        "created_at": "2024-01-01T10:00:00Z",
        "last_updated": "2024-01-01T10:00:00Z",
        "references": [{ "name": "RBI Financial Awareness Guidelines" }],
        "locale": "en-IN",
        "read_time_seconds": 90
    },
    {
        "slug": "safe-withdrawal-rate-india",
        "title": "Safe Withdrawal Rate (SWR) for India",
        "category": "Retirement",
        "tags": ["swr", "retirement", "corpus", "withdrawal", "trinity-study"],
        "short_answer": "Guideline SWR for India: ~3.5%–4% (context-dependent; use caution).",
        "detailed_markdown": "## Safe Withdrawal Rate (India guideline)\n- *Guideline:* 3.5%–4% safe withdrawal rate (SWR) is commonly used for India, lower than 4% (US Trinity) due to inflation and lower expected real returns.\n- *How to apply:* Corpus = annual_need / SWR.\n- *Caveat:* Personal longevity, market conditions, and taxes can change safe rate. Prefer dynamic modeling and periodic re-evaluation.",
        "author": "System",
        "approver": "System",
        "version": "1.0",
        "status": "published",
        "created_at": "2024-01-01T10:00:00Z",
        "last_updated": "2024-01-01T10:00:00Z",
        "references": [{ "name": "Various Indian FIRE community studies" }],
        "locale": "en-IN",
        "read_time_seconds": 75
    },
    {
        "slug": "direct-vs-regular-mf",
        "title": "Direct vs. Regular Mutual Fund Plans",
        "category": "Mutual Funds",
        "tags": ["mutual-funds", "direct-plan", "regular-plan", "expense-ratio", "commission"],
        "short_answer": "Direct plans have lower expense ratios (no distributor commission); regular plans include distributor fees, leading to lower returns.",
        "detailed_markdown": "## Direct vs Regular Mutual Fund Plans\n- *Direct Plans:* You buy directly from the Asset Management Company (AMC). The expense ratio is lower because no distributor commission is paid.\n- *Regular Plans:* You buy through an intermediary (distributor, broker, or agent). The expense ratio is higher to cover the commission paid to the intermediary.\n- *Impact:* Over the long term, the lower expense ratio of direct plans can result in significantly higher returns due to the power of compounding. For example, a 1% difference in expense ratio over 25 years on a ₹10,000 monthly SIP can lead to a corpus that is over ₹25 lakhs larger.\n- *When to choose which:* Always prefer Direct plans if you can manage your own research. Use Regular plans only if you are receiving valuable, unbiased advice and portfolio management service from the distributor.",
        "author": "System",
        "approver": "System",
        "version": "1.0",
        "status": "published",
        "created_at": "2024-01-01T10:00:00Z",
        "last_updated": "2024-01-01T10:00:00Z",
        "references": [{ "name": "AMFI Investor Education", "url": "https://www.amfiindia.com/" }],
        "locale": "en-IN",
        "read_time_seconds": 110
    },
    {
        "slug": "sip-formula",
        "title": "SIP Formula",
        "category": "Mutual Funds",
        "tags": ["sip", "formula", "future-value", "calculation", "investment"],
        "short_answer": "SIP future value formula: FV = P × ({[1 + i]^n – 1} / i) × (1 + i), where P is the monthly investment, i is the monthly interest rate, and n is the number of months.",
        "detailed_markdown": "## SIP formula (Future Value)\n*Formula:* FV = P × ({[1 + i]^n – 1} / i) × (1 + i)\n- P = Monthly SIP amount\n- i = monthly rate of interest (annual rate / 12 / 100)\n- n = number of months (years × 12)\n\n*Example:* For a monthly SIP of ₹10,000 for 20 years at 12% p.a.:\n- P = 10000\n- i = 0.12 / 12 = 0.01\n- n = 20 * 12 = 240\n- FV ≈ ₹99.91 Lakhs\n\n*When to use:* For goal-based planning. Taxes and inflation adjustments should be handled separately.\n\n*Caveat:* This formula assumes contributions at month-end and a constant return.",
        "author": "System",
        "approver": "System",
        "version": "1.0",
        "status": "published",
        "created_at": "2024-01-01T10:00:00Z",
        "last_updated": "2024-01-01T10:00:00Z",
        "references": [{ "name": "Standard financial mathematics formulas" }],
        "locale": "en-IN",
        "read_time_seconds": 90
    },
    {
        "slug": "tax-regime-explainer",
        "title": "Explanation of New vs. Old Tax Regimes",
        "category": "Tax",
        "tags": ["tax", "tax-regime", "new-regime", "old-regime", "deductions", "80c"],
        "short_answer": "The New Tax Regime offers lower tax rates but removes most deductions, making it simpler. The Old Tax Regime has higher rates but allows various deductions like 80C, HRA, and home loan interest.",
        "detailed_markdown": "## Comparing the New and Old Tax Regimes\n\nIndia offers two tax regimes for individuals to choose from each financial year. The best choice depends on your income and the deductions you are eligible to claim.\n\n### 🧾 New Tax Regime (Default)\nThis is the default regime since FY 2023-24. It is designed for simplicity.\n\n- **Lower Tax Slabs**: The tax rates are generally lower across different income brackets compared to the old regime.\n- **No Major Deductions**: Most common deductions and exemptions are not allowed. This includes Section 80C (PPF, ELSS, EPF), Section 80D (Health Insurance), HRA, and home loan interest on self-occupied property.\n- **Standard Deduction**: A standard deduction of ₹50,000 is available for salaried individuals.\n- **Best For**: Individuals with few investments or deductions to claim. It simplifies tax filing significantly.\n\n### 🧾 Old Tax Regime (Opt-in)\nYou can choose to opt into this regime if it is more beneficial for you.\n\n- **Higher Tax Slabs**: The tax rates are higher compared to the new regime.\n- **Allows Deductions**: You can claim over 70 deductions and exemptions to reduce your taxable income. Key ones include:\n  - **Section 80C**: Up to ₹1.5 Lakh (PPF, ELSS, EPF, Life Insurance, etc.)\n  - **Section 80D**: Health insurance premiums.\n  - **HRA**: House Rent Allowance.\n  - **Home Loan**: Interest on home loan.\n  - **NPS**: Contribution to National Pension System.\n- **Best For**: Individuals who make significant use of tax-saving investment and expenditure options. If your total deductions are high (typically over ₹2.5 - ₹3.75 Lakhs), this regime is often more tax-efficient.",
        "author": "System",
        "approver": "System",
        "version": "1.1",
        "status": "published",
        "created_at": "2024-09-01T10:00:00Z",
        "last_updated": "2024-09-01T10:00:00Z",
        "references": [{ "name": "Income Tax Department of India" }],
        "locale": "en-IN",
        "read_time_seconds": 150
      }
];
