'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, addCerita } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';
import { User as FirebaseUser } from 'firebase/auth';
import RichTextEditor from '@/components/RichTextEditor';
import AIAssistant from '@/components/AIAssistant';

export default function TambahCeritaPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    date: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [chatMessages, setChatMessages] = useState<{ id: string; text: string; sender: 'user' | 'ai'; timestamp: Date }[]>([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        // Redirect ke login jika tidak ada user
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    if (user) {
      const { id, error } = await addCerita(user.uid, {
        ...formData,
        author: user.displayName || user.email?.split('@')[0] || 'Penulis'
      });
      if (id) {
        alert('Cerita berhasil ditambahkan!');
        router.push('/protected/cerita');
      } else {
        alert('Gagal menambahkan cerita: ' + error);
      }
    }

    setSaving(false);
  };

  const addMessage = (text: string, sender: 'user' | 'ai') => {
    const newMessage = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, newMessage]);
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      alert('Silakan masukkan teks yang ingin diproses oleh AI');
      return;
    }

    addMessage(aiPrompt, 'user');
    setAiGenerating(true);

    try {
      const response = await fetch('/api/groq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Tulis sebuah cerita keluarga yang indah dan bermakna berdasarkan: ${aiPrompt}`
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

      // Add AI response to chat
      addMessage(`Saya telah membuat cerita baru berdasarkan permintaan Anda: "${aiPrompt}". Cerita telah ditambahkan ke editor.`, 'ai');
    } catch (error: any) {
      const errorMessage = 'Gagal menghasilkan cerita dengan AI: ' + error.message;
      alert(errorMessage);
      addMessage(errorMessage, 'ai');
    } finally {
      setAiGenerating(false);
    }
  };

  const handleAISimplify = async () => {
    if (!formData.content.trim()) {
      alert('Silakan tulis cerita terlebih dahulu');
      return;
    }

    addMessage("Bantu saya menyederhanakan teks yang sudah saya tulis agar lebih mudah dipahami.", 'user');
    setAiGenerating(true);

    try {
      const response = await fetch('/api/groq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Sederhanakan dan buat mudah dipahami teks berikut tanpa menghilangkan maknanya: ${formData.content}`
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menyederhanakan teks');
      }

      const data = await response.json();
      setFormData(prev => ({
        ...prev,
        content: data.text
      }));

      // Add AI response to chat
      addMessage("Saya telah menyederhanakan teks Anda agar lebih mudah dipahami. Perubahan telah diterapkan ke editor.", 'ai');
    } catch (error: any) {
      const errorMessage = 'Gagal menyederhanakan teks dengan AI: ' + error.message;
      alert(errorMessage);
      addMessage(errorMessage, 'ai');
    } finally {
      setAiGenerating(false);
    }
  };

  const handleAICleanUp = async () => {
    if (!formData.content.trim()) {
      alert('Silakan tulis cerita terlebih dahulu');
      return;
    }

    addMessage("Bantu saya merapihkan teks yang sudah saya tulis, perbaiki tata bahasa dan ejaan.", 'user');
    setAiGenerating(true);

    try {
      const response = await fetch('/api/groq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Perbaiki tata bahasa, ejaan, dan struktur kalimat dari teks berikut tanpa mengubah maknanya: ${formData.content}`
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal merapihkan teks');
      }

      const data = await response.json();
      setFormData(prev => ({
        ...prev,
        content: data.text
      }));

      // Add AI response to chat
      addMessage("Saya telah merapihkan teks Anda, memperbaiki tata bahasa dan ejaan. Perubahan telah diterapkan ke editor.", 'ai');
    } catch (error: any) {
      const errorMessage = 'Gagal merapihkan teks dengan AI: ' + error.message;
      alert(errorMessage);
      addMessage(errorMessage, 'ai');
    } finally {
      setAiGenerating(false);
    }
  };

  const handleAIFormat = async () => {
    if (!formData.content.trim()) {
      alert('Silakan tulis cerita terlebih dahulu');
      return;
    }

    addMessage("Bantu saya memformat teks yang sudah saya tulis agar lebih rapih dan enak dibaca.", 'user');
    setAiGenerating(true);

    try {
      const response = await fetch('/api/groq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Format teks berikut agar lebih rapih dan enak dibaca, tambahkan paragraf dan struktur yang sesuai: ${formData.content}`
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal memformat teks');
      }

      const data = await response.json();
      setFormData(prev => ({
        ...prev,
        content: data.text
      }));

      // Add AI response to chat
      addMessage("Saya telah memformat teks Anda agar lebih rapih dan enak dibaca. Perubahan telah diterapkan ke editor.", 'ai');
    } catch (error: any) {
      const errorMessage = 'Gagal memformat teks dengan AI: ' + error.message;
      alert(errorMessage);
      addMessage(errorMessage, 'ai');
    } finally {
      setAiGenerating(false);
    }
  };

  const handleAISuggestion = async (suggestion: string) => {
    if (!suggestion.trim()) {
      alert('Silakan masukkan permintaan untuk AI');
      return;
    }

    addMessage(suggestion, 'user');
    setAiGenerating(true);

    try {
      const response = await fetch('/api/groq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: suggestion
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal mendapatkan saran dari AI');
      }

      const data = await response.json();
      setFormData(prev => ({
        ...prev,
        content: data.text
      }));

      // Add AI response to chat
      addMessage(`Berikut adalah saran saya berdasarkan permintaan Anda: "${suggestion}". Telah diterapkan ke editor.`, 'ai');
    } catch (error: any) {
      const errorMessage = 'Gagal mendapatkan saran dari AI: ' + error.message;
      alert(errorMessage);
      addMessage(errorMessage, 'ai');
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Tambah Cerita Baru</h2>

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
                {saving ? 'Menyimpan...' : 'Simpan Cerita'}
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
      <AIAssistant
        onSuggestion={handleAISuggestion}
        onSimplify={handleAISimplify}
        onCleanUp={handleAICleanUp}
        onFormat={handleAIFormat}
        isProcessing={aiGenerating}
        chatMessages={chatMessages}
        onSendMessage={(message) => addMessage(message, 'user')}
      />
    </div>
  );
}