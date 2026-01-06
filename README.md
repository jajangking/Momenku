# MomenKu - Platform Pengelola Momen Spesial

MomenKu adalah platform yang membantu Anda menyimpan, mengelola, dan membagikan momen-momen penting dalam hidup Anda. Aplikasi ini dibangun dengan Next.js dan menggunakan Firebase untuk autentikasi pengguna.

## Fitur Utama

- **Login/Registrasi**: Dukungan login dengan email/password dan Google
- **Proteksi Rute**: Halaman dashboard dan fitur-fitur hanya dapat diakses oleh pengguna yang sudah login
- **Lupa Password**: Fungsi reset password melalui email
- **Tema Momen**: Desain yang indah dan responsif dengan warna-warna lembut
- **Manajemen Momen**: Simpan dan kelola momen-momen penting Anda
- **Silsilah Keluarga**: Tampilkan dan kelola struktur keluarga Anda
- **Cerita Keluarga**: Tulis dan baca kisah-kisah keluarga
- **Profil Pengguna**: Lihat dan edit informasi pribadi Anda

## Getting Started

Pastikan Anda telah mengaktifkan layanan autentikasi di Firebase Console sesuai dengan instruksi di [FIREBASE_SETUP.md](./FIREBASE_SETUP.md).

Kemudian, instal dependensi dan jalankan server pengembangan:

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat hasilnya.

## Struktur Proyek

- `app/page.tsx` - Halaman beranda
- `app/login/page.tsx` - Halaman login/registrasi
- `app/dashboard/page.tsx` - Halaman dashboard utama
- `app/protected/` - Folder untuk halaman-halaman yang dilindungi
  - `momen/page.tsx` - Halaman manajemen momen
  - `silsilah/page.tsx` - Halaman silsilah keluarga
  - `cerita/page.tsx` - Halaman cerita keluarga
  - `profil/page.tsx` - Halaman profil pengguna
- `lib/firebase/` - Konfigurasi dan fungsi autentikasi Firebase
- `components/` - Komponen-komponen reusable

## Teknologi yang Digunakan

- [Next.js](https://nextjs.org) - Framework React
- [Firebase](https://firebase.google.com) - Backend sebagai layanan (BaaS)
- [Tailwind CSS](https://tailwindcss.com) - Framework CSS
- [TypeScript](https://www.typescriptlang.org) - Superset JavaScript

## Kontribusi

Kontribusi sangat diterima! Silakan buat issue atau pull request jika Anda ingin membantu mengembangkan aplikasi ini.

## Deploy ke Vercel

Cara termudah untuk mendeploy aplikasi Next.js Anda adalah dengan menggunakan [platform Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) dari pembuat Next.js.

Lihat [dokumentasi deployment Next.js](https://nextjs.org/docs/app/building-your-application/deploying) untuk detail lebih lanjut.# Momenku
