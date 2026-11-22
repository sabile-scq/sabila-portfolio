import React, { useState } from 'react';
import { Lock, AlertCircle, Info, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const AdminLogin = ({ onSuccess, onNotify }) => {
  const { signIn, isConfigured } = useAuth();
  const { isDark } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isConfigured) {
      setError('Supabase belum dikonfigurasi di environment (.env). Harap isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY terlebih dahulu.');
      return;
    }

    setIsSubmitting(true);
    try {
      await signIn(email, password);
      onNotify('Autentikasi berhasil. Selamat datang di Studio Admin, Sabila.');
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Gagal masuk. Periksa kembali email dan password Anda.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 sm:p-14 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto">
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 ${
          isDark ? 'bg-[#202F46] text-[#C5A56A]' : 'bg-[#F3DDE3] text-[#2C2520]'
        }`}
      >
        <Lock className="w-7 h-7" />
      </div>

      <h4 className="font-editorial text-3xl font-semibold mb-2">
        Studio Admin Login
      </h4>

      <p className={`text-sm mb-6 ${isDark ? 'text-[#C7CED8]' : 'text-[#5A514B]'}`}>
        Masuk menggunakan email dan password terdaftar pada Supabase Auth &amp; tabel admin_users untuk mengelola konten dan media portofolio.
      </p>

      {!isConfigured && (
        <div
          className={`w-full mb-6 p-4 rounded-2xl border text-left flex items-start gap-3 ${
            isDark
              ? 'bg-[#202F46] border-[#C5A56A]/40 text-[#D8C49A]'
              : 'bg-[#FAF0D8] border-[#F5E9BE] text-[#2C2520]'
          }`}
        >
          <Info className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-semibold">Konfigurasi Supabase Diperlukan</p>
            <p>
              Supabase belum dihubungkan pada berkas <code className="font-mono">.env</code>.
              Data publik saat ini berjalan dari data inisial lokal. Isi <code className="font-mono">VITE_SUPABASE_URL</code> dan <code className="font-mono">VITE_SUPABASE_ANON_KEY</code> untuk mengaktifkan login admin cloud.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="w-full mb-4 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-500 text-xs flex items-center gap-2 text-left">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Admin (contoh: sabilatgr06@gmail.com)"
            className={`w-full px-4 py-3.5 rounded-2xl border text-sm focus:outline-none transition-colors ${
              isDark
                ? 'bg-[#202F46] border-[#293A52] text-[#E1E5EB] focus:border-[#C5A56A]'
                : 'bg-[#FFF9F0] border-[#CFE3F2] text-[#2C2520] focus:border-[#2C2520]'
            }`}
          />
        </div>

        <div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password Akun Admin"
            className={`w-full px-4 py-3.5 rounded-2xl border text-sm focus:outline-none transition-colors ${
              isDark
                ? 'bg-[#202F46] border-[#293A52] text-[#E1E5EB] focus:border-[#C5A56A]'
                : 'bg-[#FFF9F0] border-[#CFE3F2] text-[#2C2520] focus:border-[#2C2520]'
            }`}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3.5 rounded-full text-sm font-semibold tracking-wide transition-all shadow-md ${
            isDark
              ? 'bg-[#C5A56A] text-[#17243A] hover:bg-[#D8C49A] disabled:opacity-50'
              : 'bg-[#2C2520] text-[#FFF9F0] hover:bg-opacity-90 disabled:opacity-50'
          }`}
        >
          {isSubmitting ? 'Memverifikasi Akses...' : 'Masuk ke Studio Admin'}
        </button>
      </form>

      <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] opacity-70">
        <ShieldAlert className="w-3.5 h-3.5" />
        <span>Halaman login dilindungi Row Level Security (RLS) Supabase</span>
      </div>
    </div>
  );
};

export default AdminLogin;
