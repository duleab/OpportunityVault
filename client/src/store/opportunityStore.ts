import { create } from 'zustand';
import type { Opportunity, ExtractedData } from '../types/opportunity.types';

interface OpportunityState {
  opportunities: Opportunity[];
  selected: Opportunity | null;
  extraction: ExtractedData | null;
  rawText: string;
  lowConfidenceFields: string[];
  extractionWarning: string | null;
  setOpportunities: (items: Opportunity[]) => void;
  setSelected: (item: Opportunity | null) => void;
  setExtraction: (data: ExtractedData | null, rawText?: string) => void;
  setLowConfidence: (fields: string[], warning: string | null) => void;
  clearExtraction: () => void;
}

export const useOpportunityStore = create<OpportunityState>((set) => ({
  opportunities: [],
  selected: null,
  extraction: null,
  rawText: '',
  lowConfidenceFields: [],
  extractionWarning: null,
  setOpportunities: (items) => set({ opportunities: items }),
  setSelected: (item) => set({ selected: item }),
  setExtraction: (data, rawText) =>
    set((s) => ({ extraction: data, rawText: rawText ?? s.rawText })),
  setLowConfidence: (fields, warning) =>
    set({ lowConfidenceFields: fields, extractionWarning: warning }),
  clearExtraction: () =>
    set({ extraction: null, rawText: '', lowConfidenceFields: [], extractionWarning: null }),
}));
