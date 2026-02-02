import Link from 'next/link';

export default function HowItWorksPage() {
    return (
        <div className="container section">
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '20px' }}>Nasıl Çalışır?</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
                    Süreçlerimiz size zaman kazandırmak ve en yüksek kaliteyi sunmak için optimize edilmiştir.
                </p>
            </div>

            <div style={{ display: 'grid', gap: '40px', maxWidth: '800px', margin: '0 auto' }}>

                <Step
                    number="1"
                    title="Paket Seçimi"
                    description="İhtiyacınıza uygun kurgu paketini (Teaser, Klip veya Belgesel) belirleyin."
                    image="/step-1-packages.png"
                />

                <Step
                    number="2"
                    title="Dosya Yükleme"
                    description="Ham görüntülerinizi (tercihen WeTransfer veya benzeri bir bulut servisine) yükleyin ve linki hazır edin."
                    image="/step-2-upload.png"
                />

                <Step
                    number="3"
                    title="Sipariş Oluşturma"
                    description="Panel üzerinden sipariş formunu doldurun, linki paylaşın ve süreci başlatın."
                    image="/step-3-form.png"
                />

                <Step
                    number="4"
                    title="Arkanıza Yaslanın"
                    description="Editörlerimiz işe başlasın. Belirtilen sürede kurgunuzu panel üzerinden teslim alın."
                    image="/step-4-timeline.png"
                />

            </div>

            <div style={{ textAlign: 'center', marginTop: '60px' }}>
                <Link href="/giris" className="btn btn-primary" style={{ padding: '16px 40px' }}>
                    Hemen Başlayın
                </Link>
            </div>
        </div>
    );
}

function Step({ number, title, description, image }) {
    return (
        <div style={{
            display: 'flex',
            gap: '24px',
            alignItems: 'center',
            padding: '40px',
            backgroundColor: 'var(--surface)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '180px'
        }}>
            {/* Background Image Overlay */}
            {image && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url(${image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.1,
                    zIndex: 0,
                    filter: 'grayscale(100%)'
                }} />
            )}

            <div style={{
                flexShrink: 0,
                width: '60px',
                height: '60px',
                backgroundColor: 'var(--primary)',
                color: 'black',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                position: 'relative',
                zIndex: 1
            }}>
                {number}
            </div>
            <div style={{ position: 'relative', zIndex: 1 }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px' }}>{title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6' }}>{description}</p>
            </div>
        </div>
    );
}
