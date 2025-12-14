'use client';

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;
let loaded = false;
let loading = false;

export async function getFFmpeg(): Promise<FFmpeg> {
  if (ffmpeg && loaded) return ffmpeg;
  if (loading) {
    // Wait for loading to complete
    while (loading) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (ffmpeg && loaded) return ffmpeg;
  }
  
  loading = true;
  ffmpeg = new FFmpeg();
  
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
  
  try {
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    loaded = true;
  } catch (error) {
    loading = false;
    throw error;
  }
  
  loading = false;
  return ffmpeg;
}

export async function convertVideo(
  file: File,
  outputFormat: string,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const ff = await getFFmpeg();
  
  if (onProgress) {
    ff.on('progress', ({ progress }) => onProgress(Math.round(progress * 100)));
  }
  
  const inputExt = file.name.split('.').pop() || 'mp4';
  const inputName = `input.${inputExt}`;
  const outputName = `output.${outputFormat}`;
  
  await ff.writeFile(inputName, await fetchFile(file));
  
  // Use copy codec when possible for speed, otherwise re-encode
  if (outputFormat === 'mp4') {
    await ff.exec(['-i', inputName, '-c', 'copy', '-movflags', '+faststart', outputName]);
  } else if (outputFormat === 'webm') {
    await ff.exec(['-i', inputName, '-c:v', 'libvpx', '-c:a', 'libvorbis', '-q:v', '10', outputName]);
  } else {
    await ff.exec(['-i', inputName, '-c', 'copy', outputName]);
  }
  
  const data = await ff.readFile(outputName);
  
  // Cleanup
  await ff.deleteFile(inputName);
  await ff.deleteFile(outputName);
  
  const mimeTypes: Record<string, string> = {
    mp4: 'video/mp4',
    webm: 'video/webm',
    avi: 'video/x-msvideo',
    mov: 'video/quicktime',
  };
  
  return new Blob([data], { type: mimeTypes[outputFormat] || 'video/mp4' });
}

export async function compressVideo(
  file: File,
  quality: 'low' | 'medium' | 'high',
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const ff = await getFFmpeg();
  
  if (onProgress) {
    ff.on('progress', ({ progress }) => onProgress(Math.round(progress * 100)));
  }
  
  // Use different bitrates for compression
  const videoBitrate = quality === 'low' ? '500k' : quality === 'medium' ? '1000k' : '2000k';
  const audioBitrate = quality === 'low' ? '64k' : quality === 'medium' ? '128k' : '192k';
  
  const inputExt = file.name.split('.').pop() || 'mp4';
  const inputName = `input.${inputExt}`;
  const outputName = 'output.mp4';
  
  await ff.writeFile(inputName, await fetchFile(file));
  await ff.exec([
    '-i', inputName,
    '-b:v', videoBitrate,
    '-b:a', audioBitrate,
    '-movflags', '+faststart',
    outputName
  ]);
  
  const data = await ff.readFile(outputName);
  
  // Cleanup
  await ff.deleteFile(inputName);
  await ff.deleteFile(outputName);
  
  return new Blob([data], { type: 'video/mp4' });
}

export async function extractAudio(
  file: File,
  format: 'mp3' | 'wav' | 'm4a',
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const ff = await getFFmpeg();
  
  if (onProgress) {
    ff.on('progress', ({ progress }) => onProgress(Math.round(progress * 100)));
  }
  
  const inputExt = file.name.split('.').pop() || 'mp4';
  const inputName = `input.${inputExt}`;
  const outputName = `output.${format}`;
  
  await ff.writeFile(inputName, await fetchFile(file));
  
  // Extract audio with appropriate codec
  if (format === 'mp3') {
    await ff.exec(['-i', inputName, '-vn', '-q:a', '2', outputName]);
  } else if (format === 'wav') {
    await ff.exec(['-i', inputName, '-vn', outputName]);
  } else {
    await ff.exec(['-i', inputName, '-vn', '-c:a', 'copy', outputName]);
  }
  
  const data = await ff.readFile(outputName);
  
  // Cleanup
  await ff.deleteFile(inputName);
  await ff.deleteFile(outputName);
  
  const mimeTypes = { mp3: 'audio/mpeg', wav: 'audio/wav', m4a: 'audio/mp4' };
  return new Blob([data], { type: mimeTypes[format] });
}
