// This file contains the data that you should upload to your Firestore "static_rulebook" collection.
// This data structure and content are based on the user's detailed production-ready guide.

export interface RulebookDocument {
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
        "slug": "split-money-equity-debt-gold",
        "title": "How should I split my money between equity, debt, and gold?",
        "category": "Asset Allocation & Portfolio",
        "tags": ["asset-allocation", "equity", "debt", "gold", "diversification", "risk"],
        "short_answer": "The split depends on your risk profile, age, and goals. A common guideline is the '100 - Age' rule for equity, with the rest split between debt and gold for stability and hedging.",
        "detailed_markdown": "The allocation of money across equity, debt, and gold is determined by an investor's risk profile, age, and the time horizon of their financial goals.\n\n- **Equity:** Associated with long-term capital growth and higher risk.\n- **Debt:** Provides stability, capital preservation, and lower risk.\n- **Gold:** Often used as a hedge against inflation and economic uncertainty.\n\nA common guideline for equity allocation is the **100 - Age rule**, with the remainder split between debt and gold.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "General Financial Principles" }], "locale": "en-IN", "read_time_seconds": 60
    },
    {
        "slug": "asset-allocation-by-age",
        "title": "What’s the best asset allocation for my age?",
        "category": "Asset Allocation & Portfolio",
        "tags": ["asset-allocation", "age-rule", "equity", "debt", "portfolio", "rebalance"],
        "short_answer": "Asset allocation becomes more conservative with age. Younger investors (20s) can take more risk with higher equity (75-85%), while older investors (60s+) should focus on capital preservation with higher debt (70-80%).",
        "detailed_markdown": "Asset allocation models typically adjust based on age, becoming more conservative over time.\n\n- **20s:** Higher allocation to equity (e.g., 75-85%) due to a long time horizon.\n- **30s-40s:** A balanced allocation (e.g., 60-75% equity).\n- **50s:** A more conservative allocation (e.g., 40-50% equity) to preserve capital before retirement.\n- **60s+:** A primary allocation to debt (e.g., 70-80%) to generate regular income.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "General Financial Principles" }], "locale": "en-IN", "read_time_seconds": 75
    },
    {
        "slug": "portfolio-rebalancing-frequency",
        "title": "How often should I rebalance my portfolio?",
        "category": "Asset Allocation & Portfolio",
        "tags": ["rebalancing", "portfolio", "asset-allocation", "time-based", "threshold-based"],
        "short_answer": "Rebalance your portfolio annually, or whenever an asset class deviates from its target by a set percentage (e.g., 5%). This realigns your portfolio with your original risk profile.",
        "detailed_markdown": "Portfolio rebalancing is the process of realigning the weightings of a portfolio's assets. Common rebalancing strategies include:\n\n- **Time-based:** Rebalancing at regular intervals, such as annually or semi-annually.\n- **Threshold-based:** Rebalancing whenever an asset class deviates from its original target allocation by a pre-determined percentage (e.g., 5%).",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "Investment Management Best Practices" }], "locale": "en-IN", "read_time_seconds": 60
    },
    {
        "slug": "real-estate-vs-equity-investment",
        "title": "Is real estate a good investment compared to equity?",
        "category": "Asset Allocation & Portfolio",
        "tags": ["real-estate", "equity", "investment-comparison", "liquidity", "volatility"],
        "short_answer": "Equity offers high liquidity and easy diversification but is volatile. Real estate is a tangible, illiquid asset with high transaction costs but provides utility and potential rental income.",
        "detailed_markdown": "Real estate and equity are two distinct asset classes with different characteristics.\n\n- **Equity:** Features high liquidity, low transaction costs, and easy diversification. It is, however, subject to high market volatility.\n- **Real Estate:** Is a tangible asset with low liquidity, high transaction costs (stamp duty, registration), and significant capital requirements. It provides utility value (shelter) and potential rental income.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "Asset Class Comparison" }], "locale": "en-IN", "read_time_seconds": 70
    },
    {
        "slug": "how-many-mutual-funds",
        "title": "How many mutual funds are too many?",
        "category": "Asset Allocation & Portfolio",
        "tags": ["mutual-funds", "diversification", "portfolio-overlap", "over-diversification"],
        "short_answer": "Too many funds can lead to over-diversification and portfolio overlap, mimicking an index fund but with higher fees. A well-diversified portfolio can often be achieved with 4-6 funds.",
        "detailed_markdown": "Holding an excessive number of mutual funds can lead to portfolio overlap and over-diversification, where the portfolio's performance begins to mirror a market index but with higher combined management fees. Financial planners often suggest that a portfolio of 4-6 well-chosen funds across different categories is sufficient to achieve diversification.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "Mutual Fund Investment Strategy" }], "locale": "en-IN", "read_time_seconds": 60
    },
    {
        "slug": "what-is-goal-based-investing",
        "title": "What is goal-based investing and why is it better?",
        "category": "Goal-Based Investing",
        "tags": ["goal-based-investing", "financial-planning", "sip", "investment-strategy"],
        "short_answer": "Goal-based investing maps investments to specific life goals (e.g., retirement, education), providing clarity and aligning your investment strategy with each goal's timeline and risk.",
        "detailed_markdown": "Goal-based investing is a methodology where investments are mapped to specific life goals, each with a defined target amount and time horizon. This approach provides clarity and context for investment decisions, aligning the choice of assets with the specific timeline and risk requirement of each goal.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "Financial Planning Principles" }], "locale": "en-IN", "read_time_seconds": 60
    },
    {
        "slug": "calculate-sip-for-goal",
        "title": "How do I calculate the SIP amount for a specific goal?",
        "category": "Goal-Based Investing",
        "tags": ["sip-calculator", "goal-planning", "future-value", "investment-formula"],
        "short_answer": "To calculate the required SIP, you need the target amount (Future Value), investment tenure, and expected rate of return. The formula is P = [FV * i] / [((1+i)^n - 1) * (1+i)].",
        "detailed_markdown": "The Systematic Investment Plan (SIP) amount can be calculated using the future value formula of an annuity. The variables required are:\n\n- **FV (Future Value):** The target corpus for the goal.\n- **i (Rate of Return):** The expected periodic rate of return.\n- **n (Number of periods):** The investment tenure in months or years.\n\nThe formula to find the periodic investment (P) is: `P = [FV * i] / [((1+i)^n - 1) * (1+i)]`.\nOnline SIP calculators use this formula to compute the required monthly investment.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "Financial Mathematics" }], "locale": "en-IN", "read_time_seconds": 80
    },
    {
        "slug": "goal-based-investing-mistakes",
        "title": "What are common mistakes in goal-based investing?",
        "category": "Goal-Based Investing",
        "tags": ["investment-mistakes", "goal-planning", "inflation", "asset-allocation"],
        "short_answer": "Common mistakes include not adjusting for inflation, assuming unrealistic returns, mismatching assets with the goal's timeline, and failing to review progress periodically.",
        "detailed_markdown": "Common mistakes in goal-based investing include:\n\n- **Not adjusting for inflation:** Failing to calculate the future cost of a goal.\n- **Assuming unrealistic returns:** Setting investment return expectations that are too high.\n- **Not aligning assets with time horizon:** Using high-risk equity for short-term goals or low-return debt for long-term goals.\n- **Failing to review:** Not periodically tracking the progress of goals.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "Investor Education" }], "locale": "en-IN", "read_time_seconds": 70
    },
    {
        "slug": "separate-money-for-goals",
        "title": "Should I separate money for each goal?",
        "category": "Goal-Based Investing",
        "tags": ["goal-planning", "portfolio-management", "mental-accounting"],
        "short_answer": "Yes, segregating investments for different goals is a best practice. It allows for clear tracking, customized asset allocation per goal, and better financial discipline.",
        "detailed_markdown": "Segregating investments for different goals is a standard practice in financial planning. It allows for:\n\n- **Clear Tracking:** Monitoring the progress toward each goal individually.\n- **Appropriate Asset Allocation:** Customizing the investment strategy (e.g., equity vs. debt) for each goal's unique time horizon.\n- **Mental Accounting:** Preventing funds designated for a critical long-term goal (like retirement) from being used for a short-term discretionary expense.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "Financial Planning Best Practices" }], "locale": "en-IN", "read_time_seconds": 70
    },
    {
        "slug": "priority-order-for-goals",
        "title": "What’s the priority order for goals (retirement vs child vs house)?",
        "category": "Goal-Based Investing",
        "tags": ["goal-prioritization", "retirement-planning", "financial-goals"],
        "short_answer": "Prioritize non-negotiable goals for which loans are not available. The standard priority is: 1. Retirement, 2. Children's Goals, 3. House Purchase.",
        "detailed_markdown": "Financial planning principles suggest prioritizing goals based on their non-negotiability and the availability of financing options.\n\n1.  **Retirement:** Typically the highest priority as one cannot obtain a loan for retirement expenses.\n2.  **Children's Goals:** Important and time-bound, but education loans are an available financing option.\n3.  **House Purchase:** Often considered more flexible, with home loans readily available.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "Financial Planning Hierarchy" }], "locale": "en-IN", "read_time_seconds": 65
    },
    {
        "slug": "how-much-money-to-retire",
        "title": "How much money do I need to retire comfortably?",
        "category": "Retirement",
        "tags": ["retirement-corpus", "financial-independence", "safe-withdrawal-rate", "25x-rule"],
        "short_answer": "A common method is the '25x Rule': multiply your projected annual expenses at retirement by 25. This estimates the corpus needed for a 4% safe withdrawal rate.",
        "detailed_markdown": "A widely used method to estimate the required retirement corpus is to multiply one's projected annual expenses at the time of retirement by a factor of 25 to 33. This is derived from the concept of a 3-4% safe withdrawal rate. The calculation involves estimating current annual expenses, inflating them to the retirement age, and then applying the multiplier.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "FIRE Movement Principles" }], "locale": "en-IN", "read_time_seconds": 70
    },
    {
        "slug": "safe-withdrawal-rate-india",
        "title": "What is a safe withdrawal rate in India?",
        "category": "Retirement",
        "tags": ["swr", "retirement", "corpus", "withdrawal", "trinity-study", "4-percent-rule"],
        "short_answer": "For India, a conservative Safe Withdrawal Rate (SWR) of 3% to 3.5% is often cited, which is lower than the US-based 4% Rule, to account for higher inflation and market volatility.",
        "detailed_markdown": "A Safe Withdrawal Rate (SWR) is the percentage of a retirement corpus that can be withdrawn annually with a low probability of depleting the funds over a 30-year period. The original \"4% Rule\" was based on US market data. For India, financial planners often cite a more conservative SWR of 3% to 3.5% to account for factors like higher domestic inflation and market volatility.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "Indian Financial Planner Studies" }], "locale": "en-IN", "read_time_seconds": 75
    },
    {
        "slug": "retirement-money-in-fds",
        "title": "Should I put all my retirement money in FDs?",
        "category": "Retirement",
        "tags": ["retirement-investment", "fixed-deposits", "fd", "inflation-risk", "diversification"],
        "short_answer": "No, putting all retirement money in Fixed Deposits (FDs) is risky due to inflation. If post-tax returns from FDs are lower than inflation, your purchasing power will decrease over time.",
        "detailed_markdown": "Placing an entire retirement corpus in Fixed Deposits (FDs) exposes the funds to inflation risk. If the post-tax returns from FDs are lower than the rate of inflation, the purchasing power of the capital and the income it generates will decline over time. A diversified portfolio containing assets like equity is typically used to counter this risk.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "Retirement Planning Principles" }], "locale": "en-IN", "read_time_seconds": 65
    },
    {
        "slug": "nps-vs-ppf-vs-mutual-funds",
        "title": "Which is better for retirement – NPS, PPF, or mutual funds?",
        "category": "Retirement",
        "tags": ["nps", "ppf", "mutual-funds", "retirement-planning", "investment-comparison"],
        "short_answer": "NPS is a locked-in pension scheme with equity exposure. PPF is a tax-free, government-backed debt instrument. Mutual funds offer high liquidity and growth potential. The choice depends on your risk appetite and liquidity needs.",
        "detailed_markdown": "NPS, PPF, and mutual funds are different financial instruments with distinct features for retirement planning.\n\n- **NPS (National Pension System):** A government-regulated, low-cost pension scheme with a mandatory lock-in until age 60 and a requirement to purchase an annuity with a portion of the corpus. It offers a mix of equity and debt.\n- **PPF (Public Provident Fund):** A government-backed, long-term debt instrument offering tax-free interest and maturity proceeds. The returns are fixed by the government.\n- **Mutual Funds:** Market-linked investment vehicles that offer high liquidity and the potential for inflation-beating growth through equity exposure.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "Investment Product Comparison" }], "locale": "en-IN", "read_time_seconds": 90
    },
    {
        "slug": "post-retirement-withdrawal-plan",
        "title": "How do I plan withdrawals after retirement?",
        "category": "Retirement",
        "tags": ["retirement-withdrawal", "bucket-strategy", "cash-flow-management", "swp"],
        "short_answer": "The 'Bucket Strategy' is a popular method. It involves segmenting your corpus into three buckets: 1) Immediate Needs (1-3 years expenses in liquid funds), 2) Intermediate Needs (4-10 years in hybrid funds), and 3) Long-Term Growth (rest in equity).",
        "detailed_markdown": "The \"Bucket Strategy\" is a common framework for managing post-retirement withdrawals. It involves segmenting the corpus into three buckets:\n\n- **Bucket 1 (Immediate Needs):** Holds 1-3 years of expenses in highly liquid instruments (e.g., liquid funds, FDs).\n- **Bucket 2 (Intermediate Needs):** Holds 4-10 years of expenses in a mix of debt and hybrid funds. It refills Bucket 1.\n- **Bucket 3 (Long-Term Growth):** Holds the remaining corpus in equity funds to generate long-term growth and beat inflation. It refills Bucket 2.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "Retirement Income Planning" }], "locale": "en-IN", "read_time_seconds": 80
    },
    {
        "slug": "emergency-fund-size",
        "title": "How much emergency fund do I need?",
        "category": "Emergency Fund",
        "tags": ["emergency-fund", "contingency", "savings", "financial-safety"],
        "short_answer": "Maintain an emergency fund of 6 to 12 months of your essential living expenses (rent/EMI, utilities, food, insurance).",
        "detailed_markdown": "A standard guideline is to maintain an emergency fund equivalent to 6 to 12 months of essential living expenses. Essential expenses include items like rent/EMI, utilities, food, insurance premiums, and transportation costs.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "Financial Planning Basics" }], "locale": "en-IN", "read_time_seconds": 50
    },
    {
        "slug": "where-to-park-emergency-fund",
        "title": "Where should I park my emergency fund?",
        "category": "Emergency Fund",
        "tags": ["emergency-fund", "liquid-funds", "savings-account", "fixed-deposit", "capital-safety"],
        "short_answer": "Park your emergency fund in safe and highly liquid instruments like high-yield savings accounts, sweep-in FDs, or liquid mutual funds.",
        "detailed_markdown": "An emergency fund should be parked in instruments that prioritize capital safety and high liquidity. Common options include:\n\n- High-yield savings bank accounts.\n- Sweep-in Fixed Deposits.\n- Liquid mutual funds.\n- Ultra Short Duration debt funds.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "Investment Best Practices" }], "locale": "en-IN", "read_time_seconds": 60
    },
    {
        "slug": "invest-emergency-fund-in-equity",
        "title": "Can I invest my emergency fund in equity?",
        "category": "Emergency Fund",
        "tags": ["emergency-fund", "equity-investment", "risk-management", "volatility"],
        "short_answer": "No, it's not advisable. Equity is volatile, and the value of your emergency fund could drop significantly when you need it most. The fund's purpose is safety, not growth.",
        "detailed_markdown": "Investing an emergency fund in equity is not aligned with its primary purpose. Equity markets are volatile, and in the event of a market downturn, the capital value of the fund could be significantly eroded, making it unavailable at its full value when an emergency strikes.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "Risk Management Principles" }], "locale": "en-IN", "read_time_seconds": 60
    },
    {
        "slug": "split-emergency-fund",
        "title": "Should I keep my emergency fund in one place or split it?",
        "category": "Emergency Fund",
        "tags": ["emergency-fund", "liquidity-management", "diversification"],
        "short_answer": "Splitting is a good strategy. Keep a small portion in a savings account for immediate ATM/UPI access and the rest in a liquid fund or sweep-in FD for slightly better returns.",
        "detailed_markdown": "Splitting an emergency fund across different instruments is a common strategy. A portion can be kept in a savings account for immediate access via ATM or UPI, while the remainder can be placed in a liquid fund or sweep-in FD, which may offer slightly higher returns while still being accessible within 1-2 business days.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "Personal Finance Strategy" }], "locale": "en-IN", "read_time_seconds": 65
    },
    {
        "slug": "replenish-emergency-fund",
        "title": "How do I replenish my emergency fund after using it?",
        "category": "Emergency Fund",
        "tags": ["emergency-fund", "financial-discipline", "savings-priority"],
        "short_answer": "After using your emergency fund, make replenishing it your top financial priority. Pause non-essential spending and investments, and redirect all surplus income to rebuild the fund.",
        "detailed_markdown": "After an emergency fund is utilized, its replenishment is considered a top financial priority. The process involves pausing non-essential discretionary spending and investments, and redirecting all available surplus income to rebuild the fund to its target amount.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "Financial Recovery" }], "locale": "en-IN", "read_time_seconds": 60
    },
    {
        "slug": "which-mutual-funds-for-beginners",
        "title": "Which mutual funds should I start with?",
        "category": "Mutual Funds",
        "tags": ["mutual-funds-beginner", "index-funds", "flexi-cap-funds", "nifty-50", "sip"],
        "short_answer": "For beginners, Index Funds (like Nifty 50) are great for low-cost, broad market exposure. Flexi-Cap Funds are another good option, offering active management across all company sizes.",
        "detailed_markdown": "For beginners, common starting points are:\n\n- **Index Funds:** These funds passively track a market index like the Nifty 50 or Sensex. They offer broad market diversification at a very low cost (expense ratio).\n- **Flexi-Cap Funds:** These are actively managed funds where the fund manager can invest across companies of all sizes (large, mid, and small-cap), offering diversification within a single fund.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "AMFI Investor Education" }], "locale": "en-IN", "read_time_seconds": 70
    },
    {
        "slug": "direct-vs-regular-mutual-funds",
        "title": "Should I choose Direct or Regular plans?",
        "category": "Mutual Funds",
        "tags": ["direct-plan", "regular-plan", "mutual-funds", "expense-ratio", "commission"],
        "short_answer": "Always choose Direct plans. They have a lower expense ratio because they don't include distributor commissions, leading to significantly higher returns over the long term.",
        "detailed_markdown": "The fundamental difference between Direct and Regular plans of a mutual fund is the expense ratio.\n\n- **Regular Plans** include a commission for the distributor/agent, which is built into a higher expense ratio.\n- **Direct Plans** have no distributor commission, resulting in a lower expense ratio. A lower expense ratio leads to higher net returns for the investor over the long term.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "SEBI Investor Awareness" }], "locale": "en-IN", "read_time_seconds": 70
    },
    {
        "slug": "sip-vs-stp-vs-swp",
        "title": "What’s the difference between SIP, STP, and SWP?",
        "category": "Mutual Funds",
        "tags": ["sip", "stp", "swp", "mutual-funds", "investment-strategy"],
        "short_answer": "SIP is for investing regularly. STP is for systematically transferring a lump sum from one fund to another. SWP is for withdrawing regularly from a fund.",
        "detailed_markdown": "- **SIP (Systematic Investment Plan):** A method of investing a fixed amount of money at regular intervals into a mutual fund.\n- **STP (Systematic Transfer Plan):** A method to transfer a fixed amount from one mutual fund scheme (typically a liquid or debt fund) to another (typically an equity fund) at regular intervals. It is used to deploy a lump sum amount over time.\n- **SWP (Systematic Withdrawal Plan):** A facility to withdraw a fixed amount of money from a mutual fund scheme at regular intervals.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "Mutual Fund Terminology" }], "locale": "en-IN", "read_time_seconds": 80
    },
    {
        "slug": "avoid-overlapping-funds",
        "title": "How do I avoid overlapping funds?",
        "category": "Mutual Funds",
        "tags": ["portfolio-overlap", "mutual-funds", "diversification", "investment-strategy"],
        "short_answer": "To avoid overlap, select one fund per investment category (e.g., one large-cap, one mid-cap). Use online portfolio analysis tools to check for common stock holdings between your funds.",
        "detailed_markdown": "Portfolio overlap occurs when an investor holds multiple mutual funds that invest in the same underlying stocks. This can be identified using online portfolio analysis tools that show the percentage of common holdings between different funds in a portfolio. A common strategy to avoid high overlap is to select one fund per investment category (e.g., one large-cap fund, one mid-cap fund).",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "Portfolio Management" }], "locale": "en-IN", "read_time_seconds": 70
    },
    {
        "slug": "invest-in-international-funds",
        "title": "Should I invest in international funds like S&P 500?",
        "category": "Mutual Funds",
        "tags": ["international-investing", "geographical-diversification", "sp-500", "global-markets"],
        "short_answer": "Yes, investing in international funds provides geographical diversification, reducing concentration risk by spreading investments across different economies and currencies.",
        "detailed_markdown": "Investing in international funds provides geographical diversification. It reduces concentration risk by spreading investments across different economies and currencies. An allocation to a fund tracking an index like the S&P 500 gives an investor exposure to the performance of the largest companies in the U.S. market.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "Global Investment Strategy" }], "locale": "en-IN", "read_time_seconds": 60
    },
    {
        "slug": "how-much-term-insurance-cover",
        "title": "How much term insurance cover do I need?",
        "category": "Insurance",
        "tags": ["term-insurance", "life-insurance", "sum-assured", "insurance-calculator"],
        "short_answer": "A common rule is to get a term insurance cover that is 15 to 20 times your current annual income. You should also add any outstanding liabilities like home loans to this amount.",
        "detailed_markdown": "A common method for calculating the required term insurance cover is to take 15 to 20 times one's current annual income. Any outstanding liabilities, such as a home loan or personal loan, should be added to this amount.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "Insurance Planning Guidelines" }], "locale": "en-IN", "read_time_seconds": 55
    },
    {
        "slug": "term-insurance-vs-ulip-endowment",
        "title": "Is term insurance better than ULIPs and endowment plans?",
        "category": "Insurance",
        "tags": ["term-insurance", "ulip", "endowment-plan", "insurance-comparison", "investment"],
        "short_answer": "Yes, term insurance is better for protection. It's best to keep insurance and investment separate. Bundled products like ULIPs often have higher costs, smaller life cover, and lower returns.",
        "detailed_markdown": "Term insurance is a pure protection product that provides a large death benefit for a low premium. ULIPs and endowment plans are bundled products that combine insurance with investment. These bundled products typically have higher costs (premium allocation, mortality, fund management charges) which results in a smaller life cover and potentially lower investment returns compared to buying a separate term plan and investing the difference in mutual funds.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "IRDAI Investor Education" }], "locale": "en-IN", "read_time_seconds": 85
    },
    {
        "slug": "health-insurance-cover-for-family",
        "title": "What health insurance cover should I take for my family?",
        "category": "Insurance",
        "tags": ["health-insurance", "family-floater", "sum-insured", "super-top-up"],
        "short_answer": "For a family in a metro city, a base cover of ₹10-15 lakhs is a common suggestion. This can be enhanced cost-effectively with a super top-up policy.",
        "detailed_markdown": "The adequate amount of health insurance cover depends on factors like the city of residence (healthcare is more expensive in metro cities), family size, and age of members. A common base cover cited for a family in a metro city is ₹10-15 lakhs. This can be augmented cost-effectively with a super top-up policy, which covers expenses above a certain deductible limit.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "Health Insurance Planning" }], "locale": "en-IN", "read_time_seconds": 75
    },
    {
        "slug": "buy-health-insurance-if-employer-provides",
        "title": "Should I buy health insurance even if I have one from my employer?",
        "category": "Insurance",
        "tags": ["health-insurance", "corporate-insurance", "group-policy", "personal-cover"],
        "short_answer": "Yes, you should buy a personal health insurance policy. Employer-provided insurance is tied to your job, may have insufficient cover, and is not customizable.",
        "detailed_markdown": "Relying solely on an employer's group health insurance has several limitations:\n\n- The policy is only valid during the tenure of employment.\n- The coverage amount may be insufficient for the family's needs.\n- Features and benefits are not customizable.\nA separate personal health insurance policy ensures continuous coverage regardless of employment status.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "Insurance Best Practices" }], "locale": "en-IN", "read_time_seconds": 70
    },
    {
        "slug": "common-insurance-mistakes",
        "title": "What are common insurance mistakes to avoid?",
        "category": "Insurance",
        "tags": ["insurance-mistakes", "underinsured", "non-disclosure", "mis-selling"],
        "short_answer": "Avoid mixing insurance with investment, being underinsured, not disclosing medical history, and delaying your purchase, which leads to higher premiums.",
        "detailed_markdown": "Common mistakes in purchasing insurance include:\n\n- **Mixing insurance with investment:** Opting for bundled products over pure protection plans.\n- **Being underinsured:** Choosing an inadequate sum assured for life or health cover.\n- **Non-disclosure:** Hiding medical conditions or other relevant information, which can lead to claim rejection.\n- **Delaying purchase:** Buying insurance at an older age results in higher premiums.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "IRDAI Consumer Awareness" }], "locale": "en-IN", "read_time_seconds": 70
    },
    {
        "slug": "buy-house-vs-renting",
        "title": "Should I buy a house or continue renting?",
        "category": "Real Estate",
        "tags": ["buy-vs-rent", "real-estate", "home-loan", "emi", "opportunity-cost"],
        "short_answer": "The decision is both financial and emotional. Financially, compare the total cost of ownership (EMI, taxes, maintenance, opportunity cost) against the total cost of renting.",
        "detailed_markdown": "The decision involves both financial and non-financial considerations. The financial analysis compares the total cost of ownership (down payment, EMIs, property tax, maintenance, and opportunity cost of capital) against the total cost of renting over a specific period. Non-financial factors include stability, flexibility, and personal preference.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "Real Estate Investment Analysis" }], "locale": "en-IN", "read_time_seconds": 70
    },
    {
        "slug": "is-rent-a-waste-of-money",
        "title": "Is rent a waste of money?",
        "category": "Real Estate",
        "tags": ["renting", "emi", "equity-building", "opportunity-cost"],
        "short_answer": "No, rent is an expense for the service of shelter. A proper financial comparison must also include the interest paid on an EMI, maintenance costs, and the opportunity cost of the down payment.",
        "detailed_markdown": "Rent is a payment for the service of using a property (shelter). From a financial perspective, it is an expense. The assertion that rent is a \"waste\" stems from comparing it to an EMI, which builds equity in an asset. However, a complete financial comparison must also account for the interest component of the EMI, maintenance costs, and the opportunity cost of the large down payment.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "Personal Finance Myths" }], "locale": "en-IN", "read_time_seconds": 75
    },
    {
        "slug": "emi-percentage-of-income",
        "title": "What percentage of my income should EMI be?",
        "category": "Real Estate",
        "tags": ["emi", "foir", "debt-to-income-ratio", "loan-eligibility"],
        "short_answer": "Your total EMIs (including a potential new home loan) should not exceed 35-40% of your net take-home income. This is known as the Fixed Obligation to Income Ratio (FOIR).",
        "detailed_markdown": "A widely accepted guideline from lenders and financial planners is that an individual's total fixed obligations, including all EMIs, should not exceed 35-40% of their net take-home income. This is known as the Fixed Obligation to Income Ratio (FOIR).",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "Lending Guidelines" }], "locale": "en-IN", "read_time_seconds": 60
    },
    {
        "slug": "real-estate-investment-returns",
        "title": "Is real estate a good investment for returns?",
        "category": "Real Estate",
        "tags": ["real-estate-returns", "capital-appreciation", "rental-yield"],
        "short_answer": "Returns from residential real estate come from capital appreciation and rental yield. In India, rental yields are historically low (2-3%), so returns are heavily dependent on capital appreciation.",
        "detailed_markdown": "Returns from residential real estate come from two sources: capital appreciation (increase in property value) and rental yield (annual rent as a percentage of property value). In India, rental yields have historically been low, typically in the range of 2-3%. Capital appreciation can be significant but is subject to market cycles and location.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "Real Estate Market Analysis" }], "locale": "en-IN", "read_time_seconds": 65
    },
    {
        "slug": "calculate-rent-vs-buy-breakeven",
        "title": "How do I calculate rent vs buy breakeven?",
        "category": "Real Estate",
        "tags": ["rent-vs-buy-calculator", "breakeven-analysis", "real-estate"],
        "short_answer": "A breakeven analysis calculates when the total cost of owning equals the total cost of renting. It must include all costs: down payment, interest, taxes, maintenance, and the opportunity cost of investing the down payment.",
        "detailed_markdown": "A rent vs. buy breakeven analysis calculates the point in time at which the total cost of owning a home becomes equal to the total cost of renting a similar property. The calculation must include:\n\n- **Buying Costs:** Down payment, loan interest, principal, property taxes, maintenance, and transaction costs.\n- **Renting Costs:** Monthly rent and annual rent increases.\n- **Opportunity Cost:** The potential returns that could have been earned by investing the down payment and other ownership-related costs.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "Financial Modeling" }], "locale": "en-IN", "read_time_seconds": 80
    },
    {
        "slug": "which-debt-funds-are-safe",
        "title": "Which debt funds are safe now?",
        "category": "Debt & Fixed Income",
        "tags": ["debt-funds", "credit-risk", "interest-rate-risk", "liquid-funds", "overnight-funds"],
        "short_answer": "For maximum safety, consider Overnight Funds and Liquid Funds, which have the lowest credit and interest rate risk. For slightly higher returns with low credit risk, look at Corporate Bond Funds investing in AAA-rated paper.",
        "detailed_markdown": "Safety in debt funds relates to two primary risks: credit risk (risk of the borrower defaulting) and interest rate risk (risk of bond prices falling when interest rates rise).\n\n- **Lowest Risk:** Overnight Funds and Liquid Funds have the lowest risk as they invest in very short-term securities.\n- **Low to Moderate Risk:** Corporate Bond Funds (investing in high-quality AAA-rated paper) and Banking & PSU Debt Funds are considered relatively safe from credit risk.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "Debt Fund Analysis" }], "locale": "en-IN", "read_time_seconds": 80
    },
    {
        "slug": "gilt-vs-corporate-vs-liquid-funds",
        "title": "What’s the difference between gilt funds, corporate bonds, and liquid funds?",
        "category": "Debt & Fixed Income",
        "tags": ["debt-funds-comparison", "gilt-funds", "corporate-bond-funds", "liquid-funds"],
        "short_answer": "Gilt funds invest in government securities (no credit risk, high interest rate risk). Corporate Bond funds invest in company bonds (have credit risk). Liquid funds invest in very short-term instruments (very low risk).",
        "detailed_markdown": "The difference lies in their underlying investments:\n\n- **Gilt Funds:** Invest exclusively in central and state government securities (G-Secs). They have zero credit risk but can have high interest rate risk.\n- **Corporate Bond Funds:** Invest in debt securities (bonds, debentures) issued by private and public companies. They carry credit risk.\n- **Liquid Funds:** Invest in money market instruments with maturities up to 91 days, such as treasury bills and commercial papers. They have very low credit and interest rate risk.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "Mutual Fund Categories" }], "locale": "en-IN", "read_time_seconds": 90
    },
    {
        "slug": "debt-fund-taxation-post-april-2023",
        "title": "How are debt funds taxed after April 2023?",
        "category": "Debt & Fixed Income",
        "tags": ["debt-fund-taxation", "capital-gains", "indexation", "income-tax"],
        "short_answer": "For debt funds bought after April 1, 2023, all capital gains are added to your income and taxed at your income tax slab rate. The benefit of indexation is no longer available.",
        "detailed_markdown": "For debt mutual fund units acquired on or after April 1, 2023, any capital gains are added to the investor's total income and are taxed at their applicable income tax slab rate. The benefit of indexation for long-term capital gains is no longer available for these new investments.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "Finance Act 2023" }], "locale": "en-IN", "read_time_seconds": 65
    },
    {
        "slug": "scss-vs-ppf-vs-rbi-bonds",
        "title": "Should I invest in SCSS, PPF, or RBI bonds for stability?",
        "category": "Debt & Fixed Income",
        "tags": ["scss", "ppf", "rbi-bonds", "fixed-income", "senior-citizen", "tax-saving"],
        "short_answer": "SCSS is for senior citizens seeking high, regular income. PPF is a long-term, tax-free savings tool for all. RBI Floating Rate Bonds offer an interest rate that adjusts periodically.",
        "detailed_markdown": "These are all government-backed instruments offering capital stability.\n\n- **SCSS (Senior Citizen Savings Scheme):** For senior citizens only, offering a high, fixed interest rate paid quarterly.\n- **PPF (Public Provident Fund):** A 15-year lock-in product with tax-free interest and maturity. Available to all individuals.\n- **RBI Floating Rate Bonds:** Offers an interest rate that is pegged to the National Savings Certificate (NSC) rate and resets every six months.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "Government Savings Schemes" }], "locale": "en-IN", "read_time_seconds": 80
    },
    {
        "slug": "debt-for-retirement-income",
        "title": "Can I use debt for retirement income?",
        "category": "Debt & Fixed Income",
        "tags": ["retirement-income", "debt-funds", "swp", "scss", "fixed-deposits"],
        "short_answer": "Yes, debt instruments are the core of most retirement income strategies, providing regular cash flow through interest payments (from FDs, SCSS) or Systematic Withdrawal Plans (SWP) from debt funds.",
        "detailed_markdown": "Yes, debt and fixed-income instruments form the core of most retirement income strategies. Income can be generated through:\n\n- **Interest Payments:** From instruments like the Senior Citizen Savings Scheme (SCSS) and Fixed Deposits (FDs).\n- **Systematic Withdrawals:** Using a Systematic Withdrawal Plan (SWP) from debt mutual funds to create a regular cash flow.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "Retirement Planning" }], "locale": "en-IN", "read_time_seconds": 65
    },
    {
        "slug": "old-vs-new-tax-regime",
        "title": "Should I choose old regime or new regime?",
        "category": "Tax Planning",
        "tags": ["tax-regime", "old-regime", "new-regime", "income-tax", "deductions", "80c"],
        "short_answer": "The choice depends on your deductions. If your total eligible deductions are high (typically > ₹2.5 Lakhs), the Old Regime is often better. Otherwise, the New Regime's lower rates may be more beneficial.",
        "detailed_markdown": "The choice between the old and new tax regimes depends on an individual's income and the deductions they are eligible to claim.\n\n- **Old Regime:** Has higher tax rates but allows for numerous deductions and exemptions (e.g., Section 80C, 80D, HRA).\n- **New Regime:** Offers lower, concessional tax rates but requires forgoing most deductions. A standard deduction of ₹50,000 is available under the new regime for salaried individuals and pensioners. The decision is made by calculating the tax liability under both regimes.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "Income Tax Act" }], "locale": "en-IN", "read_time_seconds": 85
    },
    {
        "slug": "tax-efficient-bonus-investment",
        "title": "What’s the most tax-efficient way to invest a bonus?",
        "category": "Tax Planning",
        "tags": ["tax-planning", "bonus", "80c", "nps", "elss", "ltcg"],
        "short_answer": "First, maximize deductions like Section 80C (₹1.5 lakh) and NPS (₹50,000). Then, invest the rest in tax-efficient assets like equity mutual funds, where long-term gains are taxed favorably.",
        "detailed_markdown": "Tax efficiency can be achieved by utilizing available tax deductions and investing in assets with favorable tax treatment on gains. This includes:\n\n1.  Maximizing deductions under Section 80C (₹1.5 lakh) and Section 80CCD(1B) for NPS (₹50,000).\n2.  Investing the remaining amount in instruments like equity mutual funds, where long-term capital gains (LTCG) over ₹1 lakh are taxed at 10%.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "Tax Saving Strategies" }], "locale": "en-IN", "read_time_seconds": 70
    },
    {
        "slug": "mutual-fund-gains-taxation",
        "title": "How are mutual fund gains taxed?",
        "category": "Tax Planning",
        "tags": ["mutual-fund-taxation", "ltcg", "stcg", "equity-funds", "debt-funds"],
        "short_answer": "Equity fund LTCG (>1yr) is taxed at 10% above ₹1 lakh. STCG (<1yr) is 15%. For debt funds (bought after Apr 1, 2023), all gains are taxed at your income slab rate.",
        "detailed_markdown": "- **Equity Funds:** Gains on units held for more than 12 months are Long-Term Capital Gains (LTCG), taxed at 10% on gains above ₹1 lakh per year. Gains on units held for 12 months or less are Short-Term Capital Gains (STCG), taxed at 15%.\n- **Debt Funds (for investments from April 1, 2023):** All gains are treated as STCG and taxed at the investor's income tax slab rate.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "Income Tax Act" }], "locale": "en-IN", "read_time_seconds": 75
    },
    {
        "slug": "deductions-under-80c-80d",
        "title": "What deductions can I claim under Section 80C and 80D?",
        "category": "Tax Planning",
        "tags": ["section-80c", "section-80d", "tax-deductions", "epf", "ppf", "elss", "health-insurance"],
        "short_answer": "Section 80C offers up to ₹1.5 lakh deduction for investments like EPF, PPF, ELSS, and expenses like life insurance premiums. Section 80D allows deductions for health insurance premiums.",
        "detailed_markdown": "- **Section 80C:** A deduction of up to ₹1.5 lakh is available for investments in EPF, PPF, ELSS, NSC, tax-saver FDs, and expenses like life insurance premiums, home loan principal repayment, and children's tuition fees.\n- **Section 80D:** A deduction is available for health insurance premiums paid. The limits are up to ₹25,000 for self/family and up to ₹50,000 for senior citizen parents.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "Income Tax Act" }], "locale": "en-IN", "read_time_seconds": 80
    },
    {
        "slug": "senior-citizen-tax-saving",
        "title": "How can senior citizens save tax smartly?",
        "category": "Tax Planning",
        "tags": ["senior-citizen", "tax-saving", "section-80ttb", "basic-exemption-limit"],
        "short_answer": "Senior citizens get a higher basic exemption limit (₹3 lakh), a deduction up to ₹50,000 on interest income (Section 80TTB), and higher deduction limits for health insurance.",
        "detailed_markdown": "Senior citizens (age 60 and above) have access to special tax provisions:\n\n- **Higher Basic Exemption Limit:** ₹3 lakh for senior citizens and ₹5 lakh for super senior citizens (age 80+).\n- **Section 80TTB:** Deduction up to ₹50,000 on interest income from bank and post office deposits.\n- **Higher deduction limits under Section 80D** for health insurance premiums.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "Income Tax Act for Senior Citizens" }], "locale": "en-IN", "read_time_seconds": 70
    },
    {
        "slug": "will-vs-nominee",
        "title": "Do I really need a Will if I already have nominees?",
        "category": "Estate & Wills",
        "tags": ["will", "nominee", "heir", "succession", "estate-planning"],
        "short_answer": "Yes, you need a Will. A nominee is just a custodian who receives the assets, but the legal heir specified in a Will is the ultimate owner. A Will overrides a nomination.",
        "detailed_markdown": "Yes. Legally, a nominee is a trustee or custodian who is authorized to receive the assets on behalf of the deceased. The legal heir, as specified in a Will or determined by succession law, is the ultimate owner of those assets. A Will is a legal declaration of a person's intent for the distribution of their assets and it overrides a nomination.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "Indian Succession Act" }], "locale": "en-IN", "read_time_seconds": 70
    },
    {
        "slug": "is-will-registration-mandatory",
        "title": "Is registration of a Will mandatory?",
        "category": "Estate & Wills",
        "tags": ["will-registration", "legal-validity", "estate-planning"],
        "short_answer": "No, registration of a Will is not mandatory in India. An unregistered Will is legally valid as long as it is properly signed by the testator and attested by two witnesses.",
        "detailed_markdown": "No, the registration of a Will with a sub-registrar is not mandatory for it to be legally valid in India. An unregistered Will is as valid as a registered one, provided it is properly executed as per the law.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "Indian Succession Act" }], "locale": "en-IN", "read_time_seconds": 55
    },
    {
        "slug": "write-will-on-plain-paper",
        "title": "Can I write my Will on plain paper?",
        "category": "Estate & Wills",
        "tags": ["will-writing", "legal-document", "stamp-paper", "testator", "witness"],
        "short_answer": "Yes, a Will can be written on plain paper. There is no legal requirement to use stamp paper. It must be in writing, signed by you, and attested by at least two witnesses.",
        "detailed_markdown": "Yes, a Will can be written on plain paper. There is no legal requirement to use stamp paper. The essential legal requirements for a valid Will are that it must be in writing, signed by the testator (the person making the Will), and attested by at least two witnesses.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "Legal Requirements for Wills" }], "locale": "en-IN", "read_time_seconds": 60
    },
    {
        "slug": "nominee-vs-heir-difference",
        "title": "What’s the difference between nominee and heir?",
        "category": "Estate & Wills",
        "tags": ["nominee", "heir", "beneficiary", "succession-law", "estate-planning"],
        "short_answer": "A nominee is a caretaker who receives assets on your behalf. An heir (or beneficiary), determined by a Will or succession law, is the true legal owner of the assets.",
        "detailed_markdown": "- **Nominee:** A person appointed to receive the assets from a financial institution upon the death of the account holder. The nominee acts as a caretaker.\n- **Heir (or Beneficiary):** A person who is legally entitled to inherit the assets of the deceased. The heir is the true owner, and their right is determined by the Will or the relevant succession laws.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "Legal and Financial Terminology" }], "locale": "en-IN", "read_time_seconds": 65
    },
    {
        "slug": "create-simple-will-without-lawyer",
        "title": "How do I create a simple Will without a lawyer?",
        "category": "Estate & Wills",
        "tags": ["diy-will", "will-writing", "testator", "executor", "witnesses"],
        "short_answer": "To create a simple will: declare it as your last will, list assets and beneficiaries, appoint an executor, and sign it with two independent witnesses who also sign.",
        "detailed_markdown": "A simple Will can be created by following these steps:\n\n1.  Make a clear declaration that you are creating this as your last will and testament while of sound mind.\n2.  List all assets and specify how each should be distributed among your chosen beneficiaries.\n3.  Appoint an executor who will be responsible for carrying out the Will's instructions.\n4.  Sign and date the Will in the presence of at least two independent witnesses.\n5.  The witnesses must also sign the Will, confirming they witnessed your signature.",
        "author": "System", "approver": "System", "version": "1.0", "status": "published", "created_at": "2024-09-15T10:00:00Z", "last_updated": "2024-09-15T10:00:00Z", "references": [{ "name": "Basic Will Creation Guide" }], "locale": "en-IN", "read_time_seconds": 80
    },
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
