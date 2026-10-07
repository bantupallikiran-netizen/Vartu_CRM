# Vartu Creations — PostgreSQL Database Architecture & Schema

## 1. Entity Relationship Overview (ERD)

```
organizations (1) ────< users (N)
      │
      ├────< leads (N) ────────< follow_ups (N)
      │
      ├────< customers (N) ────┬────< quotations (N) ────< quotation_items (N)
      │                        │
      │                        └────< orders (N) ────────┬────< order_items (N)
      │                                                  ├────< production_records (N)
      │                                                  ├────< payments (N)
      │                                                  ├────< invoices (N)
      │                                                  └────< dispatches (N)
      │
      ├────< products (N) ─────┬────< product_categories (1)
      │                        └────< product_costings (1)
      │
      └────< inventory_items (N)
```

---

## 2. Table Definitions (DDL)

```sql
-- Organizations (Multi-tenant foundation)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    brand_tagline VARCHAR(255),
    gstin VARCHAR(15),
    currency VARCHAR(10) DEFAULT 'INR',
    default_gst_rate NUMERIC(5,2) DEFAULT 18.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users & Roles
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Owner/Admin', 'Sales/Order Manager', 'Production', 'Accounts', 'Viewer')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    customer_number VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    whatsapp VARCHAR(20),
    email VARCHAR(255),
    company VARCHAR(255),
    gstin VARCHAR(15),
    street TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),
    customer_type VARCHAR(50) NOT NULL,
    customer_source VARCHAR(50),
    total_orders INTEGER DEFAULT 0,
    total_purchase_value NUMERIC(12,2) DEFAULT 0.00,
    outstanding_amount NUMERIC(12,2) DEFAULT 0.00,
    lifetime_value NUMERIC(12,2) DEFAULT 0.00,
    customer_rating INTEGER DEFAULT 5,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    lead_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    whatsapp VARCHAR(20),
    email VARCHAR(255),
    instagram_id VARCHAR(100),
    company_name VARCHAR(255),
    lead_source VARCHAR(50) NOT NULL,
    product_interest JSONB DEFAULT '[]',
    quantity INTEGER DEFAULT 1,
    customization_required BOOLEAN DEFAULT FALSE,
    customization_notes TEXT,
    expected_budget NUMERIC(12,2),
    expected_delivery_date DATE,
    priority VARCHAR(20) DEFAULT 'Medium',
    status VARCHAR(50) DEFAULT 'New',
    assigned_user VARCHAR(100),
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product Catalogue
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    description TEXT,
    image_url TEXT,
    selling_price NUMERIC(10,2) NOT NULL,
    cost_price NUMERIC(10,2) NOT NULL,
    raw_material_cost NUMERIC(10,2) DEFAULT 0.00,
    labour_cost NUMERIC(10,2) DEFAULT 0.00,
    packaging_cost NUMERIC(10,2) DEFAULT 0.00,
    other_cost NUMERIC(10,2) DEFAULT 0.00,
    moq INTEGER DEFAULT 1,
    bulk_price NUMERIC(10,2),
    bulk_moq INTEGER DEFAULT 20,
    wholesale_price NUMERIC(10,2),
    wholesale_moq INTEGER DEFAULT 50,
    stock_quantity INTEGER DEFAULT 0,
    min_stock_level INTEGER DEFAULT 5,
    production_time_days INTEGER DEFAULT 2,
    customization_available BOOLEAN DEFAULT TRUE,
    customization_charge NUMERIC(10,2) DEFAULT 0.00,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quotations
CREATE TABLE quotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    quotation_number VARCHAR(50) UNIQUE NOT NULL,
    quotation_date DATE NOT NULL,
    valid_until DATE NOT NULL,
    customer_id UUID REFERENCES customers(id),
    customer_name VARCHAR(255) NOT NULL,
    customer_mobile VARCHAR(20) NOT NULL,
    customer_address TEXT,
    customer_email VARCHAR(255),
    subtotal NUMERIC(12,2) NOT NULL,
    discount_amount NUMERIC(12,2) DEFAULT 0.00,
    packaging_charge NUMERIC(12,2) DEFAULT 0.00,
    shipping_charge NUMERIC(12,2) DEFAULT 0.00,
    gst_rate_percent NUMERIC(5,2) DEFAULT 18.00,
    gst_type VARCHAR(20) DEFAULT 'CGST_SGST',
    gst_amount NUMERIC(12,2) DEFAULT 0.00,
    grand_total NUMERIC(12,2) NOT NULL,
    advance_required NUMERIC(12,2) NOT NULL,
    balance_amount NUMERIC(12,2) NOT NULL,
    delivery_timeline VARCHAR(255),
    terms_and_conditions TEXT,
    status VARCHAR(50) DEFAULT 'Sent',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id),
    customer_name VARCHAR(255) NOT NULL,
    customer_mobile VARCHAR(20) NOT NULL,
    customer_address TEXT,
    quotation_id UUID REFERENCES quotations(id),
    order_date DATE NOT NULL,
    required_delivery_date DATE NOT NULL,
    order_type VARCHAR(50) NOT NULL,
    priority VARCHAR(20) DEFAULT 'Medium',
    total_value NUMERIC(12,2) NOT NULL,
    advance_required NUMERIC(12,2) NOT NULL,
    advance_received NUMERIC(12,2) DEFAULT 0.00,
    balance_amount NUMERIC(12,2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'Pending',
    production_status VARCHAR(50) DEFAULT 'Production Pending',
    dispatch_status VARCHAR(50) DEFAULT 'Not Dispatched',
    order_status VARCHAR(50) DEFAULT 'Order Confirmed',
    courier VARCHAR(100),
    tracking_number VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Production Records
CREATE TABLE production_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    order_number VARCHAR(50) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    sku VARCHAR(100),
    required_qty INTEGER NOT NULL,
    produced_qty INTEGER DEFAULT 0,
    rejected_qty INTEGER DEFAULT 0,
    balance_qty INTEGER NOT NULL,
    start_date DATE,
    expected_completion_date DATE,
    actual_completion_date DATE,
    status VARCHAR(50) DEFAULT 'Pending',
    controller VARCHAR(100),
    remarks TEXT
);

-- Payments
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    receipt_number VARCHAR(50) UNIQUE NOT NULL,
    order_id UUID REFERENCES orders(id),
    order_number VARCHAR(50) NOT NULL,
    customer_id UUID REFERENCES customers(id),
    customer_name VARCHAR(255) NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    payment_date DATE NOT NULL,
    mode VARCHAR(50) NOT NULL,
    transaction_ref VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'Completed',
    notes TEXT
);

-- Inventory Items
CREATE TABLE inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    category VARCHAR(100),
    unit VARCHAR(20) NOT NULL,
    current_stock NUMERIC(10,2) NOT NULL,
    min_stock_level NUMERIC(10,2) NOT NULL,
    reorder_level NUMERIC(10,2) NOT NULL,
    unit_cost NUMERIC(10,2) NOT NULL,
    supplier VARCHAR(255),
    last_restocked DATE
);
```
