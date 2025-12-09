'use client';

interface AdBannerProps {
  slot: 'top' | 'bottom' | 'sidebar';
}

export function AdBanner({ slot }: AdBannerProps) {
  // Replace with your actual Google AdSense code once approved
  // Example: <ins className="adsbygoogle" data-ad-client="ca-pub-XXXXX" data-ad-slot="XXXXX" />
  
  const sizes = {
    top: 'h-24 md:h-28',
    bottom: 'h-24 md:h-28', 
    sidebar: 'h-64 w-full md:w-72',
  };

  return (
    <div className={`${sizes[slot]} bg-white/5 border border-white/10 rounded-xl flex items-center justify-center`}>
      <div className="text-center">
        <p className="text-gray-500 text-sm">Advertisement</p>
        <p className="text-gray-600 text-xs mt-1">Google AdSense will appear here</p>
      </div>
    </div>
  );
}

// Instructions for setting up Google AdSense:
// 1. Go to google.com/adsense and sign up
// 2. Add your site and wait for approval (usually 1-2 weeks)
// 3. Once approved, create ad units and get your ad code
// 4. Replace the placeholder above with:
//    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXX" crossOrigin="anonymous" />
//    <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-XXXXX" data-ad-slot="XXXXX" data-ad-format="auto" data-full-width-responsive="true" />
//    <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
