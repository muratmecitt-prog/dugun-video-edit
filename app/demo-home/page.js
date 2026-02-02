"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, Tag, Film, CheckCircle, Play, X, Check } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';
import PackagesSection from '@/components/PackagesSection';

export default function Home() {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // Configuration for the 3D Scenes
  const SCENE_HEIGHT = 1500;
  const TRANSITION_DURATION = 800;

  const scenes = [
    {
      id: 'hero',
      type: 'intro',
      startScroll: 0,
      endScroll: SCENE_HEIGHT
    },
    {
      id: 'fcp',
      type: 'card',
      img: '/fcp-interface.png',
      title: 'İşinizi Büyütmeye Odaklanın',
      desc: "Siz çekin, biz kurgulayalım. Türkiye'nin profesyonelleri için\nhızlı, standart ve kaliteli video edit hizmeti.",
      btnText: 'Hemen Başlayın',
      startScroll: 0,
      endScroll: SCENE_HEIGHT * 2
    },
    {
      id: 'step1',
      type: 'card',
      img: '/step1_v2.png',
      title: '1. Videolarınızı Yükleyin',
      desc: 'Ham görüntülerinizi WeTransfer veya Google Drive ile kolayca bize gönderin.',
      startScroll: SCENE_HEIGHT * 1.5,
      endScroll: SCENE_HEIGHT * 3
    },
    {
      id: 'step2',
      type: 'card',
      img: '/step2.png',
      title: '2. Profesyonel Kurgu',
      desc: 'Uzman ekibimiz görüntülerinizi sinematik filme dönüştürsün.',
      startScroll: SCENE_HEIGHT * 2.5,
      endScroll: SCENE_HEIGHT * 4
    },
    {
      id: 'step3',
      type: 'card',
      img: '/step3.png',
      title: '3. Revize Edin',
      desc: 'Hazırlanan taslağı izleyin, panel üzerinden anlık geri bildirim verin.',
      startScroll: SCENE_HEIGHT * 3.5,
      endScroll: SCENE_HEIGHT * 5
    },
    {
      id: 'step4',
      type: 'card',
      img: '/step4_v2.png',
      title: '4. Teslim Alın',
      desc: 'Kusursuz hale gelen videonuzu 4K kalitesinde indirin ve çiftlerinize teslim edin.',
      // No CTA here, it will be in the Packages section
      startScroll: SCENE_HEIGHT * 4.5,
      endScroll: SCENE_HEIGHT * 6
    }
  ];

  // Calculate opacity for the Packages section (Fades in after the last scene)
  const packagesStart = SCENE_HEIGHT * 5.5;
  const packagesOpacity = typeof window !== 'undefined'
    ? Math.min(1, Math.max(0, (scrollY - packagesStart) / 800))
    : 0;

  return (
    <>
      {/* Hero Section */}
      <section style={{
        padding: '60px 0 40px',
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
        <section style={{ padding: '40px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', overflow: 'hidden' }}>
          <div className="container" style={{ marginBottom: '30px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Kurgularımız</h2>
          </div>

          <div className={portfolio.length > 3 ? "marquee-container" : "container"} style={portfolio.length <= 3 ? { display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '30px' } : {}}>
            <div className={portfolio.length > 3 ? "marquee-content" : ""} style={portfolio.length <= 3 ? { display: 'contents' } : {}}>
              {(portfolio.length > 3 ? [...portfolio, ...portfolio] : portfolio).map((item, idx) => (
                <div key={idx}
                  onClick={() => setSelectedVideo(item)}
                  style={{
                    minWidth: '350px',
                    maxWidth: portfolio.length <= 3 ? '400px' : '350px',
                    flex: portfolio.length <= 3 ? '1' : 'none',
                    height: '220px',
                    backgroundColor: 'var(--surface)',
                    borderRadius: '12px',
                    marginRight: portfolio.length > 3 ? '30px' : '0',
                    flexShrink: 0,
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid var(--border)',
                    group: 'hover'
                  }}
                  className="portfolio-card"
                >            <img
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

      {/* Unified 3D Scroll Reveal Stack with Packages Fade In */}
      <section style={{ height: `${SCENE_HEIGHT * (scenes.length + 1)}px`, position: 'relative', backgroundColor: '#000' }}>
        <div className="sticky-wrapper" style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          perspective: '1000px'
        }}>

          {/* 1. Header Boxes */}
          <div style={{
            position: 'absolute',
            top: '15%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 2,
            transform: `translateY(${Math.max(-200, -scrollY * 0.5)}px) scale(${Math.max(0.8, 1 - scrollY * 0.0005)})`,
            opacity: Math.max(0, 1 - (scrollY / 1000)),
            transition: 'transform 0.1s linear, opacity 0.1s linear',
            pointerEvents: scrollY > 600 ? 'none' : 'auto'
          }}>
            {/* Title Removed as requested */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', maxWidth: '1200px', width: '90%' }}>
              <div style={{ padding: '30px', textAlign: 'left', background: '#0a0a0a', borderRadius: '12px', border: '1px solid #222' }}>
                <Clock size={32} color="#facc15" style={{ marginBottom: '20px' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '10px', color: 'white' }}>Hızlı Teslim</h3>
                <p style={{ fontSize: '0.9rem', color: '#a1a1aa', lineHeight: '1.5' }}>7-21 gün arasında net teslim süreleri. Gecikme yok.</p>
              </div>
              <div style={{ padding: '30px', textAlign: 'left', background: '#0a0a0a', borderRadius: '12px', border: '1px solid #222' }}>
                <Tag size={32} color="#facc15" style={{ marginBottom: '20px' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '10px', color: 'white' }}>Sabit Fiyat</h3>
                <p style={{ fontSize: '0.9rem', color: '#a1a1aa', lineHeight: '1.5' }}>Sürpriz maliyetler olmadan, önceden belirlenmiş net fiyatlar.</p>
              </div>
              <div style={{ padding: '30px', textAlign: 'left', background: '#0a0a0a', borderRadius: '12px', border: '1px solid #222' }}>
                <Film size={32} color="#facc15" style={{ marginBottom: '20px' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '10px', color: 'white' }}>Profesyonel Akış</h3>
                <p style={{ fontSize: '0.9rem', color: '#a1a1aa', lineHeight: '1.5' }}>WeTransfer ile yükleyin, panelden adım adım takip edin.</p>
              </div>
              <div style={{ padding: '30px', textAlign: 'left', background: '#0a0a0a', borderRadius: '12px', border: '1px solid #222' }}>
                <CheckCircle size={32} color="#facc15" style={{ marginBottom: '20px' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '10px', color: 'white' }}>Teknik Standart</h3>
                <p style={{ fontSize: '0.9rem', color: '#a1a1aa', lineHeight: '1.5' }}>4K/LOG ve 1080p/Rec709 desteği ile yüksek kalite.</p>
              </div>
            </div>
          </div>

          {/* 3D Stacked Cards */}
          {scenes.filter(s => s.type === 'card').map((scene, index) => (
            <ThreeDCard
              key={scene.id}
              img={scene.img}
              title={scene.title}
              desc={scene.desc}
              btnText={scene.btnText}
              scrollY={scrollY}
              startScroll={scene.startScroll}
              endScroll={scene.endScroll}
              index={index}
            />
          ))}

          {/* Final Packages Section - Fades In from Black */}
          <div style={{
            position: 'absolute',
            top: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 20,
            opacity: packagesOpacity,
            pointerEvents: packagesOpacity > 0.5 ? 'auto' : 'none',
            background: 'rgba(0,0,0,0.8)', // Ensures bg is dark when it fades in
          }}>
            <div style={{
              transform: `translateY(${50 - packagesOpacity * 50}px)`,
              transition: 'transform 0.1s linear',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <div style={{ width: '90%', maxWidth: '1200px' }}>
                <PackagesSection showTitle={true} transparentCards={true} />
              </div>
            </div>
          </div>

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
            background-color: rgba(255,255,255,0.1) !important;
        }
      `}</style>
    </>
  );
}

function ThreeDCard({ img, title, desc, btnText, scrollY, startScroll, endScroll, index }) {
  const TRANSITION_DURATION = 700;

  const enterStart = startScroll;
  const enterEnd = startScroll + TRANSITION_DURATION;

  const exitStart = endScroll - TRANSITION_DURATION;
  const exitEnd = endScroll;

  let opacity = 0;
  let transform = '';
  let overlayOpacity = 0;

  if (scrollY < enterStart) {
    opacity = 0;
    transform = 'translateY(600px) rotateX(40deg) scale(0.6)';
  } else if (scrollY >= enterStart && scrollY < enterEnd) {
    const p = (scrollY - enterStart) / (enterEnd - enterStart);
    const easeOut = 1 - Math.pow(1 - p, 3);

    opacity = Math.min(1, 0.2 + easeOut * 0.8);
    const translateY = 600 - (easeOut * 600);
    const rotateX = 40 - (easeOut * 40);
    const scale = 0.6 + (easeOut * 0.5);
    transform = `translateY(${translateY}px) rotateX(${rotateX}deg) scale(${scale})`;

    overlayOpacity = Math.max(0, (p - 0.6) / 0.4);
  } else if (scrollY >= enterEnd && scrollY < exitStart) {
    opacity = 1;
    transform = 'translateY(0px) rotateX(0deg) scale(1.1)';
    overlayOpacity = 1;
  } else if (scrollY >= exitStart && scrollY < exitEnd) {
    const p = (scrollY - exitStart) / (exitEnd - exitStart);
    opacity = 1 - p;
    const translateY = 0 - (p * 300);
    const scale = 1.1 - (p * 0.3);
    transform = `translateY(${translateY}px) scale(${scale})`;
    overlayOpacity = 1 - p * 1.5;
  } else {
    opacity = 0;
    transform = 'translateY(-300px) scale(0.8)';
  }

  return (
    <div style={{
      position: 'absolute',
      top: '12%',
      width: '80%',
      maxWidth: '1300px',
      aspectRatio: '16/10',
      perspective: '1000px',
      zIndex: 10 + index,
      pointerEvents: overlayOpacity > 0.5 ? 'auto' : 'none',

      opacity: opacity,
      transform: transform,
      transition: 'transform 0.1s linear, opacity 0.1s linear',
      transformStyle: 'preserve-3d'
    }}>
      <div style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 50px 100px -20px rgba(0, 0, 0, 0.8)',
        border: '1px solid #333',
        backgroundColor: '#0f0f0f',
      }}>
        <div style={{ padding: '12px 20px', background: '#1c1c1c', borderBottom: '1px solid #333', display: 'flex', gap: '8px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#eab308' }}></div>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e' }}></div>
        </div>

        <img
          src={img}
          alt={title}
          style={{ width: '100%', height: 'calc(100% - 40px)', objectFit: 'cover' }}
        />

        <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 100px rgba(0,0,0,0.5)', pointerEvents: 'none' }}></div>

        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(5px)',
          opacity: overlayOpacity,
          transition: 'opacity 0.1s linear',
          textAlign: 'center',
          padding: '0 40px'
        }}>
          <h2 style={{
            fontSize: '3.5rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '20px',
            textShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            {title}
          </h2>
          <p style={{
            fontSize: '1.5rem',
            color: '#e5e5e5',
            maxWidth: '800px',
            lineHeight: '1.6',
            marginBottom: '30px',
            whiteSpace: 'pre-wrap'
          }}>
            {desc}
          </p>

          {btnText && (
            <div>
              <Link href="/paketler" className="btn btn-primary" style={{ padding: '16px 40px', fontSize: '1.2rem' }}>
                {btnText}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
