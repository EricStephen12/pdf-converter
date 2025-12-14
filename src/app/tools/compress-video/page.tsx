'use client';

import { useState } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { ToolLayout } from '@/components/ToolLayout';
import { compressVideo } from '@/lib/video-utils';

export default function CompressVideo() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('medium');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ original: number; compressed: number } | null>(null);

  const handleCompress = async () => {
    if (!file) return;
    setIsLoading(true);
    setIsProcessing(true);
    setProgress(0);
    setResult(null);
    
    try {
      const blob = await compressVideo(file, quality, (p) => {
        setIsLoading(false);
        setProgress(p);
      });
      
      setResult({ original: file.size, compressed: blob.size });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `compressed_${file.name.replace(/\.[^/.]+$/, '')}.mp4`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error compressing video:', error);
    }
    setIsProcessing(false);
    setIsLoading(false);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const qualities = [
    { value: 'low', label: 'Small', desc: 'Max compression', reduction: '~70%' },
    { value: 'medium', label: 'Balanced', desc: 'Good quality', reduction: '~50%' },
    { value: 'high', label: 'High Quality', desc: 'Minimal loss', reduction: '~30%' },
  ];

  return (
    <ToolLayout
      title="Compress Video"
      description="Reduce video file size while maintaining quality. Perfect for sharing and uploading."
      icon="🗜️"
      color="teal"
    >
      {!file ? (
        <FileUploader 
          accept="video/*" 
          onFilesSelected={(files) => setFile(files[0])} 
          color="green" 
        />
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center text-xl">
                🎬
              </div>
              <div>
                <p className="text-white font-medium">{file.name}</p>
                <p className="text-gray-500 text-sm">Size: {formatSize(file.size)}</p>
              </div>
            </div>
            <button onClick={() => { setFile(null); setResult(null); }} className="text-gray-400 hover:text-white transition text-sm">
              Change file
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-3">Compression Level</label>
            <div className="grid grid-cols-3 gap-3">
              {qualities.map((q) => (
                <button
                  key={q.value}
                  onClick={() => setQuality(q.value as typeof quality)}
                  className={`p-3 rounded-xl border transition-all ${
                    quality === q.value
                      ? 'border-teal-500 bg-teal-500/20 text-white'
                      : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/30'
                  }`}
                >
                  <div className="font-semibold">{q.label}</div>
                  <div className="text-xs opacity-70">{q.desc}</div>
                  <div className="text-xs text-teal-400 mt-1">{q.reduction} smaller</div>
                </button>
              ))}
            </div>
          </div>

          {result && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-400 text-xl">✓</span>
                <p className="text-green-400 font-medium">Compression complete!</p>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Original</p>
                  <p className="text-white font-medium">{formatSize(result.original)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Compressed</p>
                  <p className="text-white font-medium">{formatSize(result.compressed)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Saved</p>
                  <p className="text-green-400 font-medium">{Math.round((1 - result.compressed / result.original) * 100)}%</p>
                </div>
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">{isLoading ? 'Loading FFmpeg...' : 'Compressing...'}</span>
                <span className="text-white">{progress}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
          
          <button
            onClick={handleCompress}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-600 text-white py-4 rounded-xl font-semibold transition-all hover:scale-[1.02] hover:shadow-lg disabled:hover:scale-100"
          >
            {isProcessing ? (isLoading ? 'Loading...' : `Compressing... ${progress}%`) : 'Compress Video'}
          </button>
        </div>
      )}
    </ToolLayout>
  );
}
