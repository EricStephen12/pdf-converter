import { generateToolMetadata, generateToolStructuredData } from '@/lib/seo-config';

export const metadata = generateToolMetadata('youtube-thumbnail');

export default function Layout({ children }: { children: React.ReactNode }) {
  const structuredData = generateToolStructuredData('youtube-thumbnail');
  
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
