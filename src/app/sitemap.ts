import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://convertflow.com';
  
  const tools = [
    // PDF Tools
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
    // Image Tools
    'jpg-to-png',
    'png-to-jpg',
    'webp-convert',
    'resize-image',
    'crop-image',
    'compress-image',
    // Document Tools
    'word-to-pdf',
    'excel-to-pdf',
    'ppt-to-pdf',
    // Video Tools
    'video-converter',
    'compress-video',
    'extract-audio',
    // Audio Tools
    'audio-converter',
    'compress-audio',
    'trim-audio',
    // Utility Tools
    'qr-generator',
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
