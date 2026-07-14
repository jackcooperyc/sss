'use client';

import React, { useState } from 'react';
import { useLists } from '@/context/ListContext';
import { ExportButton } from '@/components/ExportButton';
import { 
  Trash2, 
  Calendar, 
  Tag, 
  Users, 
  ChevronDown, 
  ChevronUp, 
  XCircle, 
  Trophy,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

export default function ListsPage() {
  const { lists, removeList, removeLeadFromList } = useLists();
  const [expandedListId, setExpandedListId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedListId(expandedListId === id ? null : id);
  };

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <Link href="/" className="text-sm font-medium text-cupros-apricot hover:text-[#E85F1C] flex items-center gap-1 mb-2">
              <ArrowLeft size={14} /> Back to Search
            </Link>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Lead Lists</h1>
            <p className="text-slate-500 mt-1">Manage and export your compiled business segments.</p>
          </div>
          
          <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
            <Users className="text-slate-400 h-5 w-5" />
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Compiled</p>
              <p className="text-lg font-bold text-slate-900">
                {lists.reduce((acc, list) => acc + list.leads.length, 0)} Leads
              </p>
            </div>
          </div>
        </div>

        {lists.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-20 text-center">
            <Tag className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-900">No lists created yet</h3>
            <p className="text-slate-500 mt-1 max-w-xs mx-auto">
              Start searching for leads and click &quot;Save to List&quot; to begin compiling your database.
            </p>
            <Link 
              href="/" 
              className="mt-6 inline-flex items-center px-6 py-3 bg-cupros-apricot text-white font-semibold rounded-xl hover:bg-[#E85F1C] transition-colors"
            >
              Start Searching
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {lists.map((list) => (
              <div 
                key={list.id} 
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
              >
                {/* List Header */}
                <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4 flex-grow">
                    <div className={`p-3 rounded-xl ${list.leads.length >= 20 ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'}`}>
                      {list.leads.length >= 20 ? <Trophy size={24} /> : <FileText size={24} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-slate-900">{list.name}</h3>
                        <span className="bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">
                          {list.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} />
                          {new Date(list.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users size={14} />
                          {list.leads.length} leads
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {list.leads.length >= 20 && (
                      <div className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-green-600 mr-2 bg-green-50 px-2 py-1 rounded">
                        <CheckCircle2 size={12} />
                        Ready for Cupr.os
                      </div>
                    )}
                    <ExportButton businesses={list.leads} defaultFilename={list.name} />
                    <button 
                      onClick={() => removeList(list.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete List"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button 
                      onClick={() => toggleExpand(list.id)}
                      className="p-2 text-slate-400 hover:text-cupros-apricot hover:bg-[#FFF1E8] rounded-lg transition-all"
                    >
                      {expandedListId === list.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                </div>

                {/* List Details (Expanded) */}
                {expandedListId === list.id && (
                  <div className="border-t border-slate-100 bg-slate-50/50">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                            <th className="px-6 py-4">Business</th>
                            <th className="px-6 py-4">Location</th>
                            <th className="px-6 py-4">Phone</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {list.leads.map((lead) => (
                            <tr key={lead.id} className="group hover:bg-white transition-colors">
                              <td className="px-6 py-4 text-sm font-bold text-slate-800">
                                {lead.name}
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-500">
                                {lead.location.city}, {lead.location.state}
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-500">
                                {lead.phone}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button 
                                  onClick={() => removeLeadFromList(list.id, lead.id)}
                                  className="text-slate-300 hover:text-red-500 p-1 rounded transition-colors"
                                >
                                  <XCircle size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                          {list.leads.length === 0 && (
                            <tr>
                              <td colSpan={4} className="px-6 py-10 text-center text-slate-400 italic text-sm">
                                This list is empty.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

import { FileText } from 'lucide-react';
