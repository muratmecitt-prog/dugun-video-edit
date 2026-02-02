-- 1. FAQS TABLE (Sıkça Sorulan Sorular)
create table if not exists faqs (
  id uuid default gen_random_uuid() primary key,
  question text not null,
  answer text not null,
  display_order integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. GÜVENLİK AYARLARI (RLS)
alter table faqs enable row level security;

-- Herkes soruları görebilir
create policy "Faqs viewable by everyone" on faqs for select using (true);
-- Sadece admin yönetebilir
create policy "Faqs manageable by admin" on faqs for all using (auth.email() = 'muratmecitt@gmail.com');

-- 3. BAŞLANGIÇ VERİLERİ (Mevcut Sorular)
insert into faqs (question, answer, display_order) values
('Kaç revize hakkım var?', 'Her siparişiniz için 1 tur kapsamlı revize hakkınız bulunmaktadır. Bu turda tüm notlarınızı iletmeniz durumunda gerekli düzenlemeler yapılır.', 1),
('Müzik seçimini kim yapıyor?', 'Video kurgusunun en önemli parçası olan müzik seçimini, videonun ruhuna ve ritmine uygun olarak profesyonel editörlerimiz yapar. Telifsiz veya lisanslı stok müzik kütüphanelerimizden en uygun parça seçilir.', 2),
('Çekim formatım standartlara uymuyorsa ne olur?', 'Yine de işleme alabiliriz. Ancak 1080p altı çözünürlüklerde veya 25fps çekimlerde (slow-motion yapılamayacağı için) kurgu dili değişebilir. En iyi sonuç için "Çekim Standartları" sayfamızı incelemenizi öneririz.', 3),
('Dosyaları nasıl gönderiyorum?', 'Görüntülerinizi WeTransfer, Google Drive, Dropbox gibi bulut servislerine yükleyip linki sipariş oluşturma formuna yapıştırmanız yeterlidir.', 4),
('Teslim süresi uzar mı?', 'Mücbir sebepler (sağlık, teknik arıza vb.) olmadığı sürece paketlerde belirtilen süreler (7-21 gün) içerisinde teslimat yapılır.', 5),
('Aynı anda birden fazla sipariş verebilir miyim?', 'Evet, paneliniz üzerinden dilediğiniz kadar sipariş oluşturabilirsiniz. Her biri ayrı proje olarak takip edilecektir.', 6);
