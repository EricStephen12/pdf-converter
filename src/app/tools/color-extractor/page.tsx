'use client';

import { useState, useRef } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { ToolLayout } from '@/components/ToolLayout';

interface ColorInfo {
  hex: string;
  rgb: string;
  count: number;
}

export default function ColorExtractor() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [colors, setColors] = useState<ColorInfo[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    setColors([]);
    const url = URL.createObjectURL(selectedFile);
    setPreview(url);
    extractColors(url);
  };

  const extractColors = (imageUrl: string) => {
    setIsProcessing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const maxSize = 100;
      const scale = Math.min(maxSize / img.width, maxSize / img.height);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      const colorMap = new Map<string, number>();

      for (let i = 0; i < pixels.length; i += 4) {
        const r = Math.round(pixels[i] / 32) * 32;
        const g = Math.round(pixels[i + 1] / 32) * 32;
        const b = Math.round(pixels[i + 2] / 32) * 32;
        const key = `${r},${g},${b}`;
        colorMap.set(key, (colorMap.get(key) || 0) + 1);
      }

      const sortedColors = Array.from(colorMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([rgb, count]) => {
          const [r, g, b] = rgb.split(',').map(Number);
          const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
          return { hex, rgb: `rgb(${r}, ${g}, ${b})`, count };
        });

      setColors(sortedColors);
      setIsProcessing(false);
    };

    img.src = imageUrl;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(text);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const exportPalette = () => {
    const css = colors.map((c, i) => `--color-${i + 1}: ${c.hex};`).join('\n');
    const blob = new Blob([`:root {\n${css}\n}`], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'color-palette.css';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout
      title="Color Palette Extractor"
      description="Extract dominant colors from any image. Get HEX and RGB values for your design projects."
      icon="🎨"
      color="purple"
    >
      <canvas ref={canvasRef} className="hidden" />
      
      {!file ? (
        <FileUploader 
          accept="image/*" 
          onFilesSelected={handleFileSelect} 
          color="purple" 
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Source Image</h3>
              <button 
                onClick={() => { setFile(null); setPreview(null); setColors([]); }} 
                className="text-gray-400 hover:text-white text-sm"
              >
                Change image
              </button>
            </div>
            
            {preview && (
              <div className="aspect-square rounded-xl overflow-hidden bg-black/50">
                <img src={preview} alt="Source" className="w-full h-full object-contain" />
              </div>
            )}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Extracted Colors</h3>
              {colors.length > 0 && (
                <button 
                  onClick={exportPalette}
                  className="text-purple-400 hover:text-purple-300 text-sm"
                >
                  Export CSS
                </button>
              )}
            </div>

            {isProcessing ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-400">Extracting colors...</div>
              </div>
            ) : colors.length > 0 ? (
              <div className="space-y-3">
                {colors.map((color, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition cursor-pointer group"
                    onClick={() => copyToClipboard(color.hex)}
                  >
                    <div 
                      className="w-12 h-12 rounded-lg shadow-lg flex-shrink-0"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-mono font-medium">{color.hex.toUpperCase()}</span>
                        {copiedColor === color.hex && (
                          <span className="text-green-400 text-xs">Copied!</span>
                        )}
                      </div>
                      <span className="text-gray-500 text-sm font-mono">{color.rgb}</span>
                    </div>
                    <span className="text-gray-500 text-xs opacity-0 group-hover:opacity-100 transition">
                      Click to copy
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                Upload an image to extract colors
              </div>
            )}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
