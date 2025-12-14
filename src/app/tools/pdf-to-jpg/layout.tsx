import { generateToolMetadata, generateToolStructuredData } from '@/lib/seo-config';

export const metadata = generateToolMetadata('pdf-to-jpg');

export default function Layout({ children }: { children: React.ReactNode }) {
  const structuredData = generateToolStructuredData('pdf-to-jpg');
  
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
