# Panduan Penggunaan API Groq untuk MomenKu

## Model-model yang Tersedia

Berikut adalah model-model yang tersedia di Groq Cloud:

1. **gemma-7b-it** - Model dari Google yang baik untuk instruksi dan percakapan
2. **mixtral-8x7b-32768** - Model ensemble yang kuat untuk berbagai tugas
3. **llama3-8b-8192** - Model Llama3 dengan konteks panjang
4. **llama3-70b-8192** - Versi yang lebih besar dari Llama3
5. **llama2-70b-4096** - Model Llama2 versi besar

## Penggunaan dalam Aplikasi

Saat ini, aplikasi MomenKu menggunakan model `llama3-8b-8192` untuk fitur penulisan cerita dengan AI. Model ini dipilih karena efisiensi dan kualitas respons yang baik untuk tugas instruksi.

## Catatan tentang GPT OSS

Groq tidak menyediakan model GPT OSS (Open Source Software) secara langsung. Groq menyediakan akses ke model-model dari berbagai perusahaan seperti:
- Meta (Llama series)
- Mistral AI (Mixtral)
- Google (Gemma)

Model `openai/gpt-oss-120b` yang mungkin tercantum dalam dokumentasi adalah model hipotesis atau contoh, dan kemungkinan besar tidak tersedia di layanan Groq Cloud saat ini. Model-model yang benar-benar tersedia di Groq antara lain:
- `llama3-8b-8192`
- `llama3-70b-8192`
- `mixtral-8x7b-32768`
- `gemma-7b-it`

Jika Anda mencari model open source yang bisa dihost sendiri, beberapa alternatif termasuk:
- Llama dari Meta (memerlukan lisensi)
- Mistral dari Mistral AI
- Gemma dari Google
- Model-model dari Hugging Face (seperti Zephyr, Phi, dll.)

## Konfigurasi

Model dapat diubah di file `/app/api/groq/route.ts` dengan mengganti nilai parameter `model` dalam permintaan API.

## Catatan Penting

- Pastikan untuk selalu memeriksa dokumentasi resmi Groq untuk model-model terbaru
- Beberapa model mungkin memiliki biaya atau batasan penggunaan yang berbeda
- Gunakan model yang paling sesuai dengan kebutuhan aplikasi Anda

## Troubleshooting

Jika Anda mendapatkan error "model has been decommissioned", periksa dokumentasi resmi Groq untuk model pengganti yang direkomendasikan.