'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, registerUser, resetPassword, signInWithGoogle } from '@/lib/firebase/auth';
import Link from 'next/link';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!isLogin) {
      // Register
      if (password !== confirmPassword) {
        setMessage({ type: 'error', text: 'Password dan konfirmasi password tidak cocok' });
        setLoading(false);
        return;
      }

      const { user, error } = await registerUser(email, password);
      if (user) {
        setMessage({ type: 'success', text: 'Registrasi berhasil! Silakan login.' });
        setIsLogin(true);
      } else {
        setMessage({ type: 'error', text: error || 'Registrasi gagal' });
      }
    } else {
      // Login
      const { user, error } = await loginUser(email, password);
      if (user) {
        setMessage({ type: 'success', text: 'Login berhasil!' });
        router.push('/dashboard'); // Arahkan ke dashboard setelah login
      } else {
        setMessage({ type: 'error', text: error || 'Login gagal' });
      }
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setMessage(null);

    const { user, error } = await signInWithGoogle();
    if (user) {
      setMessage({ type: 'success', text: 'Login dengan Google berhasil!' });
      router.push('/dashboard');
    } else {
      setMessage({ type: 'error', text: error || 'Login dengan Google gagal' });
    }

    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage({ type: 'error', text: 'Silakan masukkan email Anda' });
      return;
    }

    setLoading(true);
    const { success, error } = await resetPassword(email);
    if (success) {
      setMessage({ type: 'success', text: 'Link reset password telah dikirim ke email Anda' });
    } else {
      setMessage({ type: 'error', text: error || 'Gagal mengirim link reset password' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">MomenKu</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {isLogin ? 'Masuk ke akun Anda' : 'Buat akun baru'}
            </p>
          </div>

          {message && (
            <div
              className={`mb-6 p-4 rounded-lg text-center ${
                message.type === 'success'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
                placeholder="email@example.com"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
                placeholder="••••••••"
                required
              />
            </div>

            {!isLogin && (
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-gray-700 dark:text-gray-300 mb-2">
                  Konfirmasi Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
                  placeholder="••••••••"
                  required
                />
              </div>
            )}

            {isLogin && (
              <div className="mb-6 text-right">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-pink-600 hover:text-pink-800 dark:text-pink-400 dark:hover:text-pink-300"
                  disabled={loading}
                >
                  Lupa password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
                loading
                  ? 'bg-pink-400 cursor-not-allowed'
                  : 'bg-pink-600 hover:bg-pink-700'
              } transition duration-300`}
              disabled={loading}
            >
              {loading ? 'Memproses...' : (isLogin ? 'Masuk' : 'Daftar')}
            </button>
          </form>

          <div className="mt-6">
            <button
              onClick={handleGoogleLogin}
              className={`w-full py-3 px-4 rounded-lg font-medium border ${
                loading
                  ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              } transition duration-300 flex items-center justify-center`}
              disabled={loading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {loading ? 'Memproses...' : 'Masuk dengan Google'}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setMessage(null);
                }}
                className="text-pink-600 hover:text-pink-800 dark:text-pink-400 dark:hover:text-pink-300 font-medium"
              >
                {isLogin ? 'Daftar di sini' : 'Masuk di sini'}
              </button>
            </p>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 px-8 py-4 text-center">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            &copy; {new Date().getFullYear()} MomenKu. Semua hak dilindungi.
          </p>
        </div>
      </div>
    </div>
  );
}