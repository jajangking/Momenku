'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, getUserCerita, deleteCerita } from '@/lib/firebase/auth';
import { User as FirebaseUser } from 'firebase/auth';

export default function CeritaPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [ceritaList, setCeritaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);

        // Ambil cerita pengguna dari Firestore
        const { cerita, error } = await getUserCerita(user.uid);
        if (cerita) {
          setCeritaList(cerita);
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
          <p className="mt-4 text-gray-600 dark:text-gray-300">Memuat cerita...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Cerita Keluarga</h2>

          <div className="mb-8">
            <a href="/protected/cerita/tambah" className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 inline-block">
              Tambah Cerita Baru
            </a>
          </div>

          {ceritaList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ceritaList.map((cerita, index) => (
                <div key={cerita.id || index} className="bg-pink-50 dark:bg-gray-700 rounded-lg p-6 shadow">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{cerita.title || `Cerita ${index + 1}`}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    Ditulis oleh: {cerita.author || 'Anda'} • {cerita.date || 'Tanggal tidak disimpan'}
                  </p>
                  <div
                    className="text-gray-700 dark:text-gray-300 max-h-20 overflow-hidden prose prose-sm prose-pink dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: cerita.content || 'Isi cerita belum ditambahkan...' }}
                  />
                  <div className="mt-4 flex justify-between items-center">
                    <a href={`/protected/cerita/detail?id=${cerita.id}`} className="text-pink-600 hover:text-pink-800 dark:text-pink-400 dark:hover:text-pink-300 text-sm">
                      Baca selengkapnya →
                    </a>
                    <div className="flex space-x-2">
                      <a
                        href={`/protected/cerita/edit?id=${cerita.id}`}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                      >
                        Edit
                      </a>
                      <button
                        onClick={async () => {
                          if (confirm('Apakah Anda yakin ingin menghapus cerita ini?')) {
                            // Panggil fungsi hapus cerita
                            const { success, error } = await deleteCerita(cerita.id);
                            if (success) {
                              // Hapus item dari state
                              setCeritaList(prev => prev.filter(c => c.id !== cerita.id));
                              alert('Cerita berhasil dihapus!');
                            } else {
                              alert('Gagal menghapus cerita: ' + error);
                            }
                          }
                        }}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">Belum ada cerita yang ditulis. Tulis cerita pertama Anda!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}