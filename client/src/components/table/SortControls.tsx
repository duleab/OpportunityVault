import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Select } from '../ui/Select';

interface SortControlsProps {
  sortBy: string;
  sortOrder: string;
  onSortByChange: (v: string) => void;
  onSortOrderChange: (v: string) => void;
}

const SORT_OPTIONS = [
  { value: 'createdAt',    label: 'Date Added'    },
  { value: 'deadline',     label: 'Deadline'      },
  { value: 'name',         label: 'Name'          },
  { value: 'status',       label: 'Status'        },
  { value: 'type',         label: 'Type'          },
  { value: 'countries',    label: 'Countries'     },
  { value: 'daysLeft',     label: 'Days Left'     },
  { value: 'updatedAt',    label: 'Last Updated'  },
];

export function SortControls({ sortBy, sortOrder, onSortByChange, onSortOrderChange }: SortControlsProps) {
  const isDesc = sortOrder === 'desc';

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 text-[#9ca3af]">
        <ArrowUpDown className="h-3.5 w-3.5" />
      </div>
      <Select value={sortBy} onChange={(e) => onSortByChange(e.target.value)} className="w-36">
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </Select>
      <button
        onClick={() => onSortOrderChange(isDesc ? 'asc' : 'desc')}
        title={isDesc ? 'Descending — click for ascending' : 'Ascending — click for descending'}
        className="flex items-center gap-1 rounded-lg border border-[#e5e7eb] bg-white px-2.5 py-2 text-xs font-medium text-[#374151] shadow-sm hover:bg-[#f3f4f6] transition-colors"
      >
        {isDesc
          ? <><ArrowDown className="h-3.5 w-3.5 text-accent" /><span className="hidden sm:inline">Desc</span></>
          : <><ArrowUp   className="h-3.5 w-3.5 text-accent" /><span className="hidden sm:inline">Asc</span></>
        }
      </button>
    </div>
  );
}
