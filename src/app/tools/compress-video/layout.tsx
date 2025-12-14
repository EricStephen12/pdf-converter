import { generateToolMetadata, generateToolStructuredData } from '@/lib/seo-config';

export const metadata = generateToolMetadata('compress-video');

export default function Layout({ children }: { children: React.ReactNode }) {
  const structuredData = generateToolStructuredData('compress-video');
  
  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      {children}
    </>
  );
}
