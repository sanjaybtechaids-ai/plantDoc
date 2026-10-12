-- ==============================================================================
-- Plant Doctor - Complete Database Migration
-- PostgreSQL / Supabase Schema with Row Level Security (RLS)
-- ==============================================================================

-- 1. Profiles Table (syncs with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 2. Plants Table
CREATE TABLE IF NOT EXISTS public.plants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    species TEXT,
    image_url TEXT,
    planting_date DATE,
    location TEXT,
    soil_type TEXT,
    sunlight TEXT,
    watering_frequency TEXT,
    pot_size TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 3. Plant Diagnoses Table
CREATE TABLE IF NOT EXISTS public.plant_diagnoses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plant_id UUID REFERENCES public.plants(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    plant_name TEXT,
    species TEXT,
    health_score INTEGER NOT NULL CHECK (health_score >= 0 AND health_score <= 100),
    severity TEXT NOT NULL CHECK (severity IN ('healthy', 'mild', 'moderate', 'severe', 'critical')),
    diagnosis_name TEXT NOT NULL,
    diagnosis_confidence NUMERIC(5,2),
    certainty TEXT NOT NULL CHECK (certainty IN ('confirmed', 'likely', 'possible', 'uncertain')),
    summary TEXT,
    symptoms JSONB DEFAULT '[]'::jsonb NOT NULL,
    affected_parts JSONB DEFAULT '[]'::jsonb NOT NULL,
    possible_causes JSONB DEFAULT '[]'::jsonb NOT NULL,
    visual_analysis JSONB DEFAULT '{}'::jsonb NOT NULL,
    immediate_actions JSONB DEFAULT '[]'::jsonb NOT NULL,
    natural_treatments JSONB DEFAULT '[]'::jsonb NOT NULL,
    chemical_treatments JSONB DEFAULT '[]'::jsonb NOT NULL,
    fertilizer_recommendations JSONB DEFAULT '{}'::jsonb NOT NULL,
    prevention JSONB DEFAULT '[]'::jsonb NOT NULL,
    monitoring JSONB DEFAULT '{}'::jsonb NOT NULL,
    warnings JSONB DEFAULT '[]'::jsonb NOT NULL,
    professional_advice TEXT,
    ai_model TEXT NOT NULL DEFAULT 'gemini-2.5-flash',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 4. Plant Monitoring Table
CREATE TABLE IF NOT EXISTS public.plant_monitoring (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plant_id UUID REFERENCES public.plants(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    health_score INTEGER NOT NULL CHECK (health_score >= 0 AND health_score <= 100),
    previous_health_score INTEGER CHECK (previous_health_score >= 0 AND previous_health_score <= 100),
    health_score_change INTEGER DEFAULT 0,
    severity TEXT NOT NULL CHECK (severity IN ('healthy', 'mild', 'moderate', 'severe', 'critical')),
    improvement_status TEXT CHECK (improvement_status IN ('improving', 'stable', 'declining', 'uncertain')),
    diagnosis_name TEXT,
    notes TEXT,
    ai_comparison JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 5. Monitoring Reminders Table
CREATE TABLE IF NOT EXISTS public.monitoring_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plant_id UUID REFERENCES public.plants(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    reminder_time TIME NOT NULL DEFAULT '09:00:00',
    timezone TEXT NOT NULL DEFAULT 'UTC',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    last_reminded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    CONSTRAINT unique_plant_reminder UNIQUE (plant_id, user_id)
);

-- 6. Products Catalog Table (Curated, Trusted Agricultural Supplies)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Fungicide', 'Organic Pesticide', 'Fertilizer', 'Soil & Care', 'Equipment')),
    description TEXT NOT NULL,
    image_url TEXT,
    price NUMERIC(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    purchase_url TEXT,
    brand TEXT,
    rating NUMERIC(3,2) DEFAULT 4.5,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 7. Chat Conversations Table
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    plant_id UUID REFERENCES public.plants(id) ON DELETE SET NULL,
    title TEXT DEFAULT 'Plant Health Consultation',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 8. Chat Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    image_url TEXT,
    diagnosis_card JSONB,
    suggested_actions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ==============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_plants_user_id ON public.plants(user_id);
CREATE INDEX IF NOT EXISTS idx_plant_diagnoses_user_id ON public.plant_diagnoses(user_id);
CREATE INDEX IF NOT EXISTS idx_plant_diagnoses_plant_id ON public.plant_diagnoses(plant_id);
CREATE INDEX IF NOT EXISTS idx_plant_diagnoses_created_at ON public.plant_diagnoses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_plant_monitoring_plant_id ON public.plant_monitoring(plant_id);
CREATE INDEX IF NOT EXISTS idx_plant_monitoring_user_id ON public.plant_monitoring(user_id);
CREATE INDEX IF NOT EXISTS idx_plant_monitoring_created_at ON public.plant_monitoring(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_plant_id ON public.conversations(plant_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at ASC);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category) WHERE active = TRUE;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all user data tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plant_diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plant_monitoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monitoring_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Plants Policies
CREATE POLICY "Users can view own plants" ON public.plants
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own plants" ON public.plants
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own plants" ON public.plants
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own plants" ON public.plants
    FOR DELETE USING (auth.uid() = user_id);

-- Plant Diagnoses Policies
CREATE POLICY "Users can view own diagnoses" ON public.plant_diagnoses
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own diagnoses" ON public.plant_diagnoses
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own diagnoses" ON public.plant_diagnoses
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own diagnoses" ON public.plant_diagnoses
    FOR DELETE USING (auth.uid() = user_id);

-- Plant Monitoring Policies
CREATE POLICY "Users can view own monitoring records" ON public.plant_monitoring
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own monitoring records" ON public.plant_monitoring
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own monitoring records" ON public.plant_monitoring
    FOR DELETE USING (auth.uid() = user_id);

-- Monitoring Reminders Policies
CREATE POLICY "Users can manage own reminders" ON public.monitoring_reminders
    FOR ALL USING (auth.uid() = user_id);

-- Products Policies: Publicly readable for active items
CREATE POLICY "Public can view active products" ON public.products
    FOR SELECT USING (active = TRUE);

-- Conversations Policies
CREATE POLICY "Users can view own conversations" ON public.conversations
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own conversations" ON public.conversations
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own conversations" ON public.conversations
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own conversations" ON public.conversations
    FOR DELETE USING (auth.uid() = user_id);

-- Messages Policies
CREATE POLICY "Users can view messages from their conversations" ON public.messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.conversations c
            WHERE c.id = messages.conversation_id AND c.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can insert messages to their conversations" ON public.messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.conversations c
            WHERE c.id = messages.conversation_id AND c.user_id = auth.uid()
        )
    );

-- ==============================================================================
-- STORAGE BUCKETS SETUP (Run via Supabase Dashboard or Storage API)
-- plant-images: private / secured per user
-- profile-images: public read, user write
-- product-images: public read
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('plant-images', 'plant-images', false),
    ('profile-images', 'profile-images', true),
    ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Users can upload their own plant images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'plant-images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can read their own plant images" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'plant-images' 
        AND (auth.uid()::text = (storage.foldername(name))[1] OR auth.role() = 'service_role')
    );

CREATE POLICY "Public read for product images" ON storage.objects
    FOR SELECT USING (bucket_id = 'product-images');

-- ==============================================================================
-- SEED INITIAL CURATED PRODUCTS
-- ==============================================================================
INSERT INTO public.products (name, category, description, image_url, price, currency, purchase_url, brand, rating, active)
VALUES
    ('Pure Organic Cold-Pressed Neem Oil (250ml)', 'Organic Pesticide', 'Concentrated azadirachtin-rich botanical emulsion. Effective against spider mites, powdery mildew, and foliar aphids.', '/images/products/neem-oil.jpg', 349.00, 'INR', 'https://example.com/products/neem-oil', 'BioGuard Botanicals', 4.8, TRUE),
    ('Liquid Copper Fungicide Concentrated (500ml)', 'Fungicide', 'Broad spectrum copper octanoate formula targeting Early Blight, Late Blight, anthracnose, and bacterial spot.', '/images/products/copper-fungicide.jpg', 599.00, 'INR', 'https://example.com/products/copper-fungicide', 'AgriShield Pro', 4.7, TRUE),
    ('Balanced Organic Bio-Fertilizer 4-3-3 (1kg)', 'Fertilizer', 'Slow-release organic plant nourishment rich in humic acids, mycorrhizae, and balanced NPK for sustained foliage immunity.', '/images/products/organic-fertilizer.jpg', 449.00, 'INR', 'https://example.com/products/bio-fertilizer', 'TerraVital Organics', 4.9, TRUE),
    ('Potassium & Micronutrient Foliar Booster (200ml)', 'Fertilizer', 'Chelated potassium, magnesium, and iron booster for rapid correction of leaf chlorosis and strengthening cell walls.', '/images/products/foliar-booster.jpg', 299.00, 'INR', 'https://example.com/products/micronutrient-booster', 'PlantVitality Labs', 4.6, TRUE),
    ('Precision Bypass Pruning Shears (Stainless)', 'Equipment', 'Surgical-grade stainless steel bypass blades designed for clean sanitary pruning of diseased vegetation without tissue crushing.', '/images/products/pruning-shears.jpg', 799.00, 'INR', 'https://example.com/products/bypass-shears', 'FloraCut Pro', 4.9, TRUE)
ON CONFLICT DO NOTHING;
