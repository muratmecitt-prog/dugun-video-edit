export default function RevisionPolicyPage() {
    return (
        <div className="container section">
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '20px' }}>Revize Politikası</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
                    Süreçlerimizin hızlı ve sorunsuz ilerlemesi için şeffaf bir revize politikası uyguluyoruz.
                </p>
            </div>

            <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>

                <PolicyItem
                    title="Revize Hakkı"
                    content="Her sipariş paketi için standart olarak 1 tur geniş kapsamlı revize hakkınız bulunmaktadır. Bu turda ilettiğiniz tüm değişiklik talepleri tek seferde işleme alınır."
                />

                <PolicyItem
                    title="Görüntü Değişimi"
                    content="Revize kapsamında beğenilmeyen sahneler çıkarılabilir. Yerine, ham görüntüler içerisinden (varsa) öncesi/sonrası veya benzeri alternatif bir sahne eklenir."
                />

                <PolicyItem
                    title="Müzik Değişimi"
                    content="Videonun ritmi ve sinematik yapısı seçilen müziğe göre kurgulanır. Eğer müzik değişimi talep edilirse, mevcut kurgu ritmi korunarak sadece parçanın değiştirilmesi sağlanır. Komple yeniden kurgu (re-edit) yapılmaz."
                />

                <PolicyItem
                    title="Ekstra Revizeler"
                    content="1 tur revize hakkı tamamlandıktan sonra gelecek ekstra değişiklik talepleri, işin kapsamına göre ek ücretlendirmeye tabi olabilir."
                />

            </div>
        </div>
    );
}

function PolicyItem({ title, content }) {
    return (
        <div style={{ padding: '32px', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius)', borderLeft: '4px solid var(--primary)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px' }}>{title}</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '1.1rem' }}>{content}</p>
        </div>
    );
}
