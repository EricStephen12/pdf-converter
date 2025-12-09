'use client';

import { useState } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { mergePDFs } from '@/lib/pdf-utils';
import Link from 'next/link';

export default function MergePDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMerge = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);
    try {
      const mergedPdf = await mergePDFs(files);
      const blob = new Blob([new Uint8Array(mergedPdf)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error merging PDFs:', error);
    }
    setIsProcessing(false);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <main className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-xl">
              ⚡
            </div>
            <span className="text-xl font-bold text-white">ConvertFlow</span>
          </Link>
          <Link href="/" className="text-gray-400 hover:text-white transition flex items-center gap-2">
            ← All Tools
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-orange-500/10" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-red-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-orange-500/20 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-4 max-w-4xl relative">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6">
              📑
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Merge PDF Files</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Combine multiple PDF documents into a single file. Fast, free, and secure.
            </p>
          </div>

          <FileUploader
            accept=".pdf"
            multiple
            onFilesSelected={(newFiles) => setFiles([...files, ...newFiles])}
            maxFiles={20}
            color="red"
          />

          {files.length > 0 && (
            <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Selected Files</h3>
                <span className="text-gray-400 text-sm">{files.length} files</span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-4 group hover:bg-white/10 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center text-sm">
                        PDF
                      </div>
                      <div>
                        <p className="text-white truncate max-w-xs">{file.name}</p>
                        <p className="text-gray-500 text-sm">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-gray-500 hover:text-red-400 transition p-2"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              
              <button
                onClick={handleMerge}
                disabled={files.length < 2 || isProcessing}
                className="mt-6 w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 disabled:from-gray-600 disabled:to-gray-600 text-white py-4 rounded-xl font-semibold transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/25 disabled:hover:scale-100"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Merging...
                  </span>
                ) : (
                  `Merge ${files.length} PDFs`
                )}
              </button>
              
              {files.length < 2 && (
                <p className="text-center text-gray-500 text-sm mt-3">Add at least 2 files to merge</p>
              )}
            </div>
          )}

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-4 mt-12">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">🔒</div>
              <p className="text-white text-sm font-medium">100% Private</p>
              <p className="text-gray-500 text-xs">Files never leave your device</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">⚡</div>
              <p className="text-white text-sm font-medium">Instant Processing</p>
              <p className="text-gray-500 text-xs">No upload wait times</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">♾️</div>
              <p className="text-white text-sm font-medium">Unlimited</p>
              <p className="text-gray-500 text-xs">No file limits or restrictions</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
