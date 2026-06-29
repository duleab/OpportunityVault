import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ChevronLeft } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { saveExtracted } from '../services/opportunityService';
import { Button } from '../components/ui/Button';

const TYPES = [
  'SCHOLARSHIP', 'FELLOWSHIP', 'GRANT', 'JOB', 'INTERNSHIP',
  'RESEARCH', 'SUMMER_PROGRAM', 'COMPETITION', 'CONFERENCE',
  'VOLUNTEER', 'EXCHANGE', 'TRAINING', 'OTHER',
];
const STATUSES = ['SAVED', 'PLANNING', 'IN_PROGRESS', 'APPLIED', 'INTERVIEW', 'ACCEPTED', 'REJECTED', 'WITHDRAWN', 'SKIPPED', 'EXPIRED'];

const labelClass = 'block text-sm font-medium text-[#374151] mb-1.5';

export function AddManual() {
  const navigate = useNavigate();
  const accessToken = useAuthStore((s) => s.accessToken);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '',
    organization: '',
    type: 'SCHOLARSHIP',
    status: 'SAVED',
    description: '',
    deadline: '',
    startDate: '',
    applicationLink: '',
    websiteUrl: '',
    funding: '',
    hasFee: false,
    feeAmount: '',
    isRemote: false,
    isOnline: false,
    level: '',
    field: '',
    countries: '',
    duration: '',
    eligibility: '',
    languageReq: '',
    notes: '',
  });

  const setField = (key: keyof typeof form, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Name is required');
    if (!accessToken) return;

    setSaving(true);
    try {
      await saveExtracted(accessToken, {
        name: form.name.trim(),
        organization: form.organization || null,
        type: form.type as never,
        description: form.description || null,
        deadline: form.deadline || null,
        startDate: form.startDate || null,
        applicationLink: form.applicationLink || null,
        websiteUrl: form.websiteUrl || null,
        funding: form.funding || null,
        hasFee: form.hasFee,
        feeAmount: form.feeAmount || null,
        isRemote: form.isRemote,
        isOnline: form.isOnline,
        level: form.level || null,
        field: form.field || null,
        countries: form.countries ? form.countries.split(',').map((c) => c.trim()).filter(Boolean) : [],
        duration: form.duration || null,
        eligibility: form.eligibility || null,
        languageReq: form.languageReq || null,
        requirements: [],
        sourceUrl: null,
        confidence: 1,
      }, `Manually added: ${form.name}`);

      toast.success('✅ Opportunity added!');
      navigate('/opportunities');
    } catch {
      toast.error('Failed to save opportunity');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Link
          to="/add"
          className="flex items-center gap-1 text-sm text-[#6b7280] hover:text-[#111827] transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to AI Add
        </Link>
        <span className="text-[#d1d5db]">/</span>
        <h1 className="text-xl font-bold text-[#111827]">Add Manually</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Core info */}
        <div className="card p-6 space-y-4">
          <h2 className="text-sm font-semibold text-[#111827] border-b border-[#e5e7eb] pb-3">
            Core Information
          </h2>

          <div>
            <label className={labelClass}>
              Opportunity Name <span className="text-[#dc2626]">*</span>
            </label>
            <input
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
              placeholder="e.g. DAAD MIDE Scholarship 2026"
              className="input-base"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Organization</label>
              <input
                value={form.organization}
                onChange={(e) => setField('organization', e.target.value)}
                placeholder="e.g. HTW Berlin"
                className="input-base"
              />
            </div>
            <div>
              <label className={labelClass}>Type</label>
              <select
                value={form.type}
                onChange={(e) => setField('type', e.target.value)}
                className="input-base"
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>{t.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
              placeholder="Brief description of the opportunity…"
              className="input-base min-h-[100px] resize-none"
            />
          </div>
        </div>

        {/* Dates & Links */}
        <div className="card p-6 space-y-4">
          <h2 className="text-sm font-semibold text-[#111827] border-b border-[#e5e7eb] pb-3">
            Dates & Links
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Deadline</label>
              <input
                type="date"
                value={form.deadline}
                onChange={(e) => setField('deadline', e.target.value)}
                className="input-base"
              />
            </div>
            <div>
              <label className={labelClass}>Start Date</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setField('startDate', e.target.value)}
                className="input-base"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Application Link</label>
            <input
              type="url"
              value={form.applicationLink}
              onChange={(e) => setField('applicationLink', e.target.value)}
              placeholder="https://…"
              className="input-base"
            />
          </div>

          <div>
            <label className={labelClass}>Website / Source URL</label>
            <input
              type="url"
              value={form.websiteUrl}
              onChange={(e) => setField('websiteUrl', e.target.value)}
              placeholder="https://…"
              className="input-base"
            />
          </div>
        </div>

        {/* Details */}
        <div className="card p-6 space-y-4">
          <h2 className="text-sm font-semibold text-[#111827] border-b border-[#e5e7eb] pb-3">
            Details
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Level</label>
              <input
                value={form.level}
                onChange={(e) => setField('level', e.target.value)}
                placeholder="e.g. Master's, PhD, Undergraduate"
                className="input-base"
              />
            </div>
            <div>
              <label className={labelClass}>Field</label>
              <input
                value={form.field}
                onChange={(e) => setField('field', e.target.value)}
                placeholder="e.g. Engineering, Arts, Sciences"
                className="input-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Countries</label>
              <input
                value={form.countries}
                onChange={(e) => setField('countries', e.target.value)}
                placeholder="Germany, USA (comma separated)"
                className="input-base"
              />
            </div>
            <div>
              <label className={labelClass}>Duration</label>
              <input
                value={form.duration}
                onChange={(e) => setField('duration', e.target.value)}
                placeholder="e.g. 12 months, 6 weeks"
                className="input-base"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Funding / Award</label>
            <input
              value={form.funding}
              onChange={(e) => setField('funding', e.target.value)}
              placeholder="e.g. €992/month + tuition"
              className="input-base"
            />
          </div>

          <div>
            <label className={labelClass}>Eligibility</label>
            <textarea
              value={form.eligibility}
              onChange={(e) => setField('eligibility', e.target.value)}
              placeholder="Who is eligible…"
              className="input-base min-h-[80px] resize-none"
            />
          </div>

          <div>
            <label className={labelClass}>Language Requirement</label>
            <input
              value={form.languageReq}
              onChange={(e) => setField('languageReq', e.target.value)}
              placeholder="e.g. IELTS 6.5, TOEFL 90"
              className="input-base"
            />
          </div>

          {/* Checkboxes */}
          <div className="flex flex-wrap gap-5 pt-1">
            {[
              { key: 'isRemote', label: 'Remote' },
              { key: 'isOnline', label: 'Online' },
              { key: 'hasFee',   label: 'Has Application Fee' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer text-sm text-[#374151]">
                <input
                  type="checkbox"
                  checked={form[key as keyof typeof form] as boolean}
                  onChange={(e) => setField(key as keyof typeof form, e.target.checked)}
                  className="rounded border-[#d1d5db] text-accent focus:ring-accent"
                />
                {label}
              </label>
            ))}
          </div>

          {form.hasFee && (
            <div>
              <label className={labelClass}>Fee Amount</label>
              <input
                value={form.feeAmount}
                onChange={(e) => setField('feeAmount', e.target.value)}
                placeholder="e.g. $50 USD"
                className="input-base"
              />
            </div>
          )}
        </div>

        {/* Status & Notes */}
        <div className="card p-6 space-y-4">
          <h2 className="text-sm font-semibold text-[#111827] border-b border-[#e5e7eb] pb-3">
            Status & Notes
          </h2>

          <div>
            <label className={labelClass}>Status</label>
            <select
              value={form.status}
              onChange={(e) => setField('status', e.target.value)}
              className="input-base"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Personal Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setField('notes', e.target.value)}
              placeholder="Your personal notes about this opportunity…"
              className="input-base min-h-[80px] resize-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Link
            to="/add"
            className="text-sm text-[#9ca3af] hover:text-[#374151] transition-colors"
          >
            ← Back to AI Add
          </Link>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/opportunities')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save Opportunity'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
