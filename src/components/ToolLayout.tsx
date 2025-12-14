'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { AdBanner } from './AdBanner';

interface ToolLayoutProps {
  title: string;
  description: string;
  icon: string;
  color: 'red' | 'orange' | 'yellow' | 'green' | 'teal' | 'cyan' | 'blue' | 'indigo' | 'purple' | 'pink';
  children: ReactNode;
}

const colorMap = {
  red: { gradient: 'from-red-500/10 to-orange-500/10', blob1: 'bg-red-500/20', blob2: 'bg-orange-500/20', icon: 'from-red-500 to-orange-500' },
  orange: { gradient: 'from-orange-500/10 to-yellow-500/10', blob1: 'bg-orange-500/20', blob2: 'bg-yellow-500/20', icon: 'from-orange-500 to-yellow-500' },
  yellow: { gradient: 'from-yellow-500/10 to-green-500/10', blob1: 'bg-yellow-500/20', blob2: 'bg-green-500/20', icon: 'from-yellow-500 to-green-500' },
  green: { gradient: 'from-green-500/10 to-teal-500/10', blob1: 'bg-green-500/20', blob2: 'bg-teal-500/20', icon: 'from-green-500 to-teal-500' },
  teal: { gradient: 'from-teal-500/10 to-cyan-500/10', blob1: 'bg-teal-500/20', blob2: 'bg-cyan-500/20', icon: 'from-teal-500 to-cyan-500' },
  cyan: { gradient: 'from-cyan-500/10 to-blue-500/10', blob1: 'bg-cyan-500/20', blob2: 'bg-blue-500/20', icon: 'from-cyan-500 to-blue-500' },
  blue: { gradient: 'from-blue-500/10 to-indigo-500/10', blob1: 'bg-blue-500/20', blob2: 'bg-indigo-500/20', icon: 'from-blue-500 to-indigo-500' },
  indigo: { gradient: 'from-indigo-500/10 to-purple-500/10', blob1: 'bg-indigo-500/20', blob2: 'bg-purple-500/20', icon: 'from-indigo-500 to-purple-500' },
  purple: { gradient: 'from-purple-500/10 to-pink-500/10', blob1: 'bg-purple-500/20', blob2: 'bg-pink-500/20', icon: 'from-purple-500 to-pink-500' },
  pink: { gradient: 'from-pink-500/10 to-red-500/10', blob1: 'bg-pink-500/20', blob2: 'bg-red-500/20', icon: 'from-pink-500 to-red-500' },
};

export function ToolLayout({ title, description, icon, color, children }: ToolLayoutProps) {
  const colors = colorMap[color];

  return (
    <main className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="FileForge" className="w-10 h-10 rounded-xl" />
            <span className="text-xl font-bold text-white">FileForge</span>
          </Link>
          <Link href="/" className="text-gray-400 hover:text-white transition flex items-center gap-2">
            ← All Tools
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-16 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient}`} />
        <div className={`absolute top-10 left-10 w-72 h-72 ${colors.blob1} rounded-full blur-[100px]`} />
        <div className={`absolute bottom-10 right-10 w-72 h-72 ${colors.blob2} rounded-full blur-[100px]`} />
        
        <div className="container mx-auto px-4 max-w-4xl relative">
          <div className="text-center mb-12">
            <div className={`w-20 h-20 bg-gradient-to-br ${colors.icon} rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6`}>
              {icon}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">{description}</p>
          </div>

          {children}

          {/* Ad Banner */}
          <div className="mt-8">
            <AdBanner slot="bottom" />
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">🔒</div>
              <p className="text-white text-sm font-medium">100% Private</p>
              <p className="text-gray-500 text-xs">Files never leave your device</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">⚡</div>
              <p className="text-white text-sm font-medium">Instant Processing</p>
              <p className="text-gray-500 text-xs">No upload wait times</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">♾️</div>
              <p className="text-white text-sm font-medium">Unlimited</p>
              <p className="text-gray-500 text-xs">No file limits or restrictions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">© 2024 FileForge. A subsidiary of Ricks Limited. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
