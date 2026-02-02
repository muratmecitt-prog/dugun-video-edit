"use client";
import { useState, useEffect } from 'react';
import PriceCard from '@/components/PriceCard';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function PackagesPage() {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPackages = async () => {
            const { data, error } = await supabase
                .from('packages')
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true });

            if (data) setPackages(data);
            setLoading(false);
        };
        fetchPackages();
    }, []);

    if (loading) {
        return (
            <div className="container section" style={{ display: 'flex', justifyContent: 'center', minHeight: '50vh' }}>
                <Loader2 className="animate-spin" size={40} color="var(--primary)" />
            </div>
        );
    }

    return (
        <div className="container section">
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '20px' }}>Paketler ve Fiyatlar</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
                    İhtiyacınıza uygun paketi seçin, profesyonel kurgunun keyfini çıkarın.
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '20px'
            }}>
                {packages.map((pkg) => (
                    <PriceCard
                        key={pkg.id}
                        title={pkg.name}
                        price={pkg.price.toLocaleString('tr-TR')}
                        duration={pkg.duration}
                        features={pkg.features}
                        deliveryTime={pkg.delivery_time}
                        displayOrder={pkg.display_order}
                        isPopular={pkg.name.includes('Teaser + Klip')} // Simple logic for now
                    />
                ))}
            </div>
        </div>
    );
}
