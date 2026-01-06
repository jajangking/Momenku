'use client';

import { useState, useEffect } from 'react';

export default function ModelsPage() {
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch('/api/groq/models');
        if (!response.ok) {
          throw new Error('Gagal mengambil daftar model');
        }
        const data = await response.json();
        setModels(data.models);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Mengambil daftar model...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md max-w-md">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Error</h2>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Model-model Tersedia di Groq</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {models.map((model, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 dark:text-white">{model.id}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">Dimiliki oleh: {model.owned_by}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">{model.created ? new Date(model.created * 1000).toLocaleDateString('id-ID') : 'Tanggal tidak tersedia'}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <h3 className="font-bold text-blue-800 dark:text-blue-200 mb-2">Model Rekomendasi untuk MomenKu</h3>
            <ul className="list-disc pl-5 text-blue-700 dark:text-blue-300 space-y-1">
              <li><code>gemma-7b-it</code> - Cocok untuk instruksi dan percakapan</li>
              <li><code>llama3-8b-8192</code> - Model Llama3 dengan konteks panjang</li>
              <li><code>mixtral-8x7b-32768</code> - Model ensemble yang kuat</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}