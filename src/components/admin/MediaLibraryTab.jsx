import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Video, Image as ImageIcon, Eye, RefreshCw, Folder, Tag, AlertCircle } from 'lucide-react';
import { EditorialFrame } from '../EditorialFrame';
import { compressMedia, uploadMedia, deleteMedia, getMediaByEntity } from '../../services/mediaService';
import { useTheme } from '../../context/ThemeContext';

export const MediaLibraryTab = ({ draftData, onChange, onNotify }) => {
  const { isDark } = useTheme();

  const [activeFilter, setActiveFilter] = useState('all');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedEntity, setSelectedEntity] = useState('general');
  const [customTitle, setCustomTitle] = useState('');
  const [customCaption, setCustomCaption] = useState('');
  const [mediaList, setMediaList] = useState([]);
  const [previewItem, setPreviewItem] = useState(null);

  // Collect all media from draftData + fetch from Supabase portfolio_media
  useEffect(() => {
    loadAllMedia();
  }, [draftData]);

  const loadAllMedia = async () => {
    const combined = [];

    // From Hero & About
    if (draftData.hero?.profileImage) {
      combined.push({
        id: 'hero-profile',
        url: draftData.hero.profileImage,
        type: 'image',
        title: 'Foto Profil Utama',
        category: 'Profile'
      });
    }
    if (draftData.about?.aboutImage) {
      combined.push({
        id: 'about-profile',
        url: draftData.about.aboutImage,
        type: 'image',
        title: 'Foto About Me',
        category: 'Profile'
      });
    }

    // From Experiences
    (draftData.experiences || []).forEach((exp, idx) => {
      if (exp.mediaUrl) {
        combined.push({
          id: `exp-${exp.id || idx}`,
          url: exp.mediaUrl,
          type: exp.mediaType || 'image',
          title: exp.role,
          caption: exp.company,
          category: 'Experience'
        });
      }
    });

    // From Organization gallery
    (draftData.organizations?.gallery || []).forEach((item, idx) => {
      combined.push({
        id: item.id || `org-${idx}`,
        url: item.url,
        type: item.type || 'image',
        title: item.title || 'Dokumentasi HIMMA & Kepemimpinan',
        caption: item.caption,
        category: 'Organization',
        storagePath: item.storagePath
      });
    });

    // From Projects
    (draftData.projects || []).forEach((proj, pIdx) => {
      if (proj.coverImage) {
        combined.push({
          id: `proj-cover-${proj.id || pIdx}`,
          url: proj.coverImage,
          type: 'image',
          title: `Cover: ${proj.title}`,
          category: 'Project'
        });
      }
      (proj.gallery || []).forEach((gItem, gIdx) => {
        combined.push({
          id: gItem.id || `proj-gal-${pIdx}-${gIdx}`,
          url: gItem.url,
          type: gItem.type || 'image',
          title: gItem.caption || proj.title,
          category: 'Project'
        });
      });
    });

    // From Vertical Showcase
    Object.entries(draftData.verticalShowcase || {}).forEach(([cat, catObj]) => {
      (catObj.items || []).forEach((item, idx) => {
        combined.push({
          id: item.id || `vt-${cat}-${idx}`,
          url: item.url,
          type: item.type || 'image',
          title: item.title || cat,
          category: cat
        });
      });
    });

    // Try fetching directly from Supabase portfolio_media table if connected
    try {
      const dbMedia = await getMediaByEntity('general');
      if (dbMedia && dbMedia.length > 0) {
        dbMedia.forEach((dm) => {
          if (!combined.some((c) => c.url === dm.media_url)) {
            combined.push({
              id: dm.id,
              url: dm.media_url,
              type: dm.media_type || 'image',
              title: dm.title || 'Media Library',
              caption: dm.caption || '',
              category: dm.category || 'General',
              storagePath: dm.storage_path
            });
          }
        });
      }
    } catch (e) {
      // offline silent
    }

    setMediaList(combined);
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setIsUploading(true);
    setUploadProgress(10);

    try {
      const newItems = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(Math.round(((i + 1) / files.length) * 80));

        const compressed = await compressMedia(file);
        const result = await uploadMedia({
          file: compressed.file,
          folder: selectedEntity,
          entityType: selectedEntity,
          title: customTitle || file.name.replace(/\.[^/.]+$/, ''),
          caption: customCaption,
          onProgress: (p) => setUploadProgress(p)
        });

        newItems.push({
          id: result.id,
          url: result.url,
          type: result.mediaType,
          title: result.title,
          caption: result.caption,
          storagePath: result.storagePath,
          category: selectedEntity
        });
      }

      setUploadProgress(100);

      // If associated with organization, add to organization gallery automatically
      if (selectedEntity === 'organization') {
        onChange({
          ...draftData,
          organizations: {
            ...draftData.organizations,
            gallery: [...(draftData.organizations?.gallery || []), ...newItems]
          }
        });
      }

      onNotify(`${newItems.length} berkas media berhasil diunggah ke Supabase Storage!`);
      setCustomTitle('');
      setCustomCaption('');
      loadAllMedia();
    } catch (err) {
      console.error(err);
      onNotify(err.message || 'Gagal mengunggah media.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteItem = async (item) => {
    if (!window.confirm(`Hapus media "${item.title || 'item'}"?`)) return;

    try {
      if (item.storagePath || item.id) {
        await deleteMedia(item.id, item.storagePath);
      }

      // Filter out from local draftData
      if (item.category === 'Organization') {
        const filtered = (draftData.organizations?.gallery || []).filter((g) => g.url !== item.url);
        onChange({
          ...draftData,
          organizations: {
            ...draftData.organizations,
            gallery: filtered
          }
        });
      }

      setMediaList((prev) => prev.filter((m) => m.url !== item.url));
      onNotify('Media berhasil dihapus.');
    } catch (err) {
      onNotify('Gagal menghapus media: ' + err.message);
    }
  };

  const filteredMedia = activeFilter === 'all'
    ? mediaList
    : mediaList.filter((m) => m.category?.toLowerCase() === activeFilter.toLowerCase());

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="font-editorial text-2xl font-semibold">
            Central Media Library (Supabase Storage)
          </h4>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-[#C7CED8]' : 'text-[#6E655F]'}`}>
            Unggah dan kelola seluruh foto &amp; video portofolio langsung ke cloud storage.
          </p>
        </div>

        <button
          onClick={loadAllMedia}
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs self-start"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Media</span>
        </button>
      </div>

      {/* Upload Zone */}
      <div
        className={`p-5 rounded-2xl border ${
          isDark ? 'bg-[#202F46] border-[#293A52]' : 'bg-[#FFF9F0] border-[#CFE3F2]'
        }`}
      >
        <span className="text-xs font-bold uppercase tracking-wider block mb-3">
          Unggah Foto / Video Baru
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div>
            <label className="block text-[11px] font-semibold mb-1 opacity-75">Tujuan Kategori</label>
            <select
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl border text-xs ${
                isDark ? 'bg-[#17243A] border-[#293A52]' : 'bg-white border-[#CFE3F2]'
              }`}
            >
              <option value="general">Umum (General)</option>
              <option value="organization">Galeri HIMMA &amp; Kepemimpinan</option>
              <option value="project">Project / Selected Works</option>
              <option value="experience">Pengalaman Kerja</option>
              <option value="vertical_showcase">Vertical Showcase</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold mb-1 opacity-75">Judul Media (Opsional)</label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Contoh: Dokumentasi Sesi Live"
              className={`w-full px-3 py-2 rounded-xl border text-xs ${
                isDark ? 'bg-[#17243A] border-[#293A52]' : 'bg-white border-[#CFE3F2]'
              }`}
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold mb-1 opacity-75">Caption (Opsional)</label>
            <input
              type="text"
              value={customCaption}
              onChange={(e) => setCustomCaption(e.target.value)}
              placeholder="Keterangan singkat..."
              className={`w-full px-3 py-2 rounded-xl border text-xs ${
                isDark ? 'bg-[#17243A] border-[#293A52]' : 'bg-white border-[#CFE3F2]'
              }`}
            />
          </div>
        </div>

        {/* Upload Button */}
        <div className="flex flex-wrap items-center gap-3">
          <label className="cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#DCEAF4] text-[#2C2520] hover:bg-[#CFE3F2] transition-colors shadow-sm">
            <Upload className="w-4 h-4" />
            <span>{isUploading ? 'Sedang Mengunggah...' : 'Pilih Berkas Foto / Video (Multi-File)'}</span>
            <input
              type="file"
              multiple
              disabled={isUploading}
              accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
          <span className="text-[11px] opacity-70">
            Foto dikompresi otomatis ke WebP. Video MP4/WEBM maksimal 20MB.
          </span>
        </div>

        {isUploading && (
          <div className="mt-4">
            <div className="w-full bg-black/10 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#C5A56A] h-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <span className="text-[11px] opacity-75 mt-1 block">
              Proses unggah: {uploadProgress}%
            </span>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 pt-2">
        {['all', 'profile', 'experience', 'organization', 'project', 'ABOUT ME', 'CREATIVE SPACE'].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setActiveFilter(f)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              activeFilter === f
                ? isDark
                  ? 'bg-[#C5A56A] border-[#C5A56A] text-[#17243A] font-semibold'
                  : 'bg-[#2C2520] border-[#2C2520] text-[#FFF9F0]'
                : 'hover:bg-black/5 opacity-75'
            }`}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      {filteredMedia.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredMedia.map((item, idx) => (
            <div
              key={item.id || idx}
              className={`group rounded-2xl border p-2.5 flex flex-col justify-between transition-all hover:shadow-lg ${
                isDark ? 'bg-[#202F46] border-[#293A52]' : 'bg-white border-[#CFE3F2]'
              }`}
            >
              <div className="relative rounded-xl overflow-hidden mb-2">
                <EditorialFrame
                  src={item.url}
                  mediaType={item.type}
                  alt={item.title}
                  isDark={isDark}
                  aspectClass="aspect-[4/3]"
                />

                <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-black/70 text-white backdrop-blur-sm">
                  {item.category || 'Media'}
                </span>

                {item.type === 'video' && (
                  <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md text-[10px] bg-red-600/90 text-white flex items-center gap-1">
                    <Video className="w-3 h-3" /> Video
                  </span>
                )}
              </div>

              <div>
                <p className={`text-xs font-semibold line-clamp-1 ${isDark ? 'text-[#E1E5EB]' : 'text-[#2C2520]'}`}>
                  {item.title || 'Tanpa Judul'}
                </p>
                {item.caption && (
                  <p className={`text-[11px] line-clamp-1 opacity-70 ${isDark ? 'text-[#C7CED8]' : 'text-[#6E655F]'}`}>
                    {item.caption}
                  </p>
                )}
              </div>

              <div className="pt-2 mt-2 border-t border-current/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => window.open(item.url, '_blank')}
                  className="text-[11px] flex items-center gap-1 text-[#5B7C99] hover:underline"
                >
                  <Eye className="w-3 h-3" /> Pratinjau
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteItem(item)}
                  className="text-xs text-rose-500 hover:text-rose-600 p-1 rounded"
                  title="Hapus Media"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`p-10 rounded-2xl border text-center ${isDark ? 'border-[#293A52]' : 'border-[#CFE3F2]'}`}>
          <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm font-medium">Belum ada media pada kategori ini.</p>
          <p className="text-xs opacity-70 mt-1">Gunakan panel upload di atas untuk menambahkan media baru.</p>
        </div>
      )}
    </div>
  );
};

export default MediaLibraryTab;
