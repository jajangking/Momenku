import { useState, useEffect } from 'react';

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  birthDate?: string;
  parentId?: string;
  childrenIds?: string[];
  spouseId?: string;
}

interface EditFamilyMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member?: FamilyMember;
  onSave: (member: FamilyMember) => void;
  familyMembers: FamilyMember[];
}

export default function EditFamilyMemberModal({
  isOpen,
  onClose,
  member,
  onSave,
  familyMembers
}: EditFamilyMemberModalProps) {
  const [name, setName] = useState(member?.name || '');
  const [relationship, setRelationship] = useState(member?.relationship || '');
  const [birthDate, setBirthDate] = useState(member?.birthDate || '');
  const [parentId, setParentId] = useState(member?.parentId || '');
  const [spouseId, setSpouseId] = useState(member?.spouseId || '');

  useEffect(() => {
    if (member) {
      setName(member.name || '');
      setRelationship(member.relationship || '');
      setBirthDate(member.birthDate || '');
      setParentId(member.parentId || '');
      setSpouseId(member.spouseId || '');
    } else {
      setName('');
      setRelationship('');
      setBirthDate('');
      setParentId('');
      setSpouseId('');
    }
  }, [member]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedMember: FamilyMember = {
      id: member?.id || Date.now().toString(),
      name,
      relationship,
      birthDate,
      parentId: parentId || undefined,
      spouseId: spouseId || undefined,
    };

    onSave(updatedMember);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md">
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            {member ? 'Edit Anggota Keluarga' : 'Tambah Anggota Keluarga'}
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Nama</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Hubungan</label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Pilih hubungan</option>
                <option value="Kakek">Kakek</option>
                <option value="Nenek">Nenek</option>
                <option value="Ayah">Ayah</option>
                <option value="Ibu">Ibu</option>
                <option value="Anak">Anak</option>
                <option value="Saudara">Saudara</option>
                <option value="Paman">Paman</option>
                <option value="Bibi">Bibi</option>
                <option value="Sepupu">Sepupu</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Tanggal Lahir</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Orang Tua</label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Tidak ada</option>
                {familyMembers.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.relationship})
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Pasangan</label>
              <select
                value={spouseId}
                onChange={(e) => setSpouseId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Tidak ada</option>
                {familyMembers
                  .filter(m => m.id !== member?.id) // Exclude current member
                  .map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.relationship})
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 font-medium bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-white font-medium bg-pink-600 hover:bg-pink-700 transition duration-300"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}