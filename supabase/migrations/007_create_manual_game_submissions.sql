-- Create manual_game_submissions table
CREATE TABLE public.manual_game_submissions (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    submitted_by UUID REFERENCES auth.users(id) NOT NULL,
    title TEXT NOT NULL,
    platform TEXT,
    release_year INTEGER,
    igdb_url TEXT,
    status TEXT DEFAULT 'Pending' NOT NULL, -- using string here, but enum in app
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.manual_game_submissions ENABLE ROW LEVEL SECURITY;

-- Create Policies
-- Users can view their own submissions
CREATE POLICY "Allow users to read own submissions"
    ON public.manual_game_submissions
    FOR SELECT
    USING (auth.uid() = submitted_by);

-- Users can insert their own submissions
CREATE POLICY "Allow users to insert own submissions"
    ON public.manual_game_submissions
    FOR INSERT
    WITH CHECK (auth.uid() = submitted_by);

-- Admins can do everything (we'll assume a basic true check for service role / admin logic later)
CREATE POLICY "Allow service role full access on submissions"
    ON public.manual_game_submissions
    USING (true);
