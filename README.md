# Sabila Alifia Sundawa — Personal Portfolio Website

Website portofolio personal dan editorial modern untuk **Sabila Alifia Sundawa** (Mahasiswa S1 Manajemen, Pradita University). Website ini menggabungkan desain tipografi editorial (*Cormorant Garamond* & *Plus Jakarta Sans*), palette warna soft pastel / deep navy, navigasi radial orbit tanda tangan, arsip tipografi vertikal, serta terintegrasi penuh dengan **Supabase** (Database, Authentication & Cloud Storage).

---

## 📌 Fitur Utama

- **Desain Editorial & Responsif**: Palet warna Light Mode default (Cream, Soft Blue, Warm White, Butter Cream, Soft Pink) & Dark Mode (Deep Navy, Slate Blue, Muted Gold).
- **Komponen Modular**: Struktur file rapi berbasis React + Vite + Tailwind CSS.
- **Arsip Tipografi Vertikal**: Tampilan dokumentasi interaktif dengan kategori *ABOUT ME*, *EXPERIENCE*, *ORGANIZATION*, *SELECTED WORKS*, dan *CREATIVE SPACE*.
- **Navigasi Radial Orbit**: Menu melingkar fixed di sudut kanan bawah dengan animasi rotasi sudut halus.
- **Studio Admin Terproteksi**:
  - Login aman berbasis **Supabase Auth** (Email & Password), bukan passcode statis.
  - Otorisasi berbasis tabel khusus `admin_users` dan **Row Level Security (RLS)**.
  - Editor interaktif untuk Hero, About Me, Pendidikan, Pengalaman Kerja, Organisasi HIMMA, Kepemimpinan PKKMB, Projects, Skills, dan Kontak.
- **Central Media Library (Supabase Storage)**:
  - Upload foto banyak sekaligus (JPG, PNG, WEBP) dengan kompresi otomatis client-side.
  - Upload video klip pendek (MP4, WEBM).
  - Pratinjau lightbox layar penuh.
  - Hapus dan tautkan media ke kategori tertentu.
- **Resiliensi Data Offline**: Otomatis menggunakan cache lokal & fallback inisial data jika Supabase belum terhubung.

---

## 📁 Struktur Direktori Project

```text
sabila-portfolio/
├── public/
│   └── assets/
├── src/
│   ├── components/
│   │   ├── admin/               # Panel Studio Admin (Login, Tabs Editor)
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── AdminModal.jsx
│   │   │   ├── ProfileTab.jsx
│   │   │   ├── ExperienceTab.jsx
│   │   │   ├── OrganizationTab.jsx
│   │   │   ├── ProjectsTab.jsx
│   │   │   ├── VerticalTab.jsx
│   │   │   ├── MediaLibraryTab.jsx
│   │   │   └── ContactTab.jsx
│   │   ├── layout/              # Header, Footer & Radial Nav
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── RadialNav.jsx
│   │   ├── sections/            # Bagian halaman portofolio
│   │   │   ├── HeroSection.jsx
│   │   │   ├── AboutSection.jsx
│   │   │   ├── ExperienceSection.jsx
│   │   │   ├── OrganizationSection.jsx
│   │   │   ├── VerticalShowcaseSection.jsx
│   │   │   ├── ProjectsSection.jsx
│   │   │   ├── ProjectModal.jsx
│   │   │   └── SkillsSection.jsx
│   │   ├── Navbar.jsx           # Komponen Navbar
│   │   ├── RadialSidebar.jsx    # Komponen Radial Menu
│   │   ├── Hero.jsx             # Komponen Hero
│   │   ├── About.jsx            # Komponen About
│   │   ├── Experience.jsx       # Komponen Experience
│   │   ├── Organization.jsx     # Komponen Organization (HIMMA & PKKMB)
│   │   ├── Projects.jsx         # Komponen Projects
│   │   ├── VerticalShowcase.jsx # Komponen Showcase Vertikal
│   │   ├── Skills.jsx           # Komponen Skills
│   │   ├── Contact.jsx          # Komponen Contact
│   │   ├── ThemeToggle.jsx      # Tombol ganti tema Light/Dark
│   │   ├── MediaGallery.jsx     # Galeri media reusable
│   │   ├── EditorialFrame.jsx   # Frame artistik SVG placeholder
│   │   ├── Lightbox.jsx         # Pratinjau fullscreen media
│   │   └── Toast.jsx            # Notifikasi aksi
│   ├── pages/
│   │   └── Admin.jsx            # Halaman admin standalone
│   ├── context/
│   │   ├── AuthContext.jsx      # Supabase Auth Provider
│   │   └── ThemeContext.jsx     # Light / Dark Theme Provider
│   ├── services/
│   │   ├── portfolioService.js  # Service database & sinkronisasi Supabase
│   │   └── mediaService.js      # Service Supabase Storage & kompresi media
│   ├── data/
│   │   └── initialPortfolioData.js # Data inisial portofolio Sabila
│   ├── lib/
│   │   └── supabase.js          # Inisialisasi client Supabase
│   ├── App.jsx                  # Root App
│   ├── main.jsx                 # Entry Point Vite React
│   └── index.css                # Tailwind & custom CSS animation
├── supabase/
│   ├── schema.sql               # Skrip pembuatan tabel, RLS, & bucket Storage
│   └── seed.sql                 # Data inisial resmi portofolio Sabila
├── .env.example                 # Template variabel lingkungan
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 🚀 Panduan Instalasi & Menjalankan Lokal

### 1. Prasyarat
- **Node.js** versi 18 atau lebih tinggi ([Unduh di sini](https://nodejs.org/)).
- **Git** ([Unduh di sini](https://git-scm.com/)).

### 2. Kloning atau Buka Folder Project
Buka terminal dan masuk ke folder project:
```bash
cd /path/to/sabila-portfolio
```

### 3. Pasang Dependensi (Dependencies)
```bash
npm install
```

### 4. Konfigurasi Variabel Lingkungan (.env)
Salin berkas `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Buka `.env` dan isi kredensial Supabase Anda (lihat panduan Supabase di bawah).

### 5. Jalankan Server Development
```bash
npm run dev
```
Buka peramban di URL yang ditampilkan, biasanya `http://localhost:5173`.

### 6. Build untuk Produksi
```bash
npm run build
```
Hasil build akan tersimpan di direktori `dist/` dan siap dideploy.

---

## 🗄️ Panduan Konfigurasi Supabase (Langkah Demi Langkah)

### Langkah 1: Buat Project Baru di Supabase
1. Kunjungi [https://supabase.com](https://supabase.com) dan buat akun (atau masuk via GitHub).
2. Klik tombol **New Project**.
3. Isi informasi project:
   - **Name**: `sabila-portfolio`
   - **Database Password**: Buat password yang kuat dan simpan di tempat aman.
   - **Region**: Pilih yang terdekat, misalnya `Singapore (ap-southeast-1)`.
4. Klik **Create new project** dan tunggu 1–2 menit hingga project selesai diinisialisasi.

### Langkah 2: Dapatkan URL dan Anon Key
1. Di sidebar kiri dashboard Supabase, klik ikon **Settings** (roda gigi) -> **API**.
2. Di bagian **Project URL**, salin URL Anda (contoh: `https://abcdefghijklm.supabase.co`).
3. Di bagian **Project API Keys**, salin `anon` / `public` key.
4. Buka file `.env` di project lokal Anda dan masukkan nilainya:
   ```env
   VITE_SUPABASE_URL=https://abcdefghijklm.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Langkah 3: Eksekusi Skema Database (`schema.sql`)
1. Di dashboard Supabase, klik menu **SQL Editor** pada sidebar kiri.
2. Klik tombol **New Query**.
3. Buka file `supabase/schema.sql` dari project ini, salin seluruh kodenya, lalu tempelkan ke SQL Editor Supabase.
4. Klik tombol **Run** (atau tekan `Ctrl+Enter` / `Cmd+Enter`).
5. Pastikan muncul pesan sukses: `Success. No rows returned`.
   > *Skrip ini otomatis membuat tabel `profile`, `experiences`, `organizations`, `projects`, `skills`, `vertical_showcase`, `contact`, `portfolio_media`, `admin_users`, mengaktifkan Row Level Security (RLS), dan membuat bucket storage `portfolio-media`.*

### Langkah 4: Eksekusi Data Awal (`seed.sql`)
1. Masih di **SQL Editor**, buat query baru (**New Query**).
2. Buka file `supabase/seed.sql` dari project ini, salin seluruh isinya, lalu tempelkan ke SQL Editor.
3. Klik tombol **Run**.
4. Semua data resmi Sabila Alifia Sundawa (HIMMA, PKKMB, pengalaman, kontak) kini telah terisi di database.

### Langkah 5: Membuat Akun Admin & Mengatur UID Admin
1. Di sidebar kiri Supabase, klik menu **Authentication** -> **Users**.
2. Klik tombol **Add user** -> pilih **Create user**.
3. Masukkan:
   - **Email**: contoh `sabilatgr06@gmail.com`
   - **Password**: Buat password akun admin Anda yang aman.
   - Centang **Auto Confirm User?** agar tidak perlu verifikasi email.
4. Klik **Create user**.
5. Setelah user dibuat, lihat kolom **User UID** (berupa deretan karakter unik UUID, contoh: `4d9e2b81-a5c6-4e78-9e11-123456789abc`). Salin UID tersebut.
6. Masuk kembali ke **SQL Editor**, buat query baru, lalu jalankan perintah berikut (ganti UID dan email dengan milik Anda):
   ```sql
   INSERT INTO public.admin_users (id, email)
   VALUES ('4d9e2b81-a5c6-4e78-9e11-123456789abc', 'sabilatgr06@gmail.com')
   ON CONFLICT (id) DO NOTHING;
   ```
7. Klik **Run**. Sekarang akun tersebut telah resmi terdaftar sebagai administrator dan memiliki hak penuh untuk mengedit website serta mengunggah media!

---

## 🌐 Panduan Upload ke GitHub & Deploy ke Vercel

### Bagian A: Upload ke GitHub

1. **Inisialisasi Git Lokal** (jika belum):
   ```bash
   cd /path/to/sabila-portfolio
   git init
   ```
2. **Periksa Status Berkas**:
   ```bash
   git status
   ```
   Pastikan file `.env` **TIDAK** ada dalam daftar (karena sudah dilindungi oleh `.gitignore`).
3. **Commit Semua Berkas**:
   ```bash
   git add .
   git commit -m "feat: initial commit personal portfolio sabila alifia sundawa"
   ```
4. **Buat Repository di GitHub**:
   - Buka [https://github.com/new](https://github.com/new).
   - Isi nama repository: `sabila-portfolio`.
   - Pilih **Public** atau **Private**.
   - Jangan centang opsi "Initialize this repository with a README" (karena sudah ada di lokal).
   - Klik **Create repository**.
5. **Hubungkan & Push ke GitHub**:
   ```bash
   git remote add origin https://github.com/username-anda/sabila-portfolio.git
   git branch -M main
   git push -u origin main
   ```

---

### Bagian B: Deploy ke Vercel

1. Buka [https://vercel.com](https://vercel.com) dan masuk dengan akun GitHub Anda.
2. Pada dashboard Vercel, klik tombol **Add New...** -> **Project**.
3. Di daftar repository GitHub, cari `sabila-portfolio` lalu klik **Import**.
4. Di halaman konfigurasi project:
   - **Framework Preset**: Pilih **Vite**.
   - **Root Directory**: `./` (default).
   - **Build Command**: `npm run build` (default).
   - **Output Directory**: `dist` (default).
5. **Pengaturan Environment Variables** (*Sangat Penting!*):
   Buka bagian **Environment Variables** dan tambahkan dua variabel berikut:
   - **Key**: `VITE_SUPABASE_URL` | **Value**: *(URL Supabase Anda)*
   - **Key**: `VITE_SUPABASE_ANON_KEY` | **Value**: *(Anon Key Supabase Anda)*
6. Klik tombol **Deploy**.
7. Tunggu proses build selama kurang lebih 1 menit. Vercel akan memberikan domain publik gratis yang aktif (contoh: `https://sabila-portfolio.vercel.app`).

---

## 🔐 Keamanan & Row Level Security (RLS)

- **Anonim / Publik**: Hanya diberikan izin `SELECT` (baca saja) untuk konten portofolio publik. Pengunjung biasa tidak bisa memodifikasi atau menghapus data.
- **Administrator**: Hanya pengguna yang terautentikasi melalui Supabase Auth dan ID-nya terdaftar di tabel `public.admin_users` yang dapat melakukan operasi `INSERT`, `UPDATE`, dan `DELETE`.
- **Supabase Storage**: Bucket `portfolio-media` bersifat public read agar gambar dapat tampil dengan cepat di peramban pengunjung, namun operasi upload dan hapus dibatasi khusus untuk admin terverifikasi.
- **Tanpa Secret Key di Frontend**: Aplikasi hanya menggunakan `anon key` yang aman untuk client-side. `service_role key` tidak pernah disimpan di frontend.

---

## 📞 Kontak & Informasi Resmi

- **Nama**: Sabila Alifia Sundawa
- **Pendidikan**: S1 Manajemen, Pradita University (2025 – Sekarang)
- **Email**: [sabilatgr06@gmail.com](mailto:sabilatgr06@gmail.com)
- **WhatsApp**: [082249803252](https://wa.me/6282249803252)
- **LinkedIn**: [Sabila Alifia Sundawa](https://www.linkedin.com/in/sabila-alifia-sundawa-982aa7360?utm_source=share_via&utm_content=profile&utm_medium=member_ios)
- **Instagram**: [@sbilalifia_](https://www.instagram.com/sbilalifia_?evlk=NnFzZ3d3aGp4MzN6)

---
*© 2026 Sabila Alifia Sundawa. All Rights Reserved.*
