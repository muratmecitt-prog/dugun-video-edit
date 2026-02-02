"use client";
import { useState, useEffect } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function FAQPage() {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const { data, error } = await supabase
                    .from('faqs')
                    .select('*')
                    .eq('is_active', true)
                    .order('display_order', { ascending: true });

                if (error) throw error;
                setFaqs(data || []);
            } catch (err) {
                console.error('Error fetching FAQs:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFaqs();
    }, []);

    return (
        <div className="container section">
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '20px' }}>Sıkça Sorulan Sorular</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
                    Aklınıza takılan soruların cevaplarını burada bulabilirsiniz.
                </p>
            </div>

            <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                        <Loader2 className="animate-spin" size={32} />
                    </div>
                ) : (
                    <>
                        {faqs.map(faq => (
                            <AccordianItem
                                key={faq.id}
                                question={faq.question}
                                answer={faq.answer}
                            />
                        ))}
                    </>
                )}
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
