'use client';

import { useState } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { ToolLayout } from '@/components/ToolLayout';
import { PDFDocument, degrees } from 'pdf-lib';

export default function RotatePDF() {
  const [file, setFile] = useState<File | null>(null);
  const [rotation, setRotation] = useState(90);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRotate = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      
      pages.forEach(page => {
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees(currentRotation + rotation));
      });
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rotated_${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error rotating PDF:', error);
    }
    setIsProcessing(false);
  };

  return (
    <ToolLayout
      title="Rotate PDF"
      description="Rotate all pages in your PDF. Perfect for fixing scanned documents."
      icon="🔄"
      color="orange"
    >
      {!file ? (
        <FileUploader accept=".pdf" onFilesSelected={(files) => setFile(files[0])} color="red" />
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-sm font-bold">
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
            <p className="text-white font-medium mb-3">Rotation Angle</p>
            <div className="grid grid-cols-4 gap-2">
              {[90, 180, 270, -90].map((angle) => (
                <button
                  key={angle}
                  onClick={() => setRotation(angle)}
                  className={`py-3 px-4 rounded-xl font-medium transition-all ${
                    rotation === angle 
                      ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white' 
                      : 'bg-white/10 text-gray-400 hover:bg-white/20'
                  }`}
                >
                  {angle > 0 ? `${angle}° →` : `${Math.abs(angle)}° ←`}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={handleRotate}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 disabled:from-gray-600 disabled:to-gray-600 text-white py-4 rounded-xl font-semibold transition-all hover:scale-[1.02] hover:shadow-lg disabled:hover:scale-100"
          >
            {isProcessing ? 'Rotating...' : 'Rotate PDF'}
          </button>
        </div>
      )}
    </ToolLayout>
  );
}
