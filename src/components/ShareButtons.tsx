'use client';

interface ShareButtonsProps {
  url?: string;
  title?: string;
}

export function ShareButtons({ 
  url = 'https://convertflow.site', 
  title = 'Check out ConvertFlow - 30+ free file conversion tools!' 
}: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: 'Twitter',
      icon: '𝕏',
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'hover:bg-black',
    },
    {
      name: 'LinkedIn',
      icon: 'in',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'hover:bg-blue-600',
    },
    {
      name: 'Facebook',
      icon: 'f',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:bg-blue-500',
    },
    {
      name: 'Reddit',
      icon: '⬆',
      href: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      color: 'hover:bg-orange-600',
    },
  ];

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    alert('Link copied!');
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-400 text-sm mr-2">Share:</span>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-8 h-8 bg-white/10 ${link.color} rounded-lg flex items-center justify-center text-white text-sm font-bold transition`}
          title={`Share on ${link.name}`}
        >
          {link.icon}
        </a>
      ))}
      <button
        onClick={copyLink}
        className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white text-sm transition"
        title="Copy link"
      >
        🔗
      </button>
    </div>
  );
}
