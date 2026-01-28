"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate registration
        router.push('/panel');
    };

    return (
        <div className="container section" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <div style={{ width: '100%', maxWidth: '400px', padding: '40px', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>

                <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '10px', textAlign: 'center' }}>Kayıt Ol</h1>
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '30px' }}>Hızlı kurgu dünyasına katılın</p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label htmlFor="name" style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Ad Soyad</label>
                        <input
                            required
                            id="name"
                            type="text"
                            placeholder="Adınız Soyadınız"
                            style={{ width: '100%', padding: '12px', backgroundColor: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text-main)', fontSize: '1rem' }}
                        />
                    </div>

                    <div>
                        <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>E-posta Adresi</label>
                        <input
                            required
                            id="email"
                            type="email"
                            placeholder="ornek@email.com"
                            style={{ width: '100%', padding: '12px', backgroundColor: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text-main)', fontSize: '1rem' }}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Şifre</label>
                        <input
                            required
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            style={{ width: '100%', padding: '12px', backgroundColor: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text-main)', fontSize: '1rem' }}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                        Hesap Oluştur
                    </button>
                </form>

                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Zaten hesabınız var mı? <Link href="/giris" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Giriş Yap</Link>
                </div>

            </div>
        </div>
    );
}
