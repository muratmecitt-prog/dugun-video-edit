"use client";
import Link from 'next/link';
import { Check } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

export default function PriceCard({ title, price, duration, features, deliveryTime, isPopular, displayOrder }) {
    const { user } = useAuth();

    // Generate dynamic package name: "PAKET 1 — Teaser (2.000 TL)"
    const fullPackageName = `PAKET ${displayOrder} — ${title} (${price} TL)`;

    const targetHref = user
        ? `/panel/yeni-siparis?package=${encodeURIComponent(fullPackageName)}`
        : `/giris`;

    return (
        <div style={{
            backgroundColor: 'var(--surface)',
            border: isPopular ? '2px solid var(--primary)' : '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '32px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            transition: 'transform 0.3s ease',
            cursor: 'default'
        }}>
            {isPopular && (
                <span style={{
                    position: 'absolute',
                    top: '-12px',
                    right: '20px',
                    backgroundColor: 'var(--primary)',
                    color: 'black',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    zIndex: 10
                }}>
                    POPÜLER SEÇİM
                </span>
            )}

            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px' }}>{title}</h3>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px', marginBottom: '20px' }}>
                <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{price} TL</span>
            </div>

            {duration && (
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.95rem' }}>
                    <strong>Süre:</strong> {duration}
                </p>
            )}

            <div style={{ height: '1px', backgroundColor: 'var(--border)', marginBottom: '24px' }}></div>

            <ul style={{ marginBottom: '32px', flex: 1 }}>
                {features.map((feature, index) => (
                    <li key={index} style={{ display: 'flex', gap: '10px', marginBottom: '12px', color: 'var(--text-main)' }}>
                        <Check size={20} color="var(--primary)" />
                        <span>{feature}</span>
                    </li>
                ))}
                {deliveryTime && (
                    <li style={{ display: 'flex', gap: '10px', marginTop: '20px', color: 'var(--text-main)', fontWeight: '500' }}>
                        <Check size={20} color="var(--primary)" />
                        <span>Teslim: {deliveryTime}</span>
                    </li>
                )}
            </ul>

            <Link href={targetHref} className={isPopular ? "btn btn-primary" : "btn btn-outline"} style={{ width: '100%', textAlign: 'center' }}>
                Paketi Seç
            </Link>
        </div>
    );
}
