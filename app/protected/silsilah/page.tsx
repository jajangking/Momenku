'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/auth';
import { User as FirebaseUser } from 'firebase/auth';

export default function SilsilahPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
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
          <p className="mt-4 text-gray-600 dark:text-gray-300">Memuat silsilah...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Silsilah Keluarga</h2>

          <div className="mb-8">
            <button className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700">
              Tambah Anggota Keluarga
            </button>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-full inline-block align-middle">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pohon Keluarga</h3>
                <div className="flex flex-col items-center">
                  {/* Pohon keluarga sederhana */}
                  <div className="flex flex-col items-center">
                    <div className="bg-pink-100 dark:bg-pink-900 rounded-full w-24 h-24 flex items-center justify-center border-2 border-pink-300 dark:border-pink-700">
                      <span className="font-medium text-center">Kakek</span>
                    </div>

                    <div className="w-1 h-8 bg-gray-300 dark:bg-gray-600"></div>

                    <div className="flex space-x-12">
                      <div className="flex flex-col items-center">
                        <div className="bg-purple-100 dark:bg-purple-900 rounded-full w-24 h-24 flex items-center justify-center border-2 border-purple-300 dark:border-purple-700">
                          <span className="font-medium text-center">Ayah</span>
                        </div>

                        <div className="w-1 h-8 bg-gray-300 dark:bg-gray-600"></div>

                        <div className="bg-indigo-100 dark:bg-indigo-900 rounded-full w-24 h-24 flex items-center justify-center border-2 border-indigo-300 dark:border-indigo-700">
                          <span className="font-medium text-center">Saya</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="bg-purple-100 dark:bg-purple-900 rounded-full w-24 h-24 flex items-center justify-center border-2 border-purple-300 dark:border-purple-700">
                          <span className="font-medium text-center">Paman</span>
                        </div>

                        <div className="w-1 h-8 bg-gray-300 dark:bg-gray-600"></div>

                        <div className="bg-indigo-100 dark:bg-indigo-900 rounded-full w-24 h-24 flex items-center justify-center border-2 border-indigo-300 dark:border-indigo-700">
                          <span className="font-medium text-center">Sepupu</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Daftar Anggota Keluarga</h3>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nama</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Hubungan</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tanggal Lahir</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Kakek</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">Kakek</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">1 Januari 1940</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          <button className="text-pink-600 hover:text-pink-900 dark:text-pink-400 dark:hover:text-pink-300">Edit</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Nenek</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">Nenek</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">15 Maret 1942</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          <button className="text-pink-600 hover:text-pink-900 dark:text-pink-400 dark:hover:text-pink-300">Edit</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Ayah</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">Ayah</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">10 Juni 1965</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          <button className="text-pink-600 hover:text-pink-900 dark:text-pink-400 dark:hover:text-pink-300">Edit</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Ibu</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">Ibu</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">22 Agustus 1968</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          <button className="text-pink-600 hover:text-pink-900 dark:text-pink-400 dark:hover:text-pink-300">Edit</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Saya</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">Anak</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">5 Mei 1995</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          <button className="text-pink-600 hover:text-pink-900 dark:text-pink-400 dark:hover:text-pink-300">Edit</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}