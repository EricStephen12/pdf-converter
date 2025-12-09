'use client';

import { useState } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { ToolLayout } from '@/components/ToolLayout';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';

export default function WatermarkPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [opacity, setOpacity] = useState(30);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleWatermark = async () => {
    if (!file || !watermarkText) return;
    setIsProcessing(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      pages.forEach((page) => {
        const { width, height } = page.getSize();
        const fontSize = Math.min(width, height) / 8;
        const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);
        
        page.drawText(watermarkText, {
          x: (width - textWidth) / 2,
          y: height / 2,
          size: fontSize,
          font,
          color: rgb(0.7, 0.7, 0.7),
          opacity: opacity / 100,
          rotate: degrees(-45),
        });
      });
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `watermarked_${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error adding watermark:', error);
    }
    setIsProcessing(false);
  };

  const presets = ['CONFIDENTIAL', 'DRAFT', 'COPY', 'SAMPLE', 'DO NOT COPY'];

  return (
    <ToolLayout
      title="Watermark PDF"
      description="Add a text watermark to all pages of your PDF document."
      icon="💧"
      color="cyan"
    >
      {!file ? (
        <FileUploader accept=".pdf" onFilesSelected={(files) => setFile(files[0])} color="blue" />
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center text-sm font-bold">
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

          <div className="mb-4">
            <label className="text-white block mb-2 font-medium">Watermark Text</label>
            <input 
              type="text" 
              value={watermarkText}
              onChange={(e) => setWatermarkText(e.target.value.toUpperCase())}
              placeholder="Enter watermark text"
              className="w-full bg-white/10 border border-white/20 text-white p-3 rounded-xl focus:outline-none focus:border-cyan-500 transition placeholder-gray-500" 
            />
          </div>

          <div className="mb-6">
            <p className="text-gray-400 text-sm mb-2">Quick presets:</p>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setWatermarkText(preset)}
                  className={`px-3 py-1 rounded-lg text-sm transition ${
                    watermarkText === preset 
                      ? 'bg-cyan-600 text-white' 
                      : 'bg-white/10 text-gray-400 hover:bg-white/20'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <label className="text-white font-medium">Opacity</label>
              <span className="text-gray-400">{opacity}%</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="80" 
              value={opacity} 
              onChange={(e) => setOpacity(Number(e.target.value))} 
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500" 
            />
          </div>
          
          <button
            onClick={handleWatermark}
            disabled={isProcessing || !watermarkText}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-600 text-white py-4 rounded-xl font-semibold transition-all hover:scale-[1.02] hover:shadow-lg disabled:hover:scale-100"
          >
            {isProcessing ? 'Adding Watermark...' : 'Add Watermark'}
          </button>
        </div>
      )}
    </ToolLayout>
  );
}
