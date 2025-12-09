'use client';

import { useState } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { ToolLayout } from '@/components/ToolLayout';
import { PDFDocument } from 'pdf-lib';

export default function JpgToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);

    try {
      const pdfDoc = await PDFDocument.create();

      for (const file of files) {
        const imageBytes = await file.arrayBuffer();
        let image;
        
        if (file.type === 'image/png') {
          image = await pdfDoc.embedPng(imageBytes);
        } else {
          image = await pdfDoc.embedJpg(imageBytes);
        }

        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'images.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error creating PDF:', error);
    }
    setIsProcessing(false);
  };

  return (
    <ToolLayout
      title="Images to PDF"
      description="Convert your JPG, JPEG, or PNG images into a single PDF document."
      icon="📄"
      color="teal"
    >
      <FileUploader 
        accept=".jpg,.jpeg,.png" 
        multiple 
        onFilesSelected={(newFiles) => setFiles([...files, ...newFiles])} 
        color="green"
      />

      {files.length > 0 && (
        <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Selected Images</h3>
            <span className="text-gray-400 text-sm">{files.length} images</span>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-4 group hover:bg-white/10 transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center text-xs font-bold">
                    IMG
                  </div>
                  <div>
                    <p className="text-white truncate max-w-xs">{file.name}</p>
                    <p className="text-gray-500 text-sm">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button onClick={() => removeFile(index)} className="text-gray-500 hover:text-red-400 transition p-2">
                  ✕
                </button>
              </div>
            ))}
          </div>
          
          <button
            onClick={handleConvert}
            disabled={isProcessing}
            className="mt-6 w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-600 text-white py-4 rounded-xl font-semibold transition-all hover:scale-[1.02] hover:shadow-lg disabled:hover:scale-100"
          >
            {isProcessing ? 'Creating PDF...' : `Create PDF from ${files.length} Images`}
          </button>
        </div>
      )}
    </ToolLayout>
  );
}
