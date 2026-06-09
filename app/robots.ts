import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/portal/dashboard', '/api/'],
      },
    ],
    sitemap: 'https://www.sugbolts-nuts.com/sitemap.xml',
    host: 'https://www.sugbolts-nuts.com',
  };
}
