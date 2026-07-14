'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2, ShieldCheck, ListPlus, Settings2, MapPin, Tag, ChevronRight, AlertTriangle } from 'lucide-react';
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
  
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedLoc, setSelectedLoc] = useState<string | null>(null);
  const [isBankManagerOpen, setIsBankManagerOpen] = useState(false);

  useEffect(() => {
    if (selectedType && selectedLoc) {
      setQuery(`${selectedType} in ${selectedLoc}`);
    } else if (selectedType) {
      setQuery(selectedType);
    } else if (selectedLoc) {
      setQuery(`Businesses in ${selectedLoc}`);
    }
  }, [selectedType, selectedLoc]);

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
    <main className="min-h-screen bg-white pb-20">
      <div className="bg-cupros-hero text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#FF7A3D_1px,transparent_1px)] [background-size:22px_22px]"></div>
        </div>
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#FF7A3D]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-16 w-72 h-72 rounded-full bg-[#FF7A3D]/10 blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-[#FF7A3D]/15 border border-[#FF7A3D]/40 px-3 py-1 rounded-full text-[#FF8F52] text-xs font-bold uppercase tracking-widest mb-4">
              <ShieldCheck size={14} />
              Cupr.os CRM · Smoke Shop &amp; Dispensary
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4">
              Cupr<span className="text-cupros-apricot">.os</span>
            </h1>
            <p className="text-xl md:text-2xl font-bold text-white/90 mb-4">
              Smoke Shop Search Tool
            </p>
            <p className="text-lg text-white/60 mb-8 max-w-2xl mx-auto leading-relaxed">
              Find smoke shops &amp; dispensaries{' '}
              <span className="text-white font-bold italic">without a real website</span>.
              Export straight into your Cupr.os outreach tracker.
            </p>
          </div>

          <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-10">
            <div className="relative flex flex-col md:flex-row items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-md">
              <div className="relative flex-grow w-full">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-cupros-apricot" />
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                  }}
                  placeholder="e.g. Smoke Shop in Missoula, MT"
                  className="block w-full pl-11 pr-4 py-4 rounded-xl border-0 bg-white/10 text-white ring-1 ring-inset ring-white/20 placeholder:text-white/40 focus:ring-2 focus:ring-inset focus:ring-[#FF7A3D] sm:text-lg transition-all"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="w-full md:w-auto bg-cupros-apricot hover:bg-[#FF8F52] text-white px-10 py-4 rounded-xl font-black text-lg transition-all flex justify-center items-center shadow-cupros-apricot active:scale-95 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin h-6 w-6 mr-2" />
                ) : <ChevronRight className="h-6 w-6 mr-1" />}
                Search Leads
              </button>
            </div>
          </form>

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-end px-2">
              <h3 className="text-xs font-black text-white/50 uppercase tracking-[0.2em] flex items-center gap-2">
                <Tag size={12} className="text-cupros-apricot" /> Quick Filter Bank
              </h3>
              <button 
                onClick={() => setIsBankManagerOpen(true)}
                className="text-xs font-bold text-cupros-apricot hover:text-[#FF8F52] flex items-center gap-1.5 transition-colors bg-white/5 px-2 py-1 rounded-md"
              >
                <Settings2 size={12} /> Manage Library
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {businessTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(selectedType === type ? null : type)}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                      selectedType === type 
                        ? 'bg-cupros-apricot border-cupros-apricot text-white shadow-cupros-apricot' 
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {locations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setSelectedLoc(selectedLoc === loc ? null : loc)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 border ${
                      selectedLoc === loc 
                        ? 'bg-[#4B4B4B] border-cupros-apricot text-white shadow-lg' 
                        : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <MapPin size={14} className={selectedLoc === loc ? 'text-cupros-apricot' : ''} />
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-md">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {hasSearched && !isLoading && !error && results.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-200">
            <ShieldCheck className="mx-auto h-16 w-16 text-slate-200 mb-6" />
            <h3 className="text-2xl font-bold text-[#1A1A1A]">No leads found</h3>
            <p className="mt-2 text-slate-500 max-w-sm mx-auto">
              We couldn&apos;t find any businesses in <span className="text-[#E85F1C] font-bold uppercase">{locationName}</span> that match your criteria and lack a website.
            </p>
          </div>
        )}

        {results.length > 0 && (
          <>
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-10 gap-6">
              <div>
                <h2 className="text-3xl font-black text-[#1A1A1A] tracking-tight">
                  Found {results.length} Leads
                </h2>
                <p className="text-slate-500 text-lg">
                  Verified businesses in <span className="text-[#E85F1C] font-bold capitalize">{locationName}</span> ready for outreach.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsSaveModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-cupros-apricot text-white px-6 py-3 rounded-xl font-bold hover:bg-[#E85F1C] transition-all shadow-cupros-apricot"
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
                <div className="bg-[#FFF1E8] border border-[#FFD9C2] p-6 rounded-2xl shadow-sm max-w-2xl w-full flex flex-col sm:flex-row items-center gap-6 mb-8">
                  <div className="bg-white p-3 rounded-full border border-[#FFD9C2]">
                    <AlertTriangle className="h-6 w-6 text-[#E85F1C]" />
                  </div>
                  <div className="flex-grow text-center sm:text-left">
                    <p className="text-[#1A1A1A] font-bold">More Leads Available</p>
                    <p className="text-sm text-[#4B4B4B]">
                      There are more opportunities in this area. Refine your search or load more.
                    </p>
                  </div>
                  <button
                    onClick={() => setVisibleCount(prev => prev + INITIAL_BATCH_SIZE)}
                    className="whitespace-nowrap bg-white border border-[#FFD9C2] px-6 py-2 rounded-xl font-bold text-[#E85F1C] hover:bg-[#FFF1E8] transition-colors shadow-sm"
                  >
                    Load More
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <SearchBankManager 
        isOpen={isBankManagerOpen} 
        onClose={() => setIsBankManagerOpen(false)} 
      />
    </main>
  );
}
