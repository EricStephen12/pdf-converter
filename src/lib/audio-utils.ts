'use client';

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;
let loaded = false;
let loading = false;

async function getFFmpeg(): Promise<FFmpeg> {
  if (ffmpeg && loaded) return ffmpeg;
  if (loading) {
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

export async function convertAudio(
  file: File,
  outputFormat: 'mp3' | 'wav' | 'm4a' | 'ogg' | 'flac',
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const ff = await getFFmpeg();
  
  if (onProgress) {
    ff.on('progress', ({ progress }) => onProgress(Math.round(progress * 100)));
  }
  
  const inputExt = file.name.split('.').pop() || 'mp3';
  const inputName = `input.${inputExt}`;
  const outputName = `output.${outputFormat}`;
  
  await ff.writeFile(inputName, await fetchFile(file));
  
  // Convert with appropriate settings for each format
  if (outputFormat === 'mp3') {
    await ff.exec(['-i', inputName, '-q:a', '2', outputName]);
  } else if (outputFormat === 'wav') {
    await ff.exec(['-i', inputName, outputName]);
  } else if (outputFormat === 'ogg') {
    await ff.exec(['-i', inputName, '-q:a', '5', outputName]);
  } else if (outputFormat === 'flac') {
    await ff.exec(['-i', inputName, outputName]);
  } else {
    await ff.exec(['-i', inputName, '-b:a', '192k', outputName]);
  }
  
  const data = await ff.readFile(outputName);
  
  // Cleanup
  await ff.deleteFile(inputName);
  await ff.deleteFile(outputName);
  
  const mimeTypes: Record<string, string> = {
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    m4a: 'audio/mp4',
    ogg: 'audio/ogg',
    flac: 'audio/flac'
  };
  
  return new Blob([data], { type: mimeTypes[outputFormat] });
}

export async function compressAudio(
  file: File,
  bitrate: '64' | '128' | '192' | '320',
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const ff = await getFFmpeg();
  
  if (onProgress) {
    ff.on('progress', ({ progress }) => onProgress(Math.round(progress * 100)));
  }
  
  const inputExt = file.name.split('.').pop() || 'mp3';
  const inputName = `input.${inputExt}`;
  const outputName = 'output.mp3';
  
  await ff.writeFile(inputName, await fetchFile(file));
  await ff.exec(['-i', inputName, '-b:a', `${bitrate}k`, outputName]);
  
  const data = await ff.readFile(outputName);
  
  // Cleanup
  await ff.deleteFile(inputName);
  await ff.deleteFile(outputName);
  
  return new Blob([data], { type: 'audio/mpeg' });
}

export async function trimAudio(
  file: File,
  startTime: number,
  endTime: number,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const ff = await getFFmpeg();
  
  if (onProgress) {
    ff.on('progress', ({ progress }) => onProgress(Math.round(progress * 100)));
  }
  
  const ext = file.name.split('.').pop() || 'mp3';
  const inputName = `input.${ext}`;
  const outputName = `output.${ext}`;
  
  await ff.writeFile(inputName, await fetchFile(file));
  
  const duration = endTime - startTime;
  await ff.exec([
    '-i', inputName,
    '-ss', startTime.toString(),
    '-t', duration.toString(),
    '-c', 'copy',
    outputName
  ]);
  
  const data = await ff.readFile(outputName);
  
  // Cleanup
  await ff.deleteFile(inputName);
  await ff.deleteFile(outputName);
  
  return new Blob([data], { type: file.type || 'audio/mpeg' });
}
