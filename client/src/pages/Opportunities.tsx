import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LayoutGrid, Table, Columns3 } from 'lucide-react';
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

const DEFAULT_COLUMNS = [
  { id: 'index', label: '#', visible: true },
  { id: 'name', label: 'Name', visible: true },
  { id: 'type', label: 'Type', visible: true },
  { id: 'countries', label: 'Countries', visible: true },
  { id: 'deadline', label: 'Deadline', visible: true },
  { id: 'urgency', label: 'Days Left', visible: true },
  { id: 'level', label: 'Level', visible: true },
  { id: 'hasFee', label: 'Fee', visible: true },
  { id: 'status', label: 'Status', visible: true },
  { id: 'actions', label: 'Actions', visible: true },
];

export function Opportunities() {
  const { filters, setFilter, clearFilters, view, setView } = useFilters();
  const opportunities = useOpportunityStore((s) => s.opportunities);
  const { loading, setFilters, updateStatus, remove } = useOpportunities();
  const isMobile = useIsMobile();
  const [columns, setColumns] = useState(DEFAULT_COLUMNS);
  const [showColumns, setShowColumns] = useState(false);

  useEffect(() => {
    setFilters({
      type: filters.type,
      status: filters.status,
      country: filters.country,
      urgency: filters.urgency,
      search: filters.search,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      page: filters.page,
    });
  }, [filters, setFilters]);

  const urgentCount = opportunities.filter((o) => o.urgency.isUrgent).length;
  const isCardView = view === 'card' || isMobile;

  const toggleColumn = (id: string) => {
    setColumns((prev) => prev.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c)));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this opportunity?')) return;
    try {
      await remove(id);
      toast.success('Deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <TableSearch value={filters.search ?? ''} onChange={(v) => setFilter('search', v)} />
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
        <SortControls
          sortBy={filters.sortBy ?? 'deadline'}
          sortOrder={filters.sortOrder ?? 'asc'}
          onSortByChange={(v) => setFilter('sortBy', v)}
          onSortOrderChange={(v) => setFilter('sortOrder', v)}
        />
        <div className="relative ml-auto flex gap-1">
          {!isMobile && (
            <button
              onClick={() => setShowColumns(!showColumns)}
              className={`rounded p-2 ${showColumns ? 'bg-accent/20 text-accent' : 'text-gray-400'}`}
              title="Toggle columns"
            >
              <Columns3 className="h-4 w-4" />
            </button>
          )}
          <button onClick={() => setView('table')} className={`rounded p-2 ${view === 'table' ? 'bg-accent/20 text-accent' : 'text-gray-400'}`}>
            <Table className="h-4 w-4" />
          </button>
          <button onClick={() => setView('card')} className={`rounded p-2 ${view === 'card' ? 'bg-accent/20 text-accent' : 'text-gray-400'}`}>
            <LayoutGrid className="h-4 w-4" />
          </button>
          {showColumns && (
            <div className="absolute right-0 top-10 z-10">
              <ColumnToggle columns={columns} onToggle={toggleColumn} />
            </div>
          )}
        </div>
      </div>

      <UrgentBanner count={urgentCount} onClick={() => setFilter('urgency', 'high')} />

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : opportunities.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-gray-400">No results — clear filters?</p>
          <Button variant="secondary" className="mt-4" onClick={clearFilters}>Clear filters</Button>
          <Link to="/add" className="ml-2"><Button>Add opportunity</Button></Link>
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
          onDelete={handleDelete}
          onStatusChange={updateStatus}
          visibleColumns={columns.filter((c) => c.visible).map((c) => c.id)}
        />
      )}
    </div>
  );
}
