"use client";
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import StatusBadge from '@/components/StatusBadge';
import { ArrowLeft, User, Phone, Mail, Building, Clock, ExternalLink, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CustomerDetailPage({ params }) {
    const { id: customerId } = use(params);
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();

    const [customer, setCustomer] = useState(null);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const isAdmin = user?.email?.toLowerCase() === 'muratmecitt@gmail.com';
        if (!authLoading && (!user || !isAdmin)) {
            router.push('/panel');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        const fetchData = async () => {
            if (!customerId) return;
            setIsLoading(true);
            try {
                // Fetch Profile
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', customerId)
                    .single();

                if (profileError) throw profileError;
                setCustomer(profileData);

                // Fetch Orders
                const { data: ordersData, error: ordersError } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('user_id', customerId)
                    .order('created_at', { ascending: false });

                if (ordersError) throw ordersError;
                setOrders(ordersData || []);

            } catch (err) {
                console.error('Error fetching customer details:', err.message);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) fetchData();
    }, [customerId, user]);

    if (authLoading || isLoading) {
        return (
            <div className="container section" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column', gap: '20px' }}>
                <Loader2 className="animate-spin" size={48} color="var(--primary)" />
                <p>Müşteri verileri yükleniyor...</p>
            </div>
        );
    }

    if (!customer && !isLoading) {
        return (
            <div className="container section" style={{ textAlign: 'center', padding: '100px 20px' }}>
                <h1 style={{ color: '#ef4444' }}>⚠️ Müşteri Bulunamadı</h1>
                {error && <p style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>Hata: {error}</p>}
                <Link href="/admin" className="btn btn-outline" style={{ marginTop: '20px' }}>Admin Paneline Dön</Link>
            </div>
        );
    }

    return (
        <div className="container section">
            <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '30px', fontSize: '0.9rem', width: 'fit-content' }}>
                <ArrowLeft size={16} /> Admin Paneline Dön
            </Link>

            <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '40px', alignItems: 'start' }}>

                {/* Sidebar: Profile Info */}
                <div style={{ position: 'sticky', top: '100px' }}>
                    <div style={{ backgroundColor: 'var(--surface)', padding: '30px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(var(--primary-rgb), 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--primary)' }}>
                                <User size={40} />
                            </div>
                        </div>

                        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '5px' }}>{customer.full_name}</h1>
                        <p style={{ color: 'var(--primary)', fontWeight: '500', textAlign: 'center', marginBottom: '30px' }}>{customer.studio_name}</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', borderTop: '1px solid var(--border)', paddingTop: '30px' }}>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <Mail size={20} color="var(--text-secondary)" />
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>E-posta</div>
                                    <div style={{ fontWeight: '500' }}>{customer.email}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <Phone size={20} color="var(--text-secondary)" />
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Telefon</div>
                                    <div style={{ fontWeight: '500' }}>{customer.phone || 'Girilmedi'}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <Building size={20} color="var(--text-secondary)" />
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Stüdyo</div>
                                    <div style={{ fontWeight: '500' }}>{customer.studio_name}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content: Order History */}
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Clock size={24} color="var(--primary)" /> Sipariş Geçmişi
                    </h2>

                    {orders.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {orders.map(order => (
                                <div key={order.id} style={{ backgroundColor: 'var(--surface)', padding: '20px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                                            <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>#{order.id}</span>
                                            <StatusBadge status={order.status} />
                                        </div>
                                        <div style={{ fontWeight: '500', marginBottom: '2px' }}>{order.couple_name}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{order.package.split('—')[1] || order.package} — {new Date(order.created_at).toLocaleDateString('tr-TR')}</div>
                                    </div>
                                    <a href={order.wt_link} target="_blank" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '0.85rem' }}>
                                        <ExternalLink size={14} /> Ham Dosya
                                    </a>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ padding: '40px', textAlign: 'center', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                            Bu müşteriye ait henüz bir sipariş bulunmuyor.
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
