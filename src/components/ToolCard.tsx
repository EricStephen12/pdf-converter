import Link from 'next/link';

interface ToolCardProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  href: string;
  color?: string;
}

export function ToolCard({ name, description, icon, href, color = 'from-purple-500 to-pink-500' }: ToolCardProps) {
  return (
    <Link href={href}>
      <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer overflow-hidden">
        {/* Gradient glow on hover */}
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
        
        {/* Icon with gradient background */}
        <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        
        <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-white">
          {name}
        </h3>
        <p className="text-sm text-gray-400 group-hover:text-gray-300">{description}</p>
        
        {/* Arrow indicator */}
        <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-white/50">→</span>
        </div>
      </div>
    </Link>
  );
}
