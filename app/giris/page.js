"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            // For demo, if email contains 'admin', go to admin panel, else user panel
            const email = e.target.email.value;
            if (email.includes('admin')) {
                router.push('/admin');
            } else {
                router.push('/panel');
            }
        }, 1000);
    };

    return (
        <div className="container section" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <div style={{ width: '100%', maxWidth: '400px', padding: '40px', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>

                <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '10px', textAlign: 'center' }}>Giriş Yap</h1>
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '30px' }}>Hesabınıza erişin</p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>E-posta Adresi</label>
                        <input
                            required
                            id="email"
                            name="email"
                            type="email"
                            placeholder="ornek@email.com"
                            style={{
                                width: '100%',
                                padding: '12px',
                                backgroundColor: 'var(--background)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius)',
                                color: 'var(--text-main)',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Şifre</label>
                        <input
                            required
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            style={{
                                width: '100%',
                                padding: '12px',
                                backgroundColor: 'var(--background)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius)',
                                color: 'var(--text-main)',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isLoading}
                        style={{ width: '100%', marginTop: '10px' }}
                    >
                        {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                    </button>
                </form>

                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Hesabınız yok mu? <Link href="/kayit" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Kayıt Ol</Link>
                </div>

                {/* Demo Tip Removed */}

            </div>
        </div>
    );
}
