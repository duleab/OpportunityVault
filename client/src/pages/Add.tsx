import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Clipboard, Sparkles, ChevronDown, X } from 'lucide-react';
import { useOpportunityStore } from '../store/opportunityStore';
import { useSettingsStore } from '../store/settingsStore';
import { useExtraction } from '../hooks/useExtraction';
import { useAuthStore } from '../store/authStore';
import { saveExtracted } from '../services/extractionService';
import { ExtractionLoading } from '../components/paste/ExtractionLoading';
import { ExtractionPreview } from '../components/paste/ExtractionPreview';

const AI_PROVIDERS = [
  { value: 'groq', label: 'Groq', note: 'Fastest' },
  { value: 'gemini', label: 'Gemini', note: 'Google' },
  { value: 'mistral', label: 'Mistral', note: 'Open' },
  { value: 'ollama', label: 'Ollama', note: 'Local' },
];

const EXAMPLE_TEXT = `DAAD MIDE Scholarship 2026
Organization: HTW Berlin University of Applied Sciences
Country: Germany
Type: Fully Funded Master's Scholarship
Deadline: 31 August 2026
Funding: Full Tuition + €992/month stipend + Health Insurance
Link: https://mide.htw-berlin.de`;

export function Add() {
  const navigate = useNavigate();
  const accessToken = useAuthStore((s) => s.accessToken);
  const { aiProvider, setAiProvider } = useSettingsStore();
  const {
    extractions, rawText, lowConfidenceFieldsList, extractionWarnings,
    updateExtraction, removeExtraction, clearExtractions,
  } = useOpportunityStore();
  const [text, setText] = useState(rawText);
  const { loading, extract } = useExtraction();
  const [savingIndex, setSavingIndex] = useState<number | null>(null);

  const handleExtract = async () => {
    await extract(text, aiProvider);
  };

  const handleSave = async (index: number) => {
    if (!accessToken) return;
    const data = extractions[index];
    setSavingIndex(index);
    try {
      await saveExtracted(accessToken, data, text);
      toast.success('✅ Saved to vault!');
      removeExtraction(index);
      if (extractions.length === 1) {
        clearExtractions();
        navigate('/opportunities');
      }
    } catch {
      toast.error('Save failed');
    } finally {
      setSavingIndex(null);
    }
  };

  const handleSaveAll = async () => {
    if (!accessToken || extractions.length === 0) return;
    let saved = 0;
    for (let i = 0; i < extractions.length; i++) {
      try {
        await saveExtracted(accessToken, extractions[i], text);
        saved++;
      } catch { /* skip */ }
    }
    toast.success(`✅ Saved ${saved} of ${extractions.length} opportunities!`);
    clearExtractions();
    navigate('/opportunities');
  };

  const handlePaste = async () => {
    try {
      const t = await navigator.clipboard.readText();
      setText(t);
      toast.success('Pasted from clipboard');
    } catch {
      toast.error('Clipboard access denied');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-white">Add Opportunity</h1>
        <p className="text-sm text-gray-400 mt-0.5">Paste raw text from any source — AI extracts all the details.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Left — Input */}
        <div className="space-y-3">
          {/* Text area card */}
          <div className="card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Paste Text</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePaste}
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-gray-400 hover:text-white hover:border-white/20 transition"
                >
                  <Clipboard className="h-3 w-3" /> Paste
                </button>
                {text && (
                  <button
                    onClick={() => setText('')}
                    className="flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1.5 text-xs text-gray-500 hover:text-red-400 hover:border-red-500/30 transition"
                  >
                    <X className="h-3 w-3" /> Clear
                  </button>
                )}
              </div>
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`Paste a scholarship, job posting, or opportunity text here...\n\nExample:\n${EXAMPLE_TEXT}`}
              className="w-full resize-none rounded-lg border border-white/[0.07] bg-surface-2 p-4 text-sm text-white placeholder-gray-600 focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/20 transition min-h-[320px] font-mono leading-relaxed"
            />

            <div className="flex items-center justify-between text-[11px] text-gray-600">
              <span>{text.length.toLocaleString()} characters</span>
              <span>Supports multiple opportunities at once</span>
            </div>
          </div>

          {/* Provider + Extract */}
          <div className="card p-4">
            <div className="flex items-center gap-3">
              {/* AI Provider selector */}
              <div className="relative flex-1">
                <select
                  value={aiProvider}
                  onChange={(e) => setAiProvider(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-white/10 bg-surface-2 py-2.5 pl-3 pr-8 text-sm text-white focus:border-accent/40 focus:outline-none cursor-pointer"
                >
                  {AI_PROVIDERS.map(({ value, label, note }) => (
                    <option key={value} value={value}>{label} — {note}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>

              {/* Extract button */}
              <button
                onClick={handleExtract}
                disabled={loading || !text.trim()}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent py-2.5 text-sm font-semibold text-white hover:bg-accent-hover transition disabled:opacity-50 shadow-glow"
              >
                <Sparkles className="h-4 w-4" />
                {loading ? 'Extracting...' : 'Extract with AI'}
              </button>
            </div>
          </div>
        </div>

        {/* Right — Results */}
        <div className="space-y-4">
          {loading && <ExtractionLoading />}

          {!loading && extractions.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-white">
                    Extracted ({extractions.length})
                  </h2>
                  <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs text-accent border border-accent/20">
                    {extractions.length} found
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {extractions.length > 1 && (
                    <button
                      onClick={handleSaveAll}
                      className="rounded-lg bg-accent/15 border border-accent/20 px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/25 transition"
                    >
                      Save All →
                    </button>
                  )}
                  <button
                    onClick={clearExtractions}
                    className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-500 hover:text-white hover:border-white/20 transition"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
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
            </>
          )}

          {!loading && extractions.length === 0 && (
            <div className="card flex h-full min-h-[400px] flex-col items-center justify-center gap-4 text-center p-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20">
                <Sparkles className="h-7 w-7 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-white mb-1">AI Preview</p>
                <p className="text-xs text-gray-500 max-w-xs">
                  Paste opportunity text on the left, choose your AI provider, then click "Extract with AI" to see structured results here.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {['Scholarships', 'Fellowships', 'Jobs', 'Internships', 'Research', 'Grants'].map(t => (
                  <span key={t} className="rounded-full border border-white/[0.06] bg-surface-2 px-3 py-1 text-[11px] text-gray-500">{t}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
