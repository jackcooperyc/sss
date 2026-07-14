'use client';

import React, { useState } from 'react';
import { X, Plus, Trash2, Settings2 } from 'lucide-react';
import { useSearchBank } from '@/context/SearchBankContext';

export function SearchBankManager({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { businessTypes, locations, addBusinessType, removeBusinessType, addLocation, removeLocation } = useSearchBank();
  
  const [newType, setNewType] = useState('');
  const [newLoc, setNewLoc] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">Manage Search Bank</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">
          {/* Business Types Section */}
          <section>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Business Types</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {businessTypes.map((type) => (
                <div key={type} className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-100 text-sm font-medium">
                  {type}
                  <button onClick={() => removeBusinessType(type)} className="hover:text-red-600 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                placeholder="e.g. Fencing"
                className="flex-grow px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                onKeyDown={(e) => e.key === 'Enter' && (addBusinessType(newType), setNewType(''))}
              />
              <button 
                onClick={() => { addBusinessType(newType); setNewType(''); }}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm font-bold"
              >
                <Plus size={18} /> Add
              </button>
            </div>
          </section>

          {/* Locations Section */}
          <section>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Locations</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {locations.map((loc) => (
                <div key={loc} className="flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium">
                  {loc}
                  <button onClick={() => removeLocation(loc)} className="hover:text-red-600 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newLoc}
                onChange={(e) => setNewLoc(e.target.value)}
                placeholder="e.g. Miami, FL"
                className="flex-grow px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                onKeyDown={(e) => e.key === 'Enter' && (addLocation(newLoc), setNewLoc(''))}
              />
              <button 
                onClick={() => { addLocation(newLoc); setNewLoc(''); }}
                className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-900 transition-colors flex items-center gap-2 text-sm font-bold"
              >
                <Plus size={18} /> Add
              </button>
            </div>
          </section>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition-colors shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
