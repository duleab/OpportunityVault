import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LayoutGrid, Table, Columns3, Plus, Filter } from 'lucide-react';
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
import { OpportunityCard } from '../components/cards/OpportunityCard';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Pagination } from '../components/ui/Pagination';

const DEFAULT_COLUMNS = [
  { id: 'index',    label: '#',         visible: true  },
  { id: 'name',     label: 'Name',      visible: true  },
  { id: 'type',     label: 'Type',      visible: true  },
  { id: 'countries',label: 'Countries', visible: true  },
  { id: 'deadline', label: 'Deadline',  visible: true  },
  { id: 'urgency',  label: 'Days Left', visible: true  },
  { id: 'level',    label: 'Level',     visible: false },
  { id: 'hasFee',   label: 'Fee',       visible: false },
  { id: 'status',   label: 'Status',    visible: true  },
  { id: 'actions',  label: 'Actions',   visible: true  },
];

export function Opportunities() {
  const { filters, setFilter, clearFilters, view, setView } = useFilters();
  const opportunities = useOpportunityStore((s) => s.opportunities);
  const pagination    = useOpportunityStore((s) => s.pagination);
  const { loading, setFilters, updateStatus, remove } = useOpportunities();
  const isMobile = useIsMobile();
  const [columns, setColumns]         = useState(DEFAULT_COLUMNS);
  const [showColumns, setShowColumns] = useState(false);

  // Confirm dialog state
  const [confirmOpen, setConfirmOpen]       = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

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
    });
  }, [filters, setFilters]);

  const urgentCount = opportunities.filter((o) => o.urgency.isUrgent).length;
  const isCardView  = view === 'card' || isMobile;

  const toggleColumn = (id: string) =>
    setColumns((prev) => prev.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c)));

  const requestDelete = (id: string) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    setConfirmOpen(false);
    try {
      await remove(pendingDeleteId);
      toast.success('Deleted');
    } catch {
      toast.error('Delete failed');
    } finally {
      setPendingDeleteId(null);
    }
  };

  const viewBtnClass = (active: boolean) =>
    `rounded p-1.5 transition-colors ${
      active
        ? 'bg-[#eff6ff] text-accent'
        : 'text-[#9ca3af] hover:text-[#374151] hover:bg-[#f3f4f6]'
    }`;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#111827]">Opportunities</h1>
          {!loading && (
            <p className="text-sm text-[#6b7280] mt-0.5">
              {pagination?.total ?? opportunities.length} total
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
      <div className="card p-3">
        <div className="flex flex-wrap items-center gap-2">
          <TableSearch value={filters.search ?? ''} onChange={(v) => setFilter('search', v)} />

          <div className="flex items-center gap-1.5">
            <Filter className="h-4 w-4 text-[#9ca3af]" />
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
            sortBy={filters.sortBy ?? 'deadline'}
            sortOrder={filters.sortOrder ?? 'asc'}
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
      </div>

      <UrgentBanner count={urgentCount} onClick={() => setFilter('urgency', 'high')} />

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
        />
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={(p) => setFilter('page', String(p))}
        />
      )}

      {/* Delete confirm dialog */}
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
    </div>
  );
}
