import React, { createContext, useState } from 'react';
import { SearchContextType } from './types';
import { Suggestion } from '@/data-types/general';

export const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestTerm, setSuggestTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [wasReset, setWasReset] = useState(false);

  const clearSearch = () => {
    setSearchTerm('');
    setSuggestTerm('');
    setSuggestions([]);
    setWasReset(true);
    setTimeout(() => {
      setWasReset(false);
    }, 150);
  }

  const value = {
    searchTerm,
    suggestTerm,
    suggestions,
    setSearchTerm,
    setSuggestTerm,
    setSuggestions,
    clearSearch,
    wasReset
  };

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};
