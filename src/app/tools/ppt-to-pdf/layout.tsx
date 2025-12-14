import { generateToolMetadata, generateToolStructuredData } from '@/lib/seo-config';

export const metadata = generateToolMetadata('ppt-to-pdf');

export default function Layout({ children }: { children: React.ReactNode }) {
  const structuredData = generateToolStructuredData('ppt-to-pdf');
  
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
