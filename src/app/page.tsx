'use client';

import { ToolCard } from '@/components/ToolCard';

const pdfTools = [
  { id: 'merge-pdf', name: 'Merge PDF', description: 'Combine multiple PDFs into one', icon: '📑', color: 'from-red-500 to-orange-500', href: '/tools/merge-pdf' },
  { id: 'split-pdf', name: 'Split PDF', description: 'Extract pages from PDF', icon: '✂️', color: 'from-orange-500 to-yellow-500', href: '/tools/split-pdf' },
  { id: 'compress-pdf', name: 'Compress PDF', description: 'Reduce PDF file size', icon: '🗜️', color: 'from-yellow-500 to-green-500', href: '/tools/compress-pdf' },
  { id: 'rotate-pdf', name: 'Rotate PDF', description: 'Fix page orientation', icon: '🔄', color: 'from-green-500 to-teal-500', href: '/tools/rotate-pdf' },
  { id: 'watermark-pdf', name: 'Watermark PDF', description: 'Add text watermarks', icon: '💧', color: 'from-teal-500 to-cyan-500', href: '/tools/watermark-pdf' },
  { id: 'add-page-numbers', name: 'Page Numbers', description: 'Number your pages', icon: '🔢', color: 'from-cyan-500 to-blue-500', href: '/tools/add-page-numbers' },
  { id: 'protect-pdf', name: 'Protect PDF', description: 'Add password security', icon: '🔐', color: 'from-blue-500 to-indigo-500', href: '/tools/protect-pdf' },
  { id: 'pdf-to-jpg', name: 'PDF to JPG', description: 'Convert to JPG images', icon: '🖼️', color: 'from-indigo-500 to-purple-500', href: '/tools/pdf-to-jpg' },
  { id: 'pdf-to-png', name: 'PDF to PNG', description: 'High quality PNG export', icon: '🖼️', color: 'from-purple-500 to-pink-500', href: '/tools/pdf-to-png' },
  { id: 'jpg-to-pdf', name: 'Images to PDF', description: 'Create PDF from images', icon: '📄', color: 'from-pink-500 to-red-500', href: '/tools/jpg-to-pdf' },
];

const imageTools = [
  { id: 'jpg-to-png', name: 'JPG → PNG', description: 'Convert with transparency', icon: '🔄', color: 'from-cyan-500 to-blue-500', href: '/tools/jpg-to-png' },
  { id: 'png-to-jpg', name: 'PNG → JPG', description: 'Smaller file sizes', icon: '🔄', color: 'from-blue-500 to-indigo-500', href: '/tools/png-to-jpg' },
  { id: 'webp-convert', name: 'WebP Convert', description: 'Modern format conversion', icon: '🌐', color: 'from-indigo-500 to-purple-500', href: '/tools/webp-convert' },
  { id: 'resize-image', name: 'Resize Image', description: 'Any dimension you need', icon: '📐', color: 'from-purple-500 to-pink-500', href: '/tools/resize-image' },
  { id: 'crop-image', name: 'Crop Image', description: 'Trim to exact size', icon: '✂️', color: 'from-pink-500 to-red-500', href: '/tools/crop-image' },
  { id: 'compress-image', name: 'Compress Image', description: 'Optimize for web', icon: '⚡', color: 'from-red-500 to-orange-500', href: '/tools/compress-image' },
];

const stats = [
  { value: '100%', label: 'Free Forever' },
  { value: '0', label: 'Files Stored' },
  { value: '∞', label: 'Conversions' },
  { value: '<1s', label: 'Processing' },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="ConvertFlow" className="w-10 h-10 rounded-xl" />
            <span className="text-xl font-bold text-white">ConvertFlow</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#tools" className="text-gray-400 hover:text-white transition">Tools</a>
            <a href="#features" className="text-gray-400 hover:text-white transition">Features</a>

          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-pink-500/20" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-pink-500/30 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-4 py-24 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-gray-300">100% Free • No Sign Up • Privacy First</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Convert Files
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                In Seconds
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              The fastest way to convert PDFs and images. Everything runs in your browser — your files never leave your device.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <a href="#tools" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25">
                Start Converting — It&apos;s Free
              </a>
              <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg transition border border-white/20">
                See How It Works
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-24 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">PDF Tools</h2>
            <p className="text-gray-400 text-lg">Everything you need to work with PDFs</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-20">
            {pdfTools.map(tool => (
              <ToolCard key={tool.id} {...tool} />
            ))}
          </div>

          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Image Tools</h2>
            <p className="text-gray-400 text-lg">Convert and optimize your images</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {imageTools.map(tool => (
              <ToolCard key={tool.id} {...tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose ConvertFlow?</h2>
            <p className="text-gray-400 text-lg">Built for speed, privacy, and simplicity</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-8">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-2xl mb-6">
                🔒
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">100% Private</h3>
              <p className="text-gray-400">Files are processed locally in your browser. Nothing is uploaded to any server. Ever.</p>
            </div>
            
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-8">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-2xl mb-6">
                ⚡
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Lightning Fast</h3>
              <p className="text-gray-400">No upload/download wait times. Conversions happen instantly on your device.</p>
            </div>
            
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-8">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl mb-6">
                💎
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Free Forever</h3>
              <p className="text-gray-400">No hidden fees, no watermarks, no limits. Use all tools completely free.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-purple-900/50 to-pink-900/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Convert?</h2>
          <p className="text-gray-300 text-lg mb-8">Join thousands of users who trust ConvertFlow for their daily conversions.</p>
          <a href="#tools" className="inline-block bg-white text-slate-900 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition">
            Get Started — Free
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="ConvertFlow" className="w-8 h-8 rounded-lg" />
              <span className="font-semibold text-white">ConvertFlow</span>
            </div>
            <p className="text-gray-500 text-sm">© 2024 ConvertFlow. A subsidiary of Ricks Limited. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
