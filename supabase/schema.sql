-- ============================================================
-- TECHGENIX DIGITAL — Database Schema
-- Run this entire file in Supabase SQL Editor (one click: Run)
-- ============================================================

-- 1. SITE SETTINGS (single row: hero text, contact info, social links)
create table if not exists site_settings (
  id int primary key default 1,
  hero_badge text default 'FULL-SERVICE GROWTH AGENCY — CHATTOGRAM, BD',
  hero_headline text default 'Scale your business with strategy, creativity & performance marketing',
  hero_subheadline text default 'From branding and digital marketing to web development and creative production, we help ambitious businesses build authority, generate leads, and drive measurable growth.',
  phone text default '+8801330444384',
  whatsapp text default '8801330444384',
  email text default 'techgenix.digital@gmail.com',
  address text default '4th Floor, BTI Landmark Khulshi, Wireless Circle, Chattogram 4202, Bangladesh',
  business_hours text default 'Saturday – Thursday, 10:00 AM – 8:00 PM',
  facebook_url text default 'https://www.facebook.com/techgenix.digital',
  youtube_url text default 'https://youtube.com/@techgenixdigital2026',
  logo_url text default '',
  constraint single_row check (id = 1)
);
insert into site_settings (id) values (1) on conflict (id) do nothing;

-- 2. SERVICES
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 0,
  number_label text not null default '01',
  title text not null,
  description text not null,
  image_url text default '',
  features text[] default '{}',
  created_at timestamptz default now()
);

-- 3. TESTIMONIALS
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 0,
  name text not null,
  role text not null,
  quote text not null,
  rating int not null default 5 check (rating between 1 and 5),
  created_at timestamptz default now()
);

-- 4. CASE STUDIES
create table if not exists case_studies (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 0,
  metric int not null,
  suffix text default '%',
  label text not null,
  sub_text text default '',
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- Public can READ everything (site needs to display it).
-- Only authenticated (logged-in admin) users can WRITE.
-- ============================================================

alter table site_settings enable row level security;
alter table services enable row level security;
alter table testimonials enable row level security;
alter table case_studies enable row level security;

-- Public read access
create policy "Public read site_settings" on site_settings for select using (true);
create policy "Public read services" on services for select using (true);
create policy "Public read testimonials" on testimonials for select using (true);
create policy "Public read case_studies" on case_studies for select using (true);

-- Authenticated (admin) write access
create policy "Admin write site_settings" on site_settings for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin write services" on services for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin write testimonials" on testimonials for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin write case_studies" on case_studies for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKET for images (logo + service photos)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;

create policy "Public read site-images" on storage.objects for select
  using (bucket_id = 'site-images');
create policy "Admin upload site-images" on storage.objects for insert
  with check (bucket_id = 'site-images' and auth.role() = 'authenticated');
create policy "Admin update site-images" on storage.objects for update
  using (bucket_id = 'site-images' and auth.role() = 'authenticated');
create policy "Admin delete site-images" on storage.objects for delete
  using (bucket_id = 'site-images' and auth.role() = 'authenticated');

-- ============================================================
-- SEED DATA: the 8 original services
-- ============================================================
insert into services (sort_order, number_label, title, description, features) values
(1, '01', 'Digital Marketing & Ads', 'Performance-driven campaigns across Facebook, Google, YouTube and social platforms, built to maximize leads, conversions and ROI.', array['Facebook Ads','Google Ads','Social Media Marketing','Lead Generation','Conversion Optimization']),
(2, '02', 'Creative Content & Video Production', 'Professional content creation and cinematic video production, with promotional campaigns and storytelling that elevate the brand.', array['Commercial Videos','Social Media Content','Promotional Campaigns','Reels & Shorts','Product Videos']),
(3, '03', '360° Brand Strategy', 'Comprehensive brand development, positioning businesses for long-term growth and category leadership.', array['Brand Positioning','Market Analysis','Brand Identity','Growth Strategy','Customer Journey Planning']),
(4, '04', 'Graphic Design & Branding', 'High-impact visual identity systems that build recognition, trust and consistency across every touchpoint.', array['Logo Design','Brand Identity','Social Media Creatives','Marketing Materials','Packaging Design']),
(5, '05', 'Web Development', 'Custom-built modern websites focused on speed, performance, lead generation and a clean user experience.', array['Business Websites','Landing Pages','E-commerce','UI/UX Design','SEO Optimization']),
(6, '06', 'Event Coverage', 'Professional photography and videography for corporate, business, promotional and special events.', array['Corporate Events','Product Launches','Conferences','Live Coverage','Highlight Videos']),
(7, '07', 'Food Photography', 'Premium food photography built to increase engagement, sales and visual appeal for restaurants and food brands.', array['Menu Photography','Product Shoots','Social Media Content','Restaurant Branding','Commercial Campaigns']),
(8, '08', 'Podcast Studio Setup', 'End-to-end podcast studio planning, branding, production workflow and content optimization.', array['Studio Design','Equipment Consultation','Podcast Branding','Recording Setup','Production Workflow'])
on conflict do nothing;

-- SEED DATA: testimonials
insert into testimonials (sort_order, name, role, quote, rating) values
(1, 'Rashed Karim', 'Founder, Retail Brand', 'Lead volume from our ad campaigns roughly tripled within the first two months, and the reporting made it easy to see exactly where the budget was working.', 5),
(2, 'Nusrat Jahan', 'Operations Lead, Restaurant Group', 'The food photography and menu refresh changed how customers engage with our page. Bookings from social went up almost immediately.', 5),
(3, 'Imran Hossain', 'Director, B2B Services', 'Our new site loads fast, ranks better, and actually converts. The team stayed transparent through every stage of the build.', 5)
on conflict do nothing;

-- SEED DATA: case studies
insert into case_studies (sort_order, metric, suffix, label, sub_text) values
(1, 214, '%', 'ROI Increase', 'Facebook & Google Ads, retail client'),
(2, 168, '%', 'Revenue Growth', 'Full-funnel campaign, 6-month period'),
(3, 312, '%', 'Lead Growth', 'Landing page + ad rebuild'),
(4, 245, '%', 'Engagement Growth', 'Content & video production')
on conflict do nothing;
