'use client';

import { useState } from 'react';
import Link from 'next/link';

interface AIAgent {
  id: string;
  name: string;
  role: string;
  description: string;
  personality: string;
}

// Daftar industri/usaha yang tersedia
const businessIndustries = [
  { id: 'laundry', name: 'Laundry', description: 'Bisnis laundry dan pembersihan pakaian' },
  { id: 'restaurant', name: 'Restoran', description: 'Bisnis restoran dan makanan' },
  { id: 'retail', name: 'Ritel', description: 'Bisnis penjualan eceran' },
  { id: 'tech', name: 'Teknologi', description: 'Bisnis teknologi dan perangkat lunak' },
  { id: 'education', name: 'Pendidikan', description: 'Bisnis pendidikan dan pelatihan' },
  { id: 'healthcare', name: 'Kesehatan', description: 'Bisnis kesehatan dan medis' },
  { id: 'construction', name: 'Konstruksi', description: 'Bisnis konstruksi dan properti' },
  { id: 'fashion', name: 'Fashion', description: 'Bisnis pakaian dan mode' },
  { id: 'logistics', name: 'Logistik', description: 'Bisnis pengiriman dan logistik' },
  { id: 'finance', name: 'Keuangan', description: 'Bisnis keuangan dan perbankan' },
];

// Struktur data peran otomatis berdasarkan industri
const industryRoles: Record<string, AIAgent[]> = {
  laundry: [
    { id: 'auto1', name: 'Manager Operasional', role: 'Operational Manager', description: 'Mengelola operasional harian laundry, termasuk jadwal kerja, kualitas layanan, dan kontrol proses pembersihan', personality: 'Detail-oriented' },
    { id: 'auto2', name: 'Supervisor Produksi', role: 'Production Supervisor', description: 'Mengawasi proses pencucian, pengeringan, dan penyetrikaan pakaian untuk memastikan kualitas dan efisiensi', personality: 'Analytical' },
    { id: 'auto3', name: 'Kepala Penjualan', role: 'Sales Head', description: 'Mengembangkan strategi penjualan dan menjalin hubungan dengan pelanggan korporat serta franchise', personality: 'Collaborative' },
    { id: 'auto4', name: 'Koordinator Layanan', role: 'Service Coordinator', description: 'Menangani permintaan pelanggan, penjadwalan pickup/delivery, dan manajemen layanan pelanggan', personality: 'Empathetic' },
    { id: 'auto5', name: 'Analis Keuangan', role: 'Financial Analyst', description: 'Menganalisis arus kas, biaya operasional, dan profitabilitas untuk mengoptimalkan keuntungan', personality: 'Analytical' },
    { id: 'auto6', name: 'Kepala Gudang', role: 'Warehouse Head', description: 'Mengelola persediaan deterjen, peralatan, dan perlengkapan laundry', personality: 'Detail-oriented' },
  ],
  restaurant: [
    { id: 'auto1', name: 'Manager Restoran', role: 'Restaurant Manager', description: 'Mengelola operasional restoran, termasuk layanan pelanggan, manajemen staf, dan kualitas makanan', personality: 'Professional' },
    { id: 'auto2', name: 'Kepala Koki', role: 'Head Chef', description: 'Mengawasi dapur, mengembangkan menu, dan memastikan kualitas makanan sesuai standar', personality: 'Creative' },
    { id: 'auto3', name: 'Supervisor Layanan', role: 'Service Supervisor', description: 'Mengawasi layanan pelanggan di area dining dan memastikan pengalaman pelanggan yang optimal', personality: 'Empathetic' },
    { id: 'auto4', name: 'Purchasing Manager', role: 'Procurement Manager', description: 'Mengelola pembelian bahan baku, bumbu, dan perlengkapan dapur dengan biaya optimal', personality: 'Analytical' },
    { id: 'auto5', name: 'Marketing Manager', role: 'Marketing Manager', description: 'Mengembangkan strategi pemasaran untuk menarik pelanggan dan meningkatkan penjualan', personality: 'Creative' },
    { id: 'auto6', name: 'Supervisor Keuangan', role: 'Finance Supervisor', description: 'Mengawasi pengeluaran, pendapatan, dan laba dari operasional restoran', personality: 'Analytical' },
  ],
  retail: [
    { id: 'auto1', name: 'Store Manager', role: 'Store Manager', description: 'Mengelola operasional toko ritel, termasuk penjualan, stok barang, dan manajemen tim', personality: 'Professional' },
    { id: 'auto2', name: 'Merchandiser', role: 'Merchandising Specialist', description: 'Mengelola tata letak produk, display, dan promosi untuk meningkatkan penjualan', personality: 'Creative' },
    { id: 'auto3', name: 'Inventory Manager', role: 'Inventory Manager', description: 'Mengelola stok barang, menganalisis penjualan, dan mengatur pengadaan produk', personality: 'Detail-oriented' },
    { id: 'auto4', name: 'Sales Supervisor', role: 'Sales Supervisor', description: 'Melatih dan mengawasi staf penjualan untuk mencapai target', personality: 'Collaborative' },
    { id: 'auto5', name: 'Visual Merchandiser', role: 'Visual Merchandiser', description: 'Mendesain tampilan toko yang menarik untuk meningkatkan pengalaman belanja', personality: 'Creative' },
    { id: 'auto6', name: 'Customer Service Manager', role: 'Customer Service Manager', description: 'Mengelola layanan pelanggan dan menangani komplain untuk menjaga loyalitas', personality: 'Empathetic' },
  ],
  tech: [
    { id: 'auto1', name: 'CTO', role: 'Chief Technology Officer', description: 'Menentukan arah teknologi dan arsitektur produk perusahaan', personality: 'Innovative' },
    { id: 'auto2', name: 'Product Manager', role: 'Product Manager', description: 'Mengelola pengembangan produk dan memastikan sesuai kebutuhan pasar', personality: 'Analytical' },
    { id: 'auto3', name: 'Engineering Lead', role: 'Engineering Lead', description: 'Memimpin tim pengembang dalam implementasi fitur dan perbaikan sistem', personality: 'Professional' },
    { id: 'auto4', name: 'DevOps Engineer', role: 'DevOps Engineer', description: 'Mengelola infrastruktur dan deployment aplikasi dengan efisiensi tinggi', personality: 'Detail-oriented' },
    { id: 'auto5', name: 'UX Designer', role: 'UX Designer', description: 'Mendesain pengalaman pengguna yang intuitif dan menyenangkan', personality: 'Creative' },
    { id: 'auto6', name: 'QA Manager', role: 'Quality Assurance Manager', description: 'Mengelola pengujian kualitas dan keamanan produk sebelum rilis', personality: 'Detail-oriented' },
  ],
  education: [
    { id: 'auto1', name: 'Academic Director', role: 'Academic Director', description: 'Mengelola kurikulum, kualitas pengajaran, dan standar akademik', personality: 'Professional' },
    { id: 'auto2', name: 'Curriculum Specialist', role: 'Curriculum Specialist', description: 'Mengembangkan materi ajar dan metode pembelajaran yang efektif', personality: 'Creative' },
    { id: 'auto3', name: 'Student Relations Manager', role: 'Student Relations Manager', description: 'Mengelola hubungan dengan siswa dan orang tua, serta menangani masalah akademik', personality: 'Empathetic' },
    { id: 'auto4', name: 'Training Coordinator', role: 'Training Coordinator', description: 'Mengelola pelatihan guru dan staf untuk meningkatkan kualitas pendidikan', personality: 'Collaborative' },
    { id: 'auto5', name: 'Business Development Manager', role: 'Business Development Manager', description: 'Mengembangkan program pendidikan baru dan menjalin kerjasama institusi', personality: 'Collaborative' },
    { id: 'auto6', name: 'Operations Manager', role: 'Operations Manager', description: 'Mengelola operasional sehari-hari lembaga pendidikan', personality: 'Detail-oriented' },
  ],
  healthcare: [
    { id: 'auto1', name: 'Medical Director', role: 'Medical Director', description: 'Mengelola kualitas pelayanan medis dan kebijakan klinis', personality: 'Professional' },
    { id: 'auto2', name: 'Nursing Supervisor', role: 'Nursing Supervisor', description: 'Mengawasi perawat dan memastikan standar perawatan pasien', personality: 'Empathetic' },
    { id: 'auto3', name: 'Operations Manager', role: 'Operations Manager', description: 'Mengelola operasional rumah sakit/klinik dan manajemen sumber daya', personality: 'Analytical' },
    { id: 'auto4', name: 'Patient Relations Manager', role: 'Patient Relations Manager', description: 'Menangani hubungan dengan pasien dan keluarga, serta penyelesaian keluhan', personality: 'Empathetic' },
    { id: 'auto5', name: 'Quality Assurance', role: 'Quality Assurance', description: 'Memastikan kepatuhan terhadap standar medis dan regulasi kesehatan', personality: 'Detail-oriented' },
    { id: 'auto6', name: 'Medical Equipment Manager', role: 'Medical Equipment Manager', description: 'Mengelola perawatan dan pengadaan peralatan medis', personality: 'Analytical' },
  ],
  construction: [
    { id: 'auto1', name: 'Project Manager', role: 'Project Manager', description: 'Mengelola proyek konstruksi dari awal hingga selesai sesuai anggaran dan waktu', personality: 'Analytical' },
    { id: 'auto2', name: 'Site Engineer', role: 'Site Engineer', description: 'Mengawasi pelaksanaan teknis di lapangan dan kualitas konstruksi', personality: 'Detail-oriented' },
    { id: 'auto3', name: 'Safety Supervisor', role: 'Safety Supervisor', description: 'Memastikan keselamatan kerja dan kepatuhan terhadap standar keselamatan', personality: 'Professional' },
    { id: 'auto4', name: 'Procurement Manager', role: 'Procurement Manager', description: 'Mengelola pembelian material konstruksi dan peralatan dengan efisiensi biaya', personality: 'Analytical' },
    { id: 'auto5', name: 'Quality Control', role: 'Quality Control', description: 'Mengawasi kualitas material dan pelaksanaan konstruksi', personality: 'Detail-oriented' },
    { id: 'auto6', name: 'Business Development', role: 'Business Development', description: 'Mencari proyek-proyek baru dan menjalin hubungan dengan klien', personality: 'Collaborative' },
  ],
  fashion: [
    { id: 'auto1', name: 'Creative Director', role: 'Creative Director', description: 'Menentukan arah desain dan tren koleksi produk fashion', personality: 'Creative' },
    { id: 'auto2', name: 'Design Manager', role: 'Design Manager', description: 'Mengelola tim desainer dan pengembangan produk fashion', personality: 'Creative' },
    { id: 'auto3', name: 'Production Manager', role: 'Production Manager', description: 'Mengelola proses produksi pakaian dari desain hingga produk jadi', personality: 'Analytical' },
    { id: 'auto4', name: 'Merchandising Manager', role: 'Merchandising Manager', description: 'Mengelola stok produk dan strategi penjualan', personality: 'Analytical' },
    { id: 'auto5', name: 'Marketing Manager', role: 'Marketing Manager', description: 'Mengembangkan strategi pemasaran dan kampanye brand awareness', personality: 'Creative' },
    { id: 'auto6', name: 'Retail Operations', role: 'Retail Operations', description: 'Mengelola operasional toko dan pengalaman pelanggan', personality: 'Empathetic' },
  ],
  logistics: [
    { id: 'auto1', name: 'Logistics Manager', role: 'Logistics Manager', description: 'Mengelola operasional logistik dari pengiriman hingga distribusi', personality: 'Analytical' },
    { id: 'auto2', name: 'Fleet Manager', role: 'Fleet Manager', description: 'Mengelola armada kendaraan dan perawatan kendaraan pengiriman', personality: 'Detail-oriented' },
    { id: 'auto3', name: 'Operations Supervisor', role: 'Operations Supervisor', description: 'Mengawasi proses pengiriman dan distribusi barang', personality: 'Professional' },
    { id: 'auto4', name: 'Customer Service', role: 'Customer Service', description: 'Menangani permintaan pelanggan dan masalah pengiriman', personality: 'Empathetic' },
    { id: 'auto5', name: 'Warehouse Manager', role: 'Warehouse Manager', description: 'Mengelola gudang dan manajemen persediaan barang', personality: 'Detail-oriented' },
    { id: 'auto6', name: 'Route Planner', role: 'Route Planner', description: 'Merancang rute pengiriman yang efisien dan hemat biaya', personality: 'Analytical' },
  ],
  finance: [
    { id: 'auto1', name: 'Finance Director', role: 'Finance Director', description: 'Menentukan strategi keuangan dan pengelolaan aset perusahaan', personality: 'Analytical' },
    { id: 'auto2', name: 'Risk Manager', role: 'Risk Manager', description: 'Menganalisis dan mengelola risiko finansial perusahaan', personality: 'Analytical' },
    { id: 'auto3', name: 'Investment Manager', role: 'Investment Manager', description: 'Mengelola investasi dan portofolio perusahaan', personality: 'Analytical' },
    { id: 'auto4', name: 'Compliance Officer', role: 'Compliance Officer', description: 'Memastikan kepatuhan terhadap regulasi keuangan', personality: 'Detail-oriented' },
    { id: 'auto5', name: 'Client Relations', role: 'Client Relations', description: 'Menjaga hubungan dengan klien dan memberikan layanan keuangan', personality: 'Empathetic' },
    { id: 'auto6', name: 'Credit Analyst', role: 'Credit Analyst', description: 'Menganalisis kelayakan kredit dan risiko pinjaman', personality: 'Analytical' },
  ]
};

export default function SimulasiPage() {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [aiAgents, setAiAgents] = useState<AIAgent[]>([]);
  const [newAgent, setNewAgent] = useState({
    name: '',
    role: '',
    description: '',
    personality: ''
  });

  const predefinedRoles = [
    'CEO',
    'CTO',
    'Product Manager',
    'Marketing Director',
    'Sales Manager',
    'HR Director',
    'Finance Manager',
    'Operations Manager',
    'Customer Service Lead',
    'Project Manager'
  ];

  const predefinedPersonalities = [
    'Professional',
    'Creative',
    'Analytical',
    'Empathetic',
    'Direct',
    'Collaborative',
    'Innovative',
    'Detail-oriented'
  ];

  const handleAddAgent = () => {
    if (!newAgent.name || !newAgent.role) return;

    const agent: AIAgent = {
      id: Date.now().toString(),
      name: newAgent.name,
      role: newAgent.role,
      description: newAgent.description,
      personality: newAgent.personality
    };

    setAiAgents([...aiAgents, agent]);
    setNewAgent({
      name: '',
      role: '',
      description: '',
      personality: ''
    });
  };

  const handleRemoveAgent = (id: string) => {
    setAiAgents(aiAgents.filter(agent => agent.id !== id));
  };

  const handleAutoRecruit = () => {
    if (!selectedIndustry) {
      alert('Silakan pilih industri/usaha terlebih dahulu');
      return;
    }

    const rolesToAdd = industryRoles[selectedIndustry] || [];

    // Tambahkan pengecekan untuk mencegah duplikasi
    const currentRoleNames = new Set(aiAgents.map(agent => agent.name));
    const filteredRoles = rolesToAdd.filter(role => !currentRoleNames.has(role.name));

    if (filteredRoles.length === 0) {
      alert('Tim untuk industri ini sudah lengkap atau sudah direkrut');
      return;
    }

    setAiAgents([...aiAgents, ...filteredRoles]);
    alert(`Berhasil menambahkan ${filteredRoles.length} anggota tim otomatis untuk industri ${businessIndustries.find(i => i.id === selectedIndustry)?.name}`);
  };

  const handleStartSimulation = () => {
    // In a real implementation, you would save the simulation setup to state/context
    // and navigate to the group chat page
    console.log('Starting simulation with:', { selectedRole, aiAgents });
    // For now, we'll just log the data - in the next step I'll create the group chat page
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Simulasi Roleplay</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Bangun simulasi roleplay dengan AI agents yang berbeda peran dan kepribadian
        </p>

        {/* Step 1: Role Selection */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Langkah 1: Pilih Peran Anda</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {predefinedRoles.map((role) => (
              <button
                key={role}
                className={`py-3 px-4 rounded-lg border ${
                  selectedRole === role
                    ? 'border-pink-600 bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                onClick={() => setSelectedRole(role)}
              >
                {role}
              </button>
            ))}
          </div>
          {selectedRole && (
            <div className="mt-4 p-4 bg-pink-50 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300">
                Anda memilih peran: <span className="font-semibold">{selectedRole}</span>
              </p>
            </div>
          )}
        </div>

        {/* Step 2: AI Recruitment */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Langkah 2: Rekrut AI Agents</h2>

          {/* Auto Recruit Section */}
          <div className="bg-blue-50 dark:bg-gray-700 p-5 rounded-xl mb-6">
            <h3 className="font-medium text-gray-900 dark:text-white mb-3">Rekrut Tim Otomatis Berdasarkan Industri</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pilih Industri/Usaha:</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {businessIndustries.map((industry) => (
                  <button
                    key={industry.id}
                    className={`py-2 px-3 rounded-lg border text-sm ${
                      selectedIndustry === industry.id
                        ? 'border-blue-600 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                    onClick={() => setSelectedIndustry(industry.id)}
                  >
                    {industry.name}
                  </button>
                ))}
              </div>
              {selectedIndustry && (
                <div className="mt-3 p-3 bg-blue-100 dark:bg-gray-600 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Anda memilih industri: <span className="font-semibold">{businessIndustries.find(i => i.id === selectedIndustry)?.name}</span>
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {businessIndustries.find(i => i.id === selectedIndustry)?.description}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={handleAutoRecruit}
              disabled={!selectedIndustry}
              className={`px-4 py-2 rounded-lg ${
                selectedIndustry
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              } transition`}
            >
              Rekrut Tim Otomatis
            </button>

            <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">
              Tim otomatis akan menambahkan peran-peran yang relevan dengan industri Anda untuk membantu mensimulasikan diskusi tim yang lengkap.
            </p>
          </div>

          {/* Add New AI Agent Form */}
          <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-xl mb-6">
            <h3 className="font-medium text-gray-900 dark:text-white mb-3">Tambah AI Agent Manual</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama AI Agent</label>
                <input
                  type="text"
                  value={newAgent.name}
                  onChange={(e) => setNewAgent({...newAgent, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                  placeholder="Contoh: Sarah"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Peran</label>
                <input
                  type="text"
                  value={newAgent.role}
                  onChange={(e) => setNewAgent({...newAgent, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                  placeholder="Contoh: Marketing Manager"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deskripsi Peran</label>
              <textarea
                value={newAgent.description}
                onChange={(e) => setNewAgent({...newAgent, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                placeholder="Deskripsikan peran dan tanggung jawab AI ini..."
                rows={2}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kepribadian</label>
              <select
                value={newAgent.personality}
                onChange={(e) => setNewAgent({...newAgent, personality: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
              >
                <option value="">Pilih kepribadian</option>
                {predefinedPersonalities.map((personality) => (
                  <option key={personality} value={personality}>{personality}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAddAgent}
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
            >
              Tambah AI Agent
            </button>
          </div>

          {/* List of Recruited AI Agents */}
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-3">AI Agents yang Direkrut ({aiAgents.length})</h3>

            {aiAgents.length === 0 ? (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                Belum ada AI agents yang direkrut. Tambahkan AI agent pertama Anda.
              </div>
            ) : (
              <div className="space-y-3">
                {aiAgents.map((agent) => (
                  <div
                    key={agent.id}
                    className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{agent.name} - {agent.role}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">{agent.description}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Kepribadian: {agent.personality}</div>
                    </div>
                    <button
                      onClick={() => handleRemoveAgent(agent.id)}
                      className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Start Simulation Button */}
        <div className="flex justify-end">
          <Link
            href={aiAgents.length > 0 ? "/protected/simulasi/group-chat" : "#"}
            onClick={(e) => {
              if (aiAgents.length === 0) {
                e.preventDefault();
                alert('Silakan rekrut minimal satu AI agent sebelum memulai simulasi.');
              } else {
                // Store the simulation setup in localStorage before navigating
                const simulationData = {
                  userRole: selectedRole,
                  aiAgents: aiAgents,
                  timestamp: Date.now()
                };
                localStorage.setItem('simulationSetup', JSON.stringify(simulationData));
                handleStartSimulation();
              }
            }}
          >
            <button
              disabled={aiAgents.length === 0}
              className={`px-6 py-3 rounded-lg font-medium ${
                aiAgents.length > 0
                  ? 'bg-pink-600 text-white hover:bg-pink-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Mulai Simulasi Roleplay
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}