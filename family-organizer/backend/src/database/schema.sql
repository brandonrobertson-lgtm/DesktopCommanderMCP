-- Family Organizer Database Schema
-- PostgreSQL 14+

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    avatar TEXT,
    family_id UUID,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'parent', 'child', 'guest')),
    is_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Families Table
CREATE TABLE families (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    timezone VARCHAR(50) DEFAULT 'UTC',
    default_location TEXT,
    wall_display_enabled BOOLEAN DEFAULT FALSE,
    wall_display_modules JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key after families table is created
ALTER TABLE users ADD CONSTRAINT fk_users_family FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE SET NULL;

-- OAuth Providers Table
CREATE TABLE oauth_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    provider_user_id VARCHAR(255) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(provider, provider_user_id)
);

-- Budgets Table
CREATE TABLE budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    spent DECIMAL(12, 2) DEFAULT 0,
    period VARCHAR(20) CHECK (period IN ('weekly', 'monthly', 'yearly')),
    category VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions Table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    type VARCHAR(20) CHECK (type IN ('income', 'expense')),
    source VARCHAR(50) CHECK (source IN ('manual', 'wealthsimple', 'ynab')),
    budget_id UUID REFERENCES budgets(id) ON DELETE SET NULL,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bills Table
CREATE TABLE bills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    due_date DATE NOT NULL,
    frequency VARCHAR(20) CHECK (frequency IN ('weekly', 'monthly', 'quarterly', 'yearly')),
    category VARCHAR(100) NOT NULL,
    is_paid BOOLEAN DEFAULT FALSE,
    auto_pay_enabled BOOLEAN DEFAULT FALSE,
    payee VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Receipts Table
CREATE TABLE receipts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    vendor VARCHAR(255) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    date DATE NOT NULL,
    category VARCHAR(100) NOT NULL,
    image_url TEXT NOT NULL,
    ocr_data JSONB,
    items JSONB DEFAULT '[]',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email Accounts Table
CREATE TABLE email_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(20) CHECK (provider IN ('gmail', 'microsoft', 'icloud')),
    email VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),
    is_default BOOLEAN DEFAULT FALSE,
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, email)
);

-- Todo Lists Table
CREATE TABLE todo_lists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    color VARCHAR(7),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Todo Items Table
CREATE TABLE todo_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    list_id UUID NOT NULL REFERENCES todo_lists(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    priority VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high')),
    due_date TIMESTAMP,
    assigned_to UUID REFERENCES users(id),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Grocery Lists Table
CREATE TABLE grocery_lists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Grocery Items Table
CREATE TABLE grocery_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    list_id UUID NOT NULL REFERENCES grocery_lists(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    quantity DECIMAL(10, 2) DEFAULT 1,
    unit VARCHAR(50),
    category VARCHAR(100),
    checked BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vehicles Table
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    vin VARCHAR(17),
    license_plate VARCHAR(20),
    color VARCHAR(50),
    current_mileage INTEGER DEFAULT 0,
    fuel_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vehicle Maintenance Table
CREATE TABLE vehicle_maintenance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    type VARCHAR(50) CHECK (type IN ('oil_change', 'tire_rotation', 'brake_service', 'general', 'other')),
    description TEXT NOT NULL,
    date DATE NOT NULL,
    mileage INTEGER NOT NULL,
    cost DECIMAL(10, 2),
    vendor VARCHAR(255),
    next_due_date DATE,
    next_due_mileage INTEGER,
    fluids_used JSONB DEFAULT '[]',
    notes TEXT,
    receipt_id UUID REFERENCES receipts(id),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Maintenance Schedules Table
CREATE TABLE maintenance_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    interval_miles INTEGER NOT NULL,
    interval_months INTEGER NOT NULL,
    last_performed_date DATE,
    last_performed_mileage INTEGER,
    is_active BOOLEAN DEFAULT TRUE
);

-- Homes Table
CREATE TABLE homes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    type VARCHAR(20) CHECK (type IN ('primary', 'vacation', 'rental', 'other')),
    purchase_date DATE,
    square_footage INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appliances Table
CREATE TABLE appliances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    home_id UUID NOT NULL REFERENCES homes(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) CHECK (category IN ('kitchen', 'laundry', 'hvac', 'water', 'electrical', 'other')),
    brand VARCHAR(100),
    model VARCHAR(100),
    serial_number VARCHAR(100),
    purchase_date DATE,
    warranty_expiration DATE,
    location VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appliance Maintenance Table
CREATE TABLE appliance_maintenance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appliance_id UUID NOT NULL REFERENCES appliances(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    cost DECIMAL(10, 2),
    vendor VARCHAR(255),
    next_due_date DATE,
    notes TEXT,
    receipt_id UUID REFERENCES receipts(id),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contacts Table
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) CHECK (category IN ('insurance', 'bank', 'medical', 'utility', 'emergency', 'other')),
    company VARCHAR(255),
    phone_numbers JSONB DEFAULT '[]',
    emails JSONB DEFAULT '[]',
    address TEXT,
    website TEXT,
    notes TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Password Entries Table (Encrypted)
CREATE TABLE password_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    encrypted_password TEXT NOT NULL,
    website TEXT,
    category VARCHAR(100),
    notes TEXT,
    is_favorite BOOLEAN DEFAULT FALSE,
    shared_with JSONB DEFAULT '[]',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used TIMESTAMP
);

-- Password Folders Table
CREATE TABLE password_folders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    color VARCHAR(7),
    parent_id UUID REFERENCES password_folders(id) ON DELETE CASCADE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents Table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('pdf', 'image', 'doc', 'spreadsheet', 'other')),
    category VARCHAR(50) CHECK (category IN ('legal', 'financial', 'medical', 'personal', 'other')),
    file_url TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    is_encrypted BOOLEAN DEFAULT FALSE,
    tags JSONB DEFAULT '[]',
    shared_with JSONB DEFAULT '[]',
    folder_id UUID,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Document Folders Table
CREATE TABLE document_folders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    color VARCHAR(7),
    parent_id UUID REFERENCES document_folders(id) ON DELETE CASCADE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat Messages Table
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    type VARCHAR(20) CHECK (type IN ('text', 'image', 'file', 'location')),
    attachments JSONB DEFAULT '[]',
    reply_to UUID REFERENCES chat_messages(id),
    is_edited BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medications Table
CREATE TABLE medications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    frequency VARCHAR(255) NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE,
    prescribed_by VARCHAR(255),
    pharmacy VARCHAR(255),
    refill_date DATE,
    instructions TEXT,
    side_effects JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medication Logs Table
CREATE TABLE medication_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    medication_id UUID NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
    taken_at TIMESTAMP NOT NULL,
    taken_by UUID NOT NULL REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fridge Items Table
CREATE TABLE fridge_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    quantity DECIMAL(10, 2) DEFAULT 1,
    unit VARCHAR(50),
    category VARCHAR(50) CHECK (category IN ('dairy', 'meat', 'produce', 'beverages', 'condiments', 'leftovers', 'other')),
    location VARCHAR(20) CHECK (location IN ('fridge', 'freezer', 'pantry')),
    purchase_date DATE,
    expiration_date DATE,
    is_expired BOOLEAN DEFAULT FALSE,
    barcode VARCHAR(50),
    image_url TEXT,
    added_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recipes Table
CREATE TABLE recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    prep_time INTEGER NOT NULL,
    cook_time INTEGER NOT NULL,
    servings INTEGER NOT NULL,
    ingredients JSONB NOT NULL,
    instructions JSONB NOT NULL,
    category VARCHAR(100),
    cuisine VARCHAR(100),
    total_calories INTEGER,
    nutrition_info JSONB,
    tags JSONB DEFAULT '[]',
    is_favorite BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Meal Plans Table
CREATE TABLE meal_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    meal_type VARCHAR(20) CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    recipe_id UUID REFERENCES recipes(id) ON DELETE SET NULL,
    recipe_name VARCHAR(255) NOT NULL,
    servings INTEGER NOT NULL,
    total_calories INTEGER,
    notes TEXT,
    is_prepared BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Calorie Logs Table
CREATE TABLE calorie_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    meal_type VARCHAR(20) CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    food_name VARCHAR(255) NOT NULL,
    serving_size DECIMAL(10, 2) NOT NULL,
    calories INTEGER NOT NULL,
    nutrition_info JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Food Database Table
CREATE TABLE food_database (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(255),
    serving_size DECIMAL(10, 2) NOT NULL,
    serving_unit VARCHAR(50) NOT NULL,
    calories INTEGER NOT NULL,
    nutrition_info JSONB NOT NULL,
    barcode VARCHAR(50),
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notes Table
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    format VARCHAR(20) CHECK (format IN ('text', 'markdown', 'rich')),
    tags JSONB DEFAULT '[]',
    is_pinned BOOLEAN DEFAULT FALSE,
    shared_with JSONB DEFAULT '[]',
    folder_id UUID,
    attachments JSONB DEFAULT '[]',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Note Folders Table
CREATE TABLE note_folders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    color VARCHAR(7),
    parent_id UUID REFERENCES note_folders(id) ON DELETE CASCADE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications Table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_family_id ON users(family_id);
CREATE INDEX idx_budgets_family_id ON budgets(family_id);
CREATE INDEX idx_transactions_family_id ON transactions(family_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_bills_family_id ON bills(family_id);
CREATE INDEX idx_bills_due_date ON bills(due_date);
CREATE INDEX idx_receipts_family_id ON receipts(family_id);
CREATE INDEX idx_todo_items_assigned_to ON todo_items(assigned_to);
CREATE INDEX idx_vehicles_family_id ON vehicles(family_id);
CREATE INDEX idx_homes_family_id ON homes(family_id);
CREATE INDEX idx_contacts_family_id ON contacts(family_id);
CREATE INDEX idx_password_entries_family_id ON password_entries(family_id);
CREATE INDEX idx_documents_family_id ON documents(family_id);
CREATE INDEX idx_chat_messages_family_id ON chat_messages(family_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX idx_medications_user_id ON medications(user_id);
CREATE INDEX idx_fridge_items_family_id ON fridge_items(family_id);
CREATE INDEX idx_fridge_items_expiration ON fridge_items(expiration_date);
CREATE INDEX idx_meal_plans_family_id ON meal_plans(family_id);
CREATE INDEX idx_meal_plans_date ON meal_plans(date);
CREATE INDEX idx_notes_family_id ON notes(family_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_families_updated_at BEFORE UPDATE ON families FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bills_updated_at BEFORE UPDATE ON bills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_todo_lists_updated_at BEFORE UPDATE ON todo_lists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_grocery_lists_updated_at BEFORE UPDATE ON grocery_lists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_homes_updated_at BEFORE UPDATE ON homes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appliances_updated_at BEFORE UPDATE ON appliances FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_password_entries_updated_at BEFORE UPDATE ON password_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chat_messages_updated_at BEFORE UPDATE ON chat_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medications_updated_at BEFORE UPDATE ON medications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fridge_items_updated_at BEFORE UPDATE ON fridge_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON recipes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
