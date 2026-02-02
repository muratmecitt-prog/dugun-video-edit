import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/Providers';
import GoogleAnalytics from '@/components/GoogleAnalytics';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  metadataBase: new URL('https://www.dugunvideoedit.com'),
  title: {
    default: 'Düğün Video Edit | Profesyonel Kurgu Hizmeti',
    template: '%s | Düğün Video Edit'
  },
  description: 'Düğün hikayeniz, profesyonel ellere emanet. Düğün klipleri, belgeseller ve sosyal medya teaserları için hızlı, güvenilir ve yaratıcı video kurgu hizmeti.',
  keywords: ['düğün videosu', 'video edit', 'düğün klibi', 'düğün belgeseli', 'kurgu hizmeti', 'video montaj', 'freelance video editör'],
  authors: [{ name: 'Düğün Video Edit Ekibi' }],
  creator: 'Düğün Video Edit',
  publisher: 'Düğün Video Edit',
  openGraph: {
    title: 'Düğün Video Edit | Profesyonel Kurgu Hizmeti',
    description: 'En özel anlarınızı sinematik bir hikayeye dönüştürüyoruz. Hemen fiyatları inceleyin.',
    url: 'https://www.dugunvideoedit.com',
    siteName: 'Düğün Video Edit',
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Düğün Video Edit',
    description: 'Düğün videolarınız için profesyonel kurgu çözümleri.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  }
};

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    'name': 'Düğün Video Edit',
    'image': 'https://www.dugunvideoedit.com/og-image.jpg',
    'description': 'Düğün videoları için profesyonel kurgu ve montaj hizmeti.',
    'url': 'https://www.dugunvideoedit.com',
    'priceRange': '₺₺',
    'address': {
      '@type': 'PostalAddress',
      'addressCountry': 'TR'
    },
    'offers': {
      '@type': 'Offer',
      'price': '2000',
      'priceCurrency': 'TRY'
    }
  };

  return (
    <html lang="tr">
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <GoogleAnalytics GA_MEASUREMENT_ID="G-M4LYZRLM1Q" />
        <Providers>
          <Navbar />
          <main style={{ flex: 1 }}>
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
