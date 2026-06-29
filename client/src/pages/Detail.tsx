import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ChevronLeft } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { fetchOpportunity, updateOpportunity, deleteOpportunity } from '../services/opportunityService';
import { OpportunityDetail } from '../components/detail/OpportunityDetail';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import type { Opportunity, AppStatus } from '../types/opportunity.types';

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-5 animate-pulse">
      {/* Back link skeleton */}
      <div className="h-4 w-24 rounded bg-[#f3f4f6]" />

      {/* Header card */}
      <div className="card p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="h-6 w-2/3 rounded bg-[#f3f4f6]" />
            <div className="h-4 w-1/3 rounded bg-[#f3f4f6]" />
          </div>
          <div className="h-8 w-24 rounded bg-[#f3f4f6]" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-20 rounded bg-[#f3f4f6]" />
          <div className="h-6 w-16 rounded bg-[#f3f4f6]" />
          <div className="h-6 w-16 rounded bg-[#f3f4f6]" />
        </div>
      </div>

      {/* Details card */}
      <div className="card p-6 space-y-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="h-4 w-24 rounded bg-[#f3f4f6]" />
            <div className="h-4 flex-1 rounded bg-[#f3f4f6]" />
          </div>
        ))}
      </div>

      {/* Description card */}
      <div className="card p-6 space-y-3">
        <div className="h-4 w-32 rounded bg-[#f3f4f6]" />
        <div className="h-3 w-full rounded bg-[#f3f4f6]" />
        <div className="h-3 w-5/6 rounded bg-[#f3f4f6]" />
        <div className="h-3 w-4/6 rounded bg-[#f3f4f6]" />
      </div>
    </div>
  );
}

export function Detail() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const accessToken = useAuthStore((s) => s.accessToken);
  const [opp, setOpp]         = useState<Opportunity | null>(null);
  const [loadingOpp, setLoadingOpp] = useState(true);
  const [editing, setEditing] = useState(searchParams.get('edit') === '1');
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!accessToken || !id) return;
    setLoadingOpp(true);
    fetchOpportunity(accessToken, id)
      .then((res) => setOpp(res.opportunity))
      .catch(() => {
        toast.error('Opportunity not found');
        navigate('/opportunities');
      })
      .finally(() => setLoadingOpp(false));
  }, [accessToken, id, navigate]);

  const handleSave = async (data: Partial<Opportunity>) => {
    if (!accessToken || !opp) return;
    try {
      const res = await updateOpportunity(accessToken, opp.id, data);
      setOpp(res.opportunity);
      toast.success('Saved');
    } catch {
      toast.error('Save failed');
    }
  };

  const handleStatus = async (status: AppStatus) => {
    if (!accessToken || !opp) return;
    const res = await updateOpportunity(accessToken, opp.id, { status });
    setOpp(res.opportunity);
    toast.success(`Status updated to ${status}`);
  };

  const handleDelete = async () => {
    if (!accessToken || !opp) return;
    try {
      await deleteOpportunity(accessToken, opp.id);
      toast.success('Deleted');
      navigate('/opportunities');
    } catch {
      toast.error('Delete failed');
    }
  };

  if (loadingOpp) return <DetailSkeleton />;
  if (!opp) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {/* Back nav */}
      <Link
        to="/opportunities"
        className="flex items-center gap-1 text-sm text-[#6b7280] hover:text-[#111827] transition-colors w-fit"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Opportunities
      </Link>

      {/* Detail card */}
      <div className="card p-6 md:p-8">
        <OpportunityDetail
          opportunity={opp}
          editing={editing}
          onEdit={setEditing}
          onSave={handleSave}
          onDelete={() => setConfirmOpen(true)}
          onStatusChange={handleStatus}
        />
      </div>

      {/* Confirm delete */}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Opportunity"
        message={`Permanently delete "${opp.name}"? This cannot be undone.`}
        confirmLabel="Yes, delete"
        variant="danger"
        onConfirm={() => {
          setConfirmOpen(false);
          void handleDelete();
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
