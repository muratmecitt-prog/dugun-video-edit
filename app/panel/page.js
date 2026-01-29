"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';
import { Plus, Search, Download, Loader2, Edit3, X, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import BankDetails from '@/components/BankDetails';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';

export default function UserDashboard() {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Hepsi');
    const [revisionOrder, setRevisionOrder] = useState(null);
    const [isRevising, setIsRevising] = useState(false);
    const [uploading, setUploading] = useState(false);

    const fetchOrders = async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (err) {
            console.error('Error fetching orders:', err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [user]);

    const handleRevisionSubmit = async (e) => {
        e.preventDefault();
        setIsRevising(true);
        const formData = new FormData(e.target);
        const text = formData.get('revision_text');
        const link = formData.get('revision_link');
        const file = formData.get('revision_image');

        try {
            let imageUrl = revisionOrder.revision_image;

            if (file && file.size > 0) {
                if (file.size > 2 * 1024 * 1024) {
                    alert('Görsel boyutu 2MB\'dan küçük olmalıdır.');
                    setIsRevising(false);
                    return;
                }
                setUploading(true);
                const fileExt = file.name.split('.').pop();
                const fileName = `${revisionOrder.id}_${Math.random()}.${fileExt}`;
                const { error: uploadError } = await supabase.storage
                    .from('revisions')
                    .upload(fileName, file);

                if (uploadError) throw uploadError;

                const { data: publicUrl } = supabase.storage
                    .from('revisions')
                    .getPublicUrl(fileName);

                imageUrl = publicUrl.publicUrl;
            }

            const { error: updateError } = await supabase
                .from('orders')
                .update({
                    revision_text: text,
                    revision_link: link,
                    revision_image: imageUrl,
                    updated_at: new Date().toISOString()
                })
                .eq('id', revisionOrder.id);

            if (updateError) throw updateError;

            alert('Revize talebiniz başarıyla iletildi.');
            setRevisionOrder(null);
            fetchOrders();
        } catch (err) {
            console.error('Revision error:', err.message);
            alert('Hata: ' + err.message);
        } finally {
            setIsRevising(false);
            setUploading(false);
        }
    };

    // Calculate counts for tabs
    const counts = {
        'Hepsi': orders.length,
        'Ödeme Bekleniyor': orders.filter(o => o.status === 'Ödeme Bekleniyor').length,
        'Kurguda': orders.filter(o => o.status === 'Kurguda').length,
        'Revize Ediliyor': orders.filter(o => o.status === 'Revize Ediliyor').length,
        'Tamamlandı': orders.filter(o => o.status === 'Tamamlandı').length,
    };

    const searchFiltered = orders.filter(order =>
        (order.couple_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.shoot_date || '').includes(searchTerm) ||
        (order.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.studio_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const finalOrders = activeTab === 'Hepsi'
        ? searchFiltered
        : searchFiltered.filter(o => o.status === activeTab);

    return (
        <div className="container section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Siparişlerim</h1>
                <Link href="/panel/yeni-siparis" className="btn btn-primary" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Plus size={20} />
                    Yeni Sipariş
                </Link>
            </div>

            {/* Search Bar */}
            <div style={{ marginBottom: '20px', position: 'relative', maxWidth: '400px' }}>
                <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input
                    type="text"
                    placeholder="Çift ismi, tarih veya sipariş no ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '12px 12px 12px 44px',
                        borderRadius: 'var(--radius)',
                        border: '1px solid var(--border)',
                        backgroundColor: 'var(--surface)',
                        color: 'var(--text-main)',
                        fontSize: '1rem'
                    }}
                />
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', overflowX: 'auto', paddingBottom: '5px' }}>
                {Object.keys(counts).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '30px',
                            border: '1px solid var(--border)',
                            backgroundColor: activeTab === tab ? 'var(--primary)' : 'var(--surface)',
                            color: activeTab === tab ? 'white' : 'var(--text-main)',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s',
                            boxShadow: activeTab === tab ? '0 4px 12px rgba(var(--primary-rgb), 0.3)' : 'none'
                        }}
                    >
                        {tab}
                        <span style={{
                            backgroundColor: activeTab === tab ? 'rgba(255,255,255,0.2)' : 'var(--background)',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            fontSize: '0.75rem'
                        }}>
                            {counts[tab]}
                        </span>
                    </button>
                ))}
            </div>

            <div style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                            <th style={{ padding: '16px' }}>Sipariş No</th>
                            <th style={{ padding: '16px' }}>Stüdyo / Çift</th>
                            <th style={{ padding: '16px' }}>Paket</th>
                            <th style={{ padding: '16px' }}>Çekim Tarihi</th>
                            <th style={{ padding: '16px' }}>Durum</th>
                            <th style={{ padding: '16px' }}>Teslimat</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="6" style={{ padding: '40px', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                                        <Loader2 className="animate-spin" size={20} />
                                        Yükleniyor...
                                    </div>
                                </td>
                            </tr>
                        ) : finalOrders.length > 0 ? (
                            finalOrders.map((order) => (
                                <tr key={order.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '16px', fontWeight: 'bold', color: 'var(--primary)' }}>{order.id}</td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ fontWeight: '500' }}>{order.studio_name}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{order.couple_name}</div>
                                    </td>
                                    <td style={{ padding: '16px', fontSize: '0.9rem' }}>{order.package}</td>
                                    <td style={{ padding: '16px', color: 'var(--text-main)' }}>{new Date(order.shoot_date).toLocaleDateString('tr-TR')}</td>
                                    <td style={{ padding: '16px' }}><StatusBadge status={order.status} /></td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            {order.status === 'Tamamlandı' && order.download_link ? (
                                                <a
                                                    href={order.download_link}
                                                    target="_blank"
                                                    className="btn btn-outline"
                                                    style={{
                                                        padding: '8px 16px',
                                                        fontSize: '0.9rem',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '8px',
                                                        borderColor: 'var(--primary)',
                                                        color: 'var(--primary)',
                                                        textDecoration: 'none'
                                                    }}
                                                >
                                                    <Download size={16} />
                                                    İndir
                                                </a>
                                            ) : order.status === 'Revize Ediliyor' ? (
                                                <button
                                                    onClick={() => setRevisionOrder(order)}
                                                    className="btn btn-outline"
                                                    style={{
                                                        padding: '8px 16px',
                                                        fontSize: '0.9rem',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '8px',
                                                        borderColor: '#a855f7',
                                                        color: '#a855f7'
                                                    }}
                                                >
                                                    <Edit3 size={16} />
                                                    Revize İste
                                                </button>
                                            ) : (
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>-</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    Henüz hiç siparişiniz bulunmuyor.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Quick Access to Bank Details */}
            <div style={{ marginTop: '60px', maxWidth: '600px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px' }}>Ödeme İşlemleri</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '10px' }}>
                    Henüz ödemesi yapılmamış siparişleriniz için aşağıdaki hesap bilgilerini kullanabilirsiniz.
                </p>
                <p style={{ color: 'var(--primary)', fontWeight: '500', marginBottom: '20px', fontSize: '0.95rem' }}>
                    ⚠️ Not: Ödemeniz hesaplarımıza ulaştıktan sonra kurgu süreci başlar. Lütfen açıklama kısmına <strong>Sipariş Numarasını</strong> yazmayı unutmayınız.
                </p>
                <BankDetails />
            </div>

            {/* Revision Modal */}
            {revisionOrder && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ backgroundColor: 'var(--surface)', width: '100%', maxWidth: '500px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontWeight: 'bold' }}>Revize Talebi - #{revisionOrder.id}</h3>
                            <button onClick={() => setRevisionOrder(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleRevisionSubmit} style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Neler Değişecek? (Detaylı yazınız)</label>
                                <textarea
                                    required
                                    name="revision_text"
                                    defaultValue={revisionOrder.revision_text}
                                    placeholder="Örn: 01:24'teki görüntü yerine şu görüntü gelsin..."
                                    style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius)', backgroundColor: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text-main)', minHeight: '120px', fontFamily: 'inherit' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Müzik veya Referans Linki (Varsa)</label>
                                <div style={{ position: 'relative' }}>
                                    <LinkIcon size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        name="revision_link"
                                        type="url"
                                        defaultValue={revisionOrder.revision_link}
                                        placeholder="YouTube veya Bulut linki"
                                        style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: 'var(--radius)', backgroundColor: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text-main)' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Ekran Görüntüsü (Varsa - Max 2MB)</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <input
                                        name="revision_image"
                                        type="file"
                                        accept="image/*"
                                        style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}
                                    />
                                    <ImageIcon size={20} color="var(--text-muted)" />
                                </div>
                                {revisionOrder.revision_image && (
                                    <div style={{ marginTop: '5px', fontSize: '0.75rem', color: 'var(--primary)' }}>Mevcut görsel sistemde kayıtlı. Yeni seçerseniz güncellenir.</div>
                                )}
                            </div>

                            <div style={{ marginTop: '10px' }}>
                                <button type="submit" disabled={isRevising} className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                                    {isRevising ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" />
                                            {uploading ? 'Görsel Yükleniyor...' : 'Gönderiliyor...'}
                                        </>
                                    ) : 'Revize Talebini İlet'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
                .container { max-width: 1200px; margin: 0 auto; }
            `}</style>
        </div>
    );
}
