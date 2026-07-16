import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LayoutGrid, Table, Columns3, Plus, Trash2, CheckSquare, X } from 'lucide-react';
import { useOpportunityStore } from '../store/opportunityStore';
import { useOpportunities } from '../hooks/useOpportunities';
import { useFilters } from '../hooks/useFilters';
import { useIsMobile } from '../hooks/useMediaQuery';
import { UrgentBanner } from '../components/cards/UrgentBanner';
import { OpportunityTable } from '../components/table/OpportunityTable';
import { TableSearch } from '../components/table/TableSearch';
import { TableFilters } from '../components/table/TableFilters';
import { SortControls } from '../components/table/SortControls';
import { ColumnToggle } from '../components/table/ColumnToggle';
import { FilterChips } from '../components/table/FilterChips';
import { OpportunityCard } from '../components/cards/OpportunityCard';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Pagination } from '../components/ui/Pagination';
import { bulkUpdateStatus, deleteOpportunity } from '../services/opportunityService';
import { useAuthStore } from '../store/authStore';
import type { AppStatus } from '../types/opportunity.types';
import { APP_STATUSES } from '../types/opportunity.types';

const DEFAULT_COLUMNS = [
  { id: 'select',   label: '☑',         visible: true  },
  { id: 'index',    label: '#',          visible: true  },
  { id: 'name',     label: 'Name',       visible: true  },
  { id: 'type',     label: 'Type',       visible: true  },
  { id: 'countries',label: 'Countries',  visible: true  },
  { id: 'deadline', label: 'Deadline',   visible: true  },
  { id: 'urgency',  label: 'Days Left',  visible: true  },
  { id: 'level',    label: 'Level',      visible: false },
  { id: 'hasFee',   label: 'Fee',        visible: false },
  { id: 'status',   label: 'Status',     visible: true  },
  { id: 'actions',  label: 'Actions',    visible: true  },
];

export function Opportunities() {
  const { filters, setFilter, clearFilters, view, setView } = useFilters();
  const opportunities = useOpportunityStore((s) => s.opportunities);
  const pagination    = useOpportunityStore((s) => s.pagination);
  const { loading, setFilters, updateStatus, remove, reload } = useOpportunities();
  const accessToken = useAuthStore((s) => s.accessToken);
  const isMobile = useIsMobile();
  const [columns, setColumns]         = useState(DEFAULT_COLUMNS);
  const [showColumns, setShowColumns] = useState(false);

  // Batch selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [batchStatus, setBatchStatus] = useState<AppStatus>('APPLIED');
  const [batchLoading, setBatchLoading] = useState(false);

  // Confirm dialog state
  const [confirmOpen, setConfirmOpen]       = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);

  useEffect(() => {
    setFilters({
      type:      filters.type,
      status:    filters.status,
      country:   filters.country,
      urgency:   filters.urgency,
      search:    filters.search,
      sortBy:    filters.sortBy,
      sortOrder: filters.sortOrder,
      page:      filters.page,
      limit:     filters.limit,
    });
    // Clear selection when filters change
    setSelectedIds([]);
  }, [filters, setFilters]);

  const urgentCount = opportunities.filter((o) => o.urgency.isUrgent).length;
  const isCardView  = view === 'card' || isMobile;

  const toggleColumn = (id: string) =>
    setColumns((prev) => prev.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c)));

  // ── Single delete ──
  const requestDelete = (id: string) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId || !accessToken) return;
    setConfirmOpen(false);
    try {
      await remove(pendingDeleteId);
      setSelectedIds((prev) => prev.filter((id) => id !== pendingDeleteId));
      toast.success('Deleted');
    } catch {
      toast.error('Delete failed');
    } finally {
      setPendingDeleteId(null);
    }
  };

  // ── Batch selection ──
  const handleSelectChange = (id: string, checked: boolean) => {
    setSelectedIds((prev) => checked ? [...prev, id] : prev.filter((x) => x !== id));
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? opportunities.map((o) => o.id) : []);
  };

  // ── Batch status update ──
  const handleBulkStatus = async () => {
    if (!accessToken || selectedIds.length === 0) return;
    setBatchLoading(true);
    try {
      await bulkUpdateStatus(accessToken, selectedIds, batchStatus);
      toast.success(`Updated ${selectedIds.length} opportunities to ${batchStatus}`);
      setSelectedIds([]);
      await reload();
    } catch {
      toast.error('Bulk update failed');
    } finally {
      setBatchLoading(false);
    }
  };

  // ── Batch delete ──
  const handleBulkDelete = async () => {
    if (!accessToken || selectedIds.length === 0) return;
    setBulkDeleteConfirm(false);
    setBatchLoading(true);
    try {
      await Promise.all(selectedIds.map((id) => deleteOpportunity(accessToken, id)));
      toast.success(`Deleted ${selectedIds.length} opportunities`);
      setSelectedIds([]);
      await reload();
    } catch {
      toast.error('Bulk delete failed');
    } finally {
      setBatchLoading(false);
    }
  };

  // ── Column sort (server-side) ──
  const handleSort = (field: string) => {
    if (filters.sortBy === field) {
      setFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setFilter('sortBy', field);
      setFilter('sortOrder', 'desc');
    }
  };

  const viewBtnClass = (active: boolean) =>
    `rounded p-1.5 transition-colors ${
      active
        ? 'bg-[#eff6ff] text-accent'
        : 'text-[#9ca3af] hover:text-[#374151] hover:bg-[#f3f4f6]'
    }`;

  const hasActiveFilters = !!(filters.search || filters.type || filters.status || filters.country || filters.urgency);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#111827]">Opportunities</h1>
          {!loading && (
            <p className="text-sm text-[#6b7280] mt-0.5">
              {pagination?.total ?? opportunities.length} total
              {selectedIds.length > 0 && (
                <span className="ml-2 font-medium text-accent">· {selectedIds.length} selected</span>
              )}
            </p>
          )}
        </div>
        <Link to="/add">
          <Button size="sm">
            <Plus className="h-3.5 w-3.5" /> Add New
          </Button>
        </Link>
      </div>

      {/* Toolbar */}
      <div className="card p-3 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <TableSearch value={filters.search ?? ''} onChange={(v) => setFilter('search', v)} />

          <div className="flex items-center gap-1.5">
            <TableFilters
              type={filters.type ?? ''}
              status={filters.status ?? ''}
              country={filters.country ?? ''}
              urgency={filters.urgency ?? ''}
              onTypeChange={(v) => setFilter('type', v)}
              onStatusChange={(v) => setFilter('status', v)}
              onCountryChange={(v) => setFilter('country', v)}
              onUrgencyChange={(v) => setFilter('urgency', v)}
            />
          </div>

          <SortControls
            sortBy={filters.sortBy ?? 'createdAt'}
            sortOrder={filters.sortOrder ?? 'desc'}
            onSortByChange={(v) => setFilter('sortBy', v)}
            onSortOrderChange={(v) => setFilter('sortOrder', v)}
          />

          {/* View + columns */}
          <div className="relative ml-auto flex items-center gap-1">
            {!isMobile && (
              <button
                onClick={() => setShowColumns(!showColumns)}
                className={viewBtnClass(showColumns)}
                title="Toggle columns"
              >
                <Columns3 className="h-4 w-4" />
              </button>
            )}
            <button onClick={() => setView('table')} className={viewBtnClass(view === 'table')} title="Table view">
              <Table className="h-4 w-4" />
            </button>
            <button onClick={() => setView('card')} className={viewBtnClass(view === 'card')} title="Card view">
              <LayoutGrid className="h-4 w-4" />
            </button>

            {showColumns && (
              <div className="absolute right-0 top-9 z-20">
                <ColumnToggle columns={columns} onToggle={toggleColumn} />
              </div>
            )}
          </div>
        </div>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <FilterChips
            type={filters.type ?? ''}
            status={filters.status ?? ''}
            country={filters.country ?? ''}
            urgency={filters.urgency ?? ''}
            search={filters.search ?? ''}
            sortBy={filters.sortBy ?? ''}
            sortOrder={filters.sortOrder ?? ''}
            onClear={(key) => setFilter(key, '')}
            onClearAll={clearFilters}
          />
        )}
      </div>

      {/* Batch Action Bar */}
      {selectedIds.length > 0 && (
        <div className="card border-accent/30 bg-accent/5 p-3 animate-fade-in">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-accent" />
              <span className="text-sm font-semibold text-accent">
                {selectedIds.length} selected
              </span>
            </div>

            {/* Bulk status */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#6b7280]">Set status:</span>
              <select
                value={batchStatus}
                onChange={(e) => setBatchStatus(e.target.value as AppStatus)}
                className="rounded border border-[#e5e7eb] bg-white px-2 py-1 text-xs text-[#111827] shadow-sm"
              >
                {APP_STATUSES.map((s) => <option key={s} value={s}>{s.toLowerCase().replace(/_/g, ' ')}</option>)}
              </select>
              <Button size="sm" onClick={handleBulkStatus} disabled={batchLoading}>
                Apply
              </Button>
            </div>

            {/* Bulk delete */}
            <button
              onClick={() => setBulkDeleteConfirm(true)}
              disabled={batchLoading}
              className="ml-auto flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-danger hover:bg-red-100 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete selected
            </button>

            {/* Clear selection */}
            <button
              onClick={() => setSelectedIds([])}
              className="rounded p-1 text-[#9ca3af] hover:text-[#374151] hover:bg-[#f3f4f6] transition-colors"
              title="Clear selection"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <UrgentBanner count={urgentCount} onClick={() => setFilter('urgency', 'critical')} />

      {/* Content */}
      {loading ? (
        <div className="card p-6">
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-4 w-6 rounded bg-[#f3f4f6] animate-pulse" />
                <div className="h-4 flex-1 rounded bg-[#f3f4f6] animate-pulse" />
                <div className="h-4 w-24 rounded bg-[#f3f4f6] animate-pulse" />
                <div className="h-4 w-20 rounded bg-[#f3f4f6] animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      ) : opportunities.length === 0 ? (
        <div className="card py-20 text-center">
          <p className="text-[#9ca3af] mb-4">No results — try clearing your filters</p>
          <div className="flex items-center justify-center gap-3">
            <Button variant="secondary" size="sm" onClick={clearFilters}>
              Clear filters
            </Button>
            <Link to="/add">
              <Button size="sm">
                <Plus className="h-3.5 w-3.5" /> Add opportunity
              </Button>
            </Link>
          </div>
        </div>
      ) : isCardView ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {opportunities.map((o) => (
            <OpportunityCard key={o.id} opportunity={o} onStatusChange={updateStatus} />
          ))}
        </div>
      ) : (
        <OpportunityTable
          data={opportunities}
          onDelete={requestDelete}
          onStatusChange={updateStatus}
          visibleColumns={columns.filter((c) => c.visible).map((c) => c.id)}
          selectedIds={selectedIds}
          onSelectChange={handleSelectChange}
          onSelectAll={handleSelectAll}
          sortBy={filters.sortBy}
          sortOrder={filters.sortOrder}
          onSort={handleSort}
        />
      )}

      {/* Pagination */}
      {pagination && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={(p) => setFilter('page', String(p))}
          onLimitChange={(l) => setFilter('limit', String(l))}
        />
      )}

      {/* Single-delete confirm dialog */}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Opportunity"
        message="Are you sure you want to permanently delete this opportunity? This cannot be undone."
        confirmLabel="Yes, delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setPendingDeleteId(null);
        }}
      />

      {/* Bulk-delete confirm dialog */}
      <ConfirmDialog
        open={bulkDeleteConfirm}
        title={`Delete ${selectedIds.length} Opportunities`}
        message={`Are you sure you want to permanently delete all ${selectedIds.length} selected opportunities? This cannot be undone.`}
        confirmLabel={`Delete ${selectedIds.length}`}
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleBulkDelete}
        onCancel={() => setBulkDeleteConfirm(false)}
      />
    </div>
  );
}
