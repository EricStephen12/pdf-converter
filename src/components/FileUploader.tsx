'use client';

import { useCallback, useState } from 'react';

interface FileUploaderProps {
  accept: string;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  color?: string;
}

export function FileUploader({ accept, multiple = false, onFilesSelected, maxFiles = 10, color = 'purple' }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).slice(0, maxFiles);
    onFilesSelected(files);
  }, [onFilesSelected, maxFiles]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, maxFiles);
    onFilesSelected(files);
  }, [onFilesSelected, maxFiles]);

  const colorClasses: Record<string, { border: string; bg: string; button: string; icon: string }> = {
    purple: { border: 'border-purple-500/50', bg: 'bg-purple-500/10', button: 'from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500', icon: 'from-purple-500 to-pink-500' },
    red: { border: 'border-red-500/50', bg: 'bg-red-500/10', button: 'from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500', icon: 'from-red-500 to-orange-500' },
    blue: { border: 'border-blue-500/50', bg: 'bg-blue-500/10', button: 'from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500', icon: 'from-blue-500 to-cyan-500' },
    green: { border: 'border-green-500/50', bg: 'bg-green-500/10', button: 'from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500', icon: 'from-green-500 to-teal-500' },
  };

  const colors = colorClasses[color] || colorClasses.purple;

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
        isDragging 
          ? `${colors.border} ${colors.bg}` 
          : 'border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10'
      }`}
    >
      {/* Background glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.icon} opacity-5 rounded-2xl`} />
      
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="cursor-pointer relative">
        <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${colors.icon} rounded-2xl flex items-center justify-center`}>
          <span className="text-4xl">📁</span>
        </div>
        <p className="text-2xl font-semibold text-white mb-2">
          Drop your files here
        </p>
        <p className="text-gray-400 mb-6">or click to browse from your device</p>
        <span className={`inline-block bg-gradient-to-r ${colors.button} text-white px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105 hover:shadow-lg`}>
          Select Files
        </span>
        <p className="text-gray-500 text-sm mt-4">
          {multiple ? `Up to ${maxFiles} files` : 'Single file'} • Max 50MB each
        </p>
      </label>
    </div>
  );
}
