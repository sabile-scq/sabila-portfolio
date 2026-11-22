import React, { useState, useEffect } from 'react';
import { Lock, Save, LogOut, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { AdminLogin } from './AdminLogin';
import { ProfileTab } from './ProfileTab';
import { ExperienceTab } from './ExperienceTab';
import { OrganizationTab } from './OrganizationTab';
import { ProjectsTab } from './ProjectsTab';
import { VerticalTab } from './VerticalTab';
import { ContactTab } from './ContactTab';
import { MediaLibraryTab } from './MediaLibraryTab';
import { savePortfolioData } from '../../services/portfolioService';

export const AdminModal = ({
  isOpen,
  onClose,
  portfolioData,
  onUpdatePortfolio,
  initialTab = 'profile',
  onNotify
}) => {
  const { isDark } = useTheme();
  const { isAuthenticated, signOut, logout, isConfigured } = useAuth();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [draftData, setDraftData] = useState(portfolioData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    setDraftData(JSON.parse(JSON.stringify(portfolioData)));
  }, [portfolioData, isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const savedData = await savePortfolioData(draftData);
      onUpdatePortfolio(savedData);
      onNotify('Seluruh perubahan portofolio berhasil disimpan ke Supabase Cloud!');
    } catch (err) {
      console.error(err);
      onNotify('Gagal menyimpan perubahan ke Supabase: ' + (err.message || 'Periksa koneksi database.'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    if (signOut) await signOut();
    else if (logout) await logout();
    onNotify('Sesi administrator telah ditutup.');
  };

  const tabs = [
    { id: 'profile', label: 'Profil & Pendidikan' },
    { id: 'experience', label: 'Pengalaman Kerja' },
    { id: 'organization', label: 'Organisasi & Galeri' },
    { id: 'projects', label: 'Projects & Dokumentasi' },
    { id: 'vertical', label: 'Vertical Typography' },
    { id: 'media', label: 'Media Library' },
    { id: 'contact', label: 'Kontak & Link' }
  ];

  return (
    <div className="fixed inset-0 z-[60] bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div
        className={`w-full max-w-5xl max-h-[92vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden ${
          isDark
            ? 'bg-[#17243A] border-[#C5A56A]/50 text-[#E1E5EB]'
            : 'bg-[#FFFCF8] border-[#CFE3F2] text-[#2C2520]'
        }`}
      >
        {/* Admin Top Bar */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between ${
            isDark ? 'bg-[#202F46] border-[#293A52]' : 'bg-[#DCEAF4] border-[#CFE3F2]'
          }`}
        >
          <div className="flex items-center gap-3">
            <Lock className={`w-5 h-5 ${isDark ? 'text-[#C5A56A]' : 'text-[#2C2520]'}`} />
            <div>
              <h3 className="font-editorial text-xl font-bold leading-none">
                Studio Content &amp; Media Manager
              </h3>
              <span className="text-[11px] opacity-75">
                {isConfigured ? 'Supabase Database & Storage Sync' : 'Offline Mode (Konfigurasi .env diperlukan)'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  type="button"
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-md ${
                    isDark
                      ? 'bg-[#C5A56A] text-[#17243A] hover:bg-[#D8C49A]'
                      : 'bg-[#2C2520] text-[#FFF9F0] hover:bg-opacity-90'
                  }`}
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan Semua Perubahan'}</span>
                </button>

                <button
                  onClick={handleLogout}
                  type="button"
                  title="Kunci Dashboard / Keluar"
                  className="p-2 rounded-full border border-current/20 hover:bg-black/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}

            <button
              onClick={onClose}
              type="button"
              aria-label="Tutup Admin Dashboard"
              className="p-2 rounded-full border border-current/20 hover:bg-black/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {!isAuthenticated ? (
          <AdminLogin
            onSuccess={() => onNotify('Akses studio admin terbuka.')}
            onNotify={onNotify}
          />
        ) : (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Tabs */}
            <div
              className={`w-full md:w-56 p-3 border-b md:border-b-0 md:border-r flex md:flex-col gap-1.5 overflow-x-auto shrink-0 ${
                isDark ? 'bg-[#202F46]/60 border-[#293A52]' : 'bg-[#FFF9F0] border-[#CFE3F2]'
              }`}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold text-left whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? isDark
                        ? 'bg-[#C5A56A] text-[#17243A]'
                        : 'bg-[#DCEAF4] text-[#2C2520]'
                      : 'hover:bg-black/5 opacity-80'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Active Tab Panel */}
            <div className="flex-1 p-5 sm:p-7 overflow-y-auto space-y-6">
              {activeTab === 'profile' && (
                <ProfileTab draftData={draftData} onChange={setDraftData} onNotify={onNotify} />
              )}
              {activeTab === 'experience' && (
                <ExperienceTab draftData={draftData} onChange={setDraftData} onNotify={onNotify} />
              )}
              {activeTab === 'organization' && (
                <OrganizationTab draftData={draftData} onChange={setDraftData} onNotify={onNotify} />
              )}
              {activeTab === 'projects' && (
                <ProjectsTab draftData={draftData} onChange={setDraftData} onNotify={onNotify} />
              )}
              {activeTab === 'vertical' && (
                <VerticalTab draftData={draftData} onChange={setDraftData} onNotify={onNotify} />
              )}
              {activeTab === 'media' && (
                <MediaLibraryTab draftData={draftData} onChange={setDraftData} onNotify={onNotify} />
              )}
              {activeTab === 'contact' && (
                <ContactTab draftData={draftData} onChange={setDraftData} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminModal;
