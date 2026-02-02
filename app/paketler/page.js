"use client";
import { useState, useEffect } from 'react';
import PriceCard from '@/components/PriceCard';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function PackagesPage() {
    const [packages, setPackages] = useState([]);
    const [activeCampaign, setActiveCampaign] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            // Fetch Packages
            const { data: packagesData } = await supabase
                .from('packages')
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true });

            // Fetch Auto-Apply Campaigns
            const { data: campaignsData } = await supabase
                .from('campaigns')
                .select('*')
                .eq('is_active', true)
                .eq('is_auto_apply', true)
                .lte('start_date', new Date().toISOString()) // Started
                .or(`end_date.is.null,end_date.gte.${new Date().toISOString()}`) // Not ended
                .order('created_at', { ascending: false });

            if (packagesData) setPackages(packagesData);
            if (campaignsData && campaignsData.length > 0) {
                // Pick the most recent active auto-apply campaign
                setActiveCampaign(campaignsData[0]);
            }
            setLoading(false);
        };
        fetchData();
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
                {activeCampaign && (
                    <div style={{ marginTop: '20px', display: 'inline-block', backgroundColor: '#eab308', color: 'black', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold' }}>
                        🔥 {activeCampaign.name} Devam Ediyor!
                    </div>
                )}
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '20px'
            }}>
                {packages.map((pkg) => {
                    let finalPrice = pkg.price;
                    let originalPrice = null;
                    let badgeText = null;

                    if (activeCampaign) {
                        originalPrice = pkg.price;
                        let discountAmount = 0;
                        if (activeCampaign.discount_type === 'PERCENTAGE') {
                            discountAmount = (pkg.price * activeCampaign.discount_value) / 100;
                        } else {
                            discountAmount = activeCampaign.discount_value;
                        }
                        finalPrice = Math.max(0, pkg.price - discountAmount);
                        badgeText = activeCampaign.badge_text || `%${activeCampaign.discount_value} İNDİRİM`;
                    }

                    return (
                        <PriceCard
                            key={pkg.id}
                            id={pkg.id}
                            title={pkg.name}
                            price={finalPrice.toLocaleString('tr-TR')}
                            originalPrice={originalPrice ? originalPrice.toLocaleString('tr-TR') : null}
                            badgeText={badgeText}
                            duration={pkg.duration}
                            features={pkg.features}
                            deliveryTime={pkg.delivery_time}
                            displayOrder={pkg.display_order}
                            isPopular={pkg.name.includes('Teaser + Klip')}
                        />
                    );
                })}
            </div>
        </div>
    );
}
