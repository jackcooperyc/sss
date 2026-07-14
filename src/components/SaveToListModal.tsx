'use client';

import React, { useState } from 'react';
import { useLists } from '@/context/ListContext';
import { Business } from './BusinessCard';
import { X, Plus, ListPlus, FolderPlus, CheckCircle2 } from 'lucide-react';

interface SaveToListModalProps {
  isOpen: boolean;
  onClose: () => void;
  leads: Business[];
}

export function SaveToListModal({ isOpen, onClose, leads }: SaveToListModalProps) {
  const { lists, createList, addLeadsToList } = useLists();
  const [selectedListId, setSelectedListId] = useState<string>('');
  const [isCreatingNew, setIsCreatingNew] = useState(() => lists.length === 0);
  const [newListName, setNewListName] = useState('');
  const [newListCategory, setNewListCategory] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    const creatingNew = isCreatingNew || lists.length === 0;
    if (creatingNew) {
      if (!newListName.trim()) return;
      const newList = createList(newListName, newListCategory || 'Cupr.os');
      addLeadsToList(newList.id, leads);
    } else {
      if (!selectedListId) return;
      addLeadsToList(selectedListId, leads);
    }
    
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      setIsCreatingNew(false);
      setNewListName('');
      setNewListCategory('');
      setSelectedListId('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
          <h3 className="font-bold text-[#1A1A1A] flex items-center gap-2">
            <ListPlus className="text-cupros-apricot h-5 w-5" />
            Save {leads.length} Leads to List
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 bg-white">
          {isSuccess ? (
            <div className="py-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FFF1E8] mb-4">
                <CheckCircle2 className="h-8 w-8 text-cupros-apricot" />
              </div>
              <h4 className="text-xl font-bold text-[#1A1A1A]">Leads Saved!</h4>
              <p className="text-slate-500 mt-1">Successfully added to your list.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {!isCreatingNew && lists.length > 0 ? (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Select an existing list:
                  </label>
                  <select
                    value={selectedListId}
                    onChange={(e) => setSelectedListId(e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-[#FF7A3D] outline-none"
                  >
                    <option value="">-- Choose a list --</option>
                    {lists.map((list) => (
                      <option key={list.id} value={list.id}>
                        {list.name} ({list.leads.length} leads)
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setIsCreatingNew(true)}
                    className="mt-4 text-sm font-medium text-[#E85F1C] hover:text-cupros-apricot flex items-center gap-1"
                  >
                    <Plus size={16} />
                    Or create a new list
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-slate-700">
                      Create new list:
                    </label>
                    {lists.length > 0 && (
                      <button
                        onClick={() => setIsCreatingNew(false)}
                        className="text-xs font-semibold text-slate-400 hover:text-slate-600"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FolderPlus className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="List Name (e.g. Missoula Smoke Shops)"
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FF7A3D] outline-none bg-white"
                        autoFocus
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Category (e.g. Cupr.os, Smoke Shop)"
                      value={newListCategory}
                      onChange={(e) => setNewListCategory(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FF7A3D] outline-none bg-white"
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handleSave}
                disabled={
                  (isCreatingNew || lists.length === 0)
                    ? !newListName.trim()
                    : !selectedListId
                }
                className="w-full py-4 bg-cupros-apricot hover:bg-[#E85F1C] text-white font-bold rounded-xl shadow-cupros-apricot transition-all disabled:opacity-50 disabled:shadow-none"
              >
                Save Leads
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
