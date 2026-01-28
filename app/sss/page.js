import { ChevronDown } from 'lucide-react';

export default function FAQPage() {
    return (
        <div className="container section">
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '20px' }}>Sıkça Sorulan Sorular</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
                    Aklınıza takılan soruların cevaplarını burada bulabilirsiniz.
                </p>
            </div>

            <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                <AccordianItem
                    question="Kaç revize hakkım var?"
                    answer="Her siparişiniz için 1 tur kapsamlı revize hakkınız bulunmaktadır. Bu turda tüm notlarınızı iletmeniz durumunda gerekli düzenlemeler yapılır."
                />

                <AccordianItem
                    question="Müzik seçimini kim yapıyor?"
                    answer="Video kurgusunun en önemli parçası olan müzik seçimini, videonun ruhuna ve ritmine uygun olarak profesyonel editörlerimiz yapar. Telifsiz veya lisanslı stok müzik kütüphanelerimizden en uygun parça seçilir."
                />

                <AccordianItem
                    question="Çekim formatım standartlara uymuyorsa ne olur?"
                    answer="Yine de işleme alabiliriz. Ancak 1080p altı çözünürlüklerde veya 25fps çekimlerde (slow-motion yapılamayacağı için) kurgu dili değişebilir. En iyi sonuç için 'Çekim Standartları' sayfamızı incelemenizi öneririz."
                />

                <AccordianItem
                    question="Dosyaları nasıl gönderiyorum?"
                    answer="Görüntülerinizi WeTransfer, Google Drive, Dropbox gibi bulut servislerine yükleyip linki sipariş oluşturma formuna yapıştırmanız yeterlidir."
                />

                <AccordianItem
                    question="Teslim süresi uzar mı?"
                    answer="Mücbir sebepler (sağlık, teknik arıza vb.) olmadığı sürece paketlerde belirtilen süreler (7-21 gün) içerisinde teslimat yapılır."
                />

                <AccordianItem
                    question="Aynı anda birden fazla sipariş verebilir miyim?"
                    answer="Evet, paneliniz üzerinden dilediğiniz kadar sipariş oluşturabilirsiniz. Her biri ayrı proje olarak takip edilecektir."
                />

            </div>
        </div>
    );
}

function AccordianItem({ question, answer }) {
    return (
        <details style={{
            backgroundColor: 'var(--surface)',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            overflow: 'hidden'
        }}>
            <summary style={{
                padding: '24px',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                listStyle: 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                {question}
                <ChevronDown size={20} color="var(--primary)" />
            </summary>
            <div style={{ padding: '0 24px 24px 24px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {answer}
            </div>
        </details>
    );
}
