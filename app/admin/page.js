"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import StatusBadge from '@/components/StatusBadge';
import Link from 'next/link';
import { ExternalLink, Save, Loader2, LogOut, Check, Search, Trash2, MessageSquare, StickyNote, X, Image as ImageIcon, Youtube } from 'lucide-react';

export default function AdminDashboard() {
    const { user, signOut } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [saveStatus, setSaveStatus] = useState({}); // { orderId: 'success' | 'error' | null }
    const [viewingRevision, setViewingRevision] = useState(null);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('Hepsi');

    // Security Check: Only allow if email matches owner
    useEffect(() => {
        if (isLoading) return;

        // ONLY redirect if we HAVE a user but they are NOT an admin
        // If user is null (signing out), let AuthProvider handle the redirect to home
        const isAdmin = user?.email?.toLowerCase() === 'muratmecitt@gmail.com';
        if (user && !isAdmin) {
            router.push('/panel');
        }
    }, [user, isLoading, router]);

    const fetchOrders = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Fetch orders
            const { data: ordersData, fetchError } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;

            // Fetch emails/phones from profiles to show in admin
            // Fetch profile data (studio name, email, phone) to show live data in admin
            const userIds = [...new Set(ordersData.map(o => o.user_id))];
            const { data: profilesData } = await supabase
                .from('profiles')
                .select('id, phone, email, studio_name')
                .in('id', userIds);

            const enrichedOrders = ordersData.map(order => {
                const profile = profilesData?.find(p => p.id === order.user_id);
                return {
                    ...order,
                    phone: profile?.phone || 'Yok',
                    email: profile?.email || 'Yok',
                    // Use live studio name from profile if available, fallback to order's fixed name
                    studio_name: profile?.studio_name || order.studio_name
                };
            });

            setOrders(enrichedOrders);
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

    const handleDeleteOrder = async (orderId) => {
        if (!confirm('Bu siparişi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) return;

        setUpdatingId(orderId);
        try {
            const { error } = await supabase
                .from('orders')
                .delete()
                .eq('id', orderId);

            if (error) throw error;

            setOrders(orders.filter(o => o.id !== orderId));
        } catch (err) {
            console.error('Delete error:', err.message);
            alert('Silme hatası: ' + err.message);
        } finally {
            setUpdatingId(null);
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

    const searchFiltered = orders.filter(order => {
        const searchStr = searchTerm.toLowerCase();
        return (
            order.id.toLowerCase().includes(searchStr) ||
            (order.studio_name || '').toLowerCase().includes(searchStr) ||
            (order.couple_name || '').toLowerCase().includes(searchStr) ||
            (order.phone || '').toLowerCase().includes(searchStr) ||
            (order.email || '').toLowerCase().includes(searchStr)
        );
    });

    const finalOrders = activeTab === 'Hepsi'
        ? searchFiltered
        : searchFiltered.filter(o => o.status === activeTab);

    if (isLoading) {
        return (
            <div className="container section" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column', gap: '20px' }}>
                <Loader2 className="animate-spin" size={48} color="var(--primary)" />
                <p>Veriler yükleniyor...</p>
            </div>
        );
    }

    if (!user) return null; // Final safety for sign-out flicker

    const isAdmin = user?.email?.toLowerCase() === 'muratmecitt@gmail.com';

    if (!isAdmin) {
        return (
            <div className="container section" style={{ textAlign: 'center', padding: '100px 20px' }}>
                <h1 style={{ color: '#ef4444' }}>⚠️ Yetkisiz Erişim</h1>
                <p style={{ marginTop: '20px' }}>Bu sayfayı görmeye yetkiniz bulunmamaktadır.</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '10px' }}>Giriş Yapılan Email: {user?.email || 'Giriş yapılmadı'}</p>
                <Link href="/panel" className="btn btn-primary" style={{ marginTop: '30px' }}>Panele Dön</Link>
            </div>
        );
    }

    return (
        <div className="container section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
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

            <div style={{ marginBottom: '30px', position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
                <input
                    type="text"
                    placeholder="Sipariş No, Stüdyo veya Çift İsmi ile ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '12px 12px 12px 45px',
                        backgroundColor: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        color: 'var(--text-main)',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
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
                            <th style={{ padding: '16px' }}>Stüdyo Bilgileri</th>
                            <th style={{ padding: '16px' }}>Müşteri (Çift)</th>
                            <th style={{ padding: '16px' }}>Paket</th>
                            <th style={{ padding: '16px' }}>Ham Dosya</th>
                            <th style={{ padding: '16px' }}>Durum</th>
                            <th style={{ padding: '16px' }}>Teslimat Linki</th>
                            <th style={{ padding: '16px' }}>İşlem</th>
                        </tr>
                    </thead>
                    <tbody>
                        {finalOrders.length > 0 ? (
                            finalOrders.map((order) => (
                                <tr key={order.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{order.id}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(order.created_at).toLocaleDateString('tr-TR')}</div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <Link
                                            href={`/admin/musteri/${order.user_id}`}
                                            style={{ display: 'block', textDecoration: 'none', transition: 'opacity 0.2s' }}
                                            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                                            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                                        >
                                            <div style={{ fontWeight: '500', color: 'var(--text-main)', borderBottom: '1px solid transparent' }}>{order.studio_name}</div>
                                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{order.email}</div>
                                        </Link>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '4px' }}>📞 {order.phone}</div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <div style={{ fontWeight: '500', color: 'var(--text-main)' }}>{order.couple_name}</div>
                                            {order.revision_text && (
                                                <button
                                                    onClick={() => setViewingRevision(order)}
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        fontSize: '0.75rem',
                                                        color: '#a855f7',
                                                        backgroundColor: 'rgba(168, 85, 247, 0.1)',
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        border: '1px solid rgba(168, 85, 247, 0.2)',
                                                        cursor: 'pointer',
                                                        width: 'fit-content',
                                                        marginTop: '4px'
                                                    }}
                                                >
                                                    <StickyNote size={12} />
                                                    Revize Notu Var
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{ fontSize: '0.85rem' }}>{order.package.split('—')[1] || order.package}</span>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <a href={order.wt_link} target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--primary)', fontWeight: '500', fontSize: '0.9rem' }}>
                                            <ExternalLink size={14} /> Aç
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
                                            <option value="Ödeme Bekleniyor">Ödeme Bekleniyor</option>
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
                                        ) : (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                {saveStatus[order.id] === 'success' ? (
                                                    <span style={{ color: '#4ade80', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                                                        <Check size={16} />
                                                    </span>
                                                ) : (
                                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Kayıtlı</span>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteOrder(order.id)}
                                                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '5px' }}
                                                    title="Siparişi Sil"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
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
            {/* Revision Viewer Modal */}
            {viewingRevision && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ backgroundColor: 'var(--surface)', width: '100%', maxWidth: '600px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(168, 85, 247, 0.1)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <MessageSquare color="#a855f7" />
                                <h3 style={{ fontWeight: 'bold' }}>Revize Detayları - #{viewingRevision.id}</h3>
                            </div>
                            <button onClick={() => setViewingRevision(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '25px' }}>
                            <div>
                                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Müşteri Talebi</h4>
                                <div style={{ backgroundColor: 'var(--background)', padding: '20px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                                    {viewingRevision.revision_text}
                                </div>
                            </div>

                            {viewingRevision.revision_link && (
                                <div>
                                    <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Referans / Müzik Linki</h4>
                                    <a
                                        href={viewingRevision.revision_link}
                                        target="_blank"
                                        className="btn btn-outline"
                                        style={{ display: 'flex', alignItems: 'center', gap: '10px', width: 'fit-content', color: 'var(--primary)' }}
                                    >
                                        <Youtube size={18} />
                                        Linki Aç
                                    </a>
                                </div>
                            )}

                            {viewingRevision.revision_image && (
                                <div>
                                    <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ekran Görüntüsü</h4>
                                    <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)', backgroundColor: 'var(--background)' }}>
                                        <img
                                            src={viewingRevision.revision_image}
                                            alt="Revision screenshot"
                                            style={{ width: '100%', display: 'block' }}
                                        />
                                        <div style={{ padding: '12px', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
                                            <a href={viewingRevision.revision_image} target="_blank" style={{ fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'none' }}>Tam Boyut Görüntüle</a>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={{ padding: '20px', backgroundColor: 'var(--background)', borderTop: '1px solid var(--border)', textAlign: 'right' }}>
                            <button onClick={() => setViewingRevision(null)} className="btn btn-primary">Anladım</button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .container { max-width: 1400px; margin: 0 auto; }
            `}</style>
        </div>
    );
}
