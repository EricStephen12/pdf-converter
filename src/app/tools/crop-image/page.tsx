'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { ToolLayout } from '@/components/ToolLayout';

export default function CropImage() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });
  const [cropBox, setCropBox] = useState({ x: 50, y: 50, width: 200, height: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setImageLoaded(false);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const handleImageLoad = () => {
    if (imageRef.current) {
      const img = imageRef.current;
      setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
      setDisplaySize({ width: img.offsetWidth, height: img.offsetHeight });
      
      const boxWidth = img.offsetWidth * 0.6;
      const boxHeight = img.offsetHeight * 0.6;
      setCropBox({
        x: (img.offsetWidth - boxWidth) / 2,
        y: (img.offsetHeight - boxHeight) / 2,
        width: boxWidth,
        height: boxHeight
      });
      setImageLoaded(true);
    }
  };

  const getMousePos = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (!imageContainerRef.current) return { x: 0, y: 0 };
    const rect = imageContainerRef.current.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(e.clientX - rect.left, displaySize.width)),
      y: Math.max(0, Math.min(e.clientY - rect.top, displaySize.height))
    };
  }, [displaySize]);

  const handleMouseDown = (e: React.MouseEvent, action: string) => {
    e.preventDefault();
    e.stopPropagation();
    const pos = getMousePos(e);
    setDragStart({ x: pos.x - cropBox.x, y: pos.y - cropBox.y });
    if (action === 'move') {
      setIsDragging(true);
    } else {
      setIsResizing(action);
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging && !isResizing) return;
    const pos = getMousePos(e);
    
    if (isDragging) {
      let newX = pos.x - dragStart.x;
      let newY = pos.y - dragStart.y;
      newX = Math.max(0, Math.min(newX, displaySize.width - cropBox.width));
      newY = Math.max(0, Math.min(newY, displaySize.height - cropBox.height));
      setCropBox(prev => ({ ...prev, x: newX, y: newY }));
    } else if (isResizing) {
      let { x, y, width, height } = cropBox;
      const minSize = 30;
      
      if (isResizing.includes('e')) {
        width = Math.max(minSize, Math.min(pos.x - x, displaySize.width - x));
      }
      if (isResizing.includes('w')) {
        const newX = Math.max(0, Math.min(pos.x, x + width - minSize));
        width = width + (x - newX);
        x = newX;
      }
      if (isResizing.includes('s')) {
        height = Math.max(minSize, Math.min(pos.y - y, displaySize.height - y));
      }
      if (isResizing.includes('n')) {
        const newY = Math.max(0, Math.min(pos.y, y + height - minSize));
        height = height + (y - newY);
        y = newY;
      }
      setCropBox({ x, y, width, height });
    }
  }, [isDragging, isResizing, dragStart, cropBox, displaySize, getMousePos]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(null);
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const handleCrop = async () => {
    if (!file || !canvasRef.current) return;
    setIsProcessing(true);
    try {
      const scaleX = imageSize.width / displaySize.width;
      const scaleY = imageSize.height / displaySize.height;
      const realCrop = {
        x: cropBox.x * scaleX,
        y: cropBox.y * scaleY,
        width: cropBox.width * scaleX,
        height: cropBox.height * scaleY
      };
      
      const canvas = canvasRef.current;
      canvas.width = realCrop.width;
      canvas.height = realCrop.height;
      const ctx = canvas.getContext('2d')!;
      
      const img = new Image();
      img.src = imageUrl;
      await new Promise(resolve => img.onload = resolve);
      
      ctx.drawImage(img, realCrop.x, realCrop.y, realCrop.width, realCrop.height, 0, 0, realCrop.width, realCrop.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `cropped_${file.name}`;
          a.click();
          URL.revokeObjectURL(url);
        }
      }, file.type || 'image/png');
    } catch (error) {
      console.error('Error cropping image:', error);
    }
    setIsProcessing(false);
  };

  const scaleX = imageSize.width / displaySize.width || 1;
  const scaleY = imageSize.height / displaySize.height || 1;
  const realWidth = Math.round(cropBox.width * scaleX);
  const realHeight = Math.round(cropBox.height * scaleY);

  return (
    <ToolLayout title="Crop Image" description="Drag the corners or edges to select the area you want to keep." icon="✂️" color="green">
      <canvas ref={canvasRef} className="hidden" />
      
      {!file ? (
        <FileUploader accept="image/*" onFilesSelected={(files) => setFile(files[0])} color="green" />
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-sm font-bold">IMG</div>
              <div>
                <p className="text-white font-medium">{file.name}</p>
                <p className="text-gray-500 text-sm">{imageSize.width} × {imageSize.height} px</p>
              </div>
            </div>
            <button onClick={() => setFile(null)} className="text-gray-400 hover:text-white transition text-sm">Change</button>
          </div>

          <div className="flex justify-center bg-black/30 rounded-xl p-4 mb-4">
            <div ref={imageContainerRef} className="relative select-none" style={{ width: displaySize.width || 'auto', height: displaySize.height || 'auto' }}>
              <img ref={imageRef} src={imageUrl} alt="Preview" className="block max-w-full max-h-[400px]" onLoad={handleImageLoad} draggable={false} />
              
              {imageLoaded && (
                <>
                  <div className="absolute left-0 right-0 top-0 bg-black/60 pointer-events-none" style={{ height: cropBox.y }} />
                  <div className="absolute left-0 right-0 bottom-0 bg-black/60 pointer-events-none" style={{ height: displaySize.height - cropBox.y - cropBox.height }} />
                  <div className="absolute left-0 bg-black/60 pointer-events-none" style={{ top: cropBox.y, width: cropBox.x, height: cropBox.height }} />
                  <div className="absolute right-0 bg-black/60 pointer-events-none" style={{ top: cropBox.y, width: displaySize.width - cropBox.x - cropBox.width, height: cropBox.height }} />
                  
                  <div className="absolute border-2 border-white shadow-lg cursor-move" style={{ left: cropBox.x, top: cropBox.y, width: cropBox.width, height: cropBox.height }} onMouseDown={(e) => handleMouseDown(e, 'move')}>
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/40" />
                      <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/40" />
                      <div className="absolute top-1/3 left-0 right-0 h-px bg-white/40" />
                      <div className="absolute top-2/3 left-0 right-0 h-px bg-white/40" />
                    </div>
                    
                    <div className="absolute -top-2 -left-2 w-4 h-4 bg-white rounded-sm cursor-nw-resize shadow-md" onMouseDown={(e) => handleMouseDown(e, 'nw')} />
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-sm cursor-ne-resize shadow-md" onMouseDown={(e) => handleMouseDown(e, 'ne')} />
                    <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-white rounded-sm cursor-sw-resize shadow-md" onMouseDown={(e) => handleMouseDown(e, 'sw')} />
                    <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-white rounded-sm cursor-se-resize shadow-md" onMouseDown={(e) => handleMouseDown(e, 'se')} />
                    
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-3 bg-white rounded-sm cursor-n-resize shadow-md" onMouseDown={(e) => handleMouseDown(e, 'n')} />
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-3 bg-white rounded-sm cursor-s-resize shadow-md" onMouseDown={(e) => handleMouseDown(e, 's')} />
                    <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-8 bg-white rounded-sm cursor-w-resize shadow-md" onMouseDown={(e) => handleMouseDown(e, 'w')} />
                    <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-8 bg-white rounded-sm cursor-e-resize shadow-md" onMouseDown={(e) => handleMouseDown(e, 'e')} />
                  </div>
                  
                  <div className="absolute left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap" style={{ top: cropBox.y + cropBox.height + 10 }}>
                    {realWidth} × {realHeight}
                  </div>
                </>
              )}
            </div>
          </div>

          <p className="text-gray-400 text-sm text-center mb-4">Drag to move • Drag corners/edges to resize</p>
          
          <button onClick={handleCrop} disabled={isProcessing} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-gray-600 disabled:to-gray-600 text-white py-4 rounded-xl font-semibold transition-all hover:scale-[1.02] hover:shadow-lg disabled:hover:scale-100">
            {isProcessing ? 'Cropping...' : `Crop to ${realWidth} × ${realHeight}`}
          </button>
        </div>
      )}
    </ToolLayout>
  );
}
