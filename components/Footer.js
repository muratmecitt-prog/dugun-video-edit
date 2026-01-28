import Link from 'next/link';

export default function Footer() {
    return (
        <footer style={{ borderTop: '1px solid var(--border)', padding: '60px 0', marginTop: 'auto', backgroundColor: 'var(--surface)' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '15px' }}>Düğün Video Edit</h3>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '300px', lineHeight: '1.6' }}>
                        Profesyonel videographerlar için güvenilir, hızlı ve standart kalitede kurgu çözüm ortağı.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '60px' }}>
                    <FooterSection title="Hizmetler">
                        <Link href="/paketler">Paketler</Link>
                        <Link href="/nasil-calisir">Nasıl Çalışır?</Link>
                        <Link href="/cekim-standartlari">Standartlar</Link>
                    </FooterSection>

                    <FooterSection title="Destek">
                        <Link href="/revize-politikasi">Revize Politikası</Link>
                        <Link href="/sss">S.S.S</Link>
                        <Link href="/iletisim">İletişim</Link>
                    </FooterSection>
                </div>
            </div>
            <div className="container" style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--border-light)', textAlign: 'center', color: 'var(--text-muted)' }}>
                &copy; {new Date().getFullYear()} Düğün Video Edit. Tüm hakları saklıdır.
            </div>
        </footer>
    );
}

function FooterSection({ title, children }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4 style={{ color: 'var(--text-main)', marginBottom: '5px' }}>{title}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--text-secondary)' }}>
                {children}
            </div>
        </div>
    );
}
