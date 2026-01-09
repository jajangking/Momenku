'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

// Type definition for family members
type FamilyMember = {
  id: string;
  name: string;
  relationship: string;
  age: number;
  isHead: boolean;
  familyId: string;
  parentId?: string; // Links to parent member (for spouses of children)
};

export default function FamilyTreePage() {
  const { id: familyId } = useParams();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Extend CanvasRenderingContext2D with roundRect if not supported
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx && !ctx.roundRect) {
      ctx.roundRect = function (x, y, width, height, radius) {
        if (width < 2 * radius) radius = width / 2;
        if (height < 2 * radius) radius = height / 2;
        this.beginPath();
        this.moveTo(x + radius, y);
        this.arcTo(x + width, y, x + width, y + height, radius);
        this.arcTo(x + width, y + height, x, y + height, radius);
        this.arcTo(x, y + height, x, y, radius);
        this.arcTo(x, y, x + width, y, radius);
        this.closePath();
        return this;
      };
    }
  }, []);
  
  // State for all family members
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    // Family 1 (Bapak Jajang)
    { id: '1', name: 'Bapak Jajang', relationship: 'Ayah', age: 45, isHead: true, familyId: 'fam1' },
    { id: '2', name: 'Ibu Iin Kartini', relationship: 'Ibu', age: 42, isHead: false, familyId: 'fam1' },
    { id: '3', name: 'Jajang', relationship: 'Anak', age: 18, isHead: false, familyId: 'fam1' },
    { id: '4', name: 'Naisa', relationship: 'Anak', age: 15, isHead: false, familyId: 'fam1' },
    // Example of a married child with their own spouse
    { id: '8', name: 'Andi', relationship: 'Anak', age: 25, isHead: false, familyId: 'fam1' },
    { id: '9', name: 'Siti', relationship: 'Istri', age: 23, isHead: false, familyId: 'fam1', parentId: '8' }, // Spouse of Andi
    // Family 2 (Bapak Surya)
    { id: '5', name: 'Bapak Surya', relationship: 'Ayah', age: 50, isHead: true, familyId: 'fam2' },
    { id: '6', name: 'Ibu Lestari', relationship: 'Ibu', age: 47, isHead: false, familyId: 'fam2' },
    { id: '7', name: 'Rizki', relationship: 'Anak', age: 20, isHead: false, familyId: 'fam2' },
  ]);
  
  // State for form
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    age: '',
    parentId: '' // For linking spouses to children
  });

  // Zoom and pan states
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Find the current family's members
  const currentFamilyMembers = familyMembers.filter(member => member.familyId === familyId);
  
  // Find the head of the current family (Ayah)
  const father = currentFamilyMembers.find(member => 
    member.isHead || member.relationship.toLowerCase().includes('kepala keluarga') || member.relationship.toLowerCase().includes('ayah')
  );

  // Find the spouse (Ibu)
  const mother = currentFamilyMembers.find(member => 
    member.relationship.toLowerCase().includes('istri') || member.relationship.toLowerCase().includes('ibu')
  );
  
  // Get children
  const children = currentFamilyMembers.filter(member => 
    member.relationship.toLowerCase().includes('anak')
  );
  
  // Get other relatives
  const others = currentFamilyMembers.filter(member => 
    !member.isHead && 
    !member.relationship.toLowerCase().includes('istri') && 
    !member.relationship.toLowerCase().includes('ibu') && 
    !member.relationship.toLowerCase().includes('suami') &&
    !member.relationship.toLowerCase().includes('ayah') &&
    !member.relationship.toLowerCase().includes('anak')
  );
  
  // Identify children who have their own spouses in this family (married children)
  const childrenWithSpouses = children.filter(child => {
    // Check if this child has a spouse linked to them via parentId
    return currentFamilyMembers.some(member =>
      (member.relationship.toLowerCase().includes('istri') || member.relationship.toLowerCase().includes('suami')) &&
      member.parentId === child.id
    );
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission for adding a new family member
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create new family member
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: formData.name,
      relationship: formData.relationship,
      age: parseInt(formData.age),
      isHead: false,
      familyId: familyId as string,
      parentId: (formData.relationship.toLowerCase().includes('istri') ||
                 formData.relationship.toLowerCase().includes('suami'))
                 ? formData.parentId // Use selected parent ID
                 : undefined
    };

    setFamilyMembers([...familyMembers, newMember]);

    // Reset form and close
    setFormData({ name: '', relationship: '', age: '', parentId: '' });
    setShowForm(false);
  };

  // Handle deleting a family member
  const handleDelete = (memberId: string) => {
    setFamilyMembers(familyMembers.filter(member => member.id !== memberId));
  };

  // Handle editing a family member
  const handleEdit = (member: FamilyMember) => {
    setFormData({
      name: member.name,
      relationship: member.relationship,
      age: member.age.toString(),
      parentId: member.parentId || ''
    });
    
    // Remove the member from the list temporarily
    setFamilyMembers(familyMembers.filter(m => m.id !== member.id));
    setShowForm(true);
  };

  // Canvas drawing function
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = containerRef.current?.clientWidth || 800;
    canvas.height = 600; // Fixed height for the canvas
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply transformations for zoom and pan
    ctx.save();
    ctx.translate(position.x, position.y);
    ctx.scale(scale, scale);
    
    // Define positions for family members (in logical space)
    const centerX = canvas.width / 2;
    const parentsY = 100;
    const childrenY = 250;
    const othersY = 450;

    // Draw horizontal line connecting parents
    if (father && mother) {
      const fatherX = centerX - 75;
      const motherX = centerX + 75;
      
      // Draw horizontal line between parents
      drawHorizontalConnectionLine(ctx, parentsY + 60, fatherX, motherX);
      
      // Draw vertical line down to children
      if (children.length > 0) {
        drawVerticalConnectionLine(ctx, centerX, parentsY + 60, childrenY - 20);
      }
    } else if (father || mother) {
      // If only one parent exists, draw vertical line down to children
      const parentX = father ? centerX : (mother ? centerX : 0);
      if (children.length > 0) {
        drawVerticalConnectionLine(ctx, parentX, parentsY + 60, childrenY - 20);
      }
    }

    // Draw horizontal line for children and connect each to vertical
    if (children.length > 0) {
      const leftmostChildX = centerX - ((children.length - 1) * 75);
      const rightmostChildX = centerX + ((children.length - 1) * 75);

      // Draw horizontal line between children if more than one
      if (children.length > 1) {
        drawHorizontalConnectionLine(ctx, childrenY - 20, leftmostChildX, rightmostChildX);
      }

      // Connect each child to the vertical line from parents
      children.forEach((child, index) => {
        const offsetX = (index - (children.length - 1) / 2) * 150;
        const childX = centerX + offsetX;

        // Check if this child has a spouse linked via parentId
        const childSpouse = currentFamilyMembers.find(member =>
          (member.relationship.toLowerCase().includes('istri') || member.relationship.toLowerCase().includes('suami')) &&
          member.parentId === child.id
        );
        
        if (childSpouse) {
          // Draw this child and spouse as a sub-family unit
          const childY = childrenY;
          
          // Connect to the main vertical line
          drawVerticalConnectionLine(ctx, childX, childrenY - 20, childY);
          
          // Draw horizontal line connecting child and spouse
          drawHorizontalConnectionLine(ctx, childY + 40, childX - 30, childX + 30);
          
          // Draw the child and spouse as a unit
          drawFamilyMember(ctx, childX - 30, childY, child, '#DBEAFE'); // Blue theme for child
          drawFamilyMember(ctx, childX + 30, childY, childSpouse, '#FCE7F3'); // Pink theme for spouse
        } else {
          // Draw single child
          drawVerticalConnectionLine(ctx, childX, childrenY - 20, childrenY);
          drawFamilyMember(ctx, childX, childrenY, child, '#DBEAFE'); // Blue theme
        }
      });
    }

    // Draw connections to others
    others.forEach((other, index) => {
      const offsetX = (index - (others.length - 1) / 2) * 150;
      const otherX = centerX + offsetX;
      // Draw line from top to other
      drawVerticalConnectionLine(ctx, otherX, othersY - 40, othersY);
    });

    // Draw family members on top of connections
    // Draw father
    if (father) {
      const fatherX = centerX - 75;
      drawFamilyMember(ctx, fatherX, parentsY, father, '#FEF3C7'); // Yellow theme
    }

    // Draw mother
    if (mother) {
      const motherX = centerX + 75;
      drawFamilyMember(ctx, motherX, parentsY, mother, '#FCE7F3'); // Pink theme
    }

    // Draw others
    others.forEach((other, index) => {
      const offsetX = (index - (others.length - 1) / 2) * 150;
      const otherX = centerX + offsetX;
      drawFamilyMember(ctx, otherX, othersY, other, '#DCFCE7'); // Green theme
    });

    ctx.restore();
  }, [familyMembers, familyId, scale, position]);

  // Draw a family member node
  const drawFamilyMember = (
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    member: FamilyMember, 
    bgColor: string
  ) => {
    // Draw rectangle with rounded corners
    ctx.fillStyle = bgColor;
    ctx.strokeStyle = '#9CA3AF';
    ctx.lineWidth = 1;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(x - 60, y - 40, 120, 80, 10);
    } else {
      // Fallback for browsers that don't support roundRect
      ctx.rect(x - 60, y - 40, 120, 80);
    }
    ctx.fill();
    ctx.stroke();
    
    // Draw placeholder image
    ctx.fillStyle = '#D1D5DB';
    ctx.beginPath();
    ctx.arc(x, y - 15, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw name
    ctx.fillStyle = '#1F2937';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(member.name, x, y + 10);
    
    // Draw relationship
    ctx.fillStyle = '#6B7280';
    ctx.font = '10px sans-serif';
    ctx.fillText(member.relationship, x, y + 25);
  };

  // Draw connection line
  const drawConnectionLine = (
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ) => {
    ctx.strokeStyle = '#6B7280';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  };
  
  // Draw vertical connection line
  const drawVerticalConnectionLine = (
    ctx: CanvasRenderingContext2D,
    x: number,
    startY: number,
    endY: number
  ) => {
    ctx.strokeStyle = '#6B7280';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, startY);
    ctx.lineTo(x, endY);
    ctx.stroke();
  };
  
  // Draw horizontal connection line
  const drawHorizontalConnectionLine = (
    ctx: CanvasRenderingContext2D,
    startY: number,
    startX: number,
    endX: number
  ) => {
    ctx.strokeStyle = '#6B7280';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, startY);
    ctx.stroke();
  };

  // Touch state variables
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  
  // Handle mouse events for panning
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setInitialPosition(position);
    setDragStart({
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setPosition({
        x: initialPosition.x + dx,
        y: initialPosition.y + dy
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle touch events for panning and zooming
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      // Single finger: prepare for panning
      setIsDragging(true);
      setInitialPosition(position);
      setDragStart({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      });
    } else if (e.touches.length === 2) {
      // Two fingers: prepare for zooming
      setIsDragging(false);
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setLastTouchDistance(distance);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Prevent scrolling while touching canvas
    
    if (e.touches.length === 1 && isDragging) {
      // Single finger: panning
      const dx = e.touches[0].clientX - dragStart.x;
      const dy = e.touches[0].clientY - dragStart.y;
      setPosition({
        x: initialPosition.x + dx,
        y: initialPosition.y + dy
      });
    } else if (e.touches.length === 2) {
      // Two fingers: zooming
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      
      if (lastTouchDistance) {
        const zoomFactor = distance / lastTouchDistance;
        const newScale = scale * zoomFactor;
        
        // Limit zoom range
        if (newScale > 0.5 && newScale < 3) {
          setScale(newScale);
        }
      }
      
      setLastTouchDistance(distance);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setTouchStart(null);
    setLastTouchDistance(null);
  };

  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null);

  // Prevent context menu on canvas
  const handleContextMenu = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomIntensity = 0.1;
    const newScale = e.deltaY < 0 ? scale * (1 + zoomIntensity) : scale * (1 - zoomIntensity);
    
    // Limit zoom range
    if (newScale > 0.5 && newScale < 3) {
      setScale(newScale);
    }
  };

  // Reset view
  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Pohon Keluarga {father?.name || mother?.name || 'Tidak Dikenal'}</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Struktur lengkap keluarga {father?.name || mother?.name || 'ini'}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-2 bg-pink-600 text-white font-medium rounded-lg hover:bg-pink-700 transition duration-300"
              >
                Tambah Anggota Keluarga
              </button>
              
              <button
                onClick={resetView}
                className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition duration-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
              >
                Reset Tampilan
              </button>
            </div>
          </div>
        </div>
        
        {/* Interactive Canvas Family Tree */}
        <div 
          ref={containerRef}
          className="overflow-hidden bg-gray-50 dark:bg-gray-700 rounded-lg mb-8"
          style={{ height: '600px' }}
        >
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            onContextMenu={handleContextMenu}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="cursor-grab active:cursor-grabbing w-full h-full touch-none"
          />
          
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            <button 
              onClick={() => setScale(prev => Math.min(prev + 0.1, 3))}
              className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <span className="text-lg font-bold">+</span>
            </button>
            <button 
              onClick={() => setScale(prev => Math.max(prev - 0.1, 0.5))}
              className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <span className="text-lg font-bold">-</span>
            </button>
          </div>
          
          <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 bg-opacity-80 px-3 py-2 rounded-lg shadow-md">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Gunakan scroll untuk zoom, drag untuk menggeser
            </p>
          </div>
        </div>
        
        {/* Family Members List */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Daftar Anggota Keluarga</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Nama
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Hubungan
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Usia
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {currentFamilyMembers.map((member) => (
                  <tr key={member.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-300">{member.relationship}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-300">{member.age} tahun</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        member.isHead 
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-300' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {member.isHead ? 'Kepala Keluarga' : 'Anggota'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(member)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Tambah Anggota Keluarga
              </h3>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(e);
              }}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nama
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
                  <label htmlFor="relationship" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Hubungan Keluarga
                  </label>
                  <select
                    id="relationship"
                    name="relationship"
                    value={formData.relationship}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Pilih hubungan</option>
                    <option value="Istri">Istri</option>
                    <option value="Suami">Suami</option>
                    <option value="Anak">Anak</option>
                    <option value="Cucu">Cucu</option>
                    <option value="Saudara">Saudara</option>
                    <option value="Orang Tua">Orang Tua</option>
                    <option value="Kakek/Nenek">Kakek/Nenek</option>
                  </select>
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
                
                {/* Show parent selection only for spouse relationships */}
                {(formData.relationship.toLowerCase().includes('istri') || 
                  formData.relationship.toLowerCase().includes('suami')) && (
                  <div className="mb-4">
                    <label htmlFor="parentId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Pasangkan dengan (opsional)
                    </label>
                    <select
                      id="parentId"
                      name="parentId"
                      value={formData.parentId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Pilih pasangan</option>
                      {currentFamilyMembers
                        .filter(member => member.relationship.toLowerCase().includes('anak'))
                        .map(member => (
                          <option key={member.id} value={member.id}>{member.name}</option>
                        ))}
                    </select>
                  </div>
                )}
                
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