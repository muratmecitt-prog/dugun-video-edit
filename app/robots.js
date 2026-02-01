export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/panel/', '/admin/'],
        },
        sitemap: 'https://www.dugunvideoedit.com/sitemap.xml',
    };
}
