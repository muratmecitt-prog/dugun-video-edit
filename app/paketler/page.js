import PriceCard from '@/components/PriceCard';

export default function PackagesPage() {
    return (
        <div className="container section">
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '20px' }}>Paketler ve Fiyatlar</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
                    İhtiyacınıza uygun paketi seçin, profesyonel kurgunun keyfini çıkarın.
                </p>
            </div>

            <div style={{
                display: 'grid',
                // minmax changed from 280px to 250px to ensure 4 columns fit within 1200px container
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '20px'
            }}>

                <PriceCard
                    title="Teaser"
                    price="2.000"
                    duration="30–60 saniye"
                    features={[
                        "Temel Kurgu",
                        "Müzik ve Renk Düzenleme",
                        "Sosyal Medya İçin Uygun"
                    ]}
                    deliveryTime="7 iş günü"
                />

                <PriceCard
                    title="Düğün Klibi"
                    price="4.000"
                    duration="3–5 dakika"
                    features={[
                        "Hikaye Kurgusu",
                        "Sinematik Akış",
                        "Renk ve Ritim Düzenleme",
                        "Müzik Seçimi"
                    ]}
                    deliveryTime="14 iş günü"
                />

                <PriceCard
                    title="Teaser + Klip"
                    price="5.000"
                    duration="Teaser + 3-5 dk Klip"
                    features={[
                        "Sosyal Medya Teaserı",
                        "Tam Düğün Klibi",
                        "Hikaye Bütünlüğü",
                        "Avantajlı Fiyat"
                    ]}
                    deliveryTime="14 iş günü"
                    isPopular={true}
                />

                <PriceCard
                    title="Düğün Belgeseli"
                    price="7.000"
                    duration="5–10 dakika"
                    features={[
                        "Belgesel Formatında Anlatım",
                        "Teaser Dahil",
                        "Detaylı Kurgu",
                        "Geniş Kapsamlı Hikaye"
                    ]}
                    deliveryTime="21 iş günü"
                />

            </div>
        </div>
    );
}
