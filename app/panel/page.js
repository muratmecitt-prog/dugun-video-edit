"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';
import { Plus, Search, Download, Loader2 } from 'lucide-react';
import BankDetails from '@/components/BankDetails';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';

export default function UserDashboard() {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Hepsi');

    useEffect(() => {
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

        fetchOrders();
    }, [user]);

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
                                        ) : (
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>-</span>
                                        )}
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

        </div>
    );
}
