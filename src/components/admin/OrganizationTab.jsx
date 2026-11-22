import React, { useState } from 'react';
import { Upload, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { EditorialFrame } from '../EditorialFrame';
import { compressMedia, uploadMedia } from '../../services/mediaService';
import { useTheme } from '../../context/ThemeContext';

export const OrganizationTab = ({ draftData, onChange, onNotify }) => {
  const { isDark } = useTheme();
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  // Safely support himma with fallback himaa
  const himmaData = draftData.organizations?.himma || draftData.organizations?.himaa || {
    name: 'Himpunan Mahasiswa Manajemen (HIMMA)',
    role: 'Divisi Publikasi dan Dokumentasi',
    description: 'Terlibat dalam pembuatan konten publikasi kegiatan organisasi serta dokumentasi acara.'
  };

  const handleHimmaChange = (field, value) => {
    onChange({
      ...draftData,
      organizations: {
        ...draftData.organizations,
        himma: {
          ...himmaData,
          [field]: value
        }
      }
    });
  };

  const handleLeadershipChange = (field, value) => {
    onChange({
      ...draftData,
      organizations: {
        ...draftData.organizations,
        leadership: {
          ...draftData.organizations.leadership,
          [field]: value
        }
      }
    });
  };

  const handleMultiUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setIsUploadingGallery(true);
    try {
      const uploaded = [];
      for (const f of files) {
        const compressed = await compressMedia(f);
        const result = await uploadMedia({
          file: compressed.file,
          folder: 'organization',
          entityType: 'organization',
          entityId: 'main',
          title: f.name.replace(/\.[^/.]+$/, ''),
          caption: 'Dokumentasi HIMMA & Kepemimpinan'
        });

        uploaded.push({
          id: result.id,
          url: result.url,
          type: result.mediaType,
          title: result.title,
          caption: result.caption,
          storagePath: result.storagePath
        });
      }

      onChange({
        ...draftData,
        organizations: {
          ...draftData.organizations,
          gallery: [...(draftData.organizations.gallery || []), ...uploaded]
        }
      });
      onNotify(`${uploaded.length} media berhasil ditambahkan ke galeri organisasi.`);
    } catch (err) {
      console.error(err);
      onNotify(err.message || 'Gagal mengunggah foto galeri.');
    } finally {
      setIsUploadingGallery(false);
    }
  };

  return (
    <div className="space-y-6">
      <h4 className="font-editorial text-2xl font-semibold">Organisasi, Kepemimpinan & Galeri Kegiatan</h4>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* HIMMA */}
        <div className={`p-4 rounded-2xl border space-y-3 ${isDark ? 'bg-[#202F46] border-[#293A52]' : 'bg-[#FFF9F0] border-[#CFE3F2]'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">HIMMA (Himpunan Mahasiswa Manajemen)</span>
          </div>
          <div>
            <label className="block text-[11px] font-semibold mb-1 opacity-75">Nama Organisasi</label>
            <input
              type="text"
              value={himmaData.name}
              onChange={(e) => handleHimmaChange('name', e.target.value)}
              className={`w-full px-3 py-2 rounded-xl border text-sm ${isDark ? 'bg-[#17243A] border-[#293A52]' : 'bg-white border-[#CFE3F2]'}`}
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold mb-1 opacity-75">Peran / Divisi</label>
            <input
              type="text"
              value={himmaData.role}
              onChange={(e) => handleHimmaChange('role', e.target.value)}
              className={`w-full px-3 py-2 rounded-xl border text-sm ${isDark ? 'bg-[#17243A] border-[#293A52]' : 'bg-white border-[#CFE3F2]'}`}
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold mb-1 opacity-75">Deskripsi Peran</label>
            <textarea
              rows={3}
              value={himmaData.description}
              onChange={(e) => handleHimmaChange('description', e.target.value)}
              className={`w-full px-3 py-2 rounded-xl border text-sm ${isDark ? 'bg-[#17243A] border-[#293A52]' : 'bg-white border-[#CFE3F2]'}`}
            />
          </div>
        </div>

        {/* Leadership (PKKMB) */}
        <div className={`p-4 rounded-2xl border space-y-3 ${isDark ? 'bg-[#202F46] border-[#293A52]' : 'bg-[#F3DDE3]/50 border-[#EBCFD8]'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">Leadership (PKKMB)</span>
          </div>
          <div>
            <label className="block text-[11px] font-semibold mb-1 opacity-75">Jabatan / Judul Acara</label>
            <input
              type="text"
              value={draftData.organizations.leadership.title}
              onChange={(e) => handleLeadershipChange('title', e.target.value)}
              className={`w-full px-3 py-2 rounded-xl border text-sm ${isDark ? 'bg-[#17243A] border-[#293A52]' : 'bg-white border-[#CFE3F2]'}`}
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold mb-1 opacity-75">Tema Kegiatan</label>
            <input
              type="text"
              value={draftData.organizations.leadership.theme}
              onChange={(e) => handleLeadershipChange('theme', e.target.value)}
              className={`w-full px-3 py-2 rounded-xl border text-sm ${isDark ? 'bg-[#17243A] border-[#293A52]' : 'bg-white border-[#CFE3F2]'}`}
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold mb-1 opacity-75">Deskripsi Kepemimpinan</label>
            <textarea
              rows={3}
              value={draftData.organizations.leadership.description}
              onChange={(e) => handleLeadershipChange('description', e.target.value)}
              className={`w-full px-3 py-2 rounded-xl border text-sm ${isDark ? 'bg-[#17243A] border-[#293A52]' : 'bg-white border-[#CFE3F2]'}`}
            />
          </div>
        </div>
      </div>

      {/* Multi-upload Organization Gallery */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold">Galeri Dokumentasi Kegiatan (Multi-Upload)</span>
          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-[#DCEAF4] text-[#2C2520] hover:bg-[#CFE3F2] transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span>{isUploadingGallery ? 'Mengunggah...' : 'Unggah Beberapa Foto'}</span>
            <input
              type="file"
              multiple
              disabled={isUploadingGallery}
              accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
              className="hidden"
              onChange={handleMultiUpload}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(draftData.organizations.gallery || []).map((item, idx) => (
            <div
              key={item.id || idx}
              className={`p-3 rounded-2xl border space-y-2 ${isDark ? 'bg-[#202F46] border-[#293A52]' : 'bg-white border-[#CFE3F2]'}`}
            >
              <EditorialFrame
                src={item.url}
                mediaType={item.type}
                isDark={isDark}
                aspectClass="aspect-[4/3]"
                className="rounded-xl"
              />
              <input
                type="text"
                value={item.title || ''}
                placeholder="Judul Foto..."
                onChange={(e) => {
                  const next = [...draftData.organizations.gallery];
                  next[idx] = { ...item, title: e.target.value };
                  onChange({
                    ...draftData,
                    organizations: { ...draftData.organizations, gallery: next }
                  });
                }}
                className={`w-full px-2.5 py-1.5 rounded-lg border text-xs ${isDark ? 'bg-[#17243A] border-[#293A52]' : 'bg-[#FFF9F0] border-[#CFE3F2]'}`}
              />
              <div className="flex items-center justify-between pt-1">
                <div className="flex gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => {
                      const next = [...draftData.organizations.gallery];
                      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                      onChange({
                        ...draftData,
                        organizations: { ...draftData.organizations, gallery: next }
                      });
                    }}
                    className="p-1 rounded border border-current/20 disabled:opacity-30 hover:bg-black/5"
                    title="Geser ke Kiri/Atas"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === draftData.organizations.gallery.length - 1}
                    onClick={() => {
                      const next = [...draftData.organizations.gallery];
                      [next[idx + 1], next[idx]] = [next[idx], next[idx + 1]];
                      onChange({
                        ...draftData,
                        organizations: { ...draftData.organizations, gallery: next }
                      });
                    }}
                    className="p-1 rounded border border-current/20 disabled:opacity-30 hover:bg-black/5"
                    title="Geser ke Kanan/Bawah"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = draftData.organizations.gallery.filter((_, i) => i !== idx);
                    onChange({
                      ...draftData,
                      organizations: { ...draftData.organizations, gallery: next }
                    });
                  }}
                  className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrganizationTab;
