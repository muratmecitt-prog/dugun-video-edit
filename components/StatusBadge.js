export default function StatusBadge({ status }) {
    const styles = {
        'Bekleniyor': { bg: 'rgba(255,255,255,0.1)', color: '#d4d4d4' },
        'Dosya İndirildi': { bg: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }, // Sky Blue
        'Kurguda': { bg: 'rgba(234, 179, 8, 0.1)', color: '#eab308' }, // Yellow
        'Teslime Hazır': { bg: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }, // Purple
        'Tamamlandı': { bg: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }, // Green
    };

    const currentStyle = styles[status] || styles['Bekleniyor'];

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
