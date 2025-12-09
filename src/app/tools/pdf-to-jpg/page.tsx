'use client';

import { useState } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { ToolLayout } from '@/components/ToolLayout';
import * as pdfjsLib from 'pdfjs-dist';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

export default function PdfToJpg() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const scale = 2;
        const viewport = page.getViewport({ scale });
        
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!;
        
        await page.render({ canvasContext: ctx, viewport }).promise;
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `page_${i}.jpg`;
            a.click();
            URL.revokeObjectURL(url);
          }
        }, 'image/jpeg', 0.9);
        
        setProgress(Math.round((i / totalPages) * 100));
      }
    } catch (error) {
      console.error('Error converting PDF:', error);
    }
    setIsProcessing(false);
  };

  return (
    <ToolLayout
      title="PDF to JPG"
      description="Convert each page of your PDF into high-quality JPG images."
      icon="🖼️"
      color="green"
    >
      {!file ? (
        <FileUploader accept=".pdf" onFilesSelected={(files) => setFile(files[0])} color="green" />
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center text-sm font-bold">
                PDF
              </div>
              <div>
                <p className="text-white font-medium">{file.name}</p>
                <p className="text-gray-500 text-sm">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <button onClick={() => setFile(null)} className="text-gray-400 hover:text-white transition text-sm">
              Change file
            </button>
          </div>
          
          {isProcessing && (
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Converting pages...</span>
                <span className="text-white">{progress}%</span>
              </div>
              <div className="bg-white/10 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-green-500 to-teal-500 h-full transition-all duration-300" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>
          )}
          
          <button
            onClick={handleConvert}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 disabled:from-gray-600 disabled:to-gray-600 text-white py-4 rounded-xl font-semibold transition-all hover:scale-[1.02] hover:shadow-lg disabled:hover:scale-100"
          >
            {isProcessing ? 'Converting...' : 'Convert to JPG'}
          </button>
        </div>
      )}
    </ToolLayout>
  );
}
