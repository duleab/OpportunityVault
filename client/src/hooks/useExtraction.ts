import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { useOpportunityStore } from '../store/opportunityStore';
import { useSettingsStore } from '../store/settingsStore';
import { extractOpportunity } from '../services/extractionService';

export function useExtraction() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const aiProvider = useSettingsStore((s) => s.aiProvider);
  const { setExtractions, setLowConfidenceList, clearExtractions } = useOpportunityStore();
  const [loading, setLoading] = useState(false);

  const extract = async (rawText: string, provider?: string) => {
    if (!accessToken) return;
    if (!rawText.trim()) {
      toast.error('Paste some text first');
      return;
    }
    setLoading(true);
    try {
      const result = await extractOpportunity(accessToken, rawText, provider ?? aiProvider);
      setExtractions(result.extractions, rawText);
      setLowConfidenceList(result.lowConfidenceFieldsList, result.warnings);
      
      const warningCount = result.warnings.filter(Boolean).length;
      if (warningCount > 0) toast(`⚠️ ${warningCount} warnings found`, { icon: '⚠️' });
      
      return result;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Extraction failed');
    } finally {
      setLoading(false);
    }
  };

  return { loading, extract, clearExtractions };
}
