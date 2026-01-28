"use client";
import { useState } from 'react';
import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';
import { Plus, Search, Download } from 'lucide-react';
import BankDetails from '@/components/BankDetails';

export default function UserDashboard() {
    const [searchTerm, setSearchTerm] = useState('');

    // Mock Data (Empty for fresh start)
    const allOrders = [];

    // Filter logic for search
    const filteredOrders = allOrders.filter(order =>
        order.couple.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.date.includes(searchTerm) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

            <div style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                            <th style={{ padding: '16px' }}>Sipariş No</th>
                            <th style={{ padding: '16px' }}>Çift İsimleri</th>
                            <th style={{ padding: '16px' }}>Paket</th>
                            <th style={{ padding: '16px' }}>Çekim Tarihi</th>
                            <th style={{ padding: '16px' }}>Durum</th>
                            <th style={{ padding: '16px' }}>Teslimat Dosyası</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => (
                                <tr key={order.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '16px', fontWeight: 'bold' }}>{order.id}</td>
                                    <td style={{ padding: '16px' }}>{order.couple}</td>
                                    <td style={{ padding: '16px' }}>{order.package}</td>
                                    <td style={{ padding: '16px', color: 'var(--text-main)', fontWeight: '500' }}>{order.date}</td>
                                    <td style={{ padding: '16px' }}><StatusBadge status={order.status} /></td>
                                    <td style={{ padding: '16px' }}>
                                        {order.status === 'Tamamlandı' && order.downloadLink ? (
                                            <a
                                                href={order.downloadLink}
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
