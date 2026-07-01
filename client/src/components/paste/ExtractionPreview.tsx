import { useState } from 'react';
import { ExternalLink, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import type { ExtractedData } from '../../types/opportunity.types';
import { OPPORTUNITY_TYPES } from '../../types/opportunity.types';
import { copyToClipboard } from '../../utils/deadlineUtils';
import { Button } from '../ui/Button';

interface ExtractionPreviewProps {
  data: ExtractedData;
  lowConfidenceFields: string[];
  warning: string | null;
  onChange: (data: ExtractedData) => void;
  onSave: () => void;
  onDiscard: () => void;
}

function Field({
  label,
  low,
  children,
}: {
  label: string;
  low?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${low ? 'rounded-lg border border-warning/40 bg-warning/5 p-2' : ''}`}>
      <span className={`mb-1 block text-xs ${low ? 'text-warning' : 'text-gray-500'}`}>{label}</span>
      {children}
    </label>
  );
}

function inputClass(low?: boolean) {
  return `w-full rounded-lg border px-3 py-2 text-sm text-[#111827] focus:outline-none ${
    low ? 'border-warning/40 bg-[#fffbeb] focus:border-warning' : 'border-[#e5e7eb] bg-white focus:border-accent'
  }`;
}

export function ExtractionPreview({
  data,
  lowConfidenceFields,
  warning,
  onChange,
  onSave,
  onDiscard,
}: ExtractionPreviewProps) {
  const [editing, setEditing] = useState(true);
  const low = (field: string) => lowConfidenceFields.includes(field);
  const confidence = Math.round((data.confidence ?? 0.5) * 100);

  const update = <K extends keyof ExtractedData>(key: K, value: ExtractedData[K]) => {
    onChange({ ...data, [key]: value });
  };

  const copyLink = async (url: string) => {
    await copyToClipboard(url);
    toast.success('Link copied');
  };

  return (
    <div className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <h3 className="mb-4 font-display text-lg font-semibold text-[#111827]">Extraction Preview</h3>
      {warning && (
        <div className="mb-4 rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning">
          {warning}
        </div>
      )}

      <div className="space-y-6">
        <section>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#6b7280]">Basic Info</h4>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Name" low={low('name')}>
              <input className={inputClass(low('name'))} value={data.name} onChange={(e) => update('name', e.target.value)} />
            </Field>
            <Field label="Organization" low={low('organization')}>
              <input className={inputClass(low('organization'))} value={data.organization ?? ''} onChange={(e) => update('organization', e.target.value || null)} />
            </Field>
            <Field label="Type" low={low('type')}>
              <select className={inputClass(low('type'))} value={data.type} onChange={(e) => update('type', e.target.value as ExtractedData['type'])}>
                {OPPORTUNITY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Field" low={low('field')}>
              <input className={inputClass(low('field'))} value={data.field ?? ''} onChange={(e) => update('field', e.target.value || null)} />
            </Field>
          </div>
        </section>

        <section>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#6b7280]">Timeline</h4>
          <div className="grid gap-3 md:grid-cols-3">
            <Field label="Deadline" low={low('deadline')}>
              <input type="datetime-local" className={inputClass(low('deadline'))} value={data.deadline?.slice(0, 16) ?? ''} onChange={(e) => update('deadline', e.target.value ? new Date(e.target.value).toISOString() : null)} />
            </Field>
            <Field label="Start Date" low={low('startDate')}>
              <input type="date" className={inputClass(low('startDate'))} value={data.startDate?.slice(0, 10) ?? ''} onChange={(e) => update('startDate', e.target.value ? new Date(e.target.value).toISOString() : null)} />
            </Field>
            <Field label="Duration" low={low('duration')}>
              <input className={inputClass(low('duration'))} value={data.duration ?? ''} onChange={(e) => update('duration', e.target.value || null)} />
            </Field>
          </div>
        </section>

        <section>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#6b7280]">Location</h4>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Countries (comma-separated)" low={low('countries')}>
              <input
                className={inputClass(low('countries'))}
                value={data.countries.join(', ')}
                onChange={(e) => update('countries', e.target.value.split(',').map((c) => c.trim()).filter(Boolean))}
              />
            </Field>
            <div className="flex items-center gap-4 pt-6">
              <label className="flex items-center gap-2 text-sm text-[#374151]">
                <input type="checkbox" checked={data.isRemote} onChange={(e) => update('isRemote', e.target.checked)} />
                Remote
              </label>
              <label className="flex items-center gap-2 text-sm text-[#374151]">
                <input type="checkbox" checked={data.isOnline} onChange={(e) => update('isOnline', e.target.checked)} />
                Online
              </label>
            </div>
          </div>
        </section>

        <section>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#6b7280]">Financial</h4>
          <div className="grid gap-3 md:grid-cols-3">
            <label className="flex items-center gap-2 pt-6 text-sm text-[#374151]">
              <input type="checkbox" checked={data.hasFee} onChange={(e) => update('hasFee', e.target.checked)} />
              Has application fee
            </label>
            <Field label="Fee Amount" low={low('feeAmount')}>
              <input className={inputClass(low('feeAmount'))} value={data.feeAmount ?? ''} onChange={(e) => update('feeAmount', e.target.value || null)} />
            </Field>
            <Field label="Funding" low={low('funding')}>
              <input className={inputClass(low('funding'))} value={data.funding ?? ''} onChange={(e) => update('funding', e.target.value || null)} />
            </Field>
          </div>
        </section>

        <section>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#6b7280]">Links</h4>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Application Link" low={low('applicationLink')}>
              <div className="flex gap-2">
                <input className={inputClass(low('applicationLink'))} value={data.applicationLink ?? ''} onChange={(e) => update('applicationLink', e.target.value || null)} />
                {data.applicationLink && (
                  <>
                    <a href={data.applicationLink} target="_blank" rel="noopener noreferrer" className="flex items-center rounded-lg border border-[#e5e7eb] px-3 text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#111827]">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <button type="button" onClick={() => copyLink(data.applicationLink!)} className="rounded-lg border border-[#e5e7eb] px-3 text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#111827]">
                      <Copy className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </Field>
            <Field label="Website URL" low={low('websiteUrl')}>
              <input className={inputClass(low('websiteUrl'))} value={data.websiteUrl ?? ''} onChange={(e) => update('websiteUrl', e.target.value || null)} />
            </Field>
          </div>
        </section>

        <section>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#6b7280]">Eligibility</h4>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Level" low={low('level')}>
              <input className={inputClass(low('level'))} value={data.level ?? ''} onChange={(e) => update('level', e.target.value || null)} />
            </Field>
            <Field label="Language Requirement" low={low('languageReq')}>
              <input className={inputClass(low('languageReq'))} value={data.languageReq ?? ''} onChange={(e) => update('languageReq', e.target.value || null)} />
            </Field>
            <Field label="Eligibility" low={low('eligibility')}>
              <textarea className={inputClass(low('eligibility'))} rows={2} value={data.eligibility ?? ''} onChange={(e) => update('eligibility', e.target.value || null)} />
            </Field>
            <Field label="Requirements (comma-separated)" low={low('requirements')}>
              <input
                className={inputClass(low('requirements'))}
                value={data.requirements.join(', ')}
                onChange={(e) => update('requirements', e.target.value.split(',').map((r) => r.trim()).filter(Boolean))}
              />
            </Field>
          </div>
        </section>

        <section>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#6b7280]">Description</h4>
          <Field label="Summary" low={low('description')}>
            <textarea className={inputClass(low('description'))} rows={3} value={data.description ?? ''} onChange={(e) => update('description', e.target.value || null)} />
          </Field>
        </section>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-[#6b7280]">AI Confidence</span>
          <span className="font-mono text-accent font-semibold">{confidence}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#e5e7eb]">
          <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${confidence}%` }} />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={onSave}>Save to Vault</Button>
        <Button variant="secondary" onClick={() => setEditing(!editing)}>{editing ? 'Confirm & Save' : 'Edit & Save'}</Button>
        <Button variant="ghost" onClick={onDiscard}>Discard</Button>
      </div>
    </div>
  );
}
