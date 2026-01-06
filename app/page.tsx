'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase/auth';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: FirebaseUser | null) => {
      if (user) {
        // Jika pengguna sudah login, arahkan ke dashboard
        router.push('/dashboard');
      }
      // Jika pengguna tidak login, biarkan di halaman beranda
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <main className="flex flex-col items-center justify-center text-center max-w-3xl w-full">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Selamat Datang di MomenKu
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
            Platform untuk mengelola dan menyimpan momen-momen spesial Anda
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Apa itu MomenKu?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            MomenKu adalah platform yang membantu Anda menyimpan, mengelola, dan membagikan momen-momen penting dalam hidup Anda.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/login"
              className="flex-1 px-6 py-3 bg-pink-600 text-white font-medium rounded-lg hover:bg-pink-700 transition duration-300 text-center"
            >
              Masuk
            </Link>
            <Link
              href="/login"
              className="flex-1 px-6 py-3 bg-white dark:bg-gray-700 border border-pink-600 text-pink-600 dark:text-pink-400 font-medium rounded-lg hover:bg-pink-50 dark:hover:bg-gray-600 transition duration-300 text-center"
            >
              Daftar
            </Link>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Simpan Momen</h3>
            <p className="text-gray-600 dark:text-gray-400">Simpan momen penting Anda dengan aman di cloud</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Organisir</h3>
            <p className="text-gray-600 dark:text-gray-400">Atur momen Anda dalam kategori yang mudah ditemukan</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Bagikan</h3>
            <p className="text-gray-600 dark:text-gray-400">Bagikan momen indah Anda dengan orang terkasih</p>
          </div>
        </div>
      </main>

      <footer className="mt-16 text-center text-gray-600 dark:text-gray-400 w-full py-6">
        <p>&copy; {new Date().getFullYear()} MomenKu. Semua hak dilindungi.</p>
      </footer>
    </div>
  );
}