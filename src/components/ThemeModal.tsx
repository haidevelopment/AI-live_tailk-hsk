'use client';

import { X, Check, Palette } from 'lucide-react';
import { useTheme, ThemeColors } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ThemeModal({ isOpen, onClose }: ThemeModalProps) {
  const { theme, setTheme, themes } = useTheme();

  if (!isOpen) return null;

  const handleThemeSelect = (themeId: string) => {
    setTheme(themeId);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`
              }}
            >
              <Palette className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">选择主题</h2>
              <p className="text-sm text-slate-500">Chọn màu sắc cho ứng dụng</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Theme Grid */}
        <div className="p-6">
          <div className="grid grid-cols-3 gap-3">
            {themes.map((t) => (
              <ThemeCard
                key={t.id}
                themeOption={t}
                isSelected={theme.id === t.id}
                onClick={() => handleThemeSelect(t.id)}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center">
            主题会自动保存到本地 • Theme sẽ được lưu tự động
          </p>
        </div>
      </div>
    </div>
  );
}

interface ThemeCardProps {
  themeOption: ThemeColors;
  isSelected: boolean;
  onClick: () => void;
}

function ThemeCard({ themeOption, isSelected, onClick }: ThemeCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative p-3 rounded-xl border-2 transition-all duration-200',
        'hover:scale-105 hover:shadow-lg',
        isSelected
          ? 'border-slate-900 shadow-md'
          : 'border-slate-200 hover:border-slate-300'
      )}
    >
      {/* Color Preview - Using inline style for dynamic colors */}
      <div
        className="h-14 rounded-lg mb-2"
        style={{
          background: `linear-gradient(135deg, ${themeOption.primary}, ${themeOption.primaryDark})`
        }}
      />

      {/* Theme Info */}
      <div className="text-left">
        <p className="font-medium text-slate-900 text-sm">{themeOption.nameZh}</p>
        <p className="text-xs text-slate-500">{themeOption.name}</p>
      </div>

      {/* Selected Indicator */}
      {isSelected && (
        <div
          className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${themeOption.primary}, ${themeOption.primaryDark})`
          }}
        >
          <Check className="h-3 w-3 text-white" />
        </div>
      )}
    </button>
  );
}
