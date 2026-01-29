import Link from 'next/link';
import { Clock, Tag, Film, CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section style={{
        padding: '140px 0 120px',
        textAlign: 'center',
        background: 'linear-gradient(180deg, rgba(202,138,4,0.08) 0%, rgba(10,10,10,0) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Background Orbs */}
        <div className="bg-glow-orb" style={{ top: '-200px', left: '-100px' }}></div>
        <div className="bg-glow-orb" style={{ top: '100px', right: '-150px', animationDelay: '3s' }}></div>

        <div className="container">
          <h1 className="animate-fade-in-up" style={{
            fontSize: '3.8rem',
            fontWeight: '800',
            marginBottom: '24px',
            lineHeight: '1.1',
            letterSpacing: '-0.03em'
          }}>
            Düğün Hikayelerini <br />
            <span className="animate-fade-in-up animate-delay-1 text-gradient" style={{
              display: 'inline-block',
              textShadow: 'var(--glow-primary)'
            }}>
              Profesyonelce Kurguluyoruz
            </span>
          </h1>
          <p className="animate-fade-in-up animate-delay-2" style={{
            color: 'var(--text-secondary)',
            fontSize: '1.3rem',
            maxWidth: '680px',
            margin: '0 auto 48px auto',
            lineHeight: '1.7'
          }}>
            Kurgu yükünü üzerinizden alın. Siz yeni çiftlerle görüşürken, videolarınız emin ellerde hazırlansın.
          </p>
          <div className="animate-fade-in-up animate-delay-3" style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/paketler" className="btn btn-primary" style={{
              padding: '18px 36px',
              fontSize: '1.1rem',
              boxShadow: 'var(--glow-primary)'
            }}>
              Paketleri İncele
            </Link>
            <Link href="/giris" className="btn btn-outline" style={{ padding: '18px 36px', fontSize: '1.1rem' }}>
              Sipariş Oluştur
            </Link>
          </div>
        </div>
      </section>

      {/* Value Props Section */}
      <section className="section" style={{ backgroundColor: 'var(--background)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>

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

      {/* Portfolio Section */}
      <section className="section" style={{ backgroundColor: 'var(--surface)', position: 'relative' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.8rem', fontWeight: 'bold', marginBottom: '16px' }}>
              Profesyonel <span className="text-gradient">Kurgu Örnekleri</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
              Sinematik anlatım ve duygusal derinlikle hazırlanmış düğün hikayeleri
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px'
          }}>
            <PortfolioItem
              image="/portfolio-1.png"
              title="Golden Hour Romance"
              category="Düğün Klibi"
            />
            <PortfolioItem
              image="/portfolio-2.png"
              title="The Journey Begins"
              category="Teaser + Klip"
            />
            <PortfolioItem
              image="/portfolio-3.png"
              title="Sacred Vows"
              category="Düğün Belgeseli"
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
    <div className="glass-card" style={{
      padding: '32px 24px',
      borderRadius: 'var(--radius)',
      transition: 'all 0.3s ease',
      cursor: 'default'
    }}>
      <div style={{ marginBottom: '20px' }}>{icon}</div>
      <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '12px' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{description}</p>
    </div>
  );
}

function PortfolioItem({ image, title, category }) {
  return (
    <div style={{
      position: 'relative',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      cursor: 'pointer',
      height: '400px',
      boxShadow: 'var(--shadow-premium)'
    }}>
      <img
        src={image}
        alt={title}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.5s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      />
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '24px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)',
        color: 'white'
      }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '6px', fontWeight: '500' }}>
          {category}
        </div>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{title}</h3>
      </div>
    </div>
  );
}
