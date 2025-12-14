'use client';

import { useState } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { ToolLayout } from '@/components/ToolLayout';
import { extractAudio } from '@/lib/video-utils';

export default function ExtractAudio() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<'mp3' | 'wav' | 'm4a'>('mp3');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleExtract = async () => {
    if (!file) return;
    setIsLoading(true);
    setIsProcessing(true);
    setProgress(0);
    
    try {
      const blob = await extractAudio(file, format, (p) => {
        setIsLoading(false);
        setProgress(p);
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${file.name.replace(/\.[^/.]+$/, '')}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error extracting audio:', error);
    }
    setIsProcessing(false);
    setIsLoading(false);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formats = [
    { value: 'mp3', label: 'MP3', desc: 'Most compatible' },
    { value: 'wav', label: 'WAV', desc: 'Lossless quality' },
    { value: 'm4a', label: 'M4A', desc: 'Apple format' },
  ];

  return (
    <ToolLayout
      title="Extract Audio from Video"
      description="Extract the audio track from any video file. Get MP3, WAV, or M4A output."
      icon="🎵"
      color="indigo"
    >
      {!file ? (
        <FileUploader 
          accept="video/*" 
          onFilesSelected={(files) => setFile(files[0])} 
          color="purple" 
        />
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-xl">
                🎬
              </div>
              <div>
                <p className="text-white font-medium">{file.name}</p>
                <p className="text-gray-500 text-sm">Size: {formatSize(file.size)}</p>
              </div>
            </div>
            <button onClick={() => setFile(null)} className="text-gray-400 hover:text-white transition text-sm">
              Change file
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-3">Audio Format</label>
            <div className="grid grid-cols-3 gap-3">
              {formats.map((fmt) => (
                <button
                  key={fmt.value}
                  onClick={() => setFormat(fmt.value as typeof format)}
                  className={`p-3 rounded-xl border transition-all ${
                    format === fmt.value
                      ? 'border-indigo-500 bg-indigo-500/20 text-white'
                      : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/30'
                  }`}
                >
                  <div className="font-semibold">{fmt.label}</div>
                  <div className="text-xs opacity-70">{fmt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {isProcessing && (
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">{isLoading ? 'Loading FFmpeg...' : 'Extracting audio...'}</span>
                <span className="text-white">{progress}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
          
          <button
            onClick={handleExtract}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-600 text-white py-4 rounded-xl font-semibold transition-all hover:scale-[1.02] hover:shadow-lg disabled:hover:scale-100"
          >
            {isProcessing ? (isLoading ? 'Loading...' : `Extracting... ${progress}%`) : `Extract as ${format.toUpperCase()}`}
          </button>
        </div>
      )}
    </ToolLayout>
  );
}
