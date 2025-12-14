'use client';

import { useState, useRef, useEffect } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { ToolLayout } from '@/components/ToolLayout';
import { trimAudio } from '@/lib/audio-utils';

export default function TrimAudio() {
  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (file && audioRef.current) {
      const url = URL.createObjectURL(file);
      audioRef.current.src = url;
      audioRef.current.onloadedmetadata = () => {
        const dur = audioRef.current?.duration || 0;
        setDuration(dur);
        setEndTime(dur);
      };
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const handleTrim = async () => {
    if (!file) return;
    setIsLoading(true);
    setIsProcessing(true);
    setProgress(0);
    
    try {
      const blob = await trimAudio(file, startTime, endTime, (p) => {
        setIsLoading(false);
        setProgress(p);
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `trimmed_${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error trimming audio:', error);
    }
    setIsProcessing(false);
    setIsLoading(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <ToolLayout
      title="Trim Audio"
      description="Cut and trim audio files to the exact length you need. Perfect for ringtones and clips."
      icon="✂️"
      color="orange"
    >
      {!file ? (
        <FileUploader 
          accept="audio/*" 
          onFilesSelected={(files) => setFile(files[0])} 
          color="red" 
        />
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <audio ref={audioRef} className="hidden" />
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center text-xl">
                🎵
              </div>
              <div>
                <p className="text-white font-medium">{file.name}</p>
                <p className="text-gray-500 text-sm">Size: {formatSize(file.size)} • Duration: {formatTime(duration)}</p>
              </div>
            </div>
            <button onClick={() => setFile(null)} className="text-gray-400 hover:text-white transition text-sm">
              Change file
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-3">Trim Range</label>
            
            <div className="bg-white/5 rounded-xl p-4 mb-4">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Start: {formatTime(startTime)}</span>
                <span>End: {formatTime(endTime)}</span>
              </div>
              
              <div className="relative h-12 bg-white/10 rounded-lg overflow-hidden mb-4">
                <div 
                  className="absolute h-full bg-gradient-to-r from-orange-500 to-yellow-500 opacity-50"
                  style={{ 
                    left: `${(startTime / duration) * 100}%`,
                    width: `${((endTime - startTime) / duration) * 100}%`
                  }}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Start Time (seconds)</label>
                  <input
                    type="range"
                    min={0}
                    max={duration}
                    step={0.1}
                    value={startTime}
                    onChange={(e) => setStartTime(Math.min(Number(e.target.value), endTime - 1))}
                    className="w-full accent-orange-500"
                  />
                  <input
                    type="number"
                    min={0}
                    max={endTime - 1}
                    step={0.1}
                    value={startTime.toFixed(1)}
                    onChange={(e) => setStartTime(Math.min(Number(e.target.value), endTime - 1))}
                    className="w-full mt-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">End Time (seconds)</label>
                  <input
                    type="range"
                    min={0}
                    max={duration}
                    step={0.1}
                    value={endTime}
                    onChange={(e) => setEndTime(Math.max(Number(e.target.value), startTime + 1))}
                    className="w-full accent-orange-500"
                  />
                  <input
                    type="number"
                    min={startTime + 1}
                    max={duration}
                    step={0.1}
                    value={endTime.toFixed(1)}
                    onChange={(e) => setEndTime(Math.max(Number(e.target.value), startTime + 1))}
                    className="w-full mt-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                  />
                </div>
              </div>
            </div>
            
            <div className="text-center text-sm text-gray-400">
              Output duration: <span className="text-white font-medium">{formatTime(endTime - startTime)}</span>
            </div>
          </div>

          {isProcessing && (
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">{isLoading ? 'Loading FFmpeg...' : 'Trimming...'}</span>
                <span className="text-white">{progress}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
          
          <button
            onClick={handleTrim}
            disabled={isProcessing || endTime <= startTime}
            className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-500 hover:to-yellow-500 disabled:from-gray-600 disabled:to-gray-600 text-white py-4 rounded-xl font-semibold transition-all hover:scale-[1.02] hover:shadow-lg disabled:hover:scale-100"
          >
            {isProcessing ? (isLoading ? 'Loading...' : `Trimming... ${progress}%`) : 'Trim Audio'}
          </button>
        </div>
      )}
    </ToolLayout>
  );
}
