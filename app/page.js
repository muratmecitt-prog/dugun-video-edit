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

  // Site Settings & Configuration
  const [siteSettings, setSiteSettings] = useState(null);

  // Default values (fallback)
  // Default values (fallback)
  const defaultScenes = [
    { id: 'hero', type: 'intro' },
    {
      id: 'fcp',
      type: 'card',
      title: 'İşinizi Büyütmeye Odaklanın',
      desc: "Siz çekin, biz kurgulayalım. Türkiye'nin profesyonelleri için\nhızlı, standart ve kaliteli video edit hizmeti.",
      btnText: 'Hemen Başlayın',
      img: '/fcp-interface.png'
    },
    {
      id: 'step1',
      type: 'card',
      title: '1. Videolarınızı Yükle',
      desc: 'Ham görüntülerinizi WeTransfer veya Google Drive ile kolayca bize gönderin.',
      img: '/step1_v2.png'
    },
    {
      id: 'step2',
      type: 'card',
      title: '2. Profesyonel Kurgu',
      desc: 'Uzman ekibimiz görüntülerinizi sinematik filme dönüştürsün.',
      img: '/step2.png'
    },
    {
      id: 'step3',
      type: 'card',
      title: '3. Revize Edin',
      desc: 'Hazırlanan taslağı izleyin, panel üzerinden anlık geri bildirim verin.',
      img: '/step3.png'
    },
    {
      id: 'step4',
      type: 'card',
      title: '4. Teslim Alın',
      desc: 'Kusursuz hale gelen videonuzu 4K kalitesinde indirin ve çiftlerinize teslim edin.',
      img: '/step4_v2.png'
    }
  ];

  // Fetch Settings on Mount
  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('site_settings').select('*').eq('key', 'home_config').single();
      if (data && data.value) {
        setSiteSettings(data.value);
      }
    };
    fetchSettings();
  }, []);

  // Use Dynamic or Default Values
  const SCENE_HEIGHT = siteSettings?.scrollSensitivity || 1500;
  // TRANSITION_DURATION is passed to child, defined there or prop-drilled? 
  // Better to pass it as prop or context. For now we will handle it in the scenes mapping.

  // Construct Scenes Array dynamically
  // If settings exist, use them to build scenes. Otherwise use default.
  let scenesPayload = [];

  // Fallback/Default FCP Card (The "Intro" Card)
  const defaultFCP = {
    id: 'fcp',
    type: 'card',
    title: 'İşinizi Büyütmeye Odaklanın',
    desc: "Siz çekin, biz kurgulayalım. Türkiye'nin profesyonelleri için\nhızlı, standart ve kaliteli video edit hizmeti.",
    btnText: 'Hemen Başlayın',
    img: '/fcp-interface.png'
  };

  // Ensure settings & scenes exist
  const activeScenesList = siteSettings?.scenes || [];

  // Extract FCP card (or use default)
  const fcpCard = activeScenesList.find(s => s.id === 'fcp') || defaultFCP;

  // Extract Steps (everything else)
  const stepScenes = activeScenesList.filter(s => s.id !== 'fcp');

  // Construct final payload with explicit FCP positioning
  scenesPayload = [
    { id: 'hero', type: 'intro', startScroll: 0, endScroll: SCENE_HEIGHT },

    // 1. FCP Card (Explicitly First)
    {
      ...fcpCard,
      type: 'card',
      startScroll: 0, // Starts immediately
      endScroll: SCENE_HEIGHT * 2
    },

    // 2. Step Cards
    ...stepScenes.map((s, i) => ({
      ...s,
      type: 'card',
      startScroll: SCENE_HEIGHT * (1.5 + i), // Starts at 1.5H (overlapping FCP by 0.5H)
      endScroll: SCENE_HEIGHT * (3 + i)
    }))
  ];
  if (!siteSettings?.scenes?.length) { // This condition means no dynamic scenes were loaded from DB
    // Fallback to hardcoded
    scenesPayload = [
      { id: 'hero', type: 'intro', startScroll: 0, endScroll: SCENE_HEIGHT },
      {
        ...defaultScenes[1],
        startScroll: 0,
        endScroll: SCENE_HEIGHT * 2
        // Original FCP logic was weird (Start 0, End 2*H). 
        // It overlapped with Hero? No, ThreeDCard logic handles visibility.
        // Let's keep original logic for fallback if possible, OR
        // standardise it. 
        // Standard approach: 
        // Scene 0 (Hero): 0 -> H
        // Scene 1 (Card 1): H -> 2H (e.g.)
      },
      ...defaultScenes.slice(2).map((s, i) => ({
        ...s,
        startScroll: SCENE_HEIGHT * (1.5 + i), // Original offset logic
        endScroll: SCENE_HEIGHT * (3 + i)
      }))
    ];
    // actually, to avoid breaking the delicate FCP card sync, let's just use the original hardcoded array for fallback exactly as it was.
    scenesPayload = [
      { id: 'hero', type: 'intro', startScroll: 0, endScroll: SCENE_HEIGHT },
      { ...defaultScenes[1], startScroll: 0, endScroll: SCENE_HEIGHT * 2 },
      { ...defaultScenes[2], startScroll: SCENE_HEIGHT * 1.5, endScroll: SCENE_HEIGHT * 3 },
      { ...defaultScenes[3], startScroll: SCENE_HEIGHT * 2.5, endScroll: SCENE_HEIGHT * 4 },
      { ...defaultScenes[4], startScroll: SCENE_HEIGHT * 3.5, endScroll: SCENE_HEIGHT * 5 },
      { ...defaultScenes[5], startScroll: SCENE_HEIGHT * 4.5, endScroll: SCENE_HEIGHT * 6 },
    ];
  }

  // Simplify: If DB settings exist, use uniform stacking. 
  // If not, use the "legacy" hardcoded stack which had custom offsets (1.5, etc).
  // The DB version will be cleaner: Card N is at N*H to (N+1)*H.
  // Duplicate block removed to respect the explicit FCP logic above.

  const scenes = scenesPayload;

  // Calculate opacity for the Packages section (Fades in after the last scene)
  // Dynamic calculation based on total scenes
  const lastSceneEnd = scenes[scenes.length - 1].endScroll;
  const packagesStart = lastSceneEnd - 500; // Fade in slightly before end
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
                >
                  <VideoThumbnail videoUrl={item.video_url} alt={item.title} />

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

      {/* Unified 3D Scroll Reveal Stack (Desktop Only) */}
      <section className="desktop-3d-container" style={{ height: `${SCENE_HEIGHT * (scenes.length + 1)}px`, position: 'relative', backgroundColor: '#000' }}>
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
              config={siteSettings} // Pass full config
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

      {/* Mobile Scroll Section (Visible only on < 768px) */}
      <section className="mobile-scroll-container">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: 'white' }}>Nasıl Çalışır?</h2>
          <p style={{ color: '#aaa' }}>Profesyonel iş akışımız ile tanışın.</p>
        </div>

        {/* Mobile Info Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '60px' }}>
          <div style={{ padding: '20px', background: '#111', borderRadius: '12px', border: '1px solid #222', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Clock size={24} color="#facc15" />
            <div><strong style={{ color: 'white' }}>Hızlı Teslim</strong><br /><span style={{ fontSize: '0.85rem', color: '#888' }}>7-21 gün garanti</span></div>
          </div>
          <div style={{ padding: '20px', background: '#111', borderRadius: '12px', border: '1px solid #222', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Tag size={24} color="#facc15" />
            <div><strong style={{ color: 'white' }}>Sabit Fiyat</strong><br /><span style={{ fontSize: '0.85rem', color: '#888' }}>Sürpriz yok</span></div>
          </div>
        </div>

        {scenes.map(scene => (
          <MobileScene key={scene.id} scene={scene} />
        ))}

        <div style={{ marginTop: '60px' }}>
          <PackagesSection showTitle={true} />
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
        
        /* Mobile/Desktop Visibility Toggles */
        .desktop-3d-container {
            display: block;
        }
        .mobile-scroll-container {
            display: none;
        }

        @media (max-width: 768px) {
            .desktop-3d-container {
                display: none !important;
            }
            .mobile-scroll-container {
                display: block !important;
                background-color: #000;
                padding: 40px 20px;
            }
        }
      `}</style>
    </>
  );
}

// Mobile Version of the Scene Card (Static, Vertical)
function MobileScene({ scene }) {
  if (scene.type === 'intro') return null; // Skip empty hero spacer

  return (
    <div style={{
      marginBottom: '60px',
      backgroundColor: '#0f0f0f',
      borderRadius: '20px',
      overflow: 'hidden',
      border: '1px solid #333',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
    }}>
      <img
        src={scene.img}
        alt={scene.title}
        style={{ width: '100%', height: '250px', objectFit: 'cover' }}
      />
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'white', marginBottom: '12px' }}>
          {scene.title}
        </h3>
        <p style={{ fontSize: '1rem', color: '#ccc', lineHeight: '1.5', marginBottom: '20px', whiteSpace: 'pre-wrap' }}>
          {scene.desc}
        </p>
        {scene.btnText && (
          <Link href="/paketler" className="btn btn-primary" style={{ width: '100%', display: 'block', padding: '12px' }}>
            {scene.btnText}
          </Link>
        )}
      </div>
    </div>
  );
}

function ThreeDCard({ img, title, desc, btnText, scrollY, startScroll, endScroll, index, config }) {
  const TRANSITION_DURATION = config?.transitionDuration || 700;
  const ZOOM_LEVEL = config?.zoomLevel || 1.1;
  const OVERLAY_OPACITY_MAX = config?.overlayOpacity || 0.7;
  const BLUR_AMOUNT = config?.blurAmount || 5;

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
    const scale = 0.6 + (easeOut * (ZOOM_LEVEL - 0.6)); // Dynamic Max Zoom
    transform = `translateY(${translateY}px) rotateX(${rotateX}deg) scale(${scale})`;

    overlayOpacity = Math.max(0, (p - 0.6) / 0.4); // 0 to 1 fade
  } else if (scrollY >= enterEnd && scrollY < exitStart) {
    opacity = 1;
    transform = `translateY(0px) rotateX(0deg) scale(${ZOOM_LEVEL})`;
    overlayOpacity = 1; // Fully visible container
  } else if (scrollY >= exitStart && scrollY < exitEnd) {
    const p = (scrollY - exitStart) / (exitEnd - exitStart);
    opacity = 1 - p;
    const translateY = 0 - (p * 300);
    const scale = ZOOM_LEVEL - (p * 0.3);
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
          background: `rgba(0,0,0,${OVERLAY_OPACITY_MAX})`, // Dynamic Background Darkness
          backdropFilter: `blur(${BLUR_AMOUNT}px)`,
          opacity: overlayOpacity, // Fade In/Out the whole container (0 to 1)
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

function VideoThumbnail({ videoUrl, alt }) {
  const [thumbnail, setThumbnail] = useState(null);

  useEffect(() => {
    if (!videoUrl) return;

    // YouTube
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      const videoId = videoUrl.includes('v=')
        ? videoUrl.split('v=')[1].split('&')[0]
        : videoUrl.split('/').pop();
      setThumbnail(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
    }
    // Vimeo
    else if (videoUrl.includes('vimeo.com')) {
      const videoId = videoUrl.match(/vimeo\.com\/(\d+)/)?.[1];
      if (videoId) {
        fetch(`https://vimeo.com/api/v2/video/${videoId}.json`)
          .then(res => res.json())
          .then(data => {
            if (data && data[0]) {
              setThumbnail(data[0].thumbnail_large);
            }
          })
          .catch(err => console.error("Vimeo thumb error:", err));
      }
    }
  }, [videoUrl]);

  return (
    <img
      src={thumbnail || '/placeholder-video.jpg'}
      alt={alt}
      style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7, transition: 'opacity 0.3s' }}
      onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x300?text=Video'; }}
    />
  );
}
