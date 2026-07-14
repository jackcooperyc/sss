'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Business } from '@/components/BusinessCard';

export interface LeadList {
  id: string;
  name: string;
  category: string;
  createdAt: string;
  leads: Business[];
}

interface ListContextType {
  lists: LeadList[];
  createList: (name: string, category: string) => LeadList;
  addLeadsToList: (listId: string, leads: Business[]) => void;
  removeList: (listId: string) => void;
  removeLeadFromList: (listId: string, leadId: string) => void;
  updateListName: (listId: string, name: string) => void;
}

const ListContext = createContext<ListContextType | undefined>(undefined);

export function ListProvider({ children }: { children: ReactNode }) {
  const [lists, setLists] = useState<LeadList[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('nwa_lead_lists');
    if (saved) {
      try {
        setLists(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved lists', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever lists change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('nwa_lead_lists', JSON.stringify(lists));
    }
  }, [lists, isLoaded]);

  const createList = (name: string, category: string) => {
    const newList: LeadList = {
      id: crypto.randomUUID(),
      name,
      category,
      createdAt: new Date().toISOString(),
      leads: [],
    };
    setLists((prev) => [...prev, newList]);
    return newList;
  };

  const addLeadsToList = (listId: string, newLeads: Business[]) => {
    setLists((prev) =>
      prev.map((list) => {
        if (list.id === listId) {
          // Deduplicate leads by ID
          const existingIds = new Set(list.leads.map((l) => l.id));
          const uniqueLeads = newLeads.filter((l) => !existingIds.has(l.id));
          return {
            ...list,
            leads: [...list.leads, ...uniqueLeads],
          };
        }
        return list;
      })
    );
  };

  const removeList = (listId: string) => {
    setLists((prev) => prev.filter((l) => l.id !== listId));
  };

  const removeLeadFromList = (listId: string, leadId: string) => {
    setLists((prev) =>
      prev.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            leads: list.leads.filter((l) => l.id !== leadId),
          };
        }
        return list;
      })
    );
  };

  const updateListName = (listId: string, name: string) => {
    setLists((prev) =>
      prev.map((list) => (list.id === listId ? { ...list, name } : list))
    );
  };

  return (
    <ListContext.Provider
      value={{
        lists,
        createList,
        addLeadsToList,
        removeList,
        removeLeadFromList,
        updateListName,
      }}
    >
      {children}
    </ListContext.Provider>
  );
}

export function useLists() {
  const context = useContext(ListContext);
  if (context === undefined) {
    throw new Error('useLists must be used within a ListProvider');
  }
  return context;
}
