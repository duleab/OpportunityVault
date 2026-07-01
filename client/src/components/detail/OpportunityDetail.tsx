import { useState } from 'react';
import { Copy, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Opportunity, AppStatus } from '../../types/opportunity.types';
import { TYPE_COLORS } from '../../types/opportunity.types';
import { copyToClipboard, formatDeadline } from '../../utils/deadlineUtils';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { CountdownTimer } from '../ui/CountdownTimer';
import { StatusUpdater } from './StatusUpdater';
import { EditForm } from './EditForm';
import { StatusTimeline } from './StatusTimeline';

interface OpportunityDetailProps {
  opportunity: Opportunity;
  editing: boolean;
  onEdit: (editing: boolean) => void;
  onSave: (data: Partial<Opportunity>) => void;
  onDelete: () => void;
  onStatusChange: (status: AppStatus) => void;
}

export function OpportunityDetail({
  opportunity: opp,
  editing,
  onEdit,
  onSave,
  onDelete,
  onStatusChange,
}: OpportunityDetailProps) {
  const [form, setForm] = useState(opp);
  const [showRaw, setShowRaw] = useState(false);

  const copyLink = async (url: string) => {
    await copyToClipboard(url);
    toast.success('Link copied');
  };

  const updateField = (field: keyof Opportunity, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge className={TYPE_COLORS[opp.type]}>{opp.type}</Badge>
          <h2 className="mt-2 font-display text-2xl font-bold text-[#111827]">{opp.name}</h2>
          {opp.organization && <p className="text-[#6b7280]">{opp.organization}</p>}
        </div>
        {['applied', 'accepted', 'rejected', 'withdrawn', 'skipped'].includes(opp.urgency.level) ? (
          <Badge className={opp.urgency.level === 'applied' || opp.urgency.level === 'accepted' ? 'bg-emerald-100 text-emerald-800 text-sm font-medium px-3 py-1' : 'bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1'}>{opp.urgency.label}</Badge>
        ) : opp.deadline && opp.urgency.level !== 'expired' ? (
          <CountdownTimer deadline={opp.deadline} />
        ) : null}
      </div>

      {editing ? (
        <>
          <EditForm data={form} onChange={updateField} />
          <div className="flex gap-3">
            <Button onClick={() => { onSave(form); onEdit(false); }}>Save Changes</Button>
            <Button variant="ghost" onClick={() => onEdit(false)}>Cancel</Button>
          </div>
        </>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <Info label="Deadline" value={formatDeadline(opp.deadline)} />
            <Info label="Level" value={opp.level ?? '—'} />
            <Info label="Field" value={opp.field ?? '—'} />
            <Info label="Funding" value={opp.funding ?? '—'} />
            <Info label="Countries" value={opp.countries.join(', ') || '—'} />
            <Info label="Language" value={opp.languageReq ?? '—'} />
          </div>
          {opp.description && <p className="text-[#374151]">{opp.description}</p>}
          {opp.eligibility && (
            <div>
              <h4 className="mb-1 text-sm font-medium text-[#6b7280]">Eligibility</h4>
              <p className="text-[#374151]">{opp.eligibility}</p>
            </div>
          )}
          {opp.notes && (
            <div>
              <h4 className="mb-1 text-sm font-medium text-[#6b7280]">Notes</h4>
              <p className="whitespace-pre-wrap text-[#374151]">{opp.notes}</p>
            </div>
          )}
          <StatusUpdater status={opp.status} onChange={onStatusChange} />
          <StatusTimeline opportunity={opp} />
        </>
      )}

      <div className="flex flex-wrap gap-3">
        {opp.applicationLink && (
          <>
            <a href={opp.applicationLink} target="_blank" rel="noopener noreferrer">
              <Button>Apply Now → <ExternalLink className="h-4 w-4" /></Button>
            </a>
            <Button variant="secondary" onClick={() => copyLink(opp.applicationLink!)}>
              <Copy className="h-4 w-4" /> Copy Link
            </Button>
          </>
        )}
        <Button variant="secondary" onClick={() => onEdit(true)}>Edit</Button>
        <Button variant="danger" onClick={onDelete}>Delete</Button>
      </div>

      <div className="rounded-lg border border-[#e5e7eb] bg-[#f9fafb]">
        <button
          onClick={() => setShowRaw(!showRaw)}
          className="flex w-full items-center justify-between px-4 py-3 text-sm text-[#6b7280] hover:bg-[#f3f4f6]"
        >
          View raw AI extraction
          {showRaw ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {showRaw && (
          <pre className="max-h-64 overflow-auto border-t border-[#e5e7eb] p-4 font-mono text-xs text-[#6b7280]">
            {JSON.stringify(opp.aiExtractedData, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-[#6b7280]">{label}</p>
      <p className="font-mono text-sm text-[#111827] font-medium">{value}</p>
    </div>
  );
}
