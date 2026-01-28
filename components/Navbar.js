"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Video } from 'lucide-react';

export default function Navbar() {
    const pathname = usePathname();

    const isActive = (path) => pathname === path;

    return (
        <nav style={{
            borderBottom: '1px solid var(--border)',
            height: 'var(--header-height)',
            display: 'flex',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            backgroundColor: 'var(--background)',
            zIndex: 100
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                {/* Logo */}
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.25rem', fontWeight: 'bold' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: 'var(--primary)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'black'
                    }}>
                        <Video size={24} />
                    </div>
                    Düğün Video Edit
                </Link>

                {/* Links */}
                <div style={{ display: 'flex', gap: '30px' }}>
                    <NavLink href="/paketler" active={isActive('/paketler')}>Paketler</NavLink>
                    <NavLink href="/nasil-calisir" active={isActive('/nasil-calisir')}>Nasıl Çalışır?</NavLink>
                    <NavLink href="/cekim-standartlari" active={isActive('/cekim-standartlari')}>Standartlar</NavLink>
                    <NavLink href="/sss" active={isActive('/sss')}>S.S.S</NavLink>
                </div>

                {/* Auth Buttons */}
                <div style={{ display: 'flex', gap: '15px' }}>
                    <Link href="/giris" className="btn btn-outline" style={{ padding: '8px 20px' }}>
                        Giriş Yap
                    </Link>
                    <Link href="/kayit" className="btn btn-primary" style={{ padding: '8px 20px' }}>
                        Kayıt Ol
                    </Link>
                </div>

            </div>
        </nav>
    );
}

function NavLink({ href, children, active }) {
    return (
        <Link href={href} style={{
            color: active ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: active ? '500' : '400',
            transition: 'color 0.2s'
        }}>
            {children}
        </Link>
    );
}
