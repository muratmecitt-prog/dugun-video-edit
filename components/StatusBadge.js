export default function StatusBadge({ status }) {
    const styles = {
        'Ödeme Bekleniyor': { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }, // Red (Attention)
        'Kurguda': { bg: 'rgba(234, 179, 8, 0.1)', color: '#eab308' }, // Yellow
        'Revize Ediliyor': { bg: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }, // Purple
        'Tamamlandı': { bg: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }, // Green
        'Beklemede': { bg: 'rgba(255,255,255,0.1)', color: '#d4d4d4' },
    };

    const currentStyle = styles[status] || styles['Beklemede'];

    return (
        <span style={{
            backgroundColor: currentStyle.bg,
            color: currentStyle.color,
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '0.85rem',
            fontWeight: '500',
            display: 'inline-block'
        }}>
            {status}
        </span>
    );
}
