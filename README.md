# Vartu Creations — AI-Powered CRM & Order Management System

A production-ready CRM, quotation generator, custom order tracker, inventory, production, dispatch, and AI sales intelligence platform tailored for **Vartu Creations** handmade crafts and bespoke gifts business.

---

## 🌟 Key Features

1. **Inbound Leads & Opportunities**:
   - Capture inquiries from Instagram, WhatsApp, Meesho, Website, Referrals & Stalls.
   - Filter by status, priority, and source.
   - 1-click WhatsApp web chat & click-to-call.
   - AI Lead Intelligence powered by Google Gemini (analyzes requirements, buying intent, urgency, and drafts custom WhatsApp replies).

2. **Customer 360° Directory**:
   - Customer profile with Customer Lifetime Value (LTV), total orders, and outstanding debt balance.
   - Order history, past quotations, and communication logs.
   - Duplicate customer detection guardrails.

3. **Product Catalogue & Margin Costing Engine**:
   - Tiered pricing support: Retail, Bulk (MOQ 20+), Wholesale (MOQ 50+), Corporate.
   - Detailed costing breakdown: Raw Materials, Labour, Packaging, Other costs.
   - Automatic Gross Profit & Gross Margin % calculation.

4. **Branded Quotations & PDF Generation**:
   - Central pricing calculation engine with Indian taxation (CGST + SGST or IGST).
   - Automated 50% advance requirement & balance calculation.
   - Branded printable/downloadable PDF with business logo, bank coordinates, and artisan terms.
   - 1-click conversion from Quotation to Order.

5. **Order Lifecycle & Customization Tracking**:
   - Multi-tier order tracking: Retail, Customized, Bulk B2B, Corporate Hampers.
   - Design version approval tracking (V1, V2, Customer Approved).
   - Real-time status: Confirmed → Advance → Production → QC → Packed → Dispatched → Delivered.

6. **Studio Production & Quality Control**:
   - Batch tracking for resin curing (24-48 hrs), terrazzo candle holders, and Rakhis.
   - Automated Balance Formula: `Balance Qty = Required - Produced - Rejected`.
   - Controller assignment and inspection notes.

7. **Inventory & Raw Materials**:
   - Tracks epoxy resins, silicon molds, pigments, organic soy wax, and gift boxes.
   - Live Health alerts: 🔴 Out of Stock, 🟠 Critical, 🟡 Low Stock, 🟢 Healthy.
   - Quick Stock In / Stock Out adjustment engine.

8. **Payment Ledger & GST Invoices**:
   - Advance and final payment recording with UPI UTR and bank transfer refs.
   - Automatic order balance settlement.
   - GST tax invoice generation.

9. **Dispatch & Domestic Logistics**:
   - Courier assignment (Delhivery, Blue Dart, DTDC, Speed Post, Porter).
   - AWB tracking number logging and delivery status updates.

10. **Follow-Up Task Engine**:
    - Segmented into 🔴 Overdue, 🟡 Due Today, and 🟢 Upcoming.
    - Quick WhatsApp message trigger and 1-click completion.

11. **Vartu AI Intelligence Suite (Gemini 3.8 Flash)**:
    - **AI Sales Co-Pilot**: Answers natural language questions against live CRM snapshots.
    - **AI Copywriter**: Generates personalized follow-ups for WhatsApp, Instagram DM, or Email across multiple tones.
    - **Gift Curator**: Matches catalog items for customer budgets and quantities.
    - **Delivery Risk Analyzer**: Detects curing bottlenecks and deadline risks.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Backend**: Express.js server on Node.js (`server.ts`)
- **AI**: `@google/genai` TypeScript SDK (server-side `gemini-3.8-flash`)
- **Database Architecture**: PostgreSQL Relational Schema with multi-tenant readiness
