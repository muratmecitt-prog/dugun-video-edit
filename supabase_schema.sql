-- 1. PACKAGES TABLE (Paketler)
create table if not exists packages (
  id uuid default gen_random_uuid() primary key,
  name text not null,               -- "PAKET 1 - Teaser"
  price numeric not null,           -- 2000
  features jsonb default '[]'::jsonb, -- ["Özellik 1", "Özellik 2"]
  duration text,                    -- "30-60 saniye"
  delivery_time text,               -- "7 iş günü"
  is_active boolean default true,   -- Göster/Gizle
  display_order integer default 0,  -- Sıralama
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. CAMPAIGNS TABLE (Kampanyalar)
create table if not exists campaigns (
  id uuid default gen_random_uuid() primary key,
  name text,                        -- "Açılış İndirimi" (Admin görür)
  code text unique not null,        -- "MERHABA20" (Müşteri girer)
  discount_type text check (discount_type in ('PERCENTAGE', 'FIXED')), -- Yüzde mi, Sabit Tutar mı?
  discount_value numeric not null,  -- 20 (%20) veya 500 (500 TL)
  min_order_count integer default 0, -- Sadece ilk X siparişi olanlar için (örn: 3)
  is_active boolean default true,
  usage_limit integer,              -- Toplam kaç kişi kullanabilir? (Boşsa sınırsız)
  used_count integer default 0,     -- Kaç kez kullanıldı?
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. GÜVENLİK AYARLARI (RLS)
alter table packages enable row level security;
alter table campaigns enable row level security;

-- Herkes paketleri görebilir
create policy "Packages viewable by everyone" on packages for select using (true);
-- Sadece admin (muratmecitt) düzenleyebilir
create policy "Packages manageable by admin" on packages for all using (auth.email() = 'muratmecitt@gmail.com');

-- Herkes kampanya kodlarını sorgulayabilir (Geçerlilik kontrolü için)
create policy "Campaigns viewable by everyone" on campaigns for select using (true);
-- Sadece admin yönetebilir
create policy "Campaigns manageable by admin" on campaigns for all using (auth.email() = 'muratmecitt@gmail.com');

-- 4. BAŞLANGIÇ VERİLERİ (Mevcut Paketlerin)
insert into packages (name, price, features, duration, delivery_time, display_order) values
('Teaser', 2000, '["Temel Kurgu", "Müzik ve Renk Düzenleme", "Sosyal Medya İçin Uygun"]', '30–60 saniye', '7 iş günü', 1),
('Düğün Klibi', 4000, '["Hikaye Kurgusu", "Sinematik Akış", "Renk ve Ritim Düzenleme", "Müzik Seçimi"]', '3–5 dakika', '14 iş günü', 2),
('Teaser + Klip', 5000, '["Sosyal Medya Teaserı", "Tam Düğün Klibi", "Hikaye Bütünlüğü", "Avantajlı Fiyat"]', 'Teaser + 3-5 dk Klip', '14 iş günü', 3),
('Düğün Belgeseli', 7000, '["Belgesel Formatında Anlatım", "Teaser Dahil", "Detaylı Kurgu", "Geniş Kapsamlı Hikaye"]', '5–10 dakika', '21 iş günü', 4);
