'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2, ShieldCheck, ListPlus, Settings2, MapPin, Tag, ChevronRight } from 'lucide-react';
import { BusinessCard, Business } from '@/components/BusinessCard';
import { ExportButton } from '@/components/ExportButton';
import { SaveToListModal } from '@/components/SaveToListModal';
import { useSearchBank } from '@/context/SearchBankContext';
import { SearchBankManager } from '@/components/SearchBankManager';

export default function Home() {
  const { businessTypes, locations } = useSearchBank();
  
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [locationName, setLocationName] = useState('');
  
  // Search Bank Selection State
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedLoc, setSelectedLoc] = useState<string | null>(null);
  const [isBankManagerOpen, setIsBankManagerOpen] = useState(false);

  // Update query when bank selections change
  useEffect(() => {
    if (selectedType && selectedLoc) {
      setQuery(`${selectedType} in ${selectedLoc}`);
    } else if (selectedType) {
      setQuery(selectedType);
    } else if (selectedLoc) {
      setQuery(`Businesses in ${selectedLoc}`);
    }
  }, [selectedType, selectedLoc]);

  // Client-side pagination state
  const INITIAL_BATCH_SIZE = 10;
  const [visibleCount, setVisibleCount] = useState(INITIAL_BATCH_SIZE);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setResults([]);
    setVisibleCount(INITIAL_BATCH_SIZE);
    setHasSearched(true);
    
    // Extract a naive location from the query for the header (e.g., text after 'in')
    const parts = query.split(/ in | near /i);
    setLocationName(parts.length > 1 ? parts[1].trim() : 'this area');

    try {
      const url = `/api/search?query=${encodeURIComponent(query)}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setResults(data.results);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 shadow-2xl relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full text-indigo-300 text-xs font-bold uppercase tracking-widest mb-4">
              <ShieldCheck size={14} />
              Cupr.os CRM · Cannabis Retail
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6">
              NWAGo <span className="text-indigo-400">Finder</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Find Montana dispensaries &amp; smoke shops{' '}
              <span className="text-white font-bold italic">without a real website</span>.
              Export straight into your Cupr.os outreach tracker.
            </p>
          </div>

          <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-10">
            <div className="relative flex flex-col md:flex-row items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-md">
              <div className="relative flex-grow w-full">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    // Reset bank selections if user types manually (optional logic)
                  }}
                  placeholder="e.g. Dispensary in Missoula, MT"
                  className="block w-full pl-11 pr-4 py-4 rounded-xl border-0 bg-white/10 text-white ring-1 ring-inset ring-white/20 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-lg transition-all"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-xl font-black text-lg transition-all flex justify-center items-center shadow-lg shadow-indigo-600/20 active:scale-95 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin h-6 w-6 mr-2" />
                ) : <ChevronRight className="h-6 w-6 mr-1" />}
                Search Leads
              </button>
            </div>
          </form>

          {/* Search Bank Quick Select */}
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-end px-2">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Tag size={12} className="text-indigo-400" /> Quick Filter Bank
              </h3>
              <button 
                onClick={() => setIsBankManagerOpen(true)}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors bg-white/5 px-2 py-1 rounded-md"
              >
                <Settings2 size={12} /> Manage Library
              </button>
            </div>

            <div className="space-y-4">
              {/* Business Types Chips */}
              <div className="flex flex-wrap gap-2">
                {businessTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(selectedType === type ? null : type)}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                      selectedType === type 
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30' 
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Locations Chips */}
              <div className="flex flex-wrap gap-2">
                {locations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setSelectedLoc(selectedLoc === loc ? null : loc)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 border ${
                      selectedLoc === loc 
                        ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/30' 
                        : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <MapPin size={14} />
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {hasSearched && !isLoading && !error && results.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-200">
            <ShieldCheck className="mx-auto h-16 w-16 text-slate-200 mb-6" />
            <h3 className="text-2xl font-bold text-slate-900">No leads found</h3>
            <p className="mt-2 text-slate-500 max-w-sm mx-auto">
              We couldn&apos;t find any businesses in <span className="text-indigo-600 font-bold uppercase">{locationName}</span> that match your criteria and lack a website.
            </p>
          </div>
        )}

        {results.length > 0 && (
          <>
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-10 gap-6">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                  Found {results.length} NWAGo Leads
                </h2>
                <p className="text-slate-500 text-lg">
                  Verified businesses in <span className="text-indigo-600 font-bold capitalize">{locationName}</span> ready for outreach.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsSaveModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
                >
                  <ListPlus size={20} />
                  Save to List
                </button>
                <ExportButton
                  key={`${selectedType || 'none'}-${selectedLoc || 'none'}`}
                  businesses={results}
                  defaultSegment={
                    selectedType?.toLowerCase().includes('smoke') ||
                    selectedType?.toLowerCase().includes('vape')
                      ? 'Smoke Shop'
                      : 'Dispensary'
                  }
                />
              </div>
            </div>

            <SaveToListModal 
              isOpen={isSaveModalOpen} 
              onClose={() => setIsSaveModalOpen(false)} 
              leads={results.slice(0, visibleCount)} 
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {results.slice(0, visibleCount).map((business, i) => (
                <BusinessCard key={`${business.id}-${i}`} business={business} />
              ))}
            </div>

            {results.length > visibleCount && (
              <div className="mt-12 flex flex-col items-center">
                <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl shadow-sm max-w-2xl w-full flex flex-col sm:flex-row items-center gap-6 mb-8">
                  <div className="bg-amber-100 p-3 rounded-full">
                    <AlertTriangle className="h-6 w-6 text-amber-600" />
                  </div>
                  <div className="flex-grow text-center sm:text-left">
                    <p className="text-amber-900 font-bold">More Leads Available</p>
                    <p className="text-sm text-amber-700">
                      There are deep opportunities in this area. We recommend refining your search or loading more.
                    </p>
                  </div>
                  <button
                    onClick={() => setVisibleCount(prev => prev + INITIAL_BATCH_SIZE)}
                    className="whitespace-nowrap bg-white border border-amber-300 px-6 py-2 rounded-xl font-bold text-amber-900 hover:bg-amber-50 transition-colors shadow-sm"
                  >
                    Load More
                  </button>
                </div>
              </div>
            )}
            
          </>
        )}
      </div>

      {/* Modal / Overlay Components */}
      <SearchBankManager 
        isOpen={isBankManagerOpen} 
        onClose={() => setIsBankManagerOpen(false)} 
      />
    </main>
  );
}

// Additional icons
import { AlertTriangle } from 'lucide-react';
