"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { User, Building, Lock, Save, Loader2, CheckCircle2, Phone } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Profile State
    const [profile, setProfile] = useState({
        full_name: '',
        studio_name: '',
        phone: ''
    });

    // Password State
    const [passwords, setPasswords] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (error && error.code !== 'PGRST116') throw error;
                if (data) {
                    setProfile({
                        full_name: data.full_name || '',
                        studio_name: data.studio_name || '',
                        phone: data.phone || ''
                    });
                }
            } catch (err) {
                console.error('Error fetching profile:', err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    full_name: profile.full_name,
                    studio_name: profile.studio_name,
                    phone: profile.phone,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;
            setMessage({ type: 'success', text: 'Profil başarıyla güncellendi!' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Güncelleme hatası: ' + err.message });
        } finally {
            setIsSaving(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            setMessage({ type: 'error', text: 'Şifreler uyuşmuyor!' });
            return;
        }

        setIsSaving(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: passwords.newPassword
            });

            if (error) throw error;
            setMessage({ type: 'success', text: 'Şifreniz başarıyla değiştirildi!' });
            setPasswords({ newPassword: '', confirmPassword: '' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Şifre değiştirme hatası: ' + err.message });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="container section" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <Loader2 className="animate-spin" size={40} color="var(--primary)" />
            </div>
        );
    }

    return (
        <div className="container section">
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '10px' }}>Ayarlar</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>Profil bilgilerinizi ve güvenliğinizi yönetin</p>

                {message.text && (
                    <div style={{
                        padding: '16px',
                        backgroundColor: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: message.type === 'success' ? '#4ade80' : '#ef4444',
                        borderRadius: 'var(--radius)',
                        marginBottom: '30px',
                        border: `1px solid ${message.type === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        {message.type === 'success' ? <CheckCircle2 size={20} /> : <span>⚠️</span>}
                        {message.text}
                    </div>
                )}

                {/* Profile Section */}
                <div style={{ backgroundColor: 'var(--surface)', padding: '30px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <User size={20} color="var(--primary)" /> Profil Bilgileri
                    </h2>

                    <form onSubmit={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Ad Soyad</label>
                            <input
                                type="text"
                                value={profile.full_name}
                                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                style={{ width: '100%', padding: '12px', backgroundColor: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text-main)', fontSize: '1rem' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Firma / Stüdyo Adı</label>
                            <input
                                type="text"
                                value={profile.studio_name}
                                onChange={(e) => setProfile({ ...profile, studio_name: e.target.value })}
                                placeholder="Örn: Vega Medya"
                                style={{ width: '100%', padding: '12px', backgroundColor: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text-main)', fontSize: '1rem' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Telefon Numarası</label>
                            <input
                                type="tel"
                                value={profile.phone}
                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                placeholder="05xx xxx xx xx"
                                style={{ width: '100%', padding: '12px', backgroundColor: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text-main)', fontSize: '1rem' }}
                            />
                        </div>
                        <button type="submit" disabled={isSaving} className="btn btn-primary" style={{ alignSelf: 'flex-start', display: 'flex', gap: '8px', alignItems: 'center' }}>
                            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            Değişiklikleri Kaydet
                        </button>
                    </form>
                </div>

                {/* Password Section */}
                <div style={{ backgroundColor: 'var(--surface)', padding: '30px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Lock size={20} color="var(--primary)" /> Şifre Değiştir
                    </h2>

                    <form onSubmit={handlePasswordUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Yeni Şifre</label>
                            <input
                                type="password"
                                required
                                value={passwords.newPassword}
                                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                placeholder="••••••••"
                                style={{ width: '100%', padding: '12px', backgroundColor: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text-main)', fontSize: '1rem' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Yeni Şifre (Tekrar)</label>
                            <input
                                type="password"
                                required
                                value={passwords.confirmPassword}
                                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                placeholder="••••••••"
                                style={{ width: '100%', padding: '12px', backgroundColor: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text-main)', fontSize: '1rem' }}
                            />
                        </div>
                        <button type="submit" disabled={isSaving} className="btn btn-outline" style={{ alignSelf: 'flex-start', display: 'flex', gap: '8px', alignItems: 'center' }}>
                            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
                            Şifreyi Güncelle
                        </button>
                    </form>
                </div>

                <div style={{ marginTop: '40px', textAlign: 'center' }}>
                    <Link href="/panel" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>← Panele Geri Dön</Link>
                </div>
            </div>
        </div>
    );
}
