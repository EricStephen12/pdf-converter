'use client';

import { useState } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { ToolLayout } from '@/components/ToolLayout';
import { convertImage } from '@/lib/image-utils';

export default function WebpConvert() {
  const [files, setFiles] = useState<File[]>([]);
  const [mode, setMode] = useState<'to-webp' | 'from-webp'>('to-webp');
  const [quality, setQuality] = useState(85);
  const [isProcessing, setIsProcessing] = useState(false);

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      for (const file of files) {
        const targetFormat = mode === 'to-webp' ? 'webp' : 'png';
        const converted = await convertImage(file, targetFormat, quality / 100);
        const url = URL.createObjectURL(converted);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name.replace(/\.[^.]+$/, `.${targetFormat}`);
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error converting images:', error);
    }
    setIsProcessing(false);
  };

  return (
    <ToolLayout
      title="WebP Converter"
      description="Convert images to or from WebP format. WebP offers superior compression for web use."
      icon="🌐"
      color="indigo"
    >
      <div className="flex gap-2 mb-6">
        <button 
          onClick={() => { setMode('to-webp'); setFiles([]); }} 
          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
            mode === 'to-webp' 
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
              : 'bg-white/10 text-gray-400 hover:bg-white/20'
          }`}
        >
          Convert to WebP
        </button>
        <button 
          onClick={() => { setMode('from-webp'); setFiles([]); }} 
          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
            mode === 'from-webp' 
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
              : 'bg-white/10 text-gray-400 hover:bg-white/20'
          }`}
        >
          Convert from WebP
        </button>
      </div>

      <FileUploader 
        accept={mode === 'to-webp' ? '.jpg,.jpeg,.png' : '.webp'} 
        multiple 
        onFilesSelected={(newFiles) => setFiles([...files, ...newFiles])} 
        color="purple"
      />

      {files.length > 0 && (
        <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <label className="text-white font-medium">Quality</label>
              <span className="text-gray-400">{quality}%</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="100" 
              value={quality} 
              onChange={(e) => setQuality(Number(e.target.value))} 
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Selected Images</h3>
            <span className="text-gray-400 text-sm">{files.length} images</span>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-4 group hover:bg-white/10 transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-xs font-bold">
                    {mode === 'to-webp' ? 'IMG' : 'WEBP'}
                  </div>
                  <div>
                    <p className="text-white truncate max-w-xs">{file.name}</p>
                    <p className="text-gray-500 text-sm">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button onClick={() => removeFile(index)} className="text-gray-500 hover:text-red-400 transition p-2">
                  ✕
                </button>
              </div>
            ))}
          </div>
          
          <button
            onClick={handleConvert}
            disabled={isProcessing}
            className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-600 text-white py-4 rounded-xl font-semibold transition-all hover:scale-[1.02] hover:shadow-lg disabled:hover:scale-100"
          >
            {isProcessing ? 'Converting...' : `Convert ${files.length} Images`}
          </button>
        </div>
      )}
    </ToolLayout>
  );
}
