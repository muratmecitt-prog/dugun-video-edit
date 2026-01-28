import Link from 'next/link';
import { Clock, Tag, Film, CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section style={{
        padding: '120px 0',
        textAlign: 'center',
        background: 'linear-gradient(180deg, rgba(202,138,4,0.1) 0%, rgba(10,10,10,0) 100%)'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '24px', lineHeight: '1.2', letterSpacing: '-0.02em' }}>
            Düğün Hikayelerini <br />
            <span style={{ color: 'var(--primary)', textShadow: '0px 0px 40px rgba(202,138,4,0.3)' }}>Profesyonelce Kurguluyoruz</span>
          </h1>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1.25rem',
            maxWidth: '640px',
            margin: '0 auto 48px auto',
            lineHeight: '1.6'
          }}>
            Kurgu yükünü üzerinizden alın. Siz yeni çiftlerle görüşürken, videolarınız emin ellerde hazırlansın.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <Link href="/paketler" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
              Paketleri İncele
            </Link>
            <Link href="/giris" className="btn btn-outline" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
              Sipariş Oluştur
            </Link>
          </div>
        </div>
      </section>

      {/* Value Props Section */}
      <section className="section" style={{ backgroundColor: 'var(--surface)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>

            <FeatureCard
              icon={<Clock size={32} color="var(--primary)" />}
              title="Hızlı Teslim"
              description="7-21 gün arasında net teslim süreleri. Gecikme yok, bahane yok."
            />
            <FeatureCard
              icon={<Tag size={32} color="var(--primary)" />}
              title="Sabit Fiyat"
              description="Sürpriz maliyetler olmadan, önceden belirlenmiş net paket fiyatları."
            />
            <FeatureCard
              icon={<Film size={32} color="var(--primary)" />}
              title="Profesyonel Akış"
              description="WeTransfer ile yükleyin, panelden adım adım takip edin."
            />
            <FeatureCard
              icon={<CheckCircle size={32} color="var(--primary)" />}
              title="Teknik Standart"
              description="4K/LOG ve 1080p/Rec709 desteği ile en yüksek görüntü kalitesi."
            />

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '24px' }}>İşinizi Büyütmeye Odaklanın</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
            Siz çekin, biz kurgulayalım. Türkiye'nin profesyonelleri için hızlı, standart ve kaliteli video edit hizmeti.
          </p>
          <Link href="/paketler" className="btn btn-outline">
            Hemen Başlayın
          </Link>
        </div>
      </section>
    </>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div style={{ padding: '24px', backgroundColor: 'var(--background)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
      <div style={{ marginBottom: '20px' }}>{icon}</div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '12px' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>{description}</p>
    </div>
  );
}
