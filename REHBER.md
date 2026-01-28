# Düğün Video Edit - Proje ve Yayınlama Rehberi

Merhaba! Projenin frontend (görünür yüz) aşamalarını tamamladık. Kod bilginiz olmadığı için bu rehberi en basit haliyle, adım adım hazırladım.

## 1. Sitemi Nasıl Yayına Alırım? (En Kolay Yöntem)

Yaptığımız bu site "Next.js" teknolojisiyle hazırlandı. Bu teknolojiyi en iyi ve ücretsiz yayınlayan platform **Vercel**'dir.

### Adım Adım Yayınlama:
1.  **GitHub Hesabı Açın:** [github.com](https://github.com) adresinden ücretsiz bir hesap oluşturun.
2.  **Kodu Yükleyin:** Bu proje klasörünü GitHub'a "Repository" (Depo) olarak yüklemeniz gerekiyor.
    *   *Bilgisayarınızda:* GitHub Desktop uygulamasını indirip bu klasörü oraya sürükleyip "Publish" diyebilirsiniz.
3.  **Vercel'e Üye Olun:** [vercel.com](https://vercel.com) adresine gidin ve "Continue with GitHub" diyerek giriş yapın.
4.  **Projeyi Seçin:**
    *   Vercel panelinde "Add New Project" butonuna basın.
    *   GitHub hesabınızı bağlayın ve az önce yüklediğiniz projeyi ("dugun-video-edit") listeden seçip "Import" deyin.
    *   Hiçbir ayarı değiştirmeden **"Deploy"** butonuna basın.
5.  **Tebrikler!** 1-2 dakika içinde siteniz `https://dugun-video-edit.vercel.app` gibi bir adreste canlıya alınacak.

## 2. Hostinger Domainimi Nasıl Bağlarım?

Siteniz Vercel'de yayınlandıktan sonra, Hostinger'den aldığınız `dugunvideoedit.com` (örnek) adresini buraya yönlendirmemiz gerek.

1.  **Vercel Ayarları:**
    *   Vercel'de projenize girin -> **Settings** -> **Domains** sekmesine gelin.
    *   Aldığınız domaini (örn: `www.sizindomaininiz.com`) kutuya yazıp "Add" deyin.
    *   Vercel size **DNS Kayıtları (A Record / CNAME)** verecek. (Genelde `76.76.21.21` gibi bir IP adresi verir).

2.  **Hostinger Ayarları:**
    *   [Hostinger Paneline](https://hpanel.hostinger.com/) girin.
    *   Domainler kısmından alan adınızı yönetin -> **DNS / Name Servers** bölümüne gelin.
    *   Mevcut "A Record" kayıtlarını silin veya düzenleyin.
    *   **Tip:** A
    *   **İsim (Name):** @
    *   **Değer (Points to):** Vercel'in size verdiği değer (örn: `76.76.21.21`)
    *   Kaydedin.

## 3. Benimle (AI ile) Nasıl Güncelleme Yapacaksınız?

Beni doğrudan Vercel'e bağlayamazsınız ama **ben bu klasörün içindeyim**. Yani siteyi güncellemek istediğinizde süreç şöyle işler:

1.  **Bana Yazın:** Bu sohbet penceresinden bana "Teaser paketinin fiyatını 3.000 TL yap" gibi bir istekte bulunursunuz.
2.  **Ben Yaparım:** Ben saniyeler içinde kodu değiştiririm.
3.  **Siz Kaydedersiniz:** Siz sadece şu komutları (veya GitHub Desktop'ta "Commit & Push" butonunu) kullanarak değişikliği GitHub'a gönderirsiniz.

**GitHub'a gönderdiğiniz an, Vercel bunu anlar ve sitenizi otomatik günceller.**

### Önemli Uyarı: "Frontend" Nedir?

Şu an yaptığımız proje bir **Frontend (Ön Yüz) Prototipidir**.
*   ✅ Site görünür, sayfalar çalışır, linkler tıklanır.
*   ⚠️ **Veri Kaydetmez:** Sipariş formu doldurulduğunda veriler bir yere gitmez (backend yok).
*   Siparişleri almak için bu aşamada müşterinin WhatsApp'a yönlenmesini veya formun size mail atmasını sağlayan (EmailJS gibi) servisleri kullanabiliriz.

Başarılar! 🎬
