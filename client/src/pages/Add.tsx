import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Clipboard, Sparkles, ChevronDown, X, PenLine } from 'lucide-react';
import { useOpportunityStore } from '../store/opportunityStore';
import { useSettingsStore } from '../store/settingsStore';
import { useExtraction } from '../hooks/useExtraction';
import { useAuthStore } from '../store/authStore';
import { saveExtracted, checkDuplicate, updateOpportunity } from '../services/opportunityService';
import { ExtractionLoading } from '../components/paste/ExtractionLoading';
import { ExtractionPreview } from '../components/paste/ExtractionPreview';
import { DuplicateWarning, type DuplicateMatch } from '../components/ui/DuplicateWarning';

const AI_PROVIDERS = [
  { value: 'groq',    label: 'Groq',       note: 'Fastest' },
  { value: 'zhipu',   label: 'GLM (Z.ai)', note: 'ZhipuAI' },
  { value: 'gemini',  label: 'Gemini',     note: 'Google' },
  { value: 'mistral', label: 'Mistral',    note: 'Open' },
  { value: 'ollama',  label: 'Ollama',     note: 'Local' },
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
  // Duplicate state per extraction index
  const [duplicates, setDuplicates] = useState<Record<number, DuplicateMatch | null>>({});
  const [duplicateResolved, setDuplicateResolved] = useState<Record<number, boolean>>({});

  const handleExtract = async () => {
    await extract(text, aiProvider);
    setDuplicates({});
    setDuplicateResolved({});
  };

  /** After extraction, check each result for duplicates */
  const checkForDuplicates = useCallback(async (newExtractions: typeof extractions) => {
    if (!accessToken) return;
    const results: Record<number, DuplicateMatch | null> = {};
    await Promise.allSettled(
      newExtractions.map(async (ex, idx) => {
        try {
          const res = await checkDuplicate(accessToken, ex.name);
          results[idx] = res.found && res.match
            ? { id: res.match.id, name: res.match.name, status: res.match.status, createdAt: res.match.createdAt }
            : null;
        } catch {
          results[idx] = null;
        }
      })
    );
    setDuplicates(results);
  }, [accessToken]);

  // Check duplicates whenever extractions update
  const prevExtrLen = extractions.length;
  if (extractions.length > 0 && extractions.length !== prevExtrLen) {
    void checkForDuplicates(extractions);
  }

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
    const results = await Promise.allSettled(
      extractions.map((ex) => saveExtracted(accessToken, ex, text))
    );
    const saved = results.filter((r) => r.status === 'fulfilled').length;
    toast.success(`✅ Saved ${saved} of ${extractions.length} opportunities!`);
    clearExtractions();
    navigate('/opportunities');
  };

  const handleUpdateExisting = async (index: number, existingId: string) => {
    if (!accessToken) return;
    const data = extractions[index];
    setSavingIndex(index);
    try {
      await updateOpportunity(accessToken, existingId, data as never);
      toast.success('✅ Existing opportunity updated!');
      removeExtraction(index);
      setDuplicateResolved((p) => ({ ...p, [index]: true }));
      if (extractions.length === 1) {
        clearExtractions();
        navigate('/opportunities');
      }
    } catch {
      toast.error('Update failed');
    } finally {
      setSavingIndex(null);
    }
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
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#111827]">Add Opportunity</h1>
          <p className="text-sm text-[#6b7280] mt-0.5">
            Paste raw text from any source — AI extracts all the details.
          </p>
        </div>
        <Link
          to="/add/manual"
          className="flex items-center gap-1.5 rounded border border-[#e5e7eb] bg-white px-3 py-2 text-sm font-medium text-[#374151] hover:bg-[#f3f4f6] hover:border-[#d1d5db] transition-colors"
        >
          <PenLine className="h-4 w-4" />
          Fill manually
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left — Input */}
        <div className="space-y-4">
          {/* Textarea card */}
          <div className="card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="label">Paste Text</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePaste}
                  className="flex items-center gap-1.5 rounded border border-[#e5e7eb] px-2.5 py-1.5 text-xs text-[#6b7280] hover:text-[#111827] hover:border-[#d1d5db] transition-colors"
                >
                  <Clipboard className="h-3 w-3" /> Paste
                </button>
                {text && (
                  <button
                    onClick={() => setText('')}
                    className="flex items-center gap-1 rounded border border-[#e5e7eb] px-2 py-1.5 text-xs text-[#9ca3af] hover:text-[#dc2626] hover:border-[#fecaca] transition-colors"
                  >
                    <X className="h-3 w-3" /> Clear
                  </button>
                )}
              </div>
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`Paste a scholarship, job posting, or opportunity text here…\n\nExample:\n${EXAMPLE_TEXT}`}
              className="w-full resize-none rounded border border-[#e5e7eb] bg-[#fafafa] p-4 text-sm text-[#111827] placeholder-[#9ca3af] focus:border-accent focus:outline-none focus:ring-2 focus:ring-[#bfdbfe] transition min-h-[320px] font-mono leading-relaxed"
            />

            <div className="flex items-center justify-between text-xs text-[#9ca3af]">
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
                  className="w-full appearance-none rounded border border-[#e5e7eb] bg-white py-2.5 pl-3 pr-8 text-sm text-[#374151] focus:border-accent focus:outline-none focus:ring-2 focus:ring-[#bfdbfe] cursor-pointer"
                >
                  {AI_PROVIDERS.map(({ value, label, note }) => (
                    <option key={value} value={value}>{label} — {note}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9ca3af]" />
              </div>

              {/* Extract button */}
              <button
                onClick={handleExtract}
                disabled={loading || !text.trim()}
                className="flex flex-1 items-center justify-center gap-2 rounded bg-accent py-2.5 text-sm font-semibold text-white hover:bg-accent-hover transition-colors disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                {loading ? 'Extracting…' : 'Extract with AI'}
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
                  <h2 className="text-sm font-semibold text-[#111827]">
                    Extracted ({extractions.length})
                  </h2>
                  <span className="rounded bg-[#eff6ff] border border-[#bfdbfe] px-2 py-0.5 text-xs text-[#1d4ed8] font-medium">
                    {extractions.length} found
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {extractions.length > 1 && (
                    <button
                      onClick={handleSaveAll}
                      className="rounded border border-[#bfdbfe] bg-[#eff6ff] px-3 py-1.5 text-xs font-medium text-[#1d4ed8] hover:bg-[#dbeafe] transition-colors"
                    >
                      Save All →
                    </button>
                  )}
                  <button
                    onClick={clearExtractions}
                    className="rounded border border-[#e5e7eb] px-3 py-1.5 text-xs text-[#9ca3af] hover:text-[#374151] hover:border-[#d1d5db] transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
                {extractions.map((extraction, idx) => (
                  <div key={idx} className="space-y-2">
                    {/* Duplicate warning */}
                    {duplicates[idx] && !duplicateResolved[idx] && (
                      <DuplicateWarning
                        match={duplicates[idx]!}
                        onUpdateExisting={(id) => handleUpdateExisting(idx, id)}
                        onSaveAsNew={() => {
                          setDuplicateResolved((p) => ({ ...p, [idx]: true }));
                        }}
                        onDiscard={() => removeExtraction(idx)}
                      />
                    )}
                    <ExtractionPreview
                      data={extraction}
                      lowConfidenceFields={lowConfidenceFieldsList[idx] || []}
                      warning={extractionWarnings[idx]}
                      onChange={(d) => updateExtraction(idx, d)}
                      onSave={() => savingIndex !== idx && handleSave(idx)}
                      onDiscard={() => removeExtraction(idx)}
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {!loading && extractions.length === 0 && (
            <div className="card flex h-full min-h-[400px] flex-col items-center justify-center gap-4 text-center p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-[#e5e7eb] bg-[#f9fafb]">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#111827] mb-1">AI Preview</p>
                <p className="text-xs text-[#9ca3af] max-w-xs leading-relaxed">
                  Paste opportunity text on the left, choose your AI provider, then click
                  "Extract with AI" to see structured results here.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {['Scholarships', 'Fellowships', 'Jobs', 'Internships', 'Research', 'Grants'].map((t) => (
                  <span
                    key={t}
                    className="rounded border border-[#e5e7eb] bg-[#f9fafb] px-3 py-1 text-xs text-[#9ca3af]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
