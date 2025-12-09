'use client';

import { useState } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { ToolLayout } from '@/components/ToolLayout';
import { convertImage } from '@/lib/image-utils';

export default function PngToJpg() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [quality, setQuality] = useState(90);

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      for (const file of files) {
        const converted = await convertImage(file, 'jpeg', quality / 100);
        const url = URL.createObjectURL(converted);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name.replace(/\.[^.]+$/, '.jpg');
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
      title="PNG to JPG"
      description="Convert PNG images to JPG format for smaller file sizes."
      icon="🔄"
      color="blue"
    >
      <FileUploader accept=".png" multiple onFilesSelected={(newFiles) => setFiles([...files, ...newFiles])} color="blue" />

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
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500" 
            />
            <p className="text-gray-500 text-sm mt-1">Higher quality = larger file size</p>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Selected Images</h3>
            <span className="text-gray-400 text-sm">{files.length} images</span>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-4 group hover:bg-white/10 transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-xs font-bold">
                    PNG
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
            className="mt-6 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-gray-600 disabled:to-gray-600 text-white py-4 rounded-xl font-semibold transition-all hover:scale-[1.02] hover:shadow-lg disabled:hover:scale-100"
          >
            {isProcessing ? 'Converting...' : `Convert ${files.length} Images to JPG`}
          </button>
        </div>
      )}
    </ToolLayout>
  );
}
