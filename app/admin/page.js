"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/Toast';
import { sendNotificationEmail, templates } from '@/lib/emailService';
import Link from 'next/link';
import { ExternalLink, Loader2, LogOut, Check, Search, Trash2, MessageSquare, StickyNote, X, Image as ImageIcon, Link as LinkIcon, Users, Package, Play, Plus } from 'lucide-react';

export default function AdminDashboard() {
    const { user, signOut } = useAuth();
    const { showToast } = useToast();
    const router = useRouter();

    // Data States
    const [orders, setOrders] = useState([]);
    const [profiles, setProfiles] = useState([]);
    const [portfolio, setPortfolio] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form States
    const [newTitle, setNewTitle] = useState('');
    const [newVideoUrl, setNewVideoUrl] = useState('');

    // Load drafts on mount
    useEffect(() => {
        const savedTitle = localStorage.getItem('draft_title');
        const savedUrl = localStorage.getItem('draft_video_url');
        if (savedTitle) setNewTitle(savedTitle);
        if (savedUrl) setNewVideoUrl(savedUrl);
    }, []);

    // Save drafts on change
    useEffect(() => {
        localStorage.setItem('draft_title', newTitle);
    }, [newTitle]);

    useEffect(() => {
        localStorage.setItem('draft_video_url', newVideoUrl);
    }, [newVideoUrl]);

    const handleAddPortfolio = async (e) => {
        e.preventDefault();
        if (!newTitle || !newVideoUrl) return;

        try {
            const { data, error } = await supabase.from('portfolio').insert([{ title: newTitle, video_url: newVideoUrl }]).select();
            if (error) throw error;
            setPortfolio([data[0], ...portfolio]);
            showToast('Video portfolyoya eklendi.', 'success');

            // Clear form and storage
            setNewTitle('');
            setNewVideoUrl('');
            localStorage.removeItem('draft_title');
            localStorage.removeItem('draft_video_url');
        } catch (err) {
            showToast('Ekleme hatası: ' + err.message, 'error');
        }
    };
    const [activeMainTab, setActiveMainTab] = useState('Siparişler'); // 'Siparişler' | 'Müşteriler'
    const [activeOrderFilter, setActiveOrderFilter] = useState('Hepsi'); // 'Hepsi' | 'Ödeme Bekleniyor' etc.
    const [searchTerm, setSearchTerm] = useState('');

    // Action States
    const [updatingId, setUpdatingId] = useState(null);
    const [saveStatus, setSaveStatus] = useState({});
    const [viewingRevision, setViewingRevision] = useState(null);
    const [enlargedImage, setEnlargedImage] = useState(null);

    useEffect(() => {
        if (isLoading) return;
        const isAdmin = user?.email?.toLowerCase() === 'muratmecitt@gmail.com';
        if (user && !isAdmin) {
            router.push('/panel');
        }
    }, [user, isLoading, router]);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Fetch orders
            const { data: ordersData, error: fetchError } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;

            // Fetch profiles
            const { data: profilesData, error: profilesError } = await supabase
                .from('profiles')
                .select('*');

            if (profilesError) throw profilesError;

            // Fetch portfolio
            const { data: portfolioData, error: portfolioError } = await supabase
                .from('portfolio')
                .select('*')
                .order('created_at', { ascending: false });

            if (portfolioError) throw portfolioError;

            // Enrich orders with profile data
            const enrichedOrders = ordersData.map(order => {
                const profile = profilesData?.find(p => p.id === order.user_id);
                return {
                    ...order,
                    phone: profile?.phone || 'Yok',
                    email: profile?.email || 'Yok',
                    studio_name: profile?.studio_name || order.studio_name || 'Bilinmiyor'
                };
            });

            setOrders(enrichedOrders);
            setProfiles(profilesData || []);
            setPortfolio(portfolioData || []);
        } catch (err) {
            console.error('Error fetching admin data:', err.message);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const isAdmin = user?.email?.toLowerCase() === 'muratmecitt@gmail.com';
        if (user && isAdmin) {
            fetchData();
        } else if (user && !isAdmin) {
            setIsLoading(false);
        }
    }, [user]);

    const handleUpdateOrder = async (orderId, updates) => {
        setUpdatingId(orderId);
        try {
            const updatePayload = {
                ...updates,
                updated_at: new Date().toISOString()
            };

            if (updates.status === 'Tamamlandı') {
                updatePayload.completed_at = new Date().toISOString();
            }

            const { error } = await supabase
                .from('orders')
                .update(updatePayload)
                .eq('id', orderId);

            if (error) throw error;

            setOrders(orders.map(o => o.id === orderId ? { ...o, ...updatePayload } : o));
            showToast('Sipariş güncellendi.', 'success');
            setSaveStatus({ ...saveStatus, [orderId]: 'success' });

            if (updates.status) {
                const order = orders.find(o => o.id === orderId);
                let recipientEmail = order.email;

                // Fallback for missing email
                if (!recipientEmail || recipientEmail === 'Yok' || recipientEmail === 'Bilinmiyor') {
                    const manualEmail = prompt("⚠️ UYARI: Bu müşterinin sistemde kayıtlı emaili bulunamadı.\n\nLütfen bildirimin gitmesi için müşterinin email adresini giriniz (Bu işlem profili de güncelleyecektir):");

                    if (manualEmail && manualEmail.includes('@')) {
                        recipientEmail = manualEmail;

                        // Try to update the missing profile in background
                        supabase.from('profiles').upsert({
                            id: order.user_id,
                            email: manualEmail,
                            updated_at: new Date().toISOString()
                        }).then(({ error }) => {
                            if (!error) {
                                showToast('Müşteri profili otomatik oluşturuldu/güncellendi.', 'success');
                                // Refresh local state to show email next time
                                setOrders(current => current.map(o => o.user_id === order.user_id ? { ...o, email: manualEmail } : o));
                            }
                        });
                    }
                }

                if (recipientEmail && recipientEmail !== 'Yok') {
                    sendNotificationEmail(templates.USER_STATUS_UPDATE, {
                        to_email: recipientEmail,
                        order_id: orderId,
                        status: updates.status,
                        download_link: updates.download_link || order.download_link || ''
                    });
                } else {
                    showToast('Email adresi olmadığı için bildirim gönderilemedi.', 'warning');
                }
            }

            setTimeout(() => {
                setSaveStatus(prev => ({ ...prev, [orderId]: null }));
            }, 3000);

        } catch (err) {
            showToast('Hata: ' + err.message, 'error');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (!confirm('Bu siparişi silmek istediğinize emin misiniz?')) return;
        setUpdatingId(orderId);
        try {
            const { error } = await supabase.from('orders').delete().eq('id', orderId);
            if (error) throw error;
            showToast('Sipariş silindi.', 'success');
            setOrders(orders.filter(o => o.id !== orderId));
        } catch (err) {
            showToast('Hata: ' + err.message, 'error');
        } finally {
            setUpdatingId(null);
        }
    };





    const handleDeletePortfolio = async (id) => {
        if (!confirm('Bu videoyu portfolyodan silmek istiyor musunuz?')) return;
        try {
            const { error } = await supabase.from('portfolio').delete().eq('id', id);
            if (error) throw error;
            setPortfolio(portfolio.filter(p => p.id !== id));
            showToast('Video silindi.', 'success');
        } catch (err) {
            showToast('Silme hatası: ' + err.message, 'error');
        }
    };

    // Filters
    const orderCounts = {
        'Hepsi': orders.length,
        'Ödeme Bekleniyor': orders.filter(o => o.status === 'Ödeme Bekleniyor').length,
        'Kurguda': orders.filter(o => o.status === 'Kurguda').length,
        'Revize Ediliyor': orders.filter(o => o.status === 'Revize Ediliyor').length,
        'Tamamlandı': orders.filter(o => o.status === 'Tamamlandı').length,
    };

    const searchFilteredOrders = orders.filter(order => {
        const searchStr = searchTerm.toLowerCase();
        return (
            order.id.toLowerCase().includes(searchStr) ||
            (order.studio_name || '').toLowerCase().includes(searchStr) ||
            (order.couple_name || '').toLowerCase().includes(searchStr) ||
            (order.phone || '').toLowerCase().includes(searchStr) ||
            (order.email || '').toLowerCase().includes(searchStr)
        );
    });

    const finalOrders = activeOrderFilter === 'Hepsi'
        ? searchFilteredOrders
        : searchFilteredOrders.filter(o => o.status === activeOrderFilter);

    const searchFilteredProfiles = profiles.filter(profile => {
        const searchStr = searchTerm.toLowerCase();
        return (
            (profile.studio_name || '').toLowerCase().includes(searchStr) ||
            (profile.email || '').toLowerCase().includes(searchStr) ||
            (profile.phone || '').toLowerCase().includes(searchStr)
        );
    });

    if (isLoading) return <div className="container section center"><Loader2 className="animate-spin" /></div>;
    if (!user || user?.email?.toLowerCase() !== 'muratmecitt@gmail.com') return null;

    return (
        <div className="container section">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Admin Paneli</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Yönetim Paneli</p>
                </div>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Toplam Sipariş</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{orders.length}</div>
                    </div>
                    <button onClick={signOut} className="btn btn-outline"><LogOut size={18} /> Çıkış</button>
                </div>
            </div>

            {/* Main Tabs */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', borderBottom: '1px solid var(--border)' }}>
                <button
                    onClick={() => setActiveMainTab('Siparişler')}
                    style={{
                        padding: '10px 20px',
                        borderBottom: activeMainTab === 'Siparişler' ? '2px solid var(--primary)' : '2px solid transparent',
                        color: activeMainTab === 'Siparişler' ? 'var(--primary)' : 'var(--text-secondary)',
                        fontWeight: 'bold',
                        background: 'none',
                        borderTop: 'none', borderLeft: 'none', borderRight: 'none',
                        cursor: 'pointer', fontSize: '1.1rem',
                        display: 'flex', alignItems: 'center', gap: '8px'
                    }}
                >
                    <Package size={20} /> Siparişler
                </button>
                <button
                    onClick={() => setActiveMainTab('Müşteriler')}
                    style={{
                        padding: '10px 20px',
                        borderBottom: activeMainTab === 'Müşteriler' ? '2px solid var(--primary)' : '2px solid transparent',
                        color: activeMainTab === 'Müşteriler' ? 'var(--primary)' : 'var(--text-secondary)',
                        fontWeight: 'bold',
                        background: 'none',
                        borderTop: 'none', borderLeft: 'none', borderRight: 'none',
                        cursor: 'pointer', fontSize: '1.1rem',
                        display: 'flex', alignItems: 'center', gap: '8px'
                    }}
                >
                    <Users size={20} /> Müşteriler <span className="badge">{profiles.length}</span>
                </button>
                <button
                    onClick={() => setActiveMainTab('Portfolyo')}
                    style={{
                        padding: '10px 20px',
                        borderBottom: activeMainTab === 'Portfolyo' ? '2px solid var(--primary)' : '2px solid transparent',
                        color: activeMainTab === 'Portfolyo' ? 'var(--primary)' : 'var(--text-secondary)',
                        fontWeight: 'bold',
                        background: 'none',
                        borderTop: 'none', borderLeft: 'none', borderRight: 'none',
                        cursor: 'pointer', fontSize: '1.1rem',
                        display: 'flex', alignItems: 'center', gap: '8px'
                    }}
                >
                    <Play size={20} /> Portfolyo <span className="badge">{portfolio.length}</span>
                </button>
            </div>

            {/* Search */}
            <div style={{ marginBottom: '20px', position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
                <input
                    type="text"
                    placeholder={activeMainTab === 'Siparişler' ? "Sipariş No, Stüdyo, İsim ara..." : "Stüdyo, Email, Telefon ara..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%', padding: '12px 12px 12px 45px',
                        backgroundColor: 'var(--surface)', border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)', color: 'var(--text-main)', fontSize: '1rem', outline: 'none'
                    }}
                />
            </div>

            {/* Sub Tabs (Only for Orders) */}
            {activeMainTab === 'Siparişler' && (
                <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', overflowX: 'auto', paddingBottom: '5px' }}>
                    {Object.keys(orderCounts).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveOrderFilter(tab)}
                            style={{
                                padding: '8px 16px', borderRadius: '20px', border: '1px solid var(--border)',
                                backgroundColor: activeOrderFilter === tab ? 'var(--surface-hover)' : 'var(--surface)',
                                color: activeOrderFilter === tab ? 'var(--primary)' : 'var(--text-secondary)',
                                fontSize: '0.85rem', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap'
                            }}
                        >
                            {tab}
                            <span style={{ backgroundColor: 'var(--background)', padding: '1px 6px', borderRadius: '8px', fontSize: '0.7rem' }}>
                                {orderCounts[tab]}
                            </span>
                        </button>
                    ))}
                </div>
            )}

            {/* ERROR View */}
            {error && (
                <div style={{ padding: '20px', backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: 'var(--radius)', marginBottom: '20px' }}>
                    <p>{error}</p>
                    <button onClick={fetchData} className="btn btn-outline" style={{ marginTop: '10px' }}>Tekrar Dene</button>
                </div>
            )}

            {/* CONTENT: Orders */}
            {activeMainTab === 'Siparişler' && (
                <div style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1000px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                <th style={{ padding: '16px' }}>Sipariş No</th>
                                <th style={{ padding: '16px' }}>Stüdyo</th>
                                <th style={{ padding: '16px' }}>Çift</th>
                                <th style={{ padding: '16px' }}>Paket</th>
                                <th style={{ padding: '16px' }}>Ham Dosya</th>
                                <th style={{ padding: '16px' }}>Durum</th>
                                <th style={{ padding: '16px' }}>Teslimat</th>
                                <th style={{ padding: '16px' }}>İşlem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {finalOrders.length > 0 ? finalOrders.map(order => (
                                <tr key={order.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{order.id}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(order.created_at).toLocaleDateString('tr-TR')}</div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <Link href={`/admin/musteri/${order.user_id}`} style={{ fontWeight: '500' }}>{order.studio_name}</Link>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ fontWeight: 'bold' }}>{order.couple_name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.email}</div>
                                        {(order.revision_text || order.revision_items?.length > 0) && (
                                            <button onClick={() => setViewingRevision(order)} style={{ display: 'block', marginTop: '5px', fontSize: '0.75rem', color: '#a855f7', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                                                📝 Revize Notu
                                            </button>
                                        )}
                                    </td>
                                    <td style={{ padding: '16px' }}><span style={{ fontSize: '0.85rem' }}>{order.package}</span></td>
                                    <td style={{ padding: '16px' }}>
                                        <a href={order.wt_link} target="_blank" style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <ExternalLink size={14} /> Aç
                                        </a>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleUpdateOrder(order.id, { status: e.target.value })}
                                            style={{ padding: '6px', borderRadius: '4px', backgroundColor: 'var(--background)', color: 'var(--text-main)', border: '1px solid var(--border)' }}
                                            disabled={updatingId === order.id}
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
                                            defaultValue={order.download_link || ''}
                                            onBlur={(e) => e.target.value !== (order.download_link || '') && handleUpdateOrder(order.id, { download_link: e.target.value })}
                                            placeholder="Link yapıştır"
                                            style={{ width: '150px', padding: '6px', borderRadius: '4px', backgroundColor: 'var(--background)', color: 'var(--text-main)', border: '1px solid var(--border)' }}
                                        />
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <button onClick={() => handleDeleteOrder(order.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="8" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Sipariş bulunamadı.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* CONTENT: Customers */}
            {activeMainTab === 'Müşteriler' && (
                <div style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                <th style={{ padding: '16px' }}>Stüdyo Adı</th>
                                <th style={{ padding: '16px' }}>Ad Soyad</th>
                                <th style={{ padding: '16px' }}>İletişim</th>
                                <th style={{ padding: '16px' }}>Kayıt</th>
                                <th style={{ padding: '16px' }}>Sipariş</th>
                                <th style={{ padding: '16px' }}>İşlem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchFilteredProfiles.length > 0 ? searchFilteredProfiles.map(profile => (
                                <tr key={profile.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '16px', fontWeight: 'bold' }}>{profile.studio_name}</td>
                                    <td style={{ padding: '16px' }}>{profile.full_name || '-'}</td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ fontSize: '0.9rem' }}>{profile.email}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{profile.phone}</div>
                                    </td>
                                    <td style={{ padding: '16px' }}>{profile.created_at ? new Date(profile.created_at).toLocaleDateString() : '-'}</td>
                                    <td style={{ padding: '16px' }}>
                                        <span className="badge">{orders.filter(o => o.user_id === profile.id).length} Adet</span>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <Link href={`/admin/musteri/${profile.id}`} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Detay</Link>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Kayıt bulunamadı.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* CONTENT: Portfolio */}
            {activeMainTab === 'Portfolyo' && (
                <div>
                    <div style={{ backgroundColor: 'var(--surface)', padding: '20px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', marginBottom: '30px' }}>
                        <h3 style={{ marginBottom: '15px', fontWeight: 'bold' }}>Yeni Video Ekle</h3>
                        <form onSubmit={handleAddPortfolio} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                            <input
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                required
                                placeholder="Video Başlığı (Örn: Ayşe & Ahmet Düğün Klibi)"
                                style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', backgroundColor: 'var(--background)', color: 'var(--text-main)' }}
                            />
                            <input
                                value={newVideoUrl}
                                onChange={(e) => setNewVideoUrl(e.target.value)}
                                required
                                placeholder="Video Linki (YouTube/Vimeo)"
                                style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', backgroundColor: 'var(--background)', color: 'var(--text-main)' }}
                            />
                            <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Plus size={20} /> Ekle</button>
                        </form>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {portfolio.map(item => (
                            <div key={item.id} style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                                <div style={{ padding: '15px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>{item.title}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>{new Date(item.created_at).toLocaleDateString()}</div>
                                    </div>
                                    <button onClick={() => handleDeletePortfolio(item.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={18} /></button>
                                </div>
                                <div style={{ padding: '15px' }}>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.video_url}</div>
                                    <a href={item.video_url} target="_blank" className="btn btn-outline" style={{ display: 'flex', justifyContent: 'center', width: '100%', gap: '8px' }}><Play size={16} /> İzle</a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Modals */}
            {viewingRevision && (
                <RevisionModal revision={viewingRevision} onClose={() => setViewingRevision(null)} setEnlargedImage={setEnlargedImage} />
            )}

            {enlargedImage && (
                <div onClick={() => setEnlargedImage(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={enlargedImage} style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} />
                </div>
            )}

            <style jsx>{`
                .container { max-width: 1400px; margin: 0 auto; }
                .center { display: flex; justify-content: center; alignItems: center; min-height: 60vh; }
                .badge { background-color: var(--surface); padding: 2px 8px; border-radius: 10px; font-size: 0.75rem; border: 1px solid var(--border); }
            `}</style>
        </div>
    );
}

// Extracted Modal Component for cleaner code
function RevisionModal({ revision, onClose, setEnlargedImage }) {
    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
            <div style={{ backgroundColor: 'var(--surface)', width: '100%', maxWidth: '600px', maxHeight: '90vh', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>Revize Talebi</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)' }}><X /></button>
                </div>
                <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
                    {/* Reuse the logic from before for displaying items */}
                    {revision.revision_items?.map((item, idx) => (
                        <div key={idx} style={{ marginBottom: '20px', padding: '15px', backgroundColor: 'var(--background)', borderRadius: '8px' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '10px', color: 'var(--primary)' }}>
                                {item.type === 'image' ? 'Görüntü' : 'Link'}
                            </div>
                            {item.type === 'image' && <img src={item.value} onClick={() => setEnlargedImage(item.value)} style={{ maxWidth: '100%', cursor: 'zoom-in' }} />}
                            {item.type === 'link' && <a href={item.value} target="_blank" style={{ color: '#a855f7', display: 'flex', alignItems: 'center', gap: '5px' }}><LinkIcon size={16} /> Linki Aç</a>}
                            <p style={{ marginTop: '10px' }}>{item.text}</p>
                        </div>
                    ))}
                    {!revision.revision_items && <p>{revision.revision_text}</p>}
                </div>
            </div>
        </div>
    );
}
