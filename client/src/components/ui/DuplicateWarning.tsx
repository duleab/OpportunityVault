import { AlertCircle, ExternalLink, RefreshCcw, PlusCircle, X } from 'lucide-react';
import { format } from 'date-fns';

export interface DuplicateMatch {
  id: string;
  name: string;
  status: string;
  createdAt: string;
}

interface DuplicateWarningProps {
  match: DuplicateMatch;
  onUpdateExisting: (id: string) => void;
  onSaveAsNew: () => void;
  onDiscard: () => void;
}

export function DuplicateWarning({
  match,
  onUpdateExisting,
  onSaveAsNew,
  onDiscard,
}: DuplicateWarningProps) {
  return (
    <div className="rounded-lg border border-[#fde68a] bg-[#fffbeb] p-4">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          <AlertCircle className="h-5 w-5 text-[#d97706]" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#92400e]">Possible duplicate detected</p>
          <p className="mt-1 text-sm text-[#78350f] leading-relaxed">
            <span className="font-medium">"{match.name}"</span> already exists in your vault
            {match.createdAt && (
              <span className="text-[#92400e]">
                {' '}(saved {format(new Date(match.createdAt), 'MMM d, yyyy')}, status:{' '}
                <span className="font-medium">{match.status}</span>)
              </span>
            )}
            . What would you like to do?
          </p>

          {/* Actions */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              onClick={() => onUpdateExisting(match.id)}
              className="inline-flex items-center gap-1.5 rounded border border-[#fde68a] bg-white px-3 py-1.5 text-xs font-medium text-[#92400e] hover:bg-[#fffbeb] transition-colors"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
              Update existing
            </button>
            <button
              onClick={onSaveAsNew}
              className="inline-flex items-center gap-1.5 rounded border border-[#fde68a] bg-white px-3 py-1.5 text-xs font-medium text-[#92400e] hover:bg-[#fffbeb] transition-colors"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              Save as new
            </button>
            <a
              href={`/opportunities/${match.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded border border-[#fde68a] bg-white px-3 py-1.5 text-xs font-medium text-[#92400e] hover:bg-[#fffbeb] transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View existing
            </a>
            <button
              onClick={onDiscard}
              className="inline-flex items-center gap-1.5 rounded border border-transparent px-3 py-1.5 text-xs font-medium text-[#9ca3af] hover:text-[#374151] hover:bg-white transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Discard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
