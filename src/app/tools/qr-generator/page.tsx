'use client';

import { useState, useEffect, useCallback } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { generateQRCode, downloadQRCode } from '@/lib/qr-utils';

export default function QRGenerator() {
  const [text, setText] = useState('');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [size, setSize] = useState(256);
  const [color, setColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = useCallback(async () => {
    if (!text.trim()) {
      setQrCode(null);
      return;
    }
    
    setIsGenerating(true);
    try {
      const qr = await generateQRCode(text, { size, color, bgColor });
      setQrCode(qr);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    }
    setIsGenerating(false);
  }, [text, size, color, bgColor]);

  useEffect(() => {
    const timer = setTimeout(() => {
      generate();
    }, 300);
    return () => clearTimeout(timer);
  }, [generate]);

  const handleDownload = () => {
    if (qrCode) {
      downloadQRCode(qrCode, 'qrcode.png');
    }
  };

  const presets = [
    { label: 'URL', placeholder: 'https://example.com' },
    { label: 'Email', placeholder: 'mailto:hello@example.com' },
    { label: 'Phone', placeholder: 'tel:+1234567890' },
    { label: 'SMS', placeholder: 'sms:+1234567890?body=Hello' },
    { label: 'WiFi', placeholder: 'WIFI:T:WPA;S:NetworkName;P:Password;;' },
  ];

  return (
    <ToolLayout
      title="QR Code Generator"
      description="Create custom QR codes for URLs, text, contact info, WiFi credentials and more."
      icon="📱"
      color="indigo"
    >
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-2">Content</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter URL, text, or any content..."
              className="w-full h-32 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-2">Quick Presets</label>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setText(preset.placeholder)}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm text-gray-300 transition"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Size</label>
              <select
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value={128}>128 x 128</option>
                <option value={256}>256 x 256</option>
                <option value={512}>512 x 512</option>
                <option value={1024}>1024 x 1024</option>
              </select>
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">QR Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-12 h-12 rounded-lg cursor-pointer border-0"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 text-white text-sm"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-2">Background Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={bgColor === 'transparent' ? '#ffffff' : bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-12 h-12 rounded-lg cursor-pointer border-0"
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 text-white text-sm"
              />
              <button
                onClick={() => setBgColor('transparent')}
                className={`px-4 border rounded-xl text-sm transition ${
                  bgColor === 'transparent' 
                    ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' 
                    : 'bg-white/10 hover:bg-white/20 border-white/20 text-gray-300'
                }`}
              >
                Transparent
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center">
          {isGenerating ? (
            <div className="text-center text-gray-400">
              <div className="w-32 h-32 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                <span className="text-4xl">⏳</span>
              </div>
              <p>Generating...</p>
            </div>
          ) : qrCode ? (
            <>
              <div className="bg-white rounded-2xl p-4 mb-6 shadow-lg">
                <img src={qrCode} alt="QR Code" className="max-w-full" style={{ width: Math.min(size, 280) }} />
              </div>
              <p className="text-gray-400 text-sm mb-4">{size} x {size} pixels</p>
              <button
                onClick={handleDownload}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-4 rounded-xl font-semibold transition-all hover:scale-[1.02] hover:shadow-lg"
              >
                Download QR Code
              </button>
            </>
          ) : (
            <div className="text-center text-gray-500">
              <div className="w-32 h-32 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📱</span>
              </div>
              <p>Enter content to generate QR code</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
