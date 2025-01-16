-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE budget_type AS ENUM ('monthly', 'vacation', 'home', 'project', 'savings', 'custom');
CREATE TYPE currency_code AS ENUM ('USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'NOK', 'NZD', 'SEK', 'SGD');

-- Tables
CREATE TABLE budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type budget_type NOT NULL,
    month_year DATE NOT NULL,
    amount DECIMAL(12,2) NOT NULL CHECK (amount >= 0),
    completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    budget_id UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    budget_amount DECIMAL(12,2) NOT NULL CHECK (budget_amount >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(budget_id, name)
);

CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    budget_id UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL CHECK (amount >= 0),
    description TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE exchange_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_currency currency_code NOT NULL,
    to_currency currency_code NOT NULL,
    rate DECIMAL(12,6) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(from_currency, to_currency, date)
);

CREATE TABLE favorite_currency_pairs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_currency currency_code NOT NULL,
    to_currency currency_code NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(from_currency, to_currency)
);

-- Indexes
CREATE INDEX idx_budgets_month_year ON budgets(month_year);
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_budget_id ON expenses(budget_id);
CREATE INDEX idx_expenses_category_id ON expenses(category_id);
CREATE INDEX idx_exchange_rates_date ON exchange_rates(date);
CREATE INDEX idx_categories_budget_id ON categories(budget_id);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_budgets_updated_at
    BEFORE UPDATE ON budgets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Functions
CREATE OR REPLACE FUNCTION get_monthly_expenses(budget_id_param UUID, start_date DATE, end_date DATE)
RETURNS TABLE (
    category_name VARCHAR(255),
    total_amount DECIMAL(12,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT c.name, COALESCE(SUM(e.amount), 0) as total_amount
    FROM categories c
    LEFT JOIN expenses e ON c.id = e.category_id
        AND e.date >= start_date
        AND e.date <= end_date
    WHERE c.budget_id = budget_id_param
    GROUP BY c.name;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_budget_stats(budget_id_param UUID)
RETURNS TABLE (
    total_budget DECIMAL(12,2),
    total_spent DECIMAL(12,2),
    remaining DECIMAL(12,2),
    spent_percentage DECIMAL(5,2)
) AS $$
BEGIN
    RETURN QUERY
    WITH budget_totals AS (
        SELECT 
            b.amount as budget_amount,
            COALESCE(SUM(e.amount), 0) as spent_amount
        FROM budgets b
        LEFT JOIN expenses e ON b.id = e.budget_id
            AND DATE_TRUNC('month', e.date) = DATE_TRUNC('month', CURRENT_DATE)
        WHERE b.id = budget_id_param
        GROUP BY b.amount
    )
    SELECT 
        budget_amount,
        spent_amount,
        budget_amount - spent_amount,
        CASE 
            WHEN budget_amount > 0 THEN (spent_amount / budget_amount * 100)
            ELSE 0
        END
    FROM budget_totals;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_exchange_rate_history(
    from_curr currency_code,
    to_curr currency_code,
    days_back INTEGER
)
RETURNS TABLE (
    rate_date DATE,
    exchange_rate DECIMAL(12,6)
) AS $$
BEGIN
    RETURN QUERY
    SELECT er.date, er.rate
    FROM exchange_rates er
    WHERE er.from_currency = from_curr
        AND er.to_currency = to_curr
        AND er.date >= CURRENT_DATE - days_back
        AND er.date <= CURRENT_DATE
    ORDER BY er.date;
END;
$$ LANGUAGE plpgsql;

-- Views
CREATE OR REPLACE VIEW monthly_budget_summary AS
SELECT 
    b.id as budget_id,
    b.name as budget_name,
    b.type as budget_type,
    b.amount as total_budget,
    COALESCE(SUM(e.amount), 0) as total_spent,
    b.amount - COALESCE(SUM(e.amount), 0) as remaining,
    CASE 
        WHEN b.amount > 0 THEN (COALESCE(SUM(e.amount), 0) / b.amount * 100)
        ELSE 0
    END as spent_percentage,
    COUNT(DISTINCT e.id) as transaction_count,
    b.completed
FROM budgets b
LEFT JOIN expenses e ON b.id = e.budget_id
    AND DATE_TRUNC('month', e.date) = DATE_TRUNC('month', b.month_year)
GROUP BY b.id, b.name, b.type, b.amount, b.completed;

-- Permissions (adjust as needed)
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO your_app_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO your_app_user; 