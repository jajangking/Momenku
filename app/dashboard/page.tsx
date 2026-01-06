import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Selamat Datang di Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Ini adalah halaman dashboard setelah login. Anda dapat mengakses berbagai fitur MomenKu dari sini.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/protected/momen" className="bg-pink-50 dark:bg-gray-700 p-6 rounded-lg hover:bg-pink-100 dark:hover:bg-gray-600 transition duration-300">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Momen Spesial</h3>
              <p className="text-gray-600 dark:text-gray-300">Simpan dan lihat momen-momen penting Anda</p>
            </Link>

            <Link href="/protected/silsilah" className="bg-purple-50 dark:bg-gray-700 p-6 rounded-lg hover:bg-purple-100 dark:hover:bg-gray-600 transition duration-300">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Silsilah Keluarga</h3>
              <p className="text-gray-600 dark:text-gray-300">Lihat dan kelola struktur keluarga Anda</p>
            </Link>

            <Link href="/protected/cerita" className="bg-indigo-50 dark:bg-gray-700 p-6 rounded-lg hover:bg-indigo-100 dark:hover:bg-gray-600 transition duration-300">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Cerita Keluarga</h3>
              <p className="text-gray-600 dark:text-gray-300">Baca dan tulis kisah-kisah keluarga</p>
            </Link>

            <Link href="/protected/profil" className="bg-blue-50 dark:bg-gray-700 p-6 rounded-lg hover:bg-blue-100 dark:hover:bg-gray-600 transition duration-300">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Profil Saya</h3>
              <p className="text-gray-600 dark:text-gray-300">Lihat dan edit informasi pribadi Anda</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}