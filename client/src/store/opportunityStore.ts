import { create } from 'zustand';
import type { Opportunity, ExtractedData } from '../types/opportunity.types';

interface OpportunityState {
  opportunities: Opportunity[];
  selected: Opportunity | null;
  extractions: ExtractedData[];
  rawText: string;
  lowConfidenceFieldsList: string[][];
  extractionWarnings: (string | null)[];
  setOpportunities: (items: Opportunity[]) => void;
  setSelected: (item: Opportunity | null) => void;
  setExtractions: (data: ExtractedData[], rawText?: string) => void;
  updateExtraction: (index: number, data: ExtractedData) => void;
  removeExtraction: (index: number) => void;
  setLowConfidenceList: (fieldsList: string[][], warnings: (string | null)[]) => void;
  clearExtractions: () => void;
}

export const useOpportunityStore = create<OpportunityState>((set) => ({
  opportunities: [],
  selected: null,
  extractions: [],
  rawText: '',
  lowConfidenceFieldsList: [],
  extractionWarnings: [],
  setOpportunities: (items) => set({ opportunities: items }),
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

