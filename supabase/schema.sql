-- ============================================================
-- AICTE Grievance360: PostgreSQL Schema for Supabase
-- Problem Statement 26264 (Smart India Hackathon 2026)
-- ============================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. INSTITUTIONS TABLE
CREATE TABLE IF NOT EXISTS public.institutions (
    aicte_permanent_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    nodal_officer_name TEXT NOT NULL,
    nodal_officer_email TEXT NOT NULL,
    nodal_officer_phone TEXT NOT NULL,
    total_complaints INT DEFAULT 0,
    pending_complaints INT DEFAULT 0,
    resolved_complaints INT DEFAULT 0,
    overdue_complaints INT DEFAULT 0,
    associated_bureaus TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. COMPLAINTS TABLE
CREATE TABLE IF NOT EXISTS public.complaints (
    id TEXT PRIMARY KEY,
    tracking_number TEXT UNIQUE NOT NULL,
    complainant_name TEXT NOT NULL,
    complainant_type TEXT NOT NULL,
    complainant_email TEXT NOT NULL,
    complainant_phone TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT false,
    institution_name TEXT NOT NULL,
    aicte_permanent_id TEXT NOT NULL REFERENCES public.institutions(aicte_permanent_id) ON DELETE CASCADE,
    institution_type TEXT NOT NULL,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    category TEXT NOT NULL,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT NOT NULL,
    assigned_bureau TEXT NOT NULL,
    assigned_officer TEXT NOT NULL,
    status TEXT NOT NULL,
    received_date TEXT NOT NULL,
    last_action_date TEXT NOT NULL,
    expected_disposal_date TEXT NOT NULL,
    sla_days_remaining INT DEFAULT 15,
    supporting_documents JSONB DEFAULT '[]'::jsonb,
    timeline JSONB DEFAULT '[]'::jsonb,
    clarification_requests JSONB DEFAULT '[]'::jsonb,
    institutional_response JSONB,
    internal_remarks JSONB DEFAULT '[]'::jsonb,
    linked_related_case_ids TEXT[] DEFAULT '{}',
    marked_not_related_case_ids TEXT[] DEFAULT '{}',
    coordination_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. OVERLAP ALERTS TABLE
CREATE TABLE IF NOT EXISTS public.overlap_alerts (
    id TEXT PRIMARY KEY,
    complaint_id_a TEXT NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
    complaint_id_b TEXT NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
    institution_name TEXT NOT NULL,
    aicte_permanent_id TEXT NOT NULL,
    bureau_a TEXT NOT NULL,
    bureau_b TEXT NOT NULL,
    subject_a TEXT NOT NULL,
    subject_b TEXT NOT NULL,
    status_a TEXT NOT NULL,
    status_b TEXT NOT NULL,
    similarity_score INT NOT NULL,
    confidence_indicator TEXT NOT NULL,
    detection_reasons TEXT[] DEFAULT '{}',
    recommended_action TEXT NOT NULL,
    is_reviewed BOOLEAN DEFAULT false,
    review_decision TEXT,
    coordination_note TEXT,
    reviewed_by TEXT,
    reviewed_at TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id TEXT PRIMARY KEY,
    target_role TEXT NOT NULL,
    target_user TEXT,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    date TEXT NOT NULL,
    complaint_id TEXT,
    is_read BOOLEAN DEFAULT false,
    type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.overlap_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Anonymous public demo policies (Read and Write for prototype demonstration)
CREATE POLICY "Public Read Access Institutions" ON public.institutions FOR SELECT USING (true);
CREATE POLICY "Public Write Access Institutions" ON public.institutions FOR ALL USING (true);

CREATE POLICY "Public Read Access Complaints" ON public.complaints FOR SELECT USING (true);
CREATE POLICY "Public Write Access Complaints" ON public.complaints FOR ALL USING (true);

CREATE POLICY "Public Read Access Overlaps" ON public.overlap_alerts FOR SELECT USING (true);
CREATE POLICY "Public Write Access Overlaps" ON public.overlap_alerts FOR ALL USING (true);

CREATE POLICY "Public Read Access Notifications" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Public Write Access Notifications" ON public.notifications FOR ALL USING (true);

-- Enable Realtime replication on complaints and notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.complaints;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.overlap_alerts;
