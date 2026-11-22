import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label="Ganti Tema Light atau Dark Mode"
      className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium border transition-all duration-300 hover:scale-105 ${
        isDark
          ? 'bg-[#202F46] border-[#C5A56A]/50 text-[#D8C49A] hover:bg-[#293A52]'
          : 'bg-[#F5E9BE] border-[#2C2520]/15 text-[#2C2520] hover:bg-[#FAF0D8]'
      } ${className}`}
    >
      {isDark ? (
        <>
          <Sun className="w-4 h-4 text-[#C5A56A]" />
          <span className="hidden sm:inline">Light Mode</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-[#2C2520]" />
          <span className="hidden sm:inline">Dark Mode</span>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;
