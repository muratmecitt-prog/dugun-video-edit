-- Add new columns to campaigns table for visual/auto-apply features
alter table campaigns 
add column if not exists is_auto_apply boolean default false,
add column if not exists badge_text text, -- e.g. "BLACK FRIDAY", "%20 İNDİRİM"
add column if not exists start_date timestamp with time zone,
add column if not exists end_date timestamp with time zone;

-- Policy update not needed as existing policies cover "all" operations for admin.
-- If you want to be extra safe, re-run:
-- create policy "Campaigns manageable by admin" on campaigns for all using (auth.email() = 'muratmecitt@gmail.com');
