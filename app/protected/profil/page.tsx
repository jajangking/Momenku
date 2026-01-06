'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, getUserProfile } from '@/lib/firebase/auth';
import { User as FirebaseUser } from 'firebase/auth';

export default function ProfilPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);

        // Ambil profil pengguna dari Firestore
        const { profile: userProfile, error } = await getUserProfile(user.uid);
        if (userProfile) {
          setProfile(userProfile);
        } else {
          // Jika profil tidak ditemukan, buat profil default
          setProfile({
            displayName: user.displayName || user.email?.split('@')[0] || 'Pengguna',
            email: user.email,
            bio: 'Seorang yang menyukai momen-momen indah bersama keluarga',
            location: '',
            birthDate: ''
          });
        }
      } else {
        // Redirect ke login jika tidak ada user
        window.location.href = '/login';
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Memuat profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 h-32"></div>

          <div className="px-6 pb-6 -mt-16">
            <div className="flex flex-col items-center md:flex-row md:items-end">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 flex items-center justify-center text-gray-500">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Foto Profil"
                    className="w-full h-full rounded-xl object-cover"
                  />
                ) : (
                  'Foto Profil'
                )}
              </div>
              <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {profile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'Pengguna'}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">{user?.email}</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tentang Saya</h3>
                  <p className="text-gray-700 dark:text-gray-300">{profile?.bio || 'Tambahkan bio Anda di sini...'}</p>

                  <div className="mt-6">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Detail Pribadi</h4>
                    <div className="space-y-2">
                      <div className="flex">
                        <span className="w-32 text-gray-600 dark:text-gray-400">Tanggal Lahir</span>
                        <span className="text-gray-900 dark:text-white">{profile?.birthDate || '-'}</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-600 dark:text-gray-400">Lokasi</span>
                        <span className="text-gray-900 dark:text-white">{profile?.location || '-'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Statistik</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-3xl font-bold text-pink-600">24</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Momen Disimpan</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-purple-600">12</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Cerita Ditulis</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-indigo-600">8</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Anggota Keluarga</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Aksi</h3>
                  <div className="space-y-3">
                    <a href="/protected/profil/edit" className="block w-full px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 text-center">
                      Edit Profil
                    </a>
                    <a href="/protected/profil/ganti-foto" className="block w-full px-4 py-2 bg-white dark:bg-gray-600 border border-pink-600 text-pink-600 dark:text-pink-400 rounded-lg hover:bg-pink-50 dark:hover:bg-gray-500 text-center">
                      Ganti Foto
                    </a>
                    <button className="w-full px-4 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500">
                      Pengaturan Akun
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}