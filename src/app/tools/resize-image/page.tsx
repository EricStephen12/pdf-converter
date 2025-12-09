'use client';

import { useState } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { ToolLayout } from '@/components/ToolLayout';
import { resizeImage } from '@/lib/image-utils';

export default function ResizeImage() {
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleResize = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const resized = await resizeImage(file, width, height, maintainAspect);
      const url = URL.createObjectURL(resized);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resized_${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error resizing image:', error);
    }
    setIsProcessing(false);
  };

  const presets = [
    { name: 'HD', w: 1280, h: 720 },
    { name: 'Full HD', w: 1920, h: 1080 },
    { name: 'Instagram', w: 1080, h: 1080 },
    { name: 'Twitter', w: 1200, h: 675 },
  ];

  return (
    <ToolLayout
      title="Resize Image"
      description="Resize your images to any dimension. Perfect for social media and web."
      icon="📐"
      color="purple"
    >
      {!file ? (
        <FileUploader accept="image/*" onFilesSelected={(files) => setFile(files[0])} color="purple" />
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-sm font-bold">
                IMG
              </div>
              <div>
                <p className="text-white font-medium">{file.name}</p>
                <p className="text-gray-500 text-sm">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <button onClick={() => setFile(null)} className="text-gray-400 hover:text-white transition text-sm">
              Change file
            </button>
          </div>

          {/* Presets */}
          <div className="mb-6">
            <p className="text-white font-medium mb-3">Quick Presets</p>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => { setWidth(preset.w); setHeight(preset.h); }}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white rounded-lg text-sm transition"
                >
                  {preset.name} ({preset.w}×{preset.h})
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-white block mb-2 font-medium">Width (px)</label>
              <input 
                type="number" 
                value={width} 
                onChange={(e) => setWidth(Number(e.target.value))} 
                className="w-full bg-white/10 border border-white/20 text-white p-3 rounded-xl focus:outline-none focus:border-purple-500 transition" 
              />
            </div>
            <div>
              <label className="text-white block mb-2 font-medium">Height (px)</label>
              <input 
                type="number" 
                value={height} 
                onChange={(e) => setHeight(Number(e.target.value))} 
                className="w-full bg-white/10 border border-white/20 text-white p-3 rounded-xl focus:outline-none focus:border-purple-500 transition" 
              />
            </div>
          </div>
          
          <label className="flex items-center text-white mb-6 cursor-pointer">
            <input 
              type="checkbox" 
              checked={maintainAspect} 
              onChange={(e) => setMaintainAspect(e.target.checked)} 
              className="w-5 h-5 rounded bg-white/10 border-white/20 text-purple-500 focus:ring-purple-500 mr-3" 
            />
            Maintain aspect ratio
          </label>
          
          <button
            onClick={handleResize}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-600 text-white py-4 rounded-xl font-semibold transition-all hover:scale-[1.02] hover:shadow-lg disabled:hover:scale-100"
          >
            {isProcessing ? 'Resizing...' : 'Resize Image'}
          </button>
        </div>
      )}
    </ToolLayout>
  );
}
