'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdBannerProps {
  slot?: 'top' | 'bottom' | 'sidebar';
}

export function AdBanner({ slot = 'bottom' }: AdBannerProps) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  const sizes = {
    top: 'min-h-[100px]',
    bottom: 'min-h-[100px]', 
    sidebar: 'min-h-[250px]',
  };

  return (
    <div className={`${sizes[slot]} bg-white/5 border border-white/10 rounded-xl overflow-hidden flex items-center justify-center`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: '100%' }}
        data-ad-client="ca-pub-6471791415788302"
        data-ad-slot="3314593239"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
