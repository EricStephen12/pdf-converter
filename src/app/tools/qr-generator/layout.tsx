import { generateToolMetadata, generateToolStructuredData } from '@/lib/seo-config';

export const metadata = generateToolMetadata('qr-generator');

export default function Layout({ children }: { children: React.ReactNode }) {
  const structuredData = generateToolStructuredData('qr-generator');
  
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
