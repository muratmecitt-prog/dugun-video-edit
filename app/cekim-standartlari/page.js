import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export default function StandardsPage() {
    return (
        <div className="container section">
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '20px' }}>Teknik Çekim Standartları</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
                    En iyi ve hızlı kurgu sonucu için önerilen çekim formatlarını aşağıda bulabilirsiniz.
                </p>
            </div>

            <div style={{ display: 'grid', gap: '40px', maxWidth: '900px', margin: '0 auto' }}>

                {/* Recommended */}
                <div style={{ padding: '32px', backgroundColor: 'rgba(202,138,4,0.1)', borderRadius: 'var(--radius)', border: '1px solid var(--primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                        <CheckCircle color="var(--primary)" size={32} />
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--primary)' }}>Önerilen Standart</h2>
                    </div>
                    <ul style={{ listStyle: 'none', fontSize: '1.2rem', color: 'var(--text-main)', display: 'grid', gap: '15px' }}>
                        <li><strong>Çözünürlük:</strong> 4K</li>
                        <li><strong>Kare Hızı (FPS):</strong> 50 fps veya 60 fps</li>
                        <li><strong>Renk Profili:</strong> LOG (S-Log, C-Log, V-Log vb.)</li>
                    </ul>
                </div>

                {/* Accepted */}
                <div style={{ padding: '32px', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                        <CheckCircle color="var(--text-secondary)" size={32} />
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>Kabul Edilen Alternatif</h2>
                    </div>
                    <ul style={{ listStyle: 'none', fontSize: '1.2rem', color: 'var(--text-secondary)', display: 'grid', gap: '15px' }}>
                        <li><strong>Çözünürlük:</strong> 1080p (Full HD)</li>
                        <li><strong>Kare Hızı (FPS):</strong> 50 fps</li>
                        <li><strong>Renk Profili:</strong> Rec709 (Standart Renk)</li>
                    </ul>
                </div>

                {/* Warning */}
                <div style={{ padding: '24px', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius)', border: '1px solid #ef4444' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                        <AlertTriangle color="#ef4444" size={24} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ef4444' }}>Önemli Not</h3>
                    </div>
                    <p style={{ color: '#fca5a5', lineHeight: '1.6' }}>
                        Düşük kare hızı (24/25 fps) ile çekilen görüntülerde slow-motion işlemi yapılamaz.
                        Ayrıca aşırı titreyen (stabilize edilmemiş) veya teknik sorunlu (batarya bitimi, kart hatası vb.) görüntüler kurgu sürecini olumsuz etkileyebilir.
                        Bu durumlarda sorumluluk kabul edilmemektedir.
                    </p>
                </div>

            </div>
        </div>
    );
}
