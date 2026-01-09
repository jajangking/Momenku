'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, getCeritaById, deleteCerita } from '@/lib/firebase/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { User as FirebaseUser } from 'firebase/auth';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function DetailCeritaPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [cerita, setCerita] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const ceritaId = searchParams.get('id');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && ceritaId) {
        setUser(user);

        // Ambil cerita berdasarkan ID
        const { cerita: ceritaData, error } = await getCeritaById(ceritaId);
        if (ceritaData) {
          setCerita(ceritaData);
        } else {
          alert('Cerita tidak ditemukan');
          router.push('/protected/cerita');
        }
      } else {
        // Redirect ke login jika tidak ada user
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, ceritaId]);

  const handleDelete = async () => {
    if (!ceritaId) return;

    if (confirm('Apakah Anda yakin ingin menghapus cerita ini?')) {
      setDeleting(true);
      const { success, error } = await deleteCerita(ceritaId);
      if (success) {
        alert('Cerita berhasil dihapus!');
        router.push('/protected/cerita');
      } else {
        alert('Gagal menghapus cerita: ' + error);
        setDeleting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{cerita?.title || 'Tanpa Judul'}</h1>
            <div className="flex space-x-2">
              <Link
                href={`/protected/cerita/edit?id=${ceritaId}`}
                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 text-sm"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className={`px-4 py-2 rounded-lg text-sm ${
                  deleting
                    ? 'bg-red-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {deleting ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>

          <div className="text-gray-600 dark:text-gray-400 text-sm mb-6">
            <div>Ditulis pada: {cerita?.createdAt ? new Date(cerita.createdAt).toLocaleDateString('id-ID') : 'Tanggal tidak disimpan'}</div>
            {cerita?.updatedAt && (
              <div className="mt-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200">
                  Diedit pada: {new Date(cerita.updatedAt).toLocaleDateString('id-ID')}
                </span>
              </div>
            )}
          </div>

          <div className="prose prose-pink max-w-none dark:prose-invert text-gray-700 dark:text-gray-300 prose-headings:text-gray-900 prose-headings:dark:text-white prose-p:leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {cerita?.content || 'Isi cerita belum ditulis...'}
            </ReactMarkdown>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/protected/cerita"
            className="inline-block px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Kembali ke Daftar Cerita
          </Link>
        </div>
      </main>
    </div>
  );
}