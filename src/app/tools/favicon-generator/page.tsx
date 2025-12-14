'use client';

import { useState, useRef } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { ToolLayout } from '@/components/ToolLayout';

const sizes = [16, 32, 48, 64, 128, 180, 192, 512];

export default function FaviconGenerator() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generated, setGenerated] = useState<{ size: number; url: string }[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    setGenerated([]);
    const url = URL.createObjectURL(selectedFile);
    setPreview(url);
  };

  const handleGenerate = async () => {
    if (!file || !canvasRef.current || !preview) return;
    setIsProcessing(true);
    setGenerated([]);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = async () => {
      const results: { size: number; url: string }[] = [];

      for (const size of sizes) {
        canvas.width = size;
        canvas.height = size;
        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
        
        const dataUrl = canvas.toDataURL('image/png');
        results.push({ size, url: dataUrl });
      }

      setGenerated(results);
      setIsProcessing(false);
    };

    img.src = preview;
  };

  const handleDownload = (url: string, size: number) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `favicon-${size}x${size}.png`;
    a.click();
  };

  const handleDownloadAll = () => {
    generated.forEach((item, index) => {
      setTimeout(() => {
        handleDownload(item.url, item.size);
      }, index * 200);
    });
  };

  return (
    <ToolLayout
      title="Favicon Generator"
      description="Generate favicons in all sizes from a single image. Perfect for websites and web apps."
      icon="⭐"
      color="yellow"
    >
      <canvas ref={canvasRef} className="hidden" />
      
      {!file ? (
        <FileUploader 
          accept="image/*" 
          onFilesSelected={handleFileSelect} 
          color="green" 
        />
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {preview && (
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/10">
                  <img src={preview} alt="Source" className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <p className="text-white font-medium">{file.name}</p>
                <p className="text-gray-500 text-sm">Source image</p>
              </div>
            </div>
            <button 
              onClick={() => { setFile(null); setPreview(null); setGenerated([]); }} 
              className="text-gray-400 hover:text-white text-sm"
            >
              Change image
            </button>
          </div>

          {generated.length === 0 ? (
            <>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
                <p className="text-yellow-400 text-sm">
                  💡 For best results, use a square image (1:1 ratio). We&apos;ll generate all standard favicon sizes.
                </p>
              </div>

              <div className="mb-6">
                <p className="text-white text-sm font-medium mb-2">Sizes to generate:</p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <span key={size} className="px-3 py-1 bg-white/10 rounded-lg text-gray-300 text-sm">
                      {size}×{size}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 disabled:from-gray-600 disabled:to-gray-600 text-white py-4 rounded-xl font-semibold transition-all hover:scale-[1.02] hover:shadow-lg disabled:hover:scale-100"
              >
                {isProcessing ? 'Generating...' : 'Generate All Favicons'}
              </button>
            </>
          ) : (
            <>
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-green-400 text-xl">✓</span>
                  <p className="text-green-400 font-medium">Generated {generated.length} favicon sizes!</p>
                </div>
              </div>

              <div className="grid grid-cols-4 md:grid-cols-8 gap-4 mb-6">
                {generated.map((item) => (
                  <button
                    key={item.size}
                    onClick={() => handleDownload(item.url, item.size)}
                    className="flex flex-col items-center p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition group"
                  >
                    <div 
                      className="bg-white rounded-lg mb-2 flex items-center justify-center"
                      style={{ width: Math.min(item.size, 48), height: Math.min(item.size, 48) }}
                    >
                      <img src={item.url} alt={`${item.size}px`} className="w-full h-full" />
                    </div>
                    <span className="text-gray-400 text-xs group-hover:text-white">{item.size}px</span>
                  </button>
                ))}
              </div>

              <button
                onClick={handleDownloadAll}
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white py-4 rounded-xl font-semibold transition-all hover:scale-[1.02] hover:shadow-lg"
              >
                Download All Sizes
              </button>
            </>
          )}
        </div>
      )}
    </ToolLayout>
  );
}
