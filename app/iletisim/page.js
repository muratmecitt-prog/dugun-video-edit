"use client";
import { useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { sendNotificationEmail, templates } from '@/lib/emailService';

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.target);

        await sendNotificationEmail(templates.CONTACT_FORM, {
            full_name: formData.get('full_name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            to_email: 'dugunvideoedit@gmail.com' // Passing intent, though template config decides final delivery
        });

        alert('Mesajınız başarıyla gönderildi! En kısa sürede dönüş yapacağız.');
        setIsSubmitting(false);
        e.target.reset();
    };

    return (
        <div className="container section">
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '20px' }}>İletişim</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
                    Sorularınız, iş birlikleri veya özel projeleriniz için bize ulaşın.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px', alignItems: 'start' }}>

                {/* Contact Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <div style={{ padding: '30px', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                            <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(202,138,4,0.1)', color: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Mail size={20} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>E-posta</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Bize direkt mail atabilirsiniz.</p>
                            </div>
                        </div>
                        <a href="mailto:info@dugunvideoedit.com" style={{ fontSize: '1.2rem', fontWeight: '500', color: 'var(--text-main)', textDecoration: 'none' }}>
                            info@dugunvideoedit.com
                        </a>
                    </div>
                </div>

                {/* Contact Form */}
                <div style={{ backgroundColor: 'var(--surface)', padding: '40px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px' }}>Bize Yazın</h2>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        <div>
                            <label className="form-label">Adınız Soyadınız</label>
                            <input
                                required
                                type="text"
                                placeholder="Ad Soyad"
                                className="form-input"
                                name="full_name"
                            />
                        </div>

                        <div>
                            <label className="form-label">E-posta Adresiniz</label>
                            <input
                                required
                                type="email"
                                placeholder="ornek@email.com"
                                className="form-input"
                                name="email"
                            />
                        </div>

                        <div>
                            <label className="form-label">Konu</label>
                            <select className="form-input" name="subject">
                                <option>Genel Bilgi</option>
                                <option>Sipariş / Paketler Hakkında</option>
                                <option>Teknik Destek</option>
                                <option>İş Birliği</option>
                            </select>
                        </div>

                        <div>
                            <label className="form-label">Mesajınız</label>
                            <textarea
                                required
                                rows="5"
                                placeholder="Mesajınızı buraya yazabilirsiniz..."
                                className="form-input"
                                name="message"
                            />
                        </div>

                        <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                            {isSubmitting ? 'Gönderiliyor...' : 'Mesajı Gönder'}
                        </button>

                    </form>
                </div>

            </div>

            <style jsx>{`
        .form-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: var(--text-main);
          font-size: 0.95rem;
        }
        .form-input {
          width: 100%;
          padding: 12px;
          background-color: var(--background);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          color: var(--text-main);
          font-family: inherit;
          font-size: 1rem;
        }
        .form-input:focus {
          outline: 2px solid var(--primary);
          border-color: transparent;
        }
      `}</style>
        </div>
    );
}
