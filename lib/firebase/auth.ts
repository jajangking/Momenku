import { app } from './config';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

// Import Firestore functions
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';

// Import Firebase Storage functions
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';

// Inisialisasi auth, firestore, dan storage
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Fungsi login dengan email dan password
const loginUser = async (email: string, password: string) => {
  try {
    console.log('Mencoba login untuk email:', email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Login berhasil untuk user:', userCredential.user?.email);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    console.error('Error saat login:', error);
    return { user: null, error: error.message };
  }
};

// Fungsi register dengan email dan password
const registerUser = async (email: string, password: string) => {
  try {
    console.log('Mencoba registrasi untuk email:', email);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('Registrasi berhasil, membuat profil untuk user:', user.uid);

    // Buat dokumen profil pengguna di Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: user.email?.split('@')[0] || 'Pengguna Baru',
      photoURL: user.photoURL || '',
      bio: 'Seorang yang menyukai momen-momen indah bersama keluarga',
      location: '',
      birthDate: '',
      createdAt: serverTimestamp()
    });
    console.log('Profil pengguna dibuat di Firestore');

    // Buat koleksi momen kosong untuk pengguna
    await setDoc(doc(db, 'momen', user.uid), {
      userId: user.uid,
      momen: []
    });
    console.log('Koleksi momen dibuat');

    // Buat koleksi cerita kosong untuk pengguna
    await setDoc(doc(db, 'cerita', user.uid), {
      userId: user.uid,
      cerita: []
    });
    console.log('Koleksi cerita dibuat');

    // Buat koleksi silsilah kosong untuk pengguna
    await setDoc(doc(db, 'silsilah', user.uid), {
      userId: user.uid,
      anggotaKeluarga: []
    });
    console.log('Koleksi silsilah dibuat');

    return { user, error: null };
  } catch (error: any) {
    console.error('Error saat registrasi:', error);
    return { user: null, error: error.message };
  }
};

// Fungsi logout
const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Fungsi reset password
const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Fungsi login dengan Google
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Buat dokumen profil pengguna di Firestore jika belum ada
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0] || 'Pengguna Baru',
        photoURL: user.photoURL || '',
        bio: 'Seorang yang menyukai momen-momen indah bersama keluarga',
        location: '',
        birthDate: '',
        createdAt: serverTimestamp()
      });

      // Buat koleksi momen kosong untuk pengguna
      await setDoc(doc(db, 'momen', user.uid), {
        userId: user.uid,
        momen: []
      });

      // Buat koleksi cerita kosong untuk pengguna
      await setDoc(doc(db, 'cerita', user.uid), {
        userId: user.uid,
        cerita: []
      });

      // Buat koleksi silsilah kosong untuk pengguna
      await setDoc(doc(db, 'silsilah', user.uid), {
        userId: user.uid,
        anggotaKeluarga: []
      });
    }

    return { user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

// Fungsi untuk mendapatkan profil pengguna dari Firestore
const getUserProfile = async (userId: string) => {
  try {
    console.log('Mengambil profil pengguna untuk ID:', userId);
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      console.log('Profil pengguna ditemukan');
      return { profile: userDocSnap.data(), error: null };
    } else {
      console.log('Profil pengguna tidak ditemukan');
      return { profile: null, error: 'Profil pengguna tidak ditemukan' };
    }
  } catch (error: any) {
    console.error('Error saat mengambil profil pengguna:', error);
    return { profile: null, error: error.message };
  }
};

// Fungsi untuk memperbarui profil pengguna di Firestore
const updateUserProfile = async (userId: string, profileData: any) => {
  try {
    console.log('Memperbarui profil pengguna untuk ID:', userId);
    console.log('Data yang akan diperbarui:', profileData);
    const userDocRef = doc(db, 'users', userId);

    // Periksa apakah dokumen sudah ada
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      // Jika dokumen sudah ada, lakukan update
      await updateDoc(userDocRef, profileData);
      console.log('Profil pengguna berhasil diperbarui');
    } else {
      // Jika dokumen belum ada, buat dokumen baru
      await setDoc(userDocRef, profileData);
      console.log('Profil pengguna baru berhasil dibuat');
    }

    return { success: true, error: null };
  } catch (error: any) {
    console.error('Error saat memperbarui profil pengguna:', error);
    return { success: false, error: error.message };
  }
};

// Fungsi untuk mengunggah foto ke Firebase Storage
const uploadProfilePicture = async (userId: string, file: File) => {
  try {
    console.log('Memulai upload foto profil untuk user:', userId);
    console.log('Nama file:', file.name);
    console.log('Ukuran file:', file.size, 'bytes');
    console.log('Tipe file:', file.type);

    // Buat referensi ke lokasi file di storage
    const storageRef = ref(storage, `profile_pictures/${userId}/${file.name}`);
    console.log('Referensi storage dibuat:', storageRef.fullPath);

    // Upload file
    console.log('Memulai proses upload...');
    const snapshot = await uploadBytes(storageRef, file);
    console.log('Upload selesai, bytes terkirim:', snapshot.bytesTransferred);

    // Dapatkan URL download
    console.log('Mengambil URL download...');
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('URL download diperoleh:', downloadURL);

    // Update profil pengguna dengan URL foto
    console.log('Memperbarui profil pengguna dengan URL foto baru...');
    const { success, error } = await updateUserProfile(userId, { photoURL: downloadURL });

    if (success) {
      console.log('Profil pengguna berhasil diperbarui');
    } else {
      console.error('Gagal memperbarui profil pengguna:', error);
      throw new Error(error);
    }

    return { url: downloadURL, error: null };
  } catch (error: any) {
    console.error('Error saat mengunggah foto profil:', error);
    return { url: null, error: error.message };
  }
};

// Fungsi untuk mengunggah foto momen ke Firebase Storage
const uploadMomenPicture = async (userId: string, momenId: string, file: File) => {
  try {
    console.log('Memulai upload foto momen untuk user:', userId, 'dengan momen ID:', momenId);
    console.log('Nama file:', file.name);
    console.log('Ukuran file:', file.size, 'bytes');
    console.log('Tipe file:', file.type);

    // Buat referensi ke lokasi file di storage
    const storageRef = ref(storage, `momen_pictures/${userId}/${momenId}/${file.name}`);
    console.log('Referensi storage dibuat:', storageRef.fullPath);

    // Upload file
    console.log('Memulai proses upload...');
    const snapshot = await uploadBytes(storageRef, file);
    console.log('Upload selesai, bytes terkirim:', snapshot.bytesTransferred);

    // Dapatkan URL download
    console.log('Mengambil URL download...');
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('URL download diperoleh:', downloadURL);

    return { url: downloadURL, error: null };
  } catch (error: any) {
    console.error('Error saat mengunggah foto momen:', error);
    return { url: null, error: error.message };
  }
};

// Fungsi untuk menambahkan momen baru
const addMomen = async (userId: string, momenData: any) => {
  try {
    const momenRef = await addDoc(collection(db, 'momen'), {
      userId,
      ...momenData,
      createdAt: serverTimestamp()
    });
    return { id: momenRef.id, error: null };
  } catch (error: any) {
    return { id: null, error: error.message };
  }
};

// Fungsi untuk mendapatkan semua momen pengguna
const getUserMomen = async (userId: string) => {
  try {
    const q = query(collection(db, 'momen'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const momenList: any[] = [];
    querySnapshot.forEach((doc) => {
      momenList.push({ id: doc.id, ...doc.data() });
    });
    return { momen: momenList, error: null };
  } catch (error: any) {
    return { momen: [], error: error.message };
  }
};

// Fungsi untuk menambahkan cerita baru
const addCerita = async (userId: string, ceritaData: any) => {
  try {
    console.log('Menambahkan cerita baru untuk user:', userId);
    console.log('Data cerita:', ceritaData);
    const ceritaRef = await addDoc(collection(db, 'cerita'), {
      userId,
      ...ceritaData,
      createdAt: serverTimestamp()
    });
    console.log('Cerita berhasil ditambahkan dengan ID:', ceritaRef.id);
    return { id: ceritaRef.id, error: null };
  } catch (error: any) {
    console.error('Error saat menambahkan cerita:', error);
    return { id: null, error: error.message };
  }
};

// Fungsi untuk mendapatkan semua cerita pengguna
const getUserCerita = async (userId: string) => {
  try {
    console.log('Mengambil cerita untuk user:', userId);
    const q = query(collection(db, 'cerita'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const ceritaList: any[] = [];
    querySnapshot.forEach((doc) => {
      ceritaList.push({ id: doc.id, ...doc.data() });
    });
    console.log('Jumlah cerita ditemukan:', ceritaList.length);
    return { cerita: ceritaList, error: null };
  } catch (error: any) {
    console.error('Error saat mengambil cerita:', error);
    return { cerita: [], error: error.message };
  }
};

// Fungsi untuk mendapatkan cerita berdasarkan ID
const getCeritaById = async (ceritaId: string) => {
  try {
    console.log('Mengambil cerita dengan ID:', ceritaId);
    const ceritaDocRef = doc(db, 'cerita', ceritaId);
    const ceritaDocSnap = await getDoc(ceritaDocRef);

    if (ceritaDocSnap.exists()) {
      console.log('Cerita ditemukan');
      return { cerita: { id: ceritaDocSnap.id, ...ceritaDocSnap.data() }, error: null };
    } else {
      console.log('Cerita tidak ditemukan');
      return { cerita: null, error: 'Cerita tidak ditemukan' };
    }
  } catch (error: any) {
    console.error('Error saat mengambil cerita berdasarkan ID:', error);
    return { cerita: null, error: error.message };
  }
};

// Fungsi untuk memperbarui cerita
const updateCerita = async (ceritaId: string, ceritaData: any) => {
  try {
    console.log('Memperbarui cerita dengan ID:', ceritaId);
    console.log('Data yang akan diperbarui:', ceritaData);
    const ceritaDocRef = doc(db, 'cerita', ceritaId);

    // Periksa apakah dokumen sudah ada
    const ceritaDocSnap = await getDoc(ceritaDocRef);

    if (ceritaDocSnap.exists()) {
      await updateDoc(ceritaDocRef, ceritaData);
      console.log('Cerita berhasil diperbarui');
      return { success: true, error: null };
    } else {
      console.log('Cerita tidak ditemukan');
      return { success: false, error: 'Cerita tidak ditemukan' };
    }
  } catch (error: any) {
    console.error('Error saat memperbarui cerita:', error);
    return { success: false, error: error.message };
  }
};

// Fungsi untuk menghapus cerita
const deleteCerita = async (ceritaId: string) => {
  try {
    console.log('Menghapus cerita dengan ID:', ceritaId);
    const ceritaDocRef = doc(db, 'cerita', ceritaId);

    // Periksa apakah dokumen sudah ada
    const ceritaDocSnap = await getDoc(ceritaDocRef);

    if (ceritaDocSnap.exists()) {
      await deleteDoc(ceritaDocRef);
      console.log('Cerita berhasil dihapus');
      return { success: true, error: null };
    } else {
      console.log('Cerita tidak ditemukan');
      return { success: false, error: 'Cerita tidak ditemukan' };
    }
  } catch (error: any) {
    console.error('Error saat menghapus cerita:', error);
    return { success: false, error: error.message };
  }
};

export {
  auth,
  db,
  storage,
  loginUser,
  registerUser,
  logoutUser,
  resetPassword,
  signInWithGoogle,
  getUserProfile,
  updateUserProfile,
  uploadProfilePicture,
  uploadMomenPicture,
  addMomen,
  getUserMomen,
  addCerita,
  getUserCerita,
  getCeritaById,
  updateCerita,
  deleteCerita
};