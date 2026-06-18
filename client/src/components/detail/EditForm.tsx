import type { Opportunity } from '../../types/opportunity.types';
import { OPPORTUNITY_TYPES, APP_STATUSES } from '../../types/opportunity.types';

interface EditFormProps {
  data: Opportunity;
  onChange: (field: keyof Opportunity, value: unknown) => void;
}

function inputClass() {
  return 'w-full rounded-lg border border-white/10 bg-base px-3 py-2 text-sm text-white focus:border-accent focus:outline-none';
}

export function EditForm({ data, onChange }: EditFormProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <label className="block">
        <span className="mb-1 block text-xs text-gray-500">Name</span>
        <input className={inputClass()} value={data.name} onChange={(e) => onChange('name', e.target.value)} />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs text-gray-500">Organization</span>
        <input className={inputClass()} value={data.organization ?? ''} onChange={(e) => onChange('organization', e.target.value)} />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs text-gray-500">Type</span>
        <select className={inputClass()} value={data.type} onChange={(e) => onChange('type', e.target.value)}>
          {OPPORTUNITY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </label>
      <label className="block">
        <span className="mb-1 block text-xs text-gray-500">Status</span>
        <select className={inputClass()} value={data.status} onChange={(e) => onChange('status', e.target.value)}>
          {APP_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </label>
      <label className="block md:col-span-2">
        <span className="mb-1 block text-xs text-gray-500">Description</span>
        <textarea className={inputClass()} rows={3} value={data.description ?? ''} onChange={(e) => onChange('description', e.target.value)} />
      </label>
      <label className="block md:col-span-2">
        <span className="mb-1 block text-xs text-gray-500">Notes</span>
        <textarea className={inputClass()} rows={4} value={data.notes ?? ''} onChange={(e) => onChange('notes', e.target.value)} placeholder="Markdown supported" />
      </label>
    </div>
  );
}
