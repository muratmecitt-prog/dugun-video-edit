"use client";
import { useState } from 'react';
import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';
import { ExternalLink, Save } from 'lucide-react';

export default function AdminDashboard() {
    const [orders, setOrders] = useState([
        { id: 'ORD-001', couple: 'Ayşe & Ahmet', package: 'Düğün Klibi', date: '15.09.2023', status: 'Tamamlandı', link: 'https://we.tl/t-123' },
        { id: 'ORD-002', couple: 'Zeynep & Can', package: 'Teaser', date: '02.10.2023', status: 'Kurguda', link: 'https://we.tl/t-456' },
        { id: 'ORD-003', couple: 'Mehmet & Elif', package: 'Belgesel', date: '01.11.2023', status: 'Bekleniyor', link: 'https://we.tl/t-789' },
    ]);

    const handleStatusChange = (id, newStatus) => {
        setOrders(orders.map(order =>
            order.id === id ? { ...order, status: newStatus } : order
        ));
        // Simulate toast
        // alert(`Order ${id} updated to ${newStatus}`);
    };

    return (
        <div className="container section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Admin Paneli</h1>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Toplam Bekleyen: <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{orders.filter(o => o.status !== 'Tamamlandı').length}</span>
                </div>
            </div>

            <div style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            <th style={{ padding: '16px' }}>Sipariş No</th>
                            <th style={{ padding: '16px' }}>Müşteri</th>
                            <th style={{ padding: '16px' }}>Paket</th>
                            <th style={{ padding: '16px' }}>Çekim Tarihi</th>
                            <th style={{ padding: '16px' }}>Dosya</th>
                            <th style={{ padding: '16px' }}>Durum Yönetimi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                <td style={{ padding: '16px', fontWeight: 'bold' }}>{order.id}</td>
                                <td style={{ padding: '16px' }}>{order.couple}</td>
                                <td style={{ padding: '16px' }}>
                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{order.package}</span>
                                </td>
                                <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{order.date}</td>
                                <td style={{ padding: '16px' }}>
                                    <a href={order.link} target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--primary)', fontWeight: '500' }}>
                                        <ExternalLink size={16} /> Link
                                    </a>
                                </td>
                                <td style={{ padding: '16px' }}>
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        style={{
                                            padding: '8px',
                                            borderRadius: '6px',
                                            backgroundColor: 'var(--background)',
                                            color: 'var(--text-main)',
                                            border: '1px solid var(--border)',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <option value="Bekleniyor">Bekleniyor</option>
                                        <option value="Dosya İndirildi">Dosya İndirildi</option>
                                        <option value="Kurguda">Kurguda</option>
                                        <option value="Teslime Hazır">Teslime Hazır</option>
                                        <option value="Tamamlandı">Tamamlandı</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
