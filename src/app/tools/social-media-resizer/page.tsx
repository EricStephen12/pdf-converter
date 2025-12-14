'use client';

import { useState, useRef } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { ToolLayout } from '@/components/ToolLayout';

const presets = [
  { name: 'Instagram Post', width: 1080, height: 1080, icon: '📸', platform: 'instagram' },
  { name: 'Instagram Story', width: 1080, height: 1920, icon: '📱', platform: 'instagram' },
  { name: 'Instagram Reel', width: 1080, height: 1920, icon: '🎬', platform: 'instagram' },
  { name: 'TikTok Video', width: 1080, height: 1920, icon: '🎵', platform: 'tiktok' },
  { name: 'YouTube Thumbnail', width: 1280, height: 720, icon: '▶️', platform: 'youtube' },
  { name: 'YouTube Banner', width: 2560, height: 1440, icon: '🖼️', platform: 'youtube' },
  { name: 'Twitter Post', width: 1200, height: 675, icon: '🐦', platform: 'twitter' },
  { name: 'Twitter Header', width: 1500, height: 500, icon: '🏷️', platform: 'twitter' },
  { name: 'Facebook Post', width: 1200, height: 630, icon: '👍', platform: 'facebook' },
  { name: 'Facebook Cover', width: 820, height: 312, icon: '🖼️', platform: 'facebook' },
  { name: 'LinkedIn Post', width: 1200, height: 627, icon: '💼', platform: 'linkedin' },
  { name: 'LinkedIn Banner', width: 1584, height: 396, icon: '🏢', platform: 'linkedin' },
];

export default function SocialMediaResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState(presets[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreview(url);
  };

  const handleResize = async () => {
    if (!file || !canvasRef.current) return;
    setIsProcessing(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = selectedPreset.width;
      canvas.height = selectedPreset.height;

      // Calculate cover fit
      const imgRatio = img.width / img.height;
      const canvasRatio = canvas.width / canvas.height;
      
      let drawWidth, drawHeight, offsetX, offsetY;
      
      if (imgRatio > canvasRatio) {
        drawHeight = canvas.height;
        drawWidth = img.width * (canvas.height / img.height);
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = 0;
      } else {
        drawWidth = canvas.width;
        drawHeight = img.height * (canvas.width / img.width);
        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2;
      }

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${selectedPreset.name.toLowerCase().replace(/\s+/g, '-')}-${selectedPreset.width}x${selectedPreset.height}.jpg`;
          a.click();
          URL.revokeObjectURL(url);
        }
        setIsProcessing(false);
      }, 'image/jpeg', 0.95);
    };

    img.src = preview!;
  };

  return (
    <ToolLayout
      title="Social Media Image Resizer"
      description="Resize images perfectly for Instagram, TikTok, YouTube, Twitter, Facebook, and LinkedIn."
      icon="📐"
      color="pink"
    >
      <canvas ref={canvasRef} className="hidden" />
      
      {!file ? (
        <FileUploader 
          accept="image/*" 
          onFilesSelected={handleFileSelect} 
          color="purple" 
        />
      ) : (
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Your Image</h3>
              <button 
                onClick={() => { setFile(null); setPreview(null); }} 
                className="text-gray-400 hover:text-white text-sm"
              >
                Change image
              </button>
            </div>
            
            <div className="aspect-video bg-black/50 rounded-xl overflow-hidden mb-6 flex items-center justify-center">
              {preview && (
                <img src={preview} alt="Preview" className="max-w-full max-h-full object-contain" />
              )}
            </div>

            <h3 className="text-white font-semibold mb-3">Select Size</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => setSelectedPreset(preset)}
                  className={`p-3 rounded-xl border transition-all text-left ${
                    selectedPreset.name === preset.name
                      ? 'border-pink-500 bg-pink-500/20 text-white'
                      : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span>{preset.icon}</span>
                    <span className="font-medium text-sm">{preset.name}</span>
                  </div>
                  <div className="text-xs opacity-70">{preset.width} × {preset.height}</div>
                </button>
              ))}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{selectedPreset.name}</p>
                  <p className="text-gray-400 text-sm">{selectedPreset.width} × {selectedPreset.height} pixels</p>
                </div>
                <div className="text-4xl">{selectedPreset.icon}</div>
              </div>
            </div>

            <button
              onClick={handleResize}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-600 text-white py-4 rounded-xl font-semibold transition-all hover:scale-[1.02] hover:shadow-lg disabled:hover:scale-100"
            >
              {isProcessing ? 'Processing...' : `Download ${selectedPreset.name}`}
            </button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
