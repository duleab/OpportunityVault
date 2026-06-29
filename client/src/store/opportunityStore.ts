import { create } from 'zustand';
import type { Opportunity, ExtractedData } from '../types/opportunity.types';

interface PaginationMeta {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
}

interface OpportunityState {
  opportunities: Opportunity[];
  pagination: PaginationMeta | null;
  selected: Opportunity | null;
  extractions: ExtractedData[];
  rawText: string;
  lowConfidenceFieldsList: string[][];
  extractionWarnings: (string | null)[];
  setOpportunities: (items: Opportunity[], pagination?: PaginationMeta) => void;
  setSelected: (item: Opportunity | null) => void;
  setExtractions: (data: ExtractedData[], rawText?: string) => void;
  updateExtraction: (index: number, data: ExtractedData) => void;
  removeExtraction: (index: number) => void;
  setLowConfidenceList: (fieldsList: string[][], warnings: (string | null)[]) => void;
  clearExtractions: () => void;
}

export const useOpportunityStore = create<OpportunityState>((set) => ({
  opportunities: [],
  pagination: null,
  selected: null,
  extractions: [],
  rawText: '',
  lowConfidenceFieldsList: [],
  extractionWarnings: [],
  setOpportunities: (items, pagination) =>
    set({ opportunities: items, pagination: pagination ?? null }),
  setSelected: (item) => set({ selected: item }),
  setExtractions: (data, rawText) =>
    set((s) => ({ extractions: data, rawText: rawText ?? s.rawText })),
  updateExtraction: (index, data) =>
    set((s) => {
      const newExtractions = [...s.extractions];
      newExtractions[index] = data;
      return { extractions: newExtractions };
    }),
  removeExtraction: (index) =>
    set((s) => {
      const newExtractions = [...s.extractions];
      newExtractions.splice(index, 1);
      const newWarnings = [...s.extractionWarnings];
      newWarnings.splice(index, 1);
      const newLowConf = [...s.lowConfidenceFieldsList];
      newLowConf.splice(index, 1);
      return { extractions: newExtractions, extractionWarnings: newWarnings, lowConfidenceFieldsList: newLowConf };
    }),
  setLowConfidenceList: (fieldsList, warnings) =>
    set({ lowConfidenceFieldsList: fieldsList, extractionWarnings: warnings }),
  clearExtractions: () =>
    set({ extractions: [], rawText: '', lowConfidenceFieldsList: [], extractionWarnings: [] }),
}));
