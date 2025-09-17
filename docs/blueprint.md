# **App Name**: Pai Chatbot

## Core Features:

- Chat Interface: Web-based chat UI for user interaction with Pai, including a help/FAQ section. This interface provides the primary means for users to ask questions and receive financial guidance.
- Deterministic Calculators: A suite of pre-built, deterministic financial calculators covering tax, SIP/retirement planning, loan EMI calculations, and corpus projections. These calculators guarantee accurate and repeatable results.
- RAG-backed Knowledge Base: A knowledge base populated with documents from RBI, SEBI, CBDT, and AMFI, enriched using Retrieval-Augmented Generation (RAG) techniques.  This allows the chatbot to access and use real-time financial data and product fact sheets, using reasoning to determine the correct data to use as a tool to provide accurate answers.
- Gemini Integration: Integration with Google's Gemini AI models for natural language explanations and summarization of financial concepts. Gemini is utilized to enhance user understanding but is strictly controlled to avoid generating financial 'facts'.
- Admin Dashboard: An admin interface to manage content and data sources used by the chatbot. Admins can manually override information, manage the knowledge base, and monitor data scraping jobs.
- PDF Export: Enables users to export generated financial plans and reports as PDF documents for record-keeping and sharing purposes.
- User Profiles & Saved Scenarios: Allows users to create profiles and save different financial scenarios (e.g., retirement plans, investment strategies) for future reference and comparison.

## Style Guidelines:

- Primary color: Indigo (#4F46E5), conveying trust and authority, appropriate for finance.
- Background color: Very light indigo (#F5F3FF), for a clean, modern look that avoids stark white.
- Accent color: Teal (#00B5D8), providing a vibrant contrast to the primary indigo, for interactive elements.
- Body text and headlines: 'Inter' (sans-serif) provide a modern, clean, and readable experience suitable for large amounts of informative text.
- Code font: 'Source Code Pro' for displaying code snippets in the documentation and the 'How we calculated this' section.
- Use minimalist, consistent icons for calculators, data sources, and navigation. These should align with the teal/indigo color palette.
- Employ a clean, modern layout with a left-side chat conversation and a right-side panel for calculators, results, sources, and 'How we calculated' toggle, with 'rounded 2xl cards'