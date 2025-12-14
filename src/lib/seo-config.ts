import { Metadata } from 'next';

const baseUrl = 'https://fileforge.tools';

export const toolsSEO: Record<string, { title: string; description: string; keywords: string[] }> = {
  'merge-pdf': {
    title: 'Merge PDF Online Free - Combine Multiple PDFs into One | ConvertFlow',
    description: 'Merge PDF files online for free. Combine multiple PDF documents into one file instantly. No signup, no watermarks, 100% private - files never leave your browser.',
    keywords: ['merge pdf', 'combine pdf', 'join pdf files', 'merge pdf online free', 'pdf merger', 'combine pdf files', 'merge multiple pdfs'],
  },
  'split-pdf': {
    title: 'Split PDF Online Free - Extract Pages from PDF | ConvertFlow',
    description: 'Split PDF files online for free. Extract specific pages or split into multiple documents. No upload required - works entirely in your browser.',
    keywords: ['split pdf', 'extract pdf pages', 'separate pdf', 'split pdf online free', 'pdf splitter', 'extract pages from pdf'],
  },
  'compress-pdf': {
    title: 'Compress PDF Online Free - Reduce PDF File Size | ConvertFlow',
    description: 'Compress PDF files online for free. Reduce PDF size without losing quality. Perfect for email attachments. No signup, instant results.',
    keywords: ['compress pdf', 'reduce pdf size', 'pdf compressor', 'shrink pdf', 'compress pdf online free', 'make pdf smaller'],
  },
  'rotate-pdf': {
    title: 'Rotate PDF Online Free - Fix PDF Page Orientation | ConvertFlow',
    description: 'Rotate PDF pages online for free. Fix page orientation, rotate 90°, 180°, or 270°. No software needed - works in your browser.',
    keywords: ['rotate pdf', 'rotate pdf pages', 'pdf rotation', 'rotate pdf online free', 'turn pdf pages', 'flip pdf'],
  },
  'watermark-pdf': {
    title: 'Add Watermark to PDF Online Free | ConvertFlow',
    description: 'Add text watermarks to PDF files online for free. Protect your documents with custom watermarks. No signup required.',
    keywords: ['watermark pdf', 'add watermark to pdf', 'pdf watermark', 'stamp pdf', 'watermark pdf online free'],
  },
  'add-page-numbers': {
    title: 'Add Page Numbers to PDF Online Free | ConvertFlow',
    description: 'Add page numbers to PDF documents online for free. Customize position, format, and style. No software installation needed.',
    keywords: ['add page numbers to pdf', 'pdf page numbers', 'number pdf pages', 'page numbering pdf', 'pdf pagination'],
  },
  'protect-pdf': {
    title: 'Password Protect PDF Online Free - Encrypt PDF | ConvertFlow',
    description: 'Add password protection to PDF files online for free. Encrypt and secure your PDF documents. 100% private - processed locally.',
    keywords: ['protect pdf', 'password protect pdf', 'encrypt pdf', 'secure pdf', 'lock pdf', 'pdf password'],
  },
  'pdf-to-jpg': {
    title: 'PDF to JPG Converter Online Free - Convert PDF to Images | ConvertFlow',
    description: 'Convert PDF to JPG images online for free. High quality conversion, all pages extracted. No signup, no watermarks.',
    keywords: ['pdf to jpg', 'pdf to image', 'convert pdf to jpg', 'pdf to jpeg', 'pdf to jpg converter', 'extract images from pdf'],
  },
  'pdf-to-png': {
    title: 'PDF to PNG Converter Online Free - High Quality Export | ConvertFlow',
    description: 'Convert PDF to PNG images online for free. Lossless quality, transparent background support. Instant conversion in browser.',
    keywords: ['pdf to png', 'convert pdf to png', 'pdf to png converter', 'pdf to image png', 'export pdf as png'],
  },
  'jpg-to-pdf': {
    title: 'JPG to PDF Converter Online Free - Images to PDF | ConvertFlow',
    description: 'Convert JPG images to PDF online for free. Combine multiple images into one PDF. No signup, instant download.',
    keywords: ['jpg to pdf', 'image to pdf', 'convert jpg to pdf', 'jpeg to pdf', 'photo to pdf', 'pictures to pdf'],
  },
  'jpg-to-png': {
    title: 'JPG to PNG Converter Online Free - Add Transparency | ConvertFlow',
    description: 'Convert JPG to PNG online for free. Add transparency support to your images. Instant conversion, no quality loss.',
    keywords: ['jpg to png', 'convert jpg to png', 'jpeg to png', 'jpg to png converter', 'image converter'],
  },
  'png-to-jpg': {
    title: 'PNG to JPG Converter Online Free - Reduce File Size | ConvertFlow',
    description: 'Convert PNG to JPG online for free. Reduce file size while maintaining quality. Perfect for web optimization.',
    keywords: ['png to jpg', 'convert png to jpg', 'png to jpeg', 'png to jpg converter', 'image converter'],
  },
  'webp-convert': {
    title: 'WebP Converter Online Free - Convert to/from WebP | ConvertFlow',
    description: 'Convert images to WebP or WebP to JPG/PNG online for free. Modern format for faster websites. No signup required.',
    keywords: ['webp converter', 'convert to webp', 'webp to jpg', 'webp to png', 'jpg to webp', 'png to webp'],
  },
  'resize-image': {
    title: 'Resize Image Online Free - Change Image Dimensions | ConvertFlow',
    description: 'Resize images online for free. Change dimensions, maintain aspect ratio. Perfect for social media, web, and print.',
    keywords: ['resize image', 'image resizer', 'resize photo', 'change image size', 'resize image online free', 'photo resizer'],
  },
  'crop-image': {
    title: 'Crop Image Online Free - Trim Photos Instantly | ConvertFlow',
    description: 'Crop images online for free. Trim to exact dimensions or use preset ratios. No software needed, works in browser.',
    keywords: ['crop image', 'image cropper', 'crop photo', 'trim image', 'crop image online free', 'photo cropper'],
  },
  'compress-image': {
    title: 'Compress Image Online Free - Reduce Image File Size | ConvertFlow',
    description: 'Compress images online for free. Reduce file size up to 80% without visible quality loss. Perfect for web optimization.',
    keywords: ['compress image', 'image compressor', 'reduce image size', 'compress photo', 'optimize image', 'shrink image'],
  },
  'word-to-pdf': {
    title: 'Word to PDF Converter Online Free - DOC to PDF | ConvertFlow',
    description: 'Convert Word documents to PDF online for free. Support for DOC and DOCX files. No signup, instant conversion.',
    keywords: ['word to pdf', 'doc to pdf', 'docx to pdf', 'convert word to pdf', 'word to pdf converter', 'document to pdf'],
  },
  'excel-to-pdf': {
    title: 'Excel to PDF Converter Online Free - XLS to PDF | ConvertFlow',
    description: 'Convert Excel spreadsheets to PDF online for free. Support for XLS and XLSX files. Preserve formatting perfectly.',
    keywords: ['excel to pdf', 'xls to pdf', 'xlsx to pdf', 'convert excel to pdf', 'spreadsheet to pdf'],
  },
  'ppt-to-pdf': {
    title: 'PowerPoint to PDF Converter Online Free - PPT to PDF | ConvertFlow',
    description: 'Convert PowerPoint presentations to PDF online for free. Support for PPT and PPTX files. No signup required.',
    keywords: ['powerpoint to pdf', 'ppt to pdf', 'pptx to pdf', 'convert powerpoint to pdf', 'presentation to pdf'],
  },
  'video-converter': {
    title: 'Video Converter Online Free - MP4, WebM, AVI, MOV | ConvertFlow',
    description: 'Convert videos between formats online for free. Support for MP4, WebM, AVI, MOV. No upload - converts in your browser.',
    keywords: ['video converter', 'convert video', 'mp4 converter', 'video format converter', 'convert video online free'],
  },
  'compress-video': {
    title: 'Compress Video Online Free - Reduce Video File Size | ConvertFlow',
    description: 'Compress videos online for free. Reduce file size while maintaining quality. Perfect for sharing and uploading.',
    keywords: ['compress video', 'video compressor', 'reduce video size', 'shrink video', 'compress video online free'],
  },
  'extract-audio': {
    title: 'Extract Audio from Video Online Free - Video to MP3 | ConvertFlow',
    description: 'Extract audio from video files online for free. Get MP3, WAV, or M4A from any video. No software installation needed.',
    keywords: ['extract audio from video', 'video to audio', 'video to mp3', 'rip audio from video', 'extract sound from video'],
  },
  'audio-converter': {
    title: 'Audio Converter Online Free - MP3, WAV, M4A, OGG | ConvertFlow',
    description: 'Convert audio files between formats online for free. Support for MP3, WAV, M4A, OGG, FLAC. Instant conversion.',
    keywords: ['audio converter', 'convert audio', 'mp3 converter', 'wav converter', 'audio format converter'],
  },
  'compress-audio': {
    title: 'Compress Audio Online Free - Reduce Audio File Size | ConvertFlow',
    description: 'Compress audio files online for free. Reduce MP3 size by adjusting bitrate. Perfect for podcasts and music.',
    keywords: ['compress audio', 'audio compressor', 'reduce audio size', 'compress mp3', 'shrink audio file'],
  },
  'trim-audio': {
    title: 'Trim Audio Online Free - Cut MP3 and Audio Files | ConvertFlow',
    description: 'Trim and cut audio files online for free. Create ringtones, clips, and samples. No software needed.',
    keywords: ['trim audio', 'cut audio', 'audio trimmer', 'cut mp3', 'audio cutter', 'trim mp3 online free'],
  },
  'qr-generator': {
    title: 'QR Code Generator Online Free - Create Custom QR Codes | ConvertFlow',
    description: 'Generate QR codes online for free. Custom colors, sizes, and formats. Perfect for URLs, WiFi, contacts, and more.',
    keywords: ['qr code generator', 'create qr code', 'qr code maker', 'free qr code', 'generate qr code', 'custom qr code'],
  },
  'youtube-thumbnail': {
    title: 'YouTube Thumbnail Downloader - Get HD Thumbnails Free | ConvertFlow',
    description: 'Download YouTube video thumbnails in HD quality for free. Get max resolution images from any YouTube video instantly.',
    keywords: ['youtube thumbnail downloader', 'download youtube thumbnail', 'youtube thumbnail grabber', 'get youtube thumbnail', 'youtube image downloader'],
  },
  'social-media-resizer': {
    title: 'Social Media Image Resizer - Instagram, TikTok, YouTube | ConvertFlow',
    description: 'Resize images for social media platforms for free. Perfect sizes for Instagram, TikTok, YouTube, Twitter, Facebook, LinkedIn.',
    keywords: ['social media image resizer', 'instagram image size', 'tiktok image size', 'youtube thumbnail size', 'resize for social media'],
  },
  'hashtag-generator': {
    title: 'Hashtag Generator - Trending Hashtags for Instagram & TikTok | ConvertFlow',
    description: 'Generate trending hashtags for Instagram, TikTok, and Twitter for free. Boost your social media reach with relevant tags.',
    keywords: ['hashtag generator', 'instagram hashtags', 'tiktok hashtags', 'trending hashtags', 'hashtag finder', 'best hashtags'],
  },
  'favicon-generator': {
    title: 'Favicon Generator Online Free - Create All Sizes | ConvertFlow',
    description: 'Generate favicons in all sizes from a single image for free. Perfect for websites and web apps. Download all standard sizes.',
    keywords: ['favicon generator', 'create favicon', 'favicon maker', 'ico generator', 'website icon generator', 'favicon creator'],
  },
  'color-extractor': {
    title: 'Color Palette Extractor - Get Colors from Image | ConvertFlow',
    description: 'Extract color palettes from images for free. Get HEX and RGB values for your design projects. Export as CSS variables.',
    keywords: ['color extractor', 'extract colors from image', 'color palette generator', 'image color picker', 'get colors from photo'],
  },
};

export function generateToolMetadata(toolSlug: string): Metadata {
  const seo = toolsSEO[toolSlug];
  if (!seo) return {};

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords.join(', '),
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${baseUrl}/tools/${toolSlug}`,
      siteName: 'ConvertFlow',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
    },
    alternates: {
      canonical: `${baseUrl}/tools/${toolSlug}`,
    },
  };
}

export function generateToolStructuredData(toolSlug: string) {
  const seo = toolsSEO[toolSlug];
  if (!seo) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: seo.title.split(' | ')[0],
    description: seo.description,
    url: `${baseUrl}/tools/${toolSlug}`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    provider: {
      '@type': 'Organization',
      name: 'FileForge',
      url: baseUrl,
    },
  };
}
