import { useState } from 'react';

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  birthDate?: string;
  parentId?: string; // ID of parent, for creating tree structure
  childrenIds?: string[]; // IDs of children, for creating tree structure
  spouseId?: string; // ID of spouse
}

interface FamilyTreeProps {
  familyMembers: FamilyMember[];
  onEditMember: (member: FamilyMember) => void;
  onAddMember: (parentId?: string) => void;
  onDeleteMember: (memberId: string) => void;
}

export default function FamilyTree({ familyMembers, onEditMember, onAddMember, onDeleteMember }: FamilyTreeProps) {
  // Find root members (those without parents)
  const rootMembers = familyMembers.filter(member =>
    !member.parentId || !familyMembers.some(m => m.id === member.parentId)
  );

  // Function to get children of a member
  const getChildren = (memberId: string) => {
    return familyMembers.filter(m => m.parentId === memberId);
  };

  // Function to get spouse of a member
  const getSpouse = (memberId: string) => {
    const member = familyMembers.find(m => m.id === memberId);
    if (member && member.spouseId) {
      return familyMembers.find(m => m.id === member.spouseId);
    }
    return null;
  };

  // Function to get all couples (members who are spouses)
  const getCouples = () => {
    const couples: { partner1: FamilyMember; partner2: FamilyMember }[] = [];
    const processedIds = new Set<string>();

    familyMembers.forEach(member => {
      if (member.spouseId && !processedIds.has(member.id)) {
        const spouse = familyMembers.find(m => m.id === member.spouseId);
        if (spouse) {
          couples.push({ partner1: member, partner2: spouse });
          processedIds.add(member.id);
          processedIds.add(spouse.id);
        }
      }
    });

    return couples;
  };

  // Function to get single members (no spouse)
  const getSingleMembers = () => {
    return familyMembers.filter(member =>
      !member.spouseId || !familyMembers.some(m => m.id === member.spouseId)
    );
  };

  // Recursive function to render family tree
  const renderFamilyTree = (member: FamilyMember, level: number = 0) => {
    const children = getChildren(member.id);
    const spouse = getSpouse(member.id);

    return (
      <div key={member.id} className="flex flex-col items-center">
        {/* Render couple if exists */}
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center mb-2">
            <div
              className="bg-gradient-to-br from-pink-400 to-purple-500 rounded-full w-16 h-16 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg flex-shrink-0 relative group"
              onClick={() => onEditMember(member)}
            >
              <span className="font-bold text-white text-lg">
                {member.name.charAt(0).toUpperCase()}
              </span>
              {/* Action buttons that appear on hover */}
              <div className="absolute top-0 right-0 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-1/3 -translate-y-1/3 z-10">
                <button
                  className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-blue-600 shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditMember(member);
                  }}
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddMember(member.id);
                  }}
                  title="Tambah Anak"
                >
                  +
                </button>
                <button
                  className="w-5 h-5 bg-red-700 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-800 shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteMember(member.id);
                  }}
                  title="Hapus"
                >
                  🗑️
                </button>
              </div>
            </div>

            {spouse && (
              <div className="flex flex-col items-center mx-4">
                <div className="text-gray-500 dark:text-gray-400 text-lg">+</div>
                <div
                  className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full w-16 h-16 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg flex-shrink-0 mt-2 relative group"
                  onClick={() => onEditMember(spouse)}
                >
                  <span className="font-bold text-white text-lg">
                    {spouse.name.charAt(0).toUpperCase()}
                  </span>
                  {/* Action buttons that appear on hover */}
                  <div className="absolute top-0 right-0 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-1/3 -translate-y-1/3 z-10">
                    <button
                      className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-blue-600 shadow-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditMember(spouse);
                      }}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 shadow-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddMember(spouse.id);
                      }}
                      title="Tambah Anak"
                    >
                      +
                    </button>
                    <button
                      className="w-5 h-5 bg-red-700 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-800 shadow-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteMember(spouse.id);
                      }}
                      title="Hapus"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Name labels */}
          <div className="flex items-center mt-1">
            <div className="text-xs font-medium text-gray-800 dark:text-white bg-white dark:bg-gray-800 px-2 py-1 rounded-md shadow-sm max-w-[100px] truncate">
              {member.name}
            </div>

            {spouse && (
              <div className="text-xs font-medium text-gray-800 dark:text-white bg-white dark:bg-gray-800 px-2 py-1 rounded-md shadow-sm max-w-[100px] truncate ml-4">
                {spouse.name}
              </div>
            )}
          </div>

          {/* Relationship labels */}
          <div className="flex items-center mt-1">
            <div className="text-xs text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/30 px-2 py-1 rounded-md">
              {member.relationship}
            </div>

            {spouse && (
              <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-md ml-4">
                {spouse.relationship}
              </div>
            )}
          </div>
        </div>

        {/* Render children if exist */}
        {(children.length > 0) && (
          <div className="mt-6 relative w-full">
            {/* Vertical connector line from parent to children */}
            <div className="absolute top-0 left-1/2 w-1 h-6 bg-gray-400 dark:bg-gray-500 transform -translate-x-1/2"></div>
            <div className="relative pt-6">
              {/* Horizontal connector line for children */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-1 bg-gray-400 dark:bg-gray-500"></div>
              <div className="flex flex-wrap justify-center gap-8 relative">
                {children.map((child, index) => (
                  <div key={child.id} className="flex flex-col items-center">
                    {/* Vertical connector line from horizontal line to child */}
                    <div className="absolute top-0 left-1/2 w-1 h-4 bg-gray-400 dark:bg-gray-500 transform -translate-x-1/2"></div>
                    <div className="relative">
                      {renderFamilyTree(child, level + 1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render a couple with their children
  const renderCoupleWithChildren = (couple: { partner1: FamilyMember; partner2: FamilyMember }) => {
    const children = [...getChildren(couple.partner1.id), ...getChildren(couple.partner2.id)];
    // Remove duplicates
    const uniqueChildren = Array.from(new Map(children.map(child => [child.id, child])).values());

    return (
      <div key={`${couple.partner1.id}-${couple.partner2.id}`} className="flex flex-col items-center mb-12">
        {/* Couple */}
        <div className="flex items-center justify-center mb-4">
          <div
            className="bg-gradient-to-br from-pink-400 to-purple-500 rounded-full w-16 h-16 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg flex-shrink-0 relative group"
            onClick={() => onEditMember(couple.partner1)}
          >
            <span className="font-bold text-white text-lg">
              {couple.partner1.name.charAt(0).toUpperCase()}
            </span>
            {/* Action buttons that appear on hover */}
            <div className="absolute top-0 right-0 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-1/3 -translate-y-1/3 z-10">
              <button
                className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-blue-600 shadow-md"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditMember(couple.partner1);
                }}
                title="Edit"
              >
                ✏️
              </button>
              <button
                className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 shadow-md"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddMember(couple.partner1.id);
                }}
                title="Tambah Anak"
              >
                +
              </button>
              <button
                className="w-5 h-5 bg-red-700 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-800 shadow-md"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteMember(couple.partner1.id);
                }}
                title="Hapus"
              >
                🗑️
              </button>
            </div>
          </div>

          <div className="mx-4 text-gray-500 dark:text-gray-400 text-xl">+</div>

          <div
            className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full w-16 h-16 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg flex-shrink-0 relative group"
            onClick={() => onEditMember(couple.partner2)}
          >
            <span className="font-bold text-white text-lg">
              {couple.partner2.name.charAt(0).toUpperCase()}
            </span>
            {/* Action buttons that appear on hover */}
            <div className="absolute top-0 right-0 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-1/3 -translate-y-1/3 z-10">
              <button
                className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-blue-600 shadow-md"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditMember(couple.partner2);
                }}
                title="Edit"
              >
                ✏️
              </button>
              <button
                className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 shadow-md"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddMember(couple.partner2.id);
                }}
                title="Tambah Anak"
              >
                +
              </button>
              <button
                className="w-5 h-5 bg-red-700 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-800 shadow-md"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteMember(couple.partner2.id);
                }}
                title="Hapus"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>

        {/* Names and relationships */}
        <div className="flex items-center mt-2">
          <div className="text-xs font-medium text-gray-800 dark:text-white bg-white dark:bg-gray-800 px-2 py-1 rounded-md shadow-sm max-w-[100px] truncate">
            {couple.partner1.name}
          </div>
          <div className="text-xs font-medium text-gray-800 dark:text-white bg-white dark:bg-gray-800 px-2 py-1 rounded-md shadow-sm max-w-[100px] truncate mx-4">
            {couple.partner2.name}
          </div>
        </div>

        <div className="flex items-center mt-1">
          <div className="text-xs text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/30 px-2 py-1 rounded-md">
            {couple.partner1.relationship}
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-md mx-4">
            {couple.partner2.relationship}
          </div>
        </div>

        {/* Children */}
        {uniqueChildren.length > 0 && (
          <div className="mt-8 relative w-full">
            {/* Vertical connector line from parent to children */}
            <div className="absolute top-0 left-1/2 w-1 h-6 bg-gray-400 dark:bg-gray-500 transform -translate-x-1/2"></div>
            <div className="relative pt-6">
              {/* Horizontal connector line for children */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-1 bg-gray-400 dark:bg-gray-500"></div>
              <div className="flex flex-wrap justify-center gap-8 relative">
                {uniqueChildren.map((child, index) => (
                  <div key={child.id} className="flex flex-col items-center">
                    {/* Vertical connector line from horizontal line to child */}
                    <div className="absolute top-0 left-1/2 w-1 h-4 bg-gray-400 dark:bg-gray-500 transform -translate-x-1/2"></div>
                    <div className="relative">
                      {renderFamilyTree(child, 1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render single member with their children
  const renderSingleMemberWithChildren = (member: FamilyMember) => {
    const children = getChildren(member.id);

    return (
      <div key={member.id} className="flex flex-col items-center mb-12">
        <div
          className="bg-gradient-to-br from-pink-400 to-purple-500 rounded-full w-16 h-16 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg flex-shrink-0 relative group mb-2"
          onClick={() => onEditMember(member)}
        >
          <span className="font-bold text-white text-lg">
            {member.name.charAt(0).toUpperCase()}
          </span>
          {/* Action buttons that appear on hover */}
          <div className="absolute top-0 right-0 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-1/4 -translate-y-1/4">
            <button
              className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-blue-600"
              onClick={(e) => {
                e.stopPropagation();
                onEditMember(member);
              }}
              title="Edit"
            >
              ✏️
            </button>
            <button
              className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
              onClick={(e) => {
                e.stopPropagation();
                onAddMember(member.id);
              }}
              title="Tambah Anak"
            >
              +
            </button>
            <button
              className="w-5 h-5 bg-red-700 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-800"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteMember(member.id);
              }}
              title="Hapus"
            >
              🗑️
            </button>
          </div>
        </div>

        {/* Name and relationship */}
        <div className="text-xs font-medium text-gray-800 dark:text-white bg-white dark:bg-gray-800 px-2 py-1 rounded-md shadow-sm max-w-[100px] truncate">
          {member.name}
        </div>
        <div className="text-xs text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/30 px-2 py-1 rounded-md mt-1">
          {member.relationship}
        </div>

        {/* Children */}
        {children.length > 0 && (
          <div className="mt-8 relative w-full">
            {/* Vertical connector line from parent to children */}
            <div className="absolute top-0 left-1/2 w-1 h-6 bg-gray-400 dark:bg-gray-500 transform -translate-x-1/2"></div>
            <div className="relative pt-6">
              {/* Horizontal connector line for children */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-1 bg-gray-400 dark:bg-gray-500"></div>
              <div className="flex flex-wrap justify-center gap-8 relative">
                {children.map((child, index) => (
                  <div key={child.id} className="flex flex-col items-center">
                    {/* Vertical connector line from horizontal line to child */}
                    <div className="absolute top-0 left-1/2 w-1 h-4 bg-gray-400 dark:bg-gray-500 transform -translate-x-1/2"></div>
                    <div className="relative">
                      {renderFamilyTree(child, 1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const couples = getCouples();
  const singles = getSingleMembers().filter(member =>
    !couples.some(couple =>
      couple.partner1.id === member.id || couple.partner2.id === member.id
    )
  );

  return (
    <div className="overflow-x-auto p-4">
      <div className="min-w-max">
        {(couples.length > 0 || singles.length > 0) ? (
          <div className="flex flex-wrap justify-center gap-16">
            {couples.map(couple => renderCoupleWithChildren(couple))}
            {singles.map(single => renderSingleMemberWithChildren(single))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Belum ada anggota keluarga. Tambahkan anggota pertama Anda.
          </div>
        )}
      </div>
    </div>
  );
}