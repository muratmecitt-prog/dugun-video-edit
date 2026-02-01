"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Error Translation Helper
    const translateError = (msg) => {
        if (!msg) return 'Bir hata oluştu.';
        if (msg.includes('Invalid login credentials')) return 'E-posta veya şifre hatalı.';
        if (msg.includes('Email not confirmed')) return 'Lütfen e-posta adresinizi doğrulayın (Spam kutusunu kontrol edin).';
        return 'Giriş yapılamadı: ' + msg;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            // Redirect to user panel (Admin check)
            const isAdmin = email === 'muratmecitt@gmail.com';

            if (isAdmin) {
                router.push('/admin');
            } else {
                router.push('/panel');
            }

        } catch (err) {
            setError(translateError(err.message));
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (err) {
            setError('Google ile giriş hatası: ' + err.message);
        }
    };

    return (
        <div className="container section" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <div style={{ width: '100%', maxWidth: '400px', padding: '40px', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>

                <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '10px', textAlign: 'center' }}>Giriş Yap</h1>
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '30px' }}>Hesabınıza erişin</p>

                {error && (
                    <div style={{ padding: '12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: 'var(--radius)', marginBottom: '20px', fontSize: '0.9rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                        ⚠️ {error}
                    </div>
                )}

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

                <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', gap: '10px' }}>
                    <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }}></div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>veya</span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }}></div>
                </div>

                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: 'var(--radius)',
                        border: '1px solid var(--border)',
                        backgroundColor: 'var(--background)',
                        color: 'var(--text-main)',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px'
                    }}>
                    <svg width="20" height="20" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M12 5.04c3.27 0 6.21 1.64 8.07 4.19l3.05-3.05C19.89 2.92 16.18 1 12 1 6.38 1 1.65 5.09.43 10.38l3.77 2.93C5.55 8.16 8.54 5.04 12 5.04z" />
                        <path fill="#FBBC05" d="M23.54 12.3c0-.86-.07-1.7-.22-2.52H12v4.8h6.47c-.28 1.48-1.12 2.74-2.39 3.59l3.77 2.93c2.2-2.03 3.69-5.02 3.69-8.8z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.67-1 7.72-2.88l-3.77-2.93c-1.05.71-2.42 1.13-3.95 1.13-3.46 0-6.45-3.12-7.8-7.39l-3.77 2.93C1.65 18.91 6.38 23 12 23z" />
                        <path fill="#4285F4" d="M4.2 13.31A11.96 11.96 0 0112 23c-5.62 0-10.35-4.09-11.57-9.38l3.77-2.93c.31 1.48 1.13 2.82 2.22 3.89l-2.22 2.22z" />
                        <path fill="#4285F4" d="M4.2 10.69C5.55 5.16 12 1.13 12 1.13l.43 1.91-3.77 2.93C7.45 6.51 6.36 8.39 5.86 10.51L2 7.64C2.65 6.23 3.4 5.04 4.2 10.69z" />
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.21.81-.63z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google ile Giriş Yap
                </button>

                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Hesabınız yok mu? <Link href="/kayit" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Kayıt Ol</Link>
                </div>

            </div>
        </div>
    );
}
