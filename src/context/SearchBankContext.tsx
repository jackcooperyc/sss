'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SearchBankContextType {
  businessTypes: string[];
  locations: string[];
  addBusinessType: (type: string) => void;
  removeBusinessType: (type: string) => void;
  addLocation: (loc: string) => void;
  removeLocation: (loc: string) => void;
}

const SearchBankContext = createContext<SearchBankContextType | undefined>(undefined);

/** Cupr.os market: cannabis retail (dispensaries + smoke shops) across Montana. */
const DEFAULT_TYPES = [
  'Dispensary',
  'Cannabis Dispensary',
  'Smoke Shop',
  'Vape Shop',
  'CBD Store',
  'Hemp Shop',
];
const DEFAULT_LOCATIONS = [
  'Missoula, MT',
  'Bozeman, MT',
  'Billings, MT',
  'Kalispell, MT',
  'Helena, MT',
  'Great Falls, MT',
];

const STORAGE_KEY = 'nwago_search_bank_v2';

export function SearchBankProvider({ children }: { children: ReactNode }) {
  const [businessTypes, setBusinessTypes] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { types, locs } = JSON.parse(saved);
        setBusinessTypes(types?.length ? types : DEFAULT_TYPES);
        setLocations(locs?.length ? locs : DEFAULT_LOCATIONS);
      } catch (e) {
        console.error('Failed to parse search bank', e);
        setBusinessTypes(DEFAULT_TYPES);
        setLocations(DEFAULT_LOCATIONS);
      }
    } else {
      setBusinessTypes(DEFAULT_TYPES);
      setLocations(DEFAULT_LOCATIONS);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        types: businessTypes,
        locs: locations,
      }));
    }
  }, [businessTypes, locations, isLoaded]);

  const addBusinessType = (type: string) => {
    if (!type.trim() || businessTypes.includes(type.trim())) return;
    setBusinessTypes(prev => [...prev, type.trim()]);
  };

  const removeBusinessType = (type: string) => {
    setBusinessTypes(prev => prev.filter(t => t !== type));
  };

  const addLocation = (loc: string) => {
    if (!loc.trim() || locations.includes(loc.trim())) return;
    setLocations(prev => [...prev, loc.trim()]);
  };

  const removeLocation = (loc: string) => {
    setLocations(prev => prev.filter(l => l !== loc));
  };

  return (
    <SearchBankContext.Provider
      value={{
        businessTypes,
        locations,
        addBusinessType,
        removeBusinessType,
        addLocation,
        removeLocation,
      }}
    >
      {children}
    </SearchBankContext.Provider>
  );
}

export function useSearchBank() {
  const context = useContext(SearchBankContext);
  if (context === undefined) {
    throw new Error('useSearchBank must be used within a SearchBankProvider');
  }
  return context;
}
