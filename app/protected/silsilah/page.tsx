'use client';

import { useState } from 'react';
import Link from 'next/link';

// Type definition for family members
type FamilyMember = {
  id: string;
  name: string;
  relationship: string;
  age: number;
  isHead: boolean;
  familyId: string; // Links to the family tree
};

// Type definition for families
type Family = {
  id: string;
  headId: string;
  name: string; // Name of the family head
};

export default function SilsilahPage() {
  // State for families (family heads)
  const [families, setFamilies] = useState<Family[]>([
    { id: 'fam1', headId: '1', name: 'Bapak Jajang' },
    { id: 'fam2', headId: '2', name: 'Bapak Surya' },
  ]);
  
  // State for all family members
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    // Family 1 (Bapak Jajang)
    { id: '1', name: 'Bapak Jajang', relationship: 'Kepala Keluarga', age: 45, isHead: true, familyId: 'fam1' },
    { id: '2', name: 'Ibu Iin Kartini', relationship: 'Istri', age: 42, isHead: false, familyId: 'fam1' },
    { id: '3', name: 'Jajang', relationship: 'Anak', age: 18, isHead: false, familyId: 'fam1' },
    { id: '4', name: 'Naisa', relationship: 'Anak', age: 15, isHead: false, familyId: 'fam1' },
    // Family 2 (Bapak Surya)
    { id: '5', name: 'Bapak Surya', relationship: 'Kepala Keluarga', age: 50, isHead: true, familyId: 'fam2' },
    { id: '6', name: 'Ibu Lestari', relationship: 'Istri', age: 47, isHead: false, familyId: 'fam2' },
    { id: '7', name: 'Rizki', relationship: 'Anak', age: 20, isHead: false, familyId: 'fam2' },
  ]);
  
  // State for form
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    relationship: 'Kepala Keluarga',
    age: '',
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission for adding a new family head
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate new family ID
    const newFamilyId = `fam${Date.now()}`;
    
    // Add new family
    const newFamily: Family = {
      id: newFamilyId,
      headId: Date.now().toString(),
      name: formData.name
    };
    
    setFamilies([...families, newFamily]);
    
    // Add the new family head as a family member
    const newFamilyHead: FamilyMember = {
      id: newFamily.headId,
      name: formData.name,
      relationship: formData.relationship,
      age: parseInt(formData.age),
      isHead: true,
      familyId: newFamilyId
    };
    
    setFamilyMembers([...familyMembers, newFamilyHead]);
    
    // Reset form and close
    setFormData({ name: '', relationship: 'Kepala Keluarga', age: '' });
    setShowForm(false);
  };

  // Handle deleting a family (and all its members)
  const handleDeleteFamily = (familyId: string) => {
    setFamilies(families.filter(family => family.id !== familyId));
    setFamilyMembers(familyMembers.filter(member => member.familyId !== familyId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Daftar Kepala Keluarga</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Kelola kepala keluarga dan pohon keluarga mereka
              </p>
            </div>
            
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 sm:mt-0 px-6 py-2 bg-pink-600 text-white font-medium rounded-lg hover:bg-pink-700 transition duration-300"
            >
              Tambah Kepala Keluarga
            </button>
          </div>
          
          {/* Family Heads List */}
          {families.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {families.map((family) => {
                // Find the head of this family
                const head = familyMembers.find(member => 
                  member.id === family.headId && member.familyId === family.id
                );
                
                // Count total members in this family
                const familyMemberCount = familyMembers.filter(
                  member => member.familyId === family.id
                ).length;
                
                return (
                  <Link 
                    href={`/protected/silsilah/${family.id}`}
                    key={family.id}
                    className="block bg-gradient-to-r from-pink-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 border border-pink-200 dark:border-gray-600 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  >
                    <div className="flex items-center">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{family.name}</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          <span className="font-medium">Status:</span> Kepala Keluarga
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                          <span className="font-medium">Jumlah Anggota:</span> {familyMemberCount}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteFamily(family.id);
                          }}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Belum ada kepala keluarga. Silakan tambahkan kepala keluarga terlebih dahulu.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Tambah Kepala Keluarga
              </h3>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nama Kepala Keluarga
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Usia
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <input
                  type="hidden"
                  name="relationship"
                  value={formData.relationship}
                />
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-md hover:bg-pink-700"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}