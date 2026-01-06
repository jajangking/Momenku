'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, getCeritaById, updateCerita } from '@/lib/firebase/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { User as FirebaseUser } from 'firebase/auth';
import RichTextEditor from '@/components/RichTextEditor';

export default function EditCeritaPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [cerita, setCerita] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    date: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
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
          setFormData({
            title: ceritaData.title || '',
            content: ceritaData.content || '',
            date: ceritaData.date || ''
          });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    if (ceritaId) {
      const { success, error } = await updateCerita(ceritaId, formData);
      if (success) {
        alert('Cerita berhasil diperbarui!');
        router.push('/protected/cerita');
      } else {
        alert('Gagal memperbarui cerita: ' + error);
      }
    }

    setSaving(false);
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      alert('Silakan masukkan prompt untuk AI');
      return;
    }

    setAiGenerating(true);

    try {
      const response = await fetch('/api/groq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Tulis atau perbarui bagian cerita keluarga berdasarkan: ${aiPrompt}`
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menghasilkan cerita');
      }

      const data = await response.json();
      setFormData(prev => ({
        ...prev,
        content: data.text
      }));
    } catch (error: any) {
      alert('Gagal menghasilkan cerita dengan AI: ' + error.message);
    } finally {
      setAiGenerating(false);
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
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Cerita</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Judul Cerita</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
                placeholder="Contoh: Asal Usul Nama Keluarga"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Tanggal</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Buat Cerita dengan AI</label>
              <div className="flex">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="flex-grow px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Deskripsikan perubahan cerita yang ingin Anda buat..."
                />
                <button
                  type="button"
                  onClick={handleAIGenerate}
                  disabled={aiGenerating}
                  className={`px-4 py-2 rounded-r-lg text-white font-medium ${
                    aiGenerating
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } transition duration-300`}
                >
                  {aiGenerating ? 'Menghasilkan...' : 'AI'}
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Ditenagai oleh AI Groq</p>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Isi Cerita</label>
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg">
                <RichTextEditor
                  value={formData.content}
                  onChange={(value) => setFormData({...formData, content: value})}
                  placeholder="Tulis cerita keluarga Anda di sini... Gunakan toolbar untuk memformat teks."
                />
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={saving}
                className={`px-6 py-2 rounded-lg text-white font-medium ${
                  saving 
                    ? 'bg-pink-400 cursor-not-allowed' 
                    : 'bg-pink-600 hover:bg-pink-700'
                } transition duration-300`}
              >
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
              
              <button
                type="button"
                onClick={() => router.push('/protected/cerita')}
                className="px-6 py-2 rounded-lg text-gray-700 dark:text-gray-300 font-medium bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}