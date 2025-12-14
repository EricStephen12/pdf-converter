'use client';

import { useState } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { ToolLayout } from '@/components/ToolLayout';
import { compressAudio } from '@/lib/audio-utils';

export default function CompressAudio() {
  const [file, setFile] = useState<File | null>(null);
  const [bitrate, setBitrate] = useState<'64' | '128' | '192' | '320'>('128');
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
      const blob = await compressAudio(file, bitrate, (p) => {
        setIsLoading(false);
        setProgress(p);
      });
      
      setResult({ original: file.size, compressed: blob.size });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `compressed_${file.name.replace(/\.[^/.]+$/, '')}.mp3`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error compressing audio:', error);
    }
    setIsProcessing(false);
    setIsLoading(false);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const bitrates = [
    { value: '64', label: '64 kbps', desc: 'Smallest size', quality: 'Low' },
    { value: '128', label: '128 kbps', desc: 'Good balance', quality: 'Medium' },
    { value: '192', label: '192 kbps', desc: 'High quality', quality: 'High' },
    { value: '320', label: '320 kbps', desc: 'Best quality', quality: 'Max' },
  ];

  return (
    <ToolLayout
      title="Compress Audio"
      description="Reduce audio file size by adjusting bitrate. Perfect for podcasts and music sharing."
      icon="📉"
      color="cyan"
    >
      {!file ? (
        <FileUploader 
          accept="audio/*" 
          onFilesSelected={(files) => setFile(files[0])} 
          color="blue" 
        />
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center text-xl">
                🎵
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
            <label className="block text-white text-sm font-medium mb-3">Output Bitrate</label>
            <div className="grid grid-cols-4 gap-2">
              {bitrates.map((br) => (
                <button
                  key={br.value}
                  onClick={() => setBitrate(br.value as typeof bitrate)}
                  className={`p-3 rounded-xl border transition-all ${
                    bitrate === br.value
                      ? 'border-cyan-500 bg-cyan-500/20 text-white'
                      : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/30'
                  }`}
                >
                  <div className="font-semibold text-sm">{br.label}</div>
                  <div className="text-xs opacity-70">{br.quality}</div>
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
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
          
          <button
            onClick={handleCompress}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-600 text-white py-4 rounded-xl font-semibold transition-all hover:scale-[1.02] hover:shadow-lg disabled:hover:scale-100"
          >
            {isProcessing ? (isLoading ? 'Loading...' : `Compressing... ${progress}%`) : 'Compress Audio'}
          </button>
        </div>
      )}
    </ToolLayout>
  );
}
