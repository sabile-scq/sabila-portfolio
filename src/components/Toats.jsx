import React from 'react';
import { Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function Toast({ toast, message, type = 'info', isDark: propIsDark }) {
  const { isDark: themeIsDark } = useTheme();
  const isDark = propIsDark !== undefined ? propIsDark : themeIsDark;

  const actualMessage = typeof toast === 'string'
    ? toast
    : toast?.message || message;

  if (!actualMessage) return null;

  const actualType = toast?.type || type;
  const icons = { success: CheckCircle, error: AlertCircle, info: Sparkles };
  const Icon = icons[actualType] || Sparkles;

  return (
    <div
      className={`fixed top-20 right-6 z-[90] px-5 py-3.5 rounded-2xl shadow-lg border flex items-center gap-3 animate-reveal-up max-w-sm transition-all duration-300 ${
        isDark
          ? 'bg-[#202F46] border-[#C5A56A] text-[#E1E5EB]'
          : 'bg-[#FFFCF8] border-[#CFE3F2] text-[#2C2520]'
      }`}
    >
      <Icon
        className={`w-4 h-4 shrink-0 ${
          actualType === 'error'
            ? 'text-rose-500'
            : isDark
            ? 'text-[#C5A56A]'
            : 'text-[#5B7C99]'
        }`}
      />
      <span className="text-sm font-medium">{actualMessage}</span>
    </div>
  );
}

export default Toast;
