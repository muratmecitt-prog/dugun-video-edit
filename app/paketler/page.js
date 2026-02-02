"use client";
import PackagesSection from '@/components/PackagesSection';

export default function PackagesPage() {
    return (
        <div className="container section">
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto 40px auto' }}>
                    İhtiyacınıza uygun paketi seçin, profesyonel kurgunun keyfini çıkarın.
                </p>
            </div>
            <PackagesSection showTitle={true} />
        </div>
    );
}
