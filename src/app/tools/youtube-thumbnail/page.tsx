'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';

export default function YouTubeThumbnail() {
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const extractVideoId = (input: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ];
    
    for (const pattern of patterns) {
      const match = input.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const id = extractVideoId(url.trim());
    if (id) {
      setVideoId(id);
    } else {
      setError('Invalid YouTube URL. Please enter a valid YouTube video link.');
      setVideoId(null);
    }
  };

  const thumbnails = videoId ? [
    { name: 'Max Resolution', url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`, size: '1280x720' },
    { name: 'High Quality', url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`, size: '480x360' },
    { name: 'Medium Quality', url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`, size: '320x180' },
    { name: 'Standard', url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`, size: '640x480' },
  ] : [];

  const handleDownload = async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open(imageUrl, '_blank');
    }
  };

  return (
    <ToolLayout
      title="YouTube Thumbnail Downloader"
      description="Download high-quality thumbnails from any YouTube video. Get max resolution images for free."
      icon="🎬"
      color="red"
    >
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="mb-6">
          <label className="block text-white text-sm font-medium mb-2">YouTube Video URL</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
            >
              Get Thumbnails
            </button>
          </div>
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </form>

        {videoId && (
          <div className="space-y-4">
            <div className="aspect-video rounded-xl overflow-hidden bg-black mb-6">
              <img 
                src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                alt="Video thumbnail"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                }}
              />
            </div>

            <h3 className="text-white font-semibold mb-3">Available Sizes</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {thumbnails.map((thumb) => (
                <button
                  key={thumb.name}
                  onClick={() => handleDownload(thumb.url, `thumbnail-${videoId}-${thumb.size}.jpg`)}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl p-4 text-left transition group"
                >
                  <div className="text-white font-medium text-sm">{thumb.name}</div>
                  <div className="text-gray-400 text-xs">{thumb.size}</div>
                  <div className="text-red-400 text-xs mt-2 group-hover:text-red-300">Click to download →</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {!videoId && !error && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-5xl mb-4">🎬</div>
            <p>Enter a YouTube URL to get started</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
