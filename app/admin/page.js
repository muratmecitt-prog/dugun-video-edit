"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import StatusBadge from '@/components/StatusBadge';
import { ExternalLink, Save, Loader2, LogOut, Check } from 'lucide-react';

export default function AdminDashboard() {
    const { user, signOut } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [saveStatus, setSaveStatus] = useState({}); // { orderId: 'success' | 'error' | null }
    const [error, setError] = useState(null);

    // Security Check: Only allow if email matches owner
    useEffect(() => {
        const isAdmin = user?.email?.toLowerCase() === 'muratmecitt@gmail.com';
        if (!isLoading && (!user || !isAdmin)) {
            router.push('/panel');
        }
    }, [user, isLoading, router]);

    const fetchOrders = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data, fetchError } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;
            setOrders(data || []);
        } catch (err) {
            console.error('Error fetching admin orders:', err.message);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const isAdmin = user?.email?.toLowerCase() === 'muratmecitt@gmail.com';
        if (user && isAdmin) {
            fetchOrders();
        } else if (user && !isAdmin) {
            setIsLoading(false); // Stop loading so security check can redirect
        }
    }, [user]);

    const handleUpdateOrder = async (orderId, updates) => {
        setUpdatingId(orderId);
        try {
            const { error } = await supabase
                .from('orders')
                .update(updates)
                .eq('id', orderId);

            if (error) throw error;

            // Update local state
            setOrders(orders.map(o => o.id === orderId ? { ...o, ...updates } : o));

            // Show success briefly
            setSaveStatus({ ...saveStatus, [orderId]: 'success' });
            setTimeout(() => {
                setSaveStatus(prev => ({ ...prev, [orderId]: null }));
            }, 3000);

        } catch (err) {
            console.error('Update error:', err.message);
            alert('Güncelleme hatası: ' + err.message);
        } finally {
            setUpdatingId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="container section" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <Loader2 className="animate-spin" size={48} color="var(--primary)" />
            </div>
        );
    }

    if (!user || !user.email.includes('admin')) {
        return null; // Will redirect via useEffect
    }

    return (
        <div className="container section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Admin Paneli</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Tüm siparişleri yönetin (Giriş: {user?.email})</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Toplam Sipariş</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{orders.length}</div>
                    </div>
                    <button onClick={signOut} className="btn btn-outline" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <LogOut size={18} /> Çıkış
                    </button>
                </div>
            </div>

            {error && (
                <div style={{ padding: '20px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: 'var(--radius)', border: '1px solid rgba(239, 68, 68, 0.2)', marginBottom: '30px' }}>
                    <h3 style={{ fontWeight: 'bold', marginBottom: '8px' }}>Bağlantı Hatası:</h3>
                    <p style={{ fontSize: '0.95rem' }}>{error}</p>
                    <button onClick={fetchOrders} className="btn btn-outline" style={{ marginTop: '15px', padding: '5px 15px' }}>Tekrar Dene</button>
                </div>
            )}

            <div style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1000px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            <th style={{ padding: '16px' }}>Sipariş No</th>
                            <th style={{ padding: '16px' }}>Müşteri / Stüdyo</th>
                            <th style={{ padding: '16px' }}>Paket</th>
                            <th style={{ padding: '16px' }}>Ham Dosya (WeTransfer)</th>
                            <th style={{ padding: '16px' }}>Durum</th>
                            <th style={{ padding: '16px' }}>Teslimat Linki</th>
                            <th style={{ padding: '16px' }}>İşlem</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <tr key={order.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{order.id}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(order.created_at).toLocaleDateString('tr-TR')}</div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ fontWeight: '500' }}>{order.studio_name}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{order.couple_name}</div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{ fontSize: '0.85rem' }}>{order.package.split('—')[1] || order.package}</span>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <a href={order.wt_link} target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--primary)', fontWeight: '500', fontSize: '0.9rem' }}>
                                            <ExternalLink size={14} /> Linki Aç
                                        </a>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <select
                                            defaultValue={order.status}
                                            onChange={(e) => handleUpdateOrder(order.id, { status: e.target.value })}
                                            disabled={updatingId === order.id}
                                            style={{
                                                padding: '6px 10px',
                                                borderRadius: '6px',
                                                backgroundColor: 'var(--background)',
                                                color: 'var(--text-main)',
                                                border: '1px solid var(--border)',
                                                fontSize: '0.85rem',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <option value="Beklemede">Beklemede</option>
                                            <option value="Dosya İndirildi">Dosya İndirildi</option>
                                            <option value="Kurguda">Kurguda</option>
                                            <option value="Revize Ediliyor">Revize Ediliyor</option>
                                            <option value="Tamamlandı">Tamamlandı</option>
                                        </select>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <input
                                            type="text"
                                            placeholder="İndirme linkini yapıştır..."
                                            defaultValue={order.download_link || ''}
                                            onBlur={(e) => {
                                                if (e.target.value !== (order.download_link || '')) {
                                                    handleUpdateOrder(order.id, { download_link: e.target.value });
                                                }
                                            }}
                                            style={{
                                                width: '180px',
                                                padding: '6px 10px',
                                                backgroundColor: 'var(--background)',
                                                border: '1px solid var(--border)',
                                                borderRadius: '4px',
                                                color: 'var(--text-main)',
                                                fontSize: '0.85rem'
                                            }}
                                        />
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        {updatingId === order.id ? (
                                            <Loader2 className="animate-spin" size={18} color="var(--primary)" />
                                        ) : saveStatus[order.id] === 'success' ? (
                                            <span style={{ color: '#4ade80', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                                                <Check size={16} /> Kaydedildi
                                            </span>
                                        ) : (
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Otomatik Kayıt</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    Henüz hiç sipariş bulunmuyor.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
