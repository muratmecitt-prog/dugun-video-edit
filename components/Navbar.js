"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Video, Menu, X, User, LogOut, Settings, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from './AuthProvider';

export default function Navbar() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, signOut } = useAuth();

    const isActive = (path) => pathname === path;
    const closeMenu = () => setIsMenuOpen(false);

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
                <Link href="/" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.25rem', fontWeight: 'bold' }}>
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
                    <span>Düğün Video Edit</span>
                </Link>

                {/* Desktop Links */}
                <div className="desktop-nav" style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                    <div className="navbar-menu">
                        <NavLink href="/paketler" active={isActive('/paketler')}>Paketler</NavLink>
                        <NavLink href="/nasil-calisir" active={isActive('/nasil-calisir')}>Nasıl Çalışır?</NavLink>
                        <NavLink href="/sss" active={isActive('/sss')}>S.S.S.</NavLink>
                        <NavLink href="/iletisim" active={isActive('/iletisim')}>İletişim</NavLink>
                    </div>

                    <div className="navbar-auth" style={{ display: 'flex', gap: '15px', marginLeft: '20px' }}>
                        {user ? (
                            <>
                                {user?.email && (user.email === 'muratmecitt@gmail.com') && (
                                    <Link href="/admin" className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem', color: 'var(--primary)', borderColor: 'var(--primary)' }}>
                                        ADMIN
                                    </Link>
                                )}
                                <Link href="/panel" className="btn btn-primary" style={{ padding: '8px 20px', display: 'flex', gap: '8px' }}>
                                    <User size={18} />
                                    Panelim
                                </Link>
                                <Link href="/panel/ayarlar" className="btn btn-outline" style={{ padding: '8px' }} title="Ayarlar">
                                    <Settings size={18} />
                                </Link>
                                <button onClick={signOut} className="btn btn-outline" style={{ padding: '8px' }} title="Çıkış Yap">
                                    <LogOut size={18} />
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/giris" className="btn btn-outline" style={{ padding: '8px 20px' }}>
                                    Giriş Yap
                                </Link>
                                <Link href="/kayit" className="btn btn-primary" style={{ padding: '8px 20px' }}>
                                    Kayıt Ol
                                </Link>
                            </>
                        )}
                    </div>

                    {/* WhatsApp Button */}
                    <a
                        href="https://wa.me/905320000000" // Placeholder number
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline"
                        style={{
                            padding: '8px 16px',
                            fontSize: '0.85rem',
                            gap: '8px',
                            borderColor: '#25D366',
                            color: '#25D366',
                            backgroundColor: 'rgba(37, 211, 102, 0.05)'
                        }}
                    >
                        <MessageCircle size={18} />
                        WhatsApp
                    </a>
                </div>

                {/* Mobile Hamburger */}
                <button
                    className="mobile-nav-toggle"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-main)' }}
                >
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
                    <NavLinkMobile href="/paketler" onClick={closeMenu}>Paketler</NavLinkMobile>
                    <NavLinkMobile href="/nasil-calisir" onClick={closeMenu}>Nasıl Çalışır?</NavLinkMobile>
                    <NavLinkMobile href="/sss" onClick={closeMenu}>S.S.S</NavLinkMobile>
                    <hr style={{ borderColor: 'var(--border)', width: '100%' }} />

                    {user ? (
                        <>
                            <Link href="/panel" onClick={closeMenu} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                <User size={18} style={{ marginRight: '8px' }} /> Panelim
                            </Link>
                            <button onClick={() => { signOut(); closeMenu(); }} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                                <LogOut size={18} style={{ marginRight: '8px' }} /> Çıkış Yap
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/giris" onClick={closeMenu} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                                Giriş Yap
                            </Link>
                            <Link href="/kayit" onClick={closeMenu} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                Kayıt Ol
                            </Link>
                        </>
                    )}

                    <a
                        href="https://wa.me/905320000000"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline"
                        style={{ width: '100%', justifyContent: 'center', borderColor: '#25D366', color: '#25D366' }}
                    >
                        <MessageCircle size={18} style={{ marginRight: '8px' }} /> WhatsApp Destek
                    </a>
                </div>
            )}
        </nav>
    );
}

function NavLink({ href, children, active }) {
    return (
        <Link href={href} className="nav-link" style={{
            color: active ? 'var(--primary)' : undefined,
            fontWeight: active ? '600' : undefined
        }}>
            {children}
        </Link>
    );
}

function NavLinkMobile({ href, children, onClick }) {
    return (
        <Link href={href} onClick={onClick} style={{
            fontSize: '1.2rem',
            padding: '10px 0',
            color: 'var(--text-main)',
            borderBottom: '1px solid var(--border)',
            width: '100%'
        }}>
            {children}
        </Link>
    );
}
