import QRCode from 'qrcode';

export interface QROptions {
  size?: number;
  margin?: number;
  color?: string;
  bgColor?: string;
  errorCorrection?: 'L' | 'M' | 'Q' | 'H';
}

export async function generateQRCode(text: string, options: QROptions = {}): Promise<string> {
  const {
    size = 256,
    margin = 2,
    color = '#000000',
    bgColor = '#ffffff',
    errorCorrection = 'M',
  } = options;

  try {
    const dataUrl = await QRCode.toDataURL(text, {
      width: size,
      margin: margin,
      color: {
        dark: color,
        light: bgColor === 'transparent' ? '#00000000' : bgColor,
      },
      errorCorrectionLevel: errorCorrection,
    });
    return dataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}

export function downloadQRCode(dataUrl: string, filename: string = 'qrcode.png') {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export async function generateQRCodeSVG(text: string, options: QROptions = {}): Promise<string> {
  const {
    margin = 2,
    color = '#000000',
    bgColor = '#ffffff',
    errorCorrection = 'M',
  } = options;

  try {
    const svg = await QRCode.toString(text, {
      type: 'svg',
      margin: margin,
      color: {
        dark: color,
        light: bgColor === 'transparent' ? '#00000000' : bgColor,
      },
      errorCorrectionLevel: errorCorrection,
    });
    return svg;
  } catch (error) {
    console.error('Error generating QR code SVG:', error);
    throw error;
  }
}
