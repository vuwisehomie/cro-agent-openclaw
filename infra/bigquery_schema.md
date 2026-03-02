# BigQuery Schema (Initial)

## 1. Unified KPIs Table (Multi-tenant)
Table: `cro_agent_analytics.kpis_unified`
- `store_id` (STRING)
- `date` (DATE)
- `source` (STRING) -- shopify, google_ads, meta_ads, ga4
- `metric_name` (STRING) -- revenue, orders, clicks, impressions, cost, sessions
- `metric_value` (FLOAT64)
- `currency` (STRING)

## 2. Store Metadata
Table: `cro_agent_analytics.stores_meta`
- `store_id` (STRING)
- `shop_url` (STRING)
- `industry` (STRING)
- `plan_type` (STRING) -- starter, growth, enterprise
- `last_sync_at` (TIMESTAMP)

## 3. Audit History
Table: `cro_agent_analytics.audits`
- `audit_id` (STRING)
- `store_id` (STRING)
- `url` (STRING)
- `scores` (JSON) -- {performance: X, seo: Y, access: Z}
- `findings` (JSON) -- list of issues
- `created_at` (TIMESTAMP)
