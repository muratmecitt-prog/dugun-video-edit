"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, Tag, Film, CheckCircle, Play, X } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      const { data } = await supabase.from('portfolio').select('*').order('created_at', { ascending: false });
      if (data) setPortfolio(data);
    };
    fetchPortfolio();
  }, []);

  const getEmbedUrl = (url) => {
    if (!url) return '';
    let videoId = '';
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      videoId = match ? match[1] : '';
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    } else if (url.includes('vimeo.com')) {
      const match = url.match(/vimeo\.com\/(\d+)/);
      videoId = match ? match[1] : '';
      return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
    }
    return url;
  };

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
            <Link href={user ? "/panel" : "/giris"} className="btn btn-outline" style={{ padding: '18px 36px', fontSize: '1.1rem' }}>
              Sipariş Oluştur
            </Link>
          </div>
        </div>
      </section>

      {/* Portfolio Marquee Section */}
      {portfolio.length > 0 && (
        <section style={{ padding: '60px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', overflow: 'hidden' }}>
          <div className="container" style={{ marginBottom: '40px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Kurgularımız</h2>
          </div>

          <div className="marquee-container">
            <div className="marquee-content">
              {/* Double the list for seamless looping */}
              {[...portfolio, ...portfolio].map((item, idx) => (
                <div key={idx}
                  onClick={() => setSelectedVideo(item)}
                  style={{
                    minWidth: '350px',
                    height: '220px',
                    backgroundColor: 'var(--surface)',
                    borderRadius: '12px',
                    marginRight: '30px',
                    flexShrink: 0,
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid var(--border)',
                    group: 'hover'
                  }}
                  className="portfolio-card"
                >
                  <img
                    src={`https://img.youtube.com/vi/${item.video_url.includes('v=') ? item.video_url.split('v=')[1].split('&')[0] : ''}/hqdefault.jpg`}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7, transition: 'opacity 0.3s' }}
                    onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                  />
                  <div className="play-overlay" style={{
                    position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                    justifyContent: 'center', alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.4)', transition: 'background 0.3s'
                  }}>
                    <div style={{
                      width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'var(--primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black',
                      marginBottom: '10px'
                    }}>
                      <Play fill="black" size={24} style={{ marginLeft: '4px' }} />
                    </div>
                    <h3 style={{ color: 'white', fontWeight: 'bold', padding: '0 20px', textAlign: 'center', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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

      {/* Video Modal */}
      {selectedVideo && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }} onClick={() => setSelectedVideo(null)}>
          <div style={{ width: '100%', maxWidth: '900px', aspectRatio: '16/9', position: 'relative', backgroundColor: 'black', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            <button onClick={() => setSelectedVideo(null)} style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 10, background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', padding: '5px', borderRadius: '50%', cursor: 'pointer' }}>
              <X size={24} />
            </button>
            <iframe
              src={getEmbedUrl(selectedVideo.video_url)}
              style={{ width: '100%', height: '100%', border: 'none' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      <style jsx>{`
        .marquee-container {
            width: 100%;
            overflow: hidden;
            display: flex;
        }
        .marquee-content {
            display: flex;
            animation: scroll 40s linear infinite;
        }
        .portfolio-card:hover .play-overlay {
            background-color: rgba(0,0,0,0.2);
        }
        .portfolio-card:hover img {
            opacity: 1;
            transform: scale(1.05);
        }
        @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        .glass-card:hover {
            transform: translateY(-5px);
            background-color: var(--surface-hover);
        }
      `}</style>
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
