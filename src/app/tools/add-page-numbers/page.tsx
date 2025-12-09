'use client';

import { useState } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { ToolLayout } from '@/components/ToolLayout';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

type Position = 'bottom-center' | 'bottom-right' | 'bottom-left' | 'top-center' | 'top-right' | 'top-left';

export default function AddPageNumbers() {
  const [file, setFile] = useState<File | null>(null);
  const [position, setPosition] = useState<Position>('bottom-center');
  const [startNumber, setStartNumber] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const positions: { value: Position; label: string }[] = [
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'bottom-center', label: 'Bottom Center' },
    { value: 'bottom-right', label: 'Bottom Right' },
    { value: 'top-left', label: 'Top Left' },
    { value: 'top-center', label: 'Top Center' },
    { value: 'top-right', label: 'Top Right' },
  ];

  const handleAddNumbers = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      
      pages.forEach((page, index) => {
        const { width, height } = page.getSize();
        const pageNum = `${startNumber + index}`;
        const textWidth = font.widthOfTextAtSize(pageNum, 12);
        
        let x: number, y: number;
        
        switch (position) {
          case 'bottom-left':
            x = 40; y = 30; break;
          case 'bottom-center':
            x = (width - textWidth) / 2; y = 30; break;
          case 'bottom-right':
            x = width - 40 - textWidth; y = 30; break;
          case 'top-left':
            x = 40; y = height - 40; break;
          case 'top-center':
            x = (width - textWidth) / 2; y = height - 40; break;
          case 'top-right':
            x = width - 40 - textWidth; y = height - 40; break;
        }
        
        page.drawText(pageNum, {
          x, y,
          size: 12,
          font,
          color: rgb(0.3, 0.3, 0.3),
        });
      });
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `numbered_${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error adding page numbers:', error);
    }
    setIsProcessing(false);
  };

  return (
    <ToolLayout
      title="Add Page Numbers"
      description="Add page numbers to your PDF documents. Choose position and starting number."
      icon="🔢"
      color="blue"
    >
      {!file ? (
        <FileUploader accept=".pdf" onFilesSelected={(files) => setFile(files[0])} color="blue" />
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-sm font-bold">
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

          <div className="mb-6">
            <label className="text-white block mb-3 font-medium">Position</label>
            <div className="grid grid-cols-3 gap-2">
              {positions.map((pos) => (
                <button
                  key={pos.value}
                  onClick={() => setPosition(pos.value)}
                  className={`py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                    position === pos.value 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
                      : 'bg-white/10 text-gray-400 hover:bg-white/20'
                  }`}
                >
                  {pos.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="text-white block mb-2 font-medium">Start from number</label>
            <input 
              type="number" 
              value={startNumber}
              onChange={(e) => setStartNumber(Number(e.target.value))}
              min={1}
              className="w-full bg-white/10 border border-white/20 text-white p-3 rounded-xl focus:outline-none focus:border-blue-500 transition" 
            />
          </div>
          
          <button
            onClick={handleAddNumbers}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-gray-600 disabled:to-gray-600 text-white py-4 rounded-xl font-semibold transition-all hover:scale-[1.02] hover:shadow-lg disabled:hover:scale-100"
          >
            {isProcessing ? 'Adding Numbers...' : 'Add Page Numbers'}
          </button>
        </div>
      )}
    </ToolLayout>
  );
}
