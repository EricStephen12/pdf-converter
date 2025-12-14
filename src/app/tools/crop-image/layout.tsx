import { generateToolMetadata, generateToolStructuredData } from '@/lib/seo-config';

export const metadata = generateToolMetadata('crop-image');

export default function Layout({ children }: { children: React.ReactNode }) {
  const structuredData = generateToolStructuredData('crop-image');
  
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
