import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Konfigurasi untuk Next.js 16 dengan Turbopack
  experimental: {
    // appDir sudah diaktifkan secara default di Next.js 16
    turbopack: {
      root: "./", // Menentukan root workspace untuk menghindari deteksi lockfile ganda
    },
  },
  // Turbopack tidak mendukung konfigurasi webpack, jadi kita hapus
  // Konfigurasi untuk mengatasi masalah network interface
  // Menonaktifkan fitur yang memerlukan akses ke network interfaces
  serverExternalPackages: ["os"], // Ini akan mencegah Next.js dari mengakses modul os
};

export default nextConfig;