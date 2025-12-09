import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://convertflow.com';
  
  const tools = [
    'merge-pdf',
    'split-pdf', 
    'compress-pdf',
    'rotate-pdf',
    'watermark-pdf',
    'add-page-numbers',
    'protect-pdf',
    'pdf-to-jpg',
    'pdf-to-png',
    'jpg-to-pdf',
    'jpg-to-png',
    'png-to-jpg',
    'webp-convert',
    'resize-image',
    'crop-image',
    'compress-image',
  ];

  const toolPages = tools.map((tool) => ({
    url: `${baseUrl}/tools/${tool}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...toolPages,
  ];
}
