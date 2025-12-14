'use client';

import { useState } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { ToolLayout } from '@/components/ToolLayout';
import { convertVideo } from '@/lib/video-utils';

export default function VideoConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState<string>('mp4');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleConvert = async () => {
    if (!file) return;
    setIsLoading(true);
    setIsProcessing(true);
    setProgress(0);
    
    try {
      const blob = await convertVideo(file, outputFormat, (p) => {
        setIsLoading(false);
        setProgress(p);
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `converted.${outputFormat}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error converting video:', error);
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
    { value: 'mp4', label: 'MP4', desc: 'Most compatible' },
    { value: 'webm', label: 'WebM', desc: 'Web optimized' },
    { value: 'avi', label: 'AVI', desc: 'Windows format' },
    { value: 'mov', label: 'MOV', desc: 'Apple format' },
  ];

  return (
    <ToolLayout
      title="Video Converter"
      description="Convert videos between formats. MP4, WebM, AVI, MOV and more. All processing happens in your browser."
      icon="🎬"
      color="purple"
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
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-xl">
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
            <label className="block text-white text-sm font-medium mb-3">Output Format</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {formats.map((fmt) => (
                <button
                  key={fmt.value}
                  onClick={() => setOutputFormat(fmt.value)}
                  className={`p-3 rounded-xl border transition-all ${
                    outputFormat === fmt.value
                      ? 'border-purple-500 bg-purple-500/20 text-white'
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
                <span className="text-gray-400">{isLoading ? 'Loading FFmpeg...' : 'Converting...'}</span>
                <span className="text-white">{progress}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
          
          <button
            onClick={handleConvert}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-600 text-white py-4 rounded-xl font-semibold transition-all hover:scale-[1.02] hover:shadow-lg disabled:hover:scale-100"
          >
            {isProcessing ? (isLoading ? 'Loading...' : `Converting... ${progress}%`) : `Convert to ${outputFormat.toUpperCase()}`}
          </button>
        </div>
      )}
    </ToolLayout>
  );
}
