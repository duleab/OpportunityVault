import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { fetchOpportunity, updateOpportunity, deleteOpportunity } from '../services/opportunityService';
import { OpportunityDetail } from '../components/detail/OpportunityDetail';
import type { Opportunity, AppStatus } from '../types/opportunity.types';

export function Detail() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const accessToken = useAuthStore((s) => s.accessToken);
  const [opp, setOpp] = useState<Opportunity | null>(null);
  const [editing, setEditing] = useState(searchParams.get('edit') === '1');

  useEffect(() => {
    if (!accessToken || !id) return;
    fetchOpportunity(accessToken, id)
      .then((res) => setOpp(res.opportunity))
      .catch(() => toast.error('Not found'));
  }, [accessToken, id]);

  if (!opp) return <p className="text-gray-400">Loading...</p>;

  const handleSave = async (data: Partial<Opportunity>) => {
    if (!accessToken) return;
    try {
      const res = await updateOpportunity(accessToken, opp.id, data);
      setOpp(res.opportunity);
      toast.success('Saved');
    } catch {
      toast.error('Save failed');
    }
  };

  const handleStatus = async (status: AppStatus) => {
    if (!accessToken) return;
    const res = await updateOpportunity(accessToken, opp.id, { status });
    setOpp(res.opportunity);
    toast.success(`Status: ${status}`);
  };

  const handleDelete = async () => {
    if (!accessToken || !confirm('Delete permanently?')) return;
    await deleteOpportunity(accessToken, opp.id);
    toast.success('Deleted');
    navigate('/opportunities');
  };

  return (
    <div className="mx-auto max-w-3xl rounded-xl border border-white/10 bg-surface p-6 md:p-8">
      <OpportunityDetail
        opportunity={opp}
        editing={editing}
        onEdit={setEditing}
        onSave={handleSave}
        onDelete={handleDelete}
        onStatusChange={handleStatus}
      />
    </div>
  );
}
