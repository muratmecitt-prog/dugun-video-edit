"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import BankDetails from '@/components/BankDetails';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';

export default function NewOrderPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [orderId, setOrderId] = useState(null);

    // Form states
    const [formData, setFormData] = useState({
        studio_name: '',
        couple_name: '',
        shoot_date: '',
        package: 'PAKET 1 — Teaser (2.000 TL)',
        wt_link: '',
        notes: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError('Lütfen önce giriş yapın.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const { data, error: insertError } = await supabase
                .from('orders')
                .insert([
                    {
                        user_id: user.id,
                        studio_name: formData.studio_name,
                        couple_name: formData.couple_name,
                        shoot_date: formData.shoot_date,
                        package: formData.package,
                        wt_link: formData.wt_link,
                        notes: formData.notes,
                        status: 'Beklemede'
                    }
                ])
                .select();

            if (insertError) throw insertError;

            setOrderId(data[0].id);
            setSuccess(true);

            // Redirect after a few seconds
            setTimeout(() => {
                router.push('/panel');
            }, 5000);

        } catch (err) {
            setError('Sipariş oluşturulamadı: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="container section" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div style={{ textAlign: 'center', backgroundColor: 'var(--surface)', padding: '60px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', maxWidth: '500px' }}>
                    <CheckCircle2 size={64} color="#4ade80" style={{ marginBottom: '20px' }} />
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '10px' }}>Sipariş Alındı!</h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
                        Siparişiniz başarıyla oluşturuldu. Sipariş numaranız: <strong style={{ color: 'var(--primary)' }}>{orderId}</strong>
                    </p>
                    <div style={{ backgroundColor: 'var(--background)', padding: '20px', borderRadius: 'var(--radius)', marginBottom: '30px', border: '1px solid var(--border)' }}>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                            Ödemenizi yaparken açıklama kısmına <strong>{orderId}</strong> yazmayı unutmayın.
                        </p>
                    </div>
                    <Link href="/panel" className="btn btn-primary" style={{ width: '100%' }}>
                        Siparişlerime Dön
                    </Link>
                </div>
            </div>
        );
    }

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

                    {error && (
                        <div style={{ padding: '12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: 'var(--radius)', marginBottom: '20px', fontSize: '0.9rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                        <div>
                            <label className="form-label">Stüdyo / Firma İsmi</label>
                            <input
                                required
                                name="studio_name"
                                value={formData.studio_name}
                                onChange={handleChange}
                                type="text"
                                placeholder="Örn: Vega Medya"
                                className="form-input"
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div>
                                <label className="form-label">Gelin & Damat İsimleri</label>
                                <input
                                    required
                                    name="couple_name"
                                    value={formData.couple_name}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="Örn: Elif & Mert"
                                    className="form-input"
                                />
                            </div>
                            <div>
                                <label className="form-label">Çekim Tarihi</label>
                                <input
                                    required
                                    name="shoot_date"
                                    value={formData.shoot_date}
                                    onChange={handleChange}
                                    type="date"
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="form-label">Paket Seçimi</label>
                            <select
                                name="package"
                                value={formData.package}
                                onChange={handleChange}
                                className="form-input"
                                style={{ appearance: 'none' }}
                            >
                                <option>PAKET 1 — Teaser (2.000 TL)</option>
                                <option>PAKET 2 — Düğün Klibi (4.000 TL)</option>
                                <option>PAKET 3 — Teaser + Düğün Klibi (5.000 TL)</option>
                                <option>PAKET 4 — Düğün Belgeseli (7.000 TL)</option>
                            </select>
                        </div>

                        <div>
                            <label className="form-label">WeTransfer Linki</label>
                            <input
                                required
                                name="wt_link"
                                value={formData.wt_link}
                                onChange={handleChange}
                                type="url"
                                placeholder="https://we.tl/..."
                                className="form-input"
                            />
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '12px', lineHeight: '1.5', padding: '12px', backgroundColor: 'var(--background)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                                <strong>⚠️ Klasör İsimlendirme Önemlidir:</strong><br />
                                Lütfen dosyalarınızı <strong style={{ color: 'var(--primary)' }}>StüdyoIsmi_GelinDamat_Tarih</strong> (Örn: <em>VegaMedya_AyseAhmet_01092023</em>) şeklinde isimlendirdiğiniz <strong>tek bir klasörde</strong> toplayıp, zipleyerek yükleyiniz.
                            </div>
                        </div>

                        <div>
                            <label className="form-label">Ek Notlar (Opsiyonel)</label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Varsa video ile ilgili kısa notlarınız..."
                                className="form-input"
                            />
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
