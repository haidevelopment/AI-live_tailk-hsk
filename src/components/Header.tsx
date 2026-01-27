'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle, Layers, Menu, X, Settings } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeModal from './ThemeModal';

const navigation = [
  { name: 'Luyện nói HSK', href: '/hsk', icon: MessageCircle },
  { name: 'Flashcard', href: '/flashcard', icon: Layers },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <>
    <header className="sticky top-0 z-50 glass">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-mint-500 shadow-lg">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">
              <span className="text-primary-600">AI</span>
              <span className="text-dark-blue"> Live Talk</span>
            </span>
          </Link>

          {/* Right side - Navigation + Settings */}
          <div className="flex items-center gap-2">
            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:gap-1">
              {navigation.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all',
                      isActive
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Settings button */}
            <button
              type="button"
              className={cn(
                'rounded-lg p-2 transition-colors',
                'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
              )}
              onClick={() => setThemeModalOpen(true)}
              title="Cài đặt giao diện"
            >
              <Settings className="h-5 w-5" />
            </button>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            <div className="flex flex-col gap-1">
              {navigation.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-all',
                      isActive
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </header>

      {/* Theme Modal */}
      <ThemeModal isOpen={themeModalOpen} onClose={() => setThemeModalOpen(false)} />
    </>
  );
}
