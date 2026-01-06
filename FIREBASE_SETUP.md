# Panduan Setup Firebase untuk MomenKu

## 1. Mengaktifkan Autentikasi di Firebase

1. Kunjungi [Firebase Console](https://console.firebase.google.com/)
2. Pilih proyek Anda (dalam kasus ini: dimonitor-1c806)
3. Klik "Authentication" dari menu sebelah kiri
4. Klik tombol "Get started"
5. Pada tab "Sign-in method", aktifkan provider yang diinginkan:
   - Email/Password: Aktifkan dan simpan
   - Google: Aktifkan dan isi "Project support email" serta "Privacy Policy URL" (opsional)

## 2. Menjalankan Aplikasi

Konfigurasi Firebase sudah disediakan di file `.env.local`. Pastikan Anda telah mengaktifkan layanan autentikasi di Firebase Console, lalu jalankan:

```bash
npm run dev
```

Aplikasi akan berjalan di http://localhost:3000

## 3. Fitur yang Tersedia

- Login/Registrasi dengan email dan password
- Login dengan Google
- Lupa password (reset password via email)
- Proteksi rute (halaman dashboard hanya bisa diakses oleh pengguna yang login)
- Logout
- Analytics (jika didukung)

## 4. Struktur File

- `lib/firebase/config.ts` - Konfigurasi Firebase dan inisialisasi analytics
- `lib/firebase/auth.ts` - Fungsi-fungsi autentikasi
- `app/login/page.tsx` - Halaman login/registrasi
- `app/dashboard/page.tsx` - Halaman dashboard yang dilindungi
- `components/withAuth.tsx` - Komponen HOC untuk proteksi rute