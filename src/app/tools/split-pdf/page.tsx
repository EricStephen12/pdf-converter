'use client';

import { useState } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { ToolLayout } from '@/components/ToolLayout';
import { extractPages, getPDFPageCount } from '@/lib/pdf-utils';

export default function SplitPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = async (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      const count = await getPDFPageCount(files[0]);
      setPageCount(count);
      setSelectedPages([]);
    }
  };

  const togglePage = (page: number) => {
    setSelectedPages(prev => 
      prev.includes(page) ? prev.filter(p => p !== page) : [...prev, page].sort((a, b) => a - b)
    );
  };

  const selectAll = () => setSelectedPages(Array.from({ length: pageCount }, (_, i) => i + 1));
  const selectNone = () => setSelectedPages([]);

  const handleExtract = async () => {
    if (!file || selectedPages.length === 0) return;
    setIsProcessing(true);
    try {
      const extracted = await extractPages(file, selectedPages);
      const blob = new Blob([new Uint8Array(extracted)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'extracted.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error extracting pages:', error);
    }
    setIsProcessing(false);
  };

  return (
    <ToolLayout
      title="Split PDF"
      description="Extract specific pages from your PDF document. Select the pages you need."
      icon="✂️"
      color="orange"
    >
      {!file ? (
        <FileUploader accept=".pdf" onFilesSelected={handleFileSelect} color="red" />
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center text-sm font-bold">
                PDF
              </div>
              <div>
                <p className="text-white font-medium">{file.name}</p>
                <p className="text-gray-500 text-sm">{pageCount} pages</p>
              </div>
            </div>
            <button onClick={() => setFile(null)} className="text-gray-400 hover:text-white transition text-sm">
              Change file
            </button>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <p className="text-white font-medium">Select pages to extract:</p>
            <div className="flex gap-2">
              <button onClick={selectAll} className="text-purple-400 hover:text-purple-300 text-sm">Select all</button>
              <span className="text-gray-600">|</span>
              <button onClick={selectNone} className="text-purple-400 hover:text-purple-300 text-sm">Clear</button>
            </div>
          </div>
          
          <div className="grid grid-cols-8 md:grid-cols-12 gap-2 mb-6 max-h-48 overflow-y-auto p-2">
            {Array.from({ length: pageCount }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => togglePage(page)}
                className={`aspect-square rounded-lg font-medium transition-all ${
                  selectedPages.includes(page) 
                    ? 'bg-gradient-to-br from-orange-500 to-yellow-500 text-white scale-105' 
                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={handleExtract}
            disabled={selectedPages.length === 0 || isProcessing}
            className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-500 hover:to-yellow-500 disabled:from-gray-600 disabled:to-gray-600 text-white py-4 rounded-xl font-semibold transition-all hover:scale-[1.02] hover:shadow-lg disabled:hover:scale-100"
          >
            {isProcessing ? 'Extracting...' : `Extract ${selectedPages.length} Pages`}
          </button>
        </div>
      )}
    </ToolLayout>
  );
}
