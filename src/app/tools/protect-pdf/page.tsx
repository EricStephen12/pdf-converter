'use client';

import { useState } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { ToolLayout } from '@/components/ToolLayout';
import { PDFDocument } from 'pdf-lib';

export default function ProtectPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleProtect = async () => {
    if (!file || !password) return;
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }
    
    setError('');
    setIsProcessing(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Note: pdf-lib doesn't support encryption directly
      // For real password protection, you'd need a backend with qpdf or similar
      // This demonstrates the UI flow - in production use a proper encryption library
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `protected_${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error protecting PDF:', error);
      setError('Failed to protect PDF');
    }
    setIsProcessing(false);
  };

  return (
    <ToolLayout
      title="Protect PDF"
      description="Add password protection to your PDF documents for security."
      icon="🔐"
      color="red"
    >
      {!file ? (
        <FileUploader accept=".pdf" onFilesSelected={(files) => setFile(files[0])} color="red" />
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center text-sm font-bold">
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

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-white block mb-2 font-medium">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-white/10 border border-white/20 text-white p-3 rounded-xl focus:outline-none focus:border-red-500 transition placeholder-gray-500" 
              />
            </div>
            <div>
              <label className="text-white block mb-2 font-medium">Confirm Password</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full bg-white/10 border border-white/20 text-white p-3 rounded-xl focus:outline-none focus:border-red-500 transition placeholder-gray-500" 
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
            <p className="text-yellow-400 text-sm">⚠️ Note: Full PDF encryption requires server-side processing. This is a demo of the UI flow.</p>
          </div>
          
          <button
            onClick={handleProtect}
            disabled={isProcessing || !password || !confirmPassword}
            className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-600 text-white py-4 rounded-xl font-semibold transition-all hover:scale-[1.02] hover:shadow-lg disabled:hover:scale-100"
          >
            {isProcessing ? 'Protecting...' : 'Protect PDF'}
          </button>
        </div>
      )}
    </ToolLayout>
  );
}
