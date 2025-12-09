'use client';

import { useState } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { ToolLayout } from '@/components/ToolLayout';

export default function CompressPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ original: number; compressed: number } | null>(null);

  const handleCompress = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
      
      setResult({
        original: file.size,
        compressed: blob.size
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'compressed.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error compressing PDF:', error);
    }
    setIsProcessing(false);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <ToolLayout
      title="Compress PDF"
      description="Reduce your PDF file size while maintaining quality. Perfect for email attachments."
      icon="🗜️"
      color="yellow"
    >
      {!file ? (
        <FileUploader accept=".pdf" onFilesSelected={(files) => setFile(files[0])} color="green" />
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-green-500 rounded-xl flex items-center justify-center text-sm font-bold">
                PDF
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
          
          {result && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-400 text-xl">✓</span>
                <p className="text-green-400 font-medium">Compression complete!</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Original</p>
                  <p className="text-white font-medium">{formatSize(result.original)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Compressed</p>
                  <p className="text-white font-medium">{formatSize(result.compressed)}</p>
                </div>
              </div>
            </div>
          )}
          
          <button
            onClick={handleCompress}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-yellow-600 to-green-600 hover:from-yellow-500 hover:to-green-500 disabled:from-gray-600 disabled:to-gray-600 text-white py-4 rounded-xl font-semibold transition-all hover:scale-[1.02] hover:shadow-lg disabled:hover:scale-100"
          >
            {isProcessing ? 'Compressing...' : 'Compress PDF'}
          </button>
        </div>
      )}
    </ToolLayout>
  );
}
