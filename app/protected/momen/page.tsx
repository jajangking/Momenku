'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, getUserMomen } from '@/lib/firebase/auth';
import { User as FirebaseUser } from 'firebase/auth';

export default function MomenPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [momenList, setMomenList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);

        // Ambil momen pengguna dari Firestore
        const { momen, error } = await getUserMomen(user.uid);
        if (momen) {
          setMomenList(momen);
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
          <p className="mt-4 text-gray-600 dark:text-gray-300">Memuat momen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Momen Spesial Saya</h2>

          <div className="mb-8">
            <a href="/protected/momen/tambah" className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 inline-block">
              Tambah Momen Baru
            </a>
          </div>

          {momenList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {momenList.map((momen, index) => (
                <div key={momen.id || index} className="bg-pink-50 dark:bg-gray-700 rounded-lg p-4 shadow">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48" />
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mt-2">{momen.title || `Momen ${index + 1}`}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{momen.date || 'Tanggal tidak disimpan'}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">{momen.description || 'Deskripsi momen...'}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">Belum ada momen yang disimpan. Tambahkan momen pertama Anda!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}