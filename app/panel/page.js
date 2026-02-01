"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';
import { Plus, Search, Download, Loader2, Edit3, X, Image as ImageIcon, Link as LinkIcon, Info, AlertCircle } from 'lucide-react';
import BankDetails from '@/components/BankDetails';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/Toast';
import { sendNotificationEmail, templates } from '@/lib/emailService';

export default function UserDashboard() {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Hepsi');
    const [revisionOrder, setRevisionOrder] = useState(null);
    const [revisionItems, setRevisionItems] = useState([]); // [{ type: 'image' | 'link', text: '', value: '', file: null, preview: '' }]
    const [isRevising, setIsRevising] = useState(false);
    const [uploading, setUploading] = useState(false);

    const fetchOrders = async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (err) {
            console.error('Error fetching orders:', err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [user]);

    useEffect(() => {
        if (revisionOrder) {
            // Load existing items if any, otherwise start with a default one
            setRevisionItems(revisionOrder.revision_items || []);
        } else {
            setRevisionItems([]);
        }
    }, [revisionOrder]);

    const addRevisionItem = (type) => {
        setRevisionItems([...revisionItems, { type, text: '', value: '', file: null, preview: '' }]);
    };

    const removeRevisionItem = (index) => {
        setRevisionItems(revisionItems.filter((_, i) => i !== index));
    };

    const updateItemFile = (index, file) => {
        const newItems = [...revisionItems];
        newItems[index].file = file;
        if (file) {
            newItems[index].preview = URL.createObjectURL(file);
        } else {
            newItems[index].preview = ''; // Clear preview if file is removed
        }
        setRevisionItems(newItems);
    };

    const updateItemData = (index, field, value) => {
        const newItems = [...revisionItems];
        newItems[index][field] = value;
        setRevisionItems(newItems);
    };

    const handleRevisionSubmit = async (e) => {
        e.preventDefault();
        if (revisionItems.length === 0) {
            showToast('Lütfen en az bir revize maddesi ekleyin.', 'error');
            return;
        }

        setIsRevising(true);
        try {
            const processedItems = [];
            setUploading(true);

            for (let i = 0; i < revisionItems.length; i++) {
                const item = revisionItems[i];
                let finalValue = item.value;

                // Handle image upload if it's a new file
                if (item.type === 'image' && item.file) {
                    if (item.file.size > 2 * 1024 * 1024) {
                        showToast(`${item.file.name} boyutu 2MB'den büyük olduğu için atlandı.`, 'error');
                        setUploading(false);
                        setIsRevising(false);
                        return; // Stop submission if a file is too large
                    }
                    const fileExt = item.file.name.split('.').pop();
                    const fileName = `${revisionOrder.id}_item_${i}_${Math.random()}.${fileExt}`;
                    const { error: uploadError } = await supabase.storage
                        .from('revisions')
                        .upload(fileName, item.file);

                    if (uploadError) throw uploadError;

                    // Resilience: Use permanent direct public URL instead of edge-cached getPublicUrl
                    // Format: https://[project].supabase.co/storage/v1/object/public/revisions/[fileName]
                    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
                    finalValue = `${supabaseUrl}/storage/v1/object/public/revisions/${fileName}`;
                } else if (item.type === 'image' && item.value && !item.file) {
                    // If it's an image item and has an existing value but no new file, keep the existing value
                    finalValue = item.value;
                } else if (item.type === 'link' && !item.value) {
                    // If it's a link item and has no value, skip it or handle as empty
                    finalValue = '';
                }

                processedItems.push({
                    type: item.type,
                    text: item.text,
                    value: finalValue
                });
            }

            const { error: updateError } = await supabase
                .from('orders')
                .update({
                    revision_items: processedItems,
                    status: 'Revize Ediliyor',
                    updated_at: new Date().toISOString()
                })
                .eq('id', revisionOrder.id);

            if (updateError) throw updateError;

            // Send notification to admin about the revision
            sendNotificationEmail(templates.ADMIN_NEW_ORDER, {
                order_id: revisionOrder.id,
                studio_name: revisionOrder.studio_name,
                couple_name: revisionOrder.couple_name,
                package: 'REVİZE TALEBİ',
                wt_link: 'Panelden kontrol ediniz.',
                customer_email: user.email
            });

            showToast('Revize talebiniz başarıyla iletildi.', 'success');
            setRevisionOrder(null);
            fetchOrders();
        } catch (err) {
            console.error('Revision error:', err.message);

            if (err.message.includes('Bucket not found')) {
                showToast('Hata: Supabase Storage üzerinde "revisions" kutusu bulunamadı. Lütfen admin paneline girerek Storage kısmından "revisions" adında bir kutu oluşturun ve Public yapın.', 'error');
            } else {
                showToast('Hata: ' + err.message, 'error');
            }
        } finally {
            setIsRevising(false);
            setUploading(false);
        }
    };

    // Calculate counts for tabs
    const counts = {
        'Hepsi': orders.length,
        'Ödeme Bekleniyor': orders.filter(o => o.status === 'Ödeme Bekleniyor').length,
        'Kurguda': orders.filter(o => o.status === 'Kurguda').length,
        'Revize Ediliyor': orders.filter(o => o.status === 'Revize Ediliyor').length,
        'Tamamlandı': orders.filter(o => o.status === 'Tamamlandı').length,
    };

    const searchFiltered = orders.filter(order =>
        (order.couple_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.shoot_date || '').includes(searchTerm) ||
        (order.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.studio_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const finalOrders = activeTab === 'Hepsi'
        ? searchFiltered
        : searchFiltered.filter(o => o.status === activeTab);

    const getRevisionRemainingDays = (completedAt) => {
        if (!completedAt) return 7; // New default
        const completedDate = new Date(completedAt);
        const now = new Date();
        const diffTime = (completedDate.getTime() + 7 * 24 * 60 * 60 * 1000) - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    return (
        <div className="container section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Siparişlerim</h1>
                <Link href="/panel/yeni-siparis" className="btn btn-primary" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Plus size={20} />
                    Yeni Sipariş
                </Link>
            </div>

            {/* Search Bar */}
            <div style={{ marginBottom: '20px', position: 'relative', maxWidth: '400px' }}>
                <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input
                    type="text"
                    placeholder="Çift ismi, tarih veya sipariş no ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '12px 12px 12px 44px',
                        borderRadius: 'var(--radius)',
                        border: '1px solid var(--border)',
                        backgroundColor: 'var(--surface)',
                        color: 'var(--text-main)',
                        fontSize: '1rem'
                    }}
                />
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', overflowX: 'auto', paddingBottom: '5px' }}>
                {Object.keys(counts).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '30px',
                            border: '1px solid var(--border)',
                            backgroundColor: activeTab === tab ? 'var(--primary)' : 'var(--surface)',
                            color: activeTab === tab ? 'white' : 'var(--text-main)',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s',
                            boxShadow: activeTab === tab ? '0 4px 12px rgba(var(--primary-rgb), 0.3)' : 'none'
                        }}
                    >
                        {tab}
                        <span style={{
                            backgroundColor: activeTab === tab ? 'rgba(255,255,255,0.2)' : 'var(--background)',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            fontSize: '0.75rem'
                        }}>
                            {counts[tab]}
                        </span>
                    </button>
                ))}
            </div>

            <div style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                            <th style={{ padding: '16px' }}>Sipariş No</th>
                            <th style={{ padding: '16px' }}>Stüdyo / Çift</th>
                            <th style={{ padding: '16px' }}>Paket</th>
                            <th style={{ padding: '16px' }}>Çekim Tarihi</th>
                            <th style={{ padding: '16px' }}>Durum</th>
                            <th style={{ padding: '16px' }}>Teslimat</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="6" style={{ padding: '40px', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                                        <Loader2 className="animate-spin" size={20} />
                                        Yükleniyor...
                                    </div>
                                </td>
                            </tr>
                        ) : finalOrders.length > 0 ? (
                            finalOrders.map((order) => (
                                <tr key={order.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '16px', fontWeight: 'bold', color: 'var(--primary)' }}>{order.id}</td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ fontWeight: '500' }}>{order.studio_name}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{order.couple_name}</div>
                                    </td>
                                    <td style={{ padding: '16px', fontSize: '0.9rem' }}>{order.package}</td>
                                    <td style={{ padding: '16px', color: 'var(--text-main)' }}>{new Date(order.shoot_date).toLocaleDateString('tr-TR')}</td>
                                    <td style={{ padding: '16px' }}><StatusBadge status={order.status} /></td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            {order.status === 'Tamamlandı' && (
                                                <>
                                                    {order.download_link && (
                                                        <a
                                                            href={order.download_link}
                                                            target="_blank"
                                                            className="btn btn-outline"
                                                            style={{
                                                                padding: '8px 16px',
                                                                fontSize: '0.9rem',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '8px',
                                                                borderColor: 'var(--primary)',
                                                                color: 'var(--primary)',
                                                                textDecoration: 'none'
                                                            }}
                                                        >
                                                            <Download size={16} />
                                                            İndir
                                                        </a>
                                                    )}
                                                    <button
                                                        onClick={() => {
                                                            const daysLeft = getRevisionRemainingDays(order.completed_at);
                                                            if (daysLeft > 0) {
                                                                setRevisionOrder(order);
                                                            } else {
                                                                showToast('Sipariş tamamlanma üzerinden 7 gün geçtiği için revize süresi dolmuştur.', 'error');
                                                            }
                                                        }}
                                                        disabled={getRevisionRemainingDays(order.completed_at) <= 0}
                                                        className="btn btn-outline"
                                                        style={{
                                                            padding: '8px 16px',
                                                            fontSize: '0.9rem',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '8px',
                                                            borderColor: getRevisionRemainingDays(order.completed_at) > 0 ? '#a855f7' : 'var(--border)',
                                                            color: getRevisionRemainingDays(order.completed_at) > 0 ? '#a855f7' : 'var(--text-muted)',
                                                            opacity: getRevisionRemainingDays(order.completed_at) > 0 ? 1 : 0.6
                                                        }}
                                                    >
                                                        <Edit3 size={16} />
                                                        {getRevisionRemainingDays(order.completed_at) > 0
                                                            ? `Revize İste (${getRevisionRemainingDays(order.completed_at)} Gün)`
                                                            : 'Süre Doldu'}
                                                    </button>
                                                </>
                                            )}
                                            {order.status !== 'Tamamlandı' && (
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>-</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    Henüz hiç siparişiniz bulunmuyor.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Quick Access to Bank Details */}
            <div style={{ marginTop: '60px', maxWidth: '600px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px' }}>Ödeme İşlemleri</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '10px' }}>
                    Henüz ödemesi yapılmamış siparişleriniz için aşağıdaki hesap bilgilerini kullanabilirsiniz.
                </p>
                <p style={{ color: 'var(--primary)', fontWeight: '500', marginBottom: '20px', fontSize: '0.95rem' }}>
                    ⚠️ Not: Ödemeniz hesaplarımıza ulaştıktan sonra kurgu süreci başlar. Lütfen açıklama kısmına <strong>Sipariş Numarasını</strong> yazmayı unutmayınız.
                </p>
                <BankDetails />
            </div>

            {/* Revision Modal */}
            {revisionOrder && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ backgroundColor: 'var(--surface)', width: '100%', maxWidth: '600px', maxHeight: '90vh', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontWeight: 'bold' }}>Revize Talebi Oluştur - #{revisionOrder.id}</h3>
                            <button onClick={() => setRevisionOrder(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
                            {/* Policy Reminder */}
                            <div style={{ backgroundColor: 'rgba(var(--primary-rgb), 0.05)', border: '1px solid rgba(var(--primary-rgb), 0.2)', borderRadius: 'var(--radius)', padding: '15px', marginBottom: '25px', display: 'flex', gap: '12px' }}>
                                <Info size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                                <div style={{ fontSize: '0.85rem', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                                    <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>Revize Politikamız:</strong>
                                    • Görüntülerde sadece saniyeler arası değişim veya çıkar-ekle yapılabilir (Max 5 adet).<br />
                                    • Müzik değişimi kurgu aynı kalacak şekilde yapılır, sadece seçtiğiniz yeni müzik eklenir.
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
                                <button
                                    type="button"
                                    disabled={revisionItems.filter(i => i.type === 'image').length >= 5}
                                    onClick={() => addRevisionItem('image')}
                                    className="btn btn-outline"
                                    style={{
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '4px',
                                        borderColor: 'var(--primary)',
                                        color: 'var(--primary)',
                                        opacity: revisionItems.filter(i => i.type === 'image').length >= 5 ? 0.5 : 1,
                                        padding: '12px'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <ImageIcon size={18} /> Görüntü Revizesi
                                    </div>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 'bold', opacity: 0.8 }}>
                                        ({5 - revisionItems.filter(i => i.type === 'image').length} Hak Kaldı)
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    disabled={revisionItems.filter(i => i.type === 'link').length >= 1}
                                    onClick={() => addRevisionItem('link')}
                                    className="btn btn-outline"
                                    style={{
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '4px',
                                        borderColor: '#a855f7',
                                        color: '#a855f7',
                                        opacity: revisionItems.filter(i => i.type === 'link').length >= 1 ? 0.5 : 1,
                                        padding: '12px'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <LinkIcon size={18} /> Müzik/Link Revizesi
                                    </div>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 'bold', opacity: 0.8 }}>
                                        ({1 - revisionItems.filter(i => i.type === 'link').length} Hak Kaldı)
                                    </span>
                                </button>
                            </div>

                            {revisionItems.filter(i => i.type === 'image').length >= 5 && (
                                <div style={{ color: '#ef4444', fontSize: '0.75rem', textAlign: 'center', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                                    <AlertCircle size={14} /> Görüntü revize limitine ulaştınız.
                                </div>
                            )}

                            {revisionItems.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', border: '2px dashed var(--border)', borderRadius: 'var(--radius)' }}>
                                    Henüz madde eklenmedi. Yukarıdaki butonlarla başlayın.
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    {revisionItems.map((item, index) => (
                                        <div key={index} style={{ backgroundColor: 'var(--background)', padding: '20px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', position: 'relative' }}>
                                            <button
                                                onClick={() => removeRevisionItem(index)}
                                                style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                                            >
                                                <X size={18} />
                                            </button>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                                                {item.type === 'image' ? <ImageIcon size={16} color="var(--primary)" /> : <LinkIcon size={16} color="#a855f7" />}
                                                <span style={{ fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                                                    {item.type === 'image' ? 'Görüntü Revizesi' : 'Müzik/Link Revizesi'}
                                                </span>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                                {item.type === 'image' ? (
                                                    <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                                                        <div style={{ flex: 1 }}>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => updateItemFile(index, e.target.files[0])}
                                                                style={{ fontSize: '0.8rem' }}
                                                            />
                                                            {item.value && !item.file && (
                                                                <div style={{ marginTop: '5px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Mevcut görsel sistemde.</div>
                                                            )}
                                                        </div>
                                                        {item.preview && (
                                                            <img src={item.preview} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border)' }} />
                                                        )}
                                                        {item.value && !item.preview && !item.file && (
                                                            <img src={item.value} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border)' }} />
                                                        )}
                                                    </div>
                                                ) : (
                                                    <input
                                                        type="url"
                                                        placeholder="YouTube veya Bulut Linki"
                                                        value={item.value}
                                                        onChange={(e) => updateItemData(index, 'value', e.target.value)}
                                                        style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-main)', fontSize: '0.9rem' }}
                                                    />
                                                )}

                                                <textarea
                                                    placeholder="Detaylı notunuzu buraya yazın..."
                                                    value={item.text}
                                                    onChange={(e) => updateItemData(index, 'text', e.target.value)}
                                                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-main)', fontSize: '0.9rem', minHeight: '80px', fontFamily: 'inherit' }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div style={{ padding: '20px', borderTop: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
                            <button
                                onClick={handleRevisionSubmit}
                                disabled={isRevising || revisionItems.length === 0}
                                className="btn btn-primary"
                                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                            >
                                {isRevising ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        {uploading ? 'Dosyalar Yükleniyor...' : 'Gönderiliyor...'}
                                    </>
                                ) : 'Tüm Revizeleri Gönder'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .container { max-width: 1200px; margin: 0 auto; }
            `}</style>
        </div>
    );
}
