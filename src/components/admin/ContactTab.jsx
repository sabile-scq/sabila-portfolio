import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export const ContactTab = ({ draftData, onChange }) => {
  const { isDark } = useTheme();

  return (
    <div className="space-y-4 max-w-xl">
      <h4 className="font-editorial text-2xl font-semibold">Informasi Kontak &amp; Tautan Sosial</h4>

      <div>
        <label className="block text-xs font-semibold mb-1">Headline Penutup</label>
        <input
          type="text"
          value={draftData.contact?.headline || ''}
          onChange={(e) => onChange({
            ...draftData,
            contact: { ...draftData.contact, headline: e.target.value }
          })}
          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${isDark ? 'bg-[#202F46] border-[#293A52]' : 'bg-white border-[#CFE3F2]'}`}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1">Alamat Email</label>
        <input
          type="email"
          value={draftData.contact?.email || ''}
          onChange={(e) => onChange({
            ...draftData,
            contact: { ...draftData.contact, email: e.target.value }
          })}
          placeholder="sabilatgr06@gmail.com"
          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${isDark ? 'bg-[#202F46] border-[#293A52]' : 'bg-white border-[#CFE3F2]'}`}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1">URL WhatsApp (Format: https://wa.me/6282249803252)</label>
        <input
          type="url"
          value={draftData.contact?.whatsapp || ''}
          onChange={(e) => onChange({
            ...draftData,
            contact: { ...draftData.contact, whatsapp: e.target.value }
          })}
          placeholder="https://wa.me/6282249803252"
          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${isDark ? 'bg-[#202F46] border-[#293A52]' : 'bg-white border-[#CFE3F2]'}`}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1">URL LinkedIn</label>
        <input
          type="url"
          value={draftData.contact?.linkedin || ''}
          onChange={(e) => onChange({
            ...draftData,
            contact: { ...draftData.contact, linkedin: e.target.value }
          })}
          placeholder="https://www.linkedin.com/in/sabila-alifia-sundawa-982aa7360"
          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${isDark ? 'bg-[#202F46] border-[#293A52]' : 'bg-white border-[#CFE3F2]'}`}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1">URL Instagram</label>
        <input
          type="url"
          value={draftData.contact?.instagram || ''}
          onChange={(e) => onChange({
            ...draftData,
            contact: { ...draftData.contact, instagram: e.target.value }
          })}
          placeholder="https://www.instagram.com/sbilalifia_"
          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${isDark ? 'bg-[#202F46] border-[#293A52]' : 'bg-white border-[#CFE3F2]'}`}
        />
      </div>
    </div>
  );
};

export default ContactTab;
