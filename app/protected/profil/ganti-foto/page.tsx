'use client';

import { useState, useRef, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, getUserProfile, uploadProfilePicture } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';
import { User as FirebaseUser } from 'firebase/auth';

export default function GantiFotoPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);

        // Ambil profil pengguna dari Firestore
        const { profile: userProfile, error } = await getUserProfile(user.uid);
        if (userProfile) {
          setProfile(userProfile);
          setPreviewUrl(userProfile.photoURL);
        }
      } else {
        // Redirect ke login jika tidak ada user
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validasi ukuran file (maks 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File terlalu besar. Maksimal 5MB.');
        return;
      }

      // Validasi tipe file
      if (!file.type.startsWith('image/')) {
        setError('Silakan pilih file gambar (JPG, PNG, GIF)');
        return;
      }

      setError(null);
      setSelectedFile(file);

      // Buat preview URL untuk file yang dipilih
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!user || !selectedFile) {
      setError('Silakan pilih file terlebih dahulu');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Simulasi progress upload (karena Firebase Storage SDK tidak menyediakan progress listener di client web)
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      const { url, error } = await uploadProfilePicture(user.uid, selectedFile);

      clearInterval(interval);
      setUploadProgress(100);

      if (url) {
        setTimeout(() => {
          alert('Foto profil berhasil diperbarui!');
          router.push('/protected/profil');
        }, 500);
      } else {
        setError('Gagal mengunggah foto: ' + error);
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mengunggah: ' + (err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
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
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Ganti Foto Profil</h2>

          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-48 h-48 flex items-center justify-center overflow-hidden">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview Foto Profil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500">Belum ada foto</span>
                )}
              </div>

              <button
                onClick={handleChooseFile}
                className="absolute bottom-2 right-2 bg-pink-600 text-white rounded-full p-2 hover:bg-pink-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Format: JPG, PNG, GIF (maks. 5MB)
            </p>

            {error && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
          </div>

          {uploading && (
            <div className="mb-6">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-pink-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Mengunggah... {uploadProgress}%
              </p>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={handleUpload}
              disabled={uploading || !selectedFile}
              className={`px-6 py-2 rounded-lg text-white font-medium ${
                uploading || !selectedFile
                  ? 'bg-pink-400 cursor-not-allowed'
                  : 'bg-pink-600 hover:bg-pink-700'
              } transition duration-300`}
            >
              {uploading ? 'Mengunggah...' : 'Simpan Foto'}
            </button>

            <button
              type="button"
              onClick={() => router.push('/protected/profil')}
              className="px-6 py-2 rounded-lg text-gray-700 dark:text-gray-300 font-medium bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300"
            >
              Batal
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}