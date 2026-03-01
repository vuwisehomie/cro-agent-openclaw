# CRO-Agent: Product Requirements Document (PRD)

**Product Owner:** Vu Nguyen (CTO)
**Timeline:** 8 weeks (4 phases × 2 weeks each)
**Vision:** AI-powered conversion rate optimization platform unifying marketing data, website audits, and automated execution.

## Target Audience
- **Primary:** E-commerce store owners (Shopify, WooCommerce)
- **Secondary:** Marketing managers and growth leads
- **Tertiary:** CRO specialists and agencies

## Tech Stack
- **Frontend:** ReactJS
- **Backend:** Python (FastAPI), Google ADK agents
- **Data:** Airbyte (ELT) → BigQuery
- **AI/ML:** Gemini, LlamaIndex (RAG), Qdrant (vectors)
- **Infra:** Google Cloud (Cloud Run, GKE)
- **Payments:** Stripe

## Core Features (Summary)
A. **Data Connections:** Shopify, Google/Meta Ads, GA4 via Airbyte.
B. **Website Analyzer:** AI CRO audit, SEO, performance, and accessibility.
C. **Funnel Optimizer:** Visual drop-off visualization and friction detection.
D. **AI Marketing Agent:** Conversational strategy, Q&A, and anomaly alerts.
E. **Component Library:** High-converting UI components for Shopify.
F. **Dashboard:** Unified KPIs (CVR, AOV, CAC, ROAS) with AI summaries.

## Timeline
- **Phase 1 (Wk 1-2):** Foundation (CUJ 1, 2, 5), Shopify/GA connectors.
- **Phase 2 (Wk 3-4):** Funnels, Stripe billing, Beta (50 users).
- **Phase 3 (Wk 5-6):** AI Agent, goals, proactive alerts.
- **Phase 4 (Wk 7-8):** Execution (CUJ 6), GA launch.
