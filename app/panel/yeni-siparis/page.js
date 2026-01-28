"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import BankDetails from '@/components/BankDetails';

export default function NewOrderPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            alert('Sipariş başarıyla oluşturuldu! (Demo)');
            router.push('/panel');
        }, 1500);
    };

    return (
        <div className="container section">
            <Link href="/panel" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                <ArrowLeft size={20} />
                Panele Dön
            </Link>

            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '40px' }}>Yeni Sipariş Oluştur</h1>

            <div style={{ gap: '40px', display: 'grid', gridTemplateColumns: 'minmax(0, 700px) minmax(0, 1fr)', alignItems: 'start' }}>

                {/* Form Column */}
                <div style={{ backgroundColor: 'var(--surface)', padding: '40px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                        {/* Studio Name Field Added */}
                        <div>
                            <label className="form-label">Stüdyo / Firma İsmi</label>
                            <input required type="text" placeholder="Örn: Vega Medya" className="form-input" />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div>
                                <label className="form-label">Gelin & Damat İsimleri</label>
                                <input required type="text" placeholder="Örn: Elif & Mert" className="form-input" />
                            </div>
                            <div>
                                <label className="form-label">Çekim Tarihi</label>
                                <input required type="date" className="form-input" />
                            </div>
                        </div>

                        <div>
                            <label className="form-label">Paket Seçimi</label>
                            <select className="form-input" style={{ appearance: 'none' }}>
                                <option>PAKET 1 — Teaser (2.000 TL)</option>
                                <option>PAKET 2 — Düğün Klibi (4.000 TL)</option>
                                <option>PAKET 3 — Teaser + Düğün Klibi (5.000 TL)</option>
                                <option>PAKET 4 — Düğün Belgeseli (7.000 TL)</option>
                            </select>
                        </div>

                        <div>
                            <label className="form-label">WeTransfer Linki</label>
                            <input required type="url" placeholder="https://we.tl/..." className="form-input" />
                            {/* Detailed Helper Text Added */}
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '12px', lineHeight: '1.5', padding: '12px', backgroundColor: 'var(--background)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                                <strong>⚠️ Klasör İsimlendirme Önemlidir:</strong><br />
                                Lütfen dosyalarınızı <strong style={{ color: 'var(--primary)' }}>StüdyoIsmi_GelinDamat_Tarih</strong> (Örn: <em>VegaMedya_AyseAhmet_01092023</em>) şeklinde isimlendirdiğiniz <strong>tek bir klasörde</strong> toplayıp, zipleyerek yükleyiniz.
                            </div>
                        </div>

                        <div>
                            <label className="form-label">Ek Notlar (Opsiyonel)</label>
                            <textarea rows="4" placeholder="Varsa video ile ilgili kısa notlarınız..." className="form-input" />
                        </div>

                        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', marginTop: '10px' }}>
                            <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ width: '100%' }}>
                                {isSubmitting ? 'Sipariş Oluşturuluyor...' : 'Siparişi Tamamla'}
                            </button>
                        </div>

                    </form>
                </div>

                {/* Info Column */}
                <div>
                    <BankDetails />
                    <div style={{ marginTop: '20px', padding: '24px', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                        <h3 style={{ fontWeight: 'bold', marginBottom: '15px' }}>Nasıl İlerler?</h3>
                        <ol style={{ paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '20px' }}>
                            <li style={{ marginBottom: '8px' }}>Sipariş formunu doldurun ve gönderin.</li>
                            <li style={{ marginBottom: '8px' }}>Size verilen <strong>Sipariş Numarasını</strong> açıklama kısmına yazarak ödemenizi yapın.</li>
                            <li style={{ marginBottom: '8px' }}>Ödemeniz onaylandığında editörlerimiz dosyalarınızı indirip kurguya başlar.</li>
                            <li>Teslim tarihinde videonuzu panelden indirin.</li>
                        </ol>

                        <div style={{ padding: '12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid #ef4444', borderRadius: '4px' }}>
                            <p style={{ color: '#fca5a5', fontSize: '0.9rem', fontWeight: '500' }}>
                                ⚠️ ÖNEMLİ: Ödeme onayı alınmadan kurgu süreci kesinlikle başlatılmamaktadır.
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            <style jsx>{`
        .form-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: var(--text-main);
        }
        .form-input {
          width: 100%;
          padding: 12px;
          background-color: var(--background);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          color: var(--text-main);
          font-family: inherit;
          font-size: 1rem;
        }
        .form-input:focus {
          outline: 2px solid var(--primary);
          border-color: transparent;
        }
      `}</style>
        </div>
    );
}
