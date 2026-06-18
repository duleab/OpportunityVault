import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useOpportunityStore } from '../store/opportunityStore';
import { useSettingsStore } from '../store/settingsStore';
import { useExtraction } from '../hooks/useExtraction';
import { useAuthStore } from '../store/authStore';
import { saveExtracted } from '../services/extractionService';
import { PasteInput } from '../components/paste/PasteInput';
import { ExtractionLoading } from '../components/paste/ExtractionLoading';
import { ExtractionPreview } from '../components/paste/ExtractionPreview';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';

export function Add() {
  const navigate = useNavigate();
  const accessToken = useAuthStore((s) => s.accessToken);
  const { aiProvider, setAiProvider } = useSettingsStore();
  const {
    extractions, rawText, lowConfidenceFieldsList, extractionWarnings,
    updateExtraction, removeExtraction, clearExtractions
  } = useOpportunityStore();
  const [text, setText] = useState(rawText);
  const { loading, extract } = useExtraction();
  const [savingIndex, setSavingIndex] = useState<number | null>(null);

  const handleExtract = async () => {
    const result = await extract(text, aiProvider);
    if (result) setText(text);
  };

  const handleSave = async (index: number) => {
    if (!accessToken) return;
    const data = extractions[index];
    setSavingIndex(index);
    try {
      await saveExtracted(accessToken, data, text);
      toast.success('Saved to vault!');
      removeExtraction(index);
      // If none left, clear and redirect to dashboard
      if (extractions.length === 1) {
        clearExtractions();
        navigate('/');
      }
    } catch {
      toast.error('Save failed');
    } finally {
      setSavingIndex(null);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <PasteInput value={text} onChange={setText} onClear={() => setText('')} />
        <Select label="AI Provider" value={aiProvider} onChange={(e) => setAiProvider(e.target.value)}>
          <option value="groq">Groq (fastest)</option>
          <option value="gemini">Gemini</option>
          <option value="mistral">Mistral</option>
          <option value="ollama">Ollama (local)</option>
        </Select>
        <Button size="lg" className="w-full" onClick={handleExtract} disabled={loading || !text.trim()}>
          Extract with AI →
        </Button>
      </div>
      <div className="space-y-6">
        {loading && <ExtractionLoading />}
        {!loading && extractions.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Extracted Opportunities ({extractions.length})</h2>
              <Button variant="ghost" onClick={clearExtractions}>Clear All</Button>
            </div>
            {extractions.map((extraction, idx) => (
              <ExtractionPreview
                key={idx}
                data={extraction}
                lowConfidenceFields={lowConfidenceFieldsList[idx] || []}
                warning={extractionWarnings[idx]}
                onChange={(d) => updateExtraction(idx, d)}
                onSave={() => savingIndex !== idx && handleSave(idx)}
                onDiscard={() => removeExtraction(idx)}
              />
            ))}
          </div>
        )}
        {!loading && extractions.length === 0 && (
          <div className="flex h-full min-h-[300px] items-center justify-center rounded-xl border border-dashed border-white/10 text-gray-500">
            Extracted fields will appear here
          </div>
        )}
      </div>
    </div>
  );
}
