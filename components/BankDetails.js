import { Copy, CreditCard } from 'lucide-react';

export default function BankDetails() {
    const bankInfo = {
        bankName: "Enpara Bankası",
        accountName: "Düğün Video Edit Ltd. Şti.",
        iban: "TR04 0015 7000 0000 0077 8096 63"
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('IBAN kopyalandı!');
    };

    return (
        <div style={{
            backgroundColor: 'rgba(234, 179, 8, 0.1)', // Gold tint
            border: '1px solid var(--primary)',
            borderRadius: 'var(--radius)',
            padding: '24px',
            marginTop: '20px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <CreditCard color="var(--primary)" size={24} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>Banka / Ödeme Bilgileri</h3>
            </div>

            <div style={{ display: 'grid', gap: '12px', color: 'var(--text-main)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Banka:</span>
                    <span style={{ fontWeight: '500' }}>{bankInfo.bankName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Alıcı:</span>
                    <span style={{ fontWeight: '500' }}>{bankInfo.accountName}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>IBAN:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', fontFamily: 'monospace' }}>{bankInfo.iban}</span>
                        <button
                            onClick={() => copyToClipboard(bankInfo.iban)}
                            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}
                            title="Kopyala"
                        >
                            <Copy size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <p style={{ marginTop: '16px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                * Ödeme yaparken açıklama kısmına lütfen <strong style={{ color: 'var(--text-main)' }}>Sipariş Numaranızı</strong> (Örn: #ORD-001) yazınız.
            </p>
        </div>
    );
}
