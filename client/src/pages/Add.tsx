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
import type { ExtractedData } from '../types/opportunity.types';

export function Add() {
  const navigate = useNavigate();
  const accessToken = useAuthStore((s) => s.accessToken);
  const { aiProvider, setAiProvider } = useSettingsStore();
  const {
    extraction, rawText, lowConfidenceFields, extractionWarning,
    setExtraction, clearExtraction,
  } = useOpportunityStore();
  const [text, setText] = useState(rawText);
  const { loading, extract } = useExtraction();
  const [saving, setSaving] = useState(false);

  const handleExtract = async () => {
    const result = await extract(text, aiProvider);
    if (result) setText(text);
  };

  const handleSave = async (data: ExtractedData) => {
    if (!accessToken) return;
    setSaving(true);
    try {
      const res = await saveExtracted(accessToken, data, text);
      toast.success('Saved to vault!');
      clearExtraction();
      navigate(`/opportunities/${res.opportunity.id}`);
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving(false);
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
      <div>
        {loading && <ExtractionLoading />}
        {!loading && extraction && (
          <ExtractionPreview
            data={extraction}
            lowConfidenceFields={lowConfidenceFields}
            warning={extractionWarning}
            onChange={(d) => setExtraction(d)}
            onSave={() => !saving && handleSave(extraction)}
            onDiscard={clearExtraction}
          />
        )}
        {!loading && !extraction && (
          <div className="flex h-full min-h-[300px] items-center justify-center rounded-xl border border-dashed border-white/10 text-gray-500">
            Extracted fields will appear here
          </div>
        )}
      </div>
    </div>
  );
}
