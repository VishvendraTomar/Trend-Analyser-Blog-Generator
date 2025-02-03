"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconConfiguration, IconExecution } from './icons';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <nav className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-30">
        <div className="sticky top-0 z-10 bg-white p-5 border-b border-gray-200">
          <h1 className="text-xl font-bold text-red-600">Article AI</h1>
          <p className="text-xs text-gray-500 mt-1">Content Generation Platform</p>
        </div>
        
        <div className="p-3 space-y-1">
          <Link 
            href="/execution" 
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors
                     ${isActive('/execution') 
                       ? 'bg-red-50 text-red-600' 
                       : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            <IconExecution className="w-4 h-4" />
            <span>Execution</span>
          </Link>
          <Link 
            href="/configuration" 
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors
                     ${isActive('/configuration') 
                       ? 'bg-red-50 text-red-600' 
                       : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            <IconConfiguration className="w-4 h-4" />
            <span>Configuration</span>
          </Link>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 ml-64">
        <div className="mx-auto max-w-5xl p-6">
          {children}
        </div>
      </main>
    </div>
  );
} 