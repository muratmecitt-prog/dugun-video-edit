"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, Calendar, Package, ExternalLink, Loader2, Video, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function CustomerDetailPage({ params }) {
    const { id } = params;
    const { user } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState(null);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const isAdmin = user?.email?.toLowerCase() === 'muratmecitt@gmail.com';
        if (user && !isAdmin) {
            router.push('/panel');
        }
    }, [user, router]);

    useEffect(() => {
        if (id && user) {
            fetchCustomerDetails();
        }
    }, [id, user]);

    const fetchCustomerDetails = async () => {
        setIsLoading(true);
        try {
            // Get Profile
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', id)
                .single();

            if (profileError) throw profileError;

            // Get Orders
            const { data: ordersData, error: ordersError } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', id)
                .order('created_at', { ascending: false });

            if (ordersError) throw ordersError;

            setProfile(profileData);
            setOrders(ordersData);
        } catch (err) {
            console.error('Error fetching customer details:', err.message);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="container section" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column', gap: '20px' }}>
                <Loader2 className="animate-spin" size={48} color="var(--primary)" />
                <p>Müşteri verileri yükleniyor...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container section">
                <div style={{ padding: '20px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: 'var(--radius)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                    <h3>Hata Oluştu</h3>
                    <p>{error}</p>
                    <Link href="/admin" className="btn btn-outline" style={{ marginTop: '15px' }}>Geri Dön</Link>
                </div>
            </div>
        );
    }

    if (!profile) return null;

    // Stats
    const totalOrders = orders.length;
    const activeOrders = orders.filter(o => o.status !== 'Tamamlandı').length;
    const completedOrders = orders.filter(o => o.status === 'Tamamlandı').length;

    return (
        <div className="container section">
            {/* Header */}
            <div style={{ marginBottom: '30px' }}>
                <Link href="/admin" className="btn btn-outline" style={{ display: 'inline-flex', gap: '8px', marginBottom: '20px', padding: '8px 16px' }}>
                    <ArrowLeft size={18} /> Admin Paneline Dön
                </Link>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '20px' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                            {profile.studio_name || 'İsimsiz Stüdyo'}
                            <span style={{ fontSize: '0.9rem', fontWeight: 'normal', backgroundColor: 'var(--surface)', padding: '4px 10px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                                Müşteri ID: {profile.id.substring(0, 8)}...
                            </span>
                        </h1>
                        <div style={{ display: 'flex', gap: '20px', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                            {profile.phone && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Phone size={16} /> {profile.phone}
                                </div>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Mail size={16} /> {profile.email}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Calendar size={16} /> Kayıt: {new Date(profile.created_at).toLocaleDateString('tr-TR')}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <StatCard label="Toplam Sipariş" value={totalOrders} icon={<Package size={20} />} />
                        <StatCard label="Aktif" value={activeOrders} icon={<Clock size={20} />} color="var(--primary)" />
                        <StatCard label="Tamamlanan" value={completedOrders} icon={<CheckCircle2 size={20} />} color="#4ade80" />
                    </div>
                </div>
            </div>

            {/* Orders List */}
            <div style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '25px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Video size={24} color="var(--primary)" />
                    Sipariş Geçmişi
                </h2>

                {orders.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {orders.map(order => (
                            <div key={order.id} style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 2fr 1fr 1fr',
                                gap: '20px',
                                padding: '20px',
                                backgroundColor: 'var(--background)',
                                borderRadius: 'var(--radius)',
                                border: '1px solid var(--border)',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Sipariş No</div>
                                    <div style={{ fontWeight: 'bold' }}>{order.id.substring(0, 8)}...</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                        {new Date(order.created_at).toLocaleDateString('tr-TR')}
                                    </div>
                                </div>

                                <div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '5px' }}>{order.couple_name}</div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{order.package}</div>
                                </div>

                                <div>
                                    <div style={{
                                        display: 'inline-block',
                                        padding: '6px 12px',
                                        borderRadius: '6px',
                                        backgroundColor: order.status === 'Tamamlandı' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(202, 138, 4, 0.1)',
                                        color: order.status === 'Tamamlandı' ? '#4ade80' : 'var(--primary)',
                                        fontSize: '0.85rem',
                                        fontWeight: '500'
                                    }}>
                                        {order.status}
                                    </div>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    {order.download_link ? (
                                        <a href={order.download_link} target="_blank" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                                            <ExternalLink size={16} style={{ marginRight: '6px' }} /> Teslimatı Aç
                                        </a>
                                    ) : (
                                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Link Girilmedi</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                        <div style={{ marginBottom: '15px' }}>
                            <Package size={48} style={{ opacity: 0.2 }} />
                        </div>
                        Bu müşterinin henüz siparişi bulunmuyor.
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ label, value, icon, color = 'var(--text-main)' }) {
    return (
        <div style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '15px 20px',
            minWidth: '140px',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                {label}
                <span style={{ color: color }}>{icon}</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: color }}>
                {value}
            </div>
        </div>
    );
}
