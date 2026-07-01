import { Link } from 'react-router-dom';
import {
  useReactTable, getCoreRowModel, flexRender, createColumnHelper,
} from '@tanstack/react-table';
import { Eye, Pencil, Trash2, ExternalLink } from 'lucide-react';
import type { Opportunity, AppStatus } from '../../types/opportunity.types';
import { TYPE_COLORS, APP_STATUSES } from '../../types/opportunity.types';
import { DateDisplay } from '../ui/DateDisplay';
import { Badge } from '../ui/Badge';
import { countryFlag } from '../../utils/deadlineUtils';

interface OpportunityTableProps {
  data: Opportunity[];
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: AppStatus) => void;
  visibleColumns?: string[];
}

const columnHelper = createColumnHelper<Opportunity>();

export function OpportunityTable({
  data,
  onDelete,
  onStatusChange,
  visibleColumns,
}: OpportunityTableProps) {
  const allColumns = [
    columnHelper.display({
      id: 'index',
      header: '#',
      cell: (info) => <span className="font-mono text-gray-500">{info.row.index + 1}</span>,
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (info) => (
        <div>
          <Link to={`/opportunities/${info.row.original.id}`} className="font-medium text-[#111827] hover:text-accent">
            {info.getValue()}
          </Link>
          {info.row.original.organization && (
            <p className="text-xs text-gray-500">{info.row.original.organization}</p>
          )}
        </div>
      ),
    }),
    columnHelper.accessor('type', {
      header: 'Type',
      cell: (info) => <Badge className={TYPE_COLORS[info.getValue()]}>{info.getValue()}</Badge>,
    }),
    columnHelper.accessor('countries', {
      header: 'Countries',
      cell: (info) => {
        const countries = info.getValue();
        const shown = countries.slice(0, 2);
        return (
          <span className="text-sm text-[#374151]">
            {shown.map((c) => `${countryFlag(c)} ${c}`).join(', ')}
            {countries.length > 2 && ` +${countries.length - 2} more`}
            {countries.length === 0 && '—'}
          </span>
        );
      },
    }),
    columnHelper.accessor('deadline', {
      header: 'Deadline',
      cell: (info) => (
        <DateDisplay iso={info.getValue()} expired={info.row.original.urgency.level === 'expired'} />
      ),
    }),
    columnHelper.accessor('urgency', {
      header: 'Days Left',
      cell: (info) => {
        const u = info.getValue();
        if (u.level === 'none') return <span className="text-gray-500">—</span>;
        const colors: Record<string, string> = {
          critical: 'bg-danger/20 text-red-600',
          high: 'bg-orange-500/20 text-orange-600',
          medium: 'bg-warning/20 text-warning',
          low: 'bg-gray-100 text-gray-600',
          expired: 'bg-danger/20 text-red-600',
        };
        return <Badge className={colors[u.level] ?? ''}>{u.label}</Badge>;
      },
    }),
    columnHelper.accessor('level', {
      header: 'Level',
      cell: (info) => <span className="text-sm capitalize text-[#374151]">{info.getValue() ?? '—'}</span>,
    }),
    columnHelper.accessor('funding', {
      header: 'Funding',
      cell: (info) => <span className="font-mono text-xs text-[#374151]">{info.getValue() || '—'}</span>,
    }),
    columnHelper.accessor('isRemote', {
      header: 'Remote',
      cell: (info) => (info.getValue() ? <span className="text-success text-xs font-medium">Yes</span> : <span className="text-gray-400 text-xs">No</span>),
    }),
    columnHelper.accessor('isOnline', {
      header: 'Online',
      cell: (info) => (info.getValue() ? <span className="text-success text-xs font-medium">Yes</span> : <span className="text-gray-400 text-xs">No</span>),
    }),
    columnHelper.accessor('hasFee', {
      header: 'Fee',
      cell: (info) =>
        info.getValue() ? (
          <span className="text-warning text-xs font-medium">${info.row.original.feeAmount ?? 'Paid'}</span>
        ) : (
          <span className="text-success text-xs font-medium">✓ Free</span>
        ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => (
        <select
          value={info.getValue()}
          onChange={(e) => onStatusChange(info.row.original.id, e.target.value as AppStatus)}
          className="rounded border border-[#e5e7eb] bg-white px-2 py-1 text-xs text-[#111827] shadow-sm"
        >
          {APP_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => {
        const opp = info.row.original;
        return (
          <div className="flex items-center gap-1">
            <Link to={`/opportunities/${opp.id}`} className="rounded p-1 text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#111827]"><Eye className="h-4 w-4" /></Link>
            <Link to={`/opportunities/${opp.id}?edit=1`} className="rounded p-1 text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#111827]"><Pencil className="h-4 w-4" /></Link>
            <button onClick={() => onDelete(opp.id)} className="rounded p-1 text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#111827]"><Trash2 className="h-4 w-4 text-danger" /></button>
            {opp.applicationLink && (
              <a href={opp.applicationLink} target="_blank" rel="noopener noreferrer" className="rounded p-1 text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#111827]">
                <ExternalLink className="h-4 w-4 text-accent" />
              </a>
            )}
          </div>
        );
      },
    }),
  ];

  const columns = visibleColumns
    ? allColumns.filter((col) => visibleColumns.includes(getColumnId(col as ColumnIdSource)))
    : allColumns;

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="hidden overflow-x-auto rounded-xl border border-[#e5e7eb] bg-white shadow-sm md:block">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-[#e5e7eb] bg-[#f9fafb]">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => (
                <th key={h.id} className="px-4 py-3 font-semibold text-[#6b7280]">
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b border-[#e5e7eb] hover:bg-[#f3f4f6]/50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface ColumnIdSource {
  id?: string;
  accessorKey?: string | number;
}

function getColumnId(col: ColumnIdSource): string {
  if (col.id) return col.id;
  if (col.accessorKey !== undefined) return String(col.accessorKey);
  return '';
}
