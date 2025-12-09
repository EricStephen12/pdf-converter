'use client';

import { useState } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { ToolLayout } from '@/components/ToolLayout';
import { compressImage } from '@/lib/image-utils';

export default function CompressImage() {
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(70);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleCompress = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      for (const file of files) {
        const compressed = await compressImage(file, quality / 100);
        const url = URL.createObjectURL(compressed);
        const a = document.createElement('a');
        a.href = url;
        a.download = `compressed_${file.name.replace(/\.[^.]+$/, '.jpg')}`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error compressing images:', error);
    }
    setIsProcessing(false);
  };

  const totalSize = files.reduce((acc, f) => acc + f.size, 0);

  return (
    <ToolLayout
      title="Compress Image"
      description="Reduce image file sizes while maintaining quality. Perfect for web optimization."
      icon="⚡"
      color="pink"
    >
      <FileUploader accept="image/*" multiple onFilesSelected={(newFiles) => setFiles([...files, ...newFiles])} color="purple" />

      {files.length > 0 && (
        <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <label className="text-white font-medium">Compression Level</label>
              <span className="text-gray-400">{quality}%</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="100" 
              value={quality} 
              onChange={(e) => setQuality(Number(e.target.value))} 
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-500" 
            />
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-500">Smaller file</span>
              <span className="text-gray-500">Higher quality</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Selected Images</h3>
            <span className="text-gray-400 text-sm">{files.length} images • {formatSize(totalSize)} total</span>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-4 group hover:bg-white/10 transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-red-500 rounded-lg flex items-center justify-center text-xs font-bold">
                    IMG
                  </div>
                  <div>
                    <p className="text-white truncate max-w-xs">{file.name}</p>
                    <p className="text-gray-500 text-sm">{formatSize(file.size)}</p>
                  </div>
                </div>
                <button onClick={() => removeFile(index)} className="text-gray-500 hover:text-red-400 transition p-2">
                  ✕
                </button>
              </div>
            ))}
          </div>
          
          <button
            onClick={handleCompress}
            disabled={isProcessing}
            className="mt-6 w-full bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-500 hover:to-red-500 disabled:from-gray-600 disabled:to-gray-600 text-white py-4 rounded-xl font-semibold transition-all hover:scale-[1.02] hover:shadow-lg disabled:hover:scale-100"
          >
            {isProcessing ? 'Compressing...' : `Compress ${files.length} Images`}
          </button>
        </div>
      )}
    </ToolLayout>
  );
}
