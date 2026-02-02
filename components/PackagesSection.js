"use client";
import { useState, useEffect } from 'react';
import PriceCard from '@/components/PriceCard';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function PackagesSection({ showTitle = true, transparentCards = false }) {
    const [packages, setPackages] = useState([]);
    const [activeCampaign, setActiveCampaign] = useState(null);
    const [loading, setLoading] = useState(true);

    // Default / Fallback Packages (Safety Net)
    const DEFAULT_PACKAGES = [
        {
            id: 'pkg_teaser',
            name: 'Teaser Paket',
            price: 3500,
            features: ['1 Dakika Süre', 'Müzikli Kurgu', 'Renk Düzenleme (Color)', '1 Revizyon Hakkı'],
            delivery_time: '5-7 Gün',
            display_order: 1,
            is_active: true
        },
        {
            id: 'pkg_klip',
            name: 'Düğün Klibi',
            price: 5500,
            features: ['3-5 Dakika Süre', 'Sinematik Kurgu', 'Ses Tasarımı', 'Renk Düzenleme (Color)', '2 Revizyon Hakkı'],
            delivery_time: '7-10 Gün',
            display_order: 2,
            is_active: true
        },
        {
            id: 'pkg_hikaye',
            name: 'Düğün Hikayesi',
            price: 8500,
            features: ['10-15 Dakika Süre', 'Belgesel Tadında', 'Konuşmalar Dahil', 'Gelişmiş Renk (Log/Rec709)', '3 Revizyon Hakkı'],
            delivery_time: '14-21 Gün',
            display_order: 3,
            is_active: true
        },
        {
            id: 'pkg_full',
            name: 'Full Belgesel',
            price: 12000,
            features: ['45-60 Dakika Süre', 'Tüm Gün Özeti', 'Multi-Cam Kurgu', 'Ses Miksajı', 'Sınırsız Revizyon'],
            delivery_time: '30 Gün',
            display_order: 4,
            is_active: true
        }
    ];

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

            // Use DB data if available, otherwise use Defaults
            const finalPackages = (packagesData && packagesData.length > 0) ? packagesData : DEFAULT_PACKAGES;
            setPackages(finalPackages);

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
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                <Loader2 className="animate-spin" size={40} color="var(--primary)" />
            </div>
        );
    }

    return (
        <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
            {showTitle && (
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h2 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '20px' }}>Paketler ve Fiyatlar</h2>
                    {activeCampaign && (
                        <div style={{ marginTop: '20px', display: 'inline-block', backgroundColor: '#eab308', color: 'black', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold' }}>
                            🔥 {activeCampaign.name} Devam Ediyor!
                        </div>
                    )}
                </div>
            )}

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', // Reduced min-width to fit 4
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
                        <div key={pkg.id} style={transparentCards ? {
                            // Override styles for demo page "Glass" effect if needed, 
                            // but PriceCard has its own styles. 
                            // We wrapped PriceCard in a div here if we wanted to manipulate it, 
                            // but actually PriceCard takes care of itself. 
                            // If "transparentCards" is requested, we might need to tweak PriceCard or just leave it.
                            // For now, let's trust the PriceCard's own dark theme which suits the demo.
                        } : {}}>
                            <PriceCard
                                id={pkg.id}
                                title={pkg.name}
                                price={finalPrice.toLocaleString('tr-TR')}
                                originalPrice={originalPrice ? originalPrice.toLocaleString('tr-TR') : null}
                                badgeText={badgeText}
                                duration={pkg.duration}
                                features={pkg.features}
                                deliveryTime={pkg.delivery_time}
                                displayOrder={pkg.display_order}
                                isPopular={pkg.name.includes('Teaser + Klip')} // Logic from original page
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
