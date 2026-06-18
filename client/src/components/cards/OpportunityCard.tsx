import { Link } from 'react-router-dom';
import { ExternalLink, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Opportunity, AppStatus } from '../../types/opportunity.types';
import { TYPE_COLORS, APP_STATUSES } from '../../types/opportunity.types';
import { Badge } from '../ui/Badge';
import { CountdownTimer } from '../ui/CountdownTimer';
import { countryFlag, copyToClipboard } from '../../utils/deadlineUtils';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onStatusChange: (id: string, status: AppStatus) => void;
}

const borderColors: Record<string, string> = {
  critical: 'border-l-danger',
  high: 'border-l-orange-500',
  medium: 'border-l-warning',
  low: 'border-l-gray-600',
  none: 'border-l-transparent',
  expired: 'border-l-muted',
};

export function OpportunityCard({ opportunity: opp, onStatusChange }: OpportunityCardProps) {
  const copyLink = async () => {
    if (!opp.applicationLink) return;
    await copyToClipboard(opp.applicationLink);
    toast.success('Link copied');
  };

  return (
    <div className={`rounded-xl border border-white/10 border-l-4 bg-surface p-4 ${borderColors[opp.urgency.level]}`}>
      <div className="mb-2 flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500">{opp.organization}</p>
          <Link to={`/opportunities/${opp.id}`} className="font-display font-semibold text-white hover:text-accent">
            {opp.name}
          </Link>
        </div>
        <Badge className={TYPE_COLORS[opp.type]}>{opp.type}</Badge>
      </div>
      <p className="mb-3 text-sm text-gray-400">
        {opp.countries.slice(0, 3).map((c) => `${countryFlag(c)} ${c}`).join(' · ')}
      </p>
      <div className="mb-3">
        {opp.deadline ? (
          opp.urgency.level === 'expired' ? (
            <span className="font-mono text-sm text-danger line-through">EXPIRED</span>
          ) : (
            <CountdownTimer deadline={opp.deadline} />
          )
        ) : (
          <span className="text-sm text-gray-500">No deadline</span>
        )}
      </div>
      <div className="mb-3 flex flex-wrap gap-2">
        {opp.level && <Badge className="bg-white/5 text-gray-300">{opp.level}</Badge>}
        {opp.funding && <Badge className="bg-accent2/20 text-accent2">{opp.funding}</Badge>}
      </div>
      <div className="flex items-center justify-between gap-2">
        <select
          value={opp.status}
          onChange={(e) => onStatusChange(opp.id, e.target.value as AppStatus)}
          className="rounded border border-white/10 bg-base px-2 py-1 text-xs text-white"
        >
          {APP_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        {opp.applicationLink && (
          <div className="flex items-center gap-2">
            <a
              href={opp.applicationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-accent2 hover:underline"
            >
              Apply Now <ExternalLink className="h-3 w-3" />
            </a>
            <button type="button" onClick={copyLink} className="text-gray-400 hover:text-white">
              <Copy className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
